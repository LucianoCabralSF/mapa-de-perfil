import {
  FATORES, NOMES_FATOR, ESTILOS_CONFLITO, NOMES_ESTILO, NOMES_DOMINIO,
} from './motor.js';

const LARGURA = 320;
const LARGURA_ROTULO = 100;
const LARGURA_BARRA = LARGURA - LARGURA_ROTULO;
const ALTURA_LINHA = 34;

function aparar(valor) {
  if (typeof valor !== 'number' || Number.isNaN(valor)) return 0;
  return Math.max(0, Math.min(100, valor));
}

function larguraDe(pct) {
  return Number(((aparar(pct) / 100) * LARGURA_BARRA).toFixed(1));
}

function escapar(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function moldura(altura, conteudo) {
  return `<svg viewBox="0 0 ${LARGURA} ${altura}" role="img" class="grafico">${conteudo}</svg>`;
}

function linha(rotulo, y, barras) {
  const texto = `<text x="0" y="${y + 14}" class="rotulo">${escapar(rotulo)}</text>`;
  return texto + barras;
}

// Trilho de fundo: sem ele, um valor zero some e parece falha de desenho
// em vez de resultado.
function trilho(y, altura) {
  const raio = altura / 2;
  return `<rect class="trilho" x="${LARGURA_ROTULO}" y="${y}" width="${LARGURA_BARRA}" height="${altura}" rx="${raio}"/>`;
}

// Uma barra por item: [{ rotulo, pct, classe }].
function barrasDe(itens) {
  const conteudo = itens.map(({ rotulo, pct, classe }, i) => {
    const y = i * ALTURA_LINHA;
    const barra = trilho(y + 4, 16)
      + `<rect class="${classe}" x="${LARGURA_ROTULO}" y="${y + 4}" width="${larguraDe(pct)}" height="16" rx="8"/>`;
    const valor = `<text x="${LARGURA - 2}" y="${y + 17}" class="valor" text-anchor="end">${aparar(pct)}</text>`;
    return linha(rotulo, y, barra + valor);
  }).join('');
  return moldura(itens.length * ALTURA_LINHA, conteudo);
}

export function barrasComportamento(pct) {
  return barrasDe(FATORES.map((f) => ({ rotulo: NOMES_FATOR[f], pct: pct[f], classe: 'barra' })));
}

export function barrasComparadas(pctNatural, pctAdaptado) {
  const altura = ALTURA_LINHA + 8;
  const conteudo = FATORES.map((f, i) => {
    const y = i * altura;
    const natural = trilho(y + 2, 12)
      + `<rect class="barra natural" x="${LARGURA_ROTULO}" y="${y + 2}" width="${larguraDe(pctNatural[f])}" height="12" rx="6"/>`;
    const adaptado = trilho(y + 18, 12)
      + `<rect class="barra adaptado" x="${LARGURA_ROTULO}" y="${y + 18}" width="${larguraDe(pctAdaptado[f])}" height="12" rx="6"/>`;
    return linha(NOMES_FATOR[f], y, natural + adaptado);
  }).join('');
  return moldura(FATORES.length * altura, conteudo);
}

export function barrasMotivacoes(ranking, nomes) {
  return barrasDe(ranking.map((item, i) => {
    let classe = 'barra';
    if (i < 2) classe = 'barra destaque';
    else if (i === ranking.length - 1) classe = 'barra fraca';
    return { rotulo: nomes[item.codigo], pct: item.pct, classe };
  }));
}

export function barrasConflito(pct) {
  return barrasDe(ESTILOS_CONFLITO.map((e) => ({ rotulo: NOMES_ESTILO[e], pct: pct[e], classe: 'barra' })));
}

export function barrasEmocoes(ranking) {
  return barrasDe(ranking.map((r, i) => ({
    rotulo: NOMES_DOMINIO[r.codigo], pct: r.pct, classe: i === 0 ? 'barra destaque' : 'barra',
  })));
}

// Quadro assertividade x cooperacao do modelo de Thomas e Kilmann.
const QUADRO = 300;
const MARGEM = 40;
const AREA = QUADRO - 2 * MARGEM;

export function quadroConflito(assertividade, cooperacao) {
  const x = MARGEM + (aparar(assertividade) / 100) * AREA;
  const y = MARGEM + AREA - (aparar(cooperacao) / 100) * AREA;
  const rotulo = (texto, tx, ty, ancora = 'middle') => `<text x="${tx}" y="${ty}" class="rotulo-quadro" text-anchor="${ancora}">${escapar(texto)}</text>`;
  return `<svg viewBox="0 0 ${QUADRO} ${QUADRO}" role="img" class="grafico quadro">`
    + `<rect class="quadro-fundo" x="${MARGEM}" y="${MARGEM}" width="${AREA}" height="${AREA}" rx="6"/>`
    + `<line class="quadro-meio" x1="${QUADRO / 2}" y1="${MARGEM}" x2="${QUADRO / 2}" y2="${MARGEM + AREA}"/>`
    + `<line class="quadro-meio" x1="${MARGEM}" y1="${QUADRO / 2}" x2="${MARGEM + AREA}" y2="${QUADRO / 2}"/>`
    + rotulo('Ceder', MARGEM + 6, MARGEM + 16, 'start')
    + rotulo('Colaborar', MARGEM + AREA - 6, MARGEM + 16, 'end')
    + rotulo('Negociar', QUADRO / 2, QUADRO / 2 - 8)
    + rotulo('Evitar', MARGEM + 6, MARGEM + AREA - 8, 'start')
    + rotulo('Competir', MARGEM + AREA - 6, MARGEM + AREA - 8, 'end')
    + rotulo('Assertividade →', QUADRO / 2, QUADRO - 12)
    + `<text class="rotulo-quadro" text-anchor="middle" transform="translate(16 ${QUADRO / 2}) rotate(-90)">Cooperação →</text>`
    + `<circle class="ponto" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"/>`
    + '</svg>';
}
