import test from 'node:test';
import assert from 'node:assert/strict';
import { barrasComportamento, barrasComparadas, barrasMotivacoes } from '../src/graficos.js';
import { NOMES_MOTIVADOR } from '../src/motor.js';

const PCT = { E: 80, C: 60, P: 30, A: 40 };

test('o grafico de comportamento traz svg com os quatro nomes', () => {
  const svg = barrasComportamento(PCT);
  assert.match(svg, /^<svg/);
  assert.match(svg, /<\/svg>$/);
  for (const nome of ['Executor', 'Comunicador', 'Planejador', 'Analista']) {
    assert.ok(svg.includes(nome), `falta ${nome}`);
  }
});

test('barra de 100 e mais larga que barra de 0', () => {
  const svg = barrasComportamento({ E: 100, C: 0, P: 50, A: 50 });
  const larguras = [...svg.matchAll(/class="barra"[^>]*width="([\d.]+)"/g)].map((m) => Number(m[1]));
  assert.ok(larguras[0] > larguras[1]);
  assert.equal(larguras[1], 0);
});

test('o grafico comparado desenha duas barras por fator', () => {
  const svg = barrasComparadas(PCT, { E: 40, C: 70, P: 30, A: 60 });
  assert.equal([...svg.matchAll(/class="barra natural"/g)].length, 4);
  assert.equal([...svg.matchAll(/class="barra adaptado"/g)].length, 4);
});

test('o grafico de motivacoes respeita a ordem recebida', () => {
  const ranking = [
    { codigo: 'PRO', pct: 90 }, { codigo: 'AUT', pct: 70 }, { codigo: 'REA', pct: 60 },
    { codigo: 'PER', pct: 40 }, { codigo: 'REC', pct: 30 }, { codigo: 'SEG', pct: 10 },
  ];
  const svg = barrasMotivacoes(ranking, NOMES_MOTIVADOR);
  assert.ok(svg.indexOf('Propósito') < svg.indexOf('Segurança'));
});

test('valores fora da faixa sao aparados em vez de estourar o desenho', () => {
  const svg = barrasComportamento({ E: 140, C: -20, P: 50, A: 50 });
  const larguras = [...svg.matchAll(/class="barra"[^>]*width="([\d.]+)"/g)].map((m) => Number(m[1]));
  assert.ok(larguras.every((l) => l >= 0 && l <= 220));
});

test('toda barra tem trilho de fundo, para valor zero nao parecer falha de desenho', () => {
  const comportamento = barrasComportamento({ E: 100, C: 0, P: 50, A: 50 });
  assert.equal([...comportamento.matchAll(/class="trilho"/g)].length, 4);

  const comparado = barrasComparadas(PCT, { E: 0, C: 0, P: 0, A: 0 });
  assert.equal([...comparado.matchAll(/class="trilho"/g)].length, 8);

  const motivacoes = barrasMotivacoes(
    [{ codigo: 'PRO', pct: 0 }, { codigo: 'AUT', pct: 0 }, { codigo: 'REA', pct: 0 }],
    NOMES_MOTIVADOR,
  );
  assert.equal([...motivacoes.matchAll(/class="trilho"/g)].length, 3);
});

import { barrasConflito, barrasEmocoes, quadroConflito } from '../src/graficos.js';

test('barras de conflito trazem os cinco estilos', () => {
  const svg = barrasConflito({ COL: 90, NEG: 60, COM: 40, CED: 50, EVI: 10 });
  for (const n of ['Colaborar', 'Negociar', 'Competir', 'Ceder', 'Evitar']) assert.ok(svg.includes(n));
});

test('barras de emocoes respeitam a ordem do ranking', () => {
  const svg = barrasEmocoes([{ codigo: 'EMP', pct: 90 }, { codigo: 'AUT', pct: 70 }, { codigo: 'REL', pct: 50 }, { codigo: 'CTR', pct: 20 }]);
  assert.ok(svg.indexOf('Empatia') < svg.indexOf('Autocontrole'));
});

test('o quadro de conflito posiciona o ponto e inverte o eixo vertical', () => {
  const svg = quadroConflito(100, 100);
  const cx = Number(svg.match(/class="ponto"[^>]*cx="([\d.]+)"/)[1]);
  const cy = Number(svg.match(/class="ponto"[^>]*cy="([\d.]+)"/)[1]);
  const baixo = Number(quadroConflito(0, 0).match(/class="ponto"[^>]*cy="([\d.]+)"/)[1]);
  assert.ok(cx > 150, 'assertividade alta fica a direita');
  assert.ok(cy < baixo, 'cooperacao alta fica em cima');
  for (const n of ['Assertividade', 'Cooperação', 'Colaborar', 'Evitar']) assert.ok(svg.includes(n));
});

test('o quadro apara valores fora de 0 a 100', () => {
  const svg = quadroConflito(180, -30);
  const cx = Number(svg.match(/class="ponto"[^>]*cx="([\d.]+)"/)[1]);
  assert.ok(cx <= 280);
});
