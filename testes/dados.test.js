import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FATORES,
  MOTIVADORES,
  PARES_MOTIVACAO,
  DIRECOES_MOMENTO,
  ESTILOS_CONFLITO,
  MAPA_EMOCOES,
  BLOCOS_ADAPTADO,
} from '../src/motor.js';
import {
  SITUACOES,
  CENARIOS_CONFLITO,
  ENQUADRAMENTOS_PARES,
  FRASES_EMOCAO,
  ESCALA_FREQUENCIA,
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

const COMECA_POR_VERBO = /^(Me |Te |Se |Nos )?[A-ZÀ-Ú][a-zà-úç]*(o|ou|ei|i)\b/;

function entre(texto, min, max) {
  return texto.length >= min && texto.length <= max;
}

test('12 situacoes, cada uma com 4 reacoes na ordem canonica', () => {
  assert.equal(SITUACOES.length, 12);
  for (const [i, s] of SITUACOES.entries()) {
    assert.ok(entre(s.enunciado, 60, 160) && s.enunciado.endsWith('.'), `enunciado ${i}: ${s.enunciado.length}`);
    assert.deepEqual(s.opcoes.map((o) => o.fator), FATORES, `situacao ${i}`);
    for (const o of s.opcoes) {
      assert.ok(entre(o.texto, 25, 90) && o.texto.endsWith('.'), `reacao longa ou curta: ${o.texto}`);
      assert.match(o.texto, COMECA_POR_VERBO, `reacao nao comeca por verbo na 1a pessoa: ${o.texto}`);
    }
  }
});

test('6 cenarios de conflito, cada um com 5 reacoes na ordem canonica', () => {
  assert.equal(CENARIOS_CONFLITO.length, 6);
  for (const [i, c] of CENARIOS_CONFLITO.entries()) {
    assert.ok(entre(c.enunciado, 60, 160) && c.enunciado.endsWith('.'), `cenario ${i}: ${c.enunciado.length}`);
    assert.deepEqual(c.opcoes.map((o) => o.estilo), ESTILOS_CONFLITO, `cenario ${i}`);
    for (const o of c.opcoes) {
      assert.ok(entre(o.texto, 25, 90) && o.texto.endsWith('.'), `reacao: ${o.texto}`);
      assert.match(o.texto, COMECA_POR_VERBO, `reacao: ${o.texto}`);
    }
  }
});

test('15 enquadramentos de par, distintos', () => {
  assert.equal(ENQUADRAMENTOS_PARES.length, 15);
  assert.equal(new Set(ENQUADRAMENTOS_PARES).size, 15);
  for (const e of ENQUADRAMENTOS_PARES) {
    assert.ok(entre(e, 30, 80) && (e.endsWith(':') || e.endsWith('…')), `enquadramento: ${e}`);
  }
});

test('16 frases de emocao alinhadas ao mapa', () => {
  assert.equal(FRASES_EMOCAO.length, MAPA_EMOCOES.length);
  assert.equal(new Set(FRASES_EMOCAO).size, 16);
  for (const f of FRASES_EMOCAO) assert.ok(entre(f, 40, 110), `frase de emocao: ${f}`);
});

test('escala de frequencia com 5 pontos', () => {
  assert.deepEqual(ESCALA_FREQUENCIA.map((p) => p.valor), [1, 2, 3, 4, 5]);
  assert.equal(ESCALA_FREQUENCIA[0].rotulo, 'Quase nunca');
  assert.equal(ESCALA_FREQUENCIA[4].rotulo, 'Quase sempre');
});

test('nenhum texto se repete entre situacoes e cenarios', () => {
  const todos = [
    ...SITUACOES.flatMap((s) => [s.enunciado, ...s.opcoes.map((o) => o.texto)]),
    ...CENARIOS_CONFLITO.flatMap((c) => [c.enunciado, ...c.opcoes.map((o) => o.texto)]),
  ];
  assert.equal(new Set(todos).size, todos.length);
});

test('a ordem de exibicao do A2 cobre as 6 situacoes, invertida', () => {
  const ordem = ordemExibicaoA2();
  assert.deepEqual(ordem.map((p) => p.indiceCanonico), [...BLOCOS_ADAPTADO].reverse());
  assert.deepEqual(ordem.map((p) => p.posicao), [5, 4, 3, 2, 1, 0]);
  assert.deepEqual(ordem[0].opcoes.map((o) => o.fator), ['A', 'P', 'C', 'E']);
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
  assert.deepEqual(ESCALA_CONCORDANCIA.map((p) => p.valor), [1, 2, 3, 4, 5]);
});

test('as duas ancoras sao textos diferentes', () => {
  assert.notEqual(ANCORA_A1, ANCORA_A2);
  assert.ok(ANCORA_A1.length > 10 && ANCORA_A2.length > 10);
});

test('INCLUIR_ADAPTADO e um booleano', () => {
  assert.equal(typeof INCLUIR_ADAPTADO, 'boolean');
});
