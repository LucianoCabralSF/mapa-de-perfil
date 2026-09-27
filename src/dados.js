import { BLOCOS_ADAPTADO, MOTIVADORES, PARES_MOTIVACAO } from './motor.js';

// Liga ou desliga o bloco de comportamento adaptado (A2).
// Desligado: o teste cai de 49 para 43 telas e o relatorio omite
// a secao Natural x Adaptado.
export const INCLUIR_ADAPTADO = true;

export const ANCORA_A1 = 'Pense em como você costuma agir, na maior parte do tempo.';
export const ANCORA_A2 = 'Agora, no seu trabalho de hoje';

// Etapas 1 e 2. Opcoes na ordem canonica: E, C, P, A.
// As situacoes de indice 1, 3, 5, 7, 9 e 11 voltam na etapa 2 (BLOCOS_ADAPTADO).
export const SITUACOES = [
  {
    enunciado: 'Alguém do cliente liga com irritação, cobrando um prazo que você não prometeu.',
    opcoes: [
      { fator: 'E', texto: 'Assumo a conversa e proponho uma data na mesma ligação.' },
      { fator: 'C', texto: 'Acalmo a pessoa, mostro empatia e reconstruo a relação.' },
      { fator: 'P', texto: 'Escuto até o fim com paciência e retorno depois, com calma.' },
      { fator: 'A', texto: 'Verifico o que foi combinado antes de responder qualquer coisa.' },
    ],
  },
  {
    enunciado: 'Uma reunião importante já passou do horário e ainda não chegou a nenhuma decisão.',
    opcoes: [
      { fator: 'E', texto: 'Proponho uma decisão e peço que o grupo diga sim ou não.' },
      { fator: 'C', texto: 'Resgato a energia do grupo e puxo as ideias de todo mundo.' },
      { fator: 'P', texto: 'Espero o grupo amadurecer e ajudo a manter a calma na sala.' },
      { fator: 'A', texto: 'Organizo o que já foi dito e mostro o que falta decidir.' },
    ],
  },
  {
    enunciado: 'Você acaba de entrar numa equipe nova e ainda não conhece bem as pessoas.',
    opcoes: [
      { fator: 'E', texto: 'Busco logo uma tarefa em que eu possa mostrar resultado.' },
      { fator: 'C', texto: 'Converso com todo mundo e procuro criar laços rápido.' },
      { fator: 'P', texto: 'Observo com calma e me aproximo aos poucos de cada pessoa.' },
      { fator: 'A', texto: 'Estudo como a equipe funciona antes de propor qualquer coisa.' },
    ],
  },
  {
    enunciado: 'Um prazo foi antecipado e a entrega precisa sair em metade do tempo previsto.',
    opcoes: [
      { fator: 'E', texto: 'Corto o que não é essencial e acelero o que resta.' },
      { fator: 'C', texto: 'Reúno as pessoas e animo o time para o esforço extra.' },
      { fator: 'P', texto: 'Reorganizo a rotina para manter o ritmo sem atropelar ninguém.' },
      { fator: 'A', texto: 'Reviso o escopo para garantir que a qualidade não caia.' },
    ],
  },
  {
    enunciado: 'Você percebe que um erro seu passou adiante e já chegou a outras pessoas.',
    opcoes: [
      { fator: 'E', texto: 'Assumo o erro na hora e corrijo o que for preciso.' },
      { fator: 'C', texto: 'Falo abertamente com quem foi afetado e peço desculpas.' },
      { fator: 'P', texto: 'Resolvo com discrição, cuidando para ninguém ser prejudicado.' },
      { fator: 'A', texto: 'Investigo a causa para garantir que não se repita.' },
    ],
  },
  {
    enunciado: 'A empresa anuncia uma mudança grande na forma de trabalhar, com pouca explicação.',
    opcoes: [
      { fator: 'E', texto: 'Aceito o desafio e procuro tirar vantagem da mudança.' },
      { fator: 'C', texto: 'Converso com as pessoas e ajudo a espalhar o entusiasmo.' },
      { fator: 'P', texto: 'Preciso de um tempo para me adaptar e entender o impacto.' },
      { fator: 'A', texto: 'Peço detalhes e critérios antes de mudar o que já funciona.' },
    ],
  },
  {
    enunciado: 'Sua chefia pede um resultado alto e cobra de perto, várias vezes por dia.',
    opcoes: [
      { fator: 'E', texto: 'Encaro a cobrança como combustível e aumento o ritmo.' },
      { fator: 'C', texto: 'Mantenho a chefia informada e negocio o que for possível.' },
      { fator: 'P', texto: 'Sigo no meu ritmo, tentando manter a calma sob a pressão.' },
      { fator: 'A', texto: 'Mostro dados do andamento para tornar a cobrança objetiva.' },
    ],
  },
  {
    enunciado: 'Uma pessoa da equipe está com dificuldade e começa a atrasar a parte dela no trabalho.',
    opcoes: [
      { fator: 'E', texto: 'Assumo parte da tarefa para não comprometer o resultado.' },
      { fator: 'C', texto: 'Chamo para conversar e tento levantar o ânimo dessa pessoa.' },
      { fator: 'P', texto: 'Ofereço ajuda com paciência, sem expor ninguém ao grupo.' },
      { fator: 'A', texto: 'Mapeio onde está o problema e proponho um passo a passo.' },
    ],
  },
  {
    enunciado: 'Você precisa decidir algo importante, mas as informações disponíveis são poucas.',
    opcoes: [
      { fator: 'E', texto: 'Decido com o que tenho e ajusto no caminho, se preciso.' },
      { fator: 'C', texto: 'Ouço pessoas de confiança e sigo a intuição do grupo.' },
      { fator: 'P', texto: 'Adio o que puder até sentir mais segurança na escolha.' },
      { fator: 'A', texto: 'Levanto mais dados antes de me comprometer com uma escolha.' },
    ],
  },
  {
    enunciado: 'Seu trabalho entra numa fase de rotina, com as mesmas tarefas todos os dias.',
    opcoes: [
      { fator: 'E', texto: 'Procuro um desafio novo para não perder o interesse.' },
      { fator: 'C', texto: 'Invento formas de deixar o dia mais leve e agradável.' },
      { fator: 'P', texto: 'Aproveito a estabilidade para fazer tudo bem feito.' },
      { fator: 'A', texto: 'Aperfeiçoo os processos e elimino pequenos erros.' },
    ],
  },
  {
    enunciado: 'Duas pessoas com autoridade sobre você pedem coisas diferentes para o mesmo dia.',
    opcoes: [
      { fator: 'E', texto: 'Escolho a prioridade pelo impacto e comunico a decisão.' },
      { fator: 'C', texto: 'Junto as duas pessoas numa conversa para chegarmos a um acordo.' },
      { fator: 'P', texto: 'Tento atender as duas, reorganizando o meu próprio dia.' },
      { fator: 'A', texto: 'Peço que definam por escrito o que vem primeiro.' },
    ],
  },
  {
    enunciado: 'Um projeto em que você trabalhou muito dá certo e recebe elogios da direção.',
    opcoes: [
      { fator: 'E', texto: 'Comemoro rápido e já penso no próximo desafio.' },
      { fator: 'C', texto: 'Divulgo o resultado e faço questão de celebrar com todos.' },
      { fator: 'P', texto: 'Fico feliz em silêncio e dou o crédito ao time.' },
      { fator: 'A', texto: 'Analiso o que funcionou para repetir no próximo projeto.' },
    ],
  },
];

// Etapa 3. Opcoes na ordem canonica: COL, NEG, COM, CED, EVI.
// Itens proprios: o instrumento de Thomas-Kilmann nao e reproduzido.
export const CENARIOS_CONFLITO = [
  {
    enunciado: 'Numa reunião, uma pessoa do mesmo nível que você discorda da sua proposta na frente de todos.',
    opcoes: [
      { estilo: 'COL', texto: 'Proponho entendermos juntos o que cada proposta resolve.' },
      { estilo: 'NEG', texto: 'Sugiro juntar uma parte de cada ideia para seguirmos.' },
      { estilo: 'COM', texto: 'Defendo meus argumentos até ficar clara a melhor saída.' },
      { estilo: 'CED', texto: 'Aceito a outra ideia para não travar a reunião.' },
      { estilo: 'EVI', texto: 'Deixo o assunto para depois, longe da frente do grupo.' },
    ],
  },
  {
    enunciado: 'Sua chefia define um prazo que você considera impossível de cumprir com qualidade.',
    opcoes: [
      { estilo: 'COL', texto: 'Mostro o que é viável e construo com a chefia um plano realista.' },
      { estilo: 'NEG', texto: 'Proponho entregar uma parte no prazo e o restante depois.' },
      { estilo: 'COM', texto: 'Deixo claro que o prazo não funciona e mantenho minha posição.' },
      { estilo: 'CED', texto: 'Aceito o prazo e dou o meu jeito para cumprir.' },
      { estilo: 'EVI', texto: 'Evito discutir na hora e espero para ver como as coisas andam.' },
    ],
  },
  {
    enunciado: 'Uma pessoa da sua equipe discorda da forma como você dividiu as tarefas e reclama com os colegas.',
    opcoes: [
      { estilo: 'COL', texto: 'Chamo a pessoa para entender o incômodo e redesenhar juntos.' },
      { estilo: 'NEG', texto: 'Ofereço trocar parte das tarefas em troca de mais colaboração.' },
      { estilo: 'COM', texto: 'Explico que a divisão está mantida e espero o cumprimento.' },
      { estilo: 'CED', texto: 'Refaço a divisão do jeito que a pessoa prefere.' },
      { estilo: 'EVI', texto: 'Deixo passar, esperando que o incômodo diminua com o tempo.' },
    ],
  },
  {
    enunciado: 'Um cliente exige um desconto que a empresa não costuma dar e ameaça ir para a concorrência.',
    opcoes: [
      { estilo: 'COL', texto: 'Busco entender a necessidade real e montar uma proposta boa para os dois.' },
      { estilo: 'NEG', texto: 'Ofereço um desconto menor em troca de um contrato mais longo.' },
      { estilo: 'COM', texto: 'Mantenho o preço e mostro por que ele vale o que custa.' },
      { estilo: 'CED', texto: 'Concedo o desconto para não perder o cliente.' },
      { estilo: 'EVI', texto: 'Passo a negociação para outra pessoa da empresa.' },
    ],
  },
  {
    enunciado: 'Outra área atrasa uma informação de que você depende e culpa a sua equipe pelo atraso.',
    opcoes: [
      { estilo: 'COL', texto: 'Reúno as duas áreas para ajustar o fluxo e evitar novos atrasos.' },
      { estilo: 'NEG', texto: 'Combino um prazo intermediário que funcione para as duas áreas.' },
      { estilo: 'COM', texto: 'Mostro com fatos de onde veio o atraso e cobro uma solução.' },
      { estilo: 'CED', texto: 'Absorvo o atraso na minha equipe para não criar atrito.' },
      { estilo: 'EVI', texto: 'Sigo meu trabalho e evito entrar nessa disputa.' },
    ],
  },
  {
    enunciado: 'Numa discussão em grupo, duas pessoas começam a brigar e o clima da reunião fica pesado.',
    opcoes: [
      { estilo: 'COL', texto: 'Interrompo com calma e ajudo as duas a ouvir o ponto uma da outra.' },
      { estilo: 'NEG', texto: 'Proponho uma solução de meio-termo para destravar a conversa.' },
      { estilo: 'COM', texto: 'Assumo a condução e decido o encaminhamento ali mesmo.' },
      { estilo: 'CED', texto: 'Tento agradar os dois lados para acalmar os ânimos.' },
      { estilo: 'EVI', texto: 'Sugiro fazer uma pausa e retomar o assunto em outro dia.' },
    ],
  },
];

// Etapa 4. Um enquadramento por par, alinhado a PARES_MOTIVACAO.
export const ENQUADRAMENTOS_PARES = [
  'Numa proposta de trabalho, pesa mais para você…',
  'O que mais te faz render no trabalho:',
  'Para você se sentir bem num emprego, é mais importante…',
  'Num dia bom de trabalho, o que mais te motiva é…',
  'Pensando nos próximos cinco anos, você prefere…',
  'Entre duas vagas parecidas, você escolheria a que permite…',
  'No fim de um ano de trabalho, te daria mais orgulho…',
  'Numa fase difícil da vida, o que mais te sustenta no trabalho:',
  'Num ambiente de trabalho ideal, pesa mais…',
  'O que mais te dá vontade de ficar numa empresa:',
  'Num projeto novo, o que mais te atrai:',
  'Se tivesse que abrir mão de uma delas, você manteria…',
  'Para dar o seu melhor num projeto, conta mais…',
  'Diante de uma mudança grande no trabalho, o que mais te ajuda:',
  'Olhando para a sua carreira daqui a dez anos, você quer mais…',
];

// Etapa 5. Alinhadas a MAPA_EMOCOES: dominio do indice i = DOMINIOS_EMOCAO[i % 4]
// (AUT, CTR, EMP, REL); os indices 12 a 15 sao invertidos.
export const FRASES_EMOCAO = [
  'Nas últimas semanas, percebi minha irritação antes de reagir a ela.',
  'Nos últimos tempos, consegui manter a calma mesmo quando algo me tirou do sério.',
  'Nas últimas semanas, percebi quando alguém da equipe não estava bem, mesmo sem ouvir queixa.',
  'Nos últimos tempos, consegui resolver desentendimentos sem estragar a relação.',
  'Recentemente, soube dizer com clareza o que me faz bem e o que me desgasta no trabalho.',
  'Nas últimas semanas, pensei antes de responder uma mensagem que me incomodou.',
  'Recentemente, me coloquei no lugar de alguém antes de julgar a atitude dessa pessoa.',
  'Nas últimas semanas, ajudei pessoas com opiniões diferentes a chegar a um acordo.',
  'Nos últimos tempos, reconheci em que situações eu costumo perder a paciência.',
  'Recentemente, cumpri o que tinha planejado mesmo sem vontade naquele dia.',
  'Nas últimas semanas, ouvi alguém até o fim sem interromper nem já pensar na resposta.',
  'Nos últimos tempos, dei um retorno difícil a alguém de um jeito que foi bem recebido.',
  'Nas últimas semanas, só entendi o que eu sentia depois que a situação já tinha passado.',
  'Recentemente, falei algo no calor do momento e me arrependi depois.',
  'Nos últimos tempos, só descobri tarde que alguém estava chateado comigo.',
  'Nas últimas semanas, evitei uma conversa necessária por medo de criar conflito.',
];

export const ESCALA_FREQUENCIA = [
  { valor: 1, rotulo: 'Quase nunca' },
  { valor: 2, rotulo: 'Raramente' },
  { valor: 3, rotulo: 'Às vezes' },
  { valor: 4, rotulo: 'Com frequência' },
  { valor: 5, rotulo: 'Quase sempre' },
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
// `posicao` e o indice em respostas.a2; `indiceCanonico` e a situacao em SITUACOES.
export function ordemExibicaoA2() {
  return BLOCOS_ADAPTADO
    .map((indiceCanonico, posicao) => ({
      posicao,
      indiceCanonico,
      opcoes: [...SITUACOES[indiceCanonico].opcoes].reverse(),
    }))
    .reverse();
}
