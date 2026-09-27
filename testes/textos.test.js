import test from 'node:test';
import assert from 'node:assert/strict';
import { FATORES, MOTIVADORES, ESTILOS_CONFLITO, DOMINIOS_EMOCAO } from '../src/motor.js';
import {
  RETRATOS,
  FORTES,
  ATENCAO,
  SINTESE,
  CONFLITO_VOCE,
  EMOCAO_FORTE,
  EMOCAO_DESENVOLVER,
  EMOCAO_EQUILIBRADO,
  EMOCAO_LEITURA,
  ACAO_FATOR,
  ACAO_EMOCAO,
  ACAO_CONFLITO,
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

const COMBINACOES = ['E', 'C', 'P', 'A', 'EC', 'EP', 'EA', 'CE', 'CP', 'CA', 'PE', 'PC', 'PA', 'AE', 'AC', 'AP'];
const palavras = (t) => t.trim().split(/\s+/).length;

test('todo fator tem fortes e atencao', () => {
  for (const f of FATORES) {
    assert.equal(FORTES[f].length, 5, `${f} precisa de 5 pontos fortes`);
    assert.equal(ATENCAO[f].length, 5, `${f} precisa de 5 pontos de atencao`);
  }
});

test('ha um retrato para cada combinacao de dominante e apoio', () => {
  assert.deepEqual(Object.keys(RETRATOS).sort(), [...COMBINACOES].sort());
  for (const k of COMBINACOES) {
    assert.ok(palavras(RETRATOS[k]) >= 70 && palavras(RETRATOS[k]) <= 120, `retrato ${k}: ${palavras(RETRATOS[k])} palavras`);
  }
});

test('retratos de combinacao nao sao o retrato puro com um acrescimo', () => {
  for (const k of COMBINACOES.filter((x) => x.length === 2)) {
    const puro = new Set(RETRATOS[k[0]].split(/[.!?]\s+/));
    const frases = RETRATOS[k].split(/[.!?]\s+/);
    const repetidas = frases.filter((f) => puro.has(f)).length;
    assert.ok(repetidas <= frases.length / 2, `retrato ${k} repete demais o ${k[0]}`);
  }
});

test('sintese, conflito, emocoes e acoes cobrem todas as chaves', () => {
  for (const f of FATORES) {
    assert.ok(SINTESE[f] && SINTESE[f].length <= 140, `sintese ${f}`);
    assert.ok(ACAO_FATOR[f], `acao ${f}`);
  }
  for (const e of ESTILOS_CONFLITO) {
    assert.ok(CONFLITO_VOCE[e]?.rende && CONFLITO_VOCE[e]?.custa, `conflito ${e}`);
    assert.ok(ACAO_CONFLITO[e], `acao conflito ${e}`);
  }
  for (const d of DOMINIOS_EMOCAO) {
    assert.ok(EMOCAO_FORTE[d] && EMOCAO_DESENVOLVER[d] && ACAO_EMOCAO[d], `emocao ${d}`);
  }
  assert.ok(EMOCAO_EQUILIBRADO && EMOCAO_LEITURA.includes('percep'));
});

test('acoes do plano sao praticas e comecam por verbo no imperativo', () => {
  const acoes = [...Object.values(ACAO_FATOR), ...Object.values(ACAO_EMOCAO), ...Object.values(ACAO_CONFLITO)];
  for (const a of acoes) {
    assert.ok(a.length >= 60 && a.length <= 200, `acao: ${a}`);
    assert.match(a, /^[A-ZÀ-Ú][a-zà-ú]+(e|a|ue|ça|ha)\b/, `acao sem imperativo: ${a}`);
  }
});

test('a ressalva final fala da percepcao de si', () => {
  assert.match(FECHAMENTO_RESSALVA, /percep/);
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
