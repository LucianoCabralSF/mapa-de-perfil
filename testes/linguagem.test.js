import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SITUACOES, CENARIOS_CONFLITO, ENQUADRAMENTOS_PARES, FRASES_EMOCAO, PERGUNTAS_MOMENTO, FRASES_MOTIVACAO,
} from '../src/dados.js';
import * as TEXTOS from '../src/textos.js';
import { palavrasFlexionadas, textoFlexionado } from './apoio/linguagem.js';

function todosOsTextos(valor) {
  if (typeof valor === 'string') return [valor];
  if (Array.isArray(valor)) return valor.flatMap(todosOsTextos);
  if (valor && typeof valor === 'object') return Object.values(valor).flatMap(todosOsTextos);
  return [];
}

test('situacoes, cenarios, enquadramentos e frases sao neutros', () => {
  const todos = [
    ...SITUACOES.flatMap((s) => [s.enunciado, ...s.opcoes.map((o) => o.texto)]),
    ...CENARIOS_CONFLITO.flatMap((c) => [c.enunciado, ...c.opcoes.map((o) => o.texto)]),
    ...ENQUADRAMENTOS_PARES, ...FRASES_EMOCAO, ...Object.values(FRASES_MOTIVACAO).flat(),
  ];
  for (const texto of todos) assert.deepEqual(textoFlexionado(texto), [], `texto no masculino: ${texto}`);
});

test('as perguntas do momento sao neutras', () => {
  for (const pergunta of PERGUNTAS_MOMENTO) {
    assert.deepEqual(textoFlexionado(pergunta), [], `pergunta no masculino: ${pergunta}`);
  }
});

test('os textos do relatorio sao neutros', () => {
  for (const texto of todosOsTextos(TEXTOS)) {
    assert.deepEqual(textoFlexionado(texto), [], `texto no masculino: ${texto}`);
  }
});

test('a regua reconhece o que deve reprovar', () => {
  assert.deepEqual(palavrasFlexionadas('Decidido'), ['decidido']);
  assert.deepEqual(palavrasFlexionadas('Foco no resultado'), []);
  assert.deepEqual(textoFlexionado('Você trabalha bem sozinho.'), ['sozinho']);
  assert.deepEqual(textoFlexionado('Você vai direto ao ponto.'), []);
});
