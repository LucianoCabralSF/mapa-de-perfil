import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FATORES,
  MOTIVADORES,
  MAPA_MOTIVACOES,
  DIRECOES_MOMENTO,
} from '../src/motor.js';
import {
  BLOCOS,
  AFIRMACOES,
  PERGUNTAS_MOMENTO,
  ESCALA_CONCORDANCIA,
  ANCORA_A1,
  ANCORA_A2,
  ordemExibicaoA2,
  INCLUIR_ADAPTADO,
} from '../src/dados.js';

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

test('existem 12 afirmacoes alinhadas ao mapa de motivacoes', () => {
  assert.equal(AFIRMACOES.length, MAPA_MOTIVACOES.length);
  for (const afirmacao of AFIRMACOES) {
    assert.equal(typeof afirmacao, 'string');
    assert.ok(afirmacao.length > 20);
  }
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

test('a ordem de exibicao do A2 inverte blocos e opcoes sem perder nada', () => {
  const ordem = ordemExibicaoA2();
  assert.equal(ordem.length, 10);
  assert.deepEqual(
    [...ordem.map((p) => p.indiceCanonico)].sort((a, b) => a - b),
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(ordem[0].indiceCanonico, 9);
  assert.deepEqual(ordem[0].opcoes.map((o) => o.fator), ['A', 'P', 'C', 'E']);
});

test('INCLUIR_ADAPTADO e um booleano', () => {
  assert.equal(typeof INCLUIR_ADAPTADO, 'boolean');
});

test('MOTIVADORES continua com seis codigos', () => {
  assert.equal(MOTIVADORES.length, 6);
});
