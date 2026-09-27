const SUFIXOS = ['ado', 'ido', 'oso', 'ivo'];
const EXCECOES = new Set(['resultado', 'lado', 'sentido', 'cuidado', 'período', 'estado']);

// Autodescricoes curtas: nenhuma palavra flexionada no masculino.
export function palavrasFlexionadas(texto) {
  return String(texto)
    .toLowerCase()
    .split(/[^a-zà-úç]+/i)
    .filter((p) => p && !EXCECOES.has(p) && SUFIXOS.some((s) => p.endsWith(s)));
}

// Texto corrido: adjetivos no masculino que descrevem a pessoa.
const MASCULINOS = [
  'sozinho', 'entediado', 'reconhecido', 'satisfeito', 'colocado', 'cobrado',
  'cansado', 'preocupado', 'obrigado', 'convencido', 'sobrecarregado',
  'valorizado', 'visto', 'decidido', 'animado', 'cuidadoso', 'tranquilo',
  'organizado', 'determinado', 'desconfortável demais', 'mais um',
];

export function textoFlexionado(texto) {
  const minusculo = String(texto).toLowerCase();
  return MASCULINOS.filter((termo) => new RegExp(`(^|[^a-zà-úç])${termo}([^a-zà-úç]|$)`, 'i').test(minusculo));
}
