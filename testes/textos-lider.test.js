import test from 'node:test';
import assert from 'node:assert/strict';
import * as LIDER from '../src/textos-lider.js';
import { FATORES, MOTIVADORES, ESTILOS_CONFLITO } from '../src/motor.js';
import { textoFlexionado } from './apoio/linguagem.js';

const PRONOMES = /\b(ele|ela|dele|dela|nele|nela|o colaborador|a colaboradora|o funcionário|a funcionária)\b/i;

function textos(valor) {
  if (typeof valor === 'string') return [valor];
  if (Array.isArray(valor)) return valor.flatMap(textos);
  if (valor && typeof valor === 'object') return Object.values(valor).flatMap(textos);
  return [];
}

const TODOS = Object.entries(LIDER).filter(([, v]) => typeof v !== 'function').flatMap(([, v]) => textos(v));

test('todas as chaves da parte 2 existem', () => {
  for (const f of FATORES) {
    assert.ok(LIDER.LIDER_FRASE[f] && LIDER.LIDER_APOIO[f] && LIDER.LIDER_DELEGAR[f] && LIDER.LIDER_DESGASTE[f], `fator ${f}`);
    assert.equal(LIDER.LIDER_COMUNICAR[f].fazer.length, 3);
    assert.equal(LIDER.LIDER_COMUNICAR[f].evitar.length, 3);
    assert.ok(LIDER.PERGUNTA_FATOR[f]);
  }
  for (const m of MOTIVADORES) assert.ok(LIDER.LIDER_RETORNO[m] && LIDER.LIDER_EVITAR[m] && LIDER.PERGUNTA_MOTIVADOR[m], `motivador ${m}`);
  for (const e of ESTILOS_CONFLITO) assert.ok(LIDER.LIDER_CONFLITO[e]?.esperar && LIDER.LIDER_CONFLITO[e]?.conduzir && LIDER.PERGUNTA_CONFLITO[e], `estilo ${e}`);
  for (const t of ['baixa', 'moderada', 'alta']) assert.ok(LIDER.PERGUNTA_TENSAO[t]);
  for (const m of ['estavel', 'movimento', 'turbulento']) assert.ok(LIDER.PERGUNTA_MOMENTO[m]);
  assert.ok(LIDER.LIDER_DESGASTE_TENSAO && LIDER.LIDER_DESGASTE_MOMENTO && LIDER.COMO_USAR);
});

test('a parte 2 nunca usa pronome de genero para a pessoa', () => {
  for (const t of TODOS) assert.doesNotMatch(t, PRONOMES, `pronome de genero: ${t}`);
});

test('a parte 2 usa linguagem neutra', () => {
  for (const t of TODOS) assert.deepEqual(textoFlexionado(LIDER.comNome(t, 'Maria')), [], `masculino: ${t}`);
});

test('as frases principais citam a pessoa pelo nome', () => {
  for (const f of FATORES) assert.ok(LIDER.LIDER_FRASE[f].includes('{nome}'), `frase ${f} sem {nome}`);
});

test('perguntas da conversa individual terminam em interrogacao', () => {
  const perguntas = textos([LIDER.PERGUNTA_MOTIVADOR, LIDER.PERGUNTA_TENSAO, LIDER.PERGUNTA_MOMENTO, LIDER.PERGUNTA_CONFLITO, LIDER.PERGUNTA_FATOR]);
  for (const p of perguntas) assert.ok(p.trim().endsWith('?'), `pergunta: ${p}`);
});

test('como usar deixa claro que nao avalia desempenho nem decide contratacao', () => {
  assert.match(LIDER.COMO_USAR, /desempenho/);
  assert.match(LIDER.COMO_USAR, /contrata/);
});

test('comNome troca todas as ocorrencias', () => {
  assert.equal(LIDER.comNome('{nome} e {nome}', 'Ana'), 'Ana e Ana');
});
