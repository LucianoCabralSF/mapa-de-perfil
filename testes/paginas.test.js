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
