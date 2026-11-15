// Seção 14.1 — Reta tangente e reta normal
import { R } from '../ui/tex.js';

export default {
  lide: R`A primeira aplicação da derivada: escrever a equação da reta que acompanha o gráfico em um ponto (tangente) e da reta perpendicular a ela (normal).`,
  objetivos: [
    R`Montar a equação da <strong>reta tangente</strong> em três passos: ponto, inclinação, equação.`,
    R`Montar a equação da <strong>reta normal</strong>, usando a inclinação \(-\dfrac{1}{f'(a)}\).`,
    R`Encontrar pontos do gráfico em que a tangente tem uma inclinação dada.`,
  ],
  blocos: [
    { h2: 'Duas retas em cada ponto' },
    { caixa: 'intuicao', titulo: 'A direção da curva e a direção “de frente”',
      html: R`
      <p>Imagine um carro percorrendo a curva. No ponto \(P\), o carro aponta na direção da <strong>tangente</strong>; se os faróis
      mostram a tangente, a porta lateral aponta na direção da <strong>normal</strong>, perpendicular a ela.
      Duas retas perpendiculares (nenhuma vertical) têm inclinações cujo produto é \(-1\): se uma tem inclinação \(m\), a outra tem \(-\dfrac{1}{m}\).</p>` },
    { caixa: 'definicao', titulo: 'Equações da tangente e da normal',
      html: R`
      <p>No ponto \((a, f(a))\), com \(f\) derivável em \(a\):</p>
      \[ \text{tangente:}\quad y - f(a) = f'(a)\,(x - a) \qquad\qquad \text{normal:}\quad y - f(a) = -\frac{1}{f'(a)}\,(x - a) \]
      <p>Se \(f'(a) = 0\), a tangente é a reta horizontal \(y = f(a)\) e a normal é a reta vertical \(x = a\).</p>` },
    { grafico: {
      x: [-2.4, 4.4], y: [-1.2, 5.2], proporcao: 0.94, alturaMax: 440,
      descricao: 'Parábola y = x²/2 com a reta tangente e a reta normal no ponto (2, 2).',
      itens: [
        { tipo: 'funcao', f: (x) => (x * x) / 2, cor: 1 },
        { tipo: 'reta', ponto: [2, 2], m: 2, cor: 3 },
        { tipo: 'reta', ponto: [2, 2], m: -0.5, cor: 2 },
        { tipo: 'ponto', x: 2, y: 2, cor: 0, rotulo: 'P', pos: 'e' },
        { tipo: 'texto', x: 3.2, y: 4.4, texto: 'tangente', cor: 3, pos: 'se' },
        { tipo: 'texto', x: -1.2, y: 3.6, texto: 'normal', cor: 2, pos: 'ne' },
      ],
      legenda: R`Tangente (verde, inclinação \(2\)) e normal (laranja, inclinação \(-\tfrac12\)) a \(y = \tfrac12 x^2\) em \(P = (2, 2)\). As escalas dos eixos são iguais, por isso o ângulo reto aparece.`,
    } },
    { caixa: 'formula', rotulo: 'Roteiro', titulo: 'Três passos',
      html: R`
      <ol>
        <li><strong>Ponto:</strong> calcule \(y_0 = f(a)\).</li>
        <li><strong>Inclinação:</strong> derive e calcule \(m = f'(a)\) (para a normal, use \(-1/m\)).</li>
        <li><strong>Equação:</strong> \(y - y_0 = m(x - a)\); se quiser, isole \(y\).</li>
      </ol>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Reta tangente a uma parábola', nivel: 'facil',
      enunciado: R`<p>Determine a equação da reta tangente ao gráfico de \(f(x) = x^2 - 3x\) no ponto de abscissa \(x = 2\).</p>`,
      confere: { reta: { f: 'x^2 - 3x', a: 2 } },
      passos: [
        { tex: R`f(2) = 2^2 - 3 \cdot 2 = -2`, txt: R`Ponto de tangência: \((2, -2)\).`, c: { valor: -2 } },
        { tex: R`f'(x) = 2x - 3 \;\Rightarrow\; f'(2) = 1`, txt: R`Derivamos e calculamos a inclinação em \(x = 2\).`, c: { valor: (m) => m.d('x^2 - 3x', 2), seg: 'ultimo' } },
        { tex: R`y - (-2) = 1 \cdot (x - 2)`, txt: R`Equação da reta que passa por \((2, -2)\) com inclinação \(1\).`, c: 1 },
        { tex: R`y = x - 4`, txt: R`Isolamos \(y\).`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Reta normal', nivel: 'medio',
      enunciado: R`<p>Determine a equação da reta normal ao gráfico de \(f(x) = \sqrt{x}\) no ponto de abscissa \(x = 4\).</p>`,
      confere: { reta: { f: 'sqrt(x)', a: 4, normal: true } },
      passos: [
        { tex: R`f(4) = \sqrt{4} = 2`, txt: R`Ponto: \((4, 2)\).`, c: { valor: 2 } },
        { tex: R`f'(x) = \frac{1}{2\sqrt{x}} \;\Rightarrow\; f'(4) = \frac{1}{4}`, txt: R`Inclinação da <em>tangente</em> em \(x = 4\).`, c: { valor: (m) => m.d('sqrt(x)', 4), seg: 'ultimo' } },
        { tex: R`m_{\text{normal}} = -\frac{1}{1/4} = -4`, txt: R`A normal é perpendicular à tangente: sua inclinação é o oposto do inverso.`, c: { valor: (m) => -1 / m.d('sqrt(x)', 4) } },
        { tex: R`y - 2 = -4(x - 4)`, txt: R`Reta por \((4, 2)\) com inclinação \(-4\).`, c: 1 },
        { tex: R`y = -4x + 18`, txt: R`Isolamos \(y\).`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Tangentes paralelas a uma reta dada', nivel: 'dificil',
      enunciado: R`<p>Encontre as retas tangentes ao gráfico de \(f(x) = x^3 - 3x\) que são paralelas à reta \(y = 9x + 2\).</p>`,
      confere: { reta: { m: 9, b: -16 } },
      passos: [
        { tex: R`f'(x) = 3x^2 - 3`, txt: R`Retas paralelas têm a mesma inclinação. Procuramos os pontos em que a inclinação da tangente, \(f'(x)\), vale \(9\).`, c: { derivada: 'x^3 - 3x' } },
        { tex: R`3x^2 - 3 = 9 \;\Rightarrow\; x^2 = 4 \;\Rightarrow\; x = \pm 2`, txt: R`Resolvemos \(f'(x) = 9\): há dois pontos.`, c: { fn: (m) => m.perto(m.d('x^3 - 3x', 2), 9) && m.perto(m.d('x^3 - 3x', -2), 9) } },
        { tex: R`f(2) = 8 - 6 = 2 \qquad f(-2) = -8 + 6 = -2`, txt: R`Os pontos de tangência são \((2, 2)\) e \((-2, -2)\).`, c: { fn: (m) => m.perto(m.num('x^3 - 3x', { x: 2 }), 2) && m.perto(m.num('x^3 - 3x', { x: -2 }), -2) } },
        { tex: R`y - 2 = 9(x - 2)`, txt: R`Tangente em \((2, 2)\); isolando \(y\), obtemos \(y = 9x - 16\).`, c: 1 },
        { tex: R`y + 2 = 9(x + 2)`, txt: R`Tangente em \((-2, -2)\); isolando \(y\), obtemos \(y = 9x + 16\).`, c: { reta: { m: 9, b: 16 } } },
      ],
    } },

    { erros: [
      { e: R`Deixar a inclinação como função: \(y - f(a) = f'(x)(x - a)\).`,
        c: R`A inclinação é o número \(f'(a)\). Uma reta tem inclinação constante.` },
      { e: R`Usar \(-f'(a)\) como inclinação da normal.`,
        c: R`É o oposto <em>do inverso</em>: \(-\dfrac{1}{f'(a)}\). Para tangente de inclinação \(2\), a normal tem inclinação \(-\tfrac12\), não \(-2\).` },
      { e: R`Usar \(f'(a)\) no lugar da ordenada do ponto: \(y - f'(a) = \dots\)`,
        c: R`O ponto é \((a, f(a))\), com a função <em>original</em>. A derivada só fornece a inclinação.` },
      { e: R`Errar o sinal quando \(a\) ou \(f(a)\) são negativos.`,
        c: R`Escreva com parênteses: \(y - (-2) = m\,(x - (-1))\), ou seja, \(y + 2 = m(x + 1)\).` },
    ] },

    { exercicios: [
      { q: R`Reta tangente a \(y = x^3\) em \(x = 1\).`,
        r: R`<p>Ponto \((1, 1)\), inclinação \(3\): \(y = 3x - 2\).</p>`,
        c: { reta: { f: 'x^3', a: 1 }, tex: R`y = 3x - 2` } },
      { q: R`Reta normal a \(y = x^2\) em \(x = 1\).`,
        r: R`<p>Tangente com inclinação \(2\); normal com inclinação \(-\tfrac12\): \(y - 1 = -\tfrac{1}{2}(x - 1)\).</p>`,
        c: { reta: { f: 'x^2', a: 1, normal: true }, tex: R`y - 1 = -\tfrac{1}{2}(x - 1)` } },
      { q: R`Reta tangente a \(y = \ln x\) em \(x = 1\).`,
        r: R`<p>Ponto \((1, 0)\), inclinação \(1\): \(y = x - 1\).</p>`,
        c: { reta: { f: 'log(x)', a: 1 }, tex: R`y = x - 1` } },
    ] },
  ],
};
