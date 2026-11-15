// Seção 14.6 — Concavidade e pontos de inflexão
import { R } from '../ui/tex.js';

export default {
  lide: R`A primeira derivada diz se o gráfico sobe ou desce; a segunda diz <em>como</em> ele faz isso: curvando-se para cima ou para baixo.`,
  objetivos: [
    R`Determinar a <strong>concavidade</strong> pelo sinal de \(f''\).`,
    R`Encontrar os <strong>pontos de inflexão</strong>, onde a concavidade muda.`,
    R`Evitar a armadilha de \(f''(c) = 0\) sem mudança de sinal.`,
  ],
  blocos: [
    { h2: 'Curvando para cima, curvando para baixo' },
    { caixa: 'intuicao', titulo: 'Volante virado para a esquerda ou para a direita',
      html: R`
      <p>Dirigindo sobre o gráfico da esquerda para a direita: se o volante está virado para a esquerda (a curva “vira para cima”),
      as inclinações estão <strong>aumentando</strong>, isto é, \(f'\) é crescente e \(f'' > 0\). Se está virado para a direita,
      as inclinações <strong>diminuem</strong> e \(f'' < 0\). O ponto em que você inverte o volante é um <strong>ponto de inflexão</strong>.
      Outra imagem: côncava para cima segura água (formato de xícara); côncava para baixo derrama.</p>` },
    { grafico: {
      x: [-0.6, 4.6], y: [-1.5, 6], proporcao: 0.56,
      descricao: 'Gráfico de x³ − 6x² + 9x com o ponto de inflexão em (2, 2), côncavo para baixo antes e para cima depois.',
      itens: [
        { tipo: 'funcao', f: (x) => x ** 3 - 6 * x * x + 9 * x, cor: 2, dominio: [-0.6, 2] },
        { tipo: 'funcao', f: (x) => x ** 3 - 6 * x * x + 9 * x, cor: 3, dominio: [2, 4.6] },
        { tipo: 'reta', ponto: [2, 2], m: -3, cor: 0, tracejado: true, fino: true },
        { tipo: 'ponto', x: 2, y: 2, cor: 0, rotulo: 'inflexão (2, 2)', pos: 'ne' },
        { tipo: 'texto', x: 0.9, y: 4.6, texto: 'côncava para baixo (f″ < 0)', cor: 2, pos: 'n' },
        { tipo: 'texto', x: 3.4, y: -0.6, texto: 'côncava para cima (f″ > 0)', cor: 3, pos: 's' },
      ],
      legenda: R`\(f(x) = x^3 - 6x^2 + 9x\). No ponto de inflexão a tangente (tracejada) <em>atravessa</em> o gráfico.`,
    } },
    { caixa: 'definicao', titulo: 'Concavidade e ponto de inflexão',
      html: R`
      <p>Em um intervalo:</p>
      <ul>
        <li>se \(f''(x) > 0\), o gráfico de \(f\) é <strong>côncavo para cima</strong> (fica acima de suas tangentes);</li>
        <li>se \(f''(x) < 0\), o gráfico é <strong>côncavo para baixo</strong> (fica abaixo de suas tangentes).</li>
      </ul>
      <p>Um <strong>ponto de inflexão</strong> é um ponto do gráfico em que a função é contínua e a concavidade <strong>muda</strong>.</p>` },
    { caixa: 'formula', rotulo: 'Roteiro', titulo: 'Como encontrar pontos de inflexão',
      html: R`
      <ol>
        <li>Calcule \(f''(x)\).</li>
        <li>Encontre os candidatos: pontos em que \(f''(x) = 0\) ou \(f''\) não existe.</li>
        <li>Estude o sinal de \(f''\) de cada lado de cada candidato. Só há inflexão onde o sinal <strong>troca</strong>.</li>
      </ol>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Concavidade de uma cúbica', nivel: 'facil',
      enunciado: R`<p>Estude a concavidade de \(f(x) = x^3 - 6x^2 + 9x\) e determine o ponto de inflexão.</p>`,
      confere: { derivada: 'x^3 - 6x^2 + 9x', ordem: 2 },
      passos: [
        { tex: R`f'(x) = 3x^2 - 12x + 9`, txt: R`Primeira derivada.`, c: { derivada: 'x^3 - 6x^2 + 9x' } },
        { tex: R`f''(x) = 6x - 12 = 6(x - 2)`, txt: R`Segunda derivada, fatorada.`, c: 1 },
        { tex: R`f''(x) < 0 \ \text{ se } x < 2 \qquad f''(x) > 0 \ \text{ se } x > 2`, txt: R`Côncava para baixo em \((-\infty, 2)\) e côncava para cima em \((2, \infty)\). O sinal troca em \(x = 2\).`, c: { fn: (m) => m.d('x^3 - 6x^2 + 9x', 1, 'x', 2) < 0 && m.d('x^3 - 6x^2 + 9x', 3, 'x', 2) > 0 } },
        { tex: R`f(2) = 8 - 24 + 18 = 2`, txt: R`Ponto de inflexão: \((2, 2)\).`, c: { valor: (m) => m.num('x^3 - 6x^2 + 9x', { x: 2 }) } },
      ],
    } },
    { exemplo: {
      titulo: 'Dois pontos de inflexão', nivel: 'medio',
      enunciado: R`<p>Determine os intervalos de concavidade e os pontos de inflexão de \(f(x) = x^4 - 4x^3\).</p>`,
      confere: { derivada: 'x^4 - 4x^3', ordem: 2 },
      passos: [
        { tex: R`f'(x) = 4x^3 - 12x^2`, txt: R`Primeira derivada.`, c: { derivada: 'x^4 - 4x^3' } },
        { tex: R`f''(x) = 12x^2 - 24x = 12x(x - 2)`, txt: R`Segunda derivada: anula-se em \(x = 0\) e \(x = 2\).`, c: 1 },
        { tex: R`f''(-1) = 36 > 0 \qquad f''(1) = -12 < 0 \qquad f''(3) = 36 > 0`, txt: R`Testamos um ponto em cada intervalo: côncava para cima em \((-\infty, 0)\), para baixo em \((0, 2)\) e para cima em \((2, \infty)\).`, c: { fn: (m) => m.perto(m.d('x^4 - 4x^3', -1, 'x', 2), 36) && m.perto(m.d('x^4 - 4x^3', 1, 'x', 2), -12) && m.perto(m.d('x^4 - 4x^3', 3, 'x', 2), 36) } },
        { tex: R`f(0) = 0 \qquad f(2) = 16 - 32 = -16`, txt: R`A concavidade muda nos dois candidatos: os pontos de inflexão são \((0, 0)\) e \((2, -16)\).`, c: { fn: (m) => m.perto(m.num('x^4 - 4x^3', { x: 2 }), -16) } },
      ],
    } },
    { exemplo: {
      titulo: 'A curva em forma de sino', nivel: 'dificil',
      enunciado: R`<p>Encontre os pontos de inflexão de \(f(x) = e^{-x^2}\).</p>`,
      confere: { derivada: 'e^(-x^2)', ordem: 2 },
      passos: [
        { tex: R`f'(x) = -2x\,e^{-x^2}`, txt: R`Regra da cadeia: a derivada de \(-x^2\) é \(-2x\).`, c: { derivada: 'e^(-x^2)' } },
        { tex: R`f''(x) = -2e^{-x^2} + (-2x)(-2x)\,e^{-x^2} = (4x^2 - 2)\,e^{-x^2}`, txt: R`Regra do produto em \(-2x \cdot e^{-x^2}\), colocando \(e^{-x^2}\) em evidência.`, c: 1 },
        { tex: R`4x^2 - 2 = 0 \;\Rightarrow\; x = \pm\frac{\sqrt{2}}{2}`, txt: R`Como \(e^{-x^2} > 0\), \(f''\) se anula quando \(4x^2 - 2 = 0\), isto é, \(x^2 = \tfrac12\).`, c: { fn: (m) => m.perto(m.d('e^(-x^2)', Math.SQRT1_2, 'x', 2), 0, 1e-9, 1e-9) } },
        { tex: R`f''(0) = -2 < 0 \qquad f''(1) = 2e^{-1} > 0`, txt: R`\(f''\) é negativa entre \(-\tfrac{\sqrt2}{2}\) e \(\tfrac{\sqrt2}{2}\) e positiva fora: a concavidade muda nos dois pontos, que são pontos de inflexão. É onde o “sino” deixa de curvar para baixo e passa a se abrir.`, c: { fn: (m) => m.perto(m.d('e^(-x^2)', 0, 'x', 2), -2) && m.perto(m.d('e^(-x^2)', 1, 'x', 2), 2 / Math.E) } },
      ],
    } },

    { erros: [
      { e: R`Dizer que todo ponto com \(f''(c) = 0\) é ponto de inflexão.`,
        c: R`É preciso que \(f''\) <em>troque de sinal</em>. Em \(f(x) = x^4\), \(f''(0) = 0\), mas \(f'' = 12x^2 \geq 0\) dos dois lados: não há inflexão.` },
      { e: R`Confundir concavidade com crescimento: “côncava para cima, logo crescente”.`,
        c: R`São independentes. \(f(x) = x^2\) é côncava para cima em toda parte, mas decresce para \(x < 0\).` },
      { e: R`Procurar pontos de inflexão resolvendo \(f'(x) = 0\).`,
        c: R`\(f' = 0\) dá candidatos a máximo e mínimo. Inflexão vem do estudo de \(f''\).` },
      { e: R`Chamar de ponto de inflexão um ponto em que a função não está definida.`,
        c: R`\(f(x) = \dfrac{1}{x}\) muda de concavidade em \(x = 0\), mas \(0\) não está no domínio: não há ponto de inflexão.` },
    ] },

    { exercicios: [
      { q: R`Determine o ponto de inflexão de \(f(x) = x^3 - 3x^2 + 4\).`,
        r: R`<p>\(f''(x) = 6x - 6\), que troca de sinal em \(x = 1\). Ponto de inflexão: \((1, 2)\).</p>`,
        c: { derivada: 'x^3 - 3x^2 + 4', ordem: 2, tex: R`f''(x) = 6x - 6` } },
      { q: R`Em que intervalo \(f(x) = \ln x\) é côncava para baixo?`,
        r: R`<p>\(f''(x) = -\dfrac{1}{x^2} < 0\) para todo \(x > 0\): côncava para baixo em todo o domínio.</p>`,
        c: { derivada: 'log(x)', ordem: 2, dom: [0.3, 3], tex: R`f''(x) = -\dfrac{1}{x^2}`, seg: [1] } },
      { q: R`\(f(x) = x^4\) tem ponto de inflexão?`,
        r: R`<p>Não. \(f''(x) = 12x^2\) é zero em \(x = 0\), mas é positiva dos dois lados: a concavidade não muda.</p>`,
        c: { derivada: 'x^4', ordem: 2, tex: R`f''(x) = 12x^2` } },
    ] },
  ],
};
