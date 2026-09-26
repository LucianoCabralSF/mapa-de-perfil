# Mapa de Perfil — Especificação de Design

Data: 2026-09-26
Autor: Luciano Cabral Ferreira (DEL / Lótus Desenvolvimento Humano e Gerencial)

## 1. Propósito

Página web onde uma pessoa responde um questionário de aproximadamente 12 a 14
minutos pelo celular e, ao terminar, vê imediatamente um relatório com seu
perfil comportamental, suas motivações e uma leitura de quanto o momento de
vida e a pressão do ambiente podem estar distorcendo esse retrato. Com opção de
salvar em PDF.

Uso imediato: material prático de uma aula de liderança conduzida por Luciano.
Uso derivado: demonstrar como funciona um mapeamento de perfil de candidato.

### O que define sucesso

- A pessoa responde sozinha no celular, sem instrução adicional.
- Duas pessoas diferentes recebem relatórios visivelmente diferentes (o
  instrumento discrimina de fato).
- O relatório é reconhecível: a pessoa lê e diz "é isso mesmo".
- A pessoa entende que o resultado é uma fotografia, não uma sentença — e o
  relatório diz explicitamente o que, no resultado dela, pode ser efeito do
  momento e não do caráter.
- Gera discussão em sala.
- Salva em PDF sem atrito.

### Restrições (decididas pelo usuário)

- **Nada é gravado em servidor.** Sem banco de dados, sem backend, sem cadastro.
  O resultado existe apenas no navegador de quem respondeu.
- Distribuição por link público: repositório público no GitHub + GitHub Pages.
- O usuário fará o push e a publicação por conta própria.
- Identidade visual DEL/Lótus (azul-marinho, dourado, creme).

### Fora de escopo

Login, painel do avaliador, comparação entre candidatos, banco de vagas,
histórico, envio de e-mail, exportação de dados agregados, uso de IA em tempo
de execução.

## 2. O instrumento

Quatro blocos, nesta ordem.

### 2.1 Bloco A1 — Comportamento natural

Quatro fatores, no modelo de quatro quadrantes (linhagem DISC), nomeados em
português:

| Código | Fator | Descrição | Equivalência |
|---|---|---|---|
| E | Executor | Resultado, decisão rápida, desafio, senso de urgência | Dominância |
| C | Comunicador | Pessoas, entusiasmo, influência, expressão | Influência |
| P | Planejador | Constância, paciência, harmonia, apoio ao time | Estabilidade |
| A | Analista | Precisão, regras, dados, qualidade | Conformidade |

**Formato: escolha forçada.** 10 telas. Cada tela apresenta 4 adjetivos ou
frases curtas, um por fator. A pessoa marca qual **mais** se parece com ela e
qual **menos**.

**Âncora (instrução fixa no topo de cada tela):** "Como você é na maior parte
da sua vida, fora de qualquer trabalho específico."

Justificativa do formato: em escala Likert a desejabilidade social achata os
resultados e os perfis saem todos parecidos. A escolha forçada obriga a
priorizar e produz perfis nitidamente distintos entre pessoas — condição para
que a dinâmica de sala funcione.

### 2.2 Bloco A2 — Comportamento adaptado

Os **mesmos 10 blocos** do A1, com âncora diferente:

**Âncora:** "Como você sente que precisa ser no seu trabalho (ou estudo) hoje,
para dar conta do que esperam de você."

Para reduzir a repetição mecânica, os 10 blocos são apresentados em ordem
invertida em relação ao A1, e as 4 palavras dentro de cada bloco em ordem
também invertida. A ordem é fixa e definida no código, não sorteada — o mesmo
conjunto de respostas sempre produz o mesmo resultado.

A distância entre A1 e A2 é a medida de **quanto o ambiente atual está
exigindo da pessoa algo diferente do que ela é**.

### 2.3 Bloco B — Motivações

Seis âncoras motivacionais, derivadas de Schein (Âncoras de Carreira), Hogan
MVPI e Teoria da Autodeterminação:

| Código | Motivador | O que move |
|---|---|---|
| REA | Realização | Vencer desafios, superar metas, evoluir |
| AUT | Autonomia | Liberdade para decidir como fazer |
| SEG | Segurança | Estabilidade, previsibilidade, baixo risco |
| REC | Reconhecimento | Ser visto, valorizado, ter status |
| PRO | Propósito | Causa, impacto na vida das pessoas |
| PER | Pertencimento | Time, vínculo, fazer parte de algo |

**Formato: concordância.** 12 afirmações, 2 por motivador, escala de 1 a 5
(Discordo totalmente → Concordo totalmente). Aqui a escala funciona porque o
resultado apresentado é o **ranking relativo** entre os seis, não a nota
absoluta de cada um.

### 2.4 Bloco C — Momento atual

Cinco perguntas, escala de 1 a 5, sobre a fase de vida em que a pessoa está
agora. Não medem personalidade: medem o quanto o retrato pode estar
contaminado.

| Código | Pergunta (sentido) | Direção |
|---|---|---|
| `C1` | Nível de pressão e cobrança que sinto nas últimas semanas | Direta |
| `C2` | Passei por mudanças importantes nos últimos 6 meses (trabalho, moradia, família, saúde) | Direta |
| `C3` | Tenho dormido e descansado bem | Invertida |
| `C4` | Estou satisfeito com minha situação atual de trabalho ou estudo | Invertida |
| `C5` | Minha vida hoje está previsível e sob controle | Invertida |

"Direção invertida" significa que a pontuação é espelhada no cálculo, para que
em todas as cinco a nota alta signifique **mais turbulência**.

### 2.5 Volume total

| Bloco | Telas |
|---|---|
| Identificação | 1 |
| A1 — natural | 10 |
| A2 — adaptado | 10 |
| B — motivações | 12 |
| C — momento | 5 |
| **Total de telas de resposta** | **37** |

Estimativa de 12 a 14 minutos.

**Chave de redução:** o Bloco A2 é controlado por uma constante única no código
(`INCLUIR_ADAPTADO`). Desligando-a, o teste cai para 27 telas e ~8 minutos, o
relatório omite a seção Natural × Adaptado e todo o resto continua funcionando.
Serve para o caso de o tempo de aula ficar curto.

## 3. Cálculo dos resultados

### 3.1 Comportamento (aplicado separadamente a A1 e A2)

- "Mais parecido" soma **+1** ao fator escolhido; "menos parecido" soma **−1**.
- Pontuação bruta por fator: intervalo de −10 a +10. A soma das quatro é sempre 0.
- Intensidade exibida: `pct = (bruto + 10) / 20 * 100`, arredondada ao inteiro.
  Lida como posição relativa dentro da própria pessoa; 50% é a linha de base.
- **Perfil dominante** = fator de maior pontuação bruta **no A1 (natural)**. É
  o A1 que define quem a pessoa é; o A2 entra apenas como comparação.
- **Perfil de apoio**: se `(bruto1 - bruto2) <= 2`, o título vira
  "Dominante com apoio de Segundo". Caso contrário, só o dominante.
- **Desempate** (qualquer empate de bruto): ordem fixa `E > C > P > A`.
  Regra determinística — a mesma resposta produz sempre o mesmo resultado.

### 3.2 Tensão de adaptação (A1 × A2)

Mede o esforço que o ambiente atual está cobrando.

- Diferença por fator: `dif[f] = pctAdaptado[f] - pctNatural[f]`.
- **Índice de Tensão** = média dos quatro valores absolutos:
  `tensao = (|difE| + |difC| + |difP| + |difA|) / 4`, em pontos percentuais.

| Faixa | Leitura |
|---|---|
| 0 a 9 | Baixa — o ambiente combina com quem a pessoa é |
| 10 a 19 | Moderada — há ajuste, dentro do esperado |
| 20 ou mais | Alta — a pessoa está sustentando um papel distante do natural |

- **Fator mais forçado** = maior `dif[f]` positivo (a pessoa está puxando mais
  isso do que lhe é natural).
- **Fator mais contido** = maior `dif[f]` negativo (a pessoa está segurando
  algo que lhe é natural).
- Se todos os `dif[f]` forem menores que 5 em valor absoluto, nenhum fator é
  apontado como forçado ou contido; o relatório apenas registra alinhamento.

Tensão alta e sustentada é o mecanismo mais conhecido de desgaste e
desengajamento no trabalho. Esse é o achado de maior valor prático do
relatório, e o texto o trata como informação, não como problema pessoal.

### 3.3 Motivações

- Cada motivador soma suas 2 afirmações: bruto de 2 a 10.
- Exibição: `pct = (bruto - 2) / 8 * 100`.
- Ranking decrescente. Empate resolvido pela ordem fixa
  `REA > AUT > SEG > REC > PRO > PER`.
- Destaques: os **2 primeiros** ("o que mais te move") e o **último**
  ("o que menos te move").

### 3.4 Momento atual

- `C1` e `C2` entram direto: nota de 1 a 5 vira 0 a 4.
- `C3`, `C4` e `C5` entram invertidas: `4 - (nota - 1)`.
- Soma de 0 a 20. Exibição: `pct = soma / 20 * 100`.

| Faixa | Nome | Leitura |
|---|---|---|
| 0 a 25 | Momento estável | O retrato tende a refletir bem o padrão habitual |
| 26 a 55 | Momento em movimento | Há fatores de contexto pesando; ler com atenção |
| 56 a 100 | Momento turbulento | Fotografia de uma fase, não retrato definitivo |

### 3.5 Cruzamento momento × tensão

Quando **momento é turbulento** e **tensão é alta** ao mesmo tempo, o relatório
exibe um alerta reforçado no topo da seção de ressalvas: são as duas condições
em que o resultado menos deve ser tratado como característica permanente.

## 4. O relatório

Renderizado na mesma página, imediatamente após a última resposta.

1. **Cabeçalho** — marca DEL/Lótus, nome da pessoa, data.
2. **Perfil dominante** — título grande e um parágrafo de retrato (base: A1).
3. **Gráfico de barras** dos 4 fatores naturais em porcentagem.
4. **Natural × Adaptado** — gráfico com as duas medidas lado a lado, Índice de
   Tensão com sua faixa, e o texto sobre o fator forçado e o fator contido.
5. **Termômetro do Momento** — a faixa apurada e o que ela significa.
6. **Motivadores** — os 6 em ranking, com destaque nos 2 primeiros e no último.
7. **Pontos fortes** — 5 marcadores.
8. **Pontos de atenção** — 5 marcadores, redigidos sem julgamento.
9. **Como se comunicar com você** — o que funciona e o que trava.
10. **Ambiente ideal x ambiente que desgasta.**
11. **O que te desmotiva** — derivado do motivador de menor pontuação.
12. **Leia com cuidado** — seção de ressalvas, montada a partir dos achados
    reais da pessoa. Ver 4.2.
13. **Rodapé** — aviso de que é ferramenta de autoconhecimento e apoio à
    decisão, não teste psicológico nem diagnóstico clínico, e que não substitui
    avaliação profissional.

### 4.1 Biblioteca de textos

Todos os textos são escritos previamente e selecionados por regra — sem geração
em tempo de execução:

- 4 retratos (um por fator dominante)
- 4 x 5 pontos fortes
- 4 x 5 pontos de atenção
- 4 textos de comunicação
- 4 textos de ambiente
- 6 textos de motivador na versão "te move"
- 6 textos de motivador na versão "te desmotiva quando falta"
- 3 textos de faixa de tensão
- 4 textos "você está forçando este fator" + 4 textos "você está contendo este
  fator" + 1 texto de alinhamento
- 3 textos de faixa de momento
- 1 texto de alerta reforçado (momento turbulento + tensão alta)

### 4.2 Seção "Leia com cuidado"

Diferente de um aviso legal genérico: é montada com o que apareceu no resultado
daquela pessoa. Reúne, quando aplicável:

- A faixa do momento, dita em linguagem direta.
- O fator que está sendo forçado, com a observação de que a medida do
  comportamento adaptado tende a puxar o resultado naquela direção.
- O alerta reforçado do cruzamento, quando as duas condições se somam.
- Uma frase de fechamento, sempre presente, afirmando que perfil comportamental
  muda com fase de vida, e que refazer o mapeamento em outro momento
  provavelmente dará um resultado diferente — e isso não é erro do instrumento.

### 4.3 Exportação em PDF

Botão "Salvar em PDF" que chama a função de impressão do navegador, com folha
de estilo `@media print` preparada: fundo branco, cores legíveis em papel,
elementos de navegação ocultos, quebras de página controladas.

No celular o fluxo é Imprimir → Salvar como PDF, disponível nativamente em
Android e iOS. Bibliotecas de geração de PDF em JavaScript foram descartadas
por instabilidade em navegadores móveis.

## 5. Arquitetura técnica

### 5.1 Estrutura

Arquivo único `index.html` na raiz do repositório, contendo marcação, estilos e
lógica. Sem framework, sem dependência externa, sem requisição de rede. Os
gráficos são SVG gerado pelo próprio código.

Justificativa: o projeto é pequeno, precisa abrir instantaneamente em celular
com internet ruim, e o usuário não é programador — um arquivo é mais fácil de
versionar, entender e publicar.

Organização interna do arquivo, em seções comentadas e independentes:

| Seção | Responsabilidade |
|---|---|
| ESTILOS | Identidade visual, layout responsivo, folha de impressão |
| DADOS/ITENS | Os 10 blocos de palavras, as 12 afirmações, as 5 do momento |
| DADOS/TEXTOS | Biblioteca de textos do relatório |
| MOTOR | Cálculo de pontuação, tensão, momento, desempate, seleção de textos |
| TELAS | Navegação entre abertura, blocos e relatório |
| GRAFICOS | Geração dos SVG |

O motor de cálculo não conhece a interface: recebe as respostas e devolve um
objeto de resultado. Isso permite conferir a matemática isoladamente.

### 5.2 Fluxo de telas

`Abertura` → `Identificação` → `Bloco A1 (10)` → `Virada de âncora` →
`Bloco A2 (10)` → `Bloco B (12)` → `Bloco C (5)` → `Relatório`

- Barra de progresso contínua ao longo das 37 telas.
- Botão voltar em todas as telas de pergunta.
- Identificação pede apenas o primeiro nome (obrigatório, só para o cabeçalho
  do relatório) e, opcionalmente, cargo ou área de interesse.
- **Virada de âncora**: tela intermediária, sem pergunta, explicando que as
  mesmas palavras vão reaparecer e que agora a referência é o trabalho de hoje.
  Sem ela, a repetição parece defeito do sistema.
- A abertura explica que a escolha é relativa (nenhuma palavra precisa ser
  perfeita) e que as respostas não são gravadas em lugar nenhum.

### 5.3 Validação

- Não avança sem resposta na tela atual.
- Nos Blocos A1 e A2, a mesma palavra não pode ser marcada como "mais" e
  "menos" simultaneamente — ao marcar uma, a outra é liberada automaticamente.

### 5.4 Persistência

Respostas ficam em memória durante o preenchimento, com espelho em
`sessionStorage` apenas para sobreviver a um recarregamento acidental da
página. `sessionStorage` é apagado pelo próprio navegador ao fechar a aba, e
nunca sai do aparelho da pessoa. Acesso protegido por `try/catch`: se o
navegador bloquear armazenamento, o teste continua funcionando normalmente.

Nenhum dado é transmitido para servidor algum.

### 5.5 Publicação

Repositório público no GitHub com `index.html` na raiz, GitHub Pages servindo
da branch `main`, pasta raiz. Nome do repositório: `mapa-de-perfil`. URL
resultante: `https://lucianocabralsf.github.io/mapa-de-perfil/`

O push e a ativação do Pages serão feitos pelo próprio usuário. O repositório
local fica preparado, com README explicando o passo a passo.

## 6. Como será conferido

- **Matemática**: casos de teste com respostas conhecidas — resposta toda em um
  fator deve produzir aquele fator como dominante; A1 e A2 idênticos devem
  produzir tensão zero; A1 e A2 opostos devem produzir tensão máxima; empates
  devem cair na regra de desempate documentada; as três perguntas invertidas do
  Bloco C devem produzir turbulência alta quando respondidas com nota baixa.
- **Cobertura de textos**: verificar que toda combinação possível de fator
  dominante, ranking de motivadores, faixa de tensão e faixa de momento
  encontra texto correspondente, sem lacuna.
- **Chave de redução**: com `INCLUIR_ADAPTADO` desligada, o teste deve fechar
  em 27 telas e o relatório sair íntegro, sem a seção Natural × Adaptado e sem
  menção a tensão em nenhum outro lugar.
- **Navegador**: abrir a página, responder do início ao fim, conferir o
  relatório e a prévia de impressão.
- **Responsividade**: conferir em largura de celular.

## 7. Riscos e decisões conscientes

- **Instrumento não é validado psicometricamente.** É inspirado em modelos
  consagrados, mas não passou por estudo de validação. Por isso o rodapé
  posiciona a ferramenta como autoconhecimento e apoio à decisão, não como
  teste psicológico — que, no Brasil, é atividade privativa de psicólogo
  (Resolução CFP). O texto do rodapé é parte do produto, não enfeite.
- **Fadiga de preenchimento.** 37 telas é longo para um celular em sala de
  aula, e o Bloco A2 repete palavras já vistas. Mitigações: uma pergunta por
  tela com resposta em um toque, tela de virada explicando a repetição, barra
  de progresso sempre visível, e a chave de redução como plano B.
- **Escolha forçada incomoda algumas pessoas** ("nenhuma dessas palavras sou
  eu"). Mitigação: a tela de abertura explica que a escolha é relativa, não
  absoluta.
- **Risco de leitura errada da tensão.** Tensão alta não significa que a pessoa
  está no emprego errado, e o texto não pode sugerir isso — sugere apenas que
  há esforço sendo gasto em sustentar um papel, e que vale conversar sobre.
- **Impressão varia entre navegadores.** Mitigação: folha de impressão
  conservadora e teste de prévia antes da aula.
