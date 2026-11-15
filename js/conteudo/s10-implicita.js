// Seção 10 — Derivação implícita
import { R } from '../ui/tex.js';

export default {
  lide: R`Nem sempre dá para isolar \(y\). A derivação implícita encontra \(\dfrac{dy}{dx}\) diretamente da equação que relaciona \(x\) e \(y\).`,
  objetivos: [
    R`Derivar os dois lados de uma equação em \(x\) e \(y\), tratando \(y\) como função de \(x\).`,
    R`Aplicar a regra da cadeia a termos como \(y^2\), \(\sen y\) e \(e^y\), e a regra do produto a termos como \(xy\).`,
    R`Calcular a inclinação da tangente a uma curva em um ponto dado.`,
  ],
  blocos: [
    { h2: 'Curvas que não são gráficos de função' },
    { html: R`
      <p>A circunferência \(x^2 + y^2 = 25\) não é o gráfico de uma função (para cada \(x\) entre \(-5\) e \(5\) há dois valores de \(y\)),
      mas claramente tem reta tangente em cada ponto. Poderíamos isolar \(y = \pm\sqrt{25 - x^2}\) e derivar cada metade.
      Em equações como \(x^3 + y^3 = 6xy\), porém, isolar \(y\) é inviável.</p>` },
    { caixa: 'intuicao', titulo: 'y é uma função de x, mesmo sem fórmula',
      html: R`
      <p>Perto de um ponto da curva, \(y\) depende de \(x\): é uma função \(y(x)\) que não conhecemos explicitamente, mas
      que satisfaz a equação. Se os dois lados da equação são iguais para todo \(x\), suas derivadas também são.
      Então derivamos os dois lados <em>em relação a \(x\)</em>, lembrando que cada \(y\) carrega uma função de \(x\) “por dentro”:
      pela regra da cadeia, derivar algo com \(y\) sempre faz aparecer um fator \(y'\).</p>` },
    { grafico: {
      x: [-7.5, 7.5], y: [-6.2, 6.2], proporcao: 0.82, alturaMax: 430,
      descricao: 'Circunferência de raio 5 centrada na origem com a reta tangente no ponto (3, 4).',
      itens: [
        { tipo: 'funcao', f: (x) => Math.sqrt(Math.max(0, 25 - x * x)), cor: 1, dominio: [-5, 5] },
        { tipo: 'funcao', f: (x) => -Math.sqrt(Math.max(0, 25 - x * x)), cor: 1, dominio: [-5, 5] },
        { tipo: 'reta', ponto: [3, 4], m: -0.75, cor: 2 },
        { tipo: 'segmento', de: [0, 0], ate: [3, 4], cor: 0, pontilhado: true },
        { tipo: 'ponto', x: 3, y: 4, cor: 2, rotulo: '(3, 4)', pos: 'ne' },
      ],
      legenda: R`Em \(x^2 + y^2 = 25\), a tangente no ponto \((3, 4)\) tem inclinação \(-\tfrac{3}{4}\) (perpendicular ao raio, de inclinação \(\tfrac43\)).`,
    } },
    { caixa: 'formula', rotulo: 'Roteiro', titulo: 'Derivação implícita',
      html: R`
      <ol>
        <li>Derive os <strong>dois lados</strong> da equação em relação a \(x\).</li>
        <li>Em cada termo com \(y\), use a regra da cadeia: \(\dfrac{d}{dx}\,y^n = n\,y^{n-1}\,y'\), \(\dfrac{d}{dx}\sen y = \cos y \cdot y'\), etc.
            Termos mistos, como \(xy\), pedem a regra do produto: \((xy)' = y + x\,y'\).</li>
        <li>Junte de um lado os termos com \(y'\) e, do outro, os demais.</li>
        <li>Coloque \(y'\) em evidência e isole.</li>
      </ol>
      <p>A resposta costuma depender de \(x\) <em>e</em> de \(y\): para obter um número, é preciso informar o ponto da curva.</p>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'A circunferência', nivel: 'facil',
      enunciado: R`<p>Determine \(\dfrac{dy}{dx}\) para \(x^2 + y^2 = 25\) e a inclinação da tangente no ponto \((3, 4)\).</p>`,
      confere: { implicita: 'x^2 + y^2 - 25', x: [-4.5, 4.5], y: [-5, 5] },
      passos: [
        { tex: R`\frac{d}{dx}\left(x^2\right) + \frac{d}{dx}\left(y^2\right) = \frac{d}{dx}(25)`, txt: R`Derivamos os dois lados em relação a \(x\), termo a termo.` },
        { tex: R`2x + 2y\,y' = 0`, txt: R`\((x^2)' = 2x\). Em \(y^2\), a regra da cadeia dá \(2y \cdot y'\) (quadrado por fora, \(y\) por dentro). A constante tem derivada zero.` },
        { tex: R`y' = -\frac{2x}{2y} = -\frac{x}{y}`, txt: R`Isolamos \(y'\).`, c: 1 },
        { tex: R`y'\Big|_{(3,\,4)} = -\frac{3}{4}`, txt: R`Substituímos as coordenadas do ponto. (Confira que \(3^2 + 4^2 = 25\): o ponto está mesmo na curva.)`, c: { valor: -0.75 } },
      ],
    } },
    { exemplo: {
      titulo: 'Fólio de Descartes: produto dos dois lados', nivel: 'medio',
      enunciado: R`<p>Determine \(y'\) para a curva \(x^3 + y^3 = 6xy\) e calcule a inclinação da tangente no ponto \((3, 3)\).</p>`,
      confere: { implicita: 'x^3 + y^3 - 6*x*y', x: [0.3, 3.1], y: [0.2, 3.2] },
      passos: [
        { tex: R`3x^2 + 3y^2\,y' = 6y + 6x\,y'`, txt: R`À esquerda, potência e cadeia: \((y^3)' = 3y^2 y'\). À direita, regra do produto: \((6xy)' = 6(1 \cdot y + x \cdot y')\).` },
        { tex: R`3y^2\,y' - 6x\,y' = 6y - 3x^2`, txt: R`Levamos os termos com \(y'\) para a esquerda e os demais para a direita.` },
        { tex: R`y' = \frac{6y - 3x^2}{3y^2 - 6x} = \frac{2y - x^2}{y^2 - 2x}`, txt: R`Colocamos \(y'\) em evidência, dividimos e simplificamos por \(3\).`, c: 1 },
        { tex: R`y'\Big|_{(3,\,3)} = \frac{2 \cdot 3 - 3^2}{3^2 - 2 \cdot 3} = \frac{-3}{3} = -1`, txt: R`No ponto \((3, 3)\), que pertence à curva (\(27 + 27 = 54 = 6 \cdot 9\)).`, c: { valor: -1 } },
      ],
    } },
    { exemplo: {
      titulo: 'Com exponencial', nivel: 'dificil',
      enunciado: R`<p>Determine \(y'\) para \(e^{y} + xy = e\) e a inclinação da tangente no ponto \((0, 1)\).</p>`,
      confere: { implicita: 'e^y + x*y - e', x: [-0.8, 2.5], y: [-2, 3] },
      passos: [
        { tex: R`e^{y}\,y' + y + x\,y' = 0`, txt: R`\((e^y)' = e^y \cdot y'\) (cadeia), \((xy)' = y + x\,y'\) (produto), e a constante \(e\) tem derivada zero.` },
        { tex: R`\left(e^{y} + x\right) y' = -y`, txt: R`Agrupamos os termos com \(y'\) e o colocamos em evidência.` },
        { tex: R`y' = -\frac{y}{e^{y} + x}`, txt: R`Isolamos \(y'\).`, c: 1 },
        { tex: R`y'\Big|_{(0,\,1)} = -\frac{1}{e^{1} + 0} = -\frac{1}{e}`, txt: R`No ponto \((0, 1)\): de fato \(e^1 + 0 \cdot 1 = e\). A inclinação é \(-1/e \approx -0{,}37\).`, c: { valor: '-1/e' } },
      ],
    } },

    { erros: [
      { e: R`Esquecer o \(y'\): \(\dfrac{d}{dx}\,y^2 = 2y\).`,
        c: R`\(y\) é função de \(x\): \(\dfrac{d}{dx}\,y^2 = 2y\,y'\) (regra da cadeia).` },
      { e: R`Derivar \(xy\) como \(y'\) ou como \(1 \cdot y'\).`,
        c: R`É um produto de duas funções de \(x\): \((xy)' = 1 \cdot y + x \cdot y'\).` },
      { e: R`Deixar a constante do lado direito sem derivar: \(2x + 2y\,y' = 25\).`,
        c: R`Deriva-se os dois lados: \((25)' = 0\).` },
      { e: R`Colocar \(y'\) também nos termos só com \(x\): \((x^2)' = 2x\,y'\).`,
        c: R`\(y'\) só aparece ao derivar algo que depende de \(y\). \((x^2)' = 2x\).` },
    ] },

    { exercicios: [
      { q: R`Determine \(y'\) para \(x^2 - y^2 = 7\).`,
        r: R`<p>\(2x - 2y\,y' = 0\), logo \(y' = \dfrac{x}{y}\).</p>`,
        c: { implicita: 'x^2 - y^2 - 7', x: [2.8, 6], y: [0.3, 6], tex: R`y' = \dfrac{x}{y}` } },
      { q: R`Determine \(y'\) para \(xy = 12\) e seu valor no ponto \((3, 4)\).`,
        r: R`<p>\(y + x\,y' = 0\), logo \(y' = -\dfrac{y}{x}\). No ponto \((3, 4)\): \(-\dfrac{4}{3}\).</p>`,
        c: { implicita: 'x*y - 12', x: [1, 6], y: [1, 13], tex: R`y' = -\dfrac{y}{x}` } },
      { q: R`Determine \(y'\) para \(\sqrt{x} + \sqrt{y} = 4\).`,
        r: R`<p>\(\dfrac{1}{2\sqrt{x}} + \dfrac{y'}{2\sqrt{y}} = 0\), logo \(y' = -\dfrac{\sqrt{y}}{\sqrt{x}}\).</p>`,
        c: { implicita: 'sqrt(x) + sqrt(y) - 4', x: [0.5, 12], y: [0.1, 16], tex: R`y' = -\dfrac{\sqrt{y}}{\sqrt{x}}` } },
    ] },
  ],
};
