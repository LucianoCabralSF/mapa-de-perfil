import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FATORES,
  pontuarComportamento,
  definirPerfil,
  NOMES_FATOR,
  calcularTensao,
} from '../src/motor.js';

test('FATORES esta na ordem canonica', () => {
  assert.deepEqual(FATORES, ['E', 'C', 'P', 'A']);
});

test('dez respostas iguais levam o fator ao extremo', () => {
  const respostas = Array.from({ length: 10 }, () => ({ mais: 'E', menos: 'P' }));
  const { brutos, pct } = pontuarComportamento(respostas);
  assert.equal(brutos.E, 10);
  assert.equal(brutos.P, -10);
  assert.equal(brutos.C, 0);
  assert.equal(brutos.A, 0);
  assert.equal(pct.E, 100);
  assert.equal(pct.P, 0);
  assert.equal(pct.C, 50);
});

test('a soma dos brutos e sempre zero', () => {
  const respostas = [
    { mais: 'E', menos: 'A' }, { mais: 'C', menos: 'P' },
    { mais: 'A', menos: 'E' }, { mais: 'P', menos: 'C' },
    { mais: 'E', menos: 'C' }, { mais: 'C', menos: 'A' },
    { mais: 'P', menos: 'E' }, { mais: 'A', menos: 'P' },
    { mais: 'E', menos: 'P' }, { mais: 'C', menos: 'E' },
  ];
  const { brutos } = pontuarComportamento(respostas);
  const soma = FATORES.reduce((acc, f) => acc + brutos[f], 0);
  assert.equal(soma, 0);
});

test('resposta em branco no bloco nao pontua nada', () => {
  const respostas = [{ mais: null, menos: null }];
  const { brutos } = pontuarComportamento(respostas);
  assert.deepEqual(brutos, { E: 0, C: 0, P: 0, A: 0 });
});


test('dominante e o de maior bruto e sem apoio quando a distancia passa de 2', () => {
  const perfil = definirPerfil({ E: 8, C: 2, P: -4, A: -6 });
  assert.equal(perfil.dominante, 'E');
  assert.equal(perfil.apoio, null);
  assert.equal(perfil.titulo, 'Executor');
});

test('segundo proximo vira apoio', () => {
  const perfil = definirPerfil({ E: 5, C: 4, P: -4, A: -5 });
  assert.equal(perfil.dominante, 'E');
  assert.equal(perfil.apoio, 'C');
  assert.equal(perfil.titulo, 'Executor com apoio de Comunicador');
});

test('distancia de exatamente 2 ainda conta como apoio', () => {
  const perfil = definirPerfil({ E: 5, C: 3, P: -4, A: -4 });
  assert.equal(perfil.apoio, 'C');
});

test('empate absoluto cai na ordem canonica e nao quebra', () => {
  const perfil = definirPerfil({ E: 0, C: 0, P: 0, A: 0 });
  assert.equal(perfil.dominante, 'E');
  assert.equal(perfil.apoio, 'C');
  assert.equal(perfil.titulo, 'Executor com apoio de Comunicador');
});

test('empate no topo usa a ordem canonica para desempatar', () => {
  const perfil = definirPerfil({ E: -2, C: 6, P: 6, A: -10 });
  assert.equal(perfil.dominante, 'C');
  assert.equal(perfil.apoio, 'P');
});

test('NOMES_FATOR cobre os quatro fatores', () => {
  assert.deepEqual(Object.keys(NOMES_FATOR).sort(), ['A', 'C', 'E', 'P']);
});

test('natural igual a adaptado da tensao zero e nenhum fator apontado', () => {
  const pct = { E: 70, C: 40, P: 50, A: 40 };
  const tensao = calcularTensao(pct, pct);
  assert.equal(tensao.indice, 0);
  assert.equal(tensao.faixa, 'baixa');
  assert.equal(tensao.forcado, null);
  assert.equal(tensao.contido, null);
});

test('perfis opostos dao tensao alta', () => {
  const natural = { E: 100, C: 0, P: 100, A: 0 };
  const adaptado = { E: 0, C: 100, P: 0, A: 100 };
  const tensao = calcularTensao(natural, adaptado);
  assert.equal(tensao.indice, 100);
  assert.equal(tensao.faixa, 'alta');
});

test('aponta o fator mais forcado e o mais contido', () => {
  const natural = { E: 30, C: 60, P: 50, A: 60 };
  const adaptado = { E: 75, C: 35, P: 50, A: 60 };
  const tensao = calcularTensao(natural, adaptado);
  assert.equal(tensao.forcado, 'E');
  assert.equal(tensao.contido, 'C');
});

test('diferencas menores que 5 nao apontam fator', () => {
  const natural = { E: 50, C: 50, P: 50, A: 50 };
  const adaptado = { E: 54, C: 47, P: 50, A: 49 };
  const tensao = calcularTensao(natural, adaptado);
  assert.equal(tensao.forcado, null);
  assert.equal(tensao.contido, null);
});

test('as tres faixas respeitam os limites da especificacao', () => {
  const base = { E: 50, C: 50, P: 50, A: 50 };
  assert.equal(calcularTensao(base, { E: 59, C: 41, P: 50, A: 50 }).faixa, 'baixa');
  assert.equal(calcularTensao(base, { E: 70, C: 30, P: 50, A: 50 }).faixa, 'moderada');
  assert.equal(calcularTensao(base, { E: 90, C: 10, P: 50, A: 50 }).faixa, 'alta');
});
