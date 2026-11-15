// Seção 4 — Diferenciabilidade e continuidade
import { R } from '../ui/tex.js';

const raizCubica = (x) => Math.cbrt(x);

export default {
  lide: R`Nem toda função tem derivada em todos os pontos. Aqui estão os quatro jeitos de uma função “falhar” em ser derivável e a relação exata entre derivabilidade e continuidade.`,
  objetivos: [
    R`Usar <strong>derivadas laterais</strong> para decidir se \(f'(a)\) existe.`,
    R`Explicar por que <strong>derivável implica contínua</strong>, mas contínua não implica derivável.`,
    R`Reconhecer no gráfico <strong>bicos, cúspides, tangentes verticais e descontinuidades</strong>.`,
  ],
  blocos: [
    { h2: 'Derivável = parece uma reta quando ampliada' },
    { caixa: 'intuicao', titulo: 'O teste do zoom',
      html: R`
      <p>Amplie o gráfico em torno de um ponto, como em um microscópio. Se a função é derivável ali, a curva vai
      ficando cada vez mais parecida com uma reta (a reta tangente). Se, por mais que você amplie, continua havendo
      um bico, uma ponta ou um salto, a derivada não existe naquele ponto.</p>` },
    { widget: 'zoom',
      legenda: R`Escolha a função e aumente a ampliação. Só os gráficos deriváveis no ponto “viram reta” (com inclinação finita).` },

    { h2: 'Derivadas laterais' },
    { html: R`
      <p>O limite que define a derivada exige que \(h\) possa se aproximar de zero pelos dois lados e que o resultado
      seja o mesmo. Separando os lados, temos as derivadas laterais.</p>` },
    { caixa: 'definicao', titulo: 'Derivadas laterais e derivabilidade',
      html: R`
      \[ f'_-(a) = \lim_{h \to 0^-} \frac{f(a + h) - f(a)}{h} \qquad\qquad f'_+(a) = \lim_{h \to 0^+} \frac{f(a + h) - f(a)}{h} \]
      <p>A função \(f\) é <strong>derivável em \(a\)</strong> exatamente quando as duas derivadas laterais existem
      (são números) e são iguais. Nesse caso, \(f'(a) = f'_-(a) = f'_+(a)\).</p>` },
    { caixa: 'teorema', titulo: 'Derivável implica contínua',
      html: R`
      <p>Se \(f\) é derivável em \(a\), então \(f\) é contínua em \(a\).</p>
      <p>A recíproca é <strong>falsa</strong>: \(f(x) = |x|\) é contínua em \(0\), mas não é derivável em \(0\).
      Na prática: <em>se a função não é contínua em um ponto, nem adianta procurar a derivada ali.</em></p>`,
      porque: R`
      <p>Para \(x \neq a\), escreva \(f(x) - f(a) = \dfrac{f(x) - f(a)}{x - a} \cdot (x - a)\). Quando \(x \to a\), a fração
      tende a \(f'(a)\) (um número) e o fator \((x - a)\) tende a \(0\). Logo \(f(x) - f(a) \to f'(a) \cdot 0 = 0\),
      isto é, \(f(x) \to f(a)\), que é a definição de continuidade.</p>` },

    { h2: 'Onde a derivada não existe' },
    { graficos: [
      { x: [-2.2, 2.2], y: [-0.6, 2.4], proporcao: 0.7, alturaMin: 180,
        descricao: 'Gráfico de y = |x|, com um bico na origem.',
        itens: [{ tipo: 'funcao', f: Math.abs, cor: 1 }, { tipo: 'ponto', x: 0, y: 0, cor: 2 }],
        legenda: R`<strong>Bico</strong> (ponto anguloso): \(f(x) = |x|\). As inclinações laterais são \(-1\) e \(1\): diferentes.` },
      { x: [-2.2, 2.2], y: [-0.6, 2.4], proporcao: 0.7, alturaMin: 180,
        descricao: 'Gráfico de y igual à raiz cúbica de x ao quadrado, com uma cúspide na origem.',
        itens: [{ tipo: 'funcao', f: (x) => raizCubica(x * x), cor: 1 }, { tipo: 'ponto', x: 0, y: 0, cor: 2 }],
        legenda: R`<strong>Cúspide</strong>: \(f(x) = \sqrt[3]{x^2}\). As inclinações laterais tendem a \(-\infty\) e \(+\infty\).` },
      { x: [-2.2, 2.2], y: [-1.6, 1.6], proporcao: 0.7, alturaMin: 180,
        descricao: 'Gráfico de y igual à raiz cúbica de x, com tangente vertical na origem.',
        itens: [{ tipo: 'funcao', f: raizCubica, cor: 1 }, { tipo: 'vertical', x: 0, cor: 2, tracejado: true }, { tipo: 'ponto', x: 0, y: 0, cor: 2 }],
        legenda: R`<strong>Tangente vertical</strong>: \(f(x) = \sqrt[3]{x}\). A inclinação tende a \(+\infty\): não é um número.` },
      { x: [-2.2, 2.2], y: [-1.2, 2.6], proporcao: 0.7, alturaMin: 180,
        descricao: 'Gráfico com um salto em x = 0: vale x + 2 à direita e x à esquerda.',
        itens: [
          { tipo: 'funcao', f: (x) => x, cor: 1, dominio: [-2.2, 0] },
          { tipo: 'funcao', f: (x) => x + 1.5, cor: 1, dominio: [0, 2.2] },
          { tipo: 'ponto', x: 0, y: 0, cor: 1, aberto: true },
          { tipo: 'ponto', x: 0, y: 1.5, cor: 1 },
        ],
        legenda: R`<strong>Descontinuidade</strong> (salto): sem continuidade não há derivada, mesmo com os dois ramos “paralelos”.` },
    ] },
    { caixa: 'formula', rotulo: 'Resumo', titulo: 'Quatro motivos para f′(a) não existir',
      html: R`
      <ul>
        <li><strong>Descontinuidade</strong> em \(a\) (salto, buraco, assíntota).</li>
        <li><strong>Bico</strong>: derivadas laterais finitas, mas diferentes.</li>
        <li><strong>Cúspide</strong>: derivadas laterais infinitas de sinais opostos.</li>
        <li><strong>Tangente vertical</strong>: o quociente de Newton tende a \(+\infty\) ou \(-\infty\).</li>
      </ul>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'O módulo não é derivável na origem', nivel: 'facil',
      enunciado: R`<p>Mostre que \(f(x) = |x|\) não é derivável em \(x = 0\).</p>`,
      confere: { valor: (m) => m.d('abs(x)', 0.5) },
      passos: [
        { tex: R`\frac{f(0 + h) - f(0)}{h} = \frac{|h|}{h}`, txt: R`Quociente de Newton em \(a = 0\), com \(f(0) = 0\).`, c: { igual: '(abs(0 + h) - abs(0))/h', vars: ['h'] } },
        { tex: R`f'_+(0) = \lim_{h \to 0^+} \frac{h}{h} = 1`, txt: R`Pela direita, \(h > 0\) e \(|h| = h\).`, c: 1, seg: 'ultimo' },
        { tex: R`f'_-(0) = \lim_{h \to 0^-} \frac{-h}{h} = -1`, txt: R`Pela esquerda, \(h < 0\) e \(|h| = -h\).`, c: { valor: (m) => m.d('abs(x)', -0.5) }, seg: 'ultimo' },
        { tex: R`f'_-(0) = -1 \neq 1 = f'_+(0)`, txt: R`As derivadas laterais existem, mas são diferentes: \(f'(0)\) não existe. É o bico do gráfico em “V”. (Nos demais pontos, \(f'(x) = 1\) para \(x > 0\) e \(f'(x) = -1\) para \(x < 0\).)` },
      ],
    } },
    { exemplo: {
      titulo: 'Função definida por partes: colou bem?', nivel: 'medio',
      enunciado: R`<p>Verifique se \(f(x) = \begin{cases} x^2 & \text{se } x \le 1 \\ 2x - 1 & \text{se } x > 1 \end{cases}\) é derivável em \(x = 1\).</p>`,
      confere: { valor: (m) => m.d('x^2', 1) },
      passos: [
        { tex: R`\lim_{x \to 1^-} x^2 = 1 \qquad \lim_{x \to 1^+} (2x - 1) = 1 \qquad f(1) = 1`, txt: R`Primeiro a continuidade: os limites laterais coincidem com \(f(1)\). A função é contínua em \(1\), então faz sentido prosseguir.` },
        { tex: R`f'_-(1) = \lim_{h \to 0^-} \frac{(1 + h)^2 - 1}{h} = \lim_{h \to 0^-} (2 + h) = 2`, txt: R`Derivada pela esquerda: usamos o ramo \(x^2\).`, c: 1, seg: 'ultimo' },
        { tex: R`f'_+(1) = \lim_{h \to 0^+} \frac{2(1 + h) - 1 - 1}{h} = \lim_{h \to 0^+} \frac{2h}{h} = 2`, txt: R`Derivada pela direita: usamos o ramo \(2x - 1\).`, c: { valor: (m) => m.d('2x - 1', 1) }, seg: 'ultimo' },
        { tex: R`f'_-(1) = f'_+(1) = 2`, txt: R`As laterais são iguais: \(f\) é derivável em \(1\) e \(f'(1) = 2\). A reta \(y = 2x - 1\) é justamente a tangente à parábola nesse ponto, por isso a emenda é suave.`, c: 1, seg: 'ultimo' },
      ],
    } },
    { exemplo: {
      titulo: 'Escolhendo constantes para a função ser derivável', nivel: 'dificil',
      enunciado: R`<p>Determine \(a\) e \(b\) para que \(f(x) = \begin{cases} x^2 & \text{se } x \le 2 \\ ax + b & \text{se } x > 2 \end{cases}\) seja derivável em \(x = 2\).</p>`,
      confere: { valor: (m) => m.d('x^2', 2) },
      passos: [
        { tex: R`2a + b = 4`, txt: R`<strong>Continuidade</strong> em \(2\): o valor do ramo da direita em \(x = 2\) deve ser igual a \(f(2) = 2^2 = 4\).`, c: { fn: (m) => m.perto(2 * 4 + -4, 4) } },
        { tex: R`f'_-(2) = 2 \cdot 2 = 4 \qquad f'_+(2) = a`, txt: R`<strong>Derivadas laterais</strong>: à esquerda, a derivada de \(x^2\) é \(2x\), que em \(2\) vale \(4\); à direita, a reta \(ax + b\) tem inclinação \(a\).` },
        { tex: R`a = 4`, txt: R`Igualamos as derivadas laterais.`, c: 1 },
        { tex: R`b = 4 - 2a = 4 - 8 = -4`, txt: R`Substituímos \(a\) na condição de continuidade. Com \(a = 4\) e \(b = -4\), o ramo da direita é \(y = 4x - 4\), a tangente à parábola em \(x = 2\).`, c: { valor: (m) => m.num('x^2', { x: 2 }) - m.d('x^2', 2) * 2, fixos: { a: 4 } } },
      ],
    } },

    { erros: [
      { e: R`“A função é contínua, logo é derivável.”`,
        c: R`É o contrário: derivável \(\Rightarrow\) contínua. \(f(x) = |x|\) é contínua em \(0\) e não é derivável ali.` },
      { e: R`Em função por partes, derivar cada ramo e comparar as fórmulas <em>sem verificar a continuidade</em>.`,
        c: R`Com \(f(x) = x^2\) para \(x \le 1\) e \(f(x) = 2x + 3\) para \(x > 1\), as fórmulas dão \(2\) dos dois lados, mas há um salto em \(1\): \(f\) não é derivável.` },
      { e: R`Dizer que \(f(x) = \sqrt[3]{x}\) tem derivada “infinita” em \(0\), então é derivável.`,
        c: R`A derivada precisa ser um número real. Tangente vertical significa que \(f'(0)\) <strong>não existe</strong>.` },
      { e: R`Concluir que \(|x|\) não é derivável em lugar nenhum.`,
        c: R`O problema é só no bico. Para \(x \neq 0\), \(|x|\) é derivável, com derivada \(1\) ou \(-1\).` },
    ] },

    { exercicios: [
      { q: R`A função \(f(x) = |x - 3|\) é derivável em \(x = 3\)? E em \(x = 5\)?`,
        r: R`<p>Em \(x = 3\) não: as derivadas laterais são \(-1\) e \(1\) (bico). Em \(x = 5\) sim: perto de \(5\), \(f(x) = x - 3\) e \(f'(5) = 1\).</p>`,
        c: { valor: (m) => m.d('abs(x - 3)', 5), tex: R`f'(5) = 1`, seg: 'ultimo' } },
      { q: R`Determine \(k\) para que \(f(x) = \begin{cases} x^2 & \text{se } x \le 3 \\ 6x + k & \text{se } x > 3 \end{cases}\) seja derivável em \(x = 3\).`,
        r: R`<p>As derivadas laterais já coincidem (\(2 \cdot 3 = 6\)). Falta a continuidade: \(18 + k = 9\), logo \(k = -9\).</p>`,
        c: { valor: -9, tex: R`k = -9`, seg: 'ultimo' } },
      { q: R`Uma função pode ser derivável em um ponto onde é descontínua?`,
        r: R`<p>Não. Derivável implica contínua; portanto, descontínua implica não derivável.</p>` },
    ] },
  ],
};
