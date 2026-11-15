// Seção 14.5 — Pontos críticos, crescimento e extremos
import { R } from '../ui/tex.js';

export default {
  lide: R`O sinal da derivada conta onde a função sobe e onde desce. Nos pontos em que ela troca de sinal estão os máximos e mínimos locais.`,
  objetivos: [
    R`Encontrar os <strong>pontos críticos</strong> de uma função.`,
    R`Determinar os intervalos de <strong>crescimento e decrescimento</strong> pelo sinal de \(f'\).`,
    R`Classificar pontos críticos com os testes da <strong>primeira</strong> e da <strong>segunda derivada</strong>, e achar extremos absolutos em intervalos fechados.`,
  ],
  blocos: [
    { h2: 'Subidas, descidas e pontos de virada' },
    { caixa: 'intuicao', titulo: 'No topo do morro, o chão é plano',
      html: R`
      <p>Caminhando sobre o gráfico da esquerda para a direita: enquanto \(f' > 0\) você sobe; enquanto \(f' < 0\) você desce.
      Para passar de subida a descida (um <strong>máximo local</strong>) ou de descida a subida (um <strong>mínimo local</strong>) de forma suave,
      a inclinação precisa passar por zero. Por isso os candidatos a máximo e mínimo são os pontos em que \(f' = 0\) (ou em que \(f'\) não existe, como em um bico).</p>` },
    { grafico: {
      x: [-2.6, 2.6], y: [-3.4, 3.4], proporcao: 0.6,
      descricao: 'Gráfico de x³ − 3x com máximo local em (−1, 2) e mínimo local em (1, −2).',
      itens: [
        { tipo: 'funcao', f: (x) => x ** 3 - 3 * x, cor: 1 },
        { tipo: 'segmento', de: [-1.7, 2], ate: [-0.3, 2], cor: 2 },
        { tipo: 'segmento', de: [0.3, -2], ate: [1.7, -2], cor: 3 },
        { tipo: 'ponto', x: -1, y: 2, cor: 2, rotulo: 'máximo local', pos: 'n' },
        { tipo: 'ponto', x: 1, y: -2, cor: 3, rotulo: 'mínimo local', pos: 's' },
        { tipo: 'texto', x: -2.1, y: -1.6, texto: 'f′ > 0', pos: 'w' },
        { tipo: 'texto', x: 0, y: 0.5, texto: 'f′ < 0', pos: 'e' },
        { tipo: 'texto', x: 2.1, y: 1.6, texto: 'f′ > 0', pos: 'e' },
      ],
      legenda: R`\(f(x) = x^3 - 3x\): cresce, decresce e volta a crescer. Nos pontos de virada, \(x = -1\) e \(x = 1\), a tangente é horizontal.`,
    } },
    { caixa: 'definicao', titulo: 'Ponto crítico',
      html: R`
      <p>Um número \(c\) do domínio de \(f\) é um <strong>ponto crítico</strong> se \(f'(c) = 0\) ou se \(f'(c)\) não existe.</p>
      <p><strong>Teorema de Fermat:</strong> se \(f\) tem máximo ou mínimo local em \(c\), então \(c\) é um ponto crítico.
      A recíproca é falsa: \(f(x) = x^3\) tem \(f'(0) = 0\), mas não tem extremo em \(0\).</p>` },
    { caixa: 'teorema', titulo: 'Teste da primeira derivada',
      html: R`
      <p>Seja \(c\) um ponto crítico de uma função contínua \(f\). Observando o sinal de \(f'\) ao passar por \(c\):</p>
      <ul>
        <li>de <strong>positivo para negativo</strong>: máximo local em \(c\);</li>
        <li>de <strong>negativo para positivo</strong>: mínimo local em \(c\);</li>
        <li><strong>sem mudança de sinal</strong>: não há extremo em \(c\).</li>
      </ul>` },
    { caixa: 'teorema', titulo: 'Teste da segunda derivada',
      html: R`
      <p>Se \(f'(c) = 0\) e \(f''\) existe em \(c\):</p>
      <ul>
        <li>\(f''(c) > 0\): mínimo local (curva “sorrindo”);</li>
        <li>\(f''(c) < 0\): máximo local (curva “triste”);</li>
        <li>\(f''(c) = 0\): o teste é <strong>inconclusivo</strong>; use o da primeira derivada.</li>
      </ul>` },
    { caixa: 'formula', rotulo: 'Roteiro', titulo: 'Extremos absolutos em um intervalo fechado [a, b]',
      html: R`
      <ol>
        <li>Encontre os pontos críticos de \(f\) no interior do intervalo.</li>
        <li>Calcule \(f\) nesses pontos <strong>e nos extremos</strong> \(a\) e \(b\).</li>
        <li>O maior valor é o máximo absoluto; o menor, o mínimo absoluto.</li>
      </ol>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Crescimento e extremos com o teste da primeira derivada', nivel: 'facil',
      enunciado: R`<p>Determine os intervalos de crescimento e decrescimento e os extremos locais de \(f(x) = x^3 - 3x\).</p>`,
      confere: { derivada: 'x^3 - 3x' },
      passos: [
        { tex: R`f'(x) = 3x^2 - 3 = 3(x - 1)(x + 1)`, txt: R`Derivamos e fatoramos para estudar o sinal.`, c: 1 },
        { tex: R`f'(x) = 0 \;\Rightarrow\; x = -1 \ \text{ ou } \ x = 1`, txt: R`Pontos críticos (a derivada existe em toda parte).`, c: { fn: (m) => m.perto(m.d('x^3 - 3x', -1), 0, 1e-9, 1e-9) && m.perto(m.d('x^3 - 3x', 1), 0, 1e-9, 1e-9) } },
        { tex: R`f'(-2) = 9 > 0 \qquad f'(0) = -3 < 0 \qquad f'(2) = 9 > 0`, txt: R`Testamos um ponto em cada intervalo: \(f\) é crescente em \((-\infty, -1)\), decrescente em \((-1, 1)\) e crescente em \((1, \infty)\).`, c: { fn: (m) => m.perto(m.d('x^3 - 3x', -2), 9) && m.perto(m.d('x^3 - 3x', 0), -3) && m.perto(m.d('x^3 - 3x', 2), 9) } },
        { tex: R`f(-1) = 2 \qquad f(1) = -2`, txt: R`Em \(x = -1\), \(f'\) passa de \(+\) para \(-\): <strong>máximo local</strong>, de valor \(2\). Em \(x = 1\), passa de \(-\) para \(+\): <strong>mínimo local</strong>, de valor \(-2\).`, c: { fn: (m) => m.perto(m.num('x^3 - 3x', { x: -1 }), 2) && m.perto(m.num('x^3 - 3x', { x: 1 }), -2) } },
      ],
    } },
    { exemplo: {
      titulo: 'Teste da segunda derivada', nivel: 'medio',
      enunciado: R`<p>Encontre e classifique os pontos críticos de \(f(x) = x^4 - 8x^2\).</p>`,
      confere: { derivada: 'x^4 - 8x^2' },
      passos: [
        { tex: R`f'(x) = 4x^3 - 16x = 4x(x - 2)(x + 2)`, txt: R`Derivamos e fatoramos: os pontos críticos são \(x = -2\), \(x = 0\) e \(x = 2\).`, c: 1 },
        { tex: R`f''(x) = 12x^2 - 16`, txt: R`Segunda derivada, para classificar.`, c: { derivada: 'x^4 - 8x^2', ordem: 2 } },
        { tex: R`f''(0) = -16 < 0`, txt: R`Em \(x = 0\): concavidade para baixo, <strong>máximo local</strong>, com \(f(0) = 0\).`, c: { valor: (m) => m.d('x^4 - 8x^2', 0, 'x', 2), seg: [1] } },
        { tex: R`f''(2) = 12 \cdot 4 - 16 = 32 > 0`, txt: R`Em \(x = 2\) (e, por simetria, em \(x = -2\)): concavidade para cima, <strong>mínimos locais</strong>, com \(f(\pm 2) = 16 - 32 = -16\).`, c: { valor: (m) => m.d('x^4 - 8x^2', 2, 'x', 2), seg: [1, 2] } },
      ],
    } },
    { exemplo: {
      titulo: 'Função com exponencial', nivel: 'dificil',
      enunciado: R`<p>Encontre e classifique os pontos críticos de \(f(x) = x\,e^{-x}\).</p>`,
      confere: { derivada: 'x*e^(-x)' },
      passos: [
        { tex: R`f'(x) = 1 \cdot e^{-x} + x \cdot (-e^{-x}) = e^{-x}(1 - x)`, txt: R`Regra do produto (com a cadeia em \(e^{-x}\)) e fatoração.`, c: 1 },
        { tex: R`e^{-x}(1 - x) = 0 \;\Rightarrow\; x = 1`, txt: R`Como \(e^{-x} > 0\) sempre, a derivada só se anula quando \(1 - x = 0\).`, c: { fn: (m) => m.perto(m.d('x*e^(-x)', 1), 0, 1e-9, 1e-9) } },
        { tex: R`f'(0) = 1 > 0 \qquad f'(2) = -e^{-2} < 0`, txt: R`O sinal de \(f'\) é o sinal de \((1 - x)\): positivo antes de \(1\), negativo depois. Pelo teste da primeira derivada, há um <strong>máximo local</strong> em \(x = 1\).`, c: { fn: (m) => m.perto(m.d('x*e^(-x)', 0), 1) && m.perto(m.d('x*e^(-x)', 2), -Math.exp(-2)) } },
        { tex: R`f(1) = 1 \cdot e^{-1} = \frac{1}{e}`, txt: R`Valor máximo: \(\dfrac{1}{e} \approx 0{,}37\). Como é o único ponto crítico e a função cresce antes e decresce depois, esse é também o máximo absoluto.`, c: { valor: (m) => m.num('x*e^(-x)', { x: 1 }) } },
      ],
    } },
    { exemplo: {
      titulo: 'Extremos absolutos em um intervalo fechado', nivel: 'medio',
      enunciado: R`<p>Determine o máximo e o mínimo absolutos de \(f(x) = x^3 - 3x\) no intervalo \([0, 3]\).</p>`,
      confere: { valor: 18 },
      passos: [
        { tex: R`f'(x) = 3x^2 - 3 = 0 \;\Rightarrow\; x = \pm 1`, txt: R`Pontos críticos. Só \(x = 1\) está dentro do intervalo \([0, 3]\).`, c: { derivada: 'x^3 - 3x', seg: [1] } },
        { tex: R`f(0) = 0 \qquad f(1) = -2 \qquad f(3) = 27 - 9 = 18`, txt: R`Calculamos \(f\) no ponto crítico e nos dois extremos do intervalo.`, c: { fn: (m) => m.perto(m.num('x^3 - 3x', { x: 3 }), 18) && m.perto(m.num('x^3 - 3x', { x: 1 }), -2) } },
        { tex: R`\max f = f(3) = 18 \qquad \min f = f(1) = -2`, txt: R`Comparando os três valores: o máximo absoluto ocorre no extremo \(x = 3\) (não em um ponto crítico!) e o mínimo absoluto no ponto crítico \(x = 1\).`, c: { fn: (m) => { let maior = -Infinity; let menor = Infinity; for (let x = 0; x <= 3; x += 0.001) { const v = m.num('x^3 - 3x', { x }); maior = Math.max(maior, v); menor = Math.min(menor, v); } return m.perto(maior, 18, 1e-3) && m.perto(menor, -2, 1e-3); } } },
      ],
    } },

    { erros: [
      { e: R`Concluir que todo ponto com \(f'(c) = 0\) é máximo ou mínimo.`,
        c: R`Pode não ser nenhum dos dois: em \(f(x) = x^3\), \(f'(0) = 0\) mas \(f'\) não muda de sinal.` },
      { e: R`Usar o teste da segunda derivada quando \(f''(c) = 0\) e concluir que “não há extremo”.`,
        c: R`\(f''(c) = 0\) é inconclusivo. \(f(x) = x^4\) tem mínimo em \(0\) com \(f''(0) = 0\).` },
      { e: R`Em intervalo fechado, olhar só os pontos críticos e esquecer os extremos do intervalo.`,
        c: R`O máximo ou o mínimo absoluto pode estar em \(a\) ou \(b\). Compare todos os candidatos.` },
      { e: R`Confundir o <em>ponto</em> de máximo com o <em>valor</em> máximo.`,
        c: R`“Onde ocorre” é o \(x\) (por exemplo, \(x = -1\)); “quanto vale” é \(f(x)\) (por exemplo, \(2\)).` },
      { e: R`Esquecer os pontos em que \(f'\) não existe.`,
        c: R`\(f(x) = |x|\) tem mínimo em \(0\), onde a derivada não existe. Esses pontos também são críticos.` },
    ] },

    { exercicios: [
      { q: R`Encontre e classifique os pontos críticos de \(f(x) = x^2 - 6x + 5\).`,
        r: R`<p>\(f'(x) = 2x - 6 = 0\) em \(x = 3\); \(f''(x) = 2 > 0\): mínimo local (e absoluto), com \(f(3) = -4\).</p>`,
        c: { derivada: 'x^2 - 6x + 5', tex: R`f'(x) = 2x - 6`, seg: 'ultimo' } },
      { q: R`Em que intervalos \(f(x) = 2x^3 - 9x^2 + 12x\) é decrescente?`,
        r: R`<p>\(f'(x) = 6x^2 - 18x + 12 = 6(x - 1)(x - 2)\), negativa entre as raízes: \(f\) é decrescente em \((1, 2)\).</p>`,
        c: { derivada: '2x^3 - 9x^2 + 12x', tex: R`f'(x) = 6x^2 - 18x + 12 = 6(x - 1)(x - 2)` } },
      { q: R`Máximo e mínimo absolutos de \(f(x) = x^2 - 4x\) em \([0, 5]\).`,
        r: R`<p>Ponto crítico: \(x = 2\). Valores: \(f(0) = 0\), \(f(2) = -4\), \(f(5) = 5\). Máximo \(5\) (em \(x = 5\)) e mínimo \(-4\) (em \(x = 2\)).</p>` },
    ] },
  ],
};
