// Biblioteca de textos da parte 2 do relatorio: "Para quem lidera".
// Fala com o lider, na segunda pessoa. A pessoa avaliada aparece sempre
// pelo marcador {nome}, nunca por pronome de genero (ver testes).

export const LIDER_FRASE = {
  E: '{nome} rende mais com meta clara, prazo definido e liberdade para escolher o caminho. Diga aonde quer chegar e acompanhe pelo resultado, não pelo passo a passo.',
  C: '{nome} rende mais quando pode falar, propor e trabalhar com gente. Dê espaço para as ideias e reconheça em público o que {nome} fez acontecer.',
  P: '{nome} rende mais com previsibilidade, relação de confiança e tempo para fazer bem feito. Avise antes, explique o porquê e evite surpresas.',
  A: '{nome} rende mais com critério definido, informação confiável e tempo para conferir. Traga dados, combine o padrão de qualidade e respeite o tempo de análise.',
};

// Complemento de uma frase pelo fator de apoio.
export const LIDER_APOIO = {
  E: 'Com o apoio de Executor, {nome} também responde bem a desafio e a prazo apertado, desde que o objetivo esteja claro.',
  C: 'Com o apoio de Comunicador, {nome} também ganha energia em trabalho de equipe e em conversas abertas.',
  P: 'Com o apoio de Planejador, {nome} também valoriza constância e costuma segurar o time em períodos difíceis.',
  A: 'Com o apoio de Analista, {nome} também precisa entender o critério por trás de cada decisão.',
};

export const LIDER_COMUNICAR = {
  E: {
    fazer: ['Vá direto ao assunto e diga o objetivo na primeira frase.', 'Traga a decisão que você espera e o prazo.', 'Dê autonomia para escolher o caminho.'],
    evitar: ['Rodeio e reunião longa sem decisão.', 'Controlar cada passo da tarefa.', 'Explicação detalhada antes do objetivo.'],
  },
  C: {
    fazer: ['Converse antes de formalizar por escrito.', 'Reconheça o que foi feito, de preferência em público.', 'Deixe espaço para pensar em voz alta.'],
    evitar: ['Comunicado seco, só por escrito.', 'Crítica na frente do grupo.', 'Silêncio prolongado depois de uma proposta.'],
  },
  P: {
    fazer: ['Avise mudanças com antecedência.', 'Explique o porquê antes do quê.', 'Dê tempo para processar antes de pedir resposta.'],
    evitar: ['Decisão em cima da hora.', 'Tom agressivo ou cobrança aos gritos.', 'Colocar em evidência sem aviso.'],
  },
  A: {
    fazer: ['Traga dados e critério claro.', 'Combine por escrito o padrão esperado.', 'Dê tempo para conferir antes da resposta.'],
    evitar: ['Cobrança de resposta imediata.', 'Informação solta, sem fonte.', 'Mudança de regra no meio do caminho.'],
  },
};

// Pelos dois motivadores principais.
export const LIDER_RETORNO = {
  REA: 'Mostre a {nome} o avanço em números e metas. O reconhecimento que mais funciona é um desafio maior e mais difícil depois de um bom resultado.',
  AUT: 'Com {nome}, o melhor reconhecimento é mais liberdade: menos acompanhamento e mais poder de decisão sobre o próprio trabalho.',
  SEG: 'Para {nome}, reconhecer é dar segurança: deixar claro que o trabalho está bom e o que vem pela frente.',
  REC: 'Reconheça {nome} de forma visível, citando o que foi entregue. Elogio público e específico vale mais do que elogio genérico.',
  PRO: 'Mostre a {nome} o impacto real do trabalho na vida de alguém. Saber para que serve o esforço é o que mais reconhece.',
  PER: 'Para {nome}, o reconhecimento passa pelo grupo: valorize a contribuição para o time e crie momentos de celebração coletiva.',
};

export const LIDER_DELEGAR = {
  E: 'Delegue o resultado, não o método. Defina objetivo e prazo e combine poucos pontos de controle. {nome} rende mais com autonomia e se frustra com microgestão.',
  C: 'Delegue tarefas com contato e visibilidade. Combine prazos por escrito e faça acompanhamentos curtos, para transformar a energia de {nome} em entregas no prazo.',
  P: 'Delegue com contexto e tempo. Explique a tarefa por completo, deixe claro a quem recorrer e evite mudar a prioridade no meio. {nome} entrega com constância quando sabe o que esperar.',
  A: 'Delegue com critério definido e informação completa. Combine o nível de qualidade esperado e o prazo real: {nome} precisa saber quando o suficiente basta.',
};

// Pelo estilo principal diante de conflito.
export const LIDER_CONFLITO = {
  COL: {
    esperar: 'Em conflito, {nome} tende a buscar uma solução que funcione para todos e pode querer discutir o assunto a fundo.',
    conduzir: 'Dê espaço para a conversa, mas combine o tempo. Em temas urgentes, deixe claro que a decisão precisa sair logo.',
  },
  NEG: {
    esperar: 'Em conflito, {nome} tende a propor meio-termo e a destravar a conversa com soluções práticas.',
    conduzir: 'Aproveite essa habilidade, mas confira se o acordo resolve de fato o problema de fundo, e não só a discussão do momento.',
  },
  COM: {
    esperar: 'Em conflito, {nome} tende a defender a própria posição com firmeza e pode endurecer diante de oposição.',
    conduzir: 'Não entre na disputa de força. Traga fatos, reconheça o ponto válido e mostre o que está em jogo para o grupo.',
  },
  CED: {
    esperar: 'Em conflito, {nome} tende a abrir mão da própria posição para preservar a relação, mesmo discordando.',
    conduzir: 'Pergunte diretamente o que {nome} pensa, em particular, e deixe claro que discordar é bem-vindo.',
  },
  EVI: {
    esperar: 'Em conflito, {nome} tende a adiar ou contornar o assunto, e o incômodo pode não aparecer até crescer.',
    conduzir: 'Crie conversas individuais regulares e seguras, com hora marcada, para que os assuntos difíceis apareçam cedo.',
  },
};

export const LIDER_DESGASTE = {
  E: 'Sob desgaste, {nome} tende a ficar mais impaciente, a centralizar decisões e a endurecer o tom com a equipe.',
  C: 'Sob desgaste, {nome} tende a perder a energia de sempre, a se afastar das conversas ou a prometer demais para agradar.',
  P: 'Sob desgaste, {nome} tende a se calar, a dizer sim para tudo e a acumular trabalho sem avisar.',
  A: 'Sob desgaste, {nome} tende a se fechar, a revisar demais, a adiar entregas e a criticar mais do que o normal.',
};

export const LIDER_DESGASTE_TENSAO = 'O resultado mostra tensão alta entre o jeito natural de {nome} e o que o trabalho pede hoje. Vale conversar sobre onde está esse esforço extra.';

export const LIDER_DESGASTE_MOMENTO = '{nome} respondeu num momento de vida turbulento. Leia o relatório com cautela e pergunte, com cuidado, como estão as coisas.';

// Pelo motivador de menor pontuacao.
export const LIDER_EVITAR = {
  REA: 'Evite motivar {nome} só com metas, ranking e competição: isso pesa pouco e pode soar vazio.',
  AUT: 'Evite presumir que {nome} quer liberdade total: direção clara e acompanhamento próximo podem ser bem recebidos.',
  SEG: 'Evite usar a estabilidade como argumento principal: para {nome}, isso pesa menos do que os outros motivos.',
  REC: 'Evite reconhecer {nome} só com exposição pública e título: visibilidade importa pouco nesse caso.',
  PRO: 'Evite apelar para causa e propósito como principal argumento: para {nome}, isso pesa menos do que os outros motivos.',
  PER: 'Evite usar integração e atividades de grupo como principal incentivo: para {nome}, isso pesa menos do que os outros motivos.',
};

// Perguntas para a conversa individual, dirigidas a pessoa.
export const PERGUNTA_MOTIVADOR = {
  REA: 'Que desafio te daria vontade de começar o dia mais cedo nos próximos meses?',
  AUT: 'Em que parte do seu trabalho você gostaria de ter mais liberdade para decidir?',
  SEG: 'O que te daria mais segurança no trabalho neste momento?',
  REC: 'Qual entrega recente sua você sente que merecia mais reconhecimento?',
  PRO: 'Em que parte do trabalho você mais sente que está fazendo diferença?',
  PER: 'O que faria você se sentir mais parte do time?',
};

export const PERGUNTA_TENSAO = {
  baixa: 'O que no seu trabalho hoje mais combina com o seu jeito de ser?',
  moderada: 'Em que momento do trabalho você sente que precisa agir diferente do seu jeito natural?',
  alta: 'O que o seu trabalho tem exigido de você que mais cansa? O que poderia mudar?',
};

export const PERGUNTA_MOMENTO = {
  estavel: 'O que tem ajudado você a manter o equilíbrio nesta fase?',
  movimento: 'Tem alguma mudança recente pesando no seu dia a dia que seria bom eu saber?',
  turbulento: 'Como você está, de verdade, nesta fase? Há algo em que eu possa ajudar?',
};

export const PERGUNTA_CONFLITO = {
  COL: 'Em que tipo de decisão você quer participar desde o começo?',
  NEG: 'Teve algum acordo recente que resolveu a conversa, mas não o problema?',
  COM: 'Quando você discorda de mim, como prefere que a gente conduza a conversa?',
  CED: 'Tem alguma decisão recente com a qual você concordou, mas não gostou?',
  EVI: 'Tem algum assunto que você vem evitando trazer e que seria bom conversarmos?',
};

export const PERGUNTA_FATOR = {
  E: 'Que decisão você gostaria de poder tomar sem precisar consultar ninguém?',
  C: 'Com quem você gostaria de trabalhar mais de perto nos próximos meses?',
  P: 'Que mudança recente mais te tirou do ritmo?',
  A: 'Que informação faltou para você trabalhar melhor no último mês?',
};

export const COMO_USAR = 'Este relatório é um ponto de partida para conversa, não uma avaliação. O relatório não mede desempenho e não deve ser usado para decidir contratação, promoção ou desligamento. {nome} leu tudo o que está aqui e escolheu compartilhar. Use as perguntas acima numa conversa individual e confira com {nome} o que faz sentido: a última palavra sobre quem {nome} é pertence a {nome}.';

export function comNome(texto, nomeEscapado) {
  return String(texto).split('{nome}').join(nomeEscapado);
}
