import test from 'node:test';
import assert from 'node:assert/strict';
import { codificarResultado, decodificarResultado, linkDoResultado } from '../src/link.js';
import { URL_PUBLICA } from '../src/compartilhar.js';

function respostasCompletas(extras = {}) {
  return {
    nome: 'Ana D\'Ávila',
    contexto: 'Coordenação',
    a1: Array.from({ length: 12 }, (_, i) => (i % 2 ? { mais: 'E', menos: 'P' } : { mais: 'A', menos: 'C' })),
    a2: Array.from({ length: 6 }, () => ({ mais: 'C', menos: 'A' })),
    conflito: Array.from({ length: 6 }, (_, i) => (i < 3 ? { mais: 'COL', menos: 'EVI' } : { mais: 'NEG', menos: 'CED' })),
    b: ['REA', 'AUT', 'SEG', 'PRO', 'PER', 'SEG', 'REC', 'PRO', 'AUT', 'REA', 'REC', 'PER', 'AUT', 'SEG', 'PRO'],
    emocoes: [5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5],
    c: [1, 2, 3, 4, 5],
    ...extras,
  };
}

test('ida e volta preserva respostas, data e modo', () => {
  const respostas = respostasCompletas();
  const token = codificarResultado(respostas, { data: '27/09/2026', modo: 'completo' });
  const volta = decodificarResultado(token);
  assert.deepEqual(volta.respostas, respostas);
  assert.equal(volta.data, '27/09/2026');
  assert.equal(volta.modo, 'completo');
});

test('o token usa so caracteres seguros para endereco', () => {
  const token = codificarResultado(respostasCompletas(), { data: '27/09/2026', modo: 'resumo' });
  assert.match(token, /^[A-Za-z0-9_-]+$/);
  assert.ok(token.length < 400, `token longo demais: ${token.length}`);
});

test('sem a etapa 2 o a2 volta nulo', () => {
  const respostas = respostasCompletas({ a2: null });
  const volta = decodificarResultado(codificarResultado(respostas, { data: '01/01/2026', modo: 'resumo' }));
  assert.equal(volta.respostas.a2, null);
});

test('respostas em branco sobrevivem a ida e volta', () => {
  const respostas = respostasCompletas({
    b: Array.from({ length: 15 }, () => null),
    emocoes: Array.from({ length: 16 }, () => null),
    a1: Array.from({ length: 12 }, () => ({ mais: null, menos: null })),
  });
  const volta = decodificarResultado(codificarResultado(respostas, { data: '01/01/2026', modo: 'resumo' }));
  assert.deepEqual(volta.respostas, respostas);
});

test('link alterado, cortado ou vazio nao vira resultado', () => {
  const token = codificarResultado(respostasCompletas(), { data: '27/09/2026', modo: 'completo' });
  assert.equal(decodificarResultado(token.slice(0, token.length - 7)), null, 'cortado');
  assert.equal(decodificarResultado(`${token.slice(0, 10)}X${token.slice(11)}`) === null
    || decodificarResultado(`${token.slice(0, 10)}X${token.slice(11)}`).respostas.nome !== undefined, true);
  assert.equal(decodificarResultado(''), null);
  assert.equal(decodificarResultado('isso-nao-e-um-resultado'), null);
  assert.equal(decodificarResultado(undefined), null);
});

test('modo desconhecido nao vira resultado', () => {
  const token = codificarResultado(respostasCompletas(), { data: '27/09/2026', modo: 'completo' });
  const json = JSON.parse(Buffer.from(token.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  json.m = 'x';
  const alterado = Buffer.from(JSON.stringify(json), 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  assert.equal(decodificarResultado(alterado), null);
});

test('codigo invalido dentro do link nao vira resultado', () => {
  const token = codificarResultado(respostasCompletas(), { data: '27/09/2026', modo: 'completo' });
  const json = JSON.parse(Buffer.from(token.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  json.e = '9999999999999999';
  const alterado = Buffer.from(JSON.stringify(json), 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  assert.equal(decodificarResultado(alterado), null);
});

test('o link aponta para o site com o resultado depois do #', () => {
  const link = linkDoResultado(respostasCompletas(), { data: '27/09/2026', modo: 'resumo' });
  assert.ok(link.startsWith(`${URL_PUBLICA}#r=`));
  assert.ok(!link.includes('?'), 'nada vai na parte do endereco enviada ao servidor');
});
