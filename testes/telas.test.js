import test from 'node:test';
import assert from 'node:assert/strict';
import { montarSequencia, CHAVE, htmlAbertura } from '../src/telas.js';
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
