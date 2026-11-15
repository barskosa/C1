// Seção 3 — Interpretação geométrica
import { R } from '../ui/tex.js';

export default {
  lide: R`A derivada vista no gráfico: mova \(h\) em direção a zero e acompanhe a reta secante se transformar na reta tangente.`,
  objetivos: [
    R`Visualizar o quociente de Newton como <strong>inclinação da secante</strong> e a derivada como <strong>inclinação da tangente</strong>.`,
    R`Escrever a equação da reta tangente em um ponto.`,
    R`Ler no gráfico o <strong>sinal</strong> e o <strong>tamanho</strong> da derivada.`,
  ],
  blocos: [
    { h2: 'A secante que vira tangente' },
    { html: R`
      <p>Fixe um ponto \(P = (a, f(a))\) no gráfico e escolha um segundo ponto \(Q = (a + h, f(a + h))\). A reta que
      passa por \(P\) e \(Q\) é uma <span class="termo">secante</span>, e sua inclinação é o quociente de Newton:</p>
      \[ m_{\text{sec}} = \frac{f(a + h) - f(a)}{h}. \]
      <p>No gráfico abaixo, arraste o controle de \(h\) (ou o próprio ponto \(Q\)) em direção a zero, pelos dois lados.</p>` },
    { widget: 'secante',
      legenda: R`Secante (laranja) pelos pontos \(P\) e \(Q\). Quando \(h \to 0\), o quociente de Newton se aproxima de \(f'(a)\) e a secante se aproxima da tangente (verde).` },
    { caixa: 'intuicao', titulo: 'O que observar',
      html: R`
      <ul>
        <li>Com \(h\) grande, a secante “corta” a curva e sua inclinação pode ser bem diferente da direção do gráfico em \(P\).</li>
        <li>Conforme \(h\) diminui, \(Q\) desliza sobre a curva até quase encostar em \(P\), e a secante gira até uma posição-limite.</li>
        <li>Em \(h = 0\) não há secante (um ponto só não define uma reta) e o quociente vira \(0/0\). A tangente é o <em>limite</em> das secantes, não uma secante especial.</li>
        <li>O limite precisa ser o mesmo vindo pela direita (\(h > 0\)) e pela esquerda (\(h < 0\)).</li>
      </ul>` },
    { caixa: 'definicao', titulo: 'Reta tangente',
      html: R`
      <p>Se \(f\) é derivável em \(a\), a <strong>reta tangente</strong> ao gráfico de \(f\) no ponto \((a, f(a))\) é a reta
      que passa por esse ponto com inclinação \(f'(a)\):</p>
      \[ y - f(a) = f'(a)\,(x - a). \]` },

    { h2: 'Lendo a derivada no gráfico' },
    { html: R`<p>Como \(f'(a)\) é uma inclinação, dá para estimar seu sinal e seu tamanho só de olhar para o gráfico de \(f\):</p>` },
    { tabela: {
      cab: ['No gráfico de f, perto de a', 'Tangente', 'Derivada'],
      linhas: [
        ['A curva sobe da esquerda para a direita', 'inclinada para cima', R`\(f'(a) > 0\)`],
        ['A curva desce', 'inclinada para baixo', R`\(f'(a) < 0\)`],
        ['Topo de morro ou fundo de vale (suave)', 'horizontal', R`\(f'(a) = 0\)`],
        ['A curva é muito íngreme', 'quase vertical', R`\(|f'(a)|\) grande`],
        ['A curva é quase plana', 'quase horizontal', R`\(|f'(a)|\) pequeno`],
      ],
    } },
    { grafico: {
      x: [-2.6, 3.4], y: [-3.2, 4.4],
      descricao: 'Curva com três retas tangentes: uma inclinada para cima, uma horizontal em um ponto de máximo e uma inclinada para baixo.',
      itens: [
        { tipo: 'funcao', f: (x) => -(x ** 3) / 3 + x + 1, cor: 1 },
        { tipo: 'reta', ponto: [-0.2, 0.8027], m: 0.96, cor: 3, fino: true },
        { tipo: 'reta', ponto: [1, 5 / 3], m: 0, cor: 0, fino: true },
        { tipo: 'reta', ponto: [2, 1 / 3], m: -3, cor: 2, fino: true },
        { tipo: 'ponto', x: -0.2, y: 0.8027, cor: 3, rotulo: 'f′ > 0', pos: 'nw' },
        { tipo: 'ponto', x: 1, y: 5 / 3, cor: 0, rotulo: 'f′ = 0', pos: 'n' },
        { tipo: 'ponto', x: 2, y: 1 / 3, cor: 2, rotulo: 'f′ < 0', pos: 'ne' },
      ],
      legenda: R`O sinal de \(f'\) acompanha o comportamento de \(f\): subindo, parando (tangente horizontal) e descendo.`,
    } },
    { caixa: 'nota', titulo: 'Tangente não é “a reta que toca em um só ponto”',
      html: R`<p>Essa descrição funciona para circunferências, mas não em geral. A tangente em \(P\) pode cruzar o gráfico
      em outros pontos (e até atravessá-lo no próprio \(P\), como em \(y = x^3\) na origem). O que a caracteriza é ter
      a <em>mesma direção</em> da curva em \(P\), isto é, a inclinação \(f'(a)\).</p>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Inclinações de secantes se aproximando', nivel: 'facil',
      enunciado: R`<p>Para \(f(x) = x^2\) e \(a = 1\), calcule a inclinação da secante para \(h = 1\), \(h = 0{,}1\) e \(h = 0{,}01\). De que valor elas se aproximam?</p>`,
      confere: { valor: (m) => m.d('x^2', 1) },
      passos: [
        { tex: R`m_{\text{sec}} = \frac{(1 + h)^2 - 1^2}{h}`, txt: R`Escrevemos o quociente de Newton com \(a = 1\): os pontos são \(P = (1, 1)\) e \(Q = (1 + h, (1 + h)^2)\).` },
        { tex: R`\frac{2^2 - 1}{1} = 3`, txt: R`Com \(h = 1\): secante por \((1, 1)\) e \((2, 4)\).`, c: { valor: '((1 + 1)^2 - 1)/1', seg: 'tudo' } },
        { tex: R`\frac{1{,}21 - 1}{0{,}1} = 2{,}1`, txt: R`Com \(h = 0{,}1\): secante por \((1, 1)\) e \((1{,}1;\ 1{,}21)\).`, c: { valor: '((1 + 0.1)^2 - 1)/0.1', seg: 'tudo' } },
        { tex: R`\frac{1{,}0201 - 1}{0{,}01} = 2{,}01`, txt: R`Com \(h = 0{,}01\): secante por \((1, 1)\) e \((1{,}01;\ 1{,}0201)\).`, c: { valor: '((1 + 0.01)^2 - 1)/0.01', seg: 'tudo' } },
        { tex: R`m_{\text{sec}} = \frac{2h + h^2}{h} = 2 + h`, txt: R`Simplificando o quociente para um \(h\) qualquer, vemos o padrão: as inclinações \(3\); \(2{,}1\); \(2{,}01\) são todas da forma \(2 + h\).`, c: { igual: '((1 + h)^2 - 1)/h', vars: ['h'] } },
        { tex: R`f'(1) = \lim_{h \to 0} (2 + h) = 2`, txt: R`Quando \(h \to 0\), as inclinações das secantes tendem a \(2\), a inclinação da tangente em \(x = 1\).`, c: 1, seg: 'ultimo' },
      ],
    } },
    { exemplo: {
      titulo: 'Equação da reta tangente', nivel: 'medio',
      enunciado: R`<p>Escreva a equação da reta tangente ao gráfico de \(f(x) = x^2\) no ponto de abscissa \(x = 1\).</p>`,
      confere: { reta: { f: 'x^2', a: 1 } },
      grafico: {
        x: [-1.6, 3.2], y: [-2, 6.5], proporcao: 0.5,
        descricao: 'Parábola y = x² com a reta tangente y = 2x − 1 no ponto (1, 1).',
        itens: [
          { tipo: 'funcao', f: (x) => x * x, cor: 1 },
          { tipo: 'reta', ponto: [1, 1], m: 2, cor: 3 },
          { tipo: 'ponto', x: 1, y: 1, cor: 3, rotulo: '(1, 1)', pos: 'se' },
        ],
      },
      passos: [
        { tex: R`f(1) = 1^2 = 1`, txt: R`Ponto de tangência: \((1, 1)\).`, c: { valor: 1 } },
        { tex: R`f'(1) = 2`, txt: R`Inclinação: é o limite calculado no exemplo anterior.`, c: { valor: (m) => m.d('x^2', 1) } },
        { tex: R`y - 1 = 2(x - 1)`, txt: R`Usamos \(y - f(a) = f'(a)(x - a)\), a equação da reta que passa por \((1, 1)\) com inclinação \(2\).`, c: 1 },
        { tex: R`y = 2x - 1`, txt: R`Isolando \(y\). Confira: em \(x = 1\) a reta dá \(y = 1\), o mesmo valor da função.`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Onde a tangente é horizontal?', nivel: 'dificil',
      enunciado: R`<p>Em que ponto do gráfico de \(f(x) = x^2 - 4x\) a reta tangente é horizontal?</p>`,
      confere: { derivada: 'x^2 - 4x' },
      passos: [
        { tex: R`\frac{f(x + h) - f(x)}{h} = \frac{2xh + h^2 - 4h}{h} = 2x + h - 4`, txt: R`Quociente de Newton em um ponto \(x\) qualquer, já simplificado (os termos \(x^2\) e \(-4x\) cancelam).`, c: { igual: '((x + h)^2 - 4*(x + h) - (x^2 - 4x))/h', vars: ['x', 'h'] } },
        { tex: R`f'(x) = \lim_{h \to 0} (2x + h - 4) = 2x - 4`, txt: R`A inclinação da tangente em cada ponto.`, c: 1, seg: 'ultimo' },
        { tex: R`2x - 4 = 0 \;\Rightarrow\; x = 2`, txt: R`Tangente horizontal significa inclinação zero: resolvemos \(f'(x) = 0\).`, c: { valor: 2 }, seg: 'ultimo' },
        { tex: R`f(2) = 2^2 - 4 \cdot 2 = -4`, txt: R`O ponto é \((2, -4)\), justamente o vértice da parábola: no fundo do “vale” a tangente é horizontal.`, c: { valor: -4 } },
      ],
    } },

    { erros: [
      { e: R`Confundir o valor da função com o valor da derivada: “em \(x = 1\) a inclinação de \(f(x) = x^2\) é \(1\)”.`,
        c: R`\(f(1) = 1\) é a <em>altura</em> do ponto; a inclinação é \(f'(1) = 2\).` },
      { e: R`Achar que a tangente não pode cruzar o gráfico em outro ponto.`,
        c: R`Pode. A tangente a \(y = x^3 - 3x\) em \(x = 1\) é \(y = -2\), que reencontra a curva em \(x = -2\).` },
      { e: R`Usar \(h\) negativo e inverter o sinal da inclinação “porque andou para a esquerda”.`,
        c: R`O quociente \(\dfrac{f(a + h) - f(a)}{h}\) já cuida do sinal: numerador e denominador mudam de sinal juntos.` },
      { e: R`Escrever a reta tangente como \(y = f'(x)(x - a) + f(a)\), com \(f'(x)\) variável.`,
        c: R`A inclinação é o <em>número</em> \(f'(a)\), calculado no ponto de tangência.` },
    ] },

    { exercicios: [
      { q: R`Qual é a inclinação da secante ao gráfico de \(f(x) = x^3\) pelos pontos de abscissas \(1\) e \(1{,}1\)?`,
        r: R`<p>\(\dfrac{1{,}331 - 1}{0{,}1} = 3{,}31\), já próximo de \(f'(1) = 3\).</p>`,
        c: { valor: '(1.1^3 - 1)/0.1', tex: R`\dfrac{1{,}331 - 1}{0{,}1} = 3{,}31`, seg: 'tudo' } },
      { q: R`Sabendo que \(f'(x) = 2x\) para \(f(x) = x^2\), escreva a reta tangente em \(x = -1\).`,
        r: R`<p>Ponto \((-1, 1)\) e inclinação \(-2\): \(y - 1 = -2(x + 1)\), ou seja, \(y = -2x - 1\).</p>`,
        c: [{ reta: { f: 'x^2', a: -1 }, tex: R`y - 1 = -2(x + 1)` }, { reta: { f: 'x^2', a: -1 }, tex: R`y = -2x - 1` }] },
      { q: R`Uma função tem \(f'(2) = 0\) e \(f'(x) < 0\) para \(x\) um pouco menor que \(2\), \(f'(x) > 0\) para \(x\) um pouco maior. Como é o gráfico perto de \(x = 2\)?`,
        r: R`<p>A função desce até \(x = 2\), tem tangente horizontal ali e depois sobe: é um fundo de vale (mínimo local).</p>` },
    ] },
  ],
};
