// Biblioteca de textos do relatorio.
// Regras de redacao: segunda pessoa, frases curtas, sem jargao de RH.
// Pontos de atencao descrevem o efeito do comportamento, nunca julgam
// a pessoa. Nenhum texto sugere que ela esta na carreira errada.

export const RETRATOS = {
  E: 'Você vai direto ao ponto. Onde os outros ainda estão analisando, você já decidiu e começou. Gosta de desafio, de meta clara e de ter controle sobre o resultado. Ritmo acelerado não te assusta: o que te incomoda é a lentidão. Você prefere errar rápido e corrigir a esperar a certeza absoluta. Quando um assunto trava, as pessoas costumam olhar para você esperando que alguém puxe a decisão.',
  C: 'Você move as coisas pelas pessoas. Conversa com facilidade, cria clima e consegue engajar quem estava desanimado. Tem energia visível e gosta de ambiente onde as ideias circulam. Prefere resolver falando a resolver por escrito. Aceita bem o novo e se entusiasma rápido com uma possibilidade. Onde há gente reunida, você costuma ser quem dá o tom da conversa e quem percebe primeiro quando o ânimo do grupo caiu.',
  P: 'Você é a base que segura o time. Mantém o ritmo constante, cumpre o que combinou e não cria alarde. As pessoas te procuram quando precisam ser ouvidas, porque você escuta de verdade e não expõe ninguém. Prefere ambiente previsível, onde dá para fazer bem feito sem correria. Mudança repentina te incomoda menos pelo novo e mais pela bagunça que ela causa em quem está ao redor.',
  A: 'Você confia no que pode ser verificado. Antes de decidir, quer o dado, o critério e o detalhe conferido. Tem padrão alto e percebe o erro que passou por todo mundo. Prefere um processo claro a um improviso brilhante. Não gosta de prometer o que não tem certeza de cumprir. Quando algo dá errado, você costuma ser quem já tinha anotado o ponto fraco antes de o problema aparecer.',
};

export const FORTES = {
  E: [
    'Você decide rápido, inclusive quando falta informação.',
    'Assume a frente quando ninguém quer assumir.',
    'Não trava diante de problema grande.',
    'Mantém o foco no resultado quando o grupo se dispersa.',
    'Sustenta uma posição difícil sem recuar na primeira objeção.',
  ],
  C: [
    'Você cria conexão com pessoas muito diferentes de você.',
    'Consegue engajar um grupo desanimado.',
    'Comunica uma ideia de forma que os outros entendem e compram.',
    'Percebe rápido o clima de uma sala.',
    'Circula bem em ambiente novo, sem travar.',
  ],
  P: [
    'Você entrega com constância, sem altos e baixos.',
    'Escuta até o fim antes de responder.',
    'Sustenta o time nos períodos de pressão.',
    'Cumpre o combinado sem precisar de cobrança.',
    'Acalma conflito em vez de aumentá-lo.',
  ],
  A: [
    'Você percebe o erro que passou por todo mundo.',
    'Trabalha com padrão alto e constante.',
    'Fundamenta o que afirma com dado, não com impressão.',
    'Organiza o que estava confuso.',
    'Antecipa o risco antes de ele virar problema.',
  ],
};

export const ATENCAO = {
  E: [
    'Sua pressa faz você decidir antes de ouvir todo mundo.',
    'O time pode ler sua objetividade como dureza.',
    'Você se impacienta com quem precisa de mais tempo para entender.',
    'Detalhe importante às vezes passa batido na corrida pelo resultado.',
    'Delegar te custa: você acredita que resolve mais rápido sozinho.',
  ],
  C: [
    'Seu entusiasmo às vezes promete mais do que o prazo comporta.',
    'A conversa pode ocupar o espaço que era da execução.',
    'Você evita o assunto desconfortável para não estragar o clima.',
    'Detalhe e acompanhamento costumam te cansar antes do fim.',
    'A necessidade de agradar pode adiar um não necessário.',
  ],
  P: [
    'Você segura um incômodo por tempo demais antes de falar.',
    'Mudança de rota te desestabiliza mais do que você demonstra.',
    'Dizer não é difícil, e a conta chega como sobrecarga.',
    'Sua calma pode ser lida como falta de posicionamento.',
    'Você adia decisão difícil esperando que o clima melhore sozinho.',
  ],
  A: [
    'A busca pelo certo atrasa a entrega do suficiente.',
    'Sua análise pode virar trava quando falta dado.',
    'O padrão alto que você usa consigo acaba cobrado dos outros.',
    'Crítica ao seu trabalho te atinge mais do que você admite.',
    'Você evita arriscar mesmo quando o risco é pequeno.',
  ],
};

export const COMUNICACAO = {
  E: 'Funciona: ir direto ao assunto, trazer o ponto principal na primeira frase e dizer o que se espera de você. Trava: rodeio, reunião longa sem decisão e explicação detalhada antes do objetivo.',
  C: 'Funciona: conversar antes de formalizar, reconhecer o que você fez e deixar espaço para você pensar em voz alta. Trava: comunicado seco por escrito, crítica em público e ambiente onde ninguém responde.',
  P: 'Funciona: avisar com antecedência, explicar o porquê da mudança e dar tempo para você processar. Trava: decisão em cima da hora, tom agressivo e ser colocado no centro das atenções sem aviso.',
  A: 'Funciona: trazer dado, critério claro e tempo para conferir antes de responder. Trava: cobrança de resposta imediata, informação solta sem fonte e mudança de regra no meio do caminho.',
};

export const AMBIENTE = {
  E: 'Ambiente ideal: metas claras, autonomia para decidir e espaço para assumir riscos. Ambiente que desgasta: processo lento, decisão travada em muitas aprovações e trabalho sem resultado visível.',
  C: 'Ambiente ideal: contato com pessoas, espaço para propor e reconhecimento pelo que você movimenta. Ambiente que desgasta: trabalho isolado, rotina repetitiva e clima de silêncio.',
  P: 'Ambiente ideal: regras estáveis, relação de confiança e tempo para fazer bem feito. Ambiente que desgasta: mudança constante de prioridade, clima de conflito e cobrança aos gritos.',
  A: 'Ambiente ideal: critério definido, informação confiável e liberdade para conferir antes de entregar. Ambiente que desgasta: improviso constante, prazo que impede a revisão e decisão tomada sem base.',
};

export const MOTIVADOR_ALTO = {
  REA: 'Você acende diante de um desafio difícil. Meta clara e progresso visível te dão energia; tarefa fácil demais te apaga.',
  AUT: 'Você rende quando tem liberdade para decidir o caminho. Confiança vale mais para você do que instrução detalhada.',
  SEG: 'Previsibilidade te dá tranquilidade para produzir. Saber o que vem pela frente importa mais para você do que a novidade.',
  REC: 'Ser visto e valorizado pelo que entrega faz diferença real no seu ânimo. Trabalho reconhecido rende o dobro em você.',
  PRO: 'Você precisa enxergar para que serve o que faz. Sentido importa mais do que status, e isso sustenta você em período difícil.',
  PER: 'O vínculo com o time é o que te prende. Trabalhar com gente de quem você gosta muda sua disposição de forma direta.',
};

export const MOTIVADOR_BAIXO = {
  REA: 'Competir e superar marca não é o que te move. Ambiente que só fala de meta e ranking te deixa indiferente.',
  AUT: 'Liberdade total não é o que você busca. Ter alguém definindo o caminho te incomoda pouco, e às vezes até ajuda.',
  SEG: 'Estabilidade não é o que te segura. Rotina previsível demais cansa você mais do que a incerteza.',
  REC: 'Aplauso e visibilidade importam pouco para você. Cargo e título não são o que te fazem levantar da cama.',
  PRO: 'Causa e propósito não são o centro da sua motivação. Você separa o trabalho do sentido de vida sem sofrer com isso.',
  PER: 'Pertencer ao grupo pesa pouco na sua decisão. Você trabalha bem sozinho e não sente falta do vínculo do time.',
};

export const TEXTO_TENSAO = {
  baixa: 'O que o seu trabalho pede hoje está perto de quem você é naturalmente. Isso significa menos energia gasta em sustentar uma postura e mais energia disponível para a entrega.',
  moderada: 'Existe um ajuste entre quem você é e o que o trabalho pede hoje. Isso é comum e normalmente sustentável. Vale saber onde está esse ajuste, porque é ali que sua energia é consumida sem aparecer no resultado.',
  alta: 'Há uma distância grande entre quem você é naturalmente e o papel que você sustenta hoje. Isso custa energia todos os dias, e é um custo que costuma passar despercebido até virar cansaço. Não é sinal de erro: é informação sobre onde você está gastando reserva.',
};

export const FATOR_FORCADO = {
  E: 'O ambiente está pedindo mais firmeza e velocidade de decisão do que é natural em você. Você tem assumido a frente em situações que normalmente deixaria para outro.',
  C: 'O ambiente está pedindo mais exposição e articulação do que é natural em você. Você tem falado, convencido e circulado mais do que seu ritmo pede.',
  P: 'O ambiente está pedindo mais paciência e constância do que é natural em você. Você tem segurado o próprio ritmo para acompanhar o dos outros.',
  A: 'O ambiente está pedindo mais controle e precisão do que é natural em você. Você tem conferido, documentado e revisado mais do que sua natureza pede.',
};

export const FATOR_CONTIDO = {
  E: 'Você tem segurado sua vontade de decidir e de assumir a frente. Essa é uma força sua que hoje encontra pouco espaço.',
  C: 'Você tem segurado sua espontaneidade e sua vontade de se expressar. Essa é uma força sua que hoje encontra pouco espaço.',
  P: 'Você tem segurado sua necessidade de constância e de cuidado com o clima. Essa é uma força sua que hoje encontra pouco espaço.',
  A: 'Você tem segurado sua vontade de conferir e de trabalhar com critério. Essa é uma força sua que hoje encontra pouco espaço.',
};

export const TEXTO_ALINHADO = 'Nenhum fator aparece claramente forçado ou contido. Na prática, o jeito que você precisa ser no trabalho hoje se parece bastante com o seu jeito natural.';

export const TEXTO_MOMENTO = {
  estavel: 'Você respondeu num momento relativamente estável de vida. Isso é bom para a leitura: o retrato abaixo tende a refletir seu padrão habitual, e não uma reação passageira.',
  movimento: 'Há fatores de contexto pesando na sua vida agora. Nada que invalide o resultado, mas vale ler este relatório sabendo que parte do que aparece pode ser resposta ao momento, não característica fixa.',
  turbulento: 'Você respondeu num momento de bastante turbulência. Pressão, mudança recente ou cansaço mudam a forma como qualquer pessoa se enxerga. Leia este relatório como a fotografia de uma fase, não como o seu retrato definitivo.',
};

export const ALERTA_REFORCADO = 'Atenção especial: você está num momento turbulento e, ao mesmo tempo, sustentando no trabalho um papel bem distante do seu jeito natural. Essas duas condições juntas são justamente as que mais distorcem um mapeamento de perfil. Trate este resultado como ponto de partida para conversa, não como conclusão sobre quem você é.';

export const FECHAMENTO_RESSALVA = 'Perfil comportamental não é sentença. Ele muda com fase de vida, com o time em que você está e com o que você viveu recentemente. Se refizer este mapeamento daqui a um ano, é provável que o resultado seja diferente — e isso não é erro do instrumento, é a vida acontecendo.';

export const RODAPE_LEGAL = 'Este material é uma ferramenta de autoconhecimento e apoio à decisão. Não é um teste psicológico nem um diagnóstico clínico, e não substitui avaliação feita por profissional habilitado. Nenhuma resposta foi gravada em servidor: este resultado existe apenas neste aparelho.';
