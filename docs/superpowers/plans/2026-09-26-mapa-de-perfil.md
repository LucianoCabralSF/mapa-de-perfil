# Mapa de Perfil — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir uma página web que aplica um mapeamento comportamental e motivacional de ~13 minutos no celular e entrega, na hora e sem servidor, um relatório exportável em PDF.

**Architecture:** HTML estático com módulos JavaScript nativos do navegador, sem framework e sem etapa de compilação. O motor de cálculo é código puro, sem DOM, testado com `node --test`. A camada de telas consome o motor e nunca refaz conta.

**Tech Stack:** HTML + CSS + JavaScript (módulos ES nativos). Testes com `node --test` (Node v24). SVG gerado no próprio código. Publicação por GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-26-mapa-de-perfil-design.md`

## Global Constraints

- **Sem dependências de runtime.** Nenhuma biblioteca externa, nenhum CDN, nenhuma requisição de rede em tempo de uso. `package.json` existe só para rodar testes e não tem `dependencies`.
- **Sem etapa de compilação.** O que está no repositório é o que o navegador executa.
- **Nada trafega para servidor.** Nenhum `fetch`, `XMLHttpRequest`, `navigator.sendBeacon` ou formulário com `action`.
- **Paleta DEL/Lótus, valores exatos:** azul-marinho `#15365E`, azul-noite `#0B2543`, dourado `#C9AD67`, bronze `#8C7950`, dourado claro `#D9C58D`, creme `#F6F2E8`, areia `#EDE6D3`, azul-pálido `#DDE6EF`, tinta `#1E2A36`, cinza-azulado `#66717C`, verde `#52796F`.
- **Tipografia:** `Aptos, Calibri, 'Segoe UI', sans-serif`. Parágrafos alinhados à esquerda; centralizar apenas títulos de faixa e números.
- **Proporção de cor:** creme e azul-marinho dominam (~70%), dourado é acento (~15%). No máximo um elemento dourado de destaque por seção.
- **Português do Brasil**, frases curtas e afirmativas, voz prática e direta.
- **Constante `INCLUIR_ADAPTADO`** declarada uma única vez em `src/dados.js` e importada por quem precisar. Nenhum outro arquivo decide isso por conta própria.
- **Ordem canônica dos fatores:** `['E','C','P','A']`. **Ordem canônica dos motivadores:** `['REA','AUT','SEG','REC','PRO','PER']`. Essas ordens são as regras de desempate e não podem ser alteradas por conveniência de exibição.

## Review Focus

Cinco condições que a especificação pressupõe mas nenhuma tarefa exercitaria por conta própria. Cada uma tem seu teste atribuído a uma tarefa:

1. **Nome digitado com caracteres de HTML** (`<b>`, `"`, `&`) aparece escapado no relatório, não interpretado — a página é publicada, e o texto do próprio usuário não pode virar marcação. → Tarefa 10.
2. **`sessionStorage` indisponível ou bloqueado** (modo privado, navegador com armazenamento desligado): o teste inteiro continua funcionando, apenas sem recuperação após recarregar. → Tarefa 12.
3. **Empate absoluto nos quatro fatores** (pessoa marca de forma perfeitamente equilibrada, todos os brutos em zero): o relatório sai íntegro, com dominante definido pela ordem canônica e sem seção vazia. → Tarefa 2.
4. **Tensão calculada sem bloco adaptado**: com `INCLUIR_ADAPTADO` desligada, o resultado não traz tensão e o relatório não menciona tensão em nenhum lugar — nem no "Leia com cuidado". → Tarefa 6.
5. **Impressão quebrando cartão ao meio**: cada cartão do relatório é mantido inteiro na página impressa. → Tarefa 11.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade | Tarefa |
|---|---|---|
| `package.json` | Marca o projeto como módulos ES e define o comando de teste | 1 |
| `src/motor.js` | Toda a matemática: pontuação, perfil, tensão, motivações, momento | 1-6 |
| `src/dados.js` | Itens do questionário e a constante `INCLUIR_ADAPTADO` | 7 |
| `src/textos.js` | Biblioteca de textos do relatório | 8 |
| `src/graficos.js` | Geração das barras em SVG | 9 |
| `src/relatorio.js` | Monta o HTML do relatório a partir do resultado | 10 |
| `estilos.css` | Identidade visual, layout de celular, folha de impressão | 11 |
| `src/telas.js` | Navegação, telas de pergunta, progresso, respiro | 12 |
| `src/app.js` | Início da aplicação e amarração | 12 |
| `index.html` | Marcação mínima e ponto de entrada | 12 |
| `README.md` | Como publicar no GitHub Pages | 13 |
| `testes/*.test.js` | Testes automáticos | 1-10 |

---

## Formato das respostas

Contrato usado por todas as tarefas. Índices sempre na **ordem canônica** dos itens, nunca na ordem em que foram exibidos.

```js
{
  nome: 'Maria',
  contexto: 'Analista de RH',        // opcional, pode ser string vazia
  a1: [{ mais: 'E', menos: 'P' }, ...],   // 10 posições
  a2: [{ mais: 'A', menos: 'C' }, ...],   // 10 posições, ou null se INCLUIR_ADAPTADO for false
  b:  [4, 2, 5, ...],                     // 12 posições, cada uma de 1 a 5
  c:  [3, 1, 5, 2, 4]                     // 5 posições, cada uma de 1 a 5
}
```

---

### Task 1: Esqueleto do projeto e pontuação comportamental

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `src/motor.js`
- Test: `testes/motor.test.js`

**Interfaces:**
- Consumes: nada.
- Produces: `FATORES`, `MOTIVADORES`, `pontuarComportamento(respostas) -> { brutos, pct }`.

- [ ] **Step 1: Criar `package.json` e `.gitignore`**

`package.json`:
```json
{
  "name": "mapa-de-perfil",
  "version": "1.0.0",
  "description": "Mapeamento de perfil comportamental e motivacional - DEL / Lotus",
  "type": "module",
  "private": true,
  "scripts": {
    "test": "node --test testes/"
  }
}
```

`.gitignore`:
```
node_modules/
.DS_Store
Thumbs.db
```

- [ ] **Step 2: Escrever o teste que falha**

`testes/motor.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { FATORES, pontuarComportamento } from '../src/motor.js';

test('FATORES esta na ordem canonica', () => {
  assert.deepEqual(FATORES, ['E', 'C', 'P', 'A']);
});

test('dez respostas iguais levam o fator ao extremo', () => {
  const respostas = Array.from({ length: 10 }, () => ({ mais: 'E', menos: 'P' }));
  const { brutos, pct } = pontuarComportamento(respostas);
  assert.equal(brutos.E, 10);
  assert.equal(brutos.P, -10);
  assert.equal(brutos.C, 0);
  assert.equal(brutos.A, 0);
  assert.equal(pct.E, 100);
  assert.equal(pct.P, 0);
  assert.equal(pct.C, 50);
});

test('a soma dos brutos e sempre zero', () => {
  const respostas = [
    { mais: 'E', menos: 'A' }, { mais: 'C', menos: 'P' },
    { mais: 'A', menos: 'E' }, { mais: 'P', menos: 'C' },
    { mais: 'E', menos: 'C' }, { mais: 'C', menos: 'A' },
    { mais: 'P', menos: 'E' }, { mais: 'A', menos: 'P' },
    { mais: 'E', menos: 'P' }, { mais: 'C', menos: 'E' },
  ];
  const { brutos } = pontuarComportamento(respostas);
  const soma = FATORES.reduce((acc, f) => acc + brutos[f], 0);
  assert.equal(soma, 0);
});

test('resposta em branco no bloco nao pontua nada', () => {
  const respostas = [{ mais: null, menos: null }];
  const { brutos } = pontuarComportamento(respostas);
  assert.deepEqual(brutos, { E: 0, C: 0, P: 0, A: 0 });
});
```

- [ ] **Step 3: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FALHA com `Cannot find module` ou `pontuarComportamento is not a function`.

- [ ] **Step 4: Implementar o mínimo**

`src/motor.js`:
```js
export const FATORES = ['E', 'C', 'P', 'A'];
export const MOTIVADORES = ['REA', 'AUT', 'SEG', 'REC', 'PRO', 'PER'];

function zerados(chaves) {
  return Object.fromEntries(chaves.map((k) => [k, 0]));
}

export function pontuarComportamento(respostas) {
  const brutos = zerados(FATORES);
  for (const resposta of respostas) {
    if (resposta?.mais && brutos[resposta.mais] !== undefined) brutos[resposta.mais] += 1;
    if (resposta?.menos && brutos[resposta.menos] !== undefined) brutos[resposta.menos] -= 1;
  }
  const pct = Object.fromEntries(
    FATORES.map((f) => [f, Math.round(((brutos[f] + 10) / 20) * 100)]),
  );
  return { brutos, pct };
}
```

- [ ] **Step 5: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: 4 testes passando.

- [ ] **Step 6: Commit**

```bash
git add package.json .gitignore src/motor.js testes/motor.test.js
git commit -m "feat: pontuacao do bloco comportamental"
```

---

### Task 2: Perfil dominante, perfil de apoio e desempate

**Files:**
- Modify: `src/motor.js`
- Test: `testes/motor.test.js`

**Interfaces:**
- Consumes: `FATORES`, `pontuarComportamento`.
- Produces: `NOMES_FATOR`, `definirPerfil(brutos) -> { dominante, apoio, titulo }`. `apoio` é `null` quando não há segundo próximo.

- [ ] **Step 1: Escrever o teste que falha**

Acrescentar a `testes/motor.test.js`:
```js
import { definirPerfil, NOMES_FATOR } from '../src/motor.js';

test('dominante e o de maior bruto e sem apoio quando a distancia passa de 2', () => {
  const perfil = definirPerfil({ E: 8, C: 2, P: -4, A: -6 });
  assert.equal(perfil.dominante, 'E');
  assert.equal(perfil.apoio, null);
  assert.equal(perfil.titulo, 'Executor');
});

test('segundo proximo vira apoio', () => {
  const perfil = definirPerfil({ E: 5, C: 4, P: -4, A: -5 });
  assert.equal(perfil.dominante, 'E');
  assert.equal(perfil.apoio, 'C');
  assert.equal(perfil.titulo, 'Executor com apoio de Comunicador');
});

test('distancia de exatamente 2 ainda conta como apoio', () => {
  const perfil = definirPerfil({ E: 5, C: 3, P: -4, A: -4 });
  assert.equal(perfil.apoio, 'C');
});

test('empate absoluto cai na ordem canonica e nao quebra', () => {
  const perfil = definirPerfil({ E: 0, C: 0, P: 0, A: 0 });
  assert.equal(perfil.dominante, 'E');
  assert.equal(perfil.apoio, 'C');
  assert.equal(perfil.titulo, 'Executor com apoio de Comunicador');
});

test('empate no topo usa a ordem canonica para desempatar', () => {
  const perfil = definirPerfil({ E: -2, C: 6, P: 6, A: -10 });
  assert.equal(perfil.dominante, 'C');
  assert.equal(perfil.apoio, 'P');
});

test('NOMES_FATOR cobre os quatro fatores', () => {
  assert.deepEqual(Object.keys(NOMES_FATOR).sort(), ['A', 'C', 'E', 'P']);
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FALHA com `definirPerfil is not a function`.

- [ ] **Step 3: Implementar**

Acrescentar a `src/motor.js`:
```js
export const NOMES_FATOR = {
  E: 'Executor',
  C: 'Comunicador',
  P: 'Planejador',
  A: 'Analista',
};

export function ordenarFatores(brutos) {
  return [...FATORES].sort((a, b) => {
    if (brutos[b] !== brutos[a]) return brutos[b] - brutos[a];
    return FATORES.indexOf(a) - FATORES.indexOf(b);
  });
}

export function definirPerfil(brutos) {
  const ordem = ordenarFatores(brutos);
  const dominante = ordem[0];
  const segundo = ordem[1];
  const temApoio = brutos[dominante] - brutos[segundo] <= 2;
  const apoio = temApoio ? segundo : null;
  const titulo = apoio
    ? `${NOMES_FATOR[dominante]} com apoio de ${NOMES_FATOR[apoio]}`
    : NOMES_FATOR[dominante];
  return { dominante, apoio, titulo };
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: 10 testes passando.

- [ ] **Step 5: Commit**

```bash
git add src/motor.js testes/motor.test.js
git commit -m "feat: perfil dominante, apoio e desempate deterministico"
```

---

### Task 3: Índice de tensão entre natural e adaptado

**Files:**
- Modify: `src/motor.js`
- Test: `testes/motor.test.js`

**Interfaces:**
- Consumes: `FATORES`, `NOMES_FATOR`.
- Produces: `calcularTensao(pctNatural, pctAdaptado) -> { indice, faixa, forcado, contido, diferencas }`. `faixa` é `'baixa' | 'moderada' | 'alta'`. `forcado` e `contido` são código de fator ou `null`. `diferencas` é `{ E, C, P, A }` com a diferença em pontos percentuais de cada fator.

- [ ] **Step 1: Escrever o teste que falha**

Acrescentar a `testes/motor.test.js`:
```js
import { calcularTensao } from '../src/motor.js';

test('natural igual a adaptado da tensao zero e nenhum fator apontado', () => {
  const pct = { E: 70, C: 40, P: 50, A: 40 };
  const tensao = calcularTensao(pct, pct);
  assert.equal(tensao.indice, 0);
  assert.equal(tensao.faixa, 'baixa');
  assert.equal(tensao.forcado, null);
  assert.equal(tensao.contido, null);
});

test('perfis opostos dao tensao alta', () => {
  const natural = { E: 100, C: 0, P: 100, A: 0 };
  const adaptado = { E: 0, C: 100, P: 0, A: 100 };
  const tensao = calcularTensao(natural, adaptado);
  assert.equal(tensao.indice, 100);
  assert.equal(tensao.faixa, 'alta');
});

test('aponta o fator mais forcado e o mais contido', () => {
  const natural = { E: 30, C: 60, P: 50, A: 60 };
  const adaptado = { E: 75, C: 35, P: 50, A: 60 };
  const tensao = calcularTensao(natural, adaptado);
  assert.equal(tensao.forcado, 'E');
  assert.equal(tensao.contido, 'C');
});

test('diferencas menores que 5 nao apontam fator', () => {
  const natural = { E: 50, C: 50, P: 50, A: 50 };
  const adaptado = { E: 54, C: 47, P: 50, A: 49 };
  const tensao = calcularTensao(natural, adaptado);
  assert.equal(tensao.forcado, null);
  assert.equal(tensao.contido, null);
});

test('as tres faixas respeitam os limites da especificacao', () => {
  const base = { E: 50, C: 50, P: 50, A: 50 };
  assert.equal(calcularTensao(base, { E: 59, C: 41, P: 50, A: 50 }).faixa, 'baixa');
  assert.equal(calcularTensao(base, { E: 70, C: 30, P: 50, A: 50 }).faixa, 'moderada');
  assert.equal(calcularTensao(base, { E: 90, C: 10, P: 50, A: 50 }).faixa, 'alta');
});
```

Conferência da terceira asserção de faixa: diferenças de +40, −40, 0, 0 dão média `(40+40+0+0)/4 = 20`, que é o piso da faixa alta.

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FALHA com `calcularTensao is not a function`.

- [ ] **Step 3: Implementar**

Acrescentar a `src/motor.js`:
```js
const LIMIAR_FATOR_APONTADO = 5;

export function calcularTensao(pctNatural, pctAdaptado) {
  const diferencas = Object.fromEntries(
    FATORES.map((f) => [f, pctAdaptado[f] - pctNatural[f]]),
  );
  const soma = FATORES.reduce((acc, f) => acc + Math.abs(diferencas[f]), 0);
  const indice = Math.round(soma / FATORES.length);

  let faixa = 'baixa';
  if (indice >= 20) faixa = 'alta';
  else if (indice >= 10) faixa = 'moderada';

  const maior = ordenarPorDiferenca(diferencas, 'desc');
  const menor = ordenarPorDiferenca(diferencas, 'asc');
  const forcado = diferencas[maior] >= LIMIAR_FATOR_APONTADO ? maior : null;
  const contido = diferencas[menor] <= -LIMIAR_FATOR_APONTADO ? menor : null;

  return { indice, faixa, forcado, contido, diferencas };
}

function ordenarPorDiferenca(diferencas, direcao) {
  const ordenados = [...FATORES].sort((a, b) => {
    const delta = direcao === 'desc' ? diferencas[b] - diferencas[a] : diferencas[a] - diferencas[b];
    if (delta !== 0) return delta;
    return FATORES.indexOf(a) - FATORES.indexOf(b);
  });
  return ordenados[0];
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: 15 testes passando.

- [ ] **Step 5: Commit**

```bash
git add src/motor.js testes/motor.test.js
git commit -m "feat: indice de tensao entre perfil natural e adaptado"
```

---

### Task 4: Ranking de motivações

**Files:**
- Modify: `src/motor.js`
- Test: `testes/motor.test.js`

**Interfaces:**
- Consumes: `MOTIVADORES`.
- Produces: `NOMES_MOTIVADOR`, `MAPA_MOTIVACOES`, `pontuarMotivacoes(respostas) -> [{ codigo, bruto, pct }]` em ordem decrescente.

`MAPA_MOTIVACOES` é o vetor de 12 posições que diz a qual motivador cada afirmação pertence, na ordem canônica das afirmações: duas por motivador, intercaladas para que afirmações do mesmo tema não apareçam em sequência.

- [ ] **Step 1: Escrever o teste que falha**

Acrescentar a `testes/motor.test.js`:
```js
import { pontuarMotivacoes, MAPA_MOTIVACOES, MOTIVADORES, NOMES_MOTIVADOR } from '../src/motor.js';

test('o mapa tem 12 afirmacoes, duas por motivador', () => {
  assert.equal(MAPA_MOTIVACOES.length, 12);
  for (const codigo of MOTIVADORES) {
    assert.equal(MAPA_MOTIVACOES.filter((c) => c === codigo).length, 2, `${codigo} precisa de 2 afirmacoes`);
  }
});

test('afirmacoes do mesmo motivador nao ficam lado a lado', () => {
  for (let i = 1; i < MAPA_MOTIVACOES.length; i += 1) {
    assert.notEqual(MAPA_MOTIVACOES[i], MAPA_MOTIVACOES[i - 1]);
  }
});

test('nota maxima nas duas afirmacoes leva o motivador a 100', () => {
  const respostas = MAPA_MOTIVACOES.map((codigo) => (codigo === 'AUT' ? 5 : 1));
  const ranking = pontuarMotivacoes(respostas);
  assert.equal(ranking[0].codigo, 'AUT');
  assert.equal(ranking[0].bruto, 10);
  assert.equal(ranking[0].pct, 100);
  assert.equal(ranking[ranking.length - 1].pct, 0);
});

test('o ranking traz os seis motivadores em ordem decrescente', () => {
  const respostas = MAPA_MOTIVACOES.map(() => 3);
  const ranking = pontuarMotivacoes(respostas);
  assert.equal(ranking.length, 6);
  for (let i = 1; i < ranking.length; i += 1) {
    assert.ok(ranking[i - 1].pct >= ranking[i].pct);
  }
});

test('empate geral cai na ordem canonica', () => {
  const respostas = MAPA_MOTIVACOES.map(() => 3);
  const ranking = pontuarMotivacoes(respostas);
  assert.deepEqual(ranking.map((m) => m.codigo), MOTIVADORES);
});

test('NOMES_MOTIVADOR cobre os seis codigos', () => {
  assert.deepEqual(Object.keys(NOMES_MOTIVADOR).sort(), [...MOTIVADORES].sort());
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FALHA com `pontuarMotivacoes is not a function`.

- [ ] **Step 3: Implementar**

Acrescentar a `src/motor.js`:
```js
export const NOMES_MOTIVADOR = {
  REA: 'Realização',
  AUT: 'Autonomia',
  SEG: 'Segurança',
  REC: 'Reconhecimento',
  PRO: 'Propósito',
  PER: 'Pertencimento',
};

export const MAPA_MOTIVACOES = [
  'REA', 'AUT', 'SEG', 'REC', 'PRO', 'PER',
  'AUT', 'REA', 'REC', 'SEG', 'PER', 'PRO',
];

export function pontuarMotivacoes(respostas) {
  const brutos = zerados(MOTIVADORES);
  MAPA_MOTIVACOES.forEach((codigo, indice) => {
    const nota = respostas[indice];
    if (typeof nota === 'number') brutos[codigo] += nota;
  });
  return MOTIVADORES
    .map((codigo) => ({
      codigo,
      bruto: brutos[codigo],
      pct: Math.round(((brutos[codigo] - 2) / 8) * 100),
    }))
    .sort((a, b) => {
      if (b.bruto !== a.bruto) return b.bruto - a.bruto;
      return MOTIVADORES.indexOf(a.codigo) - MOTIVADORES.indexOf(b.codigo);
    });
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: 21 testes passando.

- [ ] **Step 5: Commit**

```bash
git add src/motor.js testes/motor.test.js
git commit -m "feat: ranking de motivacoes"
```

---

### Task 5: Termômetro do momento

**Files:**
- Modify: `src/motor.js`
- Test: `testes/motor.test.js`

**Interfaces:**
- Consumes: nada novo.
- Produces: `DIRECOES_MOMENTO`, `pontuarMomento(respostas) -> { bruto, pct, faixa }`. `faixa` é `'estavel' | 'movimento' | 'turbulento'`.

`DIRECOES_MOMENTO` marca `'direta'` para C1 e C2 e `'invertida'` para C3, C4 e C5, na ordem canônica das cinco perguntas.

- [ ] **Step 1: Escrever o teste que falha**

Acrescentar a `testes/motor.test.js`:
```js
import { pontuarMomento, DIRECOES_MOMENTO } from '../src/motor.js';

test('as direcoes seguem a especificacao', () => {
  assert.deepEqual(DIRECOES_MOMENTO, ['direta', 'direta', 'invertida', 'invertida', 'invertida']);
});

test('vida tranquila da momento estavel', () => {
  // pouca pressao, sem mudancas, dorme bem, satisfeito, tudo previsivel
  const { pct, faixa } = pontuarMomento([1, 1, 5, 5, 5]);
  assert.equal(pct, 0);
  assert.equal(faixa, 'estavel');
});

test('vida em crise da momento turbulento', () => {
  // muita pressao, muitas mudancas, dorme mal, insatisfeito, imprevisivel
  const { pct, faixa } = pontuarMomento([5, 5, 1, 1, 1]);
  assert.equal(pct, 100);
  assert.equal(faixa, 'turbulento');
});

test('as perguntas invertidas realmente invertem', () => {
  const soDiretas = pontuarMomento([5, 5, 5, 5, 5]);
  const soInvertidas = pontuarMomento([1, 1, 1, 1, 1]);
  assert.equal(soDiretas.bruto, 8);
  assert.equal(soInvertidas.bruto, 12);
});

test('meio da escala cai na faixa do meio', () => {
  const { pct, faixa } = pontuarMomento([3, 3, 3, 3, 3]);
  assert.equal(pct, 50);
  assert.equal(faixa, 'movimento');
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FALHA com `pontuarMomento is not a function`.

- [ ] **Step 3: Implementar**

Acrescentar a `src/motor.js`:
```js
export const DIRECOES_MOMENTO = ['direta', 'direta', 'invertida', 'invertida', 'invertida'];

export function pontuarMomento(respostas) {
  let bruto = 0;
  DIRECOES_MOMENTO.forEach((direcao, indice) => {
    const nota = respostas[indice];
    if (typeof nota !== 'number') return;
    bruto += direcao === 'direta' ? nota - 1 : 4 - (nota - 1);
  });
  const pct = Math.round((bruto / 20) * 100);
  let faixa = 'estavel';
  if (pct >= 56) faixa = 'turbulento';
  else if (pct >= 26) faixa = 'movimento';
  return { bruto, pct, faixa };
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: 26 testes passando.

- [ ] **Step 5: Commit**

```bash
git add src/motor.js testes/motor.test.js
git commit -m "feat: termometro do momento atual"
```

---

### Task 6: Resultado completo

**Files:**
- Modify: `src/motor.js`
- Test: `testes/motor.test.js`

**Interfaces:**
- Consumes: tudo das tarefas 1 a 5.
- Produces: `calcularResultado(respostas) -> resultado`, com esta forma exata:

```js
{
  nome, contexto, data,            // data no formato 'DD/MM/AAAA'
  natural: { brutos, pct },
  perfil: { dominante, apoio, titulo },
  adaptado: { brutos, pct } | null,
  tensao: { indice, faixa, forcado, contido, diferencas } | null,
  motivacoes: [{ codigo, bruto, pct }],   // 6 posicoes, decrescente
  momento: { bruto, pct, faixa },
  alertaReforcado: boolean
}
```

- [ ] **Step 1: Escrever o teste que falha**

Acrescentar a `testes/motor.test.js`:
```js
import { calcularResultado } from '../src/motor.js';

function respostasDeExemplo(extras = {}) {
  return {
    nome: 'Maria',
    contexto: '',
    a1: Array.from({ length: 10 }, () => ({ mais: 'E', menos: 'A' })),
    a2: Array.from({ length: 10 }, () => ({ mais: 'A', menos: 'E' })),
    b: MAPA_MOTIVACOES.map((c) => (c === 'PRO' ? 5 : 2)),
    c: [1, 1, 5, 5, 5],
    ...extras,
  };
}

test('resultado completo traz todas as partes', () => {
  const r = calcularResultado(respostasDeExemplo());
  assert.equal(r.nome, 'Maria');
  assert.equal(r.perfil.dominante, 'E');
  assert.equal(r.motivacoes[0].codigo, 'PRO');
  assert.equal(r.momento.faixa, 'estavel');
  assert.equal(r.tensao.faixa, 'alta');
  assert.match(r.data, /^\d{2}\/\d{2}\/\d{4}$/);
});

test('sem bloco adaptado nao existe tensao nenhuma', () => {
  const r = calcularResultado(respostasDeExemplo({ a2: null }));
  assert.equal(r.adaptado, null);
  assert.equal(r.tensao, null);
  assert.equal(r.alertaReforcado, false);
});

test('alerta reforcado exige momento turbulento e tensao alta juntos', () => {
  const turbulento = calcularResultado(respostasDeExemplo({ c: [5, 5, 1, 1, 1] }));
  assert.equal(turbulento.alertaReforcado, true);

  const soTurbulento = calcularResultado(
    respostasDeExemplo({
      c: [5, 5, 1, 1, 1],
      a2: Array.from({ length: 10 }, () => ({ mais: 'E', menos: 'A' })),
    }),
  );
  assert.equal(soTurbulento.tensao.faixa, 'baixa');
  assert.equal(soTurbulento.alertaReforcado, false);
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FALHA com `calcularResultado is not a function`.

- [ ] **Step 3: Implementar**

Acrescentar a `src/motor.js`:
```js
function dataDeHoje() {
  const agora = new Date();
  const dd = String(agora.getDate()).padStart(2, '0');
  const mm = String(agora.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${agora.getFullYear()}`;
}

export function calcularResultado(respostas) {
  const natural = pontuarComportamento(respostas.a1);
  const perfil = definirPerfil(natural.brutos);
  const adaptado = respostas.a2 ? pontuarComportamento(respostas.a2) : null;
  const tensao = adaptado ? calcularTensao(natural.pct, adaptado.pct) : null;
  const motivacoes = pontuarMotivacoes(respostas.b);
  const momento = pontuarMomento(respostas.c);
  const alertaReforcado = Boolean(tensao && tensao.faixa === 'alta' && momento.faixa === 'turbulento');

  return {
    nome: respostas.nome ?? '',
    contexto: respostas.contexto ?? '',
    data: dataDeHoje(),
    natural,
    perfil,
    adaptado,
    tensao,
    motivacoes,
    momento,
    alertaReforcado,
  };
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: 29 testes passando.

- [ ] **Step 5: Commit**

```bash
git add src/motor.js testes/motor.test.js
git commit -m "feat: montagem do resultado completo"
```

---

### Task 7: Itens do questionário

**Files:**
- Create: `src/dados.js`
- Test: `testes/dados.test.js`

**Interfaces:**
- Consumes: `FATORES`, `MOTIVADORES`, `MAPA_MOTIVACOES`, `DIRECOES_MOMENTO` de `src/motor.js`.
- Produces: `INCLUIR_ADAPTADO`, `BLOCOS`, `ANCORA_A1`, `ANCORA_A2`, `AFIRMACOES`, `PERGUNTAS_MOMENTO`, `ESCALA_CONCORDANCIA`, `ordemExibicaoA2()`.

Cada bloco é uma lista de 4 opções `{ fator, palavra }`, sempre na ordem canônica `E, C, P, A`. A ordem de exibição embaralhada do A2 é responsabilidade de `ordemExibicaoA2()`, que inverte a ordem dos blocos e, dentro de cada bloco, a ordem das opções — de forma fixa, nunca sorteada.

- [ ] **Step 1: Escrever o teste que falha**

`testes/dados.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { FATORES, MOTIVADORES, MAPA_MOTIVACOES, DIRECOES_MOMENTO } from '../src/motor.js';
import {
  BLOCOS, AFIRMACOES, PERGUNTAS_MOMENTO, ESCALA_CONCORDANCIA,
  ANCORA_A1, ANCORA_A2, ordemExibicaoA2, INCLUIR_ADAPTADO,
} from '../src/dados.js';

test('existem 10 blocos com 4 opcoes cada, uma por fator', () => {
  assert.equal(BLOCOS.length, 10);
  for (const [i, bloco] of BLOCOS.entries()) {
    assert.equal(bloco.length, 4, `bloco ${i} precisa de 4 opcoes`);
    assert.deepEqual(bloco.map((o) => o.fator), FATORES, `bloco ${i} fora da ordem canonica`);
    for (const opcao of bloco) {
      assert.equal(typeof opcao.palavra, 'string');
      assert.ok(opcao.palavra.length > 0 && opcao.palavra.length <= 24, `palavra longa demais: ${opcao.palavra}`);
    }
  }
});

test('nenhuma palavra se repete no instrumento inteiro', () => {
  const todas = BLOCOS.flat().map((o) => o.palavra.toLowerCase());
  assert.equal(new Set(todas).size, todas.length);
});

test('existem 12 afirmacoes alinhadas ao mapa de motivacoes', () => {
  assert.equal(AFIRMACOES.length, MAPA_MOTIVACOES.length);
  for (const afirmacao of AFIRMACOES) {
    assert.equal(typeof afirmacao, 'string');
    assert.ok(afirmacao.length > 20);
  }
});

test('existem 5 perguntas de momento alinhadas as direcoes', () => {
  assert.equal(PERGUNTAS_MOMENTO.length, DIRECOES_MOMENTO.length);
});

test('a escala de concordancia tem 5 pontos rotulados', () => {
  assert.equal(ESCALA_CONCORDANCIA.length, 5);
  assert.deepEqual(ESCALA_CONCORDANCIA.map((p) => p.valor), [1, 2, 3, 4, 5]);
});

test('as duas ancoras sao textos diferentes', () => {
  assert.notEqual(ANCORA_A1, ANCORA_A2);
  assert.ok(ANCORA_A1.length > 10 && ANCORA_A2.length > 10);
});

test('a ordem de exibicao do A2 inverte blocos e opcoes sem perder nada', () => {
  const ordem = ordemExibicaoA2();
  assert.equal(ordem.length, 10);
  assert.deepEqual([...ordem.map((p) => p.indiceCanonico)].sort((a, b) => a - b),
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.equal(ordem[0].indiceCanonico, 9);
  assert.deepEqual(ordem[0].opcoes.map((o) => o.fator), ['A', 'P', 'C', 'E']);
});

test('INCLUIR_ADAPTADO e um booleano', () => {
  assert.equal(typeof INCLUIR_ADAPTADO, 'boolean');
});

test('MOTIVADORES continua com seis codigos', () => {
  assert.equal(MOTIVADORES.length, 6);
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FALHA com `Cannot find module '../src/dados.js'`.

- [ ] **Step 3: Implementar**

`src/dados.js`:
```js
// Liga ou desliga o bloco de comportamento adaptado (A2).
// Desligado: o teste cai de 37 para 27 telas e o relatorio omite
// a secao Natural x Adaptado.
export const INCLUIR_ADAPTADO = true;

export const ANCORA_A1 = 'Como você é na maior parte da sua vida, fora de qualquer trabalho específico.';
export const ANCORA_A2 = 'Como você sente que precisa ser no seu trabalho (ou estudo) hoje, para dar conta do que esperam de você.';

// Ordem canonica das opcoes em todos os blocos: E, C, P, A.
export const BLOCOS = [
  [{ fator: 'E', palavra: 'Decidido' }, { fator: 'C', palavra: 'Animado' }, { fator: 'P', palavra: 'Paciente' }, { fator: 'A', palavra: 'Cuidadoso' }],
  [{ fator: 'E', palavra: 'Direto' }, { fator: 'C', palavra: 'Falante' }, { fator: 'P', palavra: 'Calmo' }, { fator: 'A', palavra: 'Detalhista' }],
  [{ fator: 'E', palavra: 'Competitivo' }, { fator: 'C', palavra: 'Entusiasmado' }, { fator: 'P', palavra: 'Leal' }, { fator: 'A', palavra: 'Preciso' }],
  [{ fator: 'E', palavra: 'Ousado' }, { fator: 'C', palavra: 'Sociável' }, { fator: 'P', palavra: 'Constante' }, { fator: 'A', palavra: 'Organizado' }],
  [{ fator: 'E', palavra: 'Determinado' }, { fator: 'C', palavra: 'Otimista' }, { fator: 'P', palavra: 'Tranquilo' }, { fator: 'A', palavra: 'Criterioso' }],
  [{ fator: 'E', palavra: 'Assumo o comando' }, { fator: 'C', palavra: 'Convenço as pessoas' }, { fator: 'P', palavra: 'Apoio quem precisa' }, { fator: 'A', palavra: 'Confiro tudo' }],
  [{ fator: 'E', palavra: 'Decido rápido' }, { fator: 'C', palavra: 'Expressivo' }, { fator: 'P', palavra: 'Previsível' }, { fator: 'A', palavra: 'Metódico' }],
  [{ fator: 'E', palavra: 'Gosto de desafio' }, { fator: 'C', palavra: 'Gosto de gente' }, { fator: 'P', palavra: 'Gosto de rotina' }, { fator: 'A', palavra: 'Gosto de regras' }],
  [{ fator: 'E', palavra: 'Impaciente' }, { fator: 'C', palavra: 'Espontâneo' }, { fator: 'P', palavra: 'Prestativo' }, { fator: 'A', palavra: 'Reservado' }],
  [{ fator: 'E', palavra: 'Foco no resultado' }, { fator: 'C', palavra: 'Foco na relação' }, { fator: 'P', palavra: 'Foco na harmonia' }, { fator: 'A', palavra: 'Foco na qualidade' }],
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
  'Estou satisfeito com minha situação atual de trabalho ou estudo.',
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
  return BLOCOS.map((bloco, indice) => ({ indiceCanonico: indice, opcoes: [...bloco].reverse() }))
    .reverse();
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: 38 testes passando.

- [ ] **Step 5: Commit**

```bash
git add src/dados.js testes/dados.test.js
git commit -m "feat: itens do questionario"
```

---

### Task 8: Biblioteca de textos

**Files:**
- Create: `src/textos.js`
- Test: `testes/textos.test.js`

**Interfaces:**
- Consumes: `FATORES`, `MOTIVADORES` de `src/motor.js`.
- Produces: `RETRATOS`, `FORTES`, `ATENCAO`, `COMUNICACAO`, `AMBIENTE`, `MOTIVADOR_ALTO`, `MOTIVADOR_BAIXO`, `TEXTO_TENSAO`, `FATOR_FORCADO`, `FATOR_CONTIDO`, `TEXTO_ALINHADO`, `TEXTO_MOMENTO`, `ALERTA_REFORCADO`, `FECHAMENTO_RESSALVA`, `RODAPE_LEGAL`.

**Regras de redação, válidas para todos os textos:**
- Segunda pessoa, tratando quem lê por "você".
- Frases curtas e afirmativas. Sem jargão de RH.
- Nos pontos de atenção: descrever o efeito do comportamento, nunca julgar a pessoa. "Sua pressa faz você decidir antes de ouvir todo mundo" — não "você é precipitado".
- Nenhum texto sugere que a pessoa está na carreira errada ou deve pedir demissão.
- Retratos entre 50 e 90 palavras. Demais textos entre 15 e 45 palavras.

**Padrão completo do fator Executor**, a ser seguido para Comunicador, Planejador e Analista:

```js
RETRATOS.E = 'Você vai direto ao ponto. Onde os outros ainda estão analisando, você já decidiu e começou. Gosta de desafio, de meta clara e de ter controle sobre o resultado. Ritmo acelerado não te assusta: te incomoda é a lentidão. Você prefere errar rápido e corrigir a esperar a certeza absoluta. Quando um assunto trava, as pessoas costumam olhar para você esperando que alguém puxe a decisão.';

FORTES.E = [
  'Você decide rápido, inclusive quando falta informação.',
  'Assume a frente quando ninguém quer assumir.',
  'Não trava diante de problema grande.',
  'Mantém o foco no resultado quando o grupo se dispersa.',
  'Sustenta uma posição difícil sem recuar na primeira objeção.',
];

ATENCAO.E = [
  'Sua pressa faz você decidir antes de ouvir todo mundo.',
  'O time pode ler sua objetividade como dureza.',
  'Você se impacienta com quem precisa de mais tempo para entender.',
  'Detalhe importante às vezes passa batido na corrida pelo resultado.',
  'Delegar te custa: você acredita que resolve mais rápido sozinho.',
];

COMUNICACAO.E = 'Funciona: ir direto ao assunto, trazer o ponto principal na primeira frase e dizer o que se espera de você. Trava: rodeio, reunião longa sem decisão e explicação detalhada antes do objetivo.';

AMBIENTE.E = 'Ambiente ideal: metas claras, autonomia para decidir e espaço para assumir riscos. Ambiente que desgasta: processo lento, decisão travada em muitas aprovações e trabalho sem resultado visível.';
```

- [ ] **Step 1: Escrever o teste que falha**

`testes/textos.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { FATORES, MOTIVADORES } from '../src/motor.js';
import {
  RETRATOS, FORTES, ATENCAO, COMUNICACAO, AMBIENTE,
  MOTIVADOR_ALTO, MOTIVADOR_BAIXO, TEXTO_TENSAO, FATOR_FORCADO,
  FATOR_CONTIDO, TEXTO_ALINHADO, TEXTO_MOMENTO, ALERTA_REFORCADO,
  FECHAMENTO_RESSALVA, RODAPE_LEGAL,
} from '../src/textos.js';

test('todo fator tem retrato, fortes, atencao, comunicacao e ambiente', () => {
  for (const f of FATORES) {
    assert.ok(RETRATOS[f], `falta retrato de ${f}`);
    assert.equal(FORTES[f].length, 5, `${f} precisa de 5 pontos fortes`);
    assert.equal(ATENCAO[f].length, 5, `${f} precisa de 5 pontos de atencao`);
    assert.ok(COMUNICACAO[f], `falta comunicacao de ${f}`);
    assert.ok(AMBIENTE[f], `falta ambiente de ${f}`);
  }
});

test('retratos tem tamanho de retrato, nao de legenda', () => {
  for (const f of FATORES) {
    const palavras = RETRATOS[f].trim().split(/\s+/).length;
    assert.ok(palavras >= 50 && palavras <= 90, `retrato de ${f} tem ${palavras} palavras`);
  }
});

test('todo motivador tem as duas versoes de texto', () => {
  for (const m of MOTIVADORES) {
    assert.ok(MOTIVADOR_ALTO[m], `falta texto alto de ${m}`);
    assert.ok(MOTIVADOR_BAIXO[m], `falta texto baixo de ${m}`);
  }
});

test('as tres faixas de tensao e as tres de momento tem texto', () => {
  for (const faixa of ['baixa', 'moderada', 'alta']) {
    assert.ok(TEXTO_TENSAO[faixa], `falta texto de tensao ${faixa}`);
  }
  for (const faixa of ['estavel', 'movimento', 'turbulento']) {
    assert.ok(TEXTO_MOMENTO[faixa], `falta texto de momento ${faixa}`);
  }
});

test('todo fator tem texto de forcado e de contido', () => {
  for (const f of FATORES) {
    assert.ok(FATOR_FORCADO[f], `falta forcado de ${f}`);
    assert.ok(FATOR_CONTIDO[f], `falta contido de ${f}`);
  }
  assert.ok(TEXTO_ALINHADO);
});

test('textos fixos de ressalva existem', () => {
  assert.ok(ALERTA_REFORCADO.length > 40);
  assert.ok(FECHAMENTO_RESSALVA.length > 40);
  assert.ok(RODAPE_LEGAL.includes('psicológico'));
});

test('nenhum ponto de atencao acusa a pessoa', () => {
  const acusacoes = /\bvocê é (precipitado|teimoso|lento|frio|bagunçado|desorganizado)\b/i;
  for (const f of FATORES) {
    for (const item of ATENCAO[f]) {
      assert.doesNotMatch(item, acusacoes, `texto acusatorio em ${f}: ${item}`);
    }
  }
});

test('nenhum texto sugere largar o emprego', () => {
  const proibido = /(pedir demiss|largar o emprego|trocar de carreira|procurar outro emprego)/i;
  const todos = [
    ...Object.values(RETRATOS), ...Object.values(COMUNICACAO), ...Object.values(AMBIENTE),
    ...Object.values(TEXTO_TENSAO), ...Object.values(FATOR_FORCADO), ...Object.values(FATOR_CONTIDO),
    ...Object.values(TEXTO_MOMENTO), ALERTA_REFORCADO, FECHAMENTO_RESSALVA,
  ];
  for (const texto of todos) {
    assert.doesNotMatch(texto, proibido, `texto sugere sair do emprego: ${texto}`);
  }
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FALHA com `Cannot find module '../src/textos.js'`.

- [ ] **Step 3: Escrever `src/textos.js`**

Escrever os textos dos quatro fatores seguindo o padrão do Executor dado acima, mais:

- `MOTIVADOR_ALTO` e `MOTIVADOR_BAIXO` para os seis códigos. O alto explica o que acende a pessoa; o baixo explica o que a esvazia quando falta.
- `TEXTO_TENSAO` para `baixa`, `moderada` e `alta`. O texto de tensão alta descreve custo de energia, nunca prescreve mudança de emprego.
- `FATOR_FORCADO[f]` ("o ambiente está pedindo mais X do que é natural em você") e `FATOR_CONTIDO[f]` ("você está segurando o X que tem de natureza") para os quatro fatores, mais `TEXTO_ALINHADO` para quando nenhum fator se destaca.
- `TEXTO_MOMENTO` para `estavel`, `movimento` e `turbulento`.
- `ALERTA_REFORCADO`: o texto do cruzamento momento turbulento + tensão alta.
- `FECHAMENTO_RESSALVA`: a frase final, sempre presente, de que perfil muda com fase de vida e refazer em outro momento dará resultado diferente — e isso não é erro do instrumento.
- `RODAPE_LEGAL`: contém obrigatoriamente a palavra "psicológico", declarando que a ferramenta é de autoconhecimento e apoio à decisão, não teste psicológico nem diagnóstico, e não substitui avaliação profissional.

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: 46 testes passando.

- [ ] **Step 5: Commit**

```bash
git add src/textos.js testes/textos.test.js
git commit -m "feat: biblioteca de textos do relatorio"
```

---

### Task 9: Gráficos em SVG

**Files:**
- Create: `src/graficos.js`
- Test: `testes/graficos.test.js`

**Interfaces:**
- Consumes: `FATORES`, `NOMES_FATOR` de `src/motor.js`.
- Produces: `barrasComportamento(pct) -> string`, `barrasComparadas(pctNatural, pctAdaptado) -> string`, `barrasMotivacoes(ranking, nomes) -> string`. Todas devolvem SVG como texto, sem tocar no DOM.

- [ ] **Step 1: Escrever o teste que falha**

`testes/graficos.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { barrasComportamento, barrasComparadas, barrasMotivacoes } from '../src/graficos.js';
import { NOMES_MOTIVADOR } from '../src/motor.js';

const PCT = { E: 80, C: 60, P: 30, A: 40 };

test('o grafico de comportamento traz svg com os quatro nomes', () => {
  const svg = barrasComportamento(PCT);
  assert.match(svg, /^<svg/);
  assert.match(svg, /<\/svg>$/);
  for (const nome of ['Executor', 'Comunicador', 'Planejador', 'Analista']) {
    assert.ok(svg.includes(nome), `falta ${nome}`);
  }
});

test('barra de 100 e mais larga que barra de 0', () => {
  const svg = barrasComportamento({ E: 100, C: 0, P: 50, A: 50 });
  const larguras = [...svg.matchAll(/class="barra"[^>]*width="([\d.]+)"/g)].map((m) => Number(m[1]));
  assert.ok(larguras[0] > larguras[1]);
  assert.equal(larguras[1], 0);
});

test('o grafico comparado desenha duas barras por fator', () => {
  const svg = barrasComparadas(PCT, { E: 40, C: 70, P: 30, A: 60 });
  assert.equal([...svg.matchAll(/class="barra natural"/g)].length, 4);
  assert.equal([...svg.matchAll(/class="barra adaptado"/g)].length, 4);
});

test('o grafico de motivacoes respeita a ordem recebida', () => {
  const ranking = [
    { codigo: 'PRO', pct: 90 }, { codigo: 'AUT', pct: 70 }, { codigo: 'REA', pct: 60 },
    { codigo: 'PER', pct: 40 }, { codigo: 'REC', pct: 30 }, { codigo: 'SEG', pct: 10 },
  ];
  const svg = barrasMotivacoes(ranking, NOMES_MOTIVADOR);
  assert.ok(svg.indexOf('Propósito') < svg.indexOf('Segurança'));
});

test('valores fora da faixa sao aparados em vez de estourar o desenho', () => {
  const svg = barrasComportamento({ E: 140, C: -20, P: 50, A: 50 });
  const larguras = [...svg.matchAll(/class="barra"[^>]*width="([\d.]+)"/g)].map((m) => Number(m[1]));
  assert.ok(larguras.every((l) => l >= 0 && l <= 220));
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FALHA com `Cannot find module '../src/graficos.js'`.

- [ ] **Step 3: Implementar**

`src/graficos.js`:
```js
import { FATORES, NOMES_FATOR } from './motor.js';

const LARGURA = 320;
const LARGURA_ROTULO = 100;
const LARGURA_BARRA = LARGURA - LARGURA_ROTULO;
const ALTURA_LINHA = 34;

function aparar(valor) {
  if (typeof valor !== 'number' || Number.isNaN(valor)) return 0;
  return Math.max(0, Math.min(100, valor));
}

function larguraDe(pct) {
  return Number(((aparar(pct) / 100) * LARGURA_BARRA).toFixed(1));
}

function escapar(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function moldura(altura, conteudo) {
  return `<svg viewBox="0 0 ${LARGURA} ${altura}" role="img" class="grafico">${conteudo}</svg>`;
}

function linha(rotulo, y, barras) {
  const texto = `<text x="0" y="${y + 14}" class="rotulo">${escapar(rotulo)}</text>`;
  return texto + barras;
}

export function barrasComportamento(pct) {
  const conteudo = FATORES.map((f, i) => {
    const y = i * ALTURA_LINHA;
    const barra = `<rect class="barra" x="${LARGURA_ROTULO}" y="${y + 4}" width="${larguraDe(pct[f])}" height="16" rx="8"/>`;
    const valor = `<text x="${LARGURA - 2}" y="${y + 17}" class="valor" text-anchor="end">${aparar(pct[f])}</text>`;
    return linha(NOMES_FATOR[f], y, barra + valor);
  }).join('');
  return moldura(FATORES.length * ALTURA_LINHA, conteudo);
}

export function barrasComparadas(pctNatural, pctAdaptado) {
  const altura = ALTURA_LINHA + 8;
  const conteudo = FATORES.map((f, i) => {
    const y = i * altura;
    const natural = `<rect class="barra natural" x="${LARGURA_ROTULO}" y="${y + 2}" width="${larguraDe(pctNatural[f])}" height="12" rx="6"/>`;
    const adaptado = `<rect class="barra adaptado" x="${LARGURA_ROTULO}" y="${y + 18}" width="${larguraDe(pctAdaptado[f])}" height="12" rx="6"/>`;
    return linha(NOMES_FATOR[f], y, natural + adaptado);
  }).join('');
  return moldura(FATORES.length * altura, conteudo);
}

export function barrasMotivacoes(ranking, nomes) {
  const conteudo = ranking.map((item, i) => {
    const y = i * ALTURA_LINHA;
    const classe = i < 2 ? 'barra destaque' : i === ranking.length - 1 ? 'barra fraca' : 'barra';
    const barra = `<rect class="${classe}" x="${LARGURA_ROTULO}" y="${y + 4}" width="${larguraDe(item.pct)}" height="16" rx="8"/>`;
    const valor = `<text x="${LARGURA - 2}" y="${y + 17}" class="valor" text-anchor="end">${aparar(item.pct)}</text>`;
    return linha(nomes[item.codigo], y, barra + valor);
  }).join('');
  return moldura(ranking.length * ALTURA_LINHA, conteudo);
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: 51 testes passando.

- [ ] **Step 5: Commit**

```bash
git add src/graficos.js testes/graficos.test.js
git commit -m "feat: graficos em svg"
```

---

### Task 10: Montagem do relatório

**Files:**
- Create: `src/relatorio.js`
- Test: `testes/relatorio.test.js`

**Interfaces:**
- Consumes: tudo de `motor.js`, `textos.js`, `graficos.js`.
- Produces: `montarRelatorio(resultado) -> string` (HTML) e `escaparHtml(texto) -> string`.

Cobre o item 1 do Review Focus: nome com caracteres de HTML.

- [ ] **Step 1: Escrever o teste que falha**

`testes/relatorio.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularResultado, MAPA_MOTIVACOES } from '../src/motor.js';
import { montarRelatorio, escaparHtml } from '../src/relatorio.js';

function resultadoDeExemplo(extras = {}) {
  return calcularResultado({
    nome: 'Maria',
    contexto: 'Analista de RH',
    a1: Array.from({ length: 10 }, () => ({ mais: 'E', menos: 'A' })),
    a2: Array.from({ length: 10 }, () => ({ mais: 'A', menos: 'E' })),
    b: MAPA_MOTIVACOES.map((c) => (c === 'PRO' ? 5 : 2)),
    c: [5, 5, 1, 1, 1],
    ...extras,
  });
}

test('o relatorio traz todas as secoes previstas', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  for (const titulo of [
    'Seu perfil', 'Natural', 'Momento', 'motiva', 'Pontos fortes',
    'Pontos de atenção', 'Como se comunicar', 'Ambiente', 'Leia com cuidado',
  ]) {
    assert.ok(html.includes(titulo), `falta a secao: ${titulo}`);
  }
});

test('o botao de salvar em pdf aparece duas vezes e sai da impressao', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  const botoes = [...html.matchAll(/class="[^"]*sem-impressao[^"]*"[^>]*data-acao="imprimir"/g)];
  assert.equal(botoes.length, 2);
});

test('o indice nao lista secao ausente', () => {
  const html = montarRelatorio(resultadoDeExemplo({ a2: null }));
  const indice = html.slice(html.indexOf('id="indice"'), html.indexOf('</nav>'));
  assert.ok(!indice.includes('Adaptado'));
});

test('nome com html aparece escapado, nunca interpretado', () => {
  const html = montarRelatorio(resultadoDeExemplo({ nome: '<b>Ana</b> & "cia"' }));
  assert.ok(!html.includes('<b>Ana</b>'));
  assert.ok(html.includes('&lt;b&gt;Ana&lt;/b&gt;'));
  assert.ok(html.includes('&amp;'));
});

test('escaparHtml cobre os cinco caracteres perigosos', () => {
  assert.equal(escaparHtml('<a href="x" \'y\'>&'), '&lt;a href=&quot;x&quot; &#39;y&#39;&gt;&amp;');
});

test('sem bloco adaptado o relatorio nao fala em tensao', () => {
  const html = montarRelatorio(resultadoDeExemplo({ a2: null }));
  assert.ok(!/tens[ãa]o/i.test(html), 'o relatorio mencionou tensao sem bloco adaptado');
  assert.ok(!html.includes('Natural × Adaptado'));
  assert.ok(html.includes('Leia com cuidado'));
});

test('alerta reforcado aparece quando as duas condicoes se somam', () => {
  const comAlerta = montarRelatorio(resultadoDeExemplo());
  const semAlerta = montarRelatorio(resultadoDeExemplo({ c: [1, 1, 5, 5, 5] }));
  assert.ok(comAlerta.includes('id="alerta-reforcado"'));
  assert.ok(!semAlerta.includes('id="alerta-reforcado"'));
});

test('o rodape legal esta sempre presente', () => {
  const html = montarRelatorio(resultadoDeExemplo({ a2: null, c: [1, 1, 5, 5, 5] }));
  assert.ok(/psicol[óo]gico/i.test(html));
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FALHA com `Cannot find module '../src/relatorio.js'`.

- [ ] **Step 3: Implementar**

`src/relatorio.js` monta os cartões na ordem da especificação, seção 4. Regras obrigatórias:

- Toda entrada vinda da pessoa (`nome`, `contexto`) passa por `escaparHtml` antes de entrar no HTML.
- Os blocos de Natural × Adaptado e qualquer menção a tensão só são gerados quando `resultado.tensao` não é nulo.
- O bloco de alerta reforçado sai com `id="alerta-reforcado"` e só existe quando `resultado.alertaReforcado` é verdadeiro.
- A seção "Leia com cuidado" e o rodapé legal são incondicionais.
- Cada seção é um `<section class="cartao">` com título próprio, para a folha de impressão poder mantê-la inteira.
- **Índice no topo** (especificação 6.7): lista de links internos para as seções presentes, dentro de um elemento com classe `sem-impressao`. Seções ausentes não aparecem no índice.
- **Botão "Salvar em PDF"** aparece duas vezes, no topo e no rodapé, ambos com classe `sem-impressao`, chamando `window.print()`. O botão é criado aqui como marcação; a ligação do evento fica em `src/telas.js`, na Tarefa 12.
- Ordem das seções exatamente como na especificação 4: cabeçalho, perfil dominante, gráfico dos 4 fatores, Natural × Adaptado, Termômetro do Momento, motivadores, pontos fortes, pontos de atenção, como se comunicar, ambiente, o que desmotiva, Leia com cuidado, rodapé.

```js
export function escaparHtml(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: 59 testes passando.

- [ ] **Step 5: Commit**

```bash
git add src/relatorio.js testes/relatorio.test.js
git commit -m "feat: montagem do relatorio"
```

---

### Task 11: Estilos, identidade visual e folha de impressão

**Files:**
- Create: `estilos.css`

**Interfaces:**
- Consumes: as classes usadas em `src/graficos.js` (`grafico`, `barra`, `natural`, `adaptado`, `destaque`, `fraca`, `rotulo`, `valor`) e em `src/relatorio.js` (`cartao`).
- Produces: as classes consumidas por `src/telas.js` na Tarefa 12: `tela`, `progresso`, `progresso-trilho`, `progresso-preenchido`, `etapa`, `ancora`, `pergunta`, `opcoes`, `opcao`, `opcao.marcada`, `opcao.bloqueada`, `escala`, `escala-item`, `respiro`, `voltar`, `botao-principal`.

Cobre o item 5 do Review Focus: cartão inteiro na impressão.

- [ ] **Step 1: Escrever a folha de estilo**

Variáveis obrigatórias no topo, com os valores exatos da paleta:

```css
:root {
  --navy: #15365E;
  --navy2: #0B2543;
  --gold: #C9AD67;
  --bronze: #8C7950;
  --gold-soft: #D9C58D;
  --cream: #F6F2E8;
  --sand: #EDE6D3;
  --blue-pale: #DDE6EF;
  --ink: #1E2A36;
  --muted: #66717C;
  --green: #52796F;
  --fonte: Aptos, Calibri, 'Segoe UI', sans-serif;
}
```

Regras obrigatórias:
- `body` em creme, texto em tinta, fonte da variável.
- `.opcao` com `min-height: 56px`, largura total, cantos arredondados, fundo areia, borda de 1px em dourado claro.
- `.opcao.marcada` com fundo dourado e texto tinta. `.opcao.bloqueada` com opacidade reduzida e `pointer-events: none`.
- `.tela` ocupa a altura disponível sem rolagem em 360x640, com as opções na metade inferior.
- Transição lateral de 180ms entre telas.
- Bloco `@media (prefers-reduced-motion: reduce)` zerando toda animação e transição.
- Parágrafos à esquerda. Apenas títulos de faixa e números centralizados.
- Linha divisória dourada fina (1px, `--gold-soft`); nunca barra de cor cheia.
- No máximo um cartão dourado por seção do relatório.

Folha de impressão:
```css
@media print {
  .sem-impressao { display: none !important; }
  body { background: #fff; }
  .cartao {
    break-inside: avoid;
    page-break-inside: avoid;
    border: 1px solid var(--gold-soft);
    background: #fff;
  }
  .grafico { max-width: 100%; }
  a[href]::after { content: none; }
}
```

- [ ] **Step 2: Conferir visualmente**

Run: `npx --yes serve . -l 4173` e abrir `http://localhost:4173` no navegador.
Expected: a página ainda não tem conteúdo (Tarefa 12 a constrói); conferir apenas que `estilos.css` carrega sem erro no console.

- [ ] **Step 3: Commit**

```bash
git add estilos.css
git commit -m "feat: identidade visual e folha de impressao"
```

---

### Task 12: Telas, navegação e persistência

**Files:**
- Create: `index.html`
- Create: `src/telas.js`
- Create: `src/app.js`

**Interfaces:**
- Consumes: `src/dados.js`, `src/motor.js`, `src/relatorio.js`.
- Produces: a aplicação funcionando. `src/telas.js` exporta `criarNavegacao(raiz)`; `src/app.js` apenas monta e inicia.

Cobre o item 2 do Review Focus: `sessionStorage` bloqueado.

- [ ] **Step 1: Criar `index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mapa de Perfil — DEL / Lótus</title>
  <link rel="stylesheet" href="estilos.css">
</head>
<body>
  <main id="app"></main>
  <script type="module" src="src/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Implementar a sequência de telas em `src/telas.js`**

A sequência é montada como uma lista de descritores, na ordem da especificação 5.2:

1. `abertura` — o que é, quanto tempo leva, que a escolha é relativa e que nada é gravado.
2. `identificacao` — primeiro nome (obrigatório) e contexto (opcional).
3. 10 telas `blocoA1`, âncora `ANCORA_A1`, etapa 1.
4. `respiro` — virada de âncora.
5. 10 telas `blocoA2`, âncora `ANCORA_A2`, etapa 2, usando `ordemExibicaoA2()`. Omitidas quando `INCLUIR_ADAPTADO` é falso, junto com o respiro anterior.
6. `respiro` — mudança de tipo de pergunta.
7. 12 telas `afirmacao`, etapa 3.
8. `respiro` — anúncio da última etapa.
9. 5 telas `momento`, etapa 4.
10. `relatorio`.

Comportamento obrigatório das telas de escolha forçada:
- Estado interno `passo` de valor `'mais'` ou `'menos'`.
- No passo `'mais'`: pergunta "Qual MAIS combina com você?".
- Ao tocar: grava, marca a opção com a classe `marcada`, troca a pergunta para "E qual MENOS combina?" e aplica `bloqueada` na opção já escolhida.
- No passo `'menos'`, ao tocar: grava e avança após 250ms.
- `voltar` no passo `'menos'` retorna ao passo `'mais'` da mesma tela, limpando a escolha; no passo `'mais'`, volta à tela anterior.

Comportamento das telas de escala:
- Cinco botões com os rótulos de `ESCALA_CONCORDANCIA`; ao tocar, grava e avança após 250ms.

Progresso:
- Exibe `Etapa N de T`, onde `T` é 4 com `INCLUIR_ADAPTADO` ligado e 3 com ele desligado.
- A barra enche em relação às telas **daquela etapa**, não do total.
- O número total de telas nunca aparece na interface.

- [ ] **Step 3: Implementar a persistência protegida**

Em `src/telas.js`, o acesso ao armazenamento é sempre por estas duas funções — nunca direto:

```js
const CHAVE = 'mapa-de-perfil-v1';

function salvarEstado(estado) {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    // Armazenamento bloqueado (aba privada, politica do navegador).
    // O teste continua: perde-se apenas a recuperacao apos recarregar.
  }
}

function lerEstado() {
  try {
    const bruto = sessionStorage.getItem(CHAVE);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}
```

Ao gerar o relatório, o estado é apagado com `try { sessionStorage.removeItem(CHAVE); } catch {}`.

- [ ] **Step 4: Implementar `src/app.js`**

```js
import { criarNavegacao } from './telas.js';

criarNavegacao(document.getElementById('app')).iniciar();
```

- [ ] **Step 5: Conferir no navegador**

Run: `npx --yes serve . -l 4173`

Percorrer o teste inteiro numa janela de 360x640 e confirmar, um a um:
- nenhuma tela de pergunta exige rolagem;
- o segundo toque da escolha forçada avança sozinho;
- a palavra marcada como "mais" não aceita ser marcada como "menos";
- o botão voltar no passo 2 retorna ao passo 1;
- o contador mostra "Etapa 1 de 4";
- recarregar a página no meio retoma na mesma tela;
- o console não registra nenhum erro.

Depois, com o armazenamento desligado (DevTools → Application → bloquear armazenamento, ou janela privada): percorrer 3 telas, recarregar e confirmar que a aplicação **reinicia sem travar**.

- [ ] **Step 6: Conferir a chave de redução**

Trocar `INCLUIR_ADAPTADO` para `false` em `src/dados.js`, recarregar e confirmar: 3 etapas no contador, ausência do bloco A2 e do respiro de virada, relatório íntegro e sem qualquer menção a tensão. Devolver a constante para `true`.

- [ ] **Step 7: Commit**

```bash
git add index.html src/telas.js src/app.js
git commit -m "feat: telas, navegacao e persistencia protegida"
```

---

### Task 13: Impressão, README e verificação final

**Files:**
- Create: `README.md`
- Modify: `estilos.css` (ajustes que a prévia de impressão revelar)

- [ ] **Step 1: Conferir a prévia de impressão**

Com o servidor rodando, preencher o teste até o relatório e abrir a prévia de impressão (Ctrl+P).
Expected: nenhum cartão cortado ao meio entre páginas; barra de progresso e botões ausentes; gráficos legíveis; fundo branco.

Corrigir em `estilos.css` o que estiver errado e conferir de novo.

- [ ] **Step 2: Escrever o `README.md`**

Conteúdo obrigatório, em português simples, endereçado a quem não programa:

- O que é o projeto, em duas frases.
- Que nenhum dado é gravado em servidor.
- **Como publicar:** criar repositório público chamado `mapa-de-perfil` na conta `LucianoCabralSF`, enviar os arquivos, e em Settings → Pages escolher branch `main` e pasta `/ (root)`. Link resultante: `https://lucianocabralsf.github.io/mapa-de-perfil/`.
- **Como encurtar o teste:** trocar `INCLUIR_ADAPTADO` para `false` na primeira linha útil de `src/dados.js`.
- **Como rodar os testes:** `npm test`.
- **Como abrir na própria máquina:** `npx serve .` e abrir o endereço mostrado — explicando que abrir o arquivo com duplo clique não funciona.

- [ ] **Step 3: Rodar a bateria completa**

Run: `npm test`
Expected: todos os testes passando, sem falha nem teste pulado.

- [ ] **Step 4: Commit**

```bash
git add README.md estilos.css
git commit -m "docs: readme de publicacao e ajustes de impressao"
```

---

## Ordem de execução

As tarefas 1 a 6 constroem o motor em sequência e cada uma depende da anterior. A 7 e a 8 dependem só dos nomes exportados pelo motor. A 9 depende da 7. A 10 depende de 6, 8 e 9. A 11 pode ser feita a qualquer momento depois da 9. A 12 depende de 7, 10 e 11. A 13 fecha.
