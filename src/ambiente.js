// Navegadores embutidos em aplicativos costumam nao salvar PDF.
// Reconhecimento pelo user agent: conservador de proposito, porque um
// falso positivo esconderia o PDF de quem consegue usa-lo.
export function navegadorInterno(ua) {
  const texto = String(ua || '');
  if (/WhatsApp/i.test(texto)) return 'WhatsApp';
  if (/Instagram/i.test(texto)) return 'Instagram';
  if (/FBAN|FBAV|FB_IAB/i.test(texto)) return 'Facebook';
  if (/\bLine\//.test(texto)) return 'Line';
  if (/Android[^)]*;\s*wv\)/i.test(texto)) return 'aplicativo';
  return null;
}
