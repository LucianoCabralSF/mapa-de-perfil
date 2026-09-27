import test from 'node:test';
import assert from 'node:assert/strict';
import {
  montarSequencia, CHAVE, htmlAbertura, sessaoValida, assinaturaSequencia,
} from '../src/telas.js';
import { INCLUIR_ADAPTADO } from '../src/dados.js';

const RESPOSTA = new Set(['forcada', 'par', 'escala']);

test('a sequencia tem 36 telas de resposta com o adaptado ligado', () => {
  assert.equal(INCLUIR_ADAPTADO, true);
  const telas = montarSequencia();
  const conta = (filtro) => telas.filter(filtro).length;
  assert.equal(conta((t) => t.tipo === 'forcada' && t.campo === 'a1'), 10);
  assert.equal(conta((t) => t.tipo === 'forcada' && t.campo === 'a2'), 6);
  assert.equal(conta((t) => t.tipo === 'par'), 15);
  assert.equal(conta((t) => t.tipo === 'escala'), 5);
  assert.equal(conta((t) => RESPOSTA.has(t.tipo)), 36);
});

test('toda tela de resposta aponta para uma posicao valida', () => {
  for (const tela of montarSequencia()) {
    if (tela.tipo === 'forcada') {
      const limite = tela.campo === 'a1' ? 10 : 6;
      assert.ok(tela.indiceResposta >= 0 && tela.indiceResposta < limite);
    }
    if (tela.tipo === 'par') assert.ok(tela.indice >= 0 && tela.indice < 15);
  }
});

test('a chave de armazenamento e a da versao 2', () => {
  assert.equal(CHAVE, 'mapa-de-perfil-v2');
});

test('nenhum respiro promete mais tempo do que o anterior', () => {
  const minutos = montarSequencia()
    .filter((t) => t.tipo === 'respiro')
    .map((t) => Number(t.tempo.match(/(\d+)/)[1]));
  for (let i = 1; i < minutos.length; i += 1) assert.ok(minutos[i] < minutos[i - 1]);
});

test('a abertura so avisa quando esta dentro de aplicativo', () => {
  assert.ok(!htmlAbertura({ interno: null }).includes('aviso-navegador'));
  const aviso = htmlAbertura({ interno: 'WhatsApp' });
  assert.ok(aviso.includes('aviso-navegador'));
  assert.ok(aviso.includes('pelo WhatsApp'));
  assert.ok(htmlAbertura({ interno: 'aplicativo' }).includes('dentro de um aplicativo'));
});

test('a abertura leva para a base teorica', () => {
  assert.ok(htmlAbertura({ interno: null }).includes('href="metodo.html"'));
});

function sessaoDeExemplo(extras = {}, respostasExtras = {}) {
  const telas = montarSequencia();
  return {
    posicao: 5,
    assinatura: assinaturaSequencia(telas),
    respostas: {
      nome: 'Ana',
      contexto: '',
      a1: Array.from({ length: 10 }, () => ({ mais: 'E', menos: null })),
      a2: Array.from({ length: 6 }, () => ({ mais: null, menos: null })),
      b: Array.from({ length: 15 }, () => null),
      c: [3, null, null, null, null],
      ...respostasExtras,
    },
    ...extras,
  };
}

test('sessao salva no formato certo e aceita', () => {
  assert.equal(sessaoValida(sessaoDeExemplo(), montarSequencia()), true);
});

test('sessao de outra configuracao do teste e descartada', () => {
  const telas = montarSequencia();
  assert.equal(sessaoValida(sessaoDeExemplo({ assinatura: undefined }), telas), false);
  assert.equal(sessaoValida(sessaoDeExemplo({ assinatura: '30|sem-A2' }), telas), false);
});

test('sessao com respostas no formato errado e descartada', () => {
  const telas = montarSequencia();
  const casos = {
    'a2 ausente com o adaptado ligado': { a2: null },
    'bloco do a1 vazio': { a1: [null, ...Array.from({ length: 9 }, () => ({ mais: null, menos: null }))] },
    'fator inexistente': { a1: Array.from({ length: 10 }, () => ({ mais: 'Z', menos: null })) },
    'a1 curto': { a1: [] },
    'b do formato antigo': { b: Array.from({ length: 12 }, () => 3) },
    'b com codigo estranho': { b: Array.from({ length: 15 }, () => 'XYZ') },
    'c fora da escala': { c: [7, null, null, null, null] },
    'nome que nao e texto': { nome: 42 },
  };
  for (const [nome, respostas] of Object.entries(casos)) {
    assert.equal(sessaoValida(sessaoDeExemplo({}, respostas), telas), false, nome);
  }
});

test('sessao com posicao impossivel e descartada', () => {
  const telas = montarSequencia();
  assert.equal(sessaoValida(sessaoDeExemplo({ posicao: 999 }), telas), false);
  assert.equal(sessaoValida(sessaoDeExemplo({ posicao: 1.5 }), telas), false);
  assert.equal(sessaoValida(sessaoDeExemplo({ posicao: -1 }), telas), false);
  assert.equal(sessaoValida(null, telas), false);
});
