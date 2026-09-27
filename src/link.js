// Resultado compartilhavel por link, sem servidor: as respostas vao
// compactadas depois do "#" do endereco. Essa parte nunca e enviada ao
// servidor; o relatorio e montado no aparelho de quem abre o link.
import { URL_PUBLICA } from './compartilhar.js';

// Um caractere por codigo. '-' marca resposta em branco.
const FATOR = { E: 'E', C: 'C', P: 'P', A: 'A' };
const ESTILO = { COL: 'O', NEG: 'N', COM: 'M', CED: 'D', EVI: 'V' };
const MOTIVADOR = { REA: 'R', AUT: 'A', SEG: 'S', REC: 'C', PRO: 'P', PER: 'E' };
const MODOS = { resumo: 'r', completo: 'c' };

const inverter = (mapa) => Object.fromEntries(Object.entries(mapa).map(([k, v]) => [v, k]));
const DE_FATOR = inverter(FATOR);
const DE_ESTILO = inverter(ESTILO);
const DE_MOTIVADOR = inverter(MOTIVADOR);
const DE_MODO = inverter(MODOS);

const TAMANHOS = { a1: 12, a2: 6, conflito: 6, b: 15, emocoes: 16, c: 5 };

function paraBase64Url(texto) {
  const bytes = new TextEncoder().encode(texto);
  let binario = '';
  for (const b of bytes) binario += String.fromCharCode(b);
  return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function deBase64Url(token) {
  const binario = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binario, (c) => c.charCodeAt(0)));
}

const letra = (mapa, codigo) => (codigo === null ? '-' : mapa[codigo]);
const pares = (lista, mapa) => lista.map((r) => letra(mapa, r.mais) + letra(mapa, r.menos)).join('');
const notas = (lista) => lista.map((n) => (n === null ? '0' : String(n))).join('');

export function codificarResultado(respostas, { data, modo }) {
  const compacto = {
    v: 3,
    m: MODOS[modo],
    d: data,
    n: respostas.nome,
    x: respostas.contexto,
    a: pares(respostas.a1, FATOR),
    t: respostas.a2 ? pares(respostas.a2, FATOR) : '',
    f: pares(respostas.conflito, ESTILO),
    b: respostas.b.map((m) => letra(MOTIVADOR, m)).join(''),
    e: notas(respostas.emocoes),
    c: notas(respostas.c),
  };
  return paraBase64Url(JSON.stringify(compacto));
}

// Cada funcao abaixo devolve null quando o trecho nao tem exatamente o
// formato esperado: link cortado ou alterado nunca vira relatorio.
function lerPares(texto, tamanho, de) {
  if (typeof texto !== 'string' || texto.length !== tamanho * 2) return null;
  const lista = [];
  for (let i = 0; i < texto.length; i += 2) {
    const [x, y] = [texto[i], texto[i + 1]];
    if ((x !== '-' && !de[x]) || (y !== '-' && !de[y])) return null;
    lista.push({ mais: x === '-' ? null : de[x], menos: y === '-' ? null : de[y] });
  }
  return lista;
}

function lerNotas(texto, tamanho) {
  if (typeof texto !== 'string' || !new RegExp(`^[0-5]{${tamanho}}$`).test(texto)) return null;
  return [...texto].map((d) => (d === '0' ? null : Number(d)));
}

function lerMotivadores(texto) {
  if (typeof texto !== 'string' || texto.length !== TAMANHOS.b) return null;
  const lista = [...texto].map((l) => (l === '-' ? null : DE_MOTIVADOR[l]));
  return lista.includes(undefined) ? null : lista;
}

export function decodificarResultado(token) {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]+$/.test(token)) return null;
  let c;
  try {
    c = JSON.parse(deBase64Url(token));
  } catch {
    return null;
  }
  if (!c || c.v !== 3 || !DE_MODO[c.m]) return null;
  if (typeof c.d !== 'string' || !/^\d{2}\/\d{2}\/\d{4}$/.test(c.d)) return null;
  if (typeof c.n !== 'string' || !c.n.trim() || c.n.length > 60) return null;
  if (typeof c.x !== 'string' || c.x.length > 80) return null;

  const respostas = {
    nome: c.n,
    contexto: c.x,
    a1: lerPares(c.a, TAMANHOS.a1, DE_FATOR),
    a2: c.t === '' ? null : lerPares(c.t, TAMANHOS.a2, DE_FATOR),
    conflito: lerPares(c.f, TAMANHOS.conflito, DE_ESTILO),
    b: lerMotivadores(c.b),
    emocoes: lerNotas(c.e, TAMANHOS.emocoes),
    c: lerNotas(c.c, TAMANHOS.c),
  };
  const faltando = ['a1', 'conflito', 'b', 'emocoes', 'c'].some((k) => respostas[k] === null)
    || (c.t !== '' && respostas.a2 === null);
  if (faltando) return null;
  return { respostas, data: c.d, modo: DE_MODO[c.m] };
}

export function linkDoResultado(respostas, opcoes) {
  return `${URL_PUBLICA}#r=${codificarResultado(respostas, opcoes)}`;
}
