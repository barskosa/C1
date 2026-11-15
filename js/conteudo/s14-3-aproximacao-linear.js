// Seção 14.3 — Aproximação linear e diferenciais
import { R } from '../ui/tex.js';

export default {
  lide: R`Perto do ponto de tangência, a reta tangente é praticamente o próprio gráfico. Isso permite estimar valores “difíceis” com uma conta de primeiro grau e medir como erros se propagam.`,
  objetivos: [
    R`Construir a <strong>linearização</strong> \(L(x) = f(a) + f'(a)(x - a)\).`,
    R`Estimar valores como \(\sqrt{4{,}1}\) ou \((1{,}02)^5\) sem calculadora.`,
    R`Usar <strong>diferenciais</strong> para estimar variações e erros de medida.`,
  ],
  blocos: [
    { h2: 'A reta tangente como substituta da função' },
    { caixa: 'intuicao', titulo: 'Troque a curva pela reta (só por perto)',
      html: R`
      <p>Calcular \(\sqrt{4{,}1}\) de cabeça é difícil; \(\sqrt{4}\) é fácil. Como \(4{,}1\) está pertinho de \(4\), podemos caminhar
      sobre a reta tangente ao gráfico de \(\sqrt{x}\) em \(x = 4\), em vez de caminhar sobre a curva. O erro é minúsculo
      enquanto ficarmos perto do ponto de tangência, e cresce conforme nos afastamos.</p>` },
    { widget: 'linearizacao',
      legenda: R`Mova \(\Delta x\): perto de \(a\), o valor na reta tangente \(L(x)\) quase coincide com \(f(x)\); longe, o erro cresce.` },
    { caixa: 'definicao', titulo: 'Linearização (aproximação linear)',
      html: R`
      <p>A linearização de \(f\) em \(a\) é a função cujo gráfico é a reta tangente em \((a, f(a))\):</p>
      \[ L(x) = f(a) + f'(a)\,(x - a), \qquad\text{e}\qquad f(x) \approx L(x) \ \text{ para } x \text{ próximo de } a. \]` },
    { caixa: 'definicao', titulo: 'Diferenciais',
      html: R`
      <p>Se \(y = f(x)\) e \(x\) sofre uma pequena variação \(dx = \Delta x\), a <strong>diferencial</strong> de \(y\) é</p>
      \[ dy = f'(x)\,dx. \]
      <p>\(dy\) é a variação medida <em>sobre a reta tangente</em>; \(\Delta y = f(x + \Delta x) - f(x)\) é a variação real. Para \(dx\) pequeno, \(\Delta y \approx dy\).
      Se \(dx\) é o erro em uma medida de \(x\), então \(dy\) estima o erro propagado para \(y\), e \(\dfrac{dy}{y}\) é o erro relativo.</p>` },
    { tabela: {
      classe: 'tabela--centro',
      cab: [R`Perto de \(x = 0\)`, 'Aproximação linear'],
      linhas: [
        [R`\((1 + x)^n\)`, R`\(1 + nx\)`],
        [R`\(\sqrt{1 + x}\)`, R`\(1 + \tfrac{x}{2}\)`],
        [R`\(e^x\)`, R`\(1 + x\)`],
        [R`\(\ln(1 + x)\)`, R`\(x\)`],
        [R`\(\sen x\), \(\tg x\)`, R`\(x\)`],
        [R`\(\cos x\)`, R`\(1\)`],
      ],
      legenda: 'Aproximações muito usadas em Física e Engenharia (x em radianos nas trigonométricas).',
    } },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Estimando uma raiz quadrada', nivel: 'facil',
      enunciado: R`<p>Use uma aproximação linear para estimar \(\sqrt{4{,}1}\).</p>`,
      confere: { valor: (m) => m.num('sqrt(x)', { x: 4 }) + m.d('sqrt(x)', 4) * 0.1 },
      passos: [
        { tex: R`f(x) = \sqrt{x}, \qquad a = 4`, txt: R`Escolhemos a função e um ponto próximo de \(4{,}1\) em que ela é fácil de calcular.` },
        { tex: R`f(4) = 2 \qquad f'(x) = \frac{1}{2\sqrt{x}} \;\Rightarrow\; f'(4) = \frac{1}{4}`, txt: R`Valor e inclinação no ponto \(a = 4\).`, c: { valor: (m) => m.d('sqrt(x)', 4), seg: 'ultimo' } },
        { tex: R`L(x) = 2 + \frac{1}{4}(x - 4)`, txt: R`Linearização: \(L(x) = f(a) + f'(a)(x - a)\).`, c: { igual: '2 + (x - 4)/4', seg: 'ultimo' } },
        { tex: R`\sqrt{4{,}1} \approx L(4{,}1) = 2 + \frac{1}{4} \cdot 0{,}1 = 2{,}025`, txt: R`Calculamos na reta. O valor real é \(2{,}02485\ldots\): erro menor que \(0{,}0002\).`, c: 1, seg: [2, 3] },
      ],
    } },
    { exemplo: {
      titulo: 'Potência de um número próximo de 1', nivel: 'medio',
      enunciado: R`<p>Estime \((1{,}02)^5\) usando a linearização de \(f(x) = x^5\) em \(a = 1\).</p>`,
      confere: { valor: (m) => 1 + m.d('x^5', 1) * 0.02 },
      passos: [
        { tex: R`f(1) = 1 \qquad f'(x) = 5x^4 \;\Rightarrow\; f'(1) = 5`, txt: R`Valor e inclinação em \(a = 1\).`, c: { valor: (m) => m.d('x^5', 1), seg: 'ultimo' } },
        { tex: R`L(x) = 1 + 5(x - 1)`, txt: R`Linearização em \(a = 1\).`, c: { igual: '1 + 5*(x - 1)', seg: 'ultimo' } },
        { tex: R`(1{,}02)^5 \approx L(1{,}02) = 1 + 5 \cdot 0{,}02 = 1{,}1`, txt: R`O valor exato é \(1{,}10408\ldots\) É a regra prática \((1 + x)^n \approx 1 + nx\): 2% de aumento, cinco vezes, dá cerca de 10%.`, c: 1, seg: [2, 3] },
      ],
    } },
    { exemplo: {
      titulo: 'Propagação de erro com diferenciais', nivel: 'dificil',
      enunciado: R`<p>A aresta de um cubo foi medida em 10 cm, com erro máximo de 0,1 cm. Estime o erro máximo no volume calculado e o erro relativo.</p>`,
      confere: { valor: (m) => m.d('x^3', 10) * 0.1 },
      passos: [
        { tex: R`V = x^3 \;\Rightarrow\; dV = 3x^2\,dx`, txt: R`Volume em função da aresta e sua diferencial.` },
        { tex: R`dV = 3 \cdot 10^2 \cdot 0{,}1 = 30 \,\text{cm}^3`, txt: R`Com \(x = 10\) e \(dx = 0{,}1\): o erro no volume pode chegar a cerca de 30 cm³ (em um volume de 1000 cm³).`, c: 1 },
        { tex: R`\frac{dV}{V} = \frac{3x^2\,dx}{x^3} = 3\,\frac{dx}{x} = 3 \cdot \frac{0{,}1}{10} = 0{,}03`, txt: R`Erro relativo: 3%. Regra geral: um erro relativo de 1% na aresta vira cerca de 3% no volume (o expoente multiplica o erro relativo).`, c: { valor: 0.03 }, seg: [-2, -1] },
      ],
    } },

    { erros: [
      { e: R`Escolher um ponto \(a\) longe do valor desejado, ou em que \(f(a)\) também é difícil de calcular.`,
        c: R`\(a\) deve estar próximo de \(x\) <em>e</em> tornar \(f(a)\) e \(f'(a)\) fáceis (para \(\sqrt{4{,}1}\), use \(a = 4\)).` },
      { e: R`Esquecer o termo \(f(a)\): escrever \(f(x) \approx f'(a)(x - a)\).`,
        c: R`\(f'(a)(x - a)\) é só a <em>variação</em>. O valor estimado é \(f(a) + f'(a)(x - a)\).` },
      { e: R`Usar graus em aproximações trigonométricas, como \(\sen 2° \approx 2\).`,
        c: R`Converta para radianos: \(2° = \tfrac{\pi}{90}\) rad, e \(\sen 2° \approx \tfrac{\pi}{90} \approx 0{,}0349\).` },
      { e: R`Tratar a aproximação como igualdade válida para qualquer \(x\).`,
        c: R`É local: quanto mais longe de \(a\), maior o erro. \(\sqrt{9} = 3\), mas a linearização em \(a = 4\) dá \(L(9) = 3{,}25\).` },
    ] },

    { exercicios: [
      { q: R`Estime \(\sqrt[3]{8{,}12}\) com a linearização de \(\sqrt[3]{x}\) em \(a = 8\).`,
        r: R`<p>\(f(8) = 2\) e \(f'(8) = \dfrac{1}{3 \cdot 4} = \dfrac{1}{12}\). Logo \(\sqrt[3]{8{,}12} \approx 2 + \dfrac{0{,}12}{12} = 2{,}01\).</p>`,
        c: { valor: (m) => 2 + m.d('nthRoot(x, 3)', 8) * 0.12, tex: R`2 + \dfrac{0{,}12}{12} = 2{,}01`, seg: 'tudo' } },
      { q: R`Use diferenciais para estimar a variação da área de um círculo quando o raio passa de 10 cm para 10,05 cm.`,
        r: R`<p>\(A = \pi r^2\), \(dA = 2\pi r\,dr = 2\pi \cdot 10 \cdot 0{,}05 = \pi \approx 3{,}14\) cm².</p>`,
        c: { valor: (m) => m.d('pi*r^2', 10, 'r') * 0.05, tex: R`2\pi \cdot 10 \cdot 0{,}05 = \pi`, seg: 'tudo' } },
      { q: R`Qual é a linearização de \(f(x) = e^x\) em \(a = 0\)? Use-a para estimar \(e^{0{,}1}\).`,
        r: R`<p>\(L(x) = 1 + x\), então \(e^{0{,}1} \approx 1{,}1\) (valor real: \(1{,}10517\ldots\)).</p>`,
        c: { igual: '1 + x', tex: R`L(x) = 1 + x` } },
    ] },
  ],
};
