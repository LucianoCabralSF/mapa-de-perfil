import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FATORES,
  MOTIVADORES,
  PARES_MOTIVACAO,
  DIRECOES_MOMENTO,
} from '../src/motor.js';
import {
  BLOCOS,
  FRASES_MOTIVACAO,
  montarPares,
  PERGUNTAS_MOMENTO,
  ESCALA_CONCORDANCIA,
  ANCORA_A1,
  ANCORA_A2,
  ordemExibicaoA2,
  INCLUIR_ADAPTADO,
} from '../src/dados.js';
import { palavrasFlexionadas } from './apoio/linguagem.js';

test('existem 10 blocos com 4 opcoes cada, uma por fator', () => {
  assert.equal(BLOCOS.length, 10);
  for (const [i, bloco] of BLOCOS.entries()) {
    assert.equal(bloco.length, 4, `bloco ${i} precisa de 4 opcoes`);
    assert.deepEqual(bloco.map((o) => o.fator), FATORES, `bloco ${i} fora da ordem canonica`);
    for (const opcao of bloco) {
      assert.equal(typeof opcao.palavra, 'string');
      assert.ok(
        opcao.palavra.length > 0 && opcao.palavra.length <= 24,
        `palavra longa demais: ${opcao.palavra}`,
      );
    }
  }
});

test('nenhuma palavra se repete no instrumento inteiro', () => {
  const todas = BLOCOS.flat().map((o) => o.palavra.toLowerCase());
  assert.equal(new Set(todas).size, todas.length);
});

test('cada motivador tem 5 frases distintas e neutras', () => {
  for (const codigo of MOTIVADORES) {
    assert.equal(FRASES_MOTIVACAO[codigo].length, 5, `${codigo} precisa de 5 frases`);
  }
  const todas = MOTIVADORES.flatMap((c) => FRASES_MOTIVACAO[c]);
  assert.equal(new Set(todas).size, 30);
  for (const frase of todas) {
    assert.ok(frase.length <= 60, `frase longa demais: ${frase}`);
    assert.deepEqual(palavrasFlexionadas(frase), [], `frase no masculino: ${frase}`);
  }
});

test('montarPares segue PARES_MOTIVACAO e usa cada frase uma unica vez', () => {
  const pares = montarPares();
  assert.equal(pares.length, 15);
  pares.forEach((par, i) => {
    assert.deepEqual([par.esquerda.codigo, par.direita.codigo], PARES_MOTIVACAO[i]);
  });
  const usadas = pares.flatMap((p) => [p.esquerda.frase, p.direita.frase]);
  assert.equal(new Set(usadas).size, 30);
});

test('existem 5 perguntas de momento alinhadas as direcoes', () => {
  assert.equal(PERGUNTAS_MOMENTO.length, DIRECOES_MOMENTO.length);
});

test('a escala de concordancia tem 5 pontos rotulados', () => {
  assert.equal(ESCALA_CONCORDANCIA.length, 5);
  assert.deepEqual(ESCALA_CONCORDANCIA.map((p) => p.valor), [1, 2, 3, 4, 5]);
});

test('as duas ancoras sao textos diferentes', () => {
  assert.notEqual(ANCORA_A1, ANCORA_A2);
  assert.ok(ANCORA_A1.length > 10 && ANCORA_A2.length > 10);
});

test('a ordem de exibicao do A2 cobre os 6 blocos, invertida', () => {
  const ordem = ordemExibicaoA2();
  assert.equal(ordem.length, 6);
  assert.deepEqual(ordem.map((p) => p.posicao), [5, 4, 3, 2, 1, 0]);
  assert.deepEqual(ordem.map((p) => p.indiceCanonico), [9, 7, 6, 5, 3, 1]);
  assert.deepEqual(ordem[0].opcoes.map((o) => o.fator), ['A', 'P', 'C', 'E']);
});

test('INCLUIR_ADAPTADO e um booleano', () => {
  assert.equal(typeof INCLUIR_ADAPTADO, 'boolean');
});

test('MOTIVADORES continua com seis codigos', () => {
  assert.equal(MOTIVADORES.length, 6);
});
