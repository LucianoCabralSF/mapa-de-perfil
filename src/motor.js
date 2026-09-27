export const FATORES = ['E', 'C', 'P', 'A'];
export const MOTIVADORES = ['REA', 'AUT', 'SEG', 'REC', 'PRO', 'PER'];

function zerados(chaves) {
  return Object.fromEntries(chaves.map((k) => [k, 0]));
}

export function pontuarComportamento(respostas) {
  const brutos = zerados(FATORES);
  for (const resposta of respostas) {
    if (resposta?.mais && brutos[resposta.mais] !== undefined) brutos[resposta.mais] += 1;
    if (resposta?.menos && brutos[resposta.menos] !== undefined) brutos[resposta.menos] -= 1;
  }
  const n = respostas.length;
  const pct = Object.fromEntries(
    FATORES.map((f) => [f, n ? Math.round(((brutos[f] + n) / (2 * n)) * 100) : 50]),
  );
  return { brutos, pct };
}

// Blocos que a pessoa responde tambem no bloco adaptado (A2).
// A tensao compara o A2 com estes mesmos blocos do A1.
export const BLOCOS_ADAPTADO = [1, 3, 5, 7, 9, 11];

export const NOMES_FATOR = {
  E: 'Executor',
  C: 'Comunicador',
  P: 'Planejador',
  A: 'Analista',
};

export function ordenarFatores(brutos) {
  return [...FATORES].sort((a, b) => {
    if (brutos[b] !== brutos[a]) return brutos[b] - brutos[a];
    return FATORES.indexOf(a) - FATORES.indexOf(b);
  });
}

export function definirPerfil(brutos) {
  const ordem = ordenarFatores(brutos);
  const dominante = ordem[0];
  const segundo = ordem[1];
  const temApoio = brutos[dominante] - brutos[segundo] <= 2;
  const apoio = temApoio ? segundo : null;
  const titulo = apoio
    ? `${NOMES_FATOR[dominante]} com apoio de ${NOMES_FATOR[apoio]}`
    : NOMES_FATOR[dominante];
  return { dominante, apoio, titulo };
}

const LIMIAR_FATOR_APONTADO = 5;

function ordenarPorDiferenca(diferencas, direcao) {
  const ordenados = [...FATORES].sort((a, b) => {
    const delta = direcao === 'desc' ? diferencas[b] - diferencas[a] : diferencas[a] - diferencas[b];
    if (delta !== 0) return delta;
    return FATORES.indexOf(a) - FATORES.indexOf(b);
  });
  return ordenados[0];
}

export function calcularTensao(pctNatural, pctAdaptado) {
  const diferencas = Object.fromEntries(
    FATORES.map((f) => [f, pctAdaptado[f] - pctNatural[f]]),
  );
  const soma = FATORES.reduce((acc, f) => acc + Math.abs(diferencas[f]), 0);
  const indice = Math.round(soma / FATORES.length);

  let faixa = 'baixa';
  if (indice >= 20) faixa = 'alta';
  else if (indice >= 10) faixa = 'moderada';

  const maior = ordenarPorDiferenca(diferencas, 'desc');
  const menor = ordenarPorDiferenca(diferencas, 'asc');
  const forcado = diferencas[maior] >= LIMIAR_FATOR_APONTADO ? maior : null;
  const contido = diferencas[menor] <= -LIMIAR_FATOR_APONTADO ? menor : null;

  return { indice, faixa, forcado, contido, diferencas };
}

export const NOMES_MOTIVADOR = {
  REA: 'Realização',
  AUT: 'Autonomia',
  SEG: 'Segurança',
  REC: 'Reconhecimento',
  PRO: 'Propósito',
  PER: 'Pertencimento',
};

// Comparacao pareada: todos os 15 pares entre os 6 motivadores.
// Ordem pelo metodo do circulo (pares seguidos nunca repetem motivador);
// lados escolhidos para cada motivador ficar 2 ou 3 vezes a esquerda.
export const PARES_MOTIVACAO = [
  ['REA', 'PER'], ['AUT', 'PRO'], ['REC', 'SEG'],
  ['PRO', 'REA'], ['PER', 'REC'], ['SEG', 'AUT'],
  ['REA', 'REC'], ['PRO', 'SEG'], ['AUT', 'PER'],
  ['SEG', 'REA'], ['REC', 'AUT'], ['PER', 'PRO'],
  ['AUT', 'REA'], ['SEG', 'PER'], ['PRO', 'REC'],
];

const CONFRONTOS_POR_MOTIVADOR = MOTIVADORES.length - 1;

export function pontuarMotivacoes(escolhas) {
  const vitorias = zerados(MOTIVADORES);
  const venceu = new Set();
  PARES_MOTIVACAO.forEach(([a, b], indice) => {
    const escolha = escolhas[indice];
    if (escolha !== a && escolha !== b) return;
    vitorias[escolha] += 1;
    venceu.add(`${escolha}>${escolha === a ? b : a}`);
  });

  // Desempate: vitorias contra quem terminou com o mesmo numero de vitorias.
  // Em empate circular todos ficam iguais e vale a ordem canonica.
  const desempate = zerados(MOTIVADORES);
  for (const m of MOTIVADORES) {
    for (const outro of MOTIVADORES) {
      if (m !== outro && vitorias[m] === vitorias[outro] && venceu.has(`${m}>${outro}`)) {
        desempate[m] += 1;
      }
    }
  }

  return MOTIVADORES
    .map((codigo) => ({
      codigo,
      bruto: vitorias[codigo],
      pct: Math.round((vitorias[codigo] / CONFRONTOS_POR_MOTIVADOR) * 100),
    }))
    .sort((x, y) => (y.bruto - x.bruto)
      || (desempate[y.codigo] - desempate[x.codigo])
      || (MOTIVADORES.indexOf(x.codigo) - MOTIVADORES.indexOf(y.codigo)));
}

export const DIRECOES_MOMENTO = ['direta', 'direta', 'invertida', 'invertida', 'invertida'];

export function pontuarMomento(respostas) {
  let bruto = 0;
  DIRECOES_MOMENTO.forEach((direcao, indice) => {
    const nota = respostas[indice];
    if (typeof nota !== 'number') return;
    bruto += direcao === 'direta' ? nota - 1 : 4 - (nota - 1);
  });
  const pct = Math.round((bruto / 20) * 100);
  let faixa = 'estavel';
  if (pct >= 56) faixa = 'turbulento';
  else if (pct >= 26) faixa = 'movimento';
  return { bruto, pct, faixa };
}

export const ESTILOS_CONFLITO = ['COL', 'NEG', 'COM', 'CED', 'EVI'];

export const NOMES_ESTILO = {
  COL: 'Colaborar',
  NEG: 'Negociar',
  COM: 'Competir',
  CED: 'Ceder',
  EVI: 'Evitar',
};

// [assertividade, cooperacao] de cada estilo no modelo de Thomas e Kilmann.
const EIXOS_ESTILO = {
  COL: [1, 1], NEG: [0.5, 0.5], COM: [1, 0], CED: [0, 1], EVI: [0, 0],
};

export function pontuarConflito(respostas) {
  const brutos = zerados(ESTILOS_CONFLITO);
  for (const r of respostas) {
    if (ESTILOS_CONFLITO.includes(r?.mais)) brutos[r.mais] += 1;
    if (ESTILOS_CONFLITO.includes(r?.menos)) brutos[r.menos] -= 1;
  }
  const n = respostas.length;
  const pct = Object.fromEntries(
    ESTILOS_CONFLITO.map((e) => [e, n ? Math.round(((brutos[e] + n) / (2 * n)) * 100) : 50]),
  );
  const ordem = [...ESTILOS_CONFLITO].sort((a, b) => (brutos[b] - brutos[a])
    || (ESTILOS_CONFLITO.indexOf(a) - ESTILOS_CONFLITO.indexOf(b)));
  const soma = ESTILOS_CONFLITO.reduce((acc, e) => acc + pct[e], 0);
  const eixo = (i) => (soma
    ? Math.round((ESTILOS_CONFLITO.reduce((acc, e) => acc + EIXOS_ESTILO[e][i] * pct[e], 0) / soma) * 100)
    : 50);
  return {
    brutos,
    pct,
    principal: ordem[0],
    secundario: ordem[1],
    assertividade: eixo(0),
    cooperacao: eixo(1),
  };
}

export const DOMINIOS_EMOCAO = ['AUT', 'CTR', 'EMP', 'REL'];

export const NOMES_DOMINIO = {
  AUT: 'Autoconsciência',
  CTR: 'Autocontrole',
  EMP: 'Empatia',
  REL: 'Relacionamento',
};

// Frases intercaladas por dominio (duas por tela, de dominios diferentes);
// a ultima de cada dominio (indices 12 a 15) e invertida.
export const MAPA_EMOCOES = Array.from({ length: 16 }, (_, i) => ({
  dominio: DOMINIOS_EMOCAO[i % 4],
  invertida: i >= 12,
}));

const LIMIAR_EQUILIBRIO = 10;

export function pontuarEmocoes(respostas) {
  const soma = zerados(DOMINIOS_EMOCAO);
  const conta = zerados(DOMINIOS_EMOCAO);
  MAPA_EMOCOES.forEach(({ dominio, invertida }, i) => {
    const nota = respostas[i];
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) return;
    soma[dominio] += invertida ? 6 - nota : nota;
    conta[dominio] += 1;
  });
  const porDominio = Object.fromEntries(DOMINIOS_EMOCAO.map((d) => {
    const media = conta[d] ? soma[d] / conta[d] : 3;
    return [d, { media, pct: Math.round(((media - 1) / 4) * 100) }];
  }));
  const ranking = DOMINIOS_EMOCAO
    .map((codigo) => ({ codigo, pct: porDominio[codigo].pct }))
    .sort((x, y) => (y.pct - x.pct)
      || (DOMINIOS_EMOCAO.indexOf(x.codigo) - DOMINIOS_EMOCAO.indexOf(y.codigo)));
  const equilibrado = ranking[0].pct - ranking[ranking.length - 1].pct < LIMIAR_EQUILIBRIO;
  return {
    porDominio,
    ranking,
    forte: ranking[0].codigo,
    desenvolver: equilibrado ? null : ranking[ranking.length - 1].codigo,
    equilibrado,
  };
}

function dataDeHoje() {
  const agora = new Date();
  const dd = String(agora.getDate()).padStart(2, '0');
  const mm = String(agora.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${agora.getFullYear()}`;
}

export function calcularResultado(respostas) {
  const natural = pontuarComportamento(respostas.a1);
  const perfil = definirPerfil(natural.brutos);
  const adaptado = respostas.a2 ? pontuarComportamento(respostas.a2) : null;
  const naturalComparavel = adaptado
    ? pontuarComportamento(BLOCOS_ADAPTADO.map((i) => respostas.a1[i]))
    : null;
  const tensao = adaptado ? calcularTensao(naturalComparavel.pct, adaptado.pct) : null;
  const motivacoes = pontuarMotivacoes(respostas.b);
  const conflito = pontuarConflito(respostas.conflito ?? []);
  const emocoes = pontuarEmocoes(respostas.emocoes ?? []);
  const momento = pontuarMomento(respostas.c);
  const alertaReforcado = Boolean(
    tensao && tensao.faixa === 'alta' && momento.faixa === 'turbulento',
  );

  return {
    nome: respostas.nome ?? '',
    contexto: respostas.contexto ?? '',
    data: dataDeHoje(),
    natural,
    perfil,
    adaptado,
    naturalComparavel,
    tensao,
    motivacoes,
    conflito,
    emocoes,
    momento,
    alertaReforcado,
  };
}
