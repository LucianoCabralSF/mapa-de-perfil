import { FATORES, NOMES_FATOR } from './motor.js';

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

export function barrasComportamento(pct) {
  const conteudo = FATORES.map((f, i) => {
    const y = i * ALTURA_LINHA;
    const barra = `<rect class="barra" x="${LARGURA_ROTULO}" y="${y + 4}" width="${larguraDe(pct[f])}" height="16" rx="8"/>`;
    const valor = `<text x="${LARGURA - 2}" y="${y + 17}" class="valor" text-anchor="end">${aparar(pct[f])}</text>`;
    return linha(NOMES_FATOR[f], y, barra + valor);
  }).join('');
  return moldura(FATORES.length * ALTURA_LINHA, conteudo);
}

export function barrasComparadas(pctNatural, pctAdaptado) {
  const altura = ALTURA_LINHA + 8;
  const conteudo = FATORES.map((f, i) => {
    const y = i * altura;
    const natural = `<rect class="barra natural" x="${LARGURA_ROTULO}" y="${y + 2}" width="${larguraDe(pctNatural[f])}" height="12" rx="6"/>`;
    const adaptado = `<rect class="barra adaptado" x="${LARGURA_ROTULO}" y="${y + 18}" width="${larguraDe(pctAdaptado[f])}" height="12" rx="6"/>`;
    return linha(NOMES_FATOR[f], y, natural + adaptado);
  }).join('');
  return moldura(FATORES.length * altura, conteudo);
}

export function barrasMotivacoes(ranking, nomes) {
  const conteudo = ranking.map((item, i) => {
    const y = i * ALTURA_LINHA;
    let classe = 'barra';
    if (i < 2) classe = 'barra destaque';
    else if (i === ranking.length - 1) classe = 'barra fraca';
    const barra = `<rect class="${classe}" x="${LARGURA_ROTULO}" y="${y + 4}" width="${larguraDe(item.pct)}" height="16" rx="8"/>`;
    const valor = `<text x="${LARGURA - 2}" y="${y + 17}" class="valor" text-anchor="end">${aparar(item.pct)}</text>`;
    return linha(nomes[item.codigo], y, barra + valor);
  }).join('');
  return moldura(ranking.length * ALTURA_LINHA, conteudo);
}
