// Seção 11 — Derivação logarítmica
import { R } from '../ui/tex.js';

export default {
  lide: R`Aplicar \(\ln\) dos dois lados antes de derivar transforma expoentes em fatores e produtos em somas. É o único caminho para funções como \(x^x\).`,
  objetivos: [
    R`Derivar funções com variável na base <strong>e</strong> no expoente, como \(x^x\) e \(x^{\sen x}\).`,
    R`Usar o logaritmo para simplificar produtos e quocientes com muitos fatores.`,
    R`Seguir o roteiro: aplicar \(\ln\), derivar implicitamente e multiplicar por \(y\).`,
  ],
  blocos: [
    { h2: 'Quando nenhuma regra serve' },
    { html: R`
      <p>Para \(y = x^x\), a regra da potência exigiria expoente constante, e a regra da exponencial exigiria base constante.
      Nenhuma se aplica. O logaritmo resolve o impasse porque “derruba” o expoente: \(\ln(x^x) = x \ln x\), que é um produto comum.</p>` },
    { caixa: 'intuicao', titulo: 'O logaritmo simplifica antes de você derivar',
      html: R`
      <p>As propriedades do logaritmo trocam operações difíceis por fáceis:</p>
      \[ \ln(AB) = \ln A + \ln B \qquad \ln\frac{A}{B} = \ln A - \ln B \qquad \ln A^{r} = r \ln A \]
      <p>Produto vira soma, quociente vira diferença, potência vira multiplicação. E derivar \(\ln y\) é simples:
      pela regra da cadeia, \(\big(\ln y\big)' = \dfrac{y'}{y}\). No fim, basta multiplicar por \(y\) para recuperar \(y'\).</p>` },
    { caixa: 'formula', rotulo: 'Roteiro', titulo: 'Derivação logarítmica',
      html: R`
      <ol>
        <li>Escreva \(y = f(x)\) e aplique \(\ln\) nos dois lados: \(\ln y = \ln f(x)\).</li>
        <li>Simplifique o lado direito com as propriedades do logaritmo.</li>
        <li>Derive os dois lados em relação a \(x\): à esquerda aparece \(\dfrac{y'}{y}\).</li>
        <li>Multiplique por \(y\) e troque \(y\) pela expressão original.</li>
      </ol>
      <p>Caso geral: \(\big(f^{\,g}\big)' = f^{\,g}\left( g' \ln f + g\,\dfrac{f'}{f} \right)\), válido para \(f(x) > 0\).</p>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'O clássico x elevado a x', nivel: 'facil',
      enunciado: R`<p>Derive \(y = x^x\), para \(x > 0\).</p>`,
      confere: { derivada: 'x^x', dom: [0.3, 3] },
      passos: [
        { tex: R`\ln y = \ln\left(x^x\right) = x \ln x`, txt: R`Aplicamos \(\ln\) nos dois lados e usamos \(\ln A^r = r \ln A\): o expoente desce multiplicando.`, c: { igual: 'log(x^x)', dom: [0.3, 3] }, seg: 'ultimo' },
        { tex: R`\frac{y'}{y} = 1 \cdot \ln x + x \cdot \frac{1}{x} = \ln x + 1`, txt: R`Derivamos os dois lados. À esquerda, regra da cadeia: \((\ln y)' = y'/y\). À direita, regra do produto.`, c: { derivada: 'x*log(x)', dom: [0.3, 3] } },
        { tex: R`y' = y\,(\ln x + 1)`, txt: R`Multiplicamos os dois lados por \(y\).` },
        { tex: R`y' = x^x(\ln x + 1)`, txt: R`Trocamos \(y\) por \(x^x\).`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Expoente trigonométrico', nivel: 'medio',
      enunciado: R`<p>Derive \(y = x^{\sen x}\), para \(x > 0\).</p>`,
      confere: { derivada: 'x^sin(x)', dom: [0.3, 3] },
      passos: [
        { tex: R`\ln y = \sen x \cdot \ln x`, txt: R`Aplicamos \(\ln\): o expoente \(\sen x\) desce multiplicando.`, c: { igual: 'log(x^sin(x))', dom: [0.3, 3] } },
        { tex: R`\frac{y'}{y} = \cos x \cdot \ln x + \sen x \cdot \frac{1}{x}`, txt: R`Derivamos: à direita, regra do produto com \(u = \sen x\) e \(v = \ln x\).`, c: { derivada: 'sin(x)*log(x)', dom: [0.3, 3] } },
        { tex: R`y' = x^{\sen x}\left(\cos x \ln x + \frac{\sen x}{x}\right)`, txt: R`Multiplicamos por \(y = x^{\sen x}\).`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Produto e quociente com muitos fatores', nivel: 'dificil',
      enunciado: R`<p>Derive \(y = \dfrac{x^3\sqrt{x + 1}}{(2x + 1)^4}\), para \(x > 0\).</p>`,
      confere: { derivada: 'x^3*sqrt(x + 1)/(2x + 1)^4', dom: [0.3, 3] },
      passos: [
        { tex: R`\ln y = 3\ln x + \tfrac{1}{2}\ln(x + 1) - 4\ln(2x + 1)`, txt: R`Aplicamos \(\ln\) e abrimos tudo: produto vira soma, quociente vira diferença, expoentes descem (a raiz é expoente \(\tfrac12\)).`, c: { igual: 'log(x^3*sqrt(x + 1)/(2x + 1)^4)', dom: [0.3, 3] } },
        { tex: R`\frac{y'}{y} = \frac{3}{x} + \frac{1}{2(x + 1)} - \frac{8}{2x + 1}`, txt: R`Derivamos termo a termo com \(\big(\ln u\big)' = u'/u\). No último termo, \(4 \cdot \dfrac{2}{2x + 1}\).`, c: { derivada: 'log(x^3*sqrt(x + 1)/(2x + 1)^4)', dom: [0.3, 3] } },
        { tex: R`y' = \frac{x^3\sqrt{x + 1}}{(2x + 1)^4}\left(\frac{3}{x} + \frac{1}{2(x + 1)} - \frac{8}{2x + 1}\right)`, txt: R`Multiplicamos por \(y\). Sem o logaritmo, seria preciso combinar as regras do quociente, do produto e da cadeia em uma conta bem mais longa.`, c: 1 },
      ],
    } },

    { erros: [
      { e: R`Tratar \(x^x\) como potência: \((x^x)' = x \cdot x^{x-1}\).`,
        c: R`A regra da potência exige expoente constante. \((x^x)' = x^x(\ln x + 1)\).` },
      { e: R`Tratar \(x^x\) como exponencial: \((x^x)' = x^x \ln x\).`,
        c: R`A regra de \(a^x\) exige base constante. Falta a parcela que vem de derivar a base.` },
      { e: R`Parar em \(\dfrac{y'}{y} = \ln x + 1\) e dar isso como resposta.`,
        c: R`Isso é \(y'/y\). Falta multiplicar por \(y\): \(y' = x^x(\ln x + 1)\).` },
      { e: R`“Abrir” o logaritmo de uma soma: \(\ln(x^2 + 1) = \ln x^2 + \ln 1\).`,
        c: R`As propriedades valem para produto, quociente e potência. \(\ln(A + B)\) não se simplifica.` },
    ] },

    { exercicios: [
      { q: R`Derive \(y = x^{2x}\), para \(x > 0\).`,
        r: R`<p>\(\ln y = 2x \ln x\), então \(\dfrac{y'}{y} = 2\ln x + 2\) e \(y' = 2x^{2x}(\ln x + 1)\).</p>`,
        c: { derivada: 'x^(2x)', dom: [0.3, 2.5], tex: R`y' = 2x^{2x}(\ln x + 1)` } },
      { q: R`Derive \(y = (\sen x)^x\), para \(0 < x < \pi\).`,
        r: R`<p>\(\ln y = x \ln(\sen x)\), então \(y' = (\sen x)^x\left(\ln(\sen x) + x\cotg x\right)\).</p>`,
        c: { derivada: 'sin(x)^x', dom: [0.3, 2.8], tex: R`y' = (\sen x)^x\left(\ln(\sen x) + x\cotg x\right)` } },
      { q: R`Derive \(y = x^{1/x}\), para \(x > 0\).`,
        r: R`<p>\(\ln y = \dfrac{\ln x}{x}\), então \(\dfrac{y'}{y} = \dfrac{1 - \ln x}{x^2}\) e \(y' = x^{1/x} \cdot \dfrac{1 - \ln x}{x^2}\).</p>`,
        c: { derivada: 'x^(1/x)', dom: [0.4, 4], tex: R`y' = x^{1/x} \cdot \dfrac{1 - \ln x}{x^2}` } },
    ] },
  ],
};
