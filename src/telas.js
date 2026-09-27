import {
  BLOCOS, PERGUNTAS_MOMENTO, ESCALA_CONCORDANCIA,
  ANCORA_A1, ANCORA_A2, ordemExibicaoA2, montarPares, INCLUIR_ADAPTADO,
} from './dados.js';
import { calcularResultado, PARES_MOTIVACAO, BLOCOS_ADAPTADO } from './motor.js';
import { montarRelatorio, escaparHtml } from './relatorio.js';
import { compartilhar, textoCompartilhamento } from './compartilhar.js';

// v2: formato de respostas mudou (A2 com 6 blocos, motivacoes em pares).
// Sessao salva na v1 simplesmente nao e lida.
export const CHAVE = 'mapa-de-perfil-v2';
const ATRASO_AVANCO = 250;

// ---------- Persistencia protegida ----------
// sessionStorage pode estar indisponivel (aba privada, politica do
// navegador). Nesses casos o teste continua: perde-se apenas a
// recuperacao apos recarregar.

function salvarEstado(estado) {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    /* segue sem salvar */
  }
}

function lerEstado() {
  try {
    const bruto = sessionStorage.getItem(CHAVE);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

function limparEstado() {
  try {
    sessionStorage.removeItem(CHAVE);
  } catch {
    /* nada a fazer */
  }
}

// ---------- Sequencia de telas ----------

export function montarSequencia() {
  const telas = [{ tipo: 'abertura' }, { tipo: 'identificacao' }];
  const etapas = INCLUIR_ADAPTADO ? 4 : 3;
  let etapa = 1;

  BLOCOS.forEach((opcoes, indice) => {
    telas.push({
      tipo: 'forcada', campo: 'a1', indiceResposta: indice, opcoes, ancora: ANCORA_A1, etapa, etapas,
    });
  });

  if (INCLUIR_ADAPTADO) {
    etapa += 1;
    telas.push({
      tipo: 'respiro',
      texto: 'Primeira parte concluída. Agora as mesmas palavras voltam, de propósito.',
      detalhe: 'Desta vez, pense no seu trabalho de hoje: como você precisa ser ali, não como você é.',
      tempo: 'Faltam cerca de 7 minutos.',
    });
    ordemExibicaoA2().forEach((item) => {
      telas.push({
        tipo: 'forcada',
        campo: 'a2',
        indiceResposta: item.posicao,
        opcoes: item.opcoes,
        ancora: ANCORA_A2,
        etapa,
        etapas,
      });
    });
  }

  etapa += 1;
  telas.push({
    tipo: 'respiro',
    texto: 'Acabaram as palavras.',
    detalhe: 'Agora são pares de frases sobre trabalho. Em cada tela, toque na que pesa mais para você. É rápido.',
    tempo: 'Faltam cerca de 4 minutos.',
  });
  montarPares().forEach((par, indice) => {
    telas.push({
      tipo: 'par', campo: 'b', indice, esquerda: par.esquerda, direita: par.direita, etapa, etapas,
    });
  });

  etapa += 1;
  telas.push({
    tipo: 'respiro',
    texto: 'Última etapa, a mais curta.',
    detalhe: 'Cinco perguntas sobre o seu momento de vida. Elas ajudam a saber o quanto o resultado pode estar sendo afetado pela fase que você está vivendo.',
    tempo: 'Falta cerca de 1 minuto.',
  });
  PERGUNTAS_MOMENTO.forEach((texto, indice) => {
    telas.push({ tipo: 'escala', campo: 'c', indice, texto, etapa, etapas });
  });

  telas.push({ tipo: 'relatorio' });
  return telas;
}

// ---------- Navegacao ----------

export function criarNavegacao(raiz) {
  const telas = montarSequencia();
  let posicao = 0;
  let passo = 'mais';
  let respostas = estadoInicial();
  let ultimoResultado = null;

  function estadoInicial() {
    return {
      nome: '',
      contexto: '',
      a1: BLOCOS.map(() => ({ mais: null, menos: null })),
      a2: INCLUIR_ADAPTADO ? BLOCOS_ADAPTADO.map(() => ({ mais: null, menos: null })) : null,
      b: PARES_MOTIVACAO.map(() => null),
      c: PERGUNTAS_MOMENTO.map(() => null),
    };
  }

  function guardar() {
    salvarEstado({ posicao, respostas });
  }

  function retomar() {
    const salvo = lerEstado();
    if (!salvo || typeof salvo.posicao !== 'number' || !salvo.respostas) return;
    if (salvo.posicao < 0 || salvo.posicao >= telas.length) return;
    respostas = { ...estadoInicial(), ...salvo.respostas };
    posicao = salvo.posicao;
  }

  function avancar() {
    posicao = Math.min(posicao + 1, telas.length - 1);
    passo = 'mais';
    guardar();
    desenhar();
  }

  function voltarTela() {
    posicao = Math.max(posicao - 1, 0);
    passo = 'mais';
    guardar();
    desenhar();
  }

  function progresso(tela) {
    const daEtapa = telas.filter((t) => t.etapa === tela.etapa);
    const indice = daEtapa.indexOf(tela);
    const pct = Math.round(((indice + 1) / daEtapa.length) * 100);
    return '<div class="progresso">'
      + `<p class="etapa">Etapa ${tela.etapa} de ${tela.etapas}</p>`
      + `<div class="progresso-trilho"><div class="progresso-preenchido" style="width:${pct}%"></div></div>`
      + '</div>';
  }

  function botaoVoltar() {
    return '<button type="button" class="voltar" data-acao="voltar">‹ voltar</button>';
  }

  // ----- Telas -----

  function telaAbertura() {
    return '<div class="tela">'
      + '<p class="kicker">DEL / LÓTUS</p>'
      + '<h1>Mapa de Perfil.</h1>'
      + '<p>Um retrato de como você age, do que te move e de quanto o seu momento de '
      + 'vida está influenciando as duas coisas.</p>'
      + '<p>São cerca de 10 minutos. Responda sem pensar muito: a primeira reação costuma '
      + 'ser a mais verdadeira.</p>'
      + '<p>Em várias telas você vai escolher entre palavras que talvez combinem todas com '
      + 'você, ou nenhuma. Escolha a que <strong>mais</strong> e a que <strong>menos</strong> '
      + 'se parece com você. A comparação é entre elas, não com o mundo.</p>'
      + '<p class="aviso-abertura">Nada do que você responder é gravado em servidor. '
      + 'O resultado aparece aqui no seu aparelho e some quando você fechar esta aba.</p>'
      + '<button type="button" class="botao-principal" data-acao="comecar">Começar</button>'
      + '</div>';
  }

  function telaIdentificacao() {
    return '<div class="tela">'
      + '<p class="kicker">ANTES DE COMEÇAR</p>'
      + '<h1>Como podemos te chamar?</h1>'
      + '<label class="campo"><span>Seu primeiro nome</span>'
      + `<input type="text" id="campo-nome" maxlength="40" value="${escaparHtml(respostas.nome)}" autocomplete="given-name"></label>`
      + '<label class="campo"><span>Cargo ou área de interesse (opcional)</span>'
      + `<input type="text" id="campo-contexto" maxlength="60" value="${escaparHtml(respostas.contexto)}"></label>`
      + '<button type="button" class="botao-principal" data-acao="identificar">Continuar</button>'
      + botaoVoltar()
      + '</div>';
  }

  function telaRespiro(tela) {
    return '<div class="tela">'
      + `<p class="respiro-texto">${escaparHtml(tela.texto)}</p>`
      + `<p>${escaparHtml(tela.detalhe)}</p>`
      + `<p class="respiro-tempo">${escaparHtml(tela.tempo)}</p>`
      + '<button type="button" class="botao-principal" data-acao="seguir">Seguir</button>'
      + '</div>';
  }

  function telaForcada(tela) {
    const resposta = respostas[tela.campo][tela.indiceResposta];
    const pergunta = passo === 'mais'
      ? 'Qual MAIS combina com você?'
      : 'E qual MENOS combina com você?';

    const opcoes = tela.opcoes.map((opcao) => {
      const marcada = passo === 'menos' && resposta.mais === opcao.fator;
      const classe = marcada ? 'opcao marcada bloqueada' : 'opcao';
      return `<button type="button" class="${classe}" data-acao="forcada" data-fator="${opcao.fator}">${escaparHtml(opcao.palavra)}</button>`;
    }).join('');

    return '<div class="tela">'
      + progresso(tela)
      + `<p class="ancora">${escaparHtml(tela.ancora)}</p>`
      + `<p class="pergunta">${pergunta}</p>`
      + `<div class="opcoes">${opcoes}</div>`
      + botaoVoltar()
      + '</div>';
  }

  function telaEscala(tela) {
    const atual = respostas[tela.campo][tela.indice];
    const itens = ESCALA_CONCORDANCIA.map((ponto) => {
      const classe = atual === ponto.valor ? 'escala-item marcada' : 'escala-item';
      return `<button type="button" class="${classe}" data-acao="escala" data-valor="${ponto.valor}">${ponto.rotulo}</button>`;
    }).join('');

    return '<div class="tela">'
      + progresso(tela)
      + `<p class="pergunta">${escaparHtml(tela.texto)}</p>`
      + `<div class="escala">${itens}</div>`
      + botaoVoltar()
      + '</div>';
  }

  function telaPar(tela) {
    const atual = respostas.b[tela.indice];
    const botao = (lado) => {
      const classe = atual === lado.codigo ? 'opcao marcada' : 'opcao';
      return `<button type="button" class="${classe}" data-acao="par" data-codigo="${lado.codigo}">`
        + `${escaparHtml(lado.frase)}</button>`;
    };
    return '<div class="tela">'
      + progresso(tela)
      + '<p class="ancora">No trabalho, o que pesa mais para você?</p>'
      + '<p class="pergunta">Escolha uma das duas.</p>'
      + `<div class="opcoes">${botao(tela.esquerda)}<p class="ou" aria-hidden="true">ou</p>${botao(tela.direita)}</div>`
      + botaoVoltar()
      + '</div>';
  }

  function telaRelatorio() {
    limparEstado();
    ultimoResultado = calcularResultado(respostas);
    return montarRelatorio(ultimoResultado);
  }

  function desenhar() {
    const tela = telas[posicao];
    if (tela.tipo === 'abertura') raiz.innerHTML = telaAbertura();
    else if (tela.tipo === 'identificacao') raiz.innerHTML = telaIdentificacao();
    else if (tela.tipo === 'respiro') raiz.innerHTML = telaRespiro(tela);
    else if (tela.tipo === 'forcada') raiz.innerHTML = telaForcada(tela);
    else if (tela.tipo === 'escala') raiz.innerHTML = telaEscala(tela);
    else if (tela.tipo === 'par') raiz.innerHTML = telaPar(tela);
    else raiz.innerHTML = telaRelatorio();
    window.scrollTo(0, 0);
  }

  // ----- Acoes -----

  function responderForcada(fator) {
    const tela = telas[posicao];
    const resposta = respostas[tela.campo][tela.indiceResposta];

    if (passo === 'mais') {
      resposta.mais = fator;
      resposta.menos = null;
      passo = 'menos';
      guardar();
      desenhar();
      return;
    }

    resposta.menos = fator;
    guardar();
    marcarEsperando(fator);
    setTimeout(avancar, ATRASO_AVANCO);
  }

  function responderEscala(valor) {
    const tela = telas[posicao];
    respostas[tela.campo][tela.indice] = valor;
    guardar();
    marcarEsperando(String(valor), 'valor');
    setTimeout(avancar, ATRASO_AVANCO);
  }

  function responderPar(codigo) {
    const tela = telas[posicao];
    respostas.b[tela.indice] = codigo;
    guardar();
    marcarEsperando(codigo, 'codigo');
    setTimeout(avancar, ATRASO_AVANCO);
  }

  function marcarEsperando(valor, atributo = 'fator') {
    const alvo = raiz.querySelector(`[data-${atributo}="${valor}"]`);
    if (alvo) alvo.classList.add('marcada');
  }

  function identificar() {
    const nome = raiz.querySelector('#campo-nome');
    const contexto = raiz.querySelector('#campo-contexto');
    if (!nome.value.trim()) {
      nome.focus();
      return;
    }
    respostas.nome = nome.value.trim();
    respostas.contexto = contexto.value.trim();
    avancar();
  }

  function voltarForcada() {
    if (passo === 'menos') {
      const tela = telas[posicao];
      respostas[tela.campo][tela.indiceResposta] = { mais: null, menos: null };
      passo = 'mais';
      guardar();
      desenhar();
      return;
    }
    voltarTela();
  }

  function aoClicar(evento) {
    const alvo = evento.target.closest('[data-acao]');
    if (!alvo) return;
    const acao = alvo.dataset.acao;

    if (acao === 'comecar' || acao === 'seguir') avancar();
    else if (acao === 'identificar') identificar();
    else if (acao === 'forcada') responderForcada(alvo.dataset.fator);
    else if (acao === 'escala') responderEscala(Number(alvo.dataset.valor));
    else if (acao === 'par') responderPar(alvo.dataset.codigo);
    else if (acao === 'imprimir') window.print();
    else if (acao === 'compartilhar' && ultimoResultado) {
      compartilhar(textoCompartilhamento(ultimoResultado), {
        navegador: navigator,
        abrir: (url) => window.open(url, '_blank', 'noopener'),
      });
    }
    else if (acao === 'voltar') {
      if (telas[posicao].tipo === 'forcada') voltarForcada();
      else voltarTela();
    }
  }

  return {
    iniciar() {
      retomar();
      raiz.addEventListener('click', aoClicar);
      desenhar();
    },
  };
}
