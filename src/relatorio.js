import { NOMES_FATOR, NOMES_MOTIVADOR } from './motor.js';
import {
  RETRATOS, FORTES, ATENCAO, COMUNICACAO, AMBIENTE,
  MOTIVADOR_ALTO, MOTIVADOR_BAIXO, TEXTO_TENSAO, FATOR_FORCADO,
  FATOR_CONTIDO, TEXTO_ALINHADO, TEXTO_MOMENTO, ALERTA_REFORCADO,
  FECHAMENTO_RESSALVA, RODAPE_LEGAL,
} from './textos.js';
import { barrasComportamento, barrasComparadas, barrasMotivacoes } from './graficos.js';

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

function creditoDel() {
  return '<div class="credito-del">'
    + '<p class="credito-titulo">Ferramenta desenvolvida pela DEL — Desenvolvimento Humano e Gerencial.</p>'
    + '<p class="credito-chamada">Quer uma ferramenta como esta para a sua empresa? Fale com a gente.</p>'
    + '<p class="credito-contato">'
    + '<a href="mailto:diretoriaadmlotus@gmail.com">diretoriaadmlotus@gmail.com</a>'
    + '<span class="credito-separador"> · </span>'
    + '<a href="tel:+5592993047898">(92) 99304-7898</a>'
    + '</p></div>';
}

function blocoTensao(tensao) {
  const partes = [paragrafo(TEXTO_TENSAO[tensao.faixa])];
  if (tensao.forcado) partes.push(paragrafo(FATOR_FORCADO[tensao.forcado]));
  if (tensao.contido) partes.push(paragrafo(FATOR_CONTIDO[tensao.contido]));
  if (!tensao.forcado && !tensao.contido) partes.push(paragrafo(TEXTO_ALINHADO));
  return partes.join('');
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

function blocoDesmotiva(motivacoes) {
  const ultimo = motivacoes[motivacoes.length - 1];
  return paragrafo(
    `Ambiente que gira em torno de ${NOMES_MOTIVADOR[ultimo.codigo].toLowerCase()} `
    + 'tende a te deixar indiferente. Cobrança nesse terreno não te acende: te cansa.',
  );
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

export function montarRelatorio(resultado) {
  const { perfil, natural, adaptado, tensao, motivacoes, momento } = resultado;
  const dominante = perfil.dominante;
  const temAdaptado = Boolean(adaptado && tensao);

  const contexto = resultado.contexto
    ? `<p class="contexto">${escaparHtml(resultado.contexto)}</p>`
    : '';

  const cabecalho = '<header class="cabecalho-relatorio">'
    + '<p class="kicker">DEL / LÓTUS · MAPA DE PERFIL</p>'
    + `<h1>${escaparHtml(resultado.nome)}</h1>`
    + contexto
    + `<p class="data">${escaparHtml(resultado.data)}</p>`
    + '</header>';

  const partes = [
    cabecalho,
    cartao('perfil', 'Seu perfil', `<p class="titulo-perfil">${escaparHtml(perfil.titulo)}</p>`
      + paragrafo(RETRATOS[dominante])
      + barrasComportamento(natural.pct)),
  ];

  if (temAdaptado) {
    partes.push(cartao('comparacao', 'Natural × Adaptado',
      '<p class="legenda-grafico">Barra de cima: como você é. Barra de baixo: como você '
      + 'precisa ser no trabalho hoje. A comparação usa os 6 blocos que você respondeu duas vezes.</p>'
      + barrasComparadas(resultado.naturalComparavel.pct, adaptado.pct)
      + `<p class="indice-tensao">Índice de tensão: ${tensao.indice}</p>`
      + blocoTensao(tensao)));
  }

  partes.push(
    cartao('momento', 'Momento atual',
      `<p class="medidor">${momento.pct}</p>` + paragrafo(TEXTO_MOMENTO[momento.faixa])),
    cartao('motivadores', 'O que te motiva', blocoMotivacoes(motivacoes)),
    cartao('fortes', 'Pontos fortes', lista(FORTES[dominante])),
    cartao('atencao', 'Pontos de atenção', lista(ATENCAO[dominante])),
    cartao('comunicacao', 'Como se comunicar com você', paragrafo(COMUNICACAO[dominante])),
    cartao('ambiente', 'Ambiente', paragrafo(AMBIENTE[dominante])),
    cartao('desmotiva', 'O que te desmotiva', blocoDesmotiva(motivacoes)),
    cartao('ressalvas', 'Leia com cuidado', blocoRessalvas(resultado)),
    '<footer class="rodape-relatorio">'
      + botaoImprimir('rodape')
      + botaoCompartilhar()
      + creditoDel()
      + `<p class="aviso-legal">${escaparHtml(RODAPE_LEGAL)}</p>`
      + '</footer>',
  );

  return partes.join('');
}
