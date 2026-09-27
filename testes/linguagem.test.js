import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOCOS, PERGUNTAS_MOMENTO } from '../src/dados.js';
import * as TEXTOS from '../src/textos.js';
import { palavrasFlexionadas, textoFlexionado } from './apoio/linguagem.js';

function todosOsTextos(valor) {
  if (typeof valor === 'string') return [valor];
  if (Array.isArray(valor)) return valor.flatMap(todosOsTextos);
  if (valor && typeof valor === 'object') return Object.values(valor).flatMap(todosOsTextos);
  return [];
}

test('as palavras dos blocos sao neutras', () => {
  for (const opcao of BLOCOS.flat()) {
    assert.deepEqual(palavrasFlexionadas(opcao.palavra), [], `palavra no masculino: ${opcao.palavra}`);
  }
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
