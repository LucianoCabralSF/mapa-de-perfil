# Mapa de Perfil — Especificação de Design

Data: 2026-09-26
Autor: Luciano Cabral Ferreira (DEL / Lótus Desenvolvimento Humano e Gerencial)

## 1. Propósito

Página web onde uma pessoa responde um questionário de aproximadamente 7 minutos
pelo celular e, ao terminar, vê imediatamente um relatório com seu perfil
comportamental e suas motivações, com opção de salvar em PDF.

Uso imediato: material prático de uma aula de liderança conduzida por Luciano.
Uso derivado: demonstrar como funciona um mapeamento de perfil de candidato.

### O que define sucesso

- A pessoa responde sozinha no celular, sem instrução adicional.
- Duas pessoas diferentes recebem relatórios visivelmente diferentes (o
  instrumento discrimina de fato).
- O relatório é reconhecível: a pessoa lê e diz "é isso mesmo".
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

### 2.1 Bloco A — Comportamento

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

Justificativa: em escala Likert a desejabilidade social achata os resultados e
os perfis saem todos parecidos. A escolha forçada obriga a priorizar e produz
perfis nitidamente distintos entre pessoas — condição para que a dinâmica de
sala funcione.

### 2.2 Bloco B — Motivações

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

### 2.3 Volume total

22 telas, uma pergunta por tela. Estimativa de 6 a 8 minutos.

## 3. Cálculo dos resultados

### 3.1 Comportamento

- "Mais parecido" soma **+1** ao fator escolhido; "menos parecido" soma **−1**.
- Pontuação bruta por fator: intervalo de −10 a +10. A soma das quatro é sempre 0.
- Intensidade exibida: `pct = (bruto + 10) / 20 * 100`, arredondada ao inteiro.
  Lida como posição relativa dentro da própria pessoa; 50% é a linha de base.
- **Perfil dominante** = fator de maior pontuação bruta.
- **Perfil de apoio**: se `(bruto1 - bruto2) <= 2`, o título vira
  "Dominante com apoio de Segundo". Caso contrário, só o dominante.
- **Desempate** (qualquer empate de bruto): ordem fixa `E > C > P > A`.
  Regra determinística — a mesma resposta produz sempre o mesmo resultado.

### 3.2 Motivações

- Cada motivador soma suas 2 afirmações: bruto de 2 a 10.
- Exibição: `pct = (bruto - 2) / 8 * 100`.
- Ranking decrescente. Empate resolvido pela ordem fixa
  `REA > AUT > SEG > REC > PRO > PER`.
- Destaques: os **2 primeiros** ("o que mais te move") e o **último**
  ("o que menos te move").

## 4. O relatório

Renderizado na mesma página, imediatamente após a última resposta.

1. **Cabeçalho** — marca DEL/Lótus, nome da pessoa, data.
2. **Perfil dominante** — título grande e um parágrafo de retrato.
3. **Gráfico de barras** dos 4 fatores em porcentagem (SVG desenhado no projeto).
4. **Motivadores** — os 6 em ranking, com destaque nos 2 primeiros e no último.
5. **Pontos fortes** — 5 marcadores.
6. **Pontos de atenção** — 5 marcadores, redigidos sem julgamento.
7. **Como se comunicar com você** — o que funciona e o que trava.
8. **Ambiente ideal x ambiente que desgasta.**
9. **O que te desmotiva** — derivado do motivador de menor pontuação.
10. **Rodapé** — aviso de que é ferramenta de autoconhecimento e apoio à
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

### 4.2 Exportação em PDF

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
| DADOS/ITENS | Os 10 blocos de palavras e as 12 afirmações |
| DADOS/TEXTOS | Biblioteca de textos do relatório |
| MOTOR | Cálculo de pontuação, desempate, seleção de textos |
| TELAS | Navegação entre abertura, blocos e relatório |
| GRAFICOS | Geração dos SVG |

O motor de cálculo não conhece a interface: recebe as respostas e devolve um
objeto de resultado. Isso permite conferir a matemática isoladamente.

### 5.2 Fluxo de telas

`Abertura` → `Identificação` → `Bloco A (10 telas)` → `Bloco B (12 telas)` →
`Relatório`

- Barra de progresso contínua ao longo das 22 telas.
- Botão voltar em todas as telas de pergunta.
- Identificação pede apenas o primeiro nome (obrigatório, só para o cabeçalho
  do relatório) e, opcionalmente, cargo ou área de interesse.

### 5.3 Validação

- Não avança sem resposta na tela atual.
- No Bloco A, a mesma palavra não pode ser marcada como "mais" e "menos"
  simultaneamente — ao marcar uma, a outra é liberada automaticamente.

### 5.4 Persistência

Respostas ficam em memória durante o preenchimento, com espelho em
`sessionStorage` apenas para sobreviver a um recarregamento acidental da
página. `sessionStorage` é apagado pelo próprio navegador ao fechar a aba, e
nunca sai do aparelho da pessoa. Acesso protegido por `try/catch`: se o
navegador bloquear armazenamento, o teste continua funcionando normalmente.

Nenhum dado é transmitido para servidor algum.

### 5.5 Publicação

Repositório público no GitHub com `index.html` na raiz, GitHub Pages servindo
da branch `main`, pasta raiz. Nome do repositório: `mapa-de-perfil`. URL resultante:
`https://lucianocabralsf.github.io/mapa-de-perfil/`

O push e a ativação do Pages serão feitos pelo próprio usuário. O repositório
local fica preparado, com README explicando o passo a passo.

## 6. Como será conferido

- **Matemática**: casos de teste com respostas conhecidas — resposta toda em um
  fator deve produzir aquele fator como dominante; empates devem cair na regra
  de desempate documentada.
- **Cobertura de textos**: verificar que toda combinação possível de fator
  dominante e de ranking de motivadores encontra texto correspondente, sem
  lacuna.
- **Navegador**: abrir a página, responder do início ao fim, conferir o
  relatório e a prévia de impressão.
- **Responsividade**: conferir em largura de celular.

## 7. Riscos e decisões conscientes

- **Instrumento não é validado psicometricamente.** É inspirado em modelos
  consagrados, mas não passou por estudo de validação. Por isso o rodapé
  posiciona a ferramenta como autoconhecimento e apoio à decisão, não como
  teste psicológico — que, no Brasil, é atividade privativa de psicólogo
  (Resolução CFP). O texto do rodapé é parte do produto, não enfeite.
- **Escolha forçada incomoda algumas pessoas** ("nenhuma dessas palavras sou
  eu"). Mitigação: a tela de abertura explica que a escolha é relativa, não
  absoluta.
- **Impressão varia entre navegadores.** Mitigação: folha de impressão
  conservadora e teste de prévia antes da aula.
