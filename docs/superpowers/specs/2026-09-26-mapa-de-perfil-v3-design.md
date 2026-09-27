# Mapa de Perfil v3 — Especificação de Design

Data: 2026-09-26
Autor: Luciano Cabral Ferreira (DEL / Lótus Desenvolvimento Humano e Gerencial)
Substitui, nas partes indicadas, a spec `2026-09-26-mapa-de-perfil-design.md` (v1 + revisão 2). O que esta spec não menciona continua valendo como está naquela.

## 1. Por que existe a v3

Retorno de quem usou a v2 na aula de liderança:

- **A mesma pergunta em toda tela** ("Qual MAIS combina com você?", "No trabalho, o que pesa mais para você?") deixa o teste com cara de formulário mecânico, pouco profissional.
- **Opções curtas demais** ("Arrisco", "Tenho pressa") parecem brincadeira.
- **Pouca pergunta, pouco teste:** o instrumento parece leve demais para ser levado a sério.
- **Relatório raso:** curto e genérico.

E uma correção de propósito, dita por Luciano: **o objetivo do teste é ajudar o líder a compreender melhor quem trabalha com ele.** O relatório precisa falar também com o líder.

### O que define sucesso na v3

- Nenhuma tela de pergunta repete o texto de outra.
- Toda opção de resposta é uma frase completa sobre uma situação de trabalho.
- Preenchimento entre 15 e 20 minutos, sem sensação de maratona.
- O líder que recebe o PDF sabe, depois de ler o resumo e a parte 2, como se comunicar, reconhecer, delegar, conduzir conflito e perceber desgaste naquela pessoa.
- A pessoa que respondeu se reconhece na parte 1 e sai com 3 ações práticas.
- Continua valendo tudo da v1/v2: nada gravado em servidor, mesmo link, identidade DEL, linguagem neutra, não é teste psicológico.

### Fora de escopo

Relatório separado só para o líder, painel de equipe, comparação entre pessoas, envio automático ao líder, gravação de qualquer dado.

## 2. O instrumento

Seis etapas, nesta ordem:

| Etapa | Nome na tela | Formato | Telas | Tempo |
|---|---|---|---|---|
| 1 | Como você age | 12 situações × 4 reações, mais e menos | 12 | ~5 min |
| 2 | No seu trabalho hoje | 6 das 12 situações, mais e menos | 6 | ~2 min |
| 3 | Diante de conflito | 6 cenários × 5 reações, mais e menos provável | 6 | ~3 min |
| 4 | O que te move | 15 pares de frases | 15 | ~2 min |
| 5 | Como você lida com emoções | 16 frases de frequência, 2 por tela | 8 | ~2 min |
| 6 | Seu momento | 5 perguntas, em 2 telas (3 + 2) | 2 | ~1 min |
| | **Total** | | **49** | **~16 min** |

Com `INCLUIR_ADAPTADO = false`, a etapa 2 some: 43 telas, cerca de 14 minutos, 5 etapas.

### 2.1 Regra geral contra repetição

- **Nenhum texto de pergunta se repete** entre telas. O "texto de pergunta" de uma tela é a junção do rótulo de contexto (quando houver) com o título grande. É uma regra testável: o conjunto desses textos, em todas as telas de resposta, não tem duplicatas.
- As instruções de passo ("A que mais combina com você", "A que menos combina com você") deixam de ser título. Viram um **rótulo pequeno de passo** acima das opções, no formato `PASSO 1 DE 2 · A QUE MAIS COMBINA`.
- O título grande de cada tela é o conteúdo daquela tela: a situação, o cenário, o enquadramento do par ou a frase.

### 2.2 Etapa 1 — Como você age (substitui o Bloco A1)

- Mesmos quatro fatores e códigos: `E` Executor, `C` Comunicador, `P` Planejador, `A` Analista.
- **12 situações de trabalho.** Cada situação tem um **enunciado** (ex.: "Um cliente liga irritado cobrando um prazo que você não prometeu.") e **4 reações**, uma por fator, na ordem canônica `E, C, P, A`.
- Regras de redação das situações:
  - enunciado entre 60 e 160 caracteres;
  - reação entre 25 e 90 caracteres, na primeira pessoa, começando por verbo ("Assumo o contato e proponho uma data na hora.");
  - as 4 reações de uma situação são igualmente aceitáveis — nenhuma pode soar como a resposta certa;
  - as 12 situações cobrem contextos diferentes: reunião, prazo, cliente, equipe nova, erro, mudança, pressão da chefia, colega com dificuldade, decisão sem dados, rotina, conflito de prioridades, reconhecimento;
  - linguagem neutra (régua existente).
- Âncora da etapa, mostrada uma vez no respiro de abertura e como rótulo pequeno em cada tela: "Pense em como você costuma agir, na maior parte do tempo."
- Cálculo: igual ao atual (`pontuarComportamento`), com `n = 12`. Bruto de −12 a +12; `pct = (bruto + 12) / 24 × 100`. Perfil dominante, apoio e desempate sem mudança.

### 2.3 Etapa 2 — No seu trabalho hoje (substitui o Bloco A2)

- As situações de índice canônico `[1, 3, 5, 7, 9, 11]` (`BLOCOS_ADAPTADO`).
- Cada tela abre com a chamada fixa em rótulo — "AGORA, NO SEU TRABALHO DE HOJE" — seguida do enunciado original da situação. O título grande é o enunciado, o que mantém a regra 2.1: o texto completo da tela (rótulo + enunciado) não se repete, porque na etapa 1 a mesma situação aparece sem a chamada.
- Ordem de exibição fixa, invertida, com as opções invertidas (como hoje).
- Tensão calculada sobre os mesmos 6 blocos (como hoje).

### 2.4 Etapa 3 — Diante de conflito (nova)

Base: modelo de cinco estilos de gestão de conflito (Thomas e Kilmann), derivado da grade gerencial (Blake e Mouton), com dois eixos: **assertividade** (defender o próprio ponto) e **cooperação** (considerar o ponto do outro).

| Código | Estilo | Assertividade | Cooperação |
|---|---|---|---|
| COL | Colaborar | alta (1) | alta (1) |
| NEG | Negociar | média (0,5) | média (0,5) |
| COM | Competir | alta (1) | baixa (0) |
| CED | Ceder | baixa (0) | alta (1) |
| EVI | Evitar | baixa (0) | baixa (0) |

Ordem canônica (desempate): `COL, NEG, COM, CED, EVI`.

- **6 cenários de desacordo**, cada um com enunciado e **5 reações**, uma por estilo, na ordem canônica. A pessoa marca a reação **mais provável** e a **menos provável**.
- Mesmas regras de redação da etapa 1. Os 6 cenários variam o outro lado do conflito: colega de mesmo nível, chefia, pessoa da equipe, cliente, outra área, grupo em reunião.
- As perguntas e itens são **próprios**. O instrumento de Thomas-Kilmann tem direitos reservados e não é reproduzido; usa-se o modelo teórico, que é público.
- Cálculo:
  - "mais provável" soma +1 ao estilo; "menos provável" soma −1;
  - bruto de −6 a +6; `pct = (bruto + 6) / 12 × 100`;
  - estilo **principal** = maior bruto; **secundário** = segundo maior; desempate pela ordem canônica;
  - **posição no quadro:** média das coordenadas dos cinco estilos, ponderada pelo `pct` de cada um. Resultado: `assertividade` e `cooperacao`, de 0 a 100. Se todos os `pct` forem zero, a posição é (50, 50).

### 2.5 Etapa 4 — O que te move (Bloco B, com enquadramentos)

- Mesmos 15 pares, mesma pontuação, mesmo desempate da v2.
- **Cada par ganha um enquadramento próprio** — 15 frases distintas de 30 a 80 caracteres, todas terminando em dois-pontos ou reticências e conduzindo à escolha (ex.: "Numa proposta de trabalho, pesa mais…", "Para continuar numa empresa, conta mais…", "Num dia bom de trabalho, o que fez diferença foi…").
- As 30 frases de motivação da v2 continuam; podem ser reescritas para concordar com o enquadramento do par em que aparecem.

### 2.6 Etapa 5 — Como você lida com emoções (nova)

Base: modelo de quatro domínios de inteligência emocional (Goleman, Boyatzis e McKee).

| Código | Domínio |
|---|---|
| AUT | Autoconsciência |
| CTR | Autocontrole |
| EMP | Empatia |
| REL | Relacionamento |

Ordem canônica (desempate): `AUT, CTR, EMP, REL`.

- **16 frases de comportamento**, 4 por domínio, na primeira pessoa, entre 40 e 110 caracteres, com referência de tempo (ex.: "Nas últimas semanas, percebi minha irritação antes de reagir a ela.").
- Escala de frequência de 5 pontos: Quase nunca · Raramente · Às vezes · Com frequência · Quase sempre (1 a 5).
- **Uma frase de cada domínio é invertida** (descreve o oposto do domínio; nota alta indica menos do domínio).
- **Duas frases por tela**, de domínios diferentes. A tela avança sozinha quando as duas estão respondidas.
- Cálculo:
  - item direto vale a nota; item invertido vale `6 − nota`;
  - média por domínio sobre os itens respondidos (1 a 5); sem nenhum item respondido, média 3;
  - `pct = (média − 1) / 4 × 100`;
  - ranking decrescente com desempate canônico; **mais forte** = primeiro, **a desenvolver** = último;
  - se `pct(primeiro) − pct(último) < 10`, o perfil é lido como **equilibrado** e o relatório não aponta área a desenvolver.
- Leitura honesta obrigatória: o relatório diz que a medida é a **percepção que a pessoa tem de si**, apresenta a **ordem entre as áreas** e nunca rotula a inteligência emocional como "alta" ou "baixa".

### 2.7 Etapa 6 — Seu momento

Mesmas 5 perguntas e mesmo cálculo da v2, agora em 2 telas (3 + 2 perguntas), que avançam quando todas estão respondidas.

### 2.8 Telas de respiro

Uma antes de cada etapa, com o nome da etapa, uma frase sobre o que ela mede e o tempo restante aproximado (decrescente a cada respiro).

## 3. O relatório

Um único relatório, na mesma página, exportável em PDF. Três blocos na ordem abaixo. A **parte 2 começa em página nova** no PDF.

### 3.1 Resumo em uma página

Para os dois leitores. Um cartão por item:

- perfil (título com apoio) e uma frase-síntese;
- os 2 motivadores principais;
- estilo principal diante de conflito;
- área emocional mais forte;
- alertas, apenas quando existirem: "momento turbulento" e "tensão alta".

### 3.2 Parte 1 — Para você (segunda pessoa)

1. **Seu perfil** — retrato próprio da combinação: 4 retratos sem apoio + 12 combinações dominante/apoio = **16 retratos**; gráfico dos 4 fatores.
2. **Natural × adaptado** — como hoje (só com a etapa 2 ligada).
3. **Diante de conflito** — estilo principal e secundário, o que cada um rende e o que custa, gráfico de barras dos 5 estilos e o **quadro assertividade × cooperação** com a posição da pessoa.
4. **O que te move** — como hoje.
5. **Como você lida com emoções** — gráfico dos 4 domínios, a área mais forte, a área a desenvolver (ou o texto de equilíbrio) e a leitura honesta de 2.6.
6. **Pontos fortes e pontos de atenção** — por fator dominante.
7. **Plano de desenvolvimento** — exatamente **3 ações** para os próximos 30 dias:
   - uma do fator dominante;
   - uma do domínio emocional a desenvolver (no perfil equilibrado, a do domínio de menor `pct` pela ordem de desempate);
   - uma do estilo principal de conflito.
8. **Leia com cuidado** — como hoje, incluindo a ressalva de que a medida emocional é autopercebida.

### 3.3 Parte 2 — Para quem lidera [nome] (voltada ao líder)

Todo texto usa o **primeiro nome** da pessoa e construções neutras, sem "ele" ou "ela".

1. **Em uma frase** — como tirar o melhor dessa pessoa (por fator dominante, com complemento pelo apoio).
2. **Como se comunicar** — o que fazer e o que evitar (por fator dominante).
3. **Como dar retorno e reconhecer** — pelos 2 motivadores principais.
4. **Como delegar e acompanhar** — por fator dominante.
5. **Em conflito** — o que esperar e como conduzir (pelo estilo principal).
6. **Sinais de desgaste** — comportamento sob pressão do fator dominante, mais uma linha sobre tensão alta e uma sobre momento turbulento, quando existirem.
7. **O que evitar** — pelo motivador de menor pontuação.
8. **Perguntas para a próxima conversa individual** — exatamente 4 perguntas: uma do motivador principal, uma da faixa de tensão (sem a etapa 2, uma do fator dominante), uma da faixa de momento, uma do estilo de conflito.
9. **Como usar este relatório** — ponto de partida para conversa; não avalia desempenho, não decide contratação, promoção ou desligamento; a pessoa leu tudo o que está aqui e escolheu compartilhar.

### 3.4 Princípio de transparência

Tudo o que a parte 2 diz está no mesmo documento que a pessoa recebe. Não existe versão do relatório que o líder veja e a pessoa não. Quem decide entregar o PDF ao líder é a própria pessoa.

### 3.5 Biblioteca de textos

Inventário mínimo (cada item com texto próprio, sem genérico repetido):

| Conjunto | Chave | Quantidade |
|---|---|---|
| Retratos | dominante, ou dominante + apoio | 16 |
| Frase-síntese do resumo | dominante | 4 |
| Pontos fortes / de atenção | dominante | 4 × 5 + 4 × 5 |
| Conflito, para você (rende e custa) | estilo | 5 |
| Emoções: mais forte / a desenvolver | domínio | 4 + 4 |
| Emoções: perfil equilibrado | — | 1 |
| Ações do plano | dominante / domínio / estilo | 4 + 4 + 5 |
| Líder: em uma frase | dominante (+ complemento por apoio) | 4 + 4 |
| Líder: comunicar (fazer e evitar) | dominante | 4 |
| Líder: retorno e reconhecimento | motivador | 6 |
| Líder: delegar e acompanhar | dominante | 4 |
| Líder: em conflito | estilo | 5 |
| Líder: sinais de desgaste | dominante + tensão alta + momento turbulento | 4 + 1 + 1 |
| Líder: o que evitar | motivador | 6 |
| Perguntas da conversa individual | motivador / tensão / momento / estilo / dominante | 6 + 3 + 3 + 5 + 4 |
| Como usar este relatório | — | 1 |

Os textos da v2 (tensão, forçado/contido, momento, motivadores, ressalvas, rodapé) continuam. `COMUNICACAO` e `AMBIENTE` da v2 são reescritos para a parte 2.

Textos da parte 2 que citam a pessoa usam o marcador `{nome}`, substituído pelo primeiro nome já escapado para HTML.

### 3.6 Tamanho

PDF esperado entre 9 e 11 páginas em A4. Nenhum cartão cortado entre páginas.

## 4. Arquitetura

Mantém a arquitetura da v2 (módulos ES nativos, motor puro, telas consumindo o motor). Mudanças:

| Arquivo | Mudança |
|---|---|
| `src/motor.js` | `ESTILOS_CONFLITO`, `pontuarConflito`, `DOMINIOS_EMOCAO`, `pontuarEmocoes`; `BLOCOS_ADAPTADO` para `[1, 3, 5, 7, 9, 11]`; `calcularResultado` devolve `conflito` e `emocoes` |
| `src/dados.js` | `SITUACOES` (substitui `BLOCOS`), `CENARIOS_CONFLITO`, `ENQUADRAMENTOS_PARES`, `FRASES_EMOCAO`, `ESCALA_FREQUENCIA` |
| `src/textos.js` | Biblioteca da seção 3.5, dividida em `src/textos.js` (parte 1 e resumo) e `src/textos-lider.js` (parte 2) |
| `src/graficos.js` | `quadroConflito(assertividade, cooperacao)`, `barrasConflito`, `barrasEmocoes` |
| `src/relatorio.js` | Resumo, parte 1 e parte 2; quebra de página antes da parte 2 |
| `src/telas.js` | Tipos de tela `situacao`, `conflito`, `par` (com enquadramento), `frequencia` (2 itens), `momento` (vários itens); rótulo de passo |
| `metodo.html` | Seções novas de conflito e emoções; referências novas conferidas |
| `facilitador.html` | Roteiro com o tempo novo; como o líder usa a parte 2 |

### 4.1 Contrato de respostas (v3)

```js
{
  nome, contexto,
  a1: [{ mais, menos }] × 12,        // fatores E/C/P/A
  a2: [{ mais, menos }] × 6 | null,  // alinhado a BLOCOS_ADAPTADO
  conflito: [{ mais, menos }] × 6,   // estilos COL/NEG/COM/CED/EVI
  b: [codigo | null] × 15,           // motivadores
  emocoes: [1..5 | null] × 16,       // na ordem canônica de FRASES_EMOCAO
  c: [1..5 | null] × 5
}
```

### 4.2 Persistência

Chave `mapa-de-perfil-v3`. `sessaoValida` passa a conferir `conflito` (6 posições, estilos válidos ou nulos) e `emocoes` (16 posições, 1 a 5 ou nulo). Sessões v2 são descartadas.

## 5. Base teórica — referências novas

Todas conferidas em fonte externa antes de publicar; onde a busca divergir, vale a busca; sem confirmação, a referência sai junto com a frase que a cita.

- BLAKE, Robert R.; MOUTON, Jane S. *The managerial grid*. Houston: Gulf, 1964.
- THOMAS, Kenneth W. Conflict and conflict management. In: DUNNETTE, M. D. (org.). *Handbook of industrial and organizational psychology*. Chicago: Rand McNally, 1976.
- KILMANN, Ralph H.; THOMAS, Kenneth W. Developing a forced-choice measure of conflict-handling behavior: the "MODE" instrument. *Educational and Psychological Measurement*, v. 37, p. 309-325, 1977.
- GOLEMAN, Daniel. *Emotional intelligence*. New York: Bantam, 1995.
- GOLEMAN, Daniel; BOYATZIS, Richard; McKEE, Annie. *Primal leadership*. Boston: Harvard Business School Press, 2002.

A página `metodo.html` ganha as seções "Diante de conflito" e "Como você lida com emoções", e a seção de limites passa a dizer que a medida emocional é autopercebida.

## 6. Como será conferido

- **Sem repetição:** teste que reúne o texto de pergunta de todas as telas de resposta e exige que não haja duplicatas.
- **Redação:** testes de tamanho (enunciados e reações), de primeira pessoa começando por verbo, de unicidade e de linguagem neutra para situações, cenários, enquadramentos, frases de emoção e toda a biblioteca — incluindo os textos da parte 2 com `{nome}` substituído.
- **Cálculo:** conflito (extremos, desempate, posição no quadro, todos zerados); emoções (inversão, média com itens faltando, equilíbrio, desempate); comportamento com `n = 12`; tensão sobre `[1, 3, 5, 7, 9, 11]`.
- **Cobertura da biblioteca:** toda combinação de dominante/apoio, estilo, domínio, motivador, faixa de tensão e faixa de momento encontra texto.
- **Relatório:** as três partes presentes; exatamente 3 ações e 4 perguntas; nome escapado; sem etapa 2, nenhuma menção a tensão; a parte 2 nunca usa "ele"/"ela" para a pessoa.
- **Sessão:** v2 descartada; formatos inválidos de `conflito` e `emocoes` descartados.
- **Navegador:** 49 telas de resposta de ponta a ponta, sem rolagem em 390 × 844 nas telas de pergunta; 43 com a chave desligada; zero erro no console.
- **PDF:** entre 9 e 11 páginas; parte 2 em página nova; nenhum cartão cortado.
- **Revisão de conteúdo por Luciano:** amostra dos textos (ao menos 2 retratos, 1 cenário de conflito completo, a parte 2 inteira de um resultado) antes da publicação.

## 7. Riscos e decisões conscientes

- **Tempo maior.** 16 minutos contra 10 da v2. Mitigação: respiros com tempo restante, progresso por etapa, 2 frases por tela na etapa 5, chave de redução da etapa 2.
- **Leitura mais longa por tela.** Situações e cenários exigem ler. Mitigação: limites de tamanho de 2.2 e 2.4; opções no terço inferior da tela; sem rolagem.
- **Autoavaliação emocional inflada.** Mitigação: frases de comportamento com referência de tempo, itens invertidos, leitura só da ordem entre áreas, ressalva explícita.
- **Relatório nas mãos do líder.** Risco de uso como avaliação. Mitigação: seção "Como usar este relatório", princípio de transparência (3.4) e a seção de limites do `metodo.html`.
- **Direitos autorais.** Nenhum item de instrumento comercial é reproduzido; usa-se apenas a teoria, com citação.
- **Publicação.** A chave de armazenamento muda para v3: publicar fora do horário de aula.
