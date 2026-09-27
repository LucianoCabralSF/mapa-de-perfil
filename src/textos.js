// Biblioteca de textos do relatorio.
// Regras de redacao: segunda pessoa, frases curtas, sem jargao de RH.
// Pontos de atencao descrevem o efeito do comportamento, nunca julgam
// a pessoa. Nenhum texto sugere que ela esta na carreira errada.

// Chave: fator dominante, ou dominante + apoio (ex.: EA = Executor com apoio de Analista).
export const RETRATOS = {
  E: 'Você vai direto ao ponto. Onde muita gente ainda está analisando, você já decidiu e começou. Gosta de desafio, de meta clara e de ter controle sobre o resultado. Ritmo acelerado não te assusta: o que te incomoda é a lentidão e a reunião que termina sem decisão. Prefere errar rápido e corrigir no caminho a esperar a certeza absoluta. Quando um assunto trava, as pessoas costumam olhar para você esperando que alguém puxe a frente, e você normalmente puxa.',
  C: 'Você move as coisas pelas pessoas. Conversa com facilidade, cria clima e consegue engajar até quem estava sem energia. Gosta de ambiente onde as ideias circulam e prefere resolver falando a resolver por escrito. Aceita bem o novo e se entusiasma rápido com uma possibilidade. Percebe cedo quando o ânimo de um grupo caiu e costuma ser quem dá o tom da conversa. Sua força está em conectar gente diferente em torno de um objetivo, e seu risco está em prometer mais do que o prazo comporta.',
  P: 'Você é a base que segura o time. Mantém o ritmo constante, cumpre o que combinou e não precisa de holofote para trabalhar bem. As pessoas te procuram quando precisam ser ouvidas, porque você escuta de verdade e não expõe ninguém. Prefere ambiente previsível, com tempo para fazer bem feito. Mudança repentina te incomoda menos pelo novo e mais pela bagunça que causa em quem está ao redor. Em fase de crise, é você quem mantém o grupo funcionando enquanto o resto discute o que fazer.',
  A: 'Você confia no que pode ser verificado. Antes de decidir, quer o dado, o critério e o detalhe conferido. Tem padrão alto e percebe o erro que passou por todo mundo. Prefere um processo claro a um improviso brilhante e não gosta de prometer o que não tem certeza de cumprir. Quando algo dá errado, você costuma ser quem já tinha anotado o ponto fraco antes de o problema aparecer. Sua contribuição é dar solidez ao que o time entrega, mesmo quando isso exige um pouco mais de tempo.',
  EC: 'Você junta velocidade e presença. Decide rápido e, ao mesmo tempo, sabe trazer as pessoas para a decisão: não impõe, convence. Costuma ser quem abre a reunião com uma proposta e sai dela com o grupo engajado. Gosta de palco, de desafio visível e de resultado que dá para comemorar. Quando o ritmo cai, é você quem sacode a equipe. Sob pressão, pode falar mais do que ouvir e atropelar quem precisa de tempo para pensar. Detalhe e acompanhamento costumam ficar para outra pessoa.',
  EP: 'Você decide com firmeza, mas não abandona o time no caminho. Gosta de meta clara e cobra resultado e, ao mesmo tempo, sustenta a equipe nos períodos difíceis, sem alarde. Essa combinação é rara: a pressa de quem quer entregar convive com a constância de quem quer que a entrega dure. Você prefere mudanças com rumo definido a mudanças de impulso. Sob pressão, pode segurar a própria impaciência por tempo demais e depois soltá-la de uma vez. As pessoas confiam em você porque sabem o que esperar.',
  EA: 'Você decide rápido, mas não no escuro. Antes de puxar a frente, quer saber se os números fecham, e costuma ser a pessoa que chega à reunião já com a proposta e a conta feita. A pressa e o critério convivem em você: o resultado importa, e ele precisa ser bem feito. Quando o time improvisa demais, você se incomoda tanto com a lentidão quanto com o descuido. Sob pressão, pode endurecer o tom e cobrar precisão de quem ainda está entendendo o problema.',
  CE: 'Você convence e realiza. Sua energia com as pessoas vem acompanhada de vontade de chegar a algum lugar: você engaja o grupo, mas em torno de uma meta. É comum ver você transformando uma conversa animada em plano de ação e cobrando que ele saia do papel. Gosta de reconhecimento público e de desafios que dá para mostrar. Sob pressão, pode se comprometer rápido demais e depois precisar correr para cumprir. Rotina longa e trabalho isolado costumam drenar a sua energia.',
  CP: 'Você é a pessoa que cuida do clima. Conversa com facilidade, acolhe quem chega e percebe rápido quando alguém não está bem. Diferente de quem só empolga no começo, você também sustenta: continua presente quando a animação inicial passa. Prefere resolver desentendimentos conversando, com calma e sem expor ninguém. Ambientes de competição agressiva te desgastam. Sob pressão, pode evitar a conversa difícil para não estragar a relação e acabar carregando um incômodo que deveria ter sido dito antes.',
  CA: 'Você comunica com cuidado. Gosta de gente e de conversa, mas não fala por falar: prefere chegar com a informação certa e a explicação clara. Essa combinação faz de você uma boa ponte entre quem pensa nos detalhes e quem precisa entender o todo. Você se entusiasma com ideias novas e, logo depois, quer saber se elas se sustentam. Sob pressão, pode oscilar entre o desejo de agradar e a necessidade de ter razão, e demorar para fechar uma posição.',
  PE: 'Você é constante e, quando precisa, firme. Mantém o ritmo sem alarde, cumpre o que combinou e, na hora em que o time trava, consegue assumir a frente sem atropelar ninguém. As pessoas confiam em você porque sabem que não há surpresa: o que você promete, entrega. Prefere metas claras e tempo razoável para cumpri-las. Mudanças bruscas te incomodam, mas, depois de entender o motivo, você costuma ser quem faz a mudança acontecer. Sob pressão, pode endurecer em silêncio.',
  PC: 'Você cuida das pessoas com paciência e presença. É quem escuta até o fim, lembra do aniversário, percebe quem ficou de fora e traz para a roda. O time se sente seguro perto de você. Gosta de ambiente harmonioso, de relações duradouras e de trabalho em que dá para ajudar de verdade. Tem facilidade para mediar conflitos, porque ninguém sente você como ameaça. Sob pressão, pode dizer sim para tudo e se sobrecarregar em silêncio, esperando que alguém perceba.',
  PA: 'Você trabalha com calma e com critério. Prefere fazer bem feito a fazer rápido, segue o processo e cuida para que nada importante escape. É a pessoa que a equipe procura quando precisa de algo confiável, feito do jeito certo e entregue no combinado. Mudanças sem planejamento te incomodam bastante, e você costuma pedir tempo e informação antes de aceitar um rumo novo. Sob pressão, pode se fechar e trabalhar mais horas em vez de pedir ajuda ou dizer que o prazo não fecha.',
  AE: 'Você analisa e executa. Não decide por impulso, mas também não trava na análise: quando os dados fecham, você age com firmeza e cobra que a decisão seja cumprida. Tem padrão alto para si e para os outros e se incomoda com retrabalho causado por pressa ou descuido. Costuma enxergar antes o risco que os outros ignoram. Sob pressão, a crítica pode sair áspera, porque você aponta o problema sem suavizar. As pessoas aprendem com você, mesmo quando a conversa não é leve.',
  AC: 'Você une rigor e diálogo. Gosta de explicar o porquê das coisas, de mostrar os dados e de ajudar as pessoas a entenderem o raciocínio. Isso faz de você uma boa referência técnica que não fica isolada no próprio canto. Aprecia ideias novas, desde que alguém tenha pensado nas consequências. Em reunião, costuma ser quem faz a pergunta que ninguém tinha feito. Sob pressão, pode se alongar demais nas explicações e perder o tempo da decisão, ou se frustrar quando o grupo não acompanha o detalhe.',
  AP: 'Você é a pessoa da precisão serena. Trabalha com método, no seu ritmo, e entrega com uma qualidade difícil de encontrar. Não gosta de improviso nem de pressão artificial; rende melhor com prazos realistas e regras claras. Observa muito antes de falar e, quando fala, costuma ter razão. Prefere poucas relações de confiança a muitas relações superficiais. Sob pressão, pode se retrair, revisar demais e adiar a entrega por achar que ainda não está pronta, mesmo quando já está bem feita.',
};

// Uma frase para o resumo da primeira pagina.
export const SINTESE = {
  E: 'Age pela decisão: rende com meta clara, autonomia e resultado visível.',
  C: 'Age pelas pessoas: rende com espaço para falar, criar e engajar o grupo.',
  P: 'Age pela constância: rende com previsibilidade, confiança e tempo para fazer bem feito.',
  A: 'Age pelo critério: rende com informação confiável, processo claro e tempo para conferir.',
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
    'Delegar te custa: você acredita que resolve mais rápido por conta própria.',
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
    'Você adia decisão difícil esperando que o clima melhore por si só.',
  ],
  A: [
    'A busca pelo certo atrasa a entrega do suficiente.',
    'Sua análise pode virar trava quando falta dado.',
    'Você acaba cobrando dos outros o mesmo padrão alto que usa consigo.',
    'Crítica ao seu trabalho te atinge mais do que você admite.',
    'Você evita arriscar mesmo quando o risco é pequeno.',
  ],
};

// Diante de conflito: o que o estilo rende e o que custa.
export const CONFLITO_VOCE = {
  COL: {
    rende: 'Você busca a solução que atenda os dois lados e costuma sair do conflito com a relação mais forte e uma saída melhor do que a original.',
    custa: 'Colaborar leva tempo. Em assunto pequeno ou urgente, insistir em construir tudo junto pode cansar o grupo e atrasar uma decisão simples.',
  },
  NEG: {
    rende: 'Você encontra o meio-termo possível e destrava conversas que estavam paradas. Seu jeito prático ajuda o grupo a seguir em frente.',
    custa: 'Dividir a diferença nem sempre resolve o problema de fundo. Às vezes o meio-termo entrega a cada lado só metade do que precisava, e o problema volta mais tarde.',
  },
  COM: {
    rende: 'Você defende o que acredita com clareza e firmeza. Em crise, decisão urgente ou questão de princípio, essa postura evita que o grupo fique sem direção.',
    custa: 'Usado sempre, o estilo competitivo cala quem pensa diferente. As pessoas podem concordar na sua frente e resistir depois, longe de você.',
  },
  CED: {
    rende: 'Você preserva a relação e sabe reconhecer quando o outro tem razão, ou quando o assunto importa mais para o outro lado. Isso gera boa vontade e confiança.',
    custa: 'Ceder com frequência faz suas ideias e necessidades sumirem da mesa. Com o tempo, o incômodo acumulado cobra um preço, em você ou na relação.',
  },
  EVI: {
    rende: 'Você sabe escolher suas batalhas. Deixar um assunto esfriar evita discussões inúteis e dá tempo para as emoções baixarem antes da conversa.',
    custa: 'Quando vira hábito, evitar deixa problemas importantes crescerem em silêncio. O conflito não desaparece: só muda de lugar e volta maior.',
  },
};

// Como voce lida com emocoes.
export const EMOCAO_FORTE = {
  AUT: 'Você costuma perceber o que sente enquanto sente, e não só depois. Isso te dá a chance de escolher como reagir, em vez de deixar a emoção decidir por você.',
  CTR: 'Você mantém o equilíbrio em situações que tiram muita gente do eixo. Consegue pensar antes de responder e cumpre o que planejou mesmo sem vontade.',
  EMP: 'Você percebe o que as pessoas sentem, mesmo quando elas não dizem. Isso faz de você alguém com quem é fácil conversar e em quem a equipe confia.',
  REL: 'Você lida bem com as relações: dá retorno difícil sem ferir, media desentendimentos e consegue manter o vínculo mesmo depois de uma discordância.',
};

export const EMOCAO_DESENVOLVER = {
  AUT: 'Parece que você nem sempre percebe a tempo o que está sentindo. Reconhecer a emoção enquanto ela acontece é o primeiro passo para lidar melhor com ela.',
  CTR: 'A reação no calor do momento aparece como seu ponto mais sensível. Criar um pequeno intervalo entre o que você sente e o que você faz tende a mudar muito o resultado.',
  EMP: 'Perceber o que o outro está sentindo aparece como a área menos forte. Às vezes o sinal está no tom, na ausência ou no silêncio, e não nas palavras.',
  REL: 'Conversas difíceis e desentendimentos aparecem como a área que mais pede atenção. Evitar essas conversas costuma sair mais caro do que tê-las.',
};

export const EMOCAO_EQUILIBRADO = 'As quatro áreas aparecem próximas entre si, sem uma que se destaque para baixo. Isso não significa que tudo esteja perfeito: significa que, na forma como você se percebe, não há um ponto claramente mais frágil que os outros.';

export const EMOCAO_LEITURA = 'Esta parte mede a percepção que você tem de si nas últimas semanas, e não a sua inteligência emocional de forma absoluta. Por isso o relatório mostra só a ordem entre as quatro áreas.';

// Plano de desenvolvimento: uma acao do fator dominante, uma do dominio
// emocional a desenvolver e uma do estilo principal de conflito.
export const ACAO_FATOR = {
  E: 'Pergunte a opinião de duas pessoas antes da próxima decisão importante e espere as respostas antes de bater o martelo.',
  C: 'Escolha um compromisso desta semana e anote por escrito o prazo e o próximo passo, para garantir que a ideia vire entrega.',
  P: 'Identifique um incômodo que você vem segurando e fale sobre ele nesta semana, com calma, antes que vire sobrecarga.',
  A: 'Escolha uma entrega em que o suficiente basta e entregue no prazo, sem a última revisão. Observe o que acontece de fato.',
};

export const ACAO_EMOCAO = {
  AUT: 'Pare por um minuto três vezes ao dia e nomeie o que está sentindo, com uma palavra só. Anote as palavras durante duas semanas.',
  CTR: 'Espere dez minutos antes de responder qualquer mensagem que te irritou. Repare como a resposta muda depois da pausa.',
  EMP: 'Faça uma pergunta a mais sobre como a pessoa está na próxima conversa com alguém da equipe, e escute a resposta sem interromper.',
  REL: 'Escolha uma conversa que você vem adiando e marque um horário para ela nesta semana. Comece dizendo o que você quer preservar na relação.',
};

export const ACAO_CONFLITO = {
  COL: 'Decida rápido nos próximos desacordos pequenos, em vez de construir tudo junto. Guarde a colaboração para o que realmente importa.',
  NEG: 'Pergunte a cada lado o que não pode faltar antes de propor o meio-termo no próximo conflito. Negocie a partir disso.',
  COM: 'Repita com suas palavras o argumento do outro antes de responder na próxima discordância. Só depois apresente o seu.',
  CED: 'Diga o que você pensa antes de concordar na próxima discordância, mesmo que no fim aceite a outra posição.',
  EVI: 'Escolha um assunto que você vem deixando para depois e leve para a conversa nesta semana, com hora marcada e em particular.',
};

export const MOTIVADOR_ALTO = {
  REA: 'Você acende diante de um desafio difícil. Meta clara e progresso visível te dão energia; tarefa fácil demais te apaga.',
  AUT: 'Você rende quando tem liberdade para decidir o caminho. Confiança vale mais para você do que instrução detalhada.',
  SEG: 'Previsibilidade te dá tranquilidade para produzir. Saber o que vem pela frente importa mais para você do que a novidade.',
  REC: 'Receber reconhecimento pelo que você entrega faz diferença real no seu ânimo. Quando há reconhecimento, você rende o dobro.',
  PRO: 'Você precisa enxergar para que serve o que faz. Sentido importa mais do que status, e isso sustenta você em período difícil.',
  PER: 'O vínculo com o time é o que te prende. Trabalhar com gente de quem você gosta muda sua disposição de forma direta.',
};

export const MOTIVADOR_BAIXO = {
  REA: 'Competir e superar marca não é o que te move. Ambiente que só fala de meta e ranking te deixa indiferente.',
  AUT: 'Liberdade total não é o que você busca. Ter alguém definindo o caminho te incomoda pouco, e às vezes até ajuda.',
  SEG: 'Estabilidade não é o que te segura. Rotina previsível demais cansa você mais do que a incerteza.',
  REC: 'Aplauso e visibilidade importam pouco para você. Cargo e título não são o que te fazem levantar da cama.',
  PRO: 'Causa e propósito não são o centro da sua motivação. Você separa o trabalho do sentido de vida sem sofrer com isso.',
  PER: 'Pertencer ao grupo pesa pouco na sua decisão. Você trabalha bem por conta própria e não sente falta do vínculo do time.',
};

export const TEXTO_TENSAO = {
  baixa: 'O que o seu trabalho pede hoje está perto de quem você é naturalmente. Isso significa menos energia gasta em sustentar uma postura e mais energia disponível para a entrega.',
  moderada: 'Existe um ajuste entre quem você é e o que o trabalho pede hoje. Isso é comum e normalmente sustentável. Vale saber onde está esse ajuste, porque é ali que sua energia é consumida sem aparecer no resultado.',
  alta: 'Há uma distância grande entre quem você é naturalmente e o papel que você sustenta hoje. Isso custa energia todos os dias, e é um custo que costuma passar despercebido até virar cansaço. Não é sinal de erro: é informação sobre onde você está gastando reserva.',
};

export const FATOR_FORCADO = {
  E: 'O ambiente está pedindo mais firmeza e velocidade de decisão do que é natural em você. Você tem assumido a frente em situações que normalmente deixaria para outro.',
  C: 'O ambiente está pedindo mais exposição e articulação do que é natural em você. Você tem falado, buscado convencer e circulado mais do que seu ritmo pede.',
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

export const FECHAMENTO_RESSALVA = 'Perfil comportamental não é sentença. Ele muda com fase de vida, com o time em que você está e com o que você viveu recentemente. Se refizer este mapeamento daqui a um ano, é provável que o resultado seja diferente — e isso não é erro do instrumento, é a vida acontecendo. A parte sobre emoções mostra a percepção que você tem de si, e não uma medida externa.';

export const RODAPE_LEGAL = 'Este material é uma ferramenta de autoconhecimento e apoio à decisão. Não é um teste psicológico nem um diagnóstico clínico, e não substitui avaliação feita por profissional habilitado. Nenhuma resposta foi gravada em servidor: este resultado existe apenas neste aparelho.';
