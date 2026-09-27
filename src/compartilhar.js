import { NOMES_MOTIVADOR } from './motor.js';

export const URL_PUBLICA = 'https://lucianocabralsf.github.io/mapa-de-perfil/';

// Resumo sem o nome da pessoa: quem compartilha decide o que expor.
export function textoCompartilhamento(resultado, url = URL_PUBLICA) {
  const [primeiro, segundo] = resultado.motivacoes;
  return `Fiz o Mapa de Perfil da DEL: meu perfil é ${resultado.perfil.titulo}, `
    + `e o que mais me move é ${NOMES_MOTIVADOR[primeiro.codigo]} e `
    + `${NOMES_MOTIVADOR[segundo.codigo]}. Faça o seu: ${url}`;
}

export function linkWhatsApp(texto) {
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

// `navegador` e `abrir` sao injetados para o teste nao depender de browser.
export async function compartilhar(texto, { navegador, abrir }) {
  if (navegador?.share) {
    try {
      await navegador.share({ text: texto });
      return 'nativo';
    } catch (erro) {
      if (erro?.name === 'AbortError') return 'cancelado';
    }
  }
  abrir(linkWhatsApp(texto));
  return 'whatsapp';
}
