// Liga ou desliga o bloco de comportamento adaptado (A2).
// Desligado: o teste cai de 37 para 27 telas e o relatorio omite
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

// Ordem canonica alinhada a MAPA_MOTIVACOES em src/motor.js:
// REA, AUT, SEG, REC, PRO, PER, AUT, REA, REC, SEG, PER, PRO
export const AFIRMACOES = [
  'Fico entediado quando não tenho um desafio difícil pela frente.',
  'Prefiro liberdade para decidir como faço meu trabalho, mesmo correndo mais risco.',
  'Prefiro um trabalho estável e previsível a um mais arriscado, mesmo ganhando menos.',
  'Faz diferença para mim ser reconhecido publicamente pelo que entrego.',
  'Preciso sentir que meu trabalho melhora a vida de alguém.',
  'Trabalhar com pessoas de quem eu gosto vale mais do que o cargo que eu ocupo.',
  'Me incomoda ter alguém me dizendo o passo a passo do que devo fazer.',
  'Sinto prazer em bater metas e superar meu próprio desempenho.',
  'Me importo com o cargo que ocupo e com o quanto as pessoas valorizam minha posição.',
  'Fico desconfortável quando não sei o que vai acontecer nos próximos meses.',
  'Faço questão de sentir que pertenço ao time, não que sou apenas mais um.',
  'Trocaria um salário maior por um trabalho com mais sentido para mim.',
];

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

// Ordem fixa de exibicao do bloco A2: blocos de tras para frente e
// opcoes invertidas dentro de cada bloco. Nao e sorteio - o mesmo
// conjunto de respostas sempre produz o mesmo resultado.
export function ordemExibicaoA2() {
  return BLOCOS
    .map((bloco, indice) => ({ indiceCanonico: indice, opcoes: [...bloco].reverse() }))
    .reverse();
}
