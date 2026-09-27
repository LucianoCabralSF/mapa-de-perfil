# Mapa de Perfil v3 — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o Mapa de Perfil num instrumento profissional de ~16 minutos — situações em vez de palavras, conflito e emoções como dimensões novas, nenhuma pergunta repetida — com um relatório em duas partes, uma para a pessoa e outra para quem a lidera.

**Architecture:** Mesma base da v2: módulos ES nativos, motor puro testado com `node --test`, telas que consomem o motor. Entram duas funções de pontuação no motor, uma biblioteca de textos para o líder em arquivo próprio, três gráficos e a montagem do relatório em três blocos (resumo, parte 1, parte 2).

**Tech Stack:** HTML + CSS + JavaScript (módulos ES). `node --test` (Node v24). Playwright (MCP) para verificação visual e PDF.

**Spec:** `docs/superpowers/specs/2026-09-26-mapa-de-perfil-v3-design.md` (e, no que ela não altera, `docs/superpowers/specs/2026-09-26-mapa-de-perfil-design.md`).

## Global Constraints

- Sem dependências de runtime, sem CDN, sem compilação, nada trafega para servidor.
- Paleta DEL/Lótus e tipografia da v2, sem mudança.
- **Linguagem neutra** em todo texto novo: nenhuma forma flexionada no masculino descrevendo a pessoa (régua `testes/apoio/linguagem.js`); na parte 2, **nunca** "ele", "ela", "dele", "dela", "o colaborador", "a colaboradora" para a pessoa — usar o nome.
- **Nenhum texto de pergunta se repete** entre telas de resposta (rótulo de contexto + título).
- Ordens canônicas de desempate: fatores `E, C, P, A`; motivadores `REA, AUT, SEG, REC, PRO, PER`; estilos `COL, NEG, COM, CED, EVI`; domínios `AUT, CTR, EMP, REL`.
- `BLOCOS_ADAPTADO = [1, 3, 5, 7, 9, 11]`.
- `INCLUIR_ADAPTADO` continua declarada só em `src/dados.js`.
- Chave de armazenamento `mapa-de-perfil-v3`.
- Nenhum item de instrumento comercial reproduzido (Thomas-Kilmann, testes de IE): itens próprios, teoria citada.
- Referência só é publicada depois de conferida em fonte externa.
- **Publicação só com "pode publicar" de Luciano**, depois da revisão da amostra de textos, e fora do horário de aula.

## Review Focus

1. **Nome com apóstrofo, acento ou HTML** (`D'Ávila`, `<b>`) no texto da parte 2, que usa `{nome}`: aparece escapado e legível. → Tarefa 7.
2. **Voltar numa tela de duas frases de emoção com uma já respondida**: a resposta fica marcada e a tela não avança sozinha só porque foi reaberta. → Tarefa 3.
3. **Celular pequeno (360 × 640) com situação longa**: o enunciado quebra em linhas e as opções continuam alcançáveis. → Tarefa 3 (verificação no navegador).
4. **Sessão v2 salva quando o site vira v3**: descartada, o teste recomeça sem erro. → Tarefa 3.
5. **Emoções equilibradas**: o plano de desenvolvimento continua com exatamente 3 ações. → Tarefa 7.

## Nota sobre conteúdo editorial

As Tarefas 2, 4 e 5 criam conteúdo de redação: 12 situações, 6 cenários, 15 enquadramentos, 16 frases de emoção e ~150 textos de relatório. O plano fixa, para cada conjunto, as chaves exatas, as regras de redação e um exemplo completo; os **testes** dessas tarefas são a régua que o conteúdo precisa passar (quantidade, tamanho, primeira pessoa, unicidade, linguagem neutra, cobertura). Escrever todo o texto no plano e depois copiá-lo para o código dobraria o trabalho sem acrescentar verificação.

---

## Estrutura de arquivos

| Arquivo | Mudança | Tarefa |
|---|---|---|
| `src/motor.js` | Conflito, emoções, `BLOCOS_ADAPTADO` novo, `calcularResultado` | 1 |
| `src/dados.js` | `SITUACOES` (substitui `BLOCOS`), `CENARIOS_CONFLITO`, `ENQUADRAMENTOS_PARES`, `FRASES_EMOCAO`, `ESCALA_FREQUENCIA`, `ordemExibicaoA2` | 2 |
| `src/telas.js`, `estilos.css` | Sequência de 49 telas, tipos de tela, rótulo de passo, sessão v3 | 3 |
| `src/textos.js` | Resumo e parte 1 | 4 |
| `src/textos-lider.js` | **Novo.** Parte 2 | 5 |
| `src/graficos.js` | `barrasConflito`, `barrasEmocoes`, `quadroConflito` | 6 |
| `src/relatorio.js`, `estilos.css` | Resumo, parte 1, parte 2, quebra de página | 7 |
| `metodo.html`, `facilitador.html` | Seções novas e referências | 8 |
| `README.md`, verificação, publicação | | 9 |
| `testes/*.test.js` | Atualizados e novos em cada tarefa | 1-8 |

---

### Task 1: Motor — conflito, emoções e comportamento com 12 situações

**Files:**
- Modify: `src/motor.js`
- Test: `testes/motor.test.js`

**Interfaces:**
- Produces:
  - `ESTILOS_CONFLITO = ['COL','NEG','COM','CED','EVI']`, `NOMES_ESTILO`.
  - `pontuarConflito(respostas: {mais,menos}[]) -> { brutos, pct, principal, secundario, assertividade, cooperacao }` (assertividade e cooperacao de 0 a 100).
  - `DOMINIOS_EMOCAO = ['AUT','CTR','EMP','REL']`, `NOMES_DOMINIO`, `MAPA_EMOCOES` (16 itens `{ dominio, invertida }`: domínio `DOMINIOS_EMOCAO[i % 4]`, invertida quando `i >= 12`).
  - `pontuarEmocoes(respostas: (1..5|null)[]) -> { porDominio: {COD:{media,pct}}, ranking: [{codigo,pct}], forte, desenvolver, equilibrado }` (`desenvolver` é `null` quando equilibrado).
  - `BLOCOS_ADAPTADO = [1, 3, 5, 7, 9, 11]`.
  - `calcularResultado(respostas)` passa a devolver também `conflito` e `emocoes`.

- [ ] **Step 1: Escrever os testes que falham**

Em `testes/motor.test.js`:
- trocar a asserção de `BLOCOS_ADAPTADO` para `[1, 3, 5, 7, 9, 11]`;
- em todo `a1` montado com `length: 10`, trocar para `length: 12`;
- no teste "a tensao compara o adaptado com os mesmos 6 blocos do natural", trocar `length: 10` por `length: 12`;
- acrescentar ao import `ESTILOS_CONFLITO, NOMES_ESTILO, pontuarConflito, DOMINIOS_EMOCAO, NOMES_DOMINIO, MAPA_EMOCOES, pontuarEmocoes`;
- acrescentar:

```js
test('doze respostas iguais levam o fator ao extremo', () => {
  const { pct } = pontuarComportamento(Array.from({ length: 12 }, () => ({ mais: 'A', menos: 'E' })));
  assert.equal(pct.A, 100);
  assert.equal(pct.E, 0);
  assert.equal(pct.C, 50);
});

test('estilos de conflito na ordem canonica e com nome', () => {
  assert.deepEqual(ESTILOS_CONFLITO, ['COL', 'NEG', 'COM', 'CED', 'EVI']);
  assert.deepEqual(Object.keys(NOMES_ESTILO).sort(), [...ESTILOS_CONFLITO].sort());
});

test('conflito: colaborar sempre leva ao canto de cima a direita', () => {
  const r = pontuarConflito(Array.from({ length: 6 }, () => ({ mais: 'COL', menos: 'EVI' })));
  assert.equal(r.pct.COL, 100);
  assert.equal(r.pct.EVI, 0);
  assert.equal(r.principal, 'COL');
  assert.equal(r.assertividade, 70);
  assert.equal(r.cooperacao, 70);
});

test('conflito: competir sempre fica assertivo e pouco cooperativo', () => {
  const r = pontuarConflito(Array.from({ length: 6 }, () => ({ mais: 'COM', menos: 'CED' })));
  assert.equal(r.principal, 'COM');
  assert.equal(r.assertividade, 70);
  assert.equal(r.cooperacao, 30);
});

test('conflito sem respostas fica no centro e desempata pela ordem canonica', () => {
  const r = pontuarConflito([]);
  assert.equal(r.assertividade, 50);
  assert.equal(r.cooperacao, 50);
  assert.equal(r.principal, 'COL');
  assert.equal(r.secundario, 'NEG');
});

test('conflito ignora estilo inexistente', () => {
  const r = pontuarConflito([{ mais: 'XYZ', menos: null }]);
  assert.ok(Object.values(r.brutos).every((b) => b === 0));
});

test('mapa de emocoes: 16 frases, 4 por dominio, uma invertida em cada', () => {
  assert.equal(MAPA_EMOCOES.length, 16);
  for (const d of DOMINIOS_EMOCAO) {
    const doDominio = MAPA_EMOCOES.filter((m) => m.dominio === d);
    assert.equal(doDominio.length, 4);
    assert.equal(doDominio.filter((m) => m.invertida).length, 1);
  }
  for (let i = 0; i < 16; i += 2) {
    assert.notEqual(MAPA_EMOCOES[i].dominio, MAPA_EMOCOES[i + 1].dominio, 'duas frases da mesma tela sao de dominios diferentes');
  }
  assert.deepEqual(Object.keys(NOMES_DOMINIO).sort(), [...DOMINIOS_EMOCAO].sort());
});

function emocoes(notaPorDominio) {
  return MAPA_EMOCOES.map((m) => {
    const nota = notaPorDominio[m.dominio];
    return m.invertida ? 6 - nota : nota;
  });
}

test('emocoes: item invertido conta ao contrario', () => {
  const r = pontuarEmocoes(emocoes({ AUT: 5, CTR: 5, EMP: 5, REL: 5 }));
  assert.ok(Object.values(r.porDominio).every((d) => d.pct === 100));
});

test('emocoes: dominio mais forte e dominio a desenvolver', () => {
  const r = pontuarEmocoes(emocoes({ AUT: 5, CTR: 3, EMP: 4, REL: 1 }));
  assert.equal(r.forte, 'AUT');
  assert.equal(r.desenvolver, 'REL');
  assert.equal(r.equilibrado, false);
  assert.deepEqual(r.ranking.map((x) => x.codigo), ['AUT', 'EMP', 'CTR', 'REL']);
});

test('emocoes: diferenca menor que 10 pontos e perfil equilibrado', () => {
  const r = pontuarEmocoes(emocoes({ AUT: 4, CTR: 4, EMP: 4, REL: 4 }));
  assert.equal(r.equilibrado, true);
  assert.equal(r.desenvolver, null);
  assert.equal(r.forte, 'AUT', 'empate cai na ordem canonica');
});

test('emocoes: dominio sem resposta fica no meio da escala', () => {
  const r = pontuarEmocoes([]);
  assert.ok(Object.values(r.porDominio).every((d) => d.media === 3 && d.pct === 50));
});

test('emocoes: nota fora da escala e ignorada', () => {
  const r = pontuarEmocoes(MAPA_EMOCOES.map(() => 9));
  assert.ok(Object.values(r.porDominio).every((d) => d.pct === 50));
});

test('resultado completo traz conflito e emocoes', () => {
  const r = calcularResultado({
    nome: 'Ana', contexto: '',
    a1: Array.from({ length: 12 }, () => ({ mais: 'E', menos: 'A' })),
    a2: null,
    conflito: Array.from({ length: 6 }, () => ({ mais: 'NEG', menos: 'COM' })),
    b: [], emocoes: emocoes({ AUT: 2, CTR: 5, EMP: 3, REL: 3 }), c: [1, 1, 5, 5, 5],
  });
  assert.equal(r.conflito.principal, 'NEG');
  assert.equal(r.emocoes.forte, 'CTR');
});

test('resultado sem conflito nem emocoes respondidos nao quebra', () => {
  const r = calcularResultado({ nome: 'Ana', contexto: '', a1: [], a2: null, b: [], c: [] });
  assert.equal(r.conflito.principal, 'COL');
  assert.equal(r.emocoes.equilibrado, true);
});
```

Conferência dos valores do quadro: com COL = 100, NEG = CED = COM = 50, EVI = 0, a soma dos `pct` é 250; assertividade = (1·100 + 0,5·50 + 1·50 + 0·50 + 0·0) / 250 = 0,70; cooperação = (1·100 + 0,5·50 + 0·50 + 1·50 + 0·0) / 250 = 0,70.

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA na importação (`pontuarConflito` não existe) e na asserção nova de `BLOCOS_ADAPTADO`.

- [ ] **Step 3: Implementar**

Em `src/motor.js`, trocar `BLOCOS_ADAPTADO` para `[1, 3, 5, 7, 9, 11]` e acrescentar, antes de `dataDeHoje`:

```js
export const ESTILOS_CONFLITO = ['COL', 'NEG', 'COM', 'CED', 'EVI'];

export const NOMES_ESTILO = {
  COL: 'Colaborar',
  NEG: 'Negociar',
  COM: 'Competir',
  CED: 'Ceder',
  EVI: 'Evitar',
};

// [assertividade, cooperacao] de cada estilo no modelo de Thomas e Kilmann.
const EIXOS_ESTILO = {
  COL: [1, 1], NEG: [0.5, 0.5], COM: [1, 0], CED: [0, 1], EVI: [0, 0],
};

export function pontuarConflito(respostas) {
  const brutos = zerados(ESTILOS_CONFLITO);
  for (const r of respostas) {
    if (ESTILOS_CONFLITO.includes(r?.mais)) brutos[r.mais] += 1;
    if (ESTILOS_CONFLITO.includes(r?.menos)) brutos[r.menos] -= 1;
  }
  const n = respostas.length;
  const pct = Object.fromEntries(
    ESTILOS_CONFLITO.map((e) => [e, n ? Math.round(((brutos[e] + n) / (2 * n)) * 100) : 50]),
  );
  const ordem = [...ESTILOS_CONFLITO].sort((a, b) => (brutos[b] - brutos[a])
    || (ESTILOS_CONFLITO.indexOf(a) - ESTILOS_CONFLITO.indexOf(b)));
  const soma = ESTILOS_CONFLITO.reduce((acc, e) => acc + pct[e], 0);
  const eixo = (i) => (soma
    ? Math.round((ESTILOS_CONFLITO.reduce((acc, e) => acc + EIXOS_ESTILO[e][i] * pct[e], 0) / soma) * 100)
    : 50);
  return {
    brutos, pct, principal: ordem[0], secundario: ordem[1],
    assertividade: eixo(0), cooperacao: eixo(1),
  };
}

export const DOMINIOS_EMOCAO = ['AUT', 'CTR', 'EMP', 'REL'];

export const NOMES_DOMINIO = {
  AUT: 'Autoconsciência',
  CTR: 'Autocontrole',
  EMP: 'Empatia',
  REL: 'Relacionamento',
};

// Frases intercaladas por dominio (duas por tela, de dominios diferentes);
// a ultima de cada dominio (indices 12 a 15) e invertida.
export const MAPA_EMOCOES = Array.from({ length: 16 }, (_, i) => ({
  dominio: DOMINIOS_EMOCAO[i % 4],
  invertida: i >= 12,
}));

const LIMIAR_EQUILIBRIO = 10;

export function pontuarEmocoes(respostas) {
  const soma = zerados(DOMINIOS_EMOCAO);
  const conta = zerados(DOMINIOS_EMOCAO);
  MAPA_EMOCOES.forEach(({ dominio, invertida }, i) => {
    const nota = respostas[i];
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) return;
    soma[dominio] += invertida ? 6 - nota : nota;
    conta[dominio] += 1;
  });
  const porDominio = Object.fromEntries(DOMINIOS_EMOCAO.map((d) => {
    const media = conta[d] ? soma[d] / conta[d] : 3;
    return [d, { media, pct: Math.round(((media - 1) / 4) * 100) }];
  }));
  const ranking = DOMINIOS_EMOCAO
    .map((codigo) => ({ codigo, pct: porDominio[codigo].pct }))
    .sort((x, y) => (y.pct - x.pct) || (DOMINIOS_EMOCAO.indexOf(x.codigo) - DOMINIOS_EMOCAO.indexOf(y.codigo)));
  const equilibrado = ranking[0].pct - ranking[ranking.length - 1].pct < LIMIAR_EQUILIBRIO;
  return {
    porDominio,
    ranking,
    forte: ranking[0].codigo,
    desenvolver: equilibrado ? null : ranking[ranking.length - 1].codigo,
    equilibrado,
  };
}
```

Em `calcularResultado`, depois de `motivacoes`:
```js
  const conflito = pontuarConflito(respostas.conflito ?? []);
  const emocoes = pontuarEmocoes(respostas.emocoes ?? []);
```
e incluir `conflito` e `emocoes` no objeto devolvido, depois de `motivacoes`.

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: todos os testes de `motor.test.js` passando. Testes de `dados`, `telas` e `relatorio` que dependem de `BLOCOS` com 10 blocos podem falhar agora — são atualizados nas Tarefas 2, 3 e 7. Anotar no ledger quais estão vermelhos por esse motivo.

- [ ] **Step 5: Commit**

```bash
git add src/motor.js testes/motor.test.js
git commit -m "feat: pontuacao de conflito e emocoes; comportamento com 12 situacoes"
```

---

### Task 2: Dados — situações, cenários, enquadramentos e frases de emoção

**Files:**
- Modify: `src/dados.js`
- Test: `testes/dados.test.js`, `testes/linguagem.test.js`

**Interfaces:**
- Consumes: `FATORES`, `ESTILOS_CONFLITO`, `MAPA_EMOCOES`, `BLOCOS_ADAPTADO`, `PARES_MOTIVACAO` de `src/motor.js`.
- Produces:
  - `SITUACOES`: 12 × `{ enunciado, opcoes: [{ fator, texto }] × 4 }` (opções na ordem `E, C, P, A`). **Substitui `BLOCOS`.**
  - `CENARIOS_CONFLITO`: 6 × `{ enunciado, opcoes: [{ estilo, texto }] × 5 }` (ordem `COL, NEG, COM, CED, EVI`).
  - `ENQUADRAMENTOS_PARES`: 15 strings, alinhadas a `PARES_MOTIVACAO`.
  - `FRASES_EMOCAO`: 16 strings, alinhadas a `MAPA_EMOCOES`.
  - `ESCALA_FREQUENCIA`: 5 × `{ valor, rotulo }` — Quase nunca, Raramente, Às vezes, Com frequência, Quase sempre.
  - `ANCORA_A1 = 'Pense em como você costuma agir, na maior parte do tempo.'`; `ANCORA_A2 = 'Agora, no seu trabalho de hoje'`.
  - `ordemExibicaoA2()` devolve 6 itens `{ posicao, indiceCanonico, opcoes }` sobre `SITUACOES`.

**Regras de redação (valem para os testes):**
- Enunciado de situação ou cenário: 60 a 160 caracteres, termina em ponto final.
- Opção (reação): 25 a 90 caracteres, primeira pessoa, começa por verbo, termina em ponto final.
- Enquadramento de par: 30 a 80 caracteres, termina em `:` ou `…`.
- Frase de emoção: 40 a 110 caracteres, primeira pessoa, com referência de tempo.
- Nenhum texto repetido dentro de cada conjunto; linguagem neutra.
- As 4 (ou 5) opções de uma tela precisam soar igualmente aceitáveis.
- **Situações** cobrem: reunião, prazo, cliente, equipe nova, erro, mudança, pressão da chefia, colega com dificuldade, decisão sem dados, rotina, prioridades em conflito, reconhecimento. As de índice `1, 3, 5, 7, 9, 11` precisam fazer sentido pensadas "no trabalho de hoje".
- **Cenários de conflito** variam o outro lado: colega de mesmo nível, chefia, pessoa da equipe, cliente, outra área, grupo em reunião.
- **Frases de emoção:** índices 0-11 diretas; 12-15 invertidas (descrevem o oposto do domínio). Domínio do índice `i` = `DOMINIOS_EMOCAO[i % 4]`.

**Exemplos completos:**

```js
// SITUACOES[0]
{
  enunciado: 'Um cliente liga irritado cobrando um prazo que você não prometeu.',
  opcoes: [
    { fator: 'E', texto: 'Assumo a conversa e proponho uma data na mesma ligação.' },
    { fator: 'C', texto: 'Acalmo a pessoa, crio empatia e reconstruo a relação.' },
    { fator: 'P', texto: 'Escuto até o fim com paciência e retorno depois com calma.' },
    { fator: 'A', texto: 'Verifico o que foi combinado antes de responder qualquer coisa.' },
  ],
}

// CENARIOS_CONFLITO[0]
{
  enunciado: 'Numa reunião, um colega do mesmo nível discorda da sua proposta na frente de todos.',
  opcoes: [
    { estilo: 'COL', texto: 'Proponho entendermos juntos o que cada proposta resolve.' },
    { estilo: 'NEG', texto: 'Sugiro juntar uma parte de cada ideia para seguirmos.' },
    { estilo: 'COM', texto: 'Defendo meus argumentos até ficar clara a melhor saída.' },
    { estilo: 'CED', texto: 'Aceito a ideia do colega para não travar a reunião.' },
    { estilo: 'EVI', texto: 'Deixo o assunto para depois, fora da frente do grupo.' },
  ],
}

// ENQUADRAMENTOS_PARES[0] (par REA × PER)
'Numa proposta de trabalho, pesa mais para você…'

// FRASES_EMOCAO[0] (AUT, direta) e [12] (AUT, invertida)
'Nas últimas semanas, percebi minha irritação antes de reagir a ela.'
'Nos últimos tempos, só entendi o que eu sentia depois que a situação passou.'
```

As 30 frases de `FRASES_MOTIVACAO` continuam; revisar cada uma para que complete com naturalidade o enquadramento do par em que aparece (a k-ésima aparição do motivador usa a k-ésima frase).

- [ ] **Step 1: Escrever os testes que falham**

Em `testes/dados.test.js`: remover os testes de `BLOCOS` ("existem 10 blocos…", "nenhuma palavra se repete…") e os imports de `BLOCOS`; trocar o teste de `ordemExibicaoA2` e acrescentar:

```js
import { ESTILOS_CONFLITO, MAPA_EMOCOES, BLOCOS_ADAPTADO } from '../src/motor.js';
import {
  SITUACOES, CENARIOS_CONFLITO, ENQUADRAMENTOS_PARES, FRASES_EMOCAO, ESCALA_FREQUENCIA,
} from '../src/dados.js';

const COMECA_POR_VERBO = /^(Me |Te |Se |Nos )?[A-ZÀ-Ú][a-zà-úç]*(o|ou|ei|i)\b/;

function entre(texto, min, max) {
  return texto.length >= min && texto.length <= max;
}

test('12 situacoes, cada uma com 4 reacoes na ordem canonica', () => {
  assert.equal(SITUACOES.length, 12);
  for (const [i, s] of SITUACOES.entries()) {
    assert.ok(entre(s.enunciado, 60, 160) && s.enunciado.endsWith('.'), `enunciado ${i}: ${s.enunciado.length}`);
    assert.deepEqual(s.opcoes.map((o) => o.fator), FATORES, `situacao ${i}`);
    for (const o of s.opcoes) {
      assert.ok(entre(o.texto, 25, 90) && o.texto.endsWith('.'), `reacao longa ou curta: ${o.texto}`);
      assert.match(o.texto, COMECA_POR_VERBO, `reacao nao comeca por verbo na 1a pessoa: ${o.texto}`);
    }
  }
});

test('6 cenarios de conflito, cada um com 5 reacoes na ordem canonica', () => {
  assert.equal(CENARIOS_CONFLITO.length, 6);
  for (const [i, c] of CENARIOS_CONFLITO.entries()) {
    assert.ok(entre(c.enunciado, 60, 160) && c.enunciado.endsWith('.'), `cenario ${i}`);
    assert.deepEqual(c.opcoes.map((o) => o.estilo), ESTILOS_CONFLITO, `cenario ${i}`);
    for (const o of c.opcoes) {
      assert.ok(entre(o.texto, 25, 90) && o.texto.endsWith('.'), `reacao: ${o.texto}`);
      assert.match(o.texto, COMECA_POR_VERBO, `reacao: ${o.texto}`);
    }
  }
});

test('15 enquadramentos de par, distintos', () => {
  assert.equal(ENQUADRAMENTOS_PARES.length, 15);
  assert.equal(new Set(ENQUADRAMENTOS_PARES).size, 15);
  for (const e of ENQUADRAMENTOS_PARES) {
    assert.ok(entre(e, 30, 80) && (e.endsWith(':') || e.endsWith('…')), `enquadramento: ${e}`);
  }
});

test('16 frases de emocao alinhadas ao mapa', () => {
  assert.equal(FRASES_EMOCAO.length, MAPA_EMOCOES.length);
  assert.equal(new Set(FRASES_EMOCAO).size, 16);
  for (const f of FRASES_EMOCAO) assert.ok(entre(f, 40, 110), `frase de emocao: ${f}`);
});

test('escala de frequencia com 5 pontos', () => {
  assert.deepEqual(ESCALA_FREQUENCIA.map((p) => p.valor), [1, 2, 3, 4, 5]);
  assert.equal(ESCALA_FREQUENCIA[0].rotulo, 'Quase nunca');
  assert.equal(ESCALA_FREQUENCIA[4].rotulo, 'Quase sempre');
});

test('nenhum texto se repete entre situacoes e cenarios', () => {
  const todos = [
    ...SITUACOES.flatMap((s) => [s.enunciado, ...s.opcoes.map((o) => o.texto)]),
    ...CENARIOS_CONFLITO.flatMap((c) => [c.enunciado, ...c.opcoes.map((o) => o.texto)]),
  ];
  assert.equal(new Set(todos).size, todos.length);
});

test('a ordem de exibicao do A2 cobre as 6 situacoes, invertida', () => {
  const ordem = ordemExibicaoA2();
  assert.deepEqual(ordem.map((p) => p.indiceCanonico), [...BLOCOS_ADAPTADO].reverse());
  assert.deepEqual(ordem.map((p) => p.posicao), [5, 4, 3, 2, 1, 0]);
  assert.deepEqual(ordem[0].opcoes.map((o) => o.fator), ['A', 'P', 'C', 'E']);
});
```

Em `testes/linguagem.test.js`, trocar o teste "as palavras dos blocos sao neutras" por:

```js
import {
  SITUACOES, CENARIOS_CONFLITO, ENQUADRAMENTOS_PARES, FRASES_EMOCAO, PERGUNTAS_MOMENTO, FRASES_MOTIVACAO,
} from '../src/dados.js';

test('situacoes, cenarios, enquadramentos e frases sao neutros', () => {
  const todos = [
    ...SITUACOES.flatMap((s) => [s.enunciado, ...s.opcoes.map((o) => o.texto)]),
    ...CENARIOS_CONFLITO.flatMap((c) => [c.enunciado, ...c.opcoes.map((o) => o.texto)]),
    ...ENQUADRAMENTOS_PARES, ...FRASES_EMOCAO, ...Object.values(FRASES_MOTIVACAO).flat(),
  ];
  for (const texto of todos) assert.deepEqual(textoFlexionado(texto), [], `texto no masculino: ${texto}`);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA na importação de `SITUACOES`.

- [ ] **Step 3: Escrever os dados**

Em `src/dados.js`: remover `BLOCOS`; criar `SITUACOES`, `CENARIOS_CONFLITO`, `ENQUADRAMENTOS_PARES`, `FRASES_EMOCAO`, `ESCALA_FREQUENCIA` e as novas âncoras seguindo as regras e exemplos acima; atualizar `ordemExibicaoA2`:

```js
export function ordemExibicaoA2() {
  return BLOCOS_ADAPTADO
    .map((indiceCanonico, posicao) => ({
      posicao,
      indiceCanonico,
      opcoes: [...SITUACOES[indiceCanonico].opcoes].reverse(),
    }))
    .reverse();
}
```

Atualizar o comentário de `INCLUIR_ADAPTADO`: "Desligado: o teste cai de 49 para 43 telas e o relatorio omite a secao Natural x Adaptado."

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: `dados.test.js` e `linguagem.test.js` passando. Se a régua de linguagem reprovar um texto, reescrevê-lo — nunca afrouxar a régua.

- [ ] **Step 5: Commit**

```bash
git add src/dados.js testes/dados.test.js testes/linguagem.test.js
git commit -m "feat: situacoes, cenarios de conflito, enquadramentos e frases de emocao"
```

---

### Task 3: Telas — 49 telas, rótulo de passo, sessão v3

**Files:**
- Modify: `src/telas.js`, `estilos.css`
- Test: `testes/telas.test.js`

**Interfaces:**
- Consumes: tudo da Tarefa 2; `pontuarConflito`, `MAPA_EMOCOES`, `ESTILOS_CONFLITO` da Tarefa 1.
- Produces:
  - `CHAVE = 'mapa-de-perfil-v3'`.
  - Descritores de tela:
    - `{ tipo: 'forcada', campo: 'a1'|'a2'|'conflito', indiceResposta, contexto, titulo, opcoes: [{codigo, texto}], rotuloMais, rotuloMenos, etapa, etapas }`
    - `{ tipo: 'par', campo: 'b', indice, titulo, esquerda, direita, etapa, etapas }`
    - `{ tipo: 'multipla', itens: [{ campo, indice, texto }], escala, etapa, etapas }` (emoções e momento)
    - `{ tipo: 'respiro', texto, detalhe, tempo }`
  - `textoPergunta(tela) -> string` exportada (junção de `contexto` e `titulo`; nas telas `multipla`, os textos dos itens).
  - `respostas` com os campos `conflito` (6) e `emocoes` (16), além dos da v2; `a1` com 12.
  - `sessaoValida` confere também `conflito` e `emocoes`.

- [ ] **Step 1: Escrever os testes que falham**

Em `testes/telas.test.js`:
- import de `textoPergunta`;
- teste de contagem trocado por:

```js
test('a sequencia tem 49 telas de resposta com o adaptado ligado', () => {
  const telas = montarSequencia();
  const conta = (f) => telas.filter(f).length;
  assert.equal(conta((t) => t.tipo === 'forcada' && t.campo === 'a1'), 12);
  assert.equal(conta((t) => t.tipo === 'forcada' && t.campo === 'a2'), 6);
  assert.equal(conta((t) => t.tipo === 'forcada' && t.campo === 'conflito'), 6);
  assert.equal(conta((t) => t.tipo === 'par'), 15);
  assert.equal(conta((t) => t.tipo === 'multipla' && t.itens[0].campo === 'emocoes'), 8);
  assert.equal(conta((t) => t.tipo === 'multipla' && t.itens[0].campo === 'c'), 2);
  assert.equal(conta((t) => ['forcada', 'par', 'multipla'].includes(t.tipo)), 49);
});

test('nenhuma tela de resposta repete o texto de pergunta de outra', () => {
  const textos = montarSequencia().filter((t) => t.tipo !== 'respiro' && textoPergunta(t)).map(textoPergunta);
  assert.equal(new Set(textos).size, textos.length);
});

test('telas de emocao juntam duas frases de dominios diferentes', () => {
  const telas = montarSequencia().filter((t) => t.tipo === 'multipla' && t.itens[0].campo === 'emocoes');
  for (const t of telas) assert.equal(t.itens.length, 2);
});

test('toda tela de resposta aponta para uma posicao valida', () => {
  const limites = { a1: 12, a2: 6, conflito: 6, b: 15, emocoes: 16, c: 5 };
  for (const t of montarSequencia()) {
    if (t.tipo === 'forcada') assert.ok(t.indiceResposta >= 0 && t.indiceResposta < limites[t.campo]);
    if (t.tipo === 'par') assert.ok(t.indice < 15);
    if (t.tipo === 'multipla') for (const i of t.itens) assert.ok(i.indice < limites[i.campo]);
  }
});

test('a chave de armazenamento e a da versao 3', () => {
  assert.equal(CHAVE, 'mapa-de-perfil-v3');
});
```

- `sessaoDeExemplo` passa a montar `a1` com 12, `conflito` com 6 `{mais:null,menos:null}` e `emocoes` com 16 `null`; acrescentar aos casos inválidos:

```js
    'conflito com estilo estranho': { conflito: Array.from({ length: 6 }, () => ({ mais: 'E', menos: null })) },
    'emocoes curtas': { emocoes: [3, 3] },
    'emocoes fora da escala': { emocoes: Array.from({ length: 16 }, () => 8) },
    'sessao da v2 sem conflito': { conflito: undefined },
```

- Review Focus 2:

```js
test('reabrir uma tela de duas frases com uma respondida nao avanca sozinho', async () => {
  const { criarNavegacao } = await import('../src/telas.js');
  const guardado = new Map();
  globalThis.sessionStorage = {
    getItem: (k) => (guardado.has(k) ? guardado.get(k) : null),
    setItem: (k, v) => { guardado.set(k, String(v)); },
    removeItem: (k) => { guardado.delete(k); },
  };
  globalThis.window = { scrollTo() {} };
  const telas = montarSequencia();
  const pos = telas.findIndex((t) => t.tipo === 'multipla' && t.itens[0].campo === 'emocoes');
  const sessao = sessaoDeExemplo({ posicao: pos });
  sessao.respostas.emocoes[telas[pos].itens[0].indice] = 4;
  guardado.set(CHAVE, JSON.stringify(sessao));
  const raiz = { innerHTML: '', addEventListener() {}, querySelector: () => null };
  criarNavegacao(raiz).iniciar();
  await new Promise((ok) => setTimeout(ok, 400));
  assert.equal(JSON.parse(guardado.get(CHAVE)).posicao, pos, 'continua na mesma tela');
  assert.match(raiz.innerHTML, /data-valor="4"[^>]*aria-pressed="true"|aria-pressed="true"[^>]*data-valor="4"/);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA em `textoPergunta` inexistente e nas contagens.

- [ ] **Step 3: Implementar a sequência**

Em `src/telas.js`, `montarSequencia` passa a montar, na ordem da spec 2:

```js
const RESPIROS = {
  a1: { texto: 'Etapa 1: como você age.', detalhe: 'Doze situações de trabalho. Em cada uma, marque a reação que mais combina com você e a que menos combina.', tempo: 'Cerca de 16 minutos no total.' },
  a2: { texto: 'Etapa 2: no seu trabalho de hoje.', detalhe: 'Seis daquelas situações voltam, de propósito. Agora, responda pensando no que o seu trabalho exige de você hoje.', tempo: 'Faltam cerca de 11 minutos.' },
  conflito: { texto: 'Etapa 3: diante de conflito.', detalhe: 'Seis situações de desacordo. Marque a reação mais provável e a menos provável para você.', tempo: 'Faltam cerca de 9 minutos.' },
  b: { texto: 'Etapa 4: o que te move.', detalhe: 'Pares de frases. Em cada um, toque no que pesa mais para você.', tempo: 'Faltam cerca de 6 minutos.' },
  emocoes: { texto: 'Etapa 5: como você lida com emoções.', detalhe: 'Frases sobre as últimas semanas. Diga com que frequência cada uma aconteceu.', tempo: 'Faltam cerca de 4 minutos.' },
  c: { texto: 'Última etapa: seu momento.', detalhe: 'Cinco perguntas sobre a fase de vida. Elas dizem com quanta cautela ler o resultado.', tempo: 'Falta cerca de 1 minuto.' },
};

const PASSO_COMPORTAMENTO = { rotuloMais: 'A que mais combina com você', rotuloMenos: 'A que menos combina com você' };
const PASSO_CONFLITO = { rotuloMais: 'A reação mais provável', rotuloMenos: 'A reação menos provável' };
```

- Etapa 1: para cada `SITUACOES[i]`: `{ tipo: 'forcada', campo: 'a1', indiceResposta: i, contexto: '', titulo: s.enunciado, opcoes: s.opcoes.map((o) => ({ codigo: o.fator, texto: o.texto })), ...PASSO_COMPORTAMENTO }`.
- Etapa 2 (se `INCLUIR_ADAPTADO`): para cada item de `ordemExibicaoA2()`: `contexto: ANCORA_A2`, `titulo: SITUACOES[item.indiceCanonico].enunciado`, `indiceResposta: item.posicao`, opções de `item.opcoes`.
- Etapa 3: `CENARIOS_CONFLITO[i]` com `campo: 'conflito'`, `contexto: ''`, `opcoes` com `codigo: o.estilo`, `...PASSO_CONFLITO`.
- Etapa 4: `montarPares()` com `titulo: ENQUADRAMENTOS_PARES[indice]`.
- Etapa 5: `for (let i = 0; i < 16; i += 2)` → `{ tipo: 'multipla', itens: [i, i + 1].map((k) => ({ campo: 'emocoes', indice: k, texto: FRASES_EMOCAO[k] })), escala: ESCALA_FREQUENCIA }`.
- Etapa 6: duas telas `multipla` com `PERGUNTAS_MOMENTO` índices `[0, 1, 2]` e `[3, 4]`, `escala: ESCALA_CONCORDANCIA`.
- Um respiro de `RESPIROS[campo]` antes de cada etapa; `etapas` = 6 com o adaptado ligado, 5 desligado.

```js
export function textoPergunta(tela) {
  if (tela.tipo === 'multipla') return tela.itens.map((i) => i.texto).join(' | ');
  return [tela.contexto, tela.titulo].filter(Boolean).join(' · ');
}
```

- [ ] **Step 4: Implementar as telas**

- `telaForcada(tela)`:

```js
  function telaForcada(tela) {
    const resposta = respostas[tela.campo][tela.indiceResposta];
    const passo2 = passo === 'menos';
    const rotulo = passo2 ? `PASSO 2 DE 2 · ${tela.rotuloMenos}` : `PASSO 1 DE 2 · ${tela.rotuloMais}`;
    const opcoes = tela.opcoes.map((o) => {
      const marcada = passo2 && resposta.mais === o.codigo;
      return `<button type="button" class="${marcada ? 'opcao marcada bloqueada' : 'opcao'}" `
        + `data-acao="forcada" data-codigo="${o.codigo}">${escaparHtml(o.texto)}</button>`;
    }).join('');
    return '<div class="tela">'
      + progresso(tela)
      + (tela.contexto ? `<p class="contexto-tela">${escaparHtml(tela.contexto)}</p>` : '')
      + `<p class="enunciado">${escaparHtml(tela.titulo)}</p>`
      + `<p class="rotulo-passo">${escaparHtml(rotulo.toUpperCase())}</p>`
      + `<div class="opcoes">${opcoes}</div>`
      + botaoVoltar()
      + '</div>';
  }
```

- `telaPar`: título `tela.titulo` em `.enunciado`, rótulo `ESCOLHA UMA`, sem o "Escolha uma das duas."
- `telaMultipla(tela)`: para cada item, `<p class="frase-item">` com o texto e uma linha de botões da escala `<button class="escala-item" data-acao="multipla" data-campo data-indice data-valor aria-pressed>`; a tela avança (após `ATRASO_AVANCO`) **só quando um toque completa todos os itens** — reabrir uma tela não dispara avanço.
- `responderForcada(codigo)` usa `data-codigo`; `marcarEsperando` passa a usar `data-codigo` por padrão.
- `estadoInicial`: `a1: SITUACOES.map(vazio)`, `conflito: CENARIOS_CONFLITO.map(vazio)`, `emocoes: MAPA_EMOCOES.map(() => null)`.
- `sessaoValida`: `a1` com `SITUACOES.length`; `conflito` com 6 itens cujo `mais`/`menos` seja nulo ou de `ESTILOS_CONFLITO`; `emocoes` com 16 itens nulos ou inteiros de 1 a 5.
- `CHAVE = 'mapa-de-perfil-v3'`.
- Abertura: "São cerca de 16 minutos."

Em `estilos.css`:

```css
.contexto-tela { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--bronze); margin: 4px 0 6px; }
.enunciado { font-size: 19px; line-height: 1.4; font-weight: 700; color: var(--navy); margin: 0 0 16px; }
.rotulo-passo { font-size: 12px; letter-spacing: 1.5px; color: var(--bronze); margin: 0 0 10px; }
.frase-item { font-size: 16px; line-height: 1.45; color: var(--ink); margin: 14px 0 8px; }
.escala-linha { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 8px; }
.escala-linha .escala-item { min-height: 48px; font-size: 12px; padding: 4px; }
.opcao { text-align: left; line-height: 1.35; }
```

A antiga `.ancora` (quadro azul) continua disponível para os respiros; nas telas de pergunta o título grande é o `.enunciado`.

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `npm test`
Expected: `telas.test.js` passando.

- [ ] **Step 6: Conferir no navegador**

`npx --yes serve . -l 4173`, Playwright:
- em 390 × 844: percorrer tudo — 49 telas de resposta, rótulo de passo muda do passo 1 para o 2, o toque que completa a tela de emoções avança sozinho, zero erro no console;
- **Review Focus 3:** em 360 × 640, abrir a situação de enunciado mais longo: o texto quebra, as 4 opções e o "voltar" ficam alcançáveis (rolagem vertical é aceitável aqui; horizontal nunca);
- **Review Focus 4:** gravar uma sessão no formato v2 em `mapa-de-perfil-v2` e outra inválida em `mapa-de-perfil-v3`, recarregar: abre na abertura, sem erro.

- [ ] **Step 7: Commit**

```bash
git add src/telas.js estilos.css testes/telas.test.js
git commit -m "feat: 49 telas sem pergunta repetida, rotulo de passo e sessao v3"
```

---

### Task 4: Textos — resumo e parte 1

**Files:**
- Modify: `src/textos.js`
- Test: `testes/textos.test.js`

**Interfaces:**
- Produces (todas as chaves abaixo, em `src/textos.js`):
  - `RETRATOS`: chaves `E, C, P, A` (sem apoio) e `EC, EP, EA, CE, CP, CA, PE, PC, PA, AE, AC, AP` (dominante + apoio) — 16. Uso: `RETRATOS[apoio ? dominante + apoio : dominante]`.
  - `SINTESE`: `E, C, P, A` (uma frase de até 140 caracteres, para o resumo).
  - `FORTES`, `ATENCAO`: como na v2.
  - `CONFLITO_VOCE`: `COL, NEG, COM, CED, EVI` → `{ rende, custa }`.
  - `EMOCAO_FORTE`, `EMOCAO_DESENVOLVER`: `AUT, CTR, EMP, REL`. `EMOCAO_EQUILIBRADO`: string. `EMOCAO_LEITURA`: a leitura honesta (percepção de si, ordem entre áreas).
  - `ACAO_FATOR` (`E, C, P, A`), `ACAO_EMOCAO` (`AUT, CTR, EMP, REL`), `ACAO_CONFLITO` (5 estilos): cada ação com 60 a 200 caracteres, começando por verbo no imperativo ("Escolha…", "Anote…").
  - Mantidos da v2: `TEXTO_TENSAO`, `FATOR_FORCADO`, `FATOR_CONTIDO`, `TEXTO_ALINHADO`, `TEXTO_MOMENTO`, `MOTIVADOR_ALTO`, `MOTIVADOR_BAIXO`, `ALERTA_REFORCADO`, `FECHAMENTO_RESSALVA`, `RODAPE_LEGAL`.
  - `COMUNICACAO` e `AMBIENTE` saem deste arquivo (vão para a parte 2, Tarefa 5).

**Regras:** segunda pessoa; retratos de 70 a 120 palavras e **distintos entre si** (o retrato `EA` não pode ser o `E` com uma frase a mais: ao menos metade do texto precisa tratar da combinação); demais textos de 15 a 60 palavras; `FECHAMENTO_RESSALVA` ganha uma frase dizendo que a parte emocional mede a percepção de si.

**Exemplo** (`RETRATOS.EA`): "Você decide rápido, mas não no escuro. Antes de puxar a frente, quer saber se os números fecham — e costuma ser a pessoa que chega à reunião já com a proposta e a conta feita. A pressa e o critério convivem em você: o resultado importa, e ele precisa ser bem feito. Quando o time improvisa demais, você se incomoda tanto com a lentidão quanto com o descuido. Sob pressão, pode endurecer o tom e cobrar precisão de quem ainda está entendendo o problema."

- [ ] **Step 1: Escrever os testes que falham**

Em `testes/textos.test.js`, substituir o teste de retratos e acrescentar:

```js
import {
  RETRATOS, SINTESE, CONFLITO_VOCE, EMOCAO_FORTE, EMOCAO_DESENVOLVER, EMOCAO_EQUILIBRADO,
  EMOCAO_LEITURA, ACAO_FATOR, ACAO_EMOCAO, ACAO_CONFLITO,
} from '../src/textos.js';
import { ESTILOS_CONFLITO, DOMINIOS_EMOCAO } from '../src/motor.js';

const COMBINACOES = ['E', 'C', 'P', 'A', 'EC', 'EP', 'EA', 'CE', 'CP', 'CA', 'PE', 'PC', 'PA', 'AE', 'AC', 'AP'];
const palavras = (t) => t.trim().split(/\s+/).length;

test('ha um retrato para cada combinacao de dominante e apoio', () => {
  assert.deepEqual(Object.keys(RETRATOS).sort(), [...COMBINACOES].sort());
  for (const k of COMBINACOES) {
    assert.ok(palavras(RETRATOS[k]) >= 70 && palavras(RETRATOS[k]) <= 120, `retrato ${k}: ${palavras(RETRATOS[k])} palavras`);
  }
});

test('retratos de combinacao nao sao o retrato puro com um acrescimo', () => {
  for (const k of COMBINACOES.filter((c) => c.length === 2)) {
    const puro = new Set(RETRATOS[k[0]].split(/[.!?]\s+/));
    const frases = RETRATOS[k].split(/[.!?]\s+/);
    const repetidas = frases.filter((f) => puro.has(f)).length;
    assert.ok(repetidas <= frases.length / 2, `retrato ${k} repete demais o ${k[0]}`);
  }
});

test('sintese, conflito, emocoes e acoes cobrem todas as chaves', () => {
  for (const f of FATORES) {
    assert.ok(SINTESE[f] && SINTESE[f].length <= 140, `sintese ${f}`);
    assert.ok(ACAO_FATOR[f], `acao ${f}`);
  }
  for (const e of ESTILOS_CONFLITO) {
    assert.ok(CONFLITO_VOCE[e]?.rende && CONFLITO_VOCE[e]?.custa, `conflito ${e}`);
    assert.ok(ACAO_CONFLITO[e], `acao conflito ${e}`);
  }
  for (const d of DOMINIOS_EMOCAO) {
    assert.ok(EMOCAO_FORTE[d] && EMOCAO_DESENVOLVER[d] && ACAO_EMOCAO[d], `emocao ${d}`);
  }
  assert.ok(EMOCAO_EQUILIBRADO && EMOCAO_LEITURA.includes('percep'));
});

test('acoes do plano sao praticas e comecam por verbo no imperativo', () => {
  const acoes = [...Object.values(ACAO_FATOR), ...Object.values(ACAO_EMOCAO), ...Object.values(ACAO_CONFLITO)];
  for (const a of acoes) {
    assert.ok(a.length >= 60 && a.length <= 200, `acao: ${a}`);
    assert.match(a, /^[A-ZÀ-Ú][a-zà-ú]+(e|a|ue|ça|ha)\b/, `acao sem imperativo: ${a}`);
  }
});

test('a ressalva final fala da percepcao de si', () => {
  assert.match(FECHAMENTO_RESSALVA, /percep/);
});
```

O teste existente "os textos do relatorio sao neutros" (em `linguagem.test.js`) já cobre os novos textos, porque percorre todas as exportações de `src/textos.js`.

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA nas importações novas.

- [ ] **Step 3: Escrever os textos**

Seguindo as regras e o exemplo. Remover `COMUNICACAO` e `AMBIENTE` de `src/textos.js` (a Tarefa 5 os recria para o líder) e ajustar os testes de `textos.test.js` que os citavam.

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: `textos.test.js` e `linguagem.test.js` passando. `relatorio.test.js` pode estar vermelho até a Tarefa 7 — anotar no ledger.

- [ ] **Step 5: Commit**

```bash
git add src/textos.js testes/textos.test.js
git commit -m "feat: 16 retratos, conflito, emocoes e plano de desenvolvimento"
```

---

### Task 5: Textos — parte 2, para quem lidera

**Files:**
- Create: `src/textos-lider.js`
- Create: `testes/textos-lider.test.js`

**Interfaces:**
- Produces, em `src/textos-lider.js` (todo texto que cita a pessoa usa `{nome}`):
  - `LIDER_FRASE` (`E, C, P, A`) e `LIDER_APOIO` (`E, C, P, A`: complemento de uma frase pelo apoio).
  - `LIDER_COMUNICAR` (`E, C, P, A`) → `{ fazer: string[3], evitar: string[3] }`.
  - `LIDER_RETORNO` (6 motivadores).
  - `LIDER_DELEGAR` (`E, C, P, A`).
  - `LIDER_CONFLITO` (5 estilos) → `{ esperar, conduzir }`.
  - `LIDER_DESGASTE` (`E, C, P, A`), `LIDER_DESGASTE_TENSAO`, `LIDER_DESGASTE_MOMENTO`.
  - `LIDER_EVITAR` (6 motivadores).
  - `PERGUNTA_MOTIVADOR` (6), `PERGUNTA_TENSAO` (`baixa, moderada, alta`), `PERGUNTA_MOMENTO` (`estavel, movimento, turbulento`), `PERGUNTA_CONFLITO` (5), `PERGUNTA_FATOR` (4) — todas terminando em `?`.
  - `COMO_USAR`: string.
  - `comNome(texto, nomeEscapado) -> string` — troca todo `{nome}` pelo nome já escapado.

**Regras:** fala com o líder na segunda pessoa ("Com {nome}, funciona…"); a pessoa sempre pelo `{nome}`, nunca por pronome de gênero; 15 a 60 palavras por texto (itens de "fazer/evitar" de 6 a 25 palavras); perguntas de conversa individual abertas, na segunda pessoa dirigida à pessoa ("O que tem te dado mais energia no trabalho?"); `COMO_USAR` diz que o relatório é ponto de partida para conversa, não avalia desempenho nem decide contratação, promoção ou desligamento, e que a pessoa leu tudo e escolheu compartilhar.

**Exemplo** (`LIDER_FRASE.E`): "{nome} rende mais com meta clara, prazo definido e liberdade para escolher o caminho. Diga aonde quer chegar e saia da frente — acompanhe pelo resultado, não pelo passo a passo."

- [ ] **Step 1: Escrever os testes que falham**

`testes/textos-lider.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import * as LIDER from '../src/textos-lider.js';
import { FATORES, MOTIVADORES, ESTILOS_CONFLITO } from '../src/motor.js';
import { textoFlexionado } from './apoio/linguagem.js';

const PRONOMES = /\b(ele|ela|dele|dela|nele|nela|o colaborador|a colaboradora|o funcionário|a funcionária)\b/i;

function textos(valor) {
  if (typeof valor === 'string') return [valor];
  if (Array.isArray(valor)) return valor.flatMap(textos);
  if (valor && typeof valor === 'object') return Object.values(valor).flatMap(textos);
  return [];
}

const TODOS = Object.entries(LIDER).filter(([, v]) => typeof v !== 'function').flatMap(([, v]) => textos(v));

test('todas as chaves da parte 2 existem', () => {
  for (const f of FATORES) {
    assert.ok(LIDER.LIDER_FRASE[f] && LIDER.LIDER_APOIO[f] && LIDER.LIDER_DELEGAR[f] && LIDER.LIDER_DESGASTE[f], `fator ${f}`);
    assert.equal(LIDER.LIDER_COMUNICAR[f].fazer.length, 3);
    assert.equal(LIDER.LIDER_COMUNICAR[f].evitar.length, 3);
    assert.ok(LIDER.PERGUNTA_FATOR[f]);
  }
  for (const m of MOTIVADORES) assert.ok(LIDER.LIDER_RETORNO[m] && LIDER.LIDER_EVITAR[m] && LIDER.PERGUNTA_MOTIVADOR[m], `motivador ${m}`);
  for (const e of ESTILOS_CONFLITO) assert.ok(LIDER.LIDER_CONFLITO[e]?.esperar && LIDER.LIDER_CONFLITO[e]?.conduzir && LIDER.PERGUNTA_CONFLITO[e], `estilo ${e}`);
  for (const t of ['baixa', 'moderada', 'alta']) assert.ok(LIDER.PERGUNTA_TENSAO[t]);
  for (const m of ['estavel', 'movimento', 'turbulento']) assert.ok(LIDER.PERGUNTA_MOMENTO[m]);
  assert.ok(LIDER.LIDER_DESGASTE_TENSAO && LIDER.LIDER_DESGASTE_MOMENTO && LIDER.COMO_USAR);
});

test('a parte 2 nunca usa pronome de genero para a pessoa', () => {
  for (const t of TODOS) assert.doesNotMatch(t, PRONOMES, `pronome de genero: ${t}`);
});

test('a parte 2 usa linguagem neutra', () => {
  for (const t of TODOS) assert.deepEqual(textoFlexionado(LIDER.comNome(t, 'Maria')), [], `masculino: ${t}`);
});

test('as frases principais citam a pessoa pelo nome', () => {
  for (const f of FATORES) assert.ok(LIDER.LIDER_FRASE[f].includes('{nome}'), `frase ${f} sem {nome}`);
});

test('perguntas da conversa individual terminam em interrogacao', () => {
  const perguntas = textos([LIDER.PERGUNTA_MOTIVADOR, LIDER.PERGUNTA_TENSAO, LIDER.PERGUNTA_MOMENTO, LIDER.PERGUNTA_CONFLITO, LIDER.PERGUNTA_FATOR]);
  for (const p of perguntas) assert.ok(p.trim().endsWith('?'), `pergunta: ${p}`);
});

test('como usar deixa claro que nao avalia desempenho nem decide contratacao', () => {
  assert.match(LIDER.COMO_USAR, /desempenho/);
  assert.match(LIDER.COMO_USAR, /contrata/);
});

test('comNome troca todas as ocorrencias', () => {
  assert.equal(LIDER.comNome('{nome} e {nome}', 'Ana'), 'Ana e Ana');
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA — `src/textos-lider.js` não existe.

- [ ] **Step 3: Escrever `src/textos-lider.js`**

Com todas as chaves e as regras acima, e:

```js
export function comNome(texto, nomeEscapado) {
  return String(texto).split('{nome}').join(nomeEscapado);
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: `textos-lider.test.js` passando.

- [ ] **Step 5: Commit**

```bash
git add src/textos-lider.js testes/textos-lider.test.js
git commit -m "feat: textos da parte 2 para quem lidera"
```

---

### Task 6: Gráficos — conflito e emoções

**Files:**
- Modify: `src/graficos.js`
- Test: `testes/graficos.test.js`

**Interfaces:**
- Consumes: `ESTILOS_CONFLITO`, `NOMES_ESTILO`, `NOMES_DOMINIO`.
- Produces: `barrasConflito(pct) -> string`, `barrasEmocoes(ranking) -> string`, `quadroConflito(assertividade, cooperacao) -> string`.

- [ ] **Step 1: Escrever os testes que falham**

```js
import { barrasConflito, barrasEmocoes, quadroConflito } from '../src/graficos.js';

test('barras de conflito trazem os cinco estilos', () => {
  const svg = barrasConflito({ COL: 90, NEG: 60, COM: 40, CED: 50, EVI: 10 });
  for (const n of ['Colaborar', 'Negociar', 'Competir', 'Ceder', 'Evitar']) assert.ok(svg.includes(n));
});

test('barras de emocoes respeitam a ordem do ranking', () => {
  const svg = barrasEmocoes([{ codigo: 'EMP', pct: 90 }, { codigo: 'AUT', pct: 70 }, { codigo: 'REL', pct: 50 }, { codigo: 'CTR', pct: 20 }]);
  assert.ok(svg.indexOf('Empatia') < svg.indexOf('Autocontrole'));
});

test('o quadro de conflito posiciona o ponto e inverte o eixo vertical', () => {
  const svg = quadroConflito(100, 100);
  const cx = Number(svg.match(/class="ponto"[^>]*cx="([\d.]+)"/)[1]);
  const cy = Number(svg.match(/class="ponto"[^>]*cy="([\d.]+)"/)[1]);
  const baixo = Number(quadroConflito(0, 0).match(/class="ponto"[^>]*cy="([\d.]+)"/)[1]);
  assert.ok(cx > 150, 'assertividade alta fica a direita');
  assert.ok(cy < baixo, 'cooperacao alta fica em cima');
  for (const n of ['Assertividade', 'Cooperação', 'Colaborar', 'Evitar']) assert.ok(svg.includes(n));
});

test('o quadro apara valores fora de 0 a 100', () => {
  const svg = quadroConflito(180, -30);
  const cx = Number(svg.match(/class="ponto"[^>]*cx="([\d.]+)"/)[1]);
  assert.ok(cx <= 280);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA nas funções inexistentes.

- [ ] **Step 3: Implementar**

Em `src/graficos.js`, extrair a montagem de barras numa função interna reaproveitada e acrescentar:

```js
import { ESTILOS_CONFLITO, NOMES_ESTILO, NOMES_DOMINIO } from './motor.js';

function barrasDe(itens) {
  const conteudo = itens.map(({ rotulo, pct, classe }, i) => {
    const y = i * ALTURA_LINHA;
    const barra = `<rect class="${classe}" x="${LARGURA_ROTULO}" y="${y + 4}" width="${larguraDe(pct)}" height="16" rx="8"/>`;
    const valor = `<text x="${LARGURA - 2}" y="${y + 17}" class="valor" text-anchor="end">${aparar(pct)}</text>`;
    return linha(rotulo, y, trilho(y + 4, 16) + barra + valor);
  }).join('');
  return moldura(itens.length * ALTURA_LINHA, conteudo);
}

export function barrasConflito(pct) {
  return barrasDe(ESTILOS_CONFLITO.map((e) => ({ rotulo: NOMES_ESTILO[e], pct: pct[e], classe: 'barra' })));
}

export function barrasEmocoes(ranking) {
  return barrasDe(ranking.map((r, i) => ({
    rotulo: NOMES_DOMINIO[r.codigo], pct: r.pct, classe: i === 0 ? 'barra destaque' : 'barra',
  })));
}

const QUADRO = 300;
const MARGEM = 40;
const AREA = QUADRO - 2 * MARGEM;

export function quadroConflito(assertividade, cooperacao) {
  const x = MARGEM + (aparar(assertividade) / 100) * AREA;
  const y = MARGEM + AREA - (aparar(cooperacao) / 100) * AREA;
  const r = (texto, tx, ty, ancora = 'middle') => `<text x="${tx}" y="${ty}" class="rotulo-quadro" text-anchor="${ancora}">${escapar(texto)}</text>`;
  return `<svg viewBox="0 0 ${QUADRO} ${QUADRO}" role="img" class="grafico quadro">`
    + `<rect class="quadro-fundo" x="${MARGEM}" y="${MARGEM}" width="${AREA}" height="${AREA}" rx="6"/>`
    + `<line class="quadro-meio" x1="${QUADRO / 2}" y1="${MARGEM}" x2="${QUADRO / 2}" y2="${MARGEM + AREA}"/>`
    + `<line class="quadro-meio" x1="${MARGEM}" y1="${QUADRO / 2}" x2="${MARGEM + AREA}" y2="${QUADRO / 2}"/>`
    + r('Ceder', MARGEM + 6, MARGEM + 16, 'start') + r('Colaborar', MARGEM + AREA - 6, MARGEM + 16, 'end')
    + r('Negociar', QUADRO / 2, QUADRO / 2 - 8)
    + r('Evitar', MARGEM + 6, MARGEM + AREA - 8, 'start') + r('Competir', MARGEM + AREA - 6, MARGEM + AREA - 8, 'end')
    + r('Assertividade →', QUADRO / 2, QUADRO - 12)
    + `<text class="rotulo-quadro" text-anchor="middle" transform="translate(14 ${QUADRO / 2}) rotate(-90)">Cooperação →</text>`
    + `<circle class="ponto" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"/>`
    + '</svg>';
}
```

`barrasComportamento` e `barrasMotivacoes` passam a usar `barrasDe` sem mudar o que desenham (os testes existentes continuam valendo).

Em `estilos.css`:
```css
.quadro { max-width: 320px; margin: 12px auto; }
.quadro .quadro-fundo { fill: var(--blue-pale); }
.quadro .quadro-meio { stroke: var(--gold-soft); stroke-width: 1; }
.quadro .rotulo-quadro { font-family: var(--fonte); font-size: 11px; fill: var(--muted); }
.quadro .ponto { fill: var(--gold); stroke: var(--navy); stroke-width: 2; }
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: `graficos.test.js` passando.

- [ ] **Step 5: Commit**

```bash
git add src/graficos.js estilos.css testes/graficos.test.js
git commit -m "feat: graficos de conflito, quadro assertividade x cooperacao e emocoes"
```

---

### Task 7: Relatório — resumo, parte 1 e parte 2

**Files:**
- Modify: `src/relatorio.js`, `estilos.css`
- Test: `testes/relatorio.test.js`

**Interfaces:**
- Consumes: Tarefas 1, 4, 5, 6.
- Produces: `montarRelatorio(resultado) -> string` com `<section id="resumo">`, `<div id="parte1">`, `<div class="quebra-pagina" aria-hidden="true"></div>`, `<div id="parte2">`, rodapé; e as funções auxiliares exportadas `acoesDoPlano(resultado) -> string[3]` e `perguntasDaConversa(resultado) -> string[4]`.

- [ ] **Step 1: Escrever os testes que falham**

Em `testes/relatorio.test.js`, `resultadoDeExemplo` passa a montar `a1` com 12, `a2` com 6, `conflito` com 6 e `emocoes` com 16 (`MAPA_EMOCOES.map(() => 4)` com duas notas 2 no domínio `REL`). Trocar o teste "o relatorio traz todas as secoes previstas" por:

```js
import { acoesDoPlano, perguntasDaConversa } from '../src/relatorio.js';
import { MAPA_EMOCOES } from '../src/motor.js';

test('o relatorio tem resumo, parte 1 e parte 2 em pagina nova', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  const iResumo = html.indexOf('id="resumo"');
  const iP1 = html.indexOf('id="parte1"');
  const iQuebra = html.indexOf('class="quebra-pagina"');
  const iP2 = html.indexOf('id="parte2"');
  assert.ok(iResumo > -1 && iResumo < iP1 && iP1 < iQuebra && iQuebra < iP2);
  for (const titulo of ['Seu perfil', 'Diante de conflito', 'Como você lida com emoções', 'Plano de desenvolvimento', 'Leia com cuidado']) {
    assert.ok(html.slice(iP1, iQuebra).includes(titulo), `parte 1 sem: ${titulo}`);
  }
  for (const titulo of ['Em uma frase', 'Como se comunicar', 'Como dar retorno', 'Como delegar', 'Em conflito', 'Sinais de desgaste', 'O que evitar', 'Perguntas para a próxima conversa', 'Como usar este relatório']) {
    assert.ok(html.slice(iP2).includes(titulo), `parte 2 sem: ${titulo}`);
  }
});

test('a parte 2 fala da pessoa pelo nome', () => {
  const html = montarRelatorio(resultadoDeExemplo({ nome: 'Joana' }));
  const p2 = html.slice(html.indexOf('id="parte2"'));
  assert.ok(p2.includes('Para quem lidera Joana'));
  assert.ok((p2.match(/Joana/g) || []).length >= 3);
  assert.ok(!p2.includes('{nome}'));
});

test('nome com apostrofo e html aparece escapado na parte 2', () => {
  const html = montarRelatorio(resultadoDeExemplo({ nome: "D'Ávila <b>" }));
  const p2 = html.slice(html.indexOf('id="parte2"'));
  assert.ok(p2.includes('D&#39;Ávila &lt;b&gt;'));
  assert.ok(!p2.includes('<b>'));
});

test('o plano tem exatamente tres acoes, inclusive com emocoes equilibradas', () => {
  assert.equal(acoesDoPlano(resultadoDeExemplo()).length, 3);
  const equilibrado = resultadoDeExemplo({ emocoes: MAPA_EMOCOES.map((m) => (m.invertida ? 2 : 4)) });
  assert.equal(equilibrado.emocoes.equilibrado, true);
  const acoes = acoesDoPlano(equilibrado);
  assert.equal(acoes.length, 3);
  assert.ok(acoes.every(Boolean));
});

test('a conversa individual tem exatamente quatro perguntas', () => {
  assert.equal(perguntasDaConversa(resultadoDeExemplo()).length, 4);
  assert.equal(perguntasDaConversa(resultadoDeExemplo({ a2: null })).length, 4);
});

test('o quadro de conflito aparece na parte 1', () => {
  const html = montarRelatorio(resultadoDeExemplo());
  assert.ok(html.slice(html.indexOf('id="parte1"'), html.indexOf('class="quebra-pagina"')).includes('class="grafico quadro"'));
});

test('o resumo traz perfil, motivadores, conflito e emocao', () => {
  const r = resultadoDeExemplo();
  const html = montarRelatorio(r);
  const resumo = html.slice(html.indexOf('id="resumo"'), html.indexOf('id="parte1"'));
  assert.ok(resumo.includes(r.perfil.titulo));
  assert.ok(resumo.includes(NOMES_ESTILO[r.conflito.principal]));
  assert.ok(resumo.includes(NOMES_DOMINIO[r.emocoes.forte]));
});
```

(`NOMES_ESTILO` e `NOMES_DOMINIO` importados de `../src/motor.js`.) Os testes da v2 que continuam valendo — escape do nome, sem tensão quando `a2` é nulo, alerta reforçado, rodapé legal, botões de PDF/compartilhar/refazer, link da base teórica, WhatsApp — permanecem, com `resultadoDeExemplo` atualizado.

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA — `acoesDoPlano` inexistente e seções ausentes.

- [ ] **Step 3: Implementar**

Em `src/relatorio.js` (mantendo `escaparHtml`, `cartao`, `lista`, `paragrafo`, botões, `creditoDel`, `blocoTensao`, `blocoMotivacoes`, `blocoRessalvas`):

```js
import * as L from './textos-lider.js';

function chaveRetrato(perfil) {
  return perfil.apoio ? perfil.dominante + perfil.apoio : perfil.dominante;
}

export function acoesDoPlano(r) {
  const dominio = r.emocoes.desenvolver ?? r.emocoes.ranking[r.emocoes.ranking.length - 1].codigo;
  return [ACAO_FATOR[r.perfil.dominante], ACAO_EMOCAO[dominio], ACAO_CONFLITO[r.conflito.principal]];
}

export function perguntasDaConversa(r) {
  return [
    L.PERGUNTA_MOTIVADOR[r.motivacoes[0].codigo],
    r.tensao ? L.PERGUNTA_TENSAO[r.tensao.faixa] : L.PERGUNTA_FATOR[r.perfil.dominante],
    L.PERGUNTA_MOMENTO[r.momento.faixa],
    L.PERGUNTA_CONFLITO[r.conflito.principal],
  ];
}

function montarResumo(r) {
  const [m1, m2] = r.motivacoes;
  const alertas = [
    r.momento.faixa === 'turbulento' ? 'Momento turbulento: leia o resultado como fotografia de uma fase.' : '',
    r.tensao?.faixa === 'alta' ? 'Tensão alta entre o jeito natural e o que o trabalho pede hoje.' : '',
  ].filter(Boolean);
  const item = (rotulo, valor) => `<div class="resumo-item"><p class="resumo-rotulo">${rotulo}</p><p class="resumo-valor">${escaparHtml(valor)}</p></div>`;
  return '<section class="cartao resumo" id="resumo"><h2>Resumo</h2>'
    + `<p class="titulo-perfil">${escaparHtml(r.perfil.titulo)}</p>`
    + paragrafo(SINTESE[r.perfil.dominante])
    + '<div class="resumo-grade">'
    + item('O que mais move', `${NOMES_MOTIVADOR[m1.codigo]} e ${NOMES_MOTIVADOR[m2.codigo]}`)
    + item('Diante de conflito', NOMES_ESTILO[r.conflito.principal])
    + item('Força emocional', NOMES_DOMINIO[r.emocoes.forte])
    + '</div>'
    + (alertas.length ? `<ul class="resumo-alertas">${alertas.map((a) => `<li>${escaparHtml(a)}</li>`).join('')}</ul>` : '')
    + '</section>';
}

function blocoConflito(c) {
  const principal = CONFLITO_VOCE[c.principal];
  return quadroConflito(c.assertividade, c.cooperacao)
    + barrasConflito(c.pct)
    + `<h3>Seu estilo principal: ${NOMES_ESTILO[c.principal]}</h3>`
    + paragrafo(principal.rende) + paragrafo(principal.custa)
    + `<h3>Seu estilo de apoio: ${NOMES_ESTILO[c.secundario]}</h3>`
    + paragrafo(CONFLITO_VOCE[c.secundario].rende);
}

function blocoEmocoes(e) {
  return barrasEmocoes(e.ranking)
    + `<h3>Área mais forte: ${NOMES_DOMINIO[e.forte]}</h3>` + paragrafo(EMOCAO_FORTE[e.forte])
    + (e.equilibrado
      ? paragrafo(EMOCAO_EQUILIBRADO)
      : `<h3>Área a desenvolver: ${NOMES_DOMINIO[e.desenvolver]}</h3>` + paragrafo(EMOCAO_DESENVOLVER[e.desenvolver]))
    + `<p class="legenda-grafico">${escaparHtml(EMOCAO_LEITURA)}</p>`;
}

function montarParte2(r, nome) {
  const n = (t) => escaparHtml(L.comNome(t, '\u0000')).split('\u0000').join(nome);
  const d = r.perfil.dominante;
  const com = L.LIDER_COMUNICAR[d];
  const desgaste = [L.LIDER_DESGASTE[d],
    r.tensao?.faixa === 'alta' ? L.LIDER_DESGASTE_TENSAO : '',
    r.momento.faixa === 'turbulento' ? L.LIDER_DESGASTE_MOMENTO : ''].filter(Boolean);
  const lst = (itens) => `<ul>${itens.map((i) => `<li>${n(i)}</li>`).join('')}</ul>`;
  const p = (t) => `<p>${n(t)}</p>`;
  return `<div id="parte2"><header class="cabecalho-parte"><p class="kicker">PARTE 2</p><h2 class="titulo-parte">Para quem lidera ${nome}</h2></header>`
    + cartao('lider-frase', 'Em uma frase', p(L.LIDER_FRASE[d]) + (r.perfil.apoio ? p(L.LIDER_APOIO[r.perfil.apoio]) : ''))
    + cartao('lider-comunicar', 'Como se comunicar', '<h3>Faça</h3>' + lst(com.fazer) + '<h3>Evite</h3>' + lst(com.evitar))
    + cartao('lider-retorno', 'Como dar retorno e reconhecer', r.motivacoes.slice(0, 2).map((m) => p(L.LIDER_RETORNO[m.codigo])).join(''))
    + cartao('lider-delegar', 'Como delegar e acompanhar', p(L.LIDER_DELEGAR[d]))
    + cartao('lider-conflito', 'Em conflito', p(L.LIDER_CONFLITO[r.conflito.principal].esperar) + p(L.LIDER_CONFLITO[r.conflito.principal].conduzir))
    + cartao('lider-desgaste', 'Sinais de desgaste', lst(desgaste))
    + cartao('lider-evitar', 'O que evitar', p(L.LIDER_EVITAR[r.motivacoes[r.motivacoes.length - 1].codigo]))
    + cartao('lider-perguntas', 'Perguntas para a próxima conversa individual', `<ol>${perguntasDaConversa(r).map((q) => `<li>${n(q)}</li>`).join('')}</ol>`)
    + cartao('lider-uso', 'Como usar este relatório', p(L.COMO_USAR))
    + '</div>';
}
```

`montarRelatorio(resultado)`:
1. `const nome = escaparHtml(resultado.nome)`;
2. cabeçalho (como hoje) → `montarResumo` → `<div id="parte1"><header class="cabecalho-parte"><p class="kicker">PARTE 1</p><h2 class="titulo-parte">Para você</h2></header>` + cartões na ordem da spec 3.2 (`Seu perfil` com `RETRATOS[chaveRetrato(perfil)]`; `Natural × Adaptado` se houver tensão; `Diante de conflito` com `blocoConflito`; `O que te move`; `Como você lida com emoções` com `blocoEmocoes`; `Pontos fortes` e `Pontos de atenção`; `Plano de desenvolvimento` com `<ol>` de `acoesDoPlano`; `Leia com cuidado`) + `</div>`;
3. `<div class="quebra-pagina" aria-hidden="true"></div>` → `montarParte2(resultado, nome)` → rodapé (como hoje).

O escape da parte 2 acontece **antes** da troca do nome, para que o nome, já escapado, entre intacto (é o que o `\u0000` garante).

Em `estilos.css`:
```css
.cabecalho-parte { margin: 28px 0 8px; }
.titulo-parte { color: var(--navy); font-size: 26px; margin: 0; }
.resumo-grade { display: grid; grid-template-columns: 1fr; gap: 10px; margin: 12px 0; }
@media (min-width: 560px) { .resumo-grade { grid-template-columns: repeat(3, 1fr); } }
.resumo-item { background: #fff; border: 1px solid var(--gold-soft); border-radius: 10px; padding: 10px 12px; }
.resumo-rotulo { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--bronze); margin: 0 0 4px; }
.resumo-valor { font-weight: 700; color: var(--navy); margin: 0; }
.resumo-alertas { color: var(--ink); }
@media print {
  .quebra-pagina { break-before: page; page-break-before: always; }
  .resumo-grade { grid-template-columns: repeat(3, 1fr); }
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: toda a suíte verde.

- [ ] **Step 5: Commit**

```bash
git add src/relatorio.js estilos.css testes/relatorio.test.js
git commit -m "feat: relatorio com resumo, parte 1 e parte 2 para quem lidera"
```

---

### Task 8: Páginas — base teórica e guia do facilitador

**Files:**
- Modify: `metodo.html`, `facilitador.html`
- Test: `testes/paginas.test.js`

- [ ] **Step 1: Conferir as referências novas**

WebSearch para cada uma das 5 referências da spec, seção 5. Divergência → vale a busca; sem confirmação → a referência sai com a frase que a cita. Registrar no ledger.

- [ ] **Step 2: Escrever os testes que falham**

```js
test('a base teorica cobre conflito e emocoes', () => {
  const texto = textoVisivel(ler('metodo.html'));
  for (const autor of ['BLAKE', 'THOMAS', 'KILMANN', 'GOLEMAN', 'BOYATZIS']) assert.ok(texto.includes(autor), `falta ${autor}`);
  assert.match(texto, /percep[çc][ãa]o que a pessoa tem de si|como a pessoa se percebe/i);
  assert.match(texto, /n[ãa]o (é|são) reproduzid|itens pr[óo]prios/i);
});

test('o guia do facilitador fala da parte 2 e do tempo novo', () => {
  const texto = textoVisivel(ler('facilitador.html'));
  assert.match(texto, /parte 2/i);
  assert.match(texto, /16 min|5–21 min/);
});
```

E trocar o teste "a pagina do metodo tem as sete secoes…" para exigir `id="s1"` a `id="s9"`.

- [ ] **Step 3: Rodar e confirmar que falha**

Run: `npm test`
Expected: FALHA nos três testes.

- [ ] **Step 4: Atualizar as páginas**

`metodo.html`:
- seção 01 passa a descrever as 6 etapas;
- seção 02 fala de situações de trabalho (não mais palavras);
- **nova** seção "Diante de conflito" (Blake e Mouton; Thomas; Kilmann e Thomas; os dois eixos; nenhum estilo é certo; itens próprios, o instrumento comercial não é reproduzido);
- **nova** seção "Como você lida com emoções" (Goleman; Goleman, Boyatzis e McKee; quatro domínios; autoavaliação mede como a pessoa se percebe, e o relatório mostra só a ordem entre as áreas);
- seções renumeradas `s1` a `s9` (limites em `s8`, referências em `s9`), com as referências novas em ordem alfabética;
- limites acrescentam a ressalva sobre a medida emocional e sobre a parte 2 não servir para avaliar desempenho.

`facilitador.html`:
- roteiro: preenchimento de 5 a 21 min (16 min), leitura individual de 21 a 31 min, dinâmica de 31 a 58, plenária de 58 a 68, fechamento de 68 a 75 (aula de 75 minutos);
- nova seção "Como o líder usa a parte 2": ler o resumo, usar as 4 perguntas na próxima conversa individual, nunca usar para avaliação;
- dinâmica ganha a opção de grupos por estilo de conflito.

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `npm test`
Expected: todos passando.

- [ ] **Step 6: Commit**

```bash
git add metodo.html facilitador.html testes/paginas.test.js
git commit -m "feat: base teorica e guia do facilitador da v3"
```

---

### Task 9: README, verificação completa, amostra para Luciano e publicação

**Files:**
- Modify: `README.md`, `index.html` (descrição e `og:description`: "Cerca de 16 minutos")

- [ ] **Step 1: README**

Tempo de ~16 minutos, 6 etapas, as duas partes do relatório, `src/textos-lider.js` na tabela de arquivos, chave de encurtar ("cai de 49 para 43 telas, cerca de 14 minutos").

- [ ] **Step 2: Suíte completa**

Run: `npm test`
Expected: tudo verde, zero pulado.

- [ ] **Step 3: Ponta a ponta no navegador**

Playwright em 390 × 844: 49 telas de resposta, nenhum texto de pergunta repetido na tela, relatório com resumo, parte 1 e parte 2, zero erro no console. Com `INCLUIR_ADAPTADO = false`: 43 telas e nenhuma menção a tensão.

- [ ] **Step 4: PDF**

Gerar o PDF A4 do relatório e ver todas as páginas: entre 9 e 11 páginas, parte 2 começa em página nova, nenhum cartão cortado, botões ausentes.

- [ ] **Step 5: Revisão independente**

Revisor novo no modelo mais capaz, com o Review Focus deste plano, sobre o diff da branch inteira. Corrigir Critical e Important com TDD.

- [ ] **Step 6: Amostra para Luciano (portão da spec, seção 6)**

Gerar uma página de amostra com: 2 retratos de combinação, 1 cenário de conflito completo e a parte 2 inteira de um resultado de exemplo. Mostrar a Luciano e **aguardar a aprovação dos textos**. Ajustes pedidos entram antes de publicar.

- [ ] **Step 7: Commit**

```bash
git add README.md index.html
git commit -m "docs: readme e previa da v3"
```

- [ ] **Step 8: Publicar — só com "pode publicar"**

Merge da branch em `main`, `git push origin main`, aguardar o Pages e repetir o ponta a ponta no endereço público. Publicar fora do horário de aula.

---

## Ordem de execução

1 → 2 → 3 (as telas dependem dos dados); 4 e 5 dependem só do motor e podem vir em qualquer ordem depois da 2; 6 depende da 1; 7 depende de 1, 4, 5 e 6; 8 é independente; 9 fecha.
