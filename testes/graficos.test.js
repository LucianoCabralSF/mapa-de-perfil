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
