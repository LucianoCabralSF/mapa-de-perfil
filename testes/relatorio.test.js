import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularResultado, MAPA_MOTIVACOES } from '../src/motor.js';
import { montarRelatorio, escaparHtml } from '../src/relatorio.js';

function resultadoDeExemplo(extras = {}) {
  return calcularResultado({
    nome: 'Maria',
    contexto: 'Analista de RH',
    a1: Array.from({ length: 10 }, () => ({ mais: 'E', menos: 'A' })),
    a2: Array.from({ length: 10 }, () => ({ mais: 'A', menos: 'E' })),
    b: MAPA_MOTIVACOES.map((c) => (c === 'PRO' ? 5 : 2)),
    c: [5, 5, 1, 1, 1],
    ...extras,
  });
}

test('o relatorio traz todas as secoes previstas', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  for (const titulo of [
    'Seu perfil', 'Natural', 'Momento', 'motiva', 'Pontos fortes',
    'Pontos de atenção', 'Como se comunicar', 'Ambiente', 'Leia com cuidado',
  ]) {
    assert.ok(html.includes(titulo), `falta a secao: ${titulo}`);
  }
});

test('o botao de salvar em pdf aparece uma unica vez, no fim da pagina', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  const botoes = [...html.matchAll(/class="[^"]*sem-impressao[^"]*"[^>]*data-acao="imprimir"/g)];
  assert.equal(botoes.length, 1);
  assert.ok(html.indexOf('data-acao="imprimir"') > html.indexOf('id="ressalvas"'));
});

test('o indice se anuncia como clicavel', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  const indice = html.slice(html.indexOf('id="indice"'), html.indexOf('</nav>'));
  assert.match(indice, /IR DIRETO PARA/i);
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

test('o indice nao lista secao ausente', () => {
  const html = montarRelatorio(resultadoDeExemplo({ a2: null }));
  const indice = html.slice(html.indexOf('id="indice"'), html.indexOf('</nav>'));
  assert.ok(!indice.includes('Adaptado'));
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
