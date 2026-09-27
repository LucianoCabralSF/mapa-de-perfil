import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularResultado, PARES_MOTIVACAO } from '../src/motor.js';
import { textoCompartilhamento, linkWhatsApp, compartilhar, criarCompartilhador, URL_PUBLICA } from '../src/compartilhar.js';

const resultado = calcularResultado({
  nome: 'Maria Secreta',
  contexto: '',
  a1: Array.from({ length: 10 }, () => ({ mais: 'E', menos: 'A' })),
  a2: null,
  b: PARES_MOTIVACAO.map(([a, b]) => (a === 'PRO' || b === 'PRO' ? 'PRO' : a)),
  c: [1, 1, 5, 5, 5],
});

test('o resumo traz perfil, dois motivadores e o link, sem o nome', () => {
  const texto = textoCompartilhamento(resultado);
  assert.ok(texto.includes(resultado.perfil.titulo));
  assert.ok(texto.includes('Propósito'));
  assert.ok(texto.includes(URL_PUBLICA));
  assert.ok(!texto.includes('Maria'), 'o nome nunca vai no compartilhamento');
});

test('o link do whatsapp codifica acento e simbolo', () => {
  const link = linkWhatsApp('Perfil × Propósito & mais');
  assert.ok(link.startsWith('https://wa.me/?text='));
  assert.ok(!link.includes(' ') && !link.includes('×') && !link.includes('&m'));
  assert.equal(decodeURIComponent(link.split('text=')[1]), 'Perfil × Propósito & mais');
});

test('com compartilhamento nativo nao abre o whatsapp', async () => {
  let aberto = null;
  const navegador = { share: async () => {} };
  const r = await compartilhar('oi', { navegador, abrir: (u) => { aberto = u; } });
  assert.equal(r, 'nativo');
  assert.equal(aberto, null);
});

test('se a pessoa cancelar, nada mais acontece', async () => {
  let aberto = null;
  const erro = Object.assign(new Error('cancelado'), { name: 'AbortError' });
  const navegador = { share: async () => { throw erro; } };
  const r = await compartilhar('oi', { navegador, abrir: (u) => { aberto = u; } });
  assert.equal(r, 'cancelado');
  assert.equal(aberto, null);
});

test('se o nativo falhar por outro motivo, cai no whatsapp', async () => {
  let aberto = null;
  const navegador = { share: async () => { throw new Error('NotAllowedError'); } };
  const r = await compartilhar('oi', { navegador, abrir: (u) => { aberto = u; } });
  assert.equal(r, 'whatsapp');
  assert.ok(aberto.startsWith('https://wa.me/'));
});

test('sem compartilhamento nativo, abre o whatsapp', async () => {
  let aberto = null;
  const r = await compartilhar('oi', { navegador: {}, abrir: (u) => { aberto = u; } });
  assert.equal(r, 'whatsapp');
  assert.ok(aberto.includes('text=oi'));
});

test('segundo toque com a janela nativa ainda aberta nao abre o whatsapp', async () => {
  let aberto = null;
  const erro = Object.assign(new Error('pendente'), { name: 'InvalidStateError' });
  const navegador = { share: async () => { throw erro; } };
  const r = await compartilhar('oi', { navegador, abrir: (u) => { aberto = u; } });
  assert.equal(r, 'cancelado');
  assert.equal(aberto, null);
});

test('toques repetidos enquanto compartilha sao ignorados', async () => {
  let chamadas = 0;
  let aberto = null;
  let liberar;
  const navegador = { share: () => { chamadas += 1; return new Promise((ok) => { liberar = ok; }); } };
  const tocar = criarCompartilhador({ navegador, abrir: (u) => { aberto = u; } });
  const primeiro = tocar('oi');
  const segundo = await tocar('oi');
  assert.equal(segundo, 'ignorado');
  liberar();
  assert.equal(await primeiro, 'nativo');
  assert.equal(chamadas, 1);
  assert.equal(aberto, null);
  navegador.share = async () => { chamadas += 1; };
  assert.equal(await tocar('oi'), 'nativo', 'depois de terminar, aceita novo toque');
  assert.equal(chamadas, 2);
});

test('falha ao abrir o whatsapp nao vira erro solto', async () => {
  const tocar = criarCompartilhador({ navegador: {}, abrir: () => { throw new Error('bloqueado'); } });
  assert.equal(await tocar('oi'), 'falhou');
});
