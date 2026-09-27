import { NOMES_MOTIVADOR } from './motor.js';

export const URL_PUBLICA = 'https://lucianocabralsf.github.io/mapa-de-perfil/';

// Mensagem que acompanha o link do resultado. O link abre o que a pessoa
// escolheu compartilhar: so o resumo, ou o relatorio completo.
export function textoCompartilhamento(resultado, modo, link) {
  if (modo === 'completo') {
    return 'Este é o meu relatório do Mapa de Perfil, com orientações para quem me lidera. '
      + `Abra pelo link: ${link}`;
  }
  const [primeiro, segundo] = resultado.motivacoes;
  return `Fiz o Mapa de Perfil da DEL: meu perfil é ${resultado.perfil.titulo}, `
    + `e o que mais me move é ${NOMES_MOTIVADOR[primeiro.codigo]} e `
    + `${NOMES_MOTIVADOR[segundo.codigo]}. Veja meu resumo: ${link}`;
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
      // AbortError: a pessoa fechou a janela. InvalidStateError: ja existe
      // uma janela aberta (toque duplo). Nos dois casos, nada mais acontece.
      if (erro?.name === 'AbortError' || erro?.name === 'InvalidStateError') return 'cancelado';
    }
  }
  abrir(linkWhatsApp(texto));
  return 'whatsapp';
}

// Um toque por vez: enquanto a janela de compartilhar estiver aberta, novos
// toques sao ignorados. Nenhuma falha escapa como erro solto.
export function criarCompartilhador(deps) {
  let emAndamento = false;
  return async (texto) => {
    if (emAndamento) return 'ignorado';
    emAndamento = true;
    try {
      return await compartilhar(texto, deps);
    } catch {
      return 'falhou';
    } finally {
      emAndamento = false;
    }
  };
}
