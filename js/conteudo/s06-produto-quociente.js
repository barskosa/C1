// Seção 6 — Regras do produto e do quociente
import { R } from '../ui/tex.js';

export default {
  lide: R`A derivada de um produto <strong>não</strong> é o produto das derivadas. Veja por quê e aprenda as duas regras que resolvem multiplicações e divisões de funções.`,
  objetivos: [
    R`Aplicar a <strong>regra do produto</strong> \((uv)' = u'v + uv'\).`,
    R`Aplicar a <strong>regra do quociente</strong> sem errar a ordem nem o sinal.`,
    R`Decidir quando vale mais a pena simplificar a expressão antes de derivar.`,
  ],
  blocos: [
    { h2: 'Por que não basta derivar cada fator?' },
    { html: R`
      <p>Teste com \(f(x) = x^2 \cdot x^3 = x^5\). A derivada correta é \(5x^4\). Se multiplicássemos as derivadas dos
      fatores, obteríamos \(2x \cdot 3x^2 = 6x^3\), que é outra função. Logo, \((uv)' \neq u'v'\).</p>` },
    { caixa: 'intuicao', titulo: 'A área de um retângulo que cresce',
      html: R`
      <p>Pense em \(u\) e \(v\) como os lados de um retângulo de área \(A = u \cdot v\). Se os lados aumentam um pouquinho,
      \(\Delta u\) e \(\Delta v\), a área ganha duas faixas, \(\Delta u \cdot v\) e \(u \cdot \Delta v\), mais um cantinho
      \(\Delta u \cdot \Delta v\), que é desprezível (produto de duas quantidades pequenas). Por isso a taxa de variação da área é
      “variação de \(u\) vezes \(v\)” <em>mais</em> “\(u\) vezes variação de \(v\)”.</p>` },
    { grafico: {
      x: [-0.4, 6.2], y: [-0.5, 4.3], proporcao: 0.6, grade: false, eixos: false, marcas: false,
      descricao: 'Retângulo de lados u e v com duas faixas e um cantinho acrescentados quando os lados aumentam.',
      itens: [
        { tipo: 'poligono', pontos: [[0, 0], [4, 0], [4, 2.6], [0, 2.6]], cor: 1 },
        { tipo: 'poligono', pontos: [[4, 0], [5.2, 0], [5.2, 2.6], [4, 2.6]], cor: 2 },
        { tipo: 'poligono', pontos: [[0, 2.6], [4, 2.6], [4, 3.5], [0, 3.5]], cor: 3 },
        { tipo: 'poligono', pontos: [[4, 2.6], [5.2, 2.6], [5.2, 3.5], [4, 3.5]], cor: 0 },
        { tipo: 'texto', x: 2, y: 1.3, texto: 'u · v' },
        { tipo: 'texto', x: 4.6, y: 1.3, texto: 'Δu · v', cor: 2 },
        { tipo: 'texto', x: 2, y: 3.05, texto: 'u · Δv', cor: 3 },
        { tipo: 'texto', x: 2, y: 0, texto: 'u', pos: 's', italico: true },
        { tipo: 'texto', x: 0, y: 1.3, texto: 'v', pos: 'w', italico: true },
        { tipo: 'texto', x: 4.6, y: 0, texto: 'Δu', pos: 's' },
        { tipo: 'texto', x: 0, y: 3.05, texto: 'Δv', pos: 'w' },
      ],
      legenda: R`A variação da área é \(\Delta u \cdot v + u \cdot \Delta v\) mais um cantinho \(\Delta u \cdot \Delta v\), que some no limite.`,
    } },

    { h2: 'As regras' },
    { caixa: 'formula', titulo: 'Regra do produto',
      html: R`
      \[ (u \cdot v)' = u' \cdot v + u \cdot v' \]
      <p>Em palavras: <em>derivada da primeira vezes a segunda, mais a primeira vezes a derivada da segunda</em>.
      Para três fatores: \((uvw)' = u'vw + uv'w + uvw'\).</p>`,
      porque: R`
      <p>No quociente de Newton, some e subtraia \(u(x + h)\,v(x)\):</p>
      \[ \frac{u(x+h)v(x+h) - u(x)v(x)}{h} = u(x+h)\,\frac{v(x+h) - v(x)}{h} + v(x)\,\frac{u(x+h) - u(x)}{h}. \]
      <p>Quando \(h \to 0\), \(u(x + h) \to u(x)\) (pois \(u\) é contínua) e as frações tendem a \(v'(x)\) e \(u'(x)\).</p>` },
    { caixa: 'formula', titulo: 'Regra do quociente',
      html: R`
      \[ \left(\frac{u}{v}\right)' = \frac{u' \cdot v - u \cdot v'}{v^2} \qquad (v \neq 0) \]
      <p>Em palavras: <em>derivada do de cima vezes o de baixo, <strong>menos</strong> o de cima vezes a derivada do de baixo,
      tudo sobre o de baixo ao quadrado</em>. A ordem importa por causa do sinal de menos.</p>`,
      porque: R`
      <p>Escreva \(u = \dfrac{u}{v} \cdot v\) e aplique a regra do produto: \(u' = \left(\dfrac{u}{v}\right)' v + \dfrac{u}{v}\,v'\).
      Isolando: \(\left(\dfrac{u}{v}\right)' = \dfrac{u' - \frac{u}{v} v'}{v} = \dfrac{u'v - uv'}{v^2}\).</p>` },
    { caixa: 'dica', titulo: 'Antes de aplicar, olhe se dá para simplificar',
      html: R`
      <p>Se o denominador é uma constante ou um único termo, costuma ser mais rápido reescrever:
      \(\dfrac{x^3 + 1}{2} = \tfrac12(x^3 + 1)\) e \(\dfrac{x^2 + 1}{x} = x + x^{-1}\) dispensam a regra do quociente.</p>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Produto de dois polinômios', nivel: 'facil',
      enunciado: R`<p>Derive \(f(x) = (x^2 + 1)(3x - 2)\).</p>`,
      confere: { derivada: '(x^2 + 1)*(3x - 2)' },
      passos: [
        { tex: R`u = x^2 + 1 \qquad v = 3x - 2`, txt: R`Identificamos os dois fatores do produto.` },
        { tex: R`u' = 2x \qquad v' = 3`, txt: R`Derivamos cada fator separadamente (regras básicas).` },
        { tex: R`f'(x) = u'v + uv' = 2x(3x - 2) + (x^2 + 1) \cdot 3`, txt: R`Aplicamos a regra do produto com \(u = x^2 + 1\) e \(v = 3x - 2\).`, c: 1, seg: 'ultimo' },
        { tex: R`f'(x) = 6x^2 - 4x + 3x^2 + 3 = 9x^2 - 4x + 3`, txt: R`Expandimos e juntamos os termos semelhantes. (Conferência: expandindo antes, \(f(x) = 3x^3 - 2x^2 + 3x - 2\), cuja derivada é a mesma.)`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Quociente de polinômios', nivel: 'medio',
      enunciado: R`<p>Derive \(f(x) = \dfrac{2x + 1}{x^2 + 3}\).</p>`,
      confere: { derivada: '(2x + 1)/(x^2 + 3)' },
      passos: [
        { tex: R`u = 2x + 1 \qquad v = x^2 + 3`, txt: R`Numerador (\(u\)) e denominador (\(v\)).` },
        { tex: R`u' = 2 \qquad v' = 2x`, txt: R`Derivadas de cada um.` },
        { tex: R`f'(x) = \frac{u'v - uv'}{v^2} = \frac{2(x^2 + 3) - (2x + 1) \cdot 2x}{(x^2 + 3)^2}`, txt: R`Regra do quociente. Os parênteses em \((2x + 1)\) são essenciais: o sinal de menos vale para o produto inteiro.`, c: 1, seg: 'ultimo' },
        { tex: R`f'(x) = \frac{2x^2 + 6 - 4x^2 - 2x}{(x^2 + 3)^2} = \frac{-2x^2 - 2x + 6}{(x^2 + 3)^2}`, txt: R`Expandimos o numerador, distribuindo o sinal de menos, e juntamos os termos semelhantes. O denominador costuma ficar fatorado.`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Produto dentro de um quociente', nivel: 'dificil',
      enunciado: R`<p>Derive \(f(x) = \dfrac{x\sqrt{x}}{x + 1}\) para \(x > 0\).</p>`,
      confere: { derivada: '(x*sqrt(x))/(x + 1)', dom: [0.3, 4] },
      passos: [
        { tex: R`u = x\sqrt{x} = x^{3/2} \qquad v = x + 1`, txt: R`Antes de tudo, simplificamos o numerador: \(x \cdot x^{1/2} = x^{3/2}\). Isso evita usar a regra do produto dentro da do quociente.` },
        { tex: R`u' = \tfrac{3}{2}x^{1/2} = \tfrac{3}{2}\sqrt{x} \qquad v' = 1`, txt: R`Regra da potência para \(u\); \(v\) é uma função afim.` },
        { tex: R`f'(x) = \frac{\tfrac{3}{2}\sqrt{x}\,(x + 1) - x\sqrt{x} \cdot 1}{(x + 1)^2}`, txt: R`Regra do quociente: \(\dfrac{u'v - uv'}{v^2}\).`, c: 1 },
        { tex: R`f'(x) = \frac{\sqrt{x}\left(\tfrac{3}{2}x + \tfrac{3}{2} - x\right)}{(x + 1)^2} = \frac{\sqrt{x}\,(x + 3)}{2(x + 1)^2}`, txt: R`Colocamos \(\sqrt{x}\) em evidência no numerador e simplificamos: \(\tfrac32 x - x = \tfrac12 x\), e \(\tfrac12 x + \tfrac32 = \tfrac{x + 3}{2}\).`, c: 1 },
      ],
    } },

    { erros: [
      { e: R`\((uv)' = u' \cdot v'\), por exemplo \(\big(x^2(3x - 2)\big)' = 2x \cdot 3\).`,
        c: R`\((uv)' = u'v + uv'\). Cada parcela deriva <em>um</em> fator e mantém o outro.` },
      { e: R`\(\left(\dfrac{u}{v}\right)' = \dfrac{u'}{v'}\).`,
        c: R`\(\left(\dfrac{u}{v}\right)' = \dfrac{u'v - uv'}{v^2}\).` },
      { e: R`Inverter a ordem no numerador do quociente: \(\dfrac{uv' - u'v}{v^2}\).`,
        c: R`Começa pela derivada do numerador: \(u'v - uv'\). Trocar a ordem troca o sinal da resposta.` },
      { e: R`Esquecer os parênteses: \(2(x^2 + 3) - 2x + 1 \cdot 2x\).`,
        c: R`O menos multiplica todo o produto \(uv'\): \(2(x^2 + 3) - (2x + 1) \cdot 2x\).` },
      { e: R`Esquecer de elevar o denominador ao quadrado.`,
        c: R`O denominador da derivada é \(v^2\), não \(v\).` },
    ] },

    { exercicios: [
      { q: R`Derive \(f(x) = (2x - 1)(x^3 + 4)\).`,
        r: R`<p>\(f'(x) = 2(x^3 + 4) + (2x - 1) \cdot 3x^2 = 8x^3 - 3x^2 + 8\).</p>`,
        c: { derivada: '(2x - 1)*(x^3 + 4)', tex: R`f'(x) = 2(x^3 + 4) + (2x - 1) \cdot 3x^2 = 8x^3 - 3x^2 + 8` } },
      { q: R`Derive \(g(x) = \dfrac{x}{x + 1}\).`,
        r: R`<p>\(g'(x) = \dfrac{1 \cdot (x + 1) - x \cdot 1}{(x + 1)^2} = \dfrac{1}{(x + 1)^2}\).</p>`,
        c: { derivada: 'x/(x + 1)', tex: R`g'(x) = \dfrac{1 \cdot (x + 1) - x \cdot 1}{(x + 1)^2} = \dfrac{1}{(x + 1)^2}` } },
      { q: R`Derive \(h(x) = \dfrac{x^2 - 1}{x^2 + 1}\).`,
        r: R`<p>\(h'(x) = \dfrac{2x(x^2 + 1) - (x^2 - 1) \cdot 2x}{(x^2 + 1)^2} = \dfrac{4x}{(x^2 + 1)^2}\).</p>`,
        c: { derivada: '(x^2 - 1)/(x^2 + 1)', tex: R`h'(x) = \dfrac{2x(x^2 + 1) - (x^2 - 1) \cdot 2x}{(x^2 + 1)^2} = \dfrac{4x}{(x^2 + 1)^2}` } },
    ] },
  ],
};
