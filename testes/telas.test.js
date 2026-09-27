import test from 'node:test';
import assert from 'node:assert/strict';
import {
  montarSequencia, CHAVE, htmlAbertura, sessaoValida, assinaturaSequencia, textoPergunta,
} from '../src/telas.js';
import { INCLUIR_ADAPTADO } from '../src/dados.js';

test('a sequencia tem 49 telas de resposta com o adaptado ligado', () => {
  assert.equal(INCLUIR_ADAPTADO, true);
  const telas = montarSequencia();
  const conta = (f) => telas.filter(f).length;
  assert.equal(conta((t) => t.tipo === 'forcada' && t.campo === 'a1'), 12);
  assert.equal(conta((t) => t.tipo === 'forcada' && t.campo === 'a2'), 6);
  assert.equal(conta((t) => t.tipo === 'forcada' && t.campo === 'conflito'), 6);
  assert.equal(conta((t) => t.tipo === 'par'), 15);
  assert.equal(conta((t) => t.tipo === 'multipla' && t.itens[0].campo === 'emocoes'), 8);
  assert.equal(conta((t) => t.tipo === 'multipla' && t.itens[0].campo === 'c'), 2);
  assert.equal(conta((t) => ['forcada', 'par', 'multipla'].includes(t.tipo)), 49);
});

test('nenhuma tela de resposta repete o texto de pergunta de outra', () => {
  const textos = montarSequencia().filter((t) => t.tipo !== 'respiro' && textoPergunta(t)).map(textoPergunta);
  assert.equal(new Set(textos).size, textos.length);
});

test('telas de emocao juntam duas frases', () => {
  const telas = montarSequencia().filter((t) => t.tipo === 'multipla' && t.itens[0].campo === 'emocoes');
  for (const t of telas) assert.equal(t.itens.length, 2);
});

test('toda tela de resposta aponta para uma posicao valida', () => {
  const limites = { a1: 12, a2: 6, conflito: 6, b: 15, emocoes: 16, c: 5 };
  for (const t of montarSequencia()) {
    if (t.tipo === 'forcada') assert.ok(t.indiceResposta >= 0 && t.indiceResposta < limites[t.campo]);
    if (t.tipo === 'par') assert.ok(t.indice < 15);
    if (t.tipo === 'multipla') for (const i of t.itens) assert.ok(i.indice < limites[i.campo]);
  }
});

test('a chave de armazenamento e a da versao 3', () => {
  assert.equal(CHAVE, 'mapa-de-perfil-v3');
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
      a1: Array.from({ length: 12 }, () => ({ mais: 'E', menos: null })),
      a2: Array.from({ length: 6 }, () => ({ mais: null, menos: null })),
      conflito: Array.from({ length: 6 }, () => ({ mais: null, menos: null })),
      b: Array.from({ length: 15 }, () => null),
      emocoes: Array.from({ length: 16 }, () => null),
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
    'bloco do a1 vazio': { a1: [null, ...Array.from({ length: 11 }, () => ({ mais: null, menos: null }))] },
    'fator inexistente': { a1: Array.from({ length: 12 }, () => ({ mais: 'Z', menos: null })) },
    'conflito com estilo estranho': { conflito: Array.from({ length: 6 }, () => ({ mais: 'E', menos: null })) },
    'emocoes curtas': { emocoes: [3, 3] },
    'emocoes fora da escala': { emocoes: Array.from({ length: 16 }, () => 8) },
    'sessao da v2 sem conflito': { conflito: undefined },
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

test('recarregar ou voltar ao relatorio mostra o relatorio de novo', async () => {
  const { criarNavegacao } = await import('../src/telas.js');
  const guardado = new Map();
  globalThis.sessionStorage = {
    getItem: (k) => (guardado.has(k) ? guardado.get(k) : null),
    setItem: (k, v) => { guardado.set(k, String(v)); },
    removeItem: (k) => { guardado.delete(k); },
  };
  globalThis.window = { scrollTo() {} };
  const telas = montarSequencia();
  const sessao = sessaoDeExemplo({ posicao: telas.length - 1 });
  guardado.set(CHAVE, JSON.stringify(sessao));

  const raiz = { innerHTML: '', addEventListener() {}, querySelector: () => null };
  criarNavegacao(raiz).iniciar();

  assert.ok(raiz.innerHTML.includes('rodape-relatorio'), 'o relatorio foi desenhado');
  const depois = JSON.parse(guardado.get(CHAVE) ?? 'null');
  assert.equal(depois?.posicao, telas.length - 1, 'a sessao continua apontando para o relatorio');
});

test('fazer de novo apaga a sessao e volta para a abertura', async () => {
  const { criarNavegacao } = await import('../src/telas.js');
  const guardado = new Map();
  globalThis.sessionStorage = {
    getItem: (k) => (guardado.has(k) ? guardado.get(k) : null),
    setItem: (k, v) => { guardado.set(k, String(v)); },
    removeItem: (k) => { guardado.delete(k); },
  };
  globalThis.window = { scrollTo() {}, confirm: () => true };
  const telas = montarSequencia();
  guardado.set(CHAVE, JSON.stringify(sessaoDeExemplo({ posicao: telas.length - 1 })));

  let aoClicar = null;
  const raiz = { innerHTML: '', addEventListener: (_, fn) => { aoClicar = fn; }, querySelector: () => null };
  criarNavegacao(raiz).iniciar();
  const botao = { dataset: { acao: 'refazer' } };
  aoClicar({ target: { closest: () => botao } });

  assert.ok(raiz.innerHTML.includes('data-acao="comecar"'), 'voltou para a abertura');
  const depois = JSON.parse(guardado.get(CHAVE) ?? 'null');
  assert.ok(!depois || depois.posicao === 0, 'a sessao do relatorio anterior foi descartada');
  assert.ok(!depois || depois.respostas.nome === '', 'o nome anterior foi apagado');
});

test('reabrir uma tela de duas frases com uma respondida nao avanca sozinho', async () => {
  const { criarNavegacao } = await import('../src/telas.js');
  const guardado = new Map();
  globalThis.sessionStorage = {
    getItem: (k) => (guardado.has(k) ? guardado.get(k) : null),
    setItem: (k, v) => { guardado.set(k, String(v)); },
    removeItem: (k) => { guardado.delete(k); },
  };
  globalThis.window = { scrollTo() {} };
  const telas = montarSequencia();
  const pos = telas.findIndex((t) => t.tipo === 'multipla' && t.itens[0].campo === 'emocoes');
  const sessao = sessaoDeExemplo({ posicao: pos });
  sessao.respostas.emocoes[telas[pos].itens[0].indice] = 4;
  guardado.set(CHAVE, JSON.stringify(sessao));
  const raiz = { innerHTML: '', addEventListener() {}, querySelector: () => null };
  criarNavegacao(raiz).iniciar();
  await new Promise((ok) => setTimeout(ok, 400));
  assert.equal(JSON.parse(guardado.get(CHAVE)).posicao, pos, 'continua na mesma tela');
  assert.match(raiz.innerHTML, /data-valor="4"[^>]*aria-pressed="true"|aria-pressed="true"[^>]*data-valor="4"/);
});

function navegarComCliques(posicao) {
  return import('../src/telas.js').then(({ criarNavegacao }) => {
    const guardado = new Map();
    globalThis.sessionStorage = {
      getItem: (k) => (guardado.has(k) ? guardado.get(k) : null),
      setItem: (k, v) => { guardado.set(k, String(v)); },
      removeItem: (k) => { guardado.delete(k); },
    };
    globalThis.window = { scrollTo() {}, confirm: () => true };
    guardado.set(CHAVE, JSON.stringify(sessaoDeExemplo({ posicao })));
    let aoClicar = null;
    const raiz = {
      innerHTML: '', addEventListener: (_, fn) => { aoClicar = fn; },
      querySelector: () => null, querySelectorAll: () => [],
    };
    criarNavegacao(raiz).iniciar();
    const clicar = (dataset) => aoClicar({ target: { closest: () => ({ dataset }) } });
    const posicaoAtual = () => JSON.parse(guardado.get(CHAVE)).posicao;
    return { clicar, posicaoAtual };
  });
}

const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));

test('corrigir rapido uma resposta numa tela de frases avanca uma unica tela', async () => {
  const telas = montarSequencia();
  const pos = telas.findIndex((t) => t.tipo === 'multipla' && t.itens[0].campo === 'emocoes');
  const { clicar, posicaoAtual } = await navegarComCliques(pos);
  const [i0, i1] = telas[pos].itens.map((i) => String(i.indice));
  clicar({ acao: 'multipla', campo: 'emocoes', indice: i0, valor: '3' });
  clicar({ acao: 'multipla', campo: 'emocoes', indice: i1, valor: '3' });
  clicar({ acao: 'multipla', campo: 'emocoes', indice: i1, valor: '4' });
  await esperar(400);
  assert.equal(posicaoAtual(), pos + 1);
});

test('toque duplo no segundo passo da escolha forcada avanca uma unica tela', async () => {
  const telas = montarSequencia();
  const pos = telas.findIndex((t) => t.tipo === 'forcada');
  const { clicar, posicaoAtual } = await navegarComCliques(pos);
  clicar({ acao: 'forcada', codigo: 'E' });
  clicar({ acao: 'forcada', codigo: 'A' });
  clicar({ acao: 'forcada', codigo: 'A' });
  await esperar(400);
  assert.equal(posicaoAtual(), pos + 1);
});

test('toque duplo num par avanca uma unica tela', async () => {
  const telas = montarSequencia();
  const pos = telas.findIndex((t) => t.tipo === 'par');
  const { clicar, posicaoAtual } = await navegarComCliques(pos);
  clicar({ acao: 'par', codigo: telas[pos].esquerda.codigo });
  clicar({ acao: 'par', codigo: telas[pos].esquerda.codigo });
  await esperar(400);
  assert.equal(posicaoAtual(), pos + 1);
});

test('voltar logo depois de completar uma tela nao e desfeito pelo avanco agendado', async () => {
  const telas = montarSequencia();
  const pos = telas.findIndex((t) => t.tipo === 'par');
  const { clicar, posicaoAtual } = await navegarComCliques(pos);
  clicar({ acao: 'par', codigo: telas[pos].direita.codigo });
  clicar({ acao: 'voltar' });
  await esperar(400);
  assert.equal(posicaoAtual(), pos - 1);
});
