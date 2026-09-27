# Mapa de Perfil

Um questionário de cerca de 10 minutos que a pessoa responde pelo celular e, ao
terminar, recebe na hora um relatório com seu perfil comportamental, suas
motivações e uma leitura de quanto o momento de vida dela pode estar
influenciando esse retrato. O relatório pode ser salvo em PDF.

**Nenhuma resposta é gravada em servidor.** Não existe banco de dados nem
cadastro. Tudo acontece dentro do navegador de quem responde e some quando a
aba é fechada.

Feito para a DEL / Lótus Desenvolvimento Humano e Gerencial.

---

## Como publicar na internet

1. No GitHub, crie um repositório **público** chamado `mapa-de-perfil`.
2. Envie os arquivos desta pasta para ele.
3. No repositório, vá em **Settings → Pages**.
4. Em "Branch", escolha **main** e a pasta **/ (root)**. Clique em Save.
5. Espere um ou dois minutos. O link fica sendo:

   **https://lucianocabralsf.github.io/mapa-de-perfil/**

É esse link que você manda no grupo da turma.

---

## Os três endereços

| Endereço | Para quem |
|---|---|
| https://lucianocabralsf.github.io/mapa-de-perfil/ | A turma: é o teste |
| https://lucianocabralsf.github.io/mapa-de-perfil/metodo.html | Qualquer pessoa: a base teórica e os limites do método |
| https://lucianocabralsf.github.io/mapa-de-perfil/facilitador.html | **Só para quem conduz a aula — não divulgar.** O roteiro da aula não aparece em nenhum link do site nem no Google |

Quando o link é mandado no WhatsApp, aparece uma prévia com a marca da DEL. Se
a prévia vier antiga ou sem imagem, é o WhatsApp que guardou uma versão
anterior; ela se atualiza sozinha depois de um tempo.

Quem abrir o link **dentro** do WhatsApp ou do Instagram recebe um aviso para
abrir no navegador antes de começar — é lá que o "Salvar em PDF" funciona.

---

## Como encurtar o teste

O teste tem 4 etapas e leva cerca de 10 minutos. A etapa mais demorada é a
segunda, em que as mesmas palavras aparecem de novo para medir a diferença
entre como a pessoa é e como ela precisa ser no trabalho.

Se o tempo da aula ficar curto, dá para desligar essa etapa. O teste cai para
**3 etapas e cerca de 8 minutos**, e o relatório continua completo — só não terá
a seção "Natural × Adaptado".

Abra o arquivo `src/dados.js`. Logo no começo está escrito:

```js
export const INCLUIR_ADAPTADO = true;
```

Troque `true` por `false`, salve e envie de novo para o GitHub. Para voltar
atrás, troque de novo para `true`.

---

## Como abrir na sua própria máquina

Abrir o `index.html` com dois cliques **não funciona** — o navegador bloqueia
por segurança. Use um endereço local: abra o terminal nesta pasta e rode

```
npx serve .
```

Depois abra no navegador o endereço que aparecer (algo como
`http://localhost:3000`).

---

## Como conferir se está tudo certo

```
npm test
```

São mais de 100 testes automáticos. Eles verificam as contas do questionário
(pontuação, desempate, índice de tensão, ranking dos pares, inversão das
perguntas de momento), a montagem do relatório, as duas páginas extras e se
todo texto está em linguagem neutra. Todos precisam passar.

---

## O que tem em cada arquivo

| Arquivo | O que faz |
|---|---|
| `index.html` | A página em si |
| `estilos.css` | Cores, layout do celular e o formato de impressão em PDF |
| `metodo.html` | A página da base teórica |
| `facilitador.html` | O guia de quem conduz a aula |
| `src/dados.js` | As perguntas do questionário e a chave para encurtar o teste |
| `src/textos.js` | Todos os textos do relatório |
| `src/motor.js` | As contas: pontuação, perfil, tensão, motivações, momento |
| `src/graficos.js` | Os gráficos de barra |
| `src/relatorio.js` | Monta o relatório final |
| `src/telas.js` | A navegação entre as telas |
| `src/compartilhar.js` | O botão "Compartilhar meu perfil" |
| `src/ambiente.js` | Reconhece quando o link foi aberto dentro de um aplicativo |
| `src/app.js` | Liga tudo e inicia |
| `imagens/` | Logotipo e imagem da prévia do link |
| `docs/superpowers/` | A especificação e o plano de construção |

---

## Aviso importante

Este material é uma ferramenta de autoconhecimento e apoio à decisão. **Não é
um teste psicológico nem um diagnóstico clínico**, e não substitui avaliação
feita por profissional habilitado. No Brasil, a aplicação de testes psicológicos
é atividade privativa de psicólogo. Esse aviso está no rodapé do relatório e
deve permanecer lá.
