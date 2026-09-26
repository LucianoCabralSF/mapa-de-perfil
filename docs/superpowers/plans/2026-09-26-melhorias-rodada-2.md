# Mapa de Perfil — Melhorias da Rodada 2 — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar oito melhorias ao Mapa de Perfil já publicado — linguagem neutra, segunda rodada com 6 blocos, motivações em pares, botão de compartilhar, aviso para navegador de aplicativo, prévia do link no WhatsApp, página de referencial teórico e guia do facilitador.

**Architecture:** Mesma base da rodada 1: HTML estático com módulos ES nativos, motor puro testado com `node --test`, telas que consomem o motor sem refazer conta. As duas páginas novas (`metodo.html`, `facilitador.html`) são HTML estático que reaproveita `estilos.css`. Funções novas com lógica (detecção de navegador, texto de compartilhamento) nascem puras e injetáveis, para serem testadas sem navegador.

**Tech Stack:** HTML + CSS + JavaScript (módulos ES). Testes com `node --test` (Node v24). Playwright (MCP) para verificação visual e para gerar a imagem de prévia.

**Spec:** `docs/superpowers/specs/2026-09-26-mapa-de-perfil-design.md` (rodada 1) + a seção "Decisões desta rodada" abaixo, que a Tarefa 10 incorpora à spec.

## Decisões desta rodada

Aprovadas por Luciano em conversa em 2026-09-26 ("monta um plano para implementar o seu e o meu").

1. **Linguagem neutra.** Nenhum texto que descreve a pessoa usa forma flexionada no masculino. As 40 palavras dos blocos viram verbos ou expressões neutras ("Tomo decisões" em vez de "Decidido").
2. **Segunda rodada (A2) com 6 blocos**, não 10: blocos de índice canônico `[1, 3, 5, 6, 7, 9]`. O perfil dominante continua vindo dos 10 blocos do A1. O Índice de Tensão compara o A2 com **os mesmos 6 blocos do A1** — comparar 6 com 10 distorceria a medida.
3. **Motivações em pares.** As 12 afirmações de concordância saem. Entram 15 telas de escolha entre duas frases (todos os pares possíveis entre os 6 motivadores, formato de comparação pareada de Thurstone). Pontuação = número de vitórias (0 a 5). Desempate: vitórias dentro do grupo empatado, depois ordem canônica.
4. **Volume:** 10 (A1) + 6 (A2) + 15 (pares) + 5 (momento) = **36 telas de resposta**, cerca de 10 minutos. Com `INCLUIR_ADAPTADO` desligado, 30.
5. **Chave de armazenamento passa para `mapa-de-perfil-v2`**: o formato das respostas mudou, e uma sessão antiga não pode ser lida no formato novo.
6. **Compartilhar** envia um resumo sem nome da pessoa: perfil + 2 motivadores principais + link. Usa o compartilhamento nativo do celular; sem ele, abre o WhatsApp.
7. **Navegador de aplicativo** (WhatsApp, Instagram, Facebook, WebView do Android): aviso na abertura para abrir no navegador antes de começar; no relatório, o botão de PDF explica a limitação e oferece "Tentar mesmo assim".
8. **Prévia do link:** metatags Open Graph com imagem 1200×630 em URL absoluta.
9. **Página `metodo.html`:** referencial teórico, com link na abertura e no rodapé do relatório (o link também aparece como texto no PDF).
10. **Página `facilitador.html`:** roteiro para conduzir a aula. Não é linkada em lugar nenhum do site e leva `noindex`; Luciano recebe o link direto.

## Global Constraints

- **Sem dependências de runtime**, sem CDN, sem etapa de compilação. `package.json` continua sem `dependencies`.
- **Nada trafega para servidor.** A única saída permitida é a que a própria pessoa aciona: compartilhamento nativo ou abertura de `https://wa.me/`.
- **Paleta DEL/Lótus, valores exatos:** azul-marinho `#15365E`, azul-noite `#0B2543`, dourado `#C9AD67`, bronze `#8C7950`, dourado claro `#D9C58D`, creme `#F6F2E8`, areia `#EDE6D3`, azul-pálido `#DDE6EF`, tinta `#1E2A36`, cinza-azulado `#66717C`, verde `#52796F`.
- **Tipografia:** `Aptos, Calibri, 'Segoe UI', sans-serif`. Parágrafos à esquerda.
- **Linguagem neutra** em todo texto novo ou alterado — inclusive `metodo.html` e `facilitador.html`. O teste de linguagem da Tarefa 1 é a régua.
- **URL pública:** `https://lucianocabralsf.github.io/mapa-de-perfil/`. Toda URL em metatag é absoluta.
- **Ordem canônica dos fatores** `['E','C','P','A']` e **dos motivadores** `['REA','AUT','SEG','REC','PRO','PER']` continuam sendo as regras finais de desempate.
- **`INCLUIR_ADAPTADO`** continua declarada só em `src/dados.js`.
- **Nenhuma referência bibliográfica é publicada sem conferência** em fonte externa (Tarefa 8, passo 1).
- **Publicação (push) só com confirmação explícita de Luciano** no fim da Tarefa 10.

## Review Focus

1. **Aluno com a aba aberta durante a atualização do site**: ao recarregar, a sessão salva no formato antigo não é lida, e o teste recomeça do início sem erro. → Tarefa 4 (chave `v2`).
2. **Pessoa cancela a janela de compartilhar do celular**: nada acontece — nem erro, nem WhatsApp abrindo por cima. → Tarefa 5.
3. **Empate circular entre três motivadores nos pares** (A vence B, B vence C, C vence A): o ranking sai completo e sempre igual para as mesmas respostas. → Tarefa 3.
4. **Chrome e Safari comuns classificados por engano como navegador de aplicativo**: o botão de PDF seria escondido de quem consegue usá-lo. → Tarefa 6.
5. **Imagem da prévia com caminho relativo ou pesada demais**: o WhatsApp não mostra a imagem. → Tarefa 7.

---

## Estrutura de arquivos

| Arquivo | Mudança | Tarefa |
|---|---|---|
| `src/dados.js` | Palavras neutras, pergunta C4 neutra, `ordemExibicaoA2` com 6 blocos, frases dos pares, `montarPares()`; sai `AFIRMACOES` | 1, 2, 3 |
| `src/textos.js` | Quatro frases neutralizadas | 1 |
| `src/motor.js` | `pontuarComportamento` escala pelo nº de blocos, `BLOCOS_ADAPTADO`, `naturalComparavel`, pares; sai `MAPA_MOTIVACOES` | 2, 3 |
| `src/telas.js` | `indiceResposta`, tela `par`, chave `v2`, tempos, `htmlAbertura`, ações de compartilhar e de PDF em aplicativo; exporta `montarSequencia` e `CHAVE` | 2, 4, 5, 6, 8 |
| `src/relatorio.js` | Comparação com `naturalComparavel`, botão compartilhar, link para `metodo.html` | 2, 5, 8 |
| `src/compartilhar.js` | **Novo.** Texto do resumo, link do WhatsApp, `compartilhar()` | 5 |
| `src/ambiente.js` | **Novo.** `navegadorInterno(ua)` | 6 |
| `estilos.css` | `.ou`, `.botao-secundario`, `.aviso-navegador`, `.pagina-texto` e seus filhos | 4, 5, 6, 8 |
| `index.html` | Metatags de descrição e Open Graph | 7 |
| `ferramentas/previa.html` | **Novo.** Fonte da imagem de prévia | 7 |
| `imagens/previa.png`, `imagens/logotipo-del.png` | **Novos** | 7 |
| `.gitignore` | Exceção `!imagens/*.png` | 7 |
| `metodo.html` | **Novo.** Referencial teórico | 8 |
| `facilitador.html` | **Novo.** Guia do facilitador | 9 |
| `testes/apoio/linguagem.js` | **Novo.** Régua de linguagem neutra reaproveitada pelos testes | 1 |
| `testes/linguagem.test.js`, `testes/telas.test.js`, `testes/compartilhar.test.js`, `testes/ambiente.test.js`, `testes/paginas.test.js` | **Novos** | 1, 4, 5, 6, 7-9 |
| `testes/motor.test.js`, `testes/dados.test.js`, `testes/relatorio.test.js` | Atualizados | 2, 3 |
| `docs/superpowers/specs/2026-09-26-mapa-de-perfil-design.md`, `README.md` | Atualizados | 10 |

---

### Task 1: Linguagem neutra

**Files:**
- Create: `testes/apoio/linguagem.js`
- Create: `testes/linguagem.test.js`
- Modify: `src/dados.js` (constante `BLOCOS` e `PERGUNTAS_MOMENTO[3]`)
- Modify: `src/textos.js` (`ATENCAO.E[4]`, `MOTIVADOR_ALTO.REC`, `MOTIVADOR_BAIXO.PER`, `COMUNICACAO.P`)

**Interfaces:**
- Produces: `palavrasFlexionadas(texto) -> string[]` e `textoFlexionado(texto) -> string[]`, em `testes/apoio/linguagem.js`, usadas pelas Tarefas 3, 8 e 9.

Duas réguas diferentes, porque a regra muda com o tipo de texto:
- **`palavrasFlexionadas`** vale para autodescrições curtas (palavras dos blocos, frases dos pares): nenhuma palavra termina em `ado`, `ido`, `oso` ou `ivo`, exceto substantivos da lista de exceções.
- **`textoFlexionado`** vale para texto corrido (relatório, páginas): procura só adjetivos no masculino que descrevem a pessoa e têm par feminino. Não pode usar a regra de sufixo, porque "vai direto ao ponto" e "resultado" são corretos.

- [ ] **Step 1: Escrever a régua**

`testes/apoio/linguagem.js`:
```js
const SUFIXOS = ['ado', 'ido', 'oso', 'ivo'];
const EXCECOES = new Set(['resultado', 'lado', 'sentido', 'cuidado', 'período', 'estado']);

// Autodescricoes curtas: nenhuma palavra flexionada no masculino.
export function palavrasFlexionadas(texto) {
  return String(texto)
    .toLowerCase()
    .split(/[^a-zà-úç]+/i)
    .filter((p) => p && !EXCECOES.has(p) && SUFIXOS.some((s) => p.endsWith(s)));
}

// Texto corrido: adjetivos no masculino que descrevem a pessoa.
const MASCULINOS = [
  'sozinho', 'entediado', 'reconhecido', 'satisfeito', 'colocado', 'cobrado',
  'cansado', 'preocupado', 'obrigado', 'convencido', 'sobrecarregado',
  'valorizado', 'visto', 'decidido', 'animado', 'cuidadoso', 'tranquilo',
  'organizado', 'determinado', 'desconfortável demais', 'mais um',
];

export function textoFlexionado(texto) {
  const minusculo = String(texto).toLowerCase();
  return MASCULINOS.filter((termo) => new RegExp(`(^|[^a-zà-úç])${termo}([^a-zà-úç]|$)`, 'i').test(minusculo));
}
```

- [ ] **Step 2: Escrever o teste que falha**

`testes/linguagem.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOCOS, PERGUNTAS_MOMENTO } from '../src/dados.js';
import * as TEXTOS from '../src/textos.js';
import { palavrasFlexionadas, textoFlexionado } from './apoio/linguagem.js';

function todosOsTextos(valor) {
  if (typeof valor === 'string') return [valor];
  if (Array.isArray(valor)) return valor.flatMap(todosOsTextos);
  if (valor && typeof valor === 'object') return Object.values(valor).flatMap(todosOsTextos);
  return [];
}

test('as palavras dos blocos sao neutras', () => {
  for (const opcao of BLOCOS.flat()) {
    assert.deepEqual(palavrasFlexionadas(opcao.palavra), [], `palavra no masculino: ${opcao.palavra}`);
  }
});

test('as perguntas do momento sao neutras', () => {
  for (const pergunta of PERGUNTAS_MOMENTO) {
    assert.deepEqual(textoFlexionado(pergunta), [], `pergunta no masculino: ${pergunta}`);
  }
});

test('os textos do relatorio sao neutros', () => {
  for (const texto of todosOsTextos(TEXTOS)) {
    assert.deepEqual(textoFlexionado(texto), [], `texto no masculino: ${texto}`);
  }
});

test('a regua reconhece o que deve reprovar', () => {
  assert.deepEqual(palavrasFlexionadas('Decidido'), ['decidido']);
  assert.deepEqual(palavrasFlexionadas('Foco no resultado'), []);
  assert.deepEqual(textoFlexionado('Você trabalha bem sozinho.'), ['sozinho']);
  assert.deepEqual(textoFlexionado('Você vai direto ao ponto.'), []);
});
```

- [ ] **Step 3: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA em "as palavras dos blocos sao neutras" (primeira falha: `Decidido`) e em "os textos do relatorio sao neutros" (`sozinho`).

- [ ] **Step 4: Trocar as palavras dos blocos**

Em `src/dados.js`, substituir a constante `BLOCOS` inteira. Ordem canônica mantida (E, C, P, A); todas as palavras distintas e com até 24 caracteres:

```js
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
```

Em `PERGUNTAS_MOMENTO`, trocar a quarta pergunta:
```js
  'Sinto satisfação com minha situação atual de trabalho ou estudo.',
```

- [ ] **Step 5: Neutralizar os quatro textos do relatório**

Em `src/textos.js`:

- `ATENCAO.E`, quinto item:
  ```js
  'Delegar te custa: você acredita que resolve mais rápido por conta própria.',
  ```
- `MOTIVADOR_ALTO.REC`:
  ```js
  REC: 'Receber reconhecimento pelo que você entrega faz diferença real no seu ânimo. Trabalho reconhecido rende o dobro em você.',
  ```
- `MOTIVADOR_BAIXO.PER`:
  ```js
  PER: 'Pertencer ao grupo pesa pouco na sua decisão. Você trabalha bem por conta própria e não sente falta do vínculo do time.',
  ```
- `COMUNICACAO.P`:
  ```js
  P: 'Funciona: avisar com antecedência, explicar o porquê da mudança e dar tempo para você processar. Trava: decisão em cima da hora, tom agressivo e virar o centro das atenções sem aviso.',
  ```

- [ ] **Step 6: Rodar e confirmar que passa**

Run: `npm test`
Expected: todos passando (61 anteriores + 4 novos = 65). Se o teste de textos apontar outro termo que não está nesta lista, reescrevê-lo em forma neutra no mesmo espírito — nunca remover o termo da régua para o teste passar.

- [ ] **Step 7: Commit**

```bash
git add testes/apoio/linguagem.js testes/linguagem.test.js src/dados.js src/textos.js
git commit -m "feat: linguagem neutra nas palavras, perguntas e textos"
```

---

### Task 2: Segunda rodada com 6 blocos

**Files:**
- Modify: `src/motor.js` (`pontuarComportamento`, `calcularResultado`; novo `BLOCOS_ADAPTADO`)
- Modify: `src/dados.js` (`ordemExibicaoA2`)
- Modify: `src/telas.js` (`montarSequencia`, `estadoInicial`, `telaForcada`, `responderForcada`, `voltarForcada`)
- Modify: `src/relatorio.js` (cartão `comparacao`)
- Test: `testes/motor.test.js`, `testes/dados.test.js`, `testes/relatorio.test.js`

**Interfaces:**
- Produces:
  - `BLOCOS_ADAPTADO = [1, 3, 5, 6, 7, 9]` exportado de `src/motor.js`.
  - `pontuarComportamento(respostas)` agora escala pelo número de blocos recebidos: `pct = round((bruto + n) / (2n) * 100)`, com `n = respostas.length`; `n = 0` devolve 50 em todos.
  - `calcularResultado` devolve também `naturalComparavel: { brutos, pct } | null` — o A1 restrito a `BLOCOS_ADAPTADO`.
  - `respostas.a2` passa a ter **6 posições**, alinhadas a `BLOCOS_ADAPTADO` (posição 0 = bloco canônico 1).
  - `ordemExibicaoA2()` devolve 6 itens `{ posicao, indiceCanonico, opcoes }`.
  - Descritores de tela `forcada` passam a usar `indiceResposta` (posição dentro de `respostas[campo]`) no lugar de `indiceCanonico`.

- [ ] **Step 1: Escrever os testes que falham**

Em `testes/motor.test.js`, acrescentar ao import `BLOCOS_ADAPTADO` e adicionar:
```js
test('seis respostas iguais tambem levam o fator ao extremo', () => {
  const respostas = Array.from({ length: 6 }, () => ({ mais: 'E', menos: 'P' }));
  const { brutos, pct } = pontuarComportamento(respostas);
  assert.equal(brutos.E, 6);
  assert.equal(pct.E, 100);
  assert.equal(pct.P, 0);
  assert.equal(pct.C, 50);
});

test('sem nenhum bloco todos os fatores ficam na linha de base', () => {
  assert.deepEqual(pontuarComportamento([]).pct, { E: 50, C: 50, P: 50, A: 50 });
});

test('BLOCOS_ADAPTADO tem 6 indices canonicos distintos', () => {
  assert.deepEqual(BLOCOS_ADAPTADO, [1, 3, 5, 6, 7, 9]);
});

test('a tensao compara o adaptado com os mesmos 6 blocos do natural', () => {
  const a1 = Array.from({ length: 10 }, (_, i) => (
    BLOCOS_ADAPTADO.includes(i) ? { mais: 'C', menos: 'A' } : { mais: 'E', menos: 'P' }
  ));
  const a2 = Array.from({ length: 6 }, () => ({ mais: 'C', menos: 'A' }));
  const r = calcularResultado({ nome: 'X', contexto: '', a1, a2, b: [], c: [1, 1, 5, 5, 5] });
  assert.equal(r.tensao.indice, 0, 'nos blocos comparados as respostas foram identicas');
  assert.deepEqual(r.naturalComparavel.pct, r.adaptado.pct);
  assert.equal(r.perfil.dominante, 'C', 'o perfil continua vindo dos 10 blocos do A1');
});
```

Nos testes existentes de `testes/motor.test.js` e `testes/relatorio.test.js`, toda montagem de `a2` com `Array.from({ length: 10 }, ...)` passa a `Array.from({ length: 6 }, ...)`.

Em `testes/dados.test.js`, substituir o teste "a ordem de exibicao do A2 inverte blocos e opcoes sem perder nada" por:
```js
test('a ordem de exibicao do A2 cobre os 6 blocos, invertida', () => {
  const ordem = ordemExibicaoA2();
  assert.equal(ordem.length, 6);
  assert.deepEqual(ordem.map((p) => p.posicao), [5, 4, 3, 2, 1, 0]);
  assert.deepEqual(ordem.map((p) => p.indiceCanonico), [9, 7, 6, 5, 3, 1]);
  assert.deepEqual(ordem[0].opcoes.map((o) => o.fator), ['A', 'P', 'C', 'E']);
});
```

Em `testes/relatorio.test.js`, adicionar:
```js
test('a comparacao explica que usa os blocos respondidos duas vezes', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  assert.ok(html.includes('6 blocos que você respondeu duas vezes'));
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA com `BLOCOS_ADAPTADO` indefinido e com as asserções novas.

- [ ] **Step 3: Implementar no motor**

Em `src/motor.js`, substituir `pontuarComportamento`:
```js
export function pontuarComportamento(respostas) {
  const brutos = zerados(FATORES);
  for (const resposta of respostas) {
    if (resposta?.mais && brutos[resposta.mais] !== undefined) brutos[resposta.mais] += 1;
    if (resposta?.menos && brutos[resposta.menos] !== undefined) brutos[resposta.menos] -= 1;
  }
  const n = respostas.length;
  const pct = Object.fromEntries(
    FATORES.map((f) => [f, n ? Math.round(((brutos[f] + n) / (2 * n)) * 100) : 50]),
  );
  return { brutos, pct };
}

// Blocos que a pessoa responde tambem no bloco adaptado (A2).
// A tensao compara o A2 com estes mesmos blocos do A1.
export const BLOCOS_ADAPTADO = [1, 3, 5, 6, 7, 9];
```

Em `calcularResultado`, trocar as linhas de `adaptado` e `tensao` por:
```js
  const adaptado = respostas.a2 ? pontuarComportamento(respostas.a2) : null;
  const naturalComparavel = adaptado
    ? pontuarComportamento(BLOCOS_ADAPTADO.map((i) => respostas.a1[i]))
    : null;
  const tensao = adaptado ? calcularTensao(naturalComparavel.pct, adaptado.pct) : null;
```
e incluir `naturalComparavel` no objeto devolvido, logo depois de `adaptado`.

- [ ] **Step 4: Implementar nos dados**

Em `src/dados.js`, importar e substituir `ordemExibicaoA2`:
```js
import { BLOCOS_ADAPTADO } from './motor.js';

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
```

Atualizar o comentário de `INCLUIR_ADAPTADO`:
```js
// Liga ou desliga o bloco de comportamento adaptado (A2).
// Desligado: o teste cai de 36 para 30 telas e o relatorio omite
// a secao Natural x Adaptado.
```

- [ ] **Step 5: Implementar nas telas**

Em `src/telas.js`:

- No laço do A1, trocar `indiceCanonico: indice` por `indiceResposta: indice`.
- No laço do A2, trocar `indiceCanonico: item.indiceCanonico` por `indiceResposta: item.posicao`.
- Em `estadoInicial`, trocar a linha de `a2` por:
  ```js
      a2: INCLUIR_ADAPTADO ? BLOCOS_ADAPTADO.map(() => ({ mais: null, menos: null })) : null,
  ```
  com `BLOCOS_ADAPTADO` importado de `./motor.js`.
- Em `telaForcada`, `responderForcada` e `voltarForcada`, trocar todas as ocorrências de `tela.indiceCanonico` por `tela.indiceResposta`.

- [ ] **Step 6: Implementar no relatório**

Em `src/relatorio.js`, no cartão `comparacao`:
```js
    partes.push(cartao('comparacao', 'Natural × Adaptado',
      '<p class="legenda-grafico">Barra de cima: como você é. Barra de baixo: como você '
      + 'precisa ser no trabalho hoje. A comparação usa os 6 blocos que você respondeu duas vezes.</p>'
      + barrasComparadas(resultado.naturalComparavel.pct, adaptado.pct)
      + `<p class="indice-tensao">Índice de tensão: ${tensao.indice}</p>`
      + blocoTensao(tensao)));
```

- [ ] **Step 7: Rodar e confirmar que passa**

Run: `npm test`
Expected: todos passando.

- [ ] **Step 8: Commit**

```bash
git add src/motor.js src/dados.js src/telas.js src/relatorio.js testes/motor.test.js testes/dados.test.js testes/relatorio.test.js
git commit -m "feat: segunda rodada com 6 blocos e tensao comparavel"
```

---

### Task 3: Motivações em pares — motor e dados

**Files:**
- Modify: `src/motor.js` (sai `MAPA_MOTIVACOES`; entra `PARES_MOTIVACAO`; reescrita de `pontuarMotivacoes`)
- Modify: `src/dados.js` (sai `AFIRMACOES`; entram `FRASES_MOTIVACAO` e `montarPares`)
- Test: `testes/motor.test.js`, `testes/dados.test.js`, `testes/relatorio.test.js`

**Interfaces:**
- Produces:
  - `PARES_MOTIVACAO`: 15 pares `[esquerda, direita]` de códigos de motivador, em `src/motor.js`.
  - `pontuarMotivacoes(escolhas) -> [{ codigo, bruto, pct }]`, onde `escolhas` tem 15 posições, cada uma com o código escolhido ou `null`. `bruto` = vitórias (0 a 5); `pct = round(bruto / 5 * 100)`. Mesmo formato de saída de antes: o relatório não muda.
  - `respostas.b` passa a ser um vetor de 15 códigos ou `null`.
  - `FRASES_MOTIVACAO`: 5 frases por motivador, em `src/dados.js`.
  - `montarPares() -> [{ esquerda: { codigo, frase }, direita: { codigo, frase } }]` (15 itens), em `src/dados.js`. A k-ésima aparição de um motivador usa sua k-ésima frase.

A ordem dos pares vem do método do círculo (5 rodadas de 3 pares disjuntos), com os lados escolhidos para que cada motivador apareça 2 ou 3 vezes à esquerda — sem isso, a posição na tela puxaria as escolhas.

- [ ] **Step 1: Escrever os testes que falham**

Em `testes/motor.test.js`, **remover** os seis testes de motivação da rodada 1 (os que usam `MAPA_MOTIVACOES`), trocar `MAPA_MOTIVACOES` por `PARES_MOTIVACAO` no import, e adicionar:
```js
function escolhasPor(preferencia, viradas = []) {
  return PARES_MOTIVACAO.map(([a, b]) => {
    const melhor = preferencia.indexOf(a) < preferencia.indexOf(b) ? a : b;
    const pior = melhor === a ? b : a;
    const virar = viradas.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
    return virar ? pior : melhor;
  });
}

test('existem 15 pares, todos diferentes, cobrindo todas as combinacoes', () => {
  assert.equal(PARES_MOTIVACAO.length, 15);
  const chaves = PARES_MOTIVACAO.map((par) => [...par].sort().join('-'));
  assert.equal(new Set(chaves).size, 15);
  for (const codigo of MOTIVADORES) {
    assert.equal(PARES_MOTIVACAO.filter((par) => par.includes(codigo)).length, 5);
  }
});

test('pares seguidos nunca repetem motivador', () => {
  for (let i = 1; i < PARES_MOTIVACAO.length; i += 1) {
    const comum = PARES_MOTIVACAO[i].filter((c) => PARES_MOTIVACAO[i - 1].includes(c));
    assert.deepEqual(comum, [], `pares ${i - 1} e ${i} repetem ${comum}`);
  }
});

test('cada motivador aparece 2 ou 3 vezes do lado esquerdo', () => {
  for (const codigo of MOTIVADORES) {
    const vezes = PARES_MOTIVACAO.filter(([esquerda]) => esquerda === codigo).length;
    assert.ok(vezes === 2 || vezes === 3, `${codigo} aparece ${vezes} vezes a esquerda`);
  }
});

test('preferencia consistente produz o ranking exato', () => {
  const preferencia = ['PRO', 'AUT', 'REA', 'SEG', 'REC', 'PER'];
  const ranking = pontuarMotivacoes(escolhasPor(preferencia));
  assert.deepEqual(ranking.map((m) => m.codigo), preferencia);
  assert.deepEqual(ranking.map((m) => m.pct), [100, 80, 60, 40, 20, 0]);
});

test('empate de dois e decidido pelo confronto direto, nao pela ordem canonica', () => {
  const preferencia = ['PER', 'REC', 'SEG', 'AUT', 'REA', 'PRO'];
  const ranking = pontuarMotivacoes(escolhasPor(preferencia, [['SEG', 'PRO']]));
  assert.deepEqual(ranking.map((m) => m.codigo), ['PER', 'REC', 'SEG', 'AUT', 'REA', 'PRO']);
});

test('empate circular de tres cai na ordem canonica e e deterministico', () => {
  const preferencia = ['PRO', 'AUT', 'REA', 'SEG', 'REC', 'PER'];
  const escolhas = escolhasPor(preferencia, [['PRO', 'REA']]);
  const primeiro = pontuarMotivacoes(escolhas).map((m) => m.codigo);
  assert.deepEqual(primeiro, ['REA', 'AUT', 'PRO', 'SEG', 'REC', 'PER']);
  assert.deepEqual(pontuarMotivacoes(escolhas).map((m) => m.codigo), primeiro);
});

test('sem nenhuma escolha o ranking sai na ordem canonica e zerado', () => {
  const ranking = pontuarMotivacoes(PARES_MOTIVACAO.map(() => null));
  assert.deepEqual(ranking.map((m) => m.codigo), MOTIVADORES);
  assert.ok(ranking.every((m) => m.pct === 0));
});

test('escolha que nao pertence ao par e ignorada', () => {
  const escolhas = PARES_MOTIVACAO.map(() => 'XYZ');
  assert.ok(pontuarMotivacoes(escolhas).every((m) => m.bruto === 0));
});
```

Nos testes de `calcularResultado` (motor) e em `resultadoDeExemplo` (relatório), trocar a montagem de `b` por:
```js
    b: PARES_MOTIVACAO.map(([a, b]) => (a === 'PRO' || b === 'PRO' ? 'PRO' : a)),
```
com `PARES_MOTIVACAO` importado de `../src/motor.js` no lugar de `MAPA_MOTIVACOES`.

Em `testes/dados.test.js`, **remover** o teste "existem 12 afirmacoes alinhadas ao mapa de motivacoes", ajustar os imports e adicionar:
```js
import { PARES_MOTIVACAO } from '../src/motor.js';
import { FRASES_MOTIVACAO, montarPares } from '../src/dados.js';
import { palavrasFlexionadas } from './apoio/linguagem.js';

test('cada motivador tem 5 frases distintas e neutras', () => {
  for (const codigo of MOTIVADORES) {
    assert.equal(FRASES_MOTIVACAO[codigo].length, 5, `${codigo} precisa de 5 frases`);
  }
  const todas = MOTIVADORES.flatMap((c) => FRASES_MOTIVACAO[c]);
  assert.equal(new Set(todas).size, 30);
  for (const frase of todas) {
    assert.ok(frase.length <= 60, `frase longa demais: ${frase}`);
    assert.deepEqual(palavrasFlexionadas(frase), [], `frase no masculino: ${frase}`);
  }
});

test('montarPares segue PARES_MOTIVACAO e usa cada frase uma unica vez', () => {
  const pares = montarPares();
  assert.equal(pares.length, 15);
  pares.forEach((par, i) => {
    assert.deepEqual([par.esquerda.codigo, par.direita.codigo], PARES_MOTIVACAO[i]);
  });
  const usadas = pares.flatMap((p) => [p.esquerda.frase, p.direita.frase]);
  assert.equal(new Set(usadas).size, 30);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA com `PARES_MOTIVACAO` e `FRASES_MOTIVACAO` indefinidos.

- [ ] **Step 3: Implementar no motor**

Em `src/motor.js`, remover `MAPA_MOTIVACOES` e a `pontuarMotivacoes` antiga, e colocar:
```js
// Comparacao pareada: todos os 15 pares entre os 6 motivadores.
// Ordem pelo metodo do circulo (pares seguidos nunca repetem motivador);
// lados escolhidos para cada motivador ficar 2 ou 3 vezes a esquerda.
export const PARES_MOTIVACAO = [
  ['REA', 'PER'], ['AUT', 'PRO'], ['REC', 'SEG'],
  ['PRO', 'REA'], ['PER', 'REC'], ['SEG', 'AUT'],
  ['REA', 'REC'], ['PRO', 'SEG'], ['AUT', 'PER'],
  ['SEG', 'REA'], ['REC', 'AUT'], ['PER', 'PRO'],
  ['AUT', 'REA'], ['SEG', 'PER'], ['PRO', 'REC'],
];

const CONFRONTOS_POR_MOTIVADOR = MOTIVADORES.length - 1;

export function pontuarMotivacoes(escolhas) {
  const vitorias = zerados(MOTIVADORES);
  const venceu = new Set();
  PARES_MOTIVACAO.forEach(([a, b], indice) => {
    const escolha = escolhas[indice];
    if (escolha !== a && escolha !== b) return;
    vitorias[escolha] += 1;
    venceu.add(`${escolha}>${escolha === a ? b : a}`);
  });

  // Desempate: vitorias contra quem terminou com o mesmo numero de vitorias.
  // Em empate circular todos ficam iguais e vale a ordem canonica.
  const desempate = zerados(MOTIVADORES);
  for (const m of MOTIVADORES) {
    for (const outro of MOTIVADORES) {
      if (m !== outro && vitorias[m] === vitorias[outro] && venceu.has(`${m}>${outro}`)) {
        desempate[m] += 1;
      }
    }
  }

  return MOTIVADORES
    .map((codigo) => ({
      codigo,
      bruto: vitorias[codigo],
      pct: Math.round((vitorias[codigo] / CONFRONTOS_POR_MOTIVADOR) * 100),
    }))
    .sort((x, y) => (y.bruto - x.bruto)
      || (desempate[y.codigo] - desempate[x.codigo])
      || (MOTIVADORES.indexOf(x.codigo) - MOTIVADORES.indexOf(y.codigo)));
}
```

- [ ] **Step 4: Implementar nos dados**

Em `src/dados.js`, remover `AFIRMACOES` (e seu comentário), importar `MOTIVADORES` e `PARES_MOTIVACAO` de `./motor.js` e adicionar:
```js
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
```

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `npm test`
Expected: todos os testes de `motor`, `dados`, `relatorio` e `linguagem` passando. `src/telas.js` ainda importa `AFIRMACOES` e quebraria no navegador — é corrigido na Tarefa 4, a seguinte, que precisa ser feita antes de qualquer verificação visual.

- [ ] **Step 6: Commit**

```bash
git add src/motor.js src/dados.js testes/motor.test.js testes/dados.test.js testes/relatorio.test.js
git commit -m "feat: motivacoes por comparacao pareada"
```

---

### Task 4: Motivações em pares — telas, tempos e chave v2

**Files:**
- Modify: `src/telas.js`
- Modify: `estilos.css`
- Create: `testes/telas.test.js`

**Interfaces:**
- Consumes: `montarPares()`, `PARES_MOTIVACAO`, `BLOCOS_ADAPTADO`.
- Produces: `export const CHAVE = 'mapa-de-perfil-v2'` e `export function montarSequencia()` em `src/telas.js`; descritor de tela `{ tipo: 'par', campo: 'b', indice, esquerda, direita, etapa, etapas }`; ação `data-acao="par"` com `data-codigo`.

Cobre o item 1 do Review Focus.

- [ ] **Step 1: Escrever o teste que falha**

`testes/telas.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { montarSequencia, CHAVE } from '../src/telas.js';
import { INCLUIR_ADAPTADO } from '../src/dados.js';

const RESPOSTA = new Set(['forcada', 'par', 'escala']);

test('a sequencia tem 36 telas de resposta com o adaptado ligado', () => {
  assert.equal(INCLUIR_ADAPTADO, true);
  const telas = montarSequencia();
  const conta = (filtro) => telas.filter(filtro).length;
  assert.equal(conta((t) => t.tipo === 'forcada' && t.campo === 'a1'), 10);
  assert.equal(conta((t) => t.tipo === 'forcada' && t.campo === 'a2'), 6);
  assert.equal(conta((t) => t.tipo === 'par'), 15);
  assert.equal(conta((t) => t.tipo === 'escala'), 5);
  assert.equal(conta((t) => RESPOSTA.has(t.tipo)), 36);
});

test('toda tela de resposta aponta para uma posicao valida', () => {
  for (const tela of montarSequencia()) {
    if (tela.tipo === 'forcada') {
      const limite = tela.campo === 'a1' ? 10 : 6;
      assert.ok(tela.indiceResposta >= 0 && tela.indiceResposta < limite);
    }
    if (tela.tipo === 'par') assert.ok(tela.indice >= 0 && tela.indice < 15);
  }
});

test('a chave de armazenamento e a da versao 2', () => {
  assert.equal(CHAVE, 'mapa-de-perfil-v2');
});

test('nenhum respiro promete mais tempo do que o anterior', () => {
  const minutos = montarSequencia()
    .filter((t) => t.tipo === 'respiro')
    .map((t) => Number(t.tempo.match(/(\d+)/)[1]));
  for (let i = 1; i < minutos.length; i += 1) assert.ok(minutos[i] < minutos[i - 1]);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA ao importar `src/telas.js` (`AFIRMACOES` não existe mais em `dados.js`).

- [ ] **Step 3: Implementar**

Em `src/telas.js`:

1. Imports:
   ```js
   import {
     BLOCOS, PERGUNTAS_MOMENTO, ESCALA_CONCORDANCIA,
     ANCORA_A1, ANCORA_A2, ordemExibicaoA2, montarPares, INCLUIR_ADAPTADO,
   } from './dados.js';
   import { calcularResultado, PARES_MOTIVACAO, BLOCOS_ADAPTADO } from './motor.js';
   ```
2. `const CHAVE = 'mapa-de-perfil-v1';` vira:
   ```js
   // v2: formato de respostas mudou (A2 com 6 blocos, motivacoes em pares).
   // Sessao salva na v1 simplesmente nao e lida.
   export const CHAVE = 'mapa-de-perfil-v2';
   ```
3. `function montarSequencia()` vira `export function montarSequencia()`.
4. Tempos dos respiros e bloco de motivações dentro de `montarSequencia`:
   - Respiro antes do A2: `tempo: 'Faltam cerca de 7 minutos.'`
   - Respiro antes das motivações:
     ```js
     telas.push({
       tipo: 'respiro',
       texto: 'Acabaram as palavras.',
       detalhe: 'Agora são pares de frases sobre trabalho. Em cada tela, toque na que pesa mais para você. É rápido.',
       tempo: 'Faltam cerca de 4 minutos.',
     });
     montarPares().forEach((par, indice) => {
       telas.push({
         tipo: 'par', campo: 'b', indice, esquerda: par.esquerda, direita: par.direita, etapa, etapas,
       });
     });
     ```
     no lugar do laço de `AFIRMACOES`.
   - Respiro final: mantém `'Falta cerca de 1 minuto.'`
5. Em `estadoInicial`: `b: PARES_MOTIVACAO.map(() => null),`
6. Nova tela, ao lado de `telaEscala`:
   ```js
   function telaPar(tela) {
     const atual = respostas.b[tela.indice];
     const botao = (lado) => {
       const classe = atual === lado.codigo ? 'opcao marcada' : 'opcao';
       return `<button type="button" class="${classe}" data-acao="par" data-codigo="${lado.codigo}">`
         + `${escaparHtml(lado.frase)}</button>`;
     };
     return '<div class="tela">'
       + progresso(tela)
       + '<p class="ancora">No trabalho, o que pesa mais para você?</p>'
       + '<p class="pergunta">Escolha uma das duas.</p>'
       + `<div class="opcoes">${botao(tela.esquerda)}<p class="ou" aria-hidden="true">ou</p>${botao(tela.direita)}</div>`
       + botaoVoltar()
       + '</div>';
   }

   function responderPar(codigo) {
     const tela = telas[posicao];
     respostas.b[tela.indice] = codigo;
     guardar();
     marcarEsperando(codigo, 'codigo');
     setTimeout(avancar, ATRASO_AVANCO);
   }
   ```
7. Em `desenhar`: `else if (tela.tipo === 'par') raiz.innerHTML = telaPar(tela);` antes do `else` final.
8. Em `aoClicar`: `else if (acao === 'par') responderPar(alvo.dataset.codigo);`
9. Na abertura, "São cerca de 13 minutos." vira "São cerca de 10 minutos."

Em `estilos.css`, depois de `.opcoes`:
```css
.ou {
  margin: 0;
  text-align: center;
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--bronze);
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: todos passando.

- [ ] **Step 5: Conferir no navegador**

Run: `npx --yes serve . -l 4173`, janela de 390×844.
Confirmar:
- as 15 telas de pares aparecem depois do respiro "Acabaram as palavras.";
- um toque escolhe e avança; "voltar" retorna ao par anterior mostrando a escolha feita;
- o relatório final mostra o ranking de motivações;
- **Review Focus 1:** no console, `sessionStorage.setItem('mapa-de-perfil-v1', '{"posicao":20,"respostas":{"b":[1,2,3]}}')`, recarregar — o teste abre na tela inicial, sem erro no console.

- [ ] **Step 6: Commit**

```bash
git add src/telas.js estilos.css testes/telas.test.js
git commit -m "feat: telas de pares, novos tempos e chave v2"
```

---

### Task 5: Compartilhar meu perfil

**Files:**
- Create: `src/compartilhar.js`
- Create: `testes/compartilhar.test.js`
- Modify: `src/relatorio.js` (rodapé)
- Modify: `src/telas.js` (ação `compartilhar`)
- Modify: `estilos.css` (`.botao-secundario`)
- Test: `testes/relatorio.test.js`

**Interfaces:**
- Consumes: `NOMES_MOTIVADOR`, o objeto `resultado` de `calcularResultado`.
- Produces: `URL_PUBLICA`, `textoCompartilhamento(resultado, url?) -> string`, `linkWhatsApp(texto) -> string`, `compartilhar(texto, { navegador, abrir }) -> Promise<'nativo' | 'cancelado' | 'whatsapp'>`.

Cobre o item 2 do Review Focus.

- [ ] **Step 1: Escrever os testes que falham**

`testes/compartilhar.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularResultado, PARES_MOTIVACAO } from '../src/motor.js';
import { textoCompartilhamento, linkWhatsApp, compartilhar, URL_PUBLICA } from '../src/compartilhar.js';

const resultado = calcularResultado({
  nome: 'Maria Secreta',
  contexto: '',
  a1: Array.from({ length: 10 }, () => ({ mais: 'E', menos: 'A' })),
  a2: null,
  b: PARES_MOTIVACAO.map(([a, b]) => (a === 'PRO' || b === 'PRO' ? 'PRO' : a)),
  c: [1, 1, 5, 5, 5],
});

test('o resumo traz perfil, dois motivadores e o link, sem o nome', () => {
  const texto = textoCompartilhamento(resultado);
  assert.ok(texto.includes(resultado.perfil.titulo));
  assert.ok(texto.includes('Propósito'));
  assert.ok(texto.includes(URL_PUBLICA));
  assert.ok(!texto.includes('Maria'), 'o nome nunca vai no compartilhamento');
});

test('o link do whatsapp codifica acento e simbolo', () => {
  const link = linkWhatsApp('Perfil × Propósito & mais');
  assert.ok(link.startsWith('https://wa.me/?text='));
  assert.ok(!link.includes(' ') && !link.includes('×') && !link.includes('&m'));
  assert.equal(decodeURIComponent(link.split('text=')[1]), 'Perfil × Propósito & mais');
});

test('com compartilhamento nativo nao abre o whatsapp', async () => {
  let aberto = null;
  const navegador = { share: async () => {} };
  const r = await compartilhar('oi', { navegador, abrir: (u) => { aberto = u; } });
  assert.equal(r, 'nativo');
  assert.equal(aberto, null);
});

test('se a pessoa cancelar, nada mais acontece', async () => {
  let aberto = null;
  const erro = Object.assign(new Error('cancelado'), { name: 'AbortError' });
  const navegador = { share: async () => { throw erro; } };
  const r = await compartilhar('oi', { navegador, abrir: (u) => { aberto = u; } });
  assert.equal(r, 'cancelado');
  assert.equal(aberto, null);
});

test('se o nativo falhar por outro motivo, cai no whatsapp', async () => {
  let aberto = null;
  const navegador = { share: async () => { throw new Error('NotAllowedError'); } };
  const r = await compartilhar('oi', { navegador, abrir: (u) => { aberto = u; } });
  assert.equal(r, 'whatsapp');
  assert.ok(aberto.startsWith('https://wa.me/'));
});

test('sem compartilhamento nativo, abre o whatsapp', async () => {
  let aberto = null;
  const r = await compartilhar('oi', { navegador: {}, abrir: (u) => { aberto = u; } });
  assert.equal(r, 'whatsapp');
  assert.ok(aberto.includes('text=oi'));
});
```

Em `testes/relatorio.test.js`:
```js
test('o botao de compartilhar existe e sai do pdf', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  assert.match(html, /class="[^"]*sem-impressao[^"]*"[^>]*data-acao="compartilhar"/);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA com `Cannot find module '../src/compartilhar.js'`.

- [ ] **Step 3: Implementar `src/compartilhar.js`**

```js
import { NOMES_MOTIVADOR } from './motor.js';

export const URL_PUBLICA = 'https://lucianocabralsf.github.io/mapa-de-perfil/';

// Resumo sem o nome da pessoa: quem compartilha decide o que expor.
export function textoCompartilhamento(resultado, url = URL_PUBLICA) {
  const [primeiro, segundo] = resultado.motivacoes;
  return `Fiz o Mapa de Perfil da DEL: meu perfil é ${resultado.perfil.titulo}, `
    + `e o que mais me move é ${NOMES_MOTIVADOR[primeiro.codigo]} e `
    + `${NOMES_MOTIVADOR[segundo.codigo]}. Faça o seu: ${url}`;
}

export function linkWhatsApp(texto) {
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

// `navegador` e `abrir` sao injetados para o teste nao depender de browser.
export async function compartilhar(texto, { navegador, abrir }) {
  if (navegador?.share) {
    try {
      await navegador.share({ text: texto });
      return 'nativo';
    } catch (erro) {
      if (erro?.name === 'AbortError') return 'cancelado';
    }
  }
  abrir(linkWhatsApp(texto));
  return 'whatsapp';
}
```

- [ ] **Step 4: Ligar no relatório e nas telas**

Em `src/relatorio.js`, nova função e uso no rodapé, logo depois de `botaoImprimir('rodape')`:
```js
function botaoCompartilhar() {
  return '<button type="button" class="botao-secundario sem-impressao" data-acao="compartilhar">'
    + 'Compartilhar meu perfil</button>';
}
```

Em `src/telas.js`:
- `import { compartilhar, textoCompartilhamento } from './compartilhar.js';`
- Guardar o resultado ao montar o relatório:
  ```js
  let ultimoResultado = null;

  function telaRelatorio() {
    limparEstado();
    ultimoResultado = calcularResultado(respostas);
    return montarRelatorio(ultimoResultado);
  }
  ```
  (`let ultimoResultado` declarado junto de `let respostas`.)
- Em `aoClicar`:
  ```js
      else if (acao === 'compartilhar' && ultimoResultado) {
        compartilhar(textoCompartilhamento(ultimoResultado), {
          navegador: navigator,
          abrir: (url) => window.open(url, '_blank', 'noopener'),
        });
      }
  ```

Em `estilos.css`, depois de `.botao-principal`:
```css
.botao-secundario {
  display: block;
  width: 100%;
  min-height: 52px;
  margin: 0 0 20px;
  font: inherit;
  font-weight: 700;
  color: var(--navy);
  background: transparent;
  border: 1.5px solid var(--navy);
  border-radius: 12px;
  cursor: pointer;
}
.botao-secundario:focus-visible { outline: 2px solid var(--navy); outline-offset: 2px; }
```

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `npm test`
Expected: todos passando.

- [ ] **Step 6: Commit**

```bash
git add src/compartilhar.js testes/compartilhar.test.js src/relatorio.js src/telas.js estilos.css testes/relatorio.test.js
git commit -m "feat: compartilhar resumo do perfil"
```

---

### Task 6: Aviso para navegador de aplicativo

**Files:**
- Create: `src/ambiente.js`
- Create: `testes/ambiente.test.js`
- Modify: `src/telas.js` (`htmlAbertura` exportada; ação `imprimir`)
- Modify: `estilos.css` (`.aviso-navegador`)
- Test: `testes/telas.test.js`

**Interfaces:**
- Produces: `navegadorInterno(ua) -> 'WhatsApp' | 'Instagram' | 'Facebook' | 'Line' | 'aplicativo' | null` em `src/ambiente.js`; `htmlAbertura({ interno }) -> string` exportada de `src/telas.js` (consumida também pela Tarefa 8).

Cobre o item 4 do Review Focus.

**Limite honesto:** navegador de aplicativo só é reconhecido pelo texto de identificação (user agent), e nenhum teste automático prova que o PDF falha ou funciona num WebView real. Por isso a Tarefa 10 inclui teste num Android de verdade, feito por Luciano.

- [ ] **Step 1: Escrever os testes que falham**

`testes/ambiente.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { navegadorInterno } from '../src/ambiente.js';

const UA = {
  chromeAndroid: 'Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
  webviewAndroid: 'Mozilla/5.0 (Linux; Android 14; SM-A546B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0.6613.127 Mobile Safari/537.36',
  whatsappAndroid: 'Mozilla/5.0 (Linux; Android 14; SM-A546B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0 Mobile Safari/537.36 WhatsApp/2.24.19',
  safariIphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  instagramIphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0.0',
  facebookAndroid: 'Mozilla/5.0 (Linux; Android 14; wv) AppleWebKit/537.36 Chrome/128.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/480.0]',
  samsung: 'Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36',
  desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
};

test('navegadores comuns nunca sao tratados como aplicativo', () => {
  for (const nome of ['chromeAndroid', 'safariIphone', 'samsung', 'desktop']) {
    assert.equal(navegadorInterno(UA[nome]), null, `${nome} classificado errado`);
  }
});

test('aplicativos conhecidos sao reconhecidos pelo nome', () => {
  assert.equal(navegadorInterno(UA.whatsappAndroid), 'WhatsApp');
  assert.equal(navegadorInterno(UA.instagramIphone), 'Instagram');
  assert.equal(navegadorInterno(UA.facebookAndroid), 'Facebook');
});

test('webview generico do android e reconhecido como aplicativo', () => {
  assert.equal(navegadorInterno(UA.webviewAndroid), 'aplicativo');
});

test('entrada vazia ou estranha nao quebra', () => {
  assert.equal(navegadorInterno(''), null);
  assert.equal(navegadorInterno(undefined), null);
});
```

Em `testes/telas.test.js`:
```js
import { htmlAbertura } from '../src/telas.js';

test('a abertura so avisa quando esta dentro de aplicativo', () => {
  assert.ok(!htmlAbertura({ interno: null }).includes('aviso-navegador'));
  const aviso = htmlAbertura({ interno: 'WhatsApp' });
  assert.ok(aviso.includes('aviso-navegador'));
  assert.ok(aviso.includes('pelo WhatsApp'));
  assert.ok(htmlAbertura({ interno: 'aplicativo' }).includes('dentro de um aplicativo'));
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA com `Cannot find module '../src/ambiente.js'`.

- [ ] **Step 3: Implementar `src/ambiente.js`**

```js
// Navegadores embutidos em aplicativos costumam nao salvar PDF.
// Reconhecimento pelo user agent: conservador de proposito, porque um
// falso positivo esconderia o PDF de quem consegue usa-lo.
export function navegadorInterno(ua) {
  const texto = String(ua || '');
  if (/WhatsApp/i.test(texto)) return 'WhatsApp';
  if (/Instagram/i.test(texto)) return 'Instagram';
  if (/FBAN|FBAV|FB_IAB/i.test(texto)) return 'Facebook';
  if (/\bLine\//.test(texto)) return 'Line';
  if (/Android[^)]*;\s*wv\)/i.test(texto)) return 'aplicativo';
  return null;
}
```

- [ ] **Step 4: Implementar nas telas**

Em `src/telas.js`:
- `import { navegadorInterno } from './ambiente.js';`
- Tirar o HTML da abertura de dentro de `criarNavegacao` e exportar como função pura:
  ```js
  export function htmlAbertura({ interno }) {
    const origem = interno === 'aplicativo' ? 'dentro de um aplicativo' : `pelo ${interno}`;
    const aviso = interno
      ? '<div class="aviso-navegador">'
        + `<p><strong>Você abriu ${escaparHtml(origem)}.</strong> Para conseguir salvar seu resultado `
        + 'em PDF no final, abra esta página no navegador antes de começar: toque em '
        + '<strong>⋮</strong> ou <strong>…</strong> e escolha <strong>Abrir no navegador</strong>.</p>'
        + '</div>'
      : '';
    return '<div class="tela">'
      + '<p class="kicker">DEL / LÓTUS</p>'
      + '<h1>Mapa de Perfil.</h1>'
      + aviso
      + '<p>Um retrato de como você age, do que te move e de quanto o seu momento de '
      + 'vida está influenciando as duas coisas.</p>'
      + '<p>São cerca de 10 minutos. Responda sem pensar muito: a primeira reação costuma '
      + 'ser a mais verdadeira.</p>'
      + '<p>Em várias telas você vai escolher entre palavras que talvez combinem todas com '
      + 'você, ou nenhuma. Escolha a que <strong>mais</strong> e a que <strong>menos</strong> '
      + 'se parece com você. A comparação é entre elas, não com o mundo.</p>'
      + '<p class="aviso-abertura">Nada do que você responder é gravado em servidor. '
      + 'O resultado aparece aqui no seu aparelho e some quando você fechar esta aba.</p>'
      + '<button type="button" class="botao-principal" data-acao="comecar">Começar</button>'
      + '</div>';
  }
  ```
- Dentro de `criarNavegacao`: `const interno = navegadorInterno(navigator.userAgent);` e, em `desenhar`, `raiz.innerHTML = htmlAbertura({ interno });`. Remover a antiga `telaAbertura`.
- Ação de PDF em `aoClicar`:
  ```js
      else if (acao === 'imprimir') {
        if (interno && !alvo.dataset.insistir) mostrarAvisoPdf(alvo);
        else window.print();
      }
  ```
  com
  ```js
  function mostrarAvisoPdf(botao) {
    if (raiz.querySelector('#aviso-pdf')) return;
    botao.insertAdjacentHTML('beforebegin',
      '<div class="aviso-navegador sem-impressao" id="aviso-pdf">'
      + '<p>O navegador deste aplicativo costuma não salvar PDF. Para guardar seu resultado agora, '
      + 'tire prints da tela. Da próxima vez, abra o link no Chrome ou no Safari antes de começar.</p>'
      + '</div>');
    botao.dataset.insistir = '1';
    botao.textContent = 'Tentar salvar em PDF mesmo assim';
  }
  ```

Em `estilos.css`:
```css
.aviso-navegador {
  background: var(--blue-pale);
  border-left: 3px solid var(--gold);
  border-radius: 8px;
  padding: 12px 14px;
  margin: 0 0 16px;
  color: var(--ink);
  font-size: 15px;
}
.aviso-navegador p { margin: 0; }
```

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `npm test`
Expected: todos passando.

- [ ] **Step 6: Conferir no navegador simulando aplicativo**

Com Playwright, abrir `http://localhost:4173` com o user agent `whatsappAndroid` do teste: o aviso aparece na abertura; no relatório, o primeiro toque em "Salvar em PDF" mostra o aviso e troca o texto do botão. Com o user agent `chromeAndroid`: nenhum aviso, e o PDF abre direto.

- [ ] **Step 7: Commit**

```bash
git add src/ambiente.js testes/ambiente.test.js src/telas.js estilos.css testes/telas.test.js
git commit -m "feat: aviso para navegador de aplicativo"
```

---

### Task 7: Prévia do link no WhatsApp

**Files:**
- Create: `ferramentas/previa.html`
- Create: `imagens/previa.png`, `imagens/logotipo-del.png`
- Create: `testes/paginas.test.js`
- Modify: `index.html`, `.gitignore`

**Interfaces:**
- Produces: `testes/paginas.test.js` com os helpers `ler(arquivo)` e `metas(html)`, reaproveitados nas Tarefas 8 e 9.

Cobre o item 5 do Review Focus.

- [ ] **Step 1: Escrever o teste que falha**

`testes/paginas.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

export function ler(arquivo) {
  return readFileSync(new URL(`../${arquivo}`, import.meta.url), 'utf8');
}

export function metas(html) {
  const mapa = {};
  for (const m of html.matchAll(/<meta\s+(?:property|name)="([^"]+)"\s+content="([^"]*)"/g)) {
    mapa[m[1]] = m[2];
  }
  return mapa;
}

const BASE = 'https://lucianocabralsf.github.io/mapa-de-perfil/';

test('a pagina inicial tem as metatags da previa com urls absolutas', () => {
  const m = metas(ler('index.html'));
  assert.ok(m['og:title']);
  assert.ok(m['og:description'] && m['og:description'].length <= 200);
  assert.equal(m['og:url'], BASE);
  assert.equal(m['og:image'], `${BASE}imagens/previa.png`);
  assert.equal(m['og:image:width'], '1200');
  assert.equal(m['og:image:height'], '630');
  assert.ok(m.description);
});

test('a imagem da previa existe e e leve', () => {
  const { size } = statSync(new URL('../imagens/previa.png', import.meta.url));
  assert.ok(size > 5 * 1024, 'imagem vazia ou quebrada');
  assert.ok(size < 300 * 1024, `imagem pesada demais: ${Math.round(size / 1024)} KB`);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA — metatags ausentes e imagem inexistente.

- [ ] **Step 3: Metatags no `index.html`**

No `<head>`, logo depois do `<title>`:
```html
  <meta name="description" content="Descubra como você age, o que te move e o quanto o seu momento de vida influencia isso. Cerca de 10 minutos, direto no celular.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="DEL / Lótus">
  <meta property="og:title" content="Mapa de Perfil — DEL / Lótus">
  <meta property="og:description" content="Descubra como você age, o que te move e o quanto o seu momento de vida influencia isso. Cerca de 10 minutos, direto no celular.">
  <meta property="og:url" content="https://lucianocabralsf.github.io/mapa-de-perfil/">
  <meta property="og:image" content="https://lucianocabralsf.github.io/mapa-de-perfil/imagens/previa.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Mapa de Perfil, da DEL / Lótus Desenvolvimento Humano e Gerencial">
  <meta name="twitter:card" content="summary_large_image">
```

- [ ] **Step 4: Gerar a imagem**

1. Copiar `C:\Users\LENOVO\.claude\skills\identidade-visual-del\assets\logotipo-del.png` para `imagens/logotipo-del.png`.
2. Em `.gitignore`, acrescentar ao fim: `!imagens/*.png`.
3. Criar `ferramentas/previa.html` — cartão 1200×630, fundo azul-noite, arcos dourados finos nos cantos, logotipo sobre cartão creme com borda dourada (o logotipo é azul-marinho e não pode ir direto no fundo escuro), kicker `DEL / LÓTUS` em dourado, título "Mapa de Perfil." em branco, subtítulo "Como você age. O que te move. O quanto o momento pesa." em dourado-claro e "Cerca de 10 minutos, direto no celular." em cinza-claro:
   ```html
   <!DOCTYPE html>
   <html lang="pt-BR">
   <head>
   <meta charset="utf-8">
   <style>
     html, body { margin: 0; }
     body { width: 1200px; height: 630px; background: #0B2543; font-family: Aptos, Calibri, 'Segoe UI', sans-serif; position: relative; overflow: hidden; }
     .arco { position: absolute; border: 2px solid rgba(201, 173, 103, .55); border-radius: 50%; }
     .a1 { width: 520px; height: 520px; right: -200px; top: -240px; }
     .a2 { width: 380px; height: 380px; left: -190px; bottom: -210px; }
     .conteudo { position: absolute; left: 96px; top: 110px; right: 96px; }
     .logo { display: inline-block; background: #F6F2E8; border: 1px solid #C9AD67; border-radius: 14px; padding: 14px 20px; }
     .logo img { height: 64px; display: block; }
     .kicker { color: #C9AD67; letter-spacing: 4px; font-size: 20px; margin: 44px 0 10px; }
     h1 { color: #fff; font-size: 88px; margin: 0; line-height: 1; }
     .sub { color: #D9C58D; font-size: 34px; margin: 22px 0 0; }
     .tempo { color: #DDE6EF; font-size: 24px; margin: 18px 0 0; }
   </style>
   </head>
   <body>
     <div class="arco a1"></div><div class="arco a2"></div>
     <div class="conteudo">
       <div class="logo"><img src="../imagens/logotipo-del.png" alt=""></div>
       <p class="kicker">DEL / LÓTUS</p>
       <h1>Mapa de Perfil.</h1>
       <p class="sub">Como você age. O que te move. O quanto o momento pesa.</p>
       <p class="tempo">Cerca de 10 minutos, direto no celular.</p>
     </div>
   </body>
   </html>
   ```
4. Com Playwright: viewport 1200×630, abrir `http://localhost:4173/ferramentas/previa.html`, `page.screenshot({ path: 'imagens/previa.png', type: 'png' })`.
5. Olhar a imagem gerada (Read). Se passar de 300 KB, gerar como `type: 'jpeg', quality: 85` com o nome `imagens/previa.jpg` e trocar o caminho no teste e no `og:image` — nunca deixar a imagem pesada.

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `npm test`
Expected: todos passando. `git status` mostra `imagens/previa.png` e `imagens/logotipo-del.png` como novos (e não ignorados).

- [ ] **Step 6: Commit**

```bash
git add index.html .gitignore ferramentas/previa.html imagens/previa.png imagens/logotipo-del.png testes/paginas.test.js
git commit -m "feat: previa do link com imagem da marca"
```

---

### Task 8: Página de referencial teórico

**Files:**
- Create: `metodo.html`
- Modify: `src/telas.js` (`htmlAbertura`)
- Modify: `src/relatorio.js` (rodapé)
- Modify: `estilos.css` (`.pagina-texto` e filhos)
- Test: `testes/paginas.test.js`, `testes/telas.test.js`, `testes/relatorio.test.js`

**Interfaces:**
- Consumes: `htmlAbertura` (Tarefa 6), `ler` e `metas` (Tarefa 7), `textoFlexionado` (Tarefa 1).
- Produces: `metodo.html` com sete seções `id="s1"` a `id="s7"`.

- [ ] **Step 1: Conferir cada referência antes de escrever**

Para cada item da lista abaixo, fazer uma busca (WebSearch) e confirmar autor, título, ano, editora ou periódico, volume, número e páginas. **Onde a busca divergir desta lista, vale a busca**: corrigir a referência no Step 3 e anotar a correção na mensagem de commit. Se uma referência não for encontrada em fonte confiável, retirá-la da página, junto com a frase que a cita.

1. MARSTON, William Moulton. *Emotions of normal people*. London: Kegan Paul, Trench, Trubner & Co., 1928.
2. THURSTONE, Louis Leon. A law of comparative judgment. *Psychological Review*, v. 34, n. 4, p. 273-286, 1927.
3. MEADE, Adam W. Psychometric problems and issues involved with creating and using ipsative measures for selection. *Journal of Occupational and Organizational Psychology*, v. 77, n. 4, p. 531-551, 2004.
4. HOCHSCHILD, Arlie Russell. *The managed heart*: commercialization of human feeling. Berkeley: University of California Press, 1983.
5. KRISTOF, Amy L. Person-organization fit: an integrative review of its conceptualizations, measurement, and implications. *Personnel Psychology*, v. 49, n. 1, p. 1-49, 1996.
6. SCHEIN, Edgar H. *Career anchors*: discovering your real values. San Diego: Pfeiffer, 1990.
7. DECI, Edward L.; RYAN, Richard M. The "what" and "why" of goal pursuits: human needs and the self-determination of behavior. *Psychological Inquiry*, v. 11, n. 4, p. 227-268, 2000.
8. HOGAN, Robert; HOGAN, Joyce. *Motives, Values, Preferences Inventory manual*. Tulsa: Hogan Assessment Systems, 1996.
9. SPIELBERGER, Charles D. et al. *Manual for the State-Trait Anxiety Inventory*. Palo Alto: Consulting Psychologists Press, 1983.
10. HOLMES, Thomas H.; RAHE, Richard H. The social readjustment rating scale. *Journal of Psychosomatic Research*, v. 11, n. 2, p. 213-218, 1967.
11. ROBERTS, Brent W.; WALTON, Kate E.; VIECHTBAUER, Wolfgang. Patterns of mean-level change in personality traits across the life course: a meta-analysis of longitudinal studies. *Psychological Bulletin*, v. 132, n. 1, p. 1-25, 2006.
12. BRASIL. Lei nº 4.119, de 27 de agosto de 1962. Dispõe sobre os cursos de formação em psicologia e regulamenta a profissão de psicólogo.
13. CONSELHO FEDERAL DE PSICOLOGIA. Resolução nº 31, de 2022. Estabelece diretrizes para a realização de Avaliação Psicológica no exercício profissional e regulamenta o SATEPSI. — **conferir número, data e ementa exatos.**

- [ ] **Step 2: Escrever os testes que falham**

Em `testes/paginas.test.js`:
```js
import { textoFlexionado } from './apoio/linguagem.js';

function textoVisivel(html) {
  return html.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
}

test('a pagina do metodo tem as sete secoes e volta para o teste', () => {
  const html = ler('metodo.html');
  for (let i = 1; i <= 7; i += 1) assert.ok(html.includes(`id="s${i}"`), `falta a secao ${i}`);
  assert.ok(html.includes('href="./"'), 'falta o caminho de volta');
  assert.ok(html.includes('estilos.css'));
});

test('a pagina do metodo declara os limites do instrumento', () => {
  const texto = textoVisivel(ler('metodo.html'));
  assert.match(texto, /não passou por (um )?estudo de validação/i);
  assert.match(texto, /não é (um )?teste psicológico/i);
});

test('a pagina do metodo cita os autores do referencial', () => {
  const texto = textoVisivel(ler('metodo.html'));
  for (const autor of ['MARSTON', 'THURSTONE', 'HOCHSCHILD', 'KRISTOF', 'SCHEIN', 'DECI', 'HOGAN', 'SPIELBERGER', 'HOLMES', 'ROBERTS']) {
    assert.ok(texto.includes(autor), `falta a referencia de ${autor}`);
  }
});

test('a pagina do metodo usa linguagem neutra', () => {
  assert.deepEqual(textoFlexionado(textoVisivel(ler('metodo.html'))), []);
});

test('a pagina do metodo tem previa propria', () => {
  const m = metas(ler('metodo.html'));
  assert.equal(m['og:url'], `${BASE}metodo.html`);
  assert.equal(m['og:image'], `${BASE}imagens/previa.png`);
});
```

Em `testes/telas.test.js`:
```js
test('a abertura leva para a base teorica', () => {
  assert.ok(htmlAbertura({ interno: null }).includes('href="metodo.html"'));
});
```

Em `testes/relatorio.test.js`:
```js
test('o rodape aponta a base teorica, tambem como texto para o pdf', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  const rodape = html.slice(html.indexOf('rodape-relatorio'));
  assert.ok(rodape.includes('href="metodo.html"'));
  assert.ok(rodape.includes('lucianocabralsf.github.io/mapa-de-perfil/metodo.html'));
});
```

- [ ] **Step 3: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA — `metodo.html` não existe.

- [ ] **Step 4: Escrever `metodo.html`**

Estrutura: mesmo `<head>` do `index.html` (charset, viewport, favicon, `estilos.css`, metatags com `og:url` = `https://lucianocabralsf.github.io/mapa-de-perfil/metodo.html`, `og:title` = "Base teórica — Mapa de Perfil", `og:image` igual ao da página inicial). Corpo em `<main class="pagina-texto">`, com um `<header>` (kicker `DEL / LÓTUS · MAPA DE PERFIL`, `<h1>A base teórica do método.</h1>`, link `<a class="voltar-link" href="./">‹ Voltar ao Mapa de Perfil</a>`) e as sete seções abaixo, cada uma `<section id="sN">` com kicker `0N / TÍTULO` e `<h2>`. O texto é este, sem acréscimos de conteúdo teórico que não esteja apoiado nas referências conferidas:

**01 / COMO O MÉTODO FUNCIONA** — `<h2>Quatro partes, uma pergunta: quem você é e quanto o momento pesa.</h2>`
> O Mapa de Perfil combina quatro medidas. Na primeira, você escolhe entre palavras a que mais e a que menos se parece com você, pensando na vida em geral. Na segunda, repete parte dessas escolhas pensando no que o trabalho exige hoje. Na terceira, escolhe entre pares de frases sobre o que pesa mais no trabalho. Na quarta, responde cinco perguntas sobre a fase de vida. O relatório cruza as quatro: o perfil vem da primeira, a tensão vem da diferença entre a primeira e a segunda, as motivações vêm da terceira, e a quarta diz com quanta cautela ler o resto.

**02 / COMPORTAMENTO** — `<h2>Quatro estilos, uma tradição de quase cem anos.</h2>`
> Os quatro estilos vêm do modelo proposto pelo psicólogo William Moulton Marston em 1928, que deu origem à família de instrumentos conhecida como DISC: Dominância, Influência, Estabilidade e Conformidade. Os nomes usados aqui — Executor, Comunicador, Planejador e Analista — são uma adaptação nossa, pensada para soar mais próxima do dia a dia de trabalho.
>
> A escolha é forçada ("mais" e "menos") em vez de nota de 1 a 5. Quando a pessoa pode dar nota alta para tudo o que soa bem, os resultados ficam parecidos entre si; escolher obriga a priorizar. O preço dessa escolha é conhecido na literatura (Meade, 2004): o resultado mostra o peso de cada estilo **dentro de você**, e não serve para comparar pessoas entre si com precisão.

**03 / NATURAL × ADAPTADO** — `<h2>O custo de sustentar um papel.</h2>`
> Instrumentos da família DISC costumam medir dois perfis: o natural, como a pessoa tende a agir, e o adaptado, como ela sente que precisa agir no ambiente atual. O Mapa faz o mesmo em seis blocos respondidos duas vezes, e chama de Índice de Tensão a distância entre as duas respostas.
>
> A leitura dessa distância se apoia em dois conceitos. O de trabalho emocional, de Arlie Hochschild (1983): sustentar uma postura diferente da própria consome energia, mesmo quando ninguém percebe. E o de ajuste entre pessoa e ambiente, revisado por Amy Kristof (1996): quanto maior a distância entre o que a pessoa é e o que o ambiente pede, maior tende a ser o desgaste. Tensão alta não quer dizer lugar errado. Quer dizer esforço, e esforço merece conversa.

**04 / MOTIVAÇÕES** — `<h2>Seis motivadores, escolhidos aos pares.</h2>`
> Os seis motivadores reúnem três referências: as Âncoras de Carreira de Edgar Schein (1990), a Teoria da Autodeterminação de Deci e Ryan (2000), que aponta autonomia, competência e pertencimento como necessidades básicas, e o inventário de motivos e valores de Hogan e Hogan (1996).
>
> Tabela (`<table>` dentro de `<div class="tabela-rolagem">`), duas colunas "Motivador" e "De onde vem":
> | Realização | Competência (Deci e Ryan); âncora de desafio puro (Schein) |
> | Autonomia | Autonomia (Deci e Ryan); âncora de autonomia e independência (Schein) |
> | Segurança | Âncora de segurança e estabilidade (Schein); motivo de segurança (Hogan) |
> | Reconhecimento | Motivo de reconhecimento (Hogan) |
> | Propósito | Âncora de serviço a uma causa (Schein); motivo altruísta (Hogan) |
> | Pertencimento | Pertencimento (Deci e Ryan); motivo de afiliação (Hogan) |
>
> Em vez de dar nota a cada frase, você escolhe a que pesa mais entre duas. Esse formato — a comparação pareada, descrita por Louis Thurstone em 1927 — evita que todos os motivadores recebam nota alta só porque todos soam bem.

**05 / MOMENTO ATUAL** — `<h2>Como você está não é o mesmo que como você é.</h2>`
> A psicologia distingue estado, que é como a pessoa está agora, de traço, que é como ela costuma ser. A distinção ficou conhecida pelo trabalho de Charles Spielberger sobre ansiedade. Mudanças de vida pesam nesse estado: a escala de Holmes e Rahe (1967) mostrou que eventos como mudança de emprego, de casa ou perda na família se acumulam como carga. E a personalidade também muda ao longo da vida, como mostrou a revisão de Roberts, Walton e Viechtbauer (2006).
>
> Por isso o Mapa pergunta sobre pressão, mudanças recentes, descanso, satisfação e previsibilidade. Essas respostas não entram no perfil: elas dizem com quanta cautela o perfil deve ser lido. É daí que vem a seção "Leia com cuidado" do relatório.

**06 / LIMITES DO INSTRUMENTO** — `<h2>O que este mapa não é.</h2>` (cartão com borda dourada, o único destaque da página)
> O Mapa de Perfil se inspira nos modelos acima, mas não passou por estudo de validação científica. Não é um teste psicológico: no Brasil, o uso de métodos e técnicas psicológicas é atividade privativa de psicólogos (Lei nº 4.119/1962), e a avaliação psicológica segue as regras do Conselho Federal de Psicologia (Resolução CFP nº 31/2022).
>
> Ele serve para autoconhecimento e para abrir conversa. Não deve ser usado sozinho para decidir contratação, promoção ou desligamento, e seus resultados não devem ser usados para comparar pessoas entre si.

**07 / REFERÊNCIAS** — `<h2>Referências.</h2>`
> Lista `<ol class="referencias">` com as 13 referências conferidas no Step 1, em ordem alfabética, sobrenome em caixa alta, título da obra ou do periódico em `<em>`.

Rodapé da página: linha dourada fina + "DEL / LÓTUS DESENVOLVIMENTO HUMANO E GERENCIAL" à esquerda.

- [ ] **Step 5: Estilos da página**

Em `estilos.css`:
```css
.pagina-texto { max-width: 720px; margin: 0 auto; padding: 28px 20px 56px; }
.pagina-texto section { border-top: 1px solid var(--gold-soft); padding: 22px 0 6px; }
.pagina-texto h2 { color: var(--navy); font-size: 22px; line-height: 1.25; margin: 6px 0 12px; }
.pagina-texto p, .pagina-texto li { line-height: 1.55; }
.pagina-texto .limites { background: var(--sand); border: 1.5px solid var(--gold); border-radius: 12px; padding: 18px; }
.voltar-link { display: inline-block; margin: 8px 0 12px; color: var(--navy); font-weight: 600; text-decoration: none; }
.tabela-rolagem { overflow-x: auto; }
.tabela-rolagem table { border-collapse: collapse; width: 100%; font-size: 14px; }
.tabela-rolagem th, .tabela-rolagem td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--gold-soft); vertical-align: top; }
.tabela-rolagem th { color: var(--bronze); font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; }
.referencias { padding-left: 20px; font-size: 14px; color: var(--ink); }
.referencias li { margin-bottom: 8px; }
.link-metodo { display: block; text-align: center; margin: 0 0 18px; color: var(--navy); font-weight: 600; }
```
e, dentro do `@media print` existente: `.voltar-link { display: none; }`.

- [ ] **Step 6: Ligar a página**

Em `htmlAbertura` (`src/telas.js`), logo depois do botão "Começar":
```js
      + '<a class="link-metodo" href="metodo.html">Conheça a base teórica do método →</a>'
```

Em `src/relatorio.js`, no rodapé, depois do parágrafo `aviso-legal`:
```js
      + '<p class="aviso-legal">Base teórica do método: '
      + '<a href="metodo.html">lucianocabralsf.github.io/mapa-de-perfil/metodo.html</a></p>'
```

- [ ] **Step 7: Rodar e confirmar que passa**

Run: `npm test`
Expected: todos passando.

- [ ] **Step 8: Conferir no navegador**

Abrir `http://localhost:4173/metodo.html` em 390×844 e em 1280×800: tabela rola na horizontal dentro do próprio quadro no celular, a página não rola de lado, "‹ Voltar" leva à abertura, e o link na abertura leva à página.

- [ ] **Step 9: Commit**

```bash
git add metodo.html src/telas.js src/relatorio.js estilos.css testes/paginas.test.js testes/telas.test.js testes/relatorio.test.js
git commit -m "feat: pagina de referencial teorico"
```

---

### Task 9: Guia do facilitador

**Files:**
- Create: `facilitador.html`
- Test: `testes/paginas.test.js`

**Interfaces:**
- Consumes: `ler`, `metas`, `textoVisivel` (Tarefas 7 e 8), `textoFlexionado` (Tarefa 1).

- [ ] **Step 1: Escrever os testes que falham**

Em `testes/paginas.test.js`:
```js
test('o guia do facilitador tem as seis secoes', () => {
  const html = ler('facilitador.html');
  for (let i = 1; i <= 6; i += 1) assert.ok(html.includes(`id="g${i}"`), `falta a secao ${i}`);
});

test('o guia do facilitador nao aparece em buscador nem no site', () => {
  assert.ok(ler('facilitador.html').includes('<meta name="robots" content="noindex, nofollow">'));
  for (const arquivo of ['index.html', 'metodo.html']) {
    assert.ok(!ler(arquivo).includes('facilitador.html'), `${arquivo} nao pode linkar o guia`);
  }
});

test('o guia do facilitador usa linguagem neutra', () => {
  assert.deepEqual(textoFlexionado(textoVisivel(ler('facilitador.html'))), []);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA — `facilitador.html` não existe.

- [ ] **Step 3: Escrever `facilitador.html`**

Mesma estrutura de `metodo.html` (classe `pagina-texto`, `estilos.css`, kicker, `<h1>Guia do facilitador.</h1>`), com `<meta name="robots" content="noindex, nofollow">` e **sem** metatags Open Graph. Seções `id="g1"` a `id="g6"`:

**01 / ROTEIRO DA AULA** — `<h2>Uma aula de 70 minutos.</h2>` Tabela:
| 0–5 min | Abertura: o que é o Mapa, que ninguém vai ver o resultado de ninguém sem permissão |
| 5–17 min | Preenchimento no celular (link ou QR code no slide) |
| 17–27 min | Leitura individual do relatório, em silêncio |
| 27–55 min | Dinâmica em grupos por perfil (seção 04) |
| 55–65 min | Plenária: o que cada grupo descobriu |
| 65–70 min | Fechamento: perfil não é sentença (ler em voz alta o último parágrafo do "Leia com cuidado") |

**02 / OS QUATRO PERFIS** — `<h2>Quatro jeitos de fazer o trabalho andar.</h2>` Quatro cartões areia, em terceira pessoa:
- **Executor** — Move pela decisão. Contribui com velocidade e firmeza; sob pressão, pode atropelar quem precisa de mais tempo. Para liderar esse perfil: meta clara e autonomia.
- **Comunicador** — Move pelas pessoas. Contribui com engajamento e clima; sob pressão, pode prometer além do prazo. Para liderar esse perfil: espaço de fala e reconhecimento.
- **Planejador** — Move pela constância. Contribui com estabilidade e escuta; sob pressão, pode calar o incômodo até sobrecarregar. Para liderar esse perfil: aviso antecipado e explicação do porquê.
- **Analista** — Move pelo critério. Contribui com qualidade e prevenção de erro; sob pressão, pode travar esperando o dado ideal. Para liderar esse perfil: critério definido e tempo para conferir.

**03 / COMO LER NATURAL × ADAPTADO** — `<h2>A pergunta que mais rende conversa.</h2>`
> O Índice de Tensão mede a distância entre como a pessoa é e como sente que precisa ser no trabalho. Até 9 é baixo, de 10 a 19 é moderado, 20 ou mais é alto. Tensão alta não significa emprego errado: significa energia gasta em sustentar um papel. Boa pergunta para a turma: "o que o seu trabalho hoje pede de você que não é do seu jeito natural — e quanto isso custa?"

**04 / DINÂMICA EM GRUPOS** — `<h2>Grupos por perfil dominante.</h2>` Lista numerada:
1. Separar a turma pelo perfil dominante (o título grande do relatório). Grupo com menos de 3 pessoas junta com o perfil mais próximo.
2. Cada grupo responde em 10 minutos: *o que nos tira do sério no trabalho? Do que precisamos de um líder? O que os outros perfis costumam não entender em nós?*
3. Cada grupo apresenta em 2 minutos. Os outros grupos só escutam.
4. Pergunta para a turma inteira: *se você liderasse uma equipe com os quatro perfis, o que mudaria na sua forma de conduzir reunião, dar retorno e cobrar prazo?*

**05 / PERGUNTAS PARA A PLENÁRIA** — `<h2>Para aprofundar.</h2>` Lista:
- Onde um Executor e um Planejador costumam entrar em conflito numa reunião? Como um líder evita que isso vire desgaste?
- Qual motivador apareceu mais na turma? O que isso diz sobre o que esta turma espera de um líder?
- Quem se reconheceu no "Leia com cuidado"? O que muda em ler o próprio resultado como fotografia de uma fase?
- Um líder deveria conhecer o perfil da equipe? Até onde isso ajuda, e a partir de onde vira rótulo?

**06 / CUIDADOS** — `<h2>Combinados antes de começar.</h2>` (cartão de destaque dourado)
- Participação voluntária: quem não quiser fazer, só observa.
- Ninguém é obrigado a mostrar o relatório. Compartilhar é escolha de cada pessoa.
- Nada fica gravado: o resultado existe só no celular de cada participante.
- O Mapa não é teste psicológico e não serve para decidir contratação ou promoção. A base teórica e os limites estão em `metodo.html` — vale mostrar para a turma.

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: todos passando.

- [ ] **Step 5: Conferir no navegador e na impressão**

Abrir `http://localhost:4173/facilitador.html` no celular e gerar a prévia de impressão: Luciano provavelmente vai imprimir este guia. Os cartões dos perfis não podem quebrar ao meio.

- [ ] **Step 6: Commit**

```bash
git add facilitador.html testes/paginas.test.js
git commit -m "feat: guia do facilitador"
```

---

### Task 10: Documentação, verificação completa e publicação

**Files:**
- Modify: `docs/superpowers/specs/2026-09-26-mapa-de-perfil-design.md`
- Modify: `README.md`

- [ ] **Step 1: Atualizar a spec**

Incorporar as "Decisões desta rodada" deste plano às seções correspondentes da spec: 2.2 (A2 com 6 blocos e `BLOCOS_ADAPTADO`), 2.3 (comparação pareada, 15 pares, 30 frases), 2.5 (36 telas, ~10 min; 30 com a chave desligada), 3.1 (fórmula de `pct` escalada por `n`), 3.2 (tensão sobre os mesmos 6 blocos), 3.3 (vitórias, `pct = bruto / 5 * 100`, desempate por confronto no grupo empatado), 5.1 (arquivos novos), 5.4 (chave `mapa-de-perfil-v2`), e uma seção nova "5.6 Páginas complementares" (`metodo.html`, `facilitador.html`, prévia do link, compartilhar, aviso de aplicativo).

- [ ] **Step 2: Atualizar o README**

Acrescentar, em português simples:
- os três endereços: teste, `metodo.html` e `facilitador.html` (este último marcado como "só para quem conduz a aula — não divulgar");
- que o teste agora leva cerca de 10 minutos;
- que a prévia do WhatsApp pode demorar a atualizar, porque o WhatsApp guarda a prévia antiga por um tempo.

- [ ] **Step 3: Rodar a bateria completa**

Run: `npm test`
Expected: todos passando, zero falhas, zero pulados.

- [ ] **Step 4: Percorrer o teste inteiro no navegador**

Com Playwright em 390×844, responder do início ao fim e conferir: 36 telas de resposta, ordem das etapas, relatório completo, botão de compartilhar, link da base teórica no rodapé, zero erro no console. Gerar o PDF do relatório e olhar todas as páginas: nenhum cartão cortado, botões ausentes, link da base teórica legível como texto.

- [ ] **Step 5: Revisão da rodada inteira**

Pedir revisão do diff completo da rodada (`git diff <commit anterior à Tarefa 1>..HEAD`) por um revisor novo, com esta lista de conferência: Review Focus deste plano, linguagem neutra, e se alguma referência entrou sem ter sido conferida. Corrigir o que o revisor confirmar.

- [ ] **Step 6: Commit da documentação**

```bash
git add docs/superpowers/specs/2026-09-26-mapa-de-perfil-design.md README.md
git commit -m "docs: spec e readme da rodada 2"
```

- [ ] **Step 7: Publicar — só com o "pode publicar" de Luciano**

Mostrar a Luciano o resumo do que muda e aguardar confirmação explícita. Com ela:
```bash
git push origin main
```
Aguardar o GitHub Pages (`gh api repos/LucianoCabralSF/mapa-de-perfil/pages -q .status` = `built`) e conferir no endereço público: teste completo, `metodo.html`, `facilitador.html`, e `curl -s https://lucianocabralsf.github.io/mapa-de-perfil/ | grep og:image`.

- [ ] **Step 8: Pedir a Luciano o teste que não dá para automatizar**

Pedir que ele abra o link **pelo WhatsApp num Android**, faça o teste até o fim e toque em "Salvar em PDF", e que mande o link num grupo para ver a prévia. Registrar o resultado na memória do projeto.
