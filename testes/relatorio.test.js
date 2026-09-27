import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calcularResultado, PARES_MOTIVACAO, MAPA_EMOCOES, NOMES_ESTILO, NOMES_DOMINIO,
} from '../src/motor.js';
import {
  montarRelatorio, escaparHtml, acoesDoPlano, perguntasDaConversa, montarResumoCompartilhado,
} from '../src/relatorio.js';

function resultadoDeExemplo(extras = {}) {
  return calcularResultado({
    nome: 'Maria',
    contexto: 'Analista de RH',
    a1: Array.from({ length: 12 }, () => ({ mais: 'E', menos: 'A' })),
    a2: Array.from({ length: 6 }, () => ({ mais: 'A', menos: 'E' })),
    conflito: Array.from({ length: 6 }, () => ({ mais: 'COM', menos: 'CED' })),
    b: PARES_MOTIVACAO.map(([a, b]) => (a === 'PRO' || b === 'PRO' ? 'PRO' : a)),
    emocoes: MAPA_EMOCOES.map((m, i) => (i === 3 || i === 7 ? 2 : 4)),
    c: [5, 5, 1, 1, 1],
    ...extras,
  });
}

test('o relatorio tem resumo, parte 1 e parte 2 em pagina nova', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  const iResumo = html.indexOf('id="resumo"');
  const iP1 = html.indexOf('id="parte1"');
  const iQuebra = html.indexOf('class="quebra-pagina"');
  const iP2 = html.indexOf('id="parte2"');
  assert.ok(iResumo > -1 && iResumo < iP1 && iP1 < iQuebra && iQuebra < iP2);
  for (const titulo of ['Seu perfil', 'Diante de conflito', 'Como você lida com emoções', 'Plano de desenvolvimento', 'Leia com cuidado']) {
    assert.ok(html.slice(iP1, iQuebra).includes(titulo), `parte 1 sem: ${titulo}`);
  }
  for (const titulo of ['Em uma frase', 'Como se comunicar', 'Como dar retorno', 'Como delegar', 'Em conflito', 'Sinais de desgaste', 'O que evitar', 'Perguntas para a próxima conversa', 'Como usar este relatório']) {
    assert.ok(html.slice(iP2).includes(titulo), `parte 2 sem: ${titulo}`);
  }
});

test('a parte 2 fala da pessoa pelo nome', () => {
  const html = montarRelatorio(resultadoDeExemplo({ nome: 'Joana' }));
  const p2 = html.slice(html.indexOf('id="parte2"'), html.indexOf('rodape-relatorio'));
  assert.ok(p2.includes('Para quem lidera Joana'));
  assert.ok((p2.match(/Joana/g) || []).length >= 3);
  assert.ok(!p2.includes('{nome}'));
});

test('nome com apostrofo e html aparece escapado na parte 2', () => {
  const html = montarRelatorio(resultadoDeExemplo({ nome: "D'Ávila <b>" }));
  const p2 = html.slice(html.indexOf('id="parte2"'));
  assert.ok(p2.includes('D&#39;Ávila &lt;b&gt;'));
  assert.ok(!p2.includes('<b>'));
});

test('o plano tem exatamente tres acoes, inclusive com emocoes equilibradas', () => {
  assert.equal(acoesDoPlano(resultadoDeExemplo()).length, 3);
  const equilibrado = resultadoDeExemplo({ emocoes: MAPA_EMOCOES.map((m) => (m.invertida ? 2 : 4)) });
  assert.equal(equilibrado.emocoes.equilibrado, true);
  const acoes = acoesDoPlano(equilibrado);
  assert.equal(acoes.length, 3);
  assert.ok(acoes.every(Boolean));
});

test('a conversa individual tem exatamente quatro perguntas', () => {
  assert.equal(perguntasDaConversa(resultadoDeExemplo()).length, 4);
  assert.equal(perguntasDaConversa(resultadoDeExemplo({ a2: null })).length, 4);
  assert.ok(perguntasDaConversa(resultadoDeExemplo({ a2: null })).every(Boolean));
});

test('o quadro de conflito aparece na parte 1', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  assert.ok(html.slice(html.indexOf('id="parte1"'), html.indexOf('class="quebra-pagina"')).includes('class="grafico quadro"'));
});

test('o resumo traz perfil, motivadores, conflito e emocao', () => {
  const r = resultadoDeExemplo();
  const html = montarRelatorio(r);
  const resumo = html.slice(html.indexOf('id="resumo"'), html.indexOf('id="parte1"'));
  assert.ok(resumo.includes(r.perfil.titulo));
  assert.ok(resumo.includes(NOMES_ESTILO[r.conflito.principal]));
  assert.ok(resumo.includes(NOMES_DOMINIO[r.emocoes.forte]));
});

test('o retrato usado e o da combinacao de dominante e apoio', () => {
  const r = resultadoDeExemplo({
    a1: Array.from({ length: 12 }, (_, i) => (i < 7 ? { mais: 'E', menos: 'P' } : { mais: 'A', menos: 'P' })),
  });
  assert.equal(r.perfil.dominante, 'E');
  assert.equal(r.perfil.apoio, 'A');
  const html = montarRelatorio(r);
  assert.ok(html.includes('Você decide rápido, mas não no escuro.'));
});

test('o botao de salvar em pdf aparece uma unica vez, no fim da pagina', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  const botoes = [...html.matchAll(/class="[^"]*sem-impressao[^"]*"[^>]*data-acao="imprimir"/g)];
  assert.equal(botoes.length, 1);
  assert.ok(html.indexOf('data-acao="imprimir"') > html.indexOf('id="ressalvas"'));
});

test('o relatorio nao tem indice de secoes no topo', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  assert.ok(!html.includes('id="indice"'));
  assert.ok(!/IR DIRETO PARA/i.test(html));
});

test('o rodape credita a DEL com e-mail e telefone, e sai no PDF', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  const rodape = html.slice(html.indexOf('rodape-relatorio'));
  assert.ok(rodape.includes('DEL'));
  assert.ok(rodape.includes('diretoriaadmlotus@gmail.com'));
  assert.ok(rodape.includes('99304-7898'));
  const credito = rodape.slice(rodape.indexOf('credito-del'), rodape.indexOf('credito-del') + 400);
  assert.ok(!credito.includes('sem-impressao'), 'o credito precisa aparecer no PDF');
});

test('nome com html aparece escapado, nunca interpretado', () => {
  const html = montarRelatorio(resultadoDeExemplo({ nome: '<b>Ana</b> & "cia"' }));
  assert.ok(!html.includes('<b>Ana</b>'));
  assert.ok(html.includes('&lt;b&gt;Ana&lt;/b&gt;'));
  assert.ok(html.includes('&amp;'));
});

test('escaparHtml cobre os cinco caracteres perigosos', () => {
  assert.equal(escaparHtml('<a href="x" \'y\'>&'), '&lt;a href=&quot;x&quot; &#39;y&#39;&gt;&amp;');
});

test('sem bloco adaptado o relatorio nao fala em tensao', () => {
  const html = montarRelatorio(resultadoDeExemplo({ a2: null }));
  assert.ok(!/tens[ãa]o/i.test(html), 'o relatorio mencionou tensao sem bloco adaptado');
  assert.ok(!html.includes('Natural × Adaptado'));
  assert.ok(html.includes('Leia com cuidado'));
});

test('alerta reforcado aparece quando as duas condicoes se somam', () => {
  const comAlerta = montarRelatorio(resultadoDeExemplo());
  const semAlerta = montarRelatorio(resultadoDeExemplo({ c: [1, 1, 5, 5, 5] }));
  assert.ok(comAlerta.includes('id="alerta-reforcado"'));
  assert.ok(!semAlerta.includes('id="alerta-reforcado"'));
});

test('o rodape legal esta sempre presente', () => {
  const html = montarRelatorio(resultadoDeExemplo({ a2: null, c: [1, 1, 5, 5, 5] }));
  assert.ok(/psicol[óo]gico/i.test(html));
});

test('a comparacao explica que usa os blocos respondidos duas vezes', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  assert.ok(html.includes('6 blocos que você respondeu duas vezes'));
});

test('o botao de compartilhar existe e sai do pdf', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  assert.match(html, /class="[^"]*sem-impressao[^"]*"[^>]*data-acao="compartilhar"/);
});

test('o rodape aponta a base teorica, tambem como texto para o pdf', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  const rodape = html.slice(html.indexOf('rodape-relatorio'));
  assert.ok(rodape.includes('href="metodo.html"'));
  assert.ok(rodape.includes('lucianocabralsf.github.io/mapa-de-perfil/metodo.html'));
});

test('o relatorio oferece fazer o teste de novo, fora do pdf', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  assert.match(html, /class="[^"]*sem-impressao[^"]*"[^>]*data-acao="refazer"/);
});

test('o telefone do rodape abre conversa direta no whatsapp', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  const rodape = html.slice(html.indexOf('credito-del'));
  assert.match(rodape, /href="https:\/\/wa\.me\/5592993047898\?text=[^"]+"/);
  assert.ok(!rodape.includes('href="tel:'), 'o numero nao deve mais abrir o discador');
  assert.ok(rodape.includes('(92) 99304-7898'), 'o numero continua visivel, inclusive no pdf');
});

test('o whatsapp do rodape e um botao com rotulo claro', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  const rodape = html.slice(html.indexOf('credito-del'));
  assert.match(rodape, /<a class="botao-whatsapp" href="https:\/\/wa\.me\/5592993047898\?text=[^"]+"[^>]*>/);
  const botao = rodape.slice(rodape.indexOf('class="botao-whatsapp"'), rodape.indexOf('</a>', rodape.indexOf('class="botao-whatsapp"')));
  assert.ok(botao.includes('Falar com a DEL no WhatsApp'));
  assert.ok(botao.includes('(92) 99304-7898'));
  assert.ok(botao.includes('aria-hidden="true"'), 'o icone e decorativo');
});

test('compartilhar abre um painel com as duas opcoes e o aviso', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  const painel = html.slice(html.indexOf('id="painel-compartilhar"'), html.indexOf('</div>', html.indexOf('id="painel-compartilhar"')));
  assert.ok(html.includes('id="painel-compartilhar"') && /id="painel-compartilhar"[^>]*hidden/.test(html), 'painel comeca escondido');
  assert.ok(painel.includes('data-acao="compartilhar-resumo"'));
  assert.ok(painel.includes('data-acao="compartilhar-completo"'));
  assert.match(painel, /fica na conversa/);
});

test('o relatorio aberto por link nao oferece compartilhar nem refazer', () => {
  const html = montarRelatorio(resultadoDeExemplo({ nome: 'Ana <b>' }), { compartilhado: true });
  assert.ok(!html.includes('data-acao="compartilhar"'));
  assert.ok(!html.includes('data-acao="refazer"'));
  assert.ok(html.includes('data-acao="imprimir"'), 'o lider pode salvar o pdf');
  assert.ok(html.includes('Resultado compartilhado por <strong>Ana &lt;b&gt;</strong>'));
  assert.ok(html.includes('data-acao="fazer-meu-teste"'));
  assert.ok(html.includes('id="parte2"'));
});

test('o resumo aberto por link mostra so o resumo, sem alertas sensiveis', () => {
  const r = resultadoDeExemplo({ c: [5, 5, 1, 1, 1] });
  assert.equal(r.momento.faixa, 'turbulento');
  const html = montarResumoCompartilhado(r);
  assert.ok(html.includes('id="resumo"'));
  assert.ok(html.includes(r.perfil.titulo));
  assert.ok(!html.includes('id="parte1"') && !html.includes('id="parte2"'));
  assert.ok(!html.includes('resumo-alertas'), 'momento e tensao nao vao para o resumo compartilhado');
  assert.ok(html.includes('data-acao="fazer-meu-teste"'));
  assert.ok(!html.includes('data-acao="compartilhar"') && !html.includes('data-acao="refazer"'));
});
