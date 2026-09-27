import {
  NOMES_FATOR, NOMES_MOTIVADOR, NOMES_ESTILO, NOMES_DOMINIO,
} from './motor.js';
import {
  RETRATOS, SINTESE, FORTES, ATENCAO,
  MOTIVADOR_ALTO, MOTIVADOR_BAIXO, TEXTO_TENSAO, FATOR_FORCADO,
  FATOR_CONTIDO, TEXTO_ALINHADO, TEXTO_MOMENTO, ALERTA_REFORCADO,
  FECHAMENTO_RESSALVA, RODAPE_LEGAL, CONFLITO_VOCE,
  EMOCAO_FORTE, EMOCAO_DESENVOLVER, EMOCAO_EQUILIBRADO, EMOCAO_LEITURA,
  ACAO_FATOR, ACAO_EMOCAO, ACAO_CONFLITO,
} from './textos.js';
import * as L from './textos-lider.js';
import {
  barrasComportamento, barrasComparadas, barrasMotivacoes,
  barrasConflito, barrasEmocoes, quadroConflito,
} from './graficos.js';

export function escaparHtml(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cartao(id, titulo, corpo, extra = '') {
  return `<section class="cartao${extra ? ` ${extra}` : ''}" id="${id}">`
    + `<h2>${titulo}</h2>${corpo}</section>`;
}

function lista(itens) {
  return `<ul>${itens.map((i) => `<li>${escaparHtml(i)}</li>`).join('')}</ul>`;
}

function paragrafo(texto) {
  return `<p>${escaparHtml(texto)}</p>`;
}

function botaoImprimir(posicao) {
  return `<button type="button" class="botao-principal sem-impressao" data-acao="imprimir"`
    + ` data-posicao="${posicao}">Salvar em PDF</button>`;
}

function botaoCompartilhar() {
  return '<button type="button" class="botao-secundario sem-impressao" data-acao="compartilhar">'
    + 'Compartilhar meu perfil</button>';
}

function botaoRefazer() {
  return '<button type="button" class="link-refazer sem-impressao" data-acao="refazer">'
    + 'Fazer o teste de novo (apaga este resultado)</button>';
}

function creditoDel() {
  return '<div class="credito-del">'
    + '<p class="credito-titulo">Ferramenta desenvolvida pela DEL — Desenvolvimento Humano e Gerencial.</p>'
    + '<p class="credito-chamada">Quer uma ferramenta como esta para a sua empresa? Fale com a gente.</p>'
    + '<p class="credito-contato">'
    + '<a href="mailto:diretoriaadmlotus@gmail.com">diretoriaadmlotus@gmail.com</a>'
    + '<span class="credito-separador"> · </span>'
    + '<a href="https://wa.me/5592993047898?text=Ol%C3%A1!%20Fiz%20o%20Mapa%20de%20Perfil%20e%20quero%20saber%20mais%20sobre%20as%20ferramentas%20da%20DEL." target="_blank" rel="noopener">(92) 99304-7898</a>'
    + '</p></div>';
}

function cabecalhoParte(numero, titulo) {
  return `<header class="cabecalho-parte"><p class="kicker">PARTE ${numero}</p>`
    + `<h2 class="titulo-parte">${titulo}</h2></header>`;
}

// ---------- Regras de selecao ----------

function chaveRetrato(perfil) {
  return perfil.apoio ? perfil.dominante + perfil.apoio : perfil.dominante;
}

// Sempre 3 acoes: do fator dominante, do dominio emocional a desenvolver
// (no perfil equilibrado, o de menor pontuacao) e do estilo de conflito.
export function acoesDoPlano(r) {
  const dominio = r.emocoes.desenvolver ?? r.emocoes.ranking[r.emocoes.ranking.length - 1].codigo;
  return [ACAO_FATOR[r.perfil.dominante], ACAO_EMOCAO[dominio], ACAO_CONFLITO[r.conflito.principal]];
}

// Sempre 4 perguntas: motivador principal, tensao (sem a etapa 2, o fator
// dominante), momento e estilo de conflito.
export function perguntasDaConversa(r) {
  return [
    L.PERGUNTA_MOTIVADOR[r.motivacoes[0].codigo],
    r.tensao ? L.PERGUNTA_TENSAO[r.tensao.faixa] : L.PERGUNTA_FATOR[r.perfil.dominante],
    L.PERGUNTA_MOMENTO[r.momento.faixa],
    L.PERGUNTA_CONFLITO[r.conflito.principal],
  ];
}

// ---------- Resumo ----------

function montarResumo(r) {
  const [m1, m2] = r.motivacoes;
  const alertas = [
    r.momento.faixa === 'turbulento' ? 'Momento turbulento: leia o resultado como fotografia de uma fase.' : '',
    r.tensao?.faixa === 'alta' ? 'Tensão alta entre o jeito natural e o que o trabalho pede hoje.' : '',
  ].filter(Boolean);
  const item = (rotulo, valor) => '<div class="resumo-item">'
    + `<p class="resumo-rotulo">${rotulo}</p><p class="resumo-valor">${escaparHtml(valor)}</p></div>`;
  return '<section class="cartao resumo" id="resumo"><h2>Resumo</h2>'
    + `<p class="titulo-perfil">${escaparHtml(r.perfil.titulo)}</p>`
    + paragrafo(SINTESE[r.perfil.dominante])
    + '<div class="resumo-grade">'
    + item('O que mais move', `${NOMES_MOTIVADOR[m1.codigo]} e ${NOMES_MOTIVADOR[m2.codigo]}`)
    + item('Diante de conflito', NOMES_ESTILO[r.conflito.principal])
    + item('Força emocional', NOMES_DOMINIO[r.emocoes.forte])
    + '</div>'
    + (alertas.length ? `<ul class="resumo-alertas">${alertas.map((a) => `<li>${escaparHtml(a)}</li>`).join('')}</ul>` : '')
    + '</section>';
}

// ---------- Parte 1: para voce ----------

function blocoTensao(tensao) {
  const partes = [paragrafo(TEXTO_TENSAO[tensao.faixa])];
  if (tensao.forcado) partes.push(paragrafo(FATOR_FORCADO[tensao.forcado]));
  if (tensao.contido) partes.push(paragrafo(FATOR_CONTIDO[tensao.contido]));
  if (!tensao.forcado && !tensao.contido) partes.push(paragrafo(TEXTO_ALINHADO));
  return partes.join('');
}

function blocoConflito(c) {
  const principal = CONFLITO_VOCE[c.principal];
  return quadroConflito(c.assertividade, c.cooperacao)
    + barrasConflito(c.pct)
    + `<h3>Seu estilo principal: ${NOMES_ESTILO[c.principal]}</h3>`
    + paragrafo(principal.rende) + paragrafo(principal.custa)
    + `<h3>Seu estilo de apoio: ${NOMES_ESTILO[c.secundario]}</h3>`
    + paragrafo(CONFLITO_VOCE[c.secundario].rende);
}

function blocoMotivacoes(motivacoes) {
  const topo = motivacoes.slice(0, 2);
  const ultimo = motivacoes[motivacoes.length - 1];
  const move = topo
    .map((m) => `<h3>${NOMES_MOTIVADOR[m.codigo]}</h3>${paragrafo(MOTIVADOR_ALTO[m.codigo])}`)
    .join('');
  const naoMove = `<h3>O que menos te move: ${NOMES_MOTIVADOR[ultimo.codigo]}</h3>`
    + paragrafo(MOTIVADOR_BAIXO[ultimo.codigo]);
  return barrasMotivacoes(motivacoes, NOMES_MOTIVADOR) + move + naoMove;
}

function blocoEmocoes(e) {
  const desenvolver = e.equilibrado
    ? paragrafo(EMOCAO_EQUILIBRADO)
    : `<h3>Área a desenvolver: ${NOMES_DOMINIO[e.desenvolver]}</h3>` + paragrafo(EMOCAO_DESENVOLVER[e.desenvolver]);
  return barrasEmocoes(e.ranking)
    + `<h3>Área mais forte: ${NOMES_DOMINIO[e.forte]}</h3>` + paragrafo(EMOCAO_FORTE[e.forte])
    + desenvolver
    + `<p class="legenda-grafico">${escaparHtml(EMOCAO_LEITURA)}</p>`;
}

function blocoRessalvas(resultado) {
  const partes = [];
  if (resultado.alertaReforcado) {
    partes.push(`<p id="alerta-reforcado" class="destaque">${escaparHtml(ALERTA_REFORCADO)}</p>`);
  }
  partes.push(paragrafo(TEXTO_MOMENTO[resultado.momento.faixa]));
  if (resultado.tensao?.forcado) {
    partes.push(paragrafo(
      `Como o seu resultado mostra esforço na direção de ${NOMES_FATOR[resultado.tensao.forcado]}, `
      + 'parte do que você vê acima pode ser resposta ao que o trabalho pede hoje, '
      + 'e não característica fixa sua.',
    ));
  }
  partes.push(paragrafo(FECHAMENTO_RESSALVA));
  return partes.join('');
}

function montarParte1(r) {
  const { perfil, natural, adaptado, tensao, motivacoes, momento } = r;
  const dominante = perfil.dominante;
  const partes = [
    '<div id="parte1">',
    cabecalhoParte(1, 'Para você'),
    cartao('perfil', 'Seu perfil', `<p class="titulo-perfil">${escaparHtml(perfil.titulo)}</p>`
      + paragrafo(RETRATOS[chaveRetrato(perfil)])
      + barrasComportamento(natural.pct)),
  ];
  if (adaptado && tensao) {
    partes.push(cartao('comparacao', 'Natural × Adaptado',
      '<p class="legenda-grafico">Barra de cima: como você é. Barra de baixo: como você '
      + 'precisa ser no trabalho hoje. A comparação usa os 6 blocos que você respondeu duas vezes.</p>'
      + barrasComparadas(r.naturalComparavel.pct, adaptado.pct)
      + `<p class="indice-tensao">Índice de tensão: ${tensao.indice}</p>`
      + blocoTensao(tensao)));
  }
  partes.push(
    cartao('conflito', 'Diante de conflito', blocoConflito(r.conflito)),
    cartao('motivadores', 'O que te move', blocoMotivacoes(motivacoes)),
    cartao('emocoes', 'Como você lida com emoções', blocoEmocoes(r.emocoes)),
    cartao('momento', 'Momento atual',
      `<p class="medidor">${momento.pct}</p>` + paragrafo(TEXTO_MOMENTO[momento.faixa])),
    cartao('fortes', 'Pontos fortes', lista(FORTES[dominante])),
    cartao('atencao', 'Pontos de atenção', lista(ATENCAO[dominante])),
    cartao('plano', 'Plano de desenvolvimento',
      '<p class="legenda-grafico">Três ações para os próximos 30 dias.</p>'
      + `<ol>${acoesDoPlano(r).map((a) => `<li>${escaparHtml(a)}</li>`).join('')}</ol>`),
    cartao('ressalvas', 'Leia com cuidado', blocoRessalvas(r)),
    '</div>',
  );
  return partes.join('');
}

// ---------- Parte 2: para quem lidera ----------

function montarParte2(r, nome) {
  // Escapa o texto antes de trocar {nome}, para o nome (ja escapado) entrar intacto.
  const MARCA = '\u0000';
  const n = (t) => escaparHtml(L.comNome(t, MARCA)).split(MARCA).join(nome);
  const p = (t) => `<p>${n(t)}</p>`;
  const lst = (itens) => `<ul>${itens.map((i) => `<li>${n(i)}</li>`).join('')}</ul>`;
  const d = r.perfil.dominante;
  const comunicar = L.LIDER_COMUNICAR[d];
  const conflito = L.LIDER_CONFLITO[r.conflito.principal];
  const desgaste = [
    L.LIDER_DESGASTE[d],
    r.tensao?.faixa === 'alta' ? L.LIDER_DESGASTE_TENSAO : '',
    r.momento.faixa === 'turbulento' ? L.LIDER_DESGASTE_MOMENTO : '',
  ].filter(Boolean);
  return '<div id="parte2">'
    + cabecalhoParte(2, `Para quem lidera ${nome}`)
    + cartao('lider-frase', 'Em uma frase', p(L.LIDER_FRASE[d]) + (r.perfil.apoio ? p(L.LIDER_APOIO[r.perfil.apoio]) : ''))
    + cartao('lider-comunicar', 'Como se comunicar', `<h3>Faça</h3>${lst(comunicar.fazer)}<h3>Evite</h3>${lst(comunicar.evitar)}`)
    + cartao('lider-retorno', 'Como dar retorno e reconhecer', r.motivacoes.slice(0, 2).map((m) => p(L.LIDER_RETORNO[m.codigo])).join(''))
    + cartao('lider-delegar', 'Como delegar e acompanhar', p(L.LIDER_DELEGAR[d]))
    + cartao('lider-conflito', 'Em conflito', p(conflito.esperar) + p(conflito.conduzir))
    + cartao('lider-desgaste', 'Sinais de desgaste', lst(desgaste))
    + cartao('lider-evitar', 'O que evitar', p(L.LIDER_EVITAR[r.motivacoes[r.motivacoes.length - 1].codigo]))
    + cartao('lider-perguntas', 'Perguntas para a próxima conversa individual',
      `<ol>${perguntasDaConversa(r).map((q) => `<li>${n(q)}</li>`).join('')}</ol>`)
    + cartao('lider-uso', 'Como usar este relatório', p(L.COMO_USAR))
    + '</div>';
}

// ---------- Relatorio completo ----------

export function montarRelatorio(resultado) {
  const nome = escaparHtml(resultado.nome);
  const contexto = resultado.contexto
    ? `<p class="contexto">${escaparHtml(resultado.contexto)}</p>`
    : '';

  const cabecalho = '<header class="cabecalho-relatorio">'
    + '<p class="kicker">DEL / LÓTUS · MAPA DE PERFIL</p>'
    + `<h1>${nome}</h1>`
    + contexto
    + `<p class="data">${escaparHtml(resultado.data)}</p>`
    + '</header>';

  const rodape = '<footer class="rodape-relatorio">'
    + botaoImprimir('rodape')
    + botaoCompartilhar()
    + botaoRefazer()
    + creditoDel()
    + `<p class="aviso-legal">${escaparHtml(RODAPE_LEGAL)}</p>`
    + '<p class="aviso-legal">Base teórica do método: '
    + '<a href="metodo.html">lucianocabralsf.github.io/mapa-de-perfil/metodo.html</a></p>'
    + '</footer>';

  return cabecalho
    + montarResumo(resultado)
    + montarParte1(resultado)
    + '<div class="quebra-pagina" aria-hidden="true"></div>'
    + montarParte2(resultado, nome)
    + rodape;
}
