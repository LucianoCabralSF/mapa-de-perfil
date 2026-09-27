import { BLOCOS_ADAPTADO, MOTIVADORES, PARES_MOTIVACAO } from './motor.js';

// Liga ou desliga o bloco de comportamento adaptado (A2).
// Desligado: o teste cai de 36 para 30 telas e o relatorio omite
// a secao Natural x Adaptado.
export const INCLUIR_ADAPTADO = true;

export const ANCORA_A1 = 'Como você é na maior parte da sua vida, fora de qualquer trabalho específico.';
export const ANCORA_A2 = 'Como você sente que precisa ser no seu trabalho (ou estudo) hoje, para dar conta do que esperam de você.';

// Ordem canonica das opcoes em todos os blocos: E, C, P, A.
// Palavras neutras: nenhuma flexao no masculino (ver testes/linguagem.test.js).
export const BLOCOS = [
  [
    { fator: 'E', palavra: 'Tomo decisões' },
    { fator: 'C', palavra: 'Animo as pessoas' },
    { fator: 'P', palavra: 'Tenho paciência' },
    { fator: 'A', palavra: 'Tenho cautela' },
  ],
  [
    { fator: 'E', palavra: 'Falo sem rodeio' },
    { fator: 'C', palavra: 'Falo com facilidade' },
    { fator: 'P', palavra: 'Mantenho a calma' },
    { fator: 'A', palavra: 'Reparo nos detalhes' },
  ],
  [
    { fator: 'E', palavra: 'Gosto de competir' },
    { fator: 'C', palavra: 'Me empolgo fácil' },
    { fator: 'P', palavra: 'Sou de confiança' },
    { fator: 'A', palavra: 'Busco precisão' },
  ],
  [
    { fator: 'E', palavra: 'Arrisco' },
    { fator: 'C', palavra: 'Faço amizade fácil' },
    { fator: 'P', palavra: 'Mantenho o ritmo' },
    { fator: 'A', palavra: 'Mantenho a ordem' },
  ],
  [
    { fator: 'E', palavra: 'Persigo a meta' },
    { fator: 'C', palavra: 'Vejo o lado bom' },
    { fator: 'P', palavra: 'Levo com tranquilidade' },
    { fator: 'A', palavra: 'Uso critério' },
  ],
  [
    { fator: 'E', palavra: 'Assumo o comando' },
    { fator: 'C', palavra: 'Convenço as pessoas' },
    { fator: 'P', palavra: 'Apoio quem precisa' },
    { fator: 'A', palavra: 'Confiro tudo' },
  ],
  [
    { fator: 'E', palavra: 'Resolvo na hora' },
    { fator: 'C', palavra: 'Me expresso muito' },
    { fator: 'P', palavra: 'Evito surpresas' },
    { fator: 'A', palavra: 'Sigo um método' },
  ],
  [
    { fator: 'E', palavra: 'Gosto de desafio' },
    { fator: 'C', palavra: 'Gosto de gente' },
    { fator: 'P', palavra: 'Gosto de rotina' },
    { fator: 'A', palavra: 'Gosto de regras' },
  ],
  [
    { fator: 'E', palavra: 'Tenho pressa' },
    { fator: 'C', palavra: 'Improviso bem' },
    { fator: 'P', palavra: 'Ajudo sem pedir' },
    { fator: 'A', palavra: 'Prefiro observar' },
  ],
  [
    { fator: 'E', palavra: 'Foco no resultado' },
    { fator: 'C', palavra: 'Foco na relação' },
    { fator: 'P', palavra: 'Foco na harmonia' },
    { fator: 'A', palavra: 'Foco na qualidade' },
  ],
];

// Cinco frases por motivador; a k-esima aparicao do motivador nos pares
// usa a k-esima frase. Todas neutras e com ate 60 caracteres.
export const FRASES_MOTIVACAO = {
  REA: [
    'Ter uma meta difícil para bater',
    'Superar o meu próprio desempenho',
    'Enfrentar um desafio que ninguém resolveu',
    'Ver meu progresso crescer mês a mês',
    'Trabalhar com meta ousada',
  ],
  AUT: [
    'Decidir por conta própria como fazer',
    'Ter liberdade para organizar meu tempo',
    'Trabalhar sem alguém conferindo cada passo',
    'Escolher o caminho, mesmo com mais risco',
    'Ter autonomia para mudar o plano',
  ],
  SEG: [
    'Saber o que vem nos próximos meses',
    'Ter um emprego estável',
    'Contar com renda previsível',
    'Trabalhar com regras que não mudam toda hora',
    'Ter segurança antes de arriscar',
  ],
  REC: [
    'Receber reconhecimento público pelo que entrego',
    'Ter um cargo que as pessoas valorizam',
    'Ter meu nome num resultado de destaque',
    'Receber elogio de quem admiro',
    'Crescer de posição na organização',
  ],
  PRO: [
    'Sentir que meu trabalho melhora a vida de alguém',
    'Trabalhar por uma causa em que acredito',
    'Ver sentido no que faço todo dia',
    'Deixar uma contribuição que dure',
    'Ajudar a resolver um problema da comunidade',
  ],
  PER: [
    'Trabalhar com pessoas de quem gosto',
    'Sentir que faço parte do time',
    'Ter colegas com quem posso contar',
    'Conviver bem com a equipe',
    'Estar numa equipe unida',
  ],
};

export function montarPares() {
  const usadas = Object.fromEntries(MOTIVADORES.map((c) => [c, 0]));
  const lado = (codigo) => {
    const frase = FRASES_MOTIVACAO[codigo][usadas[codigo]];
    usadas[codigo] += 1;
    return { codigo, frase };
  };
  return PARES_MOTIVACAO.map(([a, b]) => ({ esquerda: lado(a), direita: lado(b) }));
}

// Ordem canonica alinhada a DIRECOES_MOMENTO em src/motor.js.
export const PERGUNTAS_MOMENTO = [
  'Nas últimas semanas, tenho sentido muita pressão e cobrança.',
  'Passei por mudanças importantes nos últimos 6 meses (trabalho, moradia, família ou saúde).',
  'Tenho dormido e descansado bem.',
  'Sinto satisfação com minha situação atual de trabalho ou estudo.',
  'Minha vida hoje está previsível e sob controle.',
];

export const ESCALA_CONCORDANCIA = [
  { valor: 1, rotulo: 'Discordo totalmente' },
  { valor: 2, rotulo: 'Discordo em parte' },
  { valor: 3, rotulo: 'Mais ou menos' },
  { valor: 4, rotulo: 'Concordo em parte' },
  { valor: 5, rotulo: 'Concordo totalmente' },
];

// Ordem fixa de exibicao do bloco A2: os 6 blocos de BLOCOS_ADAPTADO,
// de tras para frente, com as opcoes invertidas. Nao e sorteio.
// `posicao` e o indice em respostas.a2; `indiceCanonico` e o bloco em BLOCOS.
export function ordemExibicaoA2() {
  return BLOCOS_ADAPTADO
    .map((indiceCanonico, posicao) => ({
      posicao,
      indiceCanonico,
      opcoes: [...BLOCOS[indiceCanonico]].reverse(),
    }))
    .reverse();
}
