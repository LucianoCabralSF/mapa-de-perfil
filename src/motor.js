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
  const pct = Object.fromEntries(
    FATORES.map((f) => [f, Math.round(((brutos[f] + 10) / 20) * 100)]),
  );
  return { brutos, pct };
}

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
