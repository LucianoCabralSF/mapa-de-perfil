import {
  SITUACOES, CENARIOS_CONFLITO, ENQUADRAMENTOS_PARES, FRASES_EMOCAO,
  PERGUNTAS_MOMENTO, ESCALA_CONCORDANCIA, ESCALA_FREQUENCIA,
  ANCORA_A1, ANCORA_A2, ordemExibicaoA2, montarPares, INCLUIR_ADAPTADO,
} from './dados.js';
import {
  calcularResultado, PARES_MOTIVACAO, BLOCOS_ADAPTADO, FATORES, MOTIVADORES,
  ESTILOS_CONFLITO, MAPA_EMOCOES,
} from './motor.js';
import { montarRelatorio, escaparHtml } from './relatorio.js';
import { criarCompartilhador, textoCompartilhamento } from './compartilhar.js';
import { navegadorInterno } from './ambiente.js';

// v3: formato de respostas mudou (12 situacoes, conflito e emocoes).
// Sessoes salvas em versoes anteriores simplesmente nao sao lidas.
export const CHAVE = 'mapa-de-perfil-v3';
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

// ---------- Conferencia da sessao salva ----------
// A sessao salva so e retomada se tiver exatamente o formato que esta
// versao do teste produz. Qualquer diferenca (site atualizado com a aba
// aberta, INCLUIR_ADAPTADO trocado, dado corrompido) faz o teste recomecar.

export function assinaturaSequencia(telas) {
  return `${telas.length}|${INCLUIR_ADAPTADO ? 'A2' : 'sem-A2'}`;
}

function listaDe(valor, tamanho, itemValido) {
  return Array.isArray(valor) && valor.length === tamanho && valor.every(itemValido);
}

function escolhaValida(codigos) {
  const valido = (c) => c === null || codigos.includes(c);
  return (r) => Boolean(r) && typeof r === 'object' && valido(r.mais) && valido(r.menos);
}

const notaValida = (n) => n === null || (Number.isInteger(n) && n >= 1 && n <= 5);

export function sessaoValida(salvo, telas) {
  if (!salvo || typeof salvo !== 'object') return false;
  if (!Number.isInteger(salvo.posicao) || salvo.posicao < 0 || salvo.posicao >= telas.length) return false;
  if (salvo.assinatura !== assinaturaSequencia(telas)) return false;
  const r = salvo.respostas;
  if (!r || typeof r.nome !== 'string' || typeof r.contexto !== 'string') return false;
  if (!listaDe(r.a1, SITUACOES.length, escolhaValida(FATORES))) return false;
  if (INCLUIR_ADAPTADO
    ? !listaDe(r.a2, BLOCOS_ADAPTADO.length, escolhaValida(FATORES))
    : r.a2 !== null) return false;
  if (!listaDe(r.conflito, CENARIOS_CONFLITO.length, escolhaValida(ESTILOS_CONFLITO))) return false;
  if (!listaDe(r.b, PARES_MOTIVACAO.length, (m) => m === null || MOTIVADORES.includes(m))) return false;
  if (!listaDe(r.emocoes, MAPA_EMOCOES.length, notaValida)) return false;
  return listaDe(r.c, PERGUNTAS_MOMENTO.length, notaValida);
}

// ---------- Sequencia de telas ----------

const RESPIROS = {
  a1: {
    texto: 'Etapa 1: como você age.',
    detalhe: 'Doze situações de trabalho. Em cada uma, marque a reação que mais combina com você e a que menos combina.',
    tempo: 'Cerca de 16 minutos no total.',
  },
  a2: {
    texto: 'Etapa 2: no seu trabalho de hoje.',
    detalhe: 'Seis daquelas situações voltam, de propósito. Agora, responda pensando no que o seu trabalho exige de você hoje.',
    tempo: 'Faltam cerca de 11 minutos.',
  },
  conflito: {
    texto: 'Etapa 3: diante de conflito.',
    detalhe: 'Seis situações de desacordo. Marque a reação mais provável e a menos provável para você.',
    tempo: 'Faltam cerca de 9 minutos.',
  },
  b: {
    texto: 'Etapa 4: o que te move.',
    detalhe: 'Pares de frases. Em cada um, toque no que pesa mais para você.',
    tempo: 'Faltam cerca de 6 minutos.',
  },
  emocoes: {
    texto: 'Etapa 5: como você lida com emoções.',
    detalhe: 'Frases sobre as últimas semanas. Diga com que frequência cada uma aconteceu.',
    tempo: 'Faltam cerca de 4 minutos.',
  },
  c: {
    texto: 'Última etapa: seu momento.',
    detalhe: 'Cinco perguntas sobre a fase de vida. Elas dizem com quanta cautela ler o resultado.',
    tempo: 'Falta cerca de 1 minuto.',
  },
};

const PASSO_COMPORTAMENTO = {
  rotuloMais: 'A que mais combina com você',
  rotuloMenos: 'A que menos combina com você',
};
const PASSO_CONFLITO = {
  rotuloMais: 'A reação mais provável',
  rotuloMenos: 'A reação menos provável',
};

export function montarSequencia() {
  const telas = [{ tipo: 'abertura' }, { tipo: 'identificacao' }];
  const etapas = INCLUIR_ADAPTADO ? 6 : 5;
  let etapa = 0;
  const abrirEtapa = (campo) => {
    etapa += 1;
    telas.push({ tipo: 'respiro', ...RESPIROS[campo] });
  };

  abrirEtapa('a1');
  SITUACOES.forEach((s, i) => {
    telas.push({
      tipo: 'forcada', campo: 'a1', indiceResposta: i, contexto: ANCORA_A1, titulo: s.enunciado,
      opcoes: s.opcoes.map((o) => ({ codigo: o.fator, texto: o.texto })),
      ...PASSO_COMPORTAMENTO, etapa, etapas,
    });
  });

  if (INCLUIR_ADAPTADO) {
    abrirEtapa('a2');
    ordemExibicaoA2().forEach((item) => {
      telas.push({
        tipo: 'forcada', campo: 'a2', indiceResposta: item.posicao, contexto: ANCORA_A2,
        titulo: SITUACOES[item.indiceCanonico].enunciado,
        opcoes: item.opcoes.map((o) => ({ codigo: o.fator, texto: o.texto })),
        ...PASSO_COMPORTAMENTO, etapa, etapas,
      });
    });
  }

  abrirEtapa('conflito');
  CENARIOS_CONFLITO.forEach((c, i) => {
    telas.push({
      tipo: 'forcada', campo: 'conflito', indiceResposta: i, contexto: '', titulo: c.enunciado,
      opcoes: c.opcoes.map((o) => ({ codigo: o.estilo, texto: o.texto })),
      ...PASSO_CONFLITO, etapa, etapas,
    });
  });

  abrirEtapa('b');
  montarPares().forEach((par, indice) => {
    telas.push({
      tipo: 'par', campo: 'b', indice, titulo: ENQUADRAMENTOS_PARES[indice],
      esquerda: par.esquerda, direita: par.direita, etapa, etapas,
    });
  });

  abrirEtapa('emocoes');
  for (let i = 0; i < FRASES_EMOCAO.length; i += 2) {
    telas.push({
      tipo: 'multipla',
      itens: [i, i + 1].map((k) => ({ campo: 'emocoes', indice: k, texto: FRASES_EMOCAO[k] })),
      escala: ESCALA_FREQUENCIA, etapa, etapas,
    });
  }

  abrirEtapa('c');
  [[0, 1, 2], [3, 4]].forEach((grupo) => {
    telas.push({
      tipo: 'multipla',
      itens: grupo.map((k) => ({ campo: 'c', indice: k, texto: PERGUNTAS_MOMENTO[k] })),
      escala: ESCALA_CONCORDANCIA, etapa, etapas,
    });
  });

  telas.push({ tipo: 'relatorio' });
  return telas;
}

// Texto que identifica a pergunta de uma tela. Nenhuma tela de resposta
// pode repetir o de outra (ver testes/telas.test.js).
export function textoPergunta(tela) {
  if (tela.tipo === 'multipla') return tela.itens.map((i) => i.texto).join(' | ');
  return [tela.contexto, tela.titulo].filter(Boolean).join(' · ');
}

export function htmlAbertura({ interno }) {
  const origem = interno === 'aplicativo' ? 'dentro de um aplicativo' : `pelo ${interno}`;
  const aviso = interno
    ? '<div class="aviso-navegador">'
      + `<p><strong>Você abriu ${escaparHtml(origem)}.</strong> Para conseguir salvar seu resultado `
      + 'em PDF no final, abra esta página no navegador antes de começar: toque em '
      + '<strong>⋮</strong> ou <strong>…</strong> e escolha <strong>Abrir no navegador</strong>.</p>'
      + '</div>'
    : '';
  return '<div class="tela">'
    + '<p class="kicker">DEL / LÓTUS</p>'
    + '<h1>Mapa de Perfil.</h1>'
    + aviso
    + '<p>Um retrato de como você age, de como lida com conflito e com as próprias emoções, '
    + 'do que te move e de quanto o seu momento de vida está influenciando tudo isso.</p>'
    + '<p>São cerca de 16 minutos, em seis etapas curtas. Responda sem pensar muito: '
    + 'a primeira reação costuma ser a mais verdadeira.</p>'
    + '<p>Em várias telas você vai escolher entre reações que talvez combinem todas com '
    + 'você, ou nenhuma. Escolha a que <strong>mais</strong> e a que <strong>menos</strong> '
    + 'se parece com você. A comparação é entre elas, não com o mundo.</p>'
    + '<p class="aviso-abertura">Nada do que você responder é gravado em servidor. '
    + 'O resultado aparece aqui no seu aparelho e some quando você fechar esta aba.</p>'
    + '<button type="button" class="botao-principal" data-acao="comecar">Começar</button>'
    + '<a class="link-metodo" href="metodo.html">Conheça a base teórica do método →</a>'
    + '</div>';
}

// ---------- Navegacao ----------

export function criarNavegacao(raiz) {
  const telas = montarSequencia();
  const interno = navegadorInterno(navigator.userAgent);
  let posicao = 0;
  let passo = 'mais';
  let respostas = estadoInicial();
  let ultimoResultado = null;
  // Um unico avanco agendado por vez: toque duplo ou correcao rapida nunca
  // pula a tela seguinte, e "voltar" cancela o avanco que ainda nao aconteceu.
  let avancoPendente = null;
  const compartilharPerfil = criarCompartilhador({
    navegador: navigator,
    abrir: (url) => window.open(url, '_blank', 'noopener'),
  });

  function estadoInicial() {
    const vazio = () => ({ mais: null, menos: null });
    return {
      nome: '',
      contexto: '',
      a1: SITUACOES.map(vazio),
      a2: INCLUIR_ADAPTADO ? BLOCOS_ADAPTADO.map(vazio) : null,
      conflito: CENARIOS_CONFLITO.map(vazio),
      b: PARES_MOTIVACAO.map(() => null),
      emocoes: MAPA_EMOCOES.map(() => null),
      c: PERGUNTAS_MOMENTO.map(() => null),
    };
  }

  function guardar() {
    salvarEstado({ posicao, respostas, assinatura: assinaturaSequencia(telas) });
  }

  function retomar() {
    const salvo = lerEstado();
    if (!sessaoValida(salvo, telas)) return;
    respostas = salvo.respostas;
    posicao = salvo.posicao;
  }

  function agendarAvanco() {
    clearTimeout(avancoPendente);
    avancoPendente = setTimeout(() => {
      avancoPendente = null;
      avancar();
    }, ATRASO_AVANCO);
  }

  function cancelarAvanco() {
    clearTimeout(avancoPendente);
    avancoPendente = null;
  }

  function avancar() {
    posicao = Math.min(posicao + 1, telas.length - 1);
    passo = 'mais';
    guardar();
    desenhar();
  }

  function voltarTela() {
    cancelarAvanco();
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
    const passo2 = passo === 'menos';
    const rotulo = passo2 ? `Passo 2 de 2 · ${tela.rotuloMenos}` : `Passo 1 de 2 · ${tela.rotuloMais}`;
    const opcoes = tela.opcoes.map((o) => {
      const marcada = passo2 && resposta.mais === o.codigo;
      return `<button type="button" class="${marcada ? 'opcao marcada bloqueada' : 'opcao'}" `
        + `data-acao="forcada" data-codigo="${o.codigo}">${escaparHtml(o.texto)}</button>`;
    }).join('');
    return '<div class="tela">'
      + progresso(tela)
      + (tela.contexto ? `<p class="contexto-tela">${escaparHtml(tela.contexto)}</p>` : '')
      + `<p class="enunciado">${escaparHtml(tela.titulo)}</p>`
      + `<p class="rotulo-passo">${escaparHtml(rotulo.toUpperCase())}</p>`
      + `<div class="opcoes">${opcoes}</div>`
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
      + `<p class="enunciado">${escaparHtml(tela.titulo)}</p>`
      + '<p class="rotulo-passo">ESCOLHA UMA</p>'
      + `<div class="opcoes">${botao(tela.esquerda)}<p class="ou" aria-hidden="true">ou</p>${botao(tela.direita)}</div>`
      + botaoVoltar()
      + '</div>';
  }

  function telaMultipla(tela) {
    const itens = tela.itens.map((item) => {
      const atual = respostas[item.campo][item.indice];
      const botoes = tela.escala.map((ponto) => {
        const marcado = atual === ponto.valor;
        return `<button type="button" class="escala-item${marcado ? ' marcada' : ''}" `
          + `data-acao="multipla" data-campo="${item.campo}" data-indice="${item.indice}" `
          + `data-valor="${ponto.valor}" aria-pressed="${marcado}">${escaparHtml(ponto.rotulo)}</button>`;
      }).join('');
      return `<p class="frase-item">${escaparHtml(item.texto)}</p><div class="escala-linha">${botoes}</div>`;
    }).join('');
    return '<div class="tela">'
      + progresso(tela)
      + '<p class="rotulo-passo">MARQUE UMA OPÇÃO EM CADA FRASE</p>'
      + itens
      + botaoVoltar()
      + '</div>';
  }

  // A sessao continua apontando para o relatorio: recarregar, ou voltar de
  // uma saida para compartilhar, mostra o resultado de novo. O sessionStorage
  // some sozinho quando a aba e fechada.
  function telaRelatorio() {
    ultimoResultado = calcularResultado(respostas);
    return montarRelatorio(ultimoResultado);
  }

  function desenhar() {
    const tela = telas[posicao];
    if (tela.tipo === 'abertura') raiz.innerHTML = htmlAbertura({ interno });
    else if (tela.tipo === 'identificacao') raiz.innerHTML = telaIdentificacao();
    else if (tela.tipo === 'respiro') raiz.innerHTML = telaRespiro(tela);
    else if (tela.tipo === 'forcada') raiz.innerHTML = telaForcada(tela);
    else if (tela.tipo === 'par') raiz.innerHTML = telaPar(tela);
    else if (tela.tipo === 'multipla') raiz.innerHTML = telaMultipla(tela);
    else raiz.innerHTML = telaRelatorio();
    window.scrollTo(0, 0);
  }

  // ----- Acoes -----

  function responderForcada(codigo) {
    if (avancoPendente) return;
    const tela = telas[posicao];
    const resposta = respostas[tela.campo][tela.indiceResposta];

    if (passo === 'mais') {
      resposta.mais = codigo;
      resposta.menos = null;
      passo = 'menos';
      guardar();
      desenhar();
      return;
    }

    resposta.menos = codigo;
    guardar();
    marcarEsperando(codigo);
    agendarAvanco();
  }

  function responderPar(codigo) {
    if (avancoPendente) return;
    const tela = telas[posicao];
    respostas.b[tela.indice] = codigo;
    guardar();
    marcarEsperando(codigo);
    agendarAvanco();
  }

  // Marca a resposta sem redesenhar (a tela nao volta ao topo) e avanca
  // so quando o toque completa todos os itens. Reabrir uma tela nunca
  // dispara avanco sozinho.
  function responderMultipla(campo, indice, valor) {
    const tela = telas[posicao];
    respostas[campo][indice] = valor;
    guardar();
    raiz.querySelectorAll?.(`[data-campo="${campo}"][data-indice="${indice}"]`).forEach((b) => {
      const marcado = Number(b.dataset.valor) === valor;
      b.classList.toggle('marcada', marcado);
      b.setAttribute('aria-pressed', String(marcado));
    });
    const completa = tela.itens.every((i) => respostas[i.campo][i.indice] !== null);
    if (completa) agendarAvanco();
  }

  function marcarEsperando(valor) {
    const alvo = raiz.querySelector(`[data-codigo="${valor}"]`);
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
    cancelarAvanco();
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

  function mostrarAvisoPdf(botao) {
    if (raiz.querySelector('#aviso-pdf')) return;
    botao.insertAdjacentHTML('beforebegin',
      '<div class="aviso-navegador sem-impressao" id="aviso-pdf">'
      + '<p>O navegador deste aplicativo costuma não salvar PDF. Para guardar seu resultado agora, '
      + 'tire prints da tela. Da próxima vez, abra o link no Chrome ou no Safari antes de começar.</p>'
      + '</div>');
    botao.dataset.insistir = '1';
    botao.textContent = 'Tentar salvar em PDF mesmo assim';
  }

  function refazer() {
    if (!window.confirm('Apagar este resultado e começar o teste de novo?')) return;
    cancelarAvanco();
    respostas = estadoInicial();
    ultimoResultado = null;
    posicao = 0;
    passo = 'mais';
    guardar();
    desenhar();
  }

  function aoClicar(evento) {
    const alvo = evento.target.closest('[data-acao]');
    if (!alvo) return;
    const acao = alvo.dataset.acao;

    if (acao === 'comecar' || acao === 'seguir') avancar();
    else if (acao === 'identificar') identificar();
    else if (acao === 'forcada') responderForcada(alvo.dataset.codigo);
    else if (acao === 'par') responderPar(alvo.dataset.codigo);
    else if (acao === 'multipla') {
      responderMultipla(alvo.dataset.campo, Number(alvo.dataset.indice), Number(alvo.dataset.valor));
    }
    else if (acao === 'imprimir') {
      if (interno && !alvo.dataset.insistir) mostrarAvisoPdf(alvo);
      else window.print();
    }
    else if (acao === 'refazer') refazer();
    else if (acao === 'compartilhar' && ultimoResultado) {
      compartilharPerfil(textoCompartilhamento(ultimoResultado));
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
