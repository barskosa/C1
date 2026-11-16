// Seção 14.7 — Esboço de gráficos
import { R } from '../ui/tex.js';

export default {
  lide: R`Juntando tudo: com \(f\), \(f'\) e \(f''\) dá para desenhar o gráfico de uma função sem tabela de pontos, sabendo onde ela sobe, desce, vira e muda de curvatura.`,
  objetivos: [
    R`Seguir um <strong>roteiro</strong> para esboçar gráficos: domínio, interceptos, assíntotas, \(f'\) e \(f''\).`,
    R`Montar o <strong>quadro de sinais</strong> que resume crescimento e concavidade.`,
    R`Combinar as informações em um esboço coerente.`,
  ],
  blocos: [
    { h2: 'Um gráfico é uma história contada por f′ e f″' },
    { caixa: 'intuicao', titulo: 'Quatro formatos básicos',
      html: R`
      <p>Em cada trecho, o gráfico tem um de quatro formatos, conforme os sinais de \(f'\) e \(f''\). Esboçar é descobrir
      em quais intervalos vale cada combinação e emendar os trechos nos pontos especiais (extremos e inflexões).</p>` },
    { graficos: [
      { x: [0, 2], y: [0, 2], proporcao: 0.8, alturaMin: 150, grade: false, marcas: false, eixos: false,
        descricao: 'Curva crescente e côncava para cima.',
        itens: [{ tipo: 'funcao', f: (x) => 0.2 + 0.42 * x * x, cor: 1, dominio: [0.1, 1.9] }],
        legenda: R`\(f' > 0\), \(f'' > 0\): sobe cada vez mais rápido.` },
      { x: [0, 2], y: [0, 2], proporcao: 0.8, alturaMin: 150, grade: false, marcas: false, eixos: false,
        descricao: 'Curva crescente e côncava para baixo.',
        itens: [{ tipo: 'funcao', f: (x) => 1.8 - 0.42 * (x - 2) * (x - 2), cor: 1, dominio: [0.1, 1.9] }],
        legenda: R`\(f' > 0\), \(f'' < 0\): sobe cada vez mais devagar.` },
      { x: [0, 2], y: [0, 2], proporcao: 0.8, alturaMin: 150, grade: false, marcas: false, eixos: false,
        descricao: 'Curva decrescente e côncava para cima.',
        itens: [{ tipo: 'funcao', f: (x) => 0.2 + 0.42 * (x - 2) * (x - 2), cor: 2, dominio: [0.1, 1.9] }],
        legenda: R`\(f' < 0\), \(f'' > 0\): desce cada vez mais devagar.` },
      { x: [0, 2], y: [0, 2], proporcao: 0.8, alturaMin: 150, grade: false, marcas: false, eixos: false,
        descricao: 'Curva decrescente e côncava para baixo.',
        itens: [{ tipo: 'funcao', f: (x) => 1.8 - 0.42 * x * x, cor: 2, dominio: [0.1, 1.9] }],
        legenda: R`\(f' < 0\), \(f'' < 0\): desce cada vez mais rápido.` },
    ] },
    { caixa: 'formula', rotulo: 'Roteiro', titulo: 'Passos para esboçar um gráfico',
      html: R`
      <ol>
        <li><strong>Domínio</strong> e pontos de descontinuidade.</li>
        <li><strong>Interceptos:</strong> \(f(0)\) e as raízes de \(f(x) = 0\) (se forem fáceis de achar). Verifique também simetrias (função par ou ímpar).</li>
        <li><strong>Assíntotas:</strong> verticais (onde \(f \to \pm\infty\)) e horizontais (limites quando \(x \to \pm\infty\)).</li>
        <li><strong>Primeira derivada:</strong> pontos críticos, intervalos de crescimento e decrescimento, extremos locais.</li>
        <li><strong>Segunda derivada:</strong> concavidade e pontos de inflexão.</li>
        <li><strong>Esboço:</strong> marque os pontos especiais e ligue-os respeitando o quadro de sinais.</li>
      </ol>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Esboço de um polinômio', nivel: 'medio',
      enunciado: R`<p>Esboce o gráfico de \(f(x) = x^3 - 3x^2\).</p>`,
      confere: { derivada: 'x^3 - 3x^2' },
      grafico: {
        x: [-1.6, 4], y: [-5.2, 4.2], proporcao: 0.56,
        descricao: 'Gráfico de x³ − 3x² com máximo local em (0, 0), mínimo local em (2, −4) e inflexão em (1, −2).',
        itens: [
          { tipo: 'funcao', f: (x) => x ** 3 - 3 * x * x, cor: 1 },
          { tipo: 'ponto', x: 0, y: 0, cor: 2, rotulo: 'máx. (0, 0)', pos: 'nw' },
          { tipo: 'ponto', x: 2, y: -4, cor: 3, rotulo: 'mín. (2, −4)', pos: 's' },
          { tipo: 'ponto', x: 1, y: -2, cor: 4, rotulo: 'inflexão (1, −2)', pos: 'e' },
          { tipo: 'ponto', x: 3, y: 0, cor: 0, rotulo: '(3, 0)', pos: 'se' },
        ],
        legenda: R`O esboço final, para comparar com o que os passos preveem.`,
      },
      passos: [
        { tex: R`f(x) = x^2(x - 3) = 0 \;\Rightarrow\; x = 0 \ \text{ ou } \ x = 3`, txt: R`Domínio: todos os reais (polinômio), sem assíntotas. Interceptos: o gráfico corta o eixo \(x\) em \(0\) e \(3\), e passa pela origem.`, c: { igual: 'x^3 - 3x^2', seg: [1] } },
        { tex: R`f'(x) = 3x^2 - 6x = 3x(x - 2)`, txt: R`Pontos críticos: \(x = 0\) e \(x = 2\). Sinal de \(f'\): positivo para \(x < 0\), negativo em \((0, 2)\), positivo para \(x > 2\).`, c: 1 },
        { tex: R`f(0) = 0 \qquad f(2) = 8 - 12 = -4`, txt: R`\(f\) cresce, decresce e cresce: <strong>máximo local</strong> em \((0, 0)\) e <strong>mínimo local</strong> em \((2, -4)\).`, c: { fn: (m) => m.perto(m.num('x^3 - 3x^2', { x: 2 }), -4) } },
        { tex: R`f''(x) = 6x - 6 = 6(x - 1)`, txt: R`Concavidade: para baixo se \(x < 1\), para cima se \(x > 1\). Ponto de inflexão em \(x = 1\), com \(f(1) = -2\).`, c: { derivada: 'x^3 - 3x^2', ordem: 2 } },
        { tex: R`\lim_{x \to -\infty} f(x) = -\infty \qquad \lim_{x \to +\infty} f(x) = +\infty`, txt: R`Comportamento nas pontas: domina o termo \(x^3\). Juntando tudo: vem de \(-\infty\) subindo (côncava para baixo) até o máximo na origem, desce passando pela inflexão \((1, -2)\) até o mínimo \((2, -4)\) e sobe, côncava para cima, cruzando o eixo em \(x = 3\).` },
      ],
    } },
    { exemplo: {
      titulo: 'Função racional com assíntota horizontal', nivel: 'dificil',
      enunciado: R`<p>Esboce o gráfico de \(f(x) = \dfrac{x}{x^2 + 1}\).</p>`,
      confere: { derivada: 'x/(x^2 + 1)' },
      grafico: {
        x: [-6, 6], y: [-0.8, 0.8], proporcao: 0.48,
        descricao: 'Gráfico de x/(x² + 1): passa pela origem, tem mínimo em (−1, −1/2), máximo em (1, 1/2) e se aproxima do eixo x nas pontas.',
        itens: [
          { tipo: 'funcao', f: (x) => x / (x * x + 1), cor: 1 },
          { tipo: 'ponto', x: 1, y: 0.5, cor: 2, rotulo: 'máx. (1, 1/2)', pos: 'n' },
          { tipo: 'ponto', x: -1, y: -0.5, cor: 3, rotulo: 'mín. (−1, −1/2)', pos: 's' },
          { tipo: 'ponto', x: Math.sqrt(3), y: Math.sqrt(3) / 4, cor: 4 },
          { tipo: 'ponto', x: -Math.sqrt(3), y: -Math.sqrt(3) / 4, cor: 4 },
          { tipo: 'ponto', x: 0, y: 0, cor: 4, rotulo: 'inflexões', pos: 'se' },
        ],
        legenda: R`Esboço final: função ímpar (simétrica em relação à origem), com assíntota horizontal \(y = 0\).`,
      },
      passos: [
        { tex: R`f(-x) = \frac{-x}{x^2 + 1} = -f(x) \qquad \lim_{x \to \pm\infty} \frac{x}{x^2 + 1} = 0`, txt: R`Domínio: todos os reais (o denominador nunca se anula). A função é <strong>ímpar</strong> (gráfico simétrico em relação à origem) e o único intercepto é a origem. Como o grau do denominador é maior, \(y = 0\) é assíntota horizontal.`, c: { limite: { f: 'x/(x^2 + 1)', a: 'inf' }, seg: 'ultimo' } },
        { tex: R`f'(x) = \frac{1 \cdot (x^2 + 1) - x \cdot 2x}{(x^2 + 1)^2} = \frac{1 - x^2}{(x^2 + 1)^2}`, txt: R`Regra do quociente. O denominador é sempre positivo, então o sinal de \(f'\) é o de \(1 - x^2\): positivo em \((-1, 1)\), negativo fora.`, c: 1 },
        { tex: R`f(-1) = -\frac{1}{2} \qquad f(1) = \frac{1}{2}`, txt: R`Decresce, cresce, decresce: <strong>mínimo local</strong> em \(\left(-1, -\tfrac12\right)\) e <strong>máximo local</strong> em \(\left(1, \tfrac12\right)\).`, c: { fn: (m) => m.perto(m.num('x/(x^2 + 1)', { x: 1 }), 0.5) && m.perto(m.d('x/(x^2 + 1)', 1), 0, 1e-9, 1e-9) } },
        { tex: R`f''(x) = \frac{2x(x^2 - 3)}{(x^2 + 1)^3}`, txt: R`Derivando \(f'\) (quociente e cadeia) e simplificando. \(f''\) se anula em \(x = 0\) e \(x = \pm\sqrt{3}\), trocando de sinal nos três: são três pontos de inflexão.`, c: { derivada: 'x/(x^2 + 1)', ordem: 2 } },
        { tex: R`f\left(\sqrt{3}\right) = \frac{\sqrt{3}}{4} \approx 0{,}43`, txt: R`Ordenada da inflexão em \(x = \sqrt{3}\) (e, pela simetria, \(-\tfrac{\sqrt3}{4}\) em \(x = -\sqrt{3}\)). O gráfico sai do eixo \(x\) à esquerda, desce até o mínimo, sobe pela origem até o máximo e volta a se aproximar do eixo.`, c: { valor: (m) => m.num('x/(x^2 + 1)', { x: Math.sqrt(3) }), seg: [1] } },
      ],
    } },

    { erros: [
      { e: R`Marcar alguns pontos e ligá-los “no olho”, sem estudar \(f'\) e \(f''\).`,
        c: R`Uma tabela de pontos pode esconder máximos, mínimos e assíntotas entre os valores escolhidos.` },
      { e: R`Desenhar o gráfico atravessando uma assíntota vertical.`,
        c: R`Em uma assíntota vertical a função não está definida: os ramos sobem ou descem sem limite de cada lado.` },
      { e: R`Esquecer de calcular a ordenada dos pontos especiais.`,
        c: R`Saber que há máximo em \(x = 1\) não basta: calcule \(f(1)\) para posicionar o ponto.` },
      { e: R`Fazer um esboço que contradiz o quadro de sinais (por exemplo, curva “sorrindo” onde \(f'' < 0\)).`,
        c: R`Confira cada trecho: sinal de \(f'\) (sobe/desce) e de \(f''\) (curvatura) precisam bater com o desenho.` },
    ] },

    { exercicios: [
      { q: R`Para \(f(x) = x^3 - 12x\), encontre os extremos locais e o ponto de inflexão.`,
        r: R`<p>\(f'(x) = 3x^2 - 12\): máximo local em \((-2, 16)\) e mínimo local em \((2, -16)\). \(f''(x) = 6x\): inflexão em \((0, 0)\).</p>`,
        c: [{ derivada: 'x^3 - 12x', tex: R`f'(x) = 3x^2 - 12` }, { derivada: 'x^3 - 12x', ordem: 2, tex: R`f''(x) = 6x` }] },
      { q: R`Quais são as assíntotas de \(f(x) = \dfrac{2x + 1}{x - 3}\)?`,
        r: R`<p>Vertical: \(x = 3\) (o denominador se anula e o numerador não). Horizontal: \(y = 2\), pois \(\lim_{x \to \pm\infty} \dfrac{2x + 1}{x - 3} = 2\).</p>`,
        c: { limite: { f: '(2x + 1)/(x - 3)', a: 'inf' }, tex: R`2`, seg: 'tudo' } },
      { q: R`Uma função tem \(f'(x) > 0\) e \(f''(x) < 0\) para todo \(x > 0\). Descreva o gráfico nesse intervalo e dê um exemplo.`,
        r: R`<p>Crescente e côncava para baixo: sobe cada vez mais devagar. Exemplos: \(\sqrt{x}\) e \(\ln x\).</p>` },
    ] },
  ],
};
