import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

export function ler(arquivo) {
  return readFileSync(new URL(`../${arquivo}`, import.meta.url), 'utf8');
}

export function metas(html) {
  const mapa = {};
  for (const m of html.matchAll(/<meta\s+(?:property|name)="([^"]+)"\s+content="([^"]*)"/g)) {
    mapa[m[1]] = m[2];
  }
  return mapa;
}

const BASE = 'https://lucianocabralsf.github.io/mapa-de-perfil/';

test('a pagina inicial tem as metatags da previa com urls absolutas', () => {
  const m = metas(ler('index.html'));
  assert.ok(m['og:title']);
  assert.ok(m['og:description'] && m['og:description'].length <= 200);
  assert.equal(m['og:url'], BASE);
  assert.equal(m['og:image'], `${BASE}imagens/previa.png`);
  assert.equal(m['og:image:width'], '1200');
  assert.equal(m['og:image:height'], '630');
  assert.ok(m.description);
});

test('a imagem da previa existe e e leve', () => {
  const { size } = statSync(new URL('../imagens/previa.png', import.meta.url));
  assert.ok(size > 5 * 1024, 'imagem vazia ou quebrada');
  assert.ok(size < 300 * 1024, `imagem pesada demais: ${Math.round(size / 1024)} KB`);
});

import { textoFlexionado } from './apoio/linguagem.js';

function textoVisivel(html) {
  return html.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
}

test('a pagina do metodo tem as sete secoes e volta para o teste', () => {
  const html = ler('metodo.html');
  for (let i = 1; i <= 7; i += 1) assert.ok(html.includes(`id="s${i}"`), `falta a secao ${i}`);
  assert.ok(html.includes('href="./"'), 'falta o caminho de volta');
  assert.ok(html.includes('estilos.css'));
});

test('a pagina do metodo declara os limites do instrumento', () => {
  const texto = textoVisivel(ler('metodo.html'));
  assert.match(texto, /não passou por (um )?estudo de validação/i);
  assert.match(texto, /não é (um )?teste psicológico/i);
});

test('a pagina do metodo cita os autores do referencial', () => {
  const texto = textoVisivel(ler('metodo.html'));
  for (const autor of ['MARSTON', 'THURSTONE', 'HOCHSCHILD', 'KRISTOF', 'SCHEIN', 'DECI', 'HOGAN', 'SPIELBERGER', 'HOLMES', 'ROBERTS']) {
    assert.ok(texto.includes(autor), `falta a referencia de ${autor}`);
  }
});

test('a pagina do metodo usa linguagem neutra', () => {
  assert.deepEqual(textoFlexionado(textoVisivel(ler('metodo.html'))), []);
});

test('a pagina do metodo tem previa propria', () => {
  const m = metas(ler('metodo.html'));
  assert.equal(m['og:url'], `${BASE}metodo.html`);
  assert.equal(m['og:image'], `${BASE}imagens/previa.png`);
});

test('o guia do facilitador tem as seis secoes', () => {
  const html = ler('facilitador.html');
  for (let i = 1; i <= 6; i += 1) assert.ok(html.includes(`id="g${i}"`), `falta a secao ${i}`);
});

test('o guia do facilitador nao aparece em buscador nem no site', () => {
  assert.ok(ler('facilitador.html').includes('<meta name="robots" content="noindex, nofollow">'));
  for (const arquivo of ['index.html', 'metodo.html']) {
    assert.ok(!ler(arquivo).includes('facilitador.html'), `${arquivo} nao pode linkar o guia`);
  }
});

test('o guia do facilitador usa linguagem neutra', () => {
  assert.deepEqual(textoFlexionado(textoVisivel(ler('facilitador.html'))), []);
});
