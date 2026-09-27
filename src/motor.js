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
export const BLOCOS_ADAPTADO = [1, 3, 5, 6, 7, 9];

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
    momento,
    alertaReforcado,
  };
}
