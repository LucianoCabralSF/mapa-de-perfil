import test from 'node:test';
import assert from 'node:assert/strict';
import { FATORES, MOTIVADORES } from '../src/motor.js';
import {
  RETRATOS,
  FORTES,
  ATENCAO,
  COMUNICACAO,
  AMBIENTE,
  MOTIVADOR_ALTO,
  MOTIVADOR_BAIXO,
  TEXTO_TENSAO,
  FATOR_FORCADO,
  FATOR_CONTIDO,
  TEXTO_ALINHADO,
  TEXTO_MOMENTO,
  ALERTA_REFORCADO,
  FECHAMENTO_RESSALVA,
  RODAPE_LEGAL,
} from '../src/textos.js';

test('todo fator tem retrato, fortes, atencao, comunicacao e ambiente', () => {
  for (const f of FATORES) {
    assert.ok(RETRATOS[f], `falta retrato de ${f}`);
    assert.equal(FORTES[f].length, 5, `${f} precisa de 5 pontos fortes`);
    assert.equal(ATENCAO[f].length, 5, `${f} precisa de 5 pontos de atencao`);
    assert.ok(COMUNICACAO[f], `falta comunicacao de ${f}`);
    assert.ok(AMBIENTE[f], `falta ambiente de ${f}`);
  }
});

test('retratos tem tamanho de retrato, nao de legenda', () => {
  for (const f of FATORES) {
    const palavras = RETRATOS[f].trim().split(/\s+/).length;
    assert.ok(palavras >= 50 && palavras <= 90, `retrato de ${f} tem ${palavras} palavras`);
  }
});

test('todo motivador tem as duas versoes de texto', () => {
  for (const m of MOTIVADORES) {
    assert.ok(MOTIVADOR_ALTO[m], `falta texto alto de ${m}`);
    assert.ok(MOTIVADOR_BAIXO[m], `falta texto baixo de ${m}`);
  }
});

test('as tres faixas de tensao e as tres de momento tem texto', () => {
  for (const faixa of ['baixa', 'moderada', 'alta']) {
    assert.ok(TEXTO_TENSAO[faixa], `falta texto de tensao ${faixa}`);
  }
  for (const faixa of ['estavel', 'movimento', 'turbulento']) {
    assert.ok(TEXTO_MOMENTO[faixa], `falta texto de momento ${faixa}`);
  }
});

test('todo fator tem texto de forcado e de contido', () => {
  for (const f of FATORES) {
    assert.ok(FATOR_FORCADO[f], `falta forcado de ${f}`);
    assert.ok(FATOR_CONTIDO[f], `falta contido de ${f}`);
  }
  assert.ok(TEXTO_ALINHADO);
});

test('textos fixos de ressalva existem', () => {
  assert.ok(ALERTA_REFORCADO.length > 40);
  assert.ok(FECHAMENTO_RESSALVA.length > 40);
  assert.ok(RODAPE_LEGAL.includes('psicológico'));
});

test('nenhum ponto de atencao acusa a pessoa', () => {
  const acusacoes = /\bvocê é (precipitado|teimoso|lento|frio|bagunçado|desorganizado)\b/i;
  for (const f of FATORES) {
    for (const item of ATENCAO[f]) {
      assert.doesNotMatch(item, acusacoes, `texto acusatorio em ${f}: ${item}`);
    }
  }
});

test('nenhum texto sugere largar o emprego', () => {
  const proibido = /(pedir demiss|largar o emprego|trocar de carreira|procurar outro emprego)/i;
  const todos = [
    ...Object.values(RETRATOS),
    ...Object.values(COMUNICACAO),
    ...Object.values(AMBIENTE),
    ...Object.values(TEXTO_TENSAO),
    ...Object.values(FATOR_FORCADO),
    ...Object.values(FATOR_CONTIDO),
    ...Object.values(TEXTO_MOMENTO),
    ALERTA_REFORCADO,
    FECHAMENTO_RESSALVA,
  ];
  for (const texto of todos) {
    assert.doesNotMatch(texto, proibido, `texto sugere sair do emprego: ${texto}`);
  }
});
