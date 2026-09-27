import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FATORES,
  pontuarComportamento,
  definirPerfil,
  NOMES_FATOR,
  calcularTensao,
  pontuarMotivacoes,
  MAPA_MOTIVACOES,
  MOTIVADORES,
  NOMES_MOTIVADOR,
  pontuarMomento,
  DIRECOES_MOMENTO,
  calcularResultado,
  BLOCOS_ADAPTADO,
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

test('o mapa tem 12 afirmacoes, duas por motivador', () => {
  assert.equal(MAPA_MOTIVACOES.length, 12);
  for (const codigo of MOTIVADORES) {
    assert.equal(MAPA_MOTIVACOES.filter((c) => c === codigo).length, 2, `${codigo} precisa de 2 afirmacoes`);
  }
});

test('afirmacoes do mesmo motivador nao ficam lado a lado', () => {
  for (let i = 1; i < MAPA_MOTIVACOES.length; i += 1) {
    assert.notEqual(MAPA_MOTIVACOES[i], MAPA_MOTIVACOES[i - 1]);
  }
});

test('nota maxima nas duas afirmacoes leva o motivador a 100', () => {
  const respostas = MAPA_MOTIVACOES.map((codigo) => (codigo === 'AUT' ? 5 : 1));
  const ranking = pontuarMotivacoes(respostas);
  assert.equal(ranking[0].codigo, 'AUT');
  assert.equal(ranking[0].bruto, 10);
  assert.equal(ranking[0].pct, 100);
  assert.equal(ranking[ranking.length - 1].pct, 0);
});

test('o ranking traz os seis motivadores em ordem decrescente', () => {
  const respostas = MAPA_MOTIVACOES.map(() => 3);
  const ranking = pontuarMotivacoes(respostas);
  assert.equal(ranking.length, 6);
  for (let i = 1; i < ranking.length; i += 1) {
    assert.ok(ranking[i - 1].pct >= ranking[i].pct);
  }
});

test('empate geral cai na ordem canonica', () => {
  const respostas = MAPA_MOTIVACOES.map(() => 3);
  const ranking = pontuarMotivacoes(respostas);
  assert.deepEqual(ranking.map((m) => m.codigo), MOTIVADORES);
});

test('NOMES_MOTIVADOR cobre os seis codigos', () => {
  assert.deepEqual(Object.keys(NOMES_MOTIVADOR).sort(), [...MOTIVADORES].sort());
});

test('as direcoes seguem a especificacao', () => {
  assert.deepEqual(DIRECOES_MOMENTO, ['direta', 'direta', 'invertida', 'invertida', 'invertida']);
});

test('vida tranquila da momento estavel', () => {
  const { pct, faixa } = pontuarMomento([1, 1, 5, 5, 5]);
  assert.equal(pct, 0);
  assert.equal(faixa, 'estavel');
});

test('vida em crise da momento turbulento', () => {
  const { pct, faixa } = pontuarMomento([5, 5, 1, 1, 1]);
  assert.equal(pct, 100);
  assert.equal(faixa, 'turbulento');
});

test('as perguntas invertidas realmente invertem', () => {
  const soDiretas = pontuarMomento([5, 5, 5, 5, 5]);
  const soInvertidas = pontuarMomento([1, 1, 1, 1, 1]);
  assert.equal(soDiretas.bruto, 8);
  assert.equal(soInvertidas.bruto, 12);
});

test('meio da escala cai na faixa do meio', () => {
  const { pct, faixa } = pontuarMomento([3, 3, 3, 3, 3]);
  assert.equal(pct, 50);
  assert.equal(faixa, 'movimento');
});

function respostasDeExemplo(extras = {}) {
  return {
    nome: 'Maria',
    contexto: '',
    a1: Array.from({ length: 10 }, () => ({ mais: 'E', menos: 'A' })),
    a2: Array.from({ length: 6 }, () => ({ mais: 'A', menos: 'E' })),
    b: MAPA_MOTIVACOES.map((c) => (c === 'PRO' ? 5 : 2)),
    c: [1, 1, 5, 5, 5],
    ...extras,
  };
}

test('resultado completo traz todas as partes', () => {
  const r = calcularResultado(respostasDeExemplo());
  assert.equal(r.nome, 'Maria');
  assert.equal(r.perfil.dominante, 'E');
  assert.equal(r.motivacoes[0].codigo, 'PRO');
  assert.equal(r.momento.faixa, 'estavel');
  assert.equal(r.tensao.faixa, 'alta');
  assert.match(r.data, /^\d{2}\/\d{2}\/\d{4}$/);
});

test('sem bloco adaptado nao existe tensao nenhuma', () => {
  const r = calcularResultado(respostasDeExemplo({ a2: null }));
  assert.equal(r.adaptado, null);
  assert.equal(r.tensao, null);
  assert.equal(r.alertaReforcado, false);
});

test('alerta reforcado exige momento turbulento e tensao alta juntos', () => {
  const turbulento = calcularResultado(respostasDeExemplo({ c: [5, 5, 1, 1, 1] }));
  assert.equal(turbulento.alertaReforcado, true);

  const soTurbulento = calcularResultado(
    respostasDeExemplo({
      c: [5, 5, 1, 1, 1],
      a2: Array.from({ length: 6 }, () => ({ mais: 'E', menos: 'A' })),
    }),
  );
  assert.equal(soTurbulento.tensao.faixa, 'baixa');
  assert.equal(soTurbulento.alertaReforcado, false);
});

test('seis respostas iguais tambem levam o fator ao extremo', () => {
  const respostas = Array.from({ length: 6 }, () => ({ mais: 'E', menos: 'P' }));
  const { brutos, pct } = pontuarComportamento(respostas);
  assert.equal(brutos.E, 6);
  assert.equal(pct.E, 100);
  assert.equal(pct.P, 0);
  assert.equal(pct.C, 50);
});

test('sem nenhum bloco todos os fatores ficam na linha de base', () => {
  assert.deepEqual(pontuarComportamento([]).pct, { E: 50, C: 50, P: 50, A: 50 });
});

test('BLOCOS_ADAPTADO tem 6 indices canonicos distintos', () => {
  assert.deepEqual(BLOCOS_ADAPTADO, [1, 3, 5, 6, 7, 9]);
});

test('a tensao compara o adaptado com os mesmos 6 blocos do natural', () => {
  const a1 = Array.from({ length: 10 }, (_, i) => (
    BLOCOS_ADAPTADO.includes(i) ? { mais: 'C', menos: 'A' } : { mais: 'E', menos: 'P' }
  ));
  const a2 = Array.from({ length: 6 }, () => ({ mais: 'C', menos: 'A' }));
  const r = calcularResultado({ nome: 'X', contexto: '', a1, a2, b: [], c: [1, 1, 5, 5, 5] });
  assert.equal(r.tensao.indice, 0, 'nos blocos comparados as respostas foram identicas');
  assert.deepEqual(r.naturalComparavel.pct, r.adaptado.pct);
  assert.equal(r.perfil.dominante, 'C', 'o perfil continua vindo dos 10 blocos do A1');
});
