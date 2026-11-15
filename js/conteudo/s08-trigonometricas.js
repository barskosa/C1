// Seção 8 — Derivadas trigonométricas
import { R } from '../ui/tex.js';

export default {
  lide: R`Tudo começa com um único limite, \(\lim_{x \to 0} \frac{\sen x}{x} = 1\). Dele saem as derivadas do seno e do cosseno e, com a regra do quociente, as das outras quatro funções.`,
  objetivos: [
    R`Entender e usar o <strong>limite fundamental</strong> \(\lim_{x \to 0} \dfrac{\sen x}{x} = 1\).`,
    R`Saber as derivadas de \(\sen\), \(\cos\), \(\tg\), \(\cotg\), \(\sec\) e \(\cossec\) (com \(x\) em radianos).`,
    R`Combinar derivadas trigonométricas com as regras do produto, do quociente e da cadeia.`,
  ],
  blocos: [
    { h2: 'A inclinação do seno é o cosseno' },
    { caixa: 'intuicao', titulo: 'Olhe o gráfico',
      html: R`
      <p>Em \(x = 0\) o seno sobe com inclinação \(1\); no topo, em \(x = \pi/2\), a tangente é horizontal (inclinação \(0\));
      em \(x = \pi\) ele desce com inclinação \(-1\). Os valores \(1, 0, -1, 0, 1, \dots\) nos pontos \(0, \tfrac{\pi}{2}, \pi, \tfrac{3\pi}{2}, 2\pi, \dots\)
      são exatamente os valores do <strong>cosseno</strong>. Mova o ponto abaixo e confira.</p>` },
    { widget: 'tracador', funcoes: ['seno', 'cosseno'],
      legenda: R`A derivada de \(\sen x\) é \(\cos x\); a de \(\cos x\) é \(-\sen x\) (o cosseno começa descendo).` },

    { h2: 'O limite fundamental' },
    { html: R`
      <p>Para derivar o seno pela definição aparece o quociente \(\dfrac{\sen h}{h}\) com \(h \to 0\): uma indeterminação \(0/0\).
      O gráfico e a tabela mostram que ele se aproxima de \(1\).</p>` },
    { grafico: {
      x: [-9, 9], y: [-0.5, 1.4], proporcao: 0.42, alturaMin: 190,
      descricao: 'Gráfico de sen(x)/x, com um ponto aberto em (0, 1).',
      itens: [
        { tipo: 'funcao', f: (x) => (x === 0 ? NaN : Math.sin(x) / x), cor: 1 },
        { tipo: 'ponto', x: 0, y: 1, cor: 1, aberto: true, rotulo: '(0, 1)', pos: 'ne' },
      ],
      legenda: R`\(y = \dfrac{\sen x}{x}\) não está definida em \(0\) (bolinha aberta), mas seus valores tendem a \(1\) quando \(x \to 0\).`,
    } },
    { tabela: {
      classe: 'tabela--centro tabela--numeros',
      cab: [R`\(x\) (rad)`, '±1', '±0,5', '±0,1', '±0,01', '±0,001'],
      linhas: [[R`\(\dfrac{\sen x}{x}\)`, '0,84147', '0,95885', '0,99833', '0,99998', '0,9999998']],
    } },
    { caixa: 'teorema', titulo: 'Limites fundamentais trigonométricos',
      html: R`
      \[ \lim_{x \to 0} \frac{\sen x}{x} = 1 \qquad\qquad \lim_{x \to 0} \frac{\cos x - 1}{x} = 0 \]
      <p>Valem com \(x\) em <strong>radianos</strong>. É por isso que, em Cálculo, ângulos são sempre medidos em radianos.</p>`,
      porque: R`
      <p>No círculo de raio 1, para \(0 < x < \pi/2\), compare três áreas: o triângulo de altura \(\sen x\), o setor circular de
      ângulo \(x\) e o triângulo de altura \(\tg x\). Elas satisfazem \(\tfrac12 \sen x < \tfrac12 x < \tfrac12 \tg x\). Dividindo por
      \(\tfrac12 \sen x\) e invertendo: \(\cos x < \dfrac{\sen x}{x} < 1\). Como \(\cos x \to 1\), o Teorema do Confronto dá o limite \(1\).
      O segundo limite sai do primeiro multiplicando por \(\cos x + 1\) em cima e embaixo:
      \(\dfrac{\cos x - 1}{x} = -\dfrac{\sen x}{x} \cdot \dfrac{\sen x}{\cos x + 1} \to -1 \cdot 0 = 0\).</p>` },

    { h2: 'As seis derivadas' },
    { caixa: 'formula', titulo: 'Derivadas das funções trigonométricas',
      html: R`
      \[ \begin{aligned}
        (\sen x)' &= \cos x & (\cos x)' &= -\sen x \\
        (\tg x)' &= \sec^2 x & (\cotg x)' &= -\cossec^2 x \\
        (\sec x)' &= \sec x \, \tg x & (\cossec x)' &= -\cossec x \, \cotg x
      \end{aligned} \]
      <p>Macete: as funções que começam com “co” (cosseno, cotangente, cossecante) têm derivada com sinal de <strong>menos</strong>.</p>`,
      porque: R`
      <p>Para o seno, use \(\sen(x + h) = \sen x \cos h + \cos x \sen h\):</p>
      \[ \frac{\sen(x + h) - \sen x}{h} = \sen x \cdot \frac{\cos h - 1}{h} + \cos x \cdot \frac{\sen h}{h} \;\longrightarrow\; \sen x \cdot 0 + \cos x \cdot 1 = \cos x. \]
      <p>As demais saem das regras já conhecidas, escrevendo \(\tg x = \dfrac{\sen x}{\cos x}\), \(\sec x = \dfrac{1}{\cos x}\) etc. (veja o Exemplo 2).</p>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Soma e produto com seno e cosseno', nivel: 'facil',
      enunciado: R`<p>Derive \(f(x) = 3\sen x - 2\cos x + x\sen x\).</p>`,
      confere: { derivada: '3*sin(x) - 2*cos(x) + x*sin(x)' },
      passos: [
        { tex: R`(3\sen x)' = 3\cos x \qquad (-2\cos x)' = -2 \cdot (-\sen x) = 2\sen x`, txt: R`Nos dois primeiros termos, múltiplo constante com \((\sen x)' = \cos x\) e \((\cos x)' = -\sen x\).` },
        { tex: R`(x\sen x)' = 1 \cdot \sen x + x \cdot \cos x`, txt: R`O terceiro termo é um produto: \(u = x\), \(v = \sen x\), e \((uv)' = u'v + uv'\).`, c: { derivada: 'x*sin(x)' } },
        { tex: R`f'(x) = 3\cos x + 2\sen x + \sen x + x\cos x = 3\cos x + 3\sen x + x\cos x`, txt: R`Somamos as três partes e juntamos os termos em \(\sen x\).`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'De onde vem a derivada da tangente', nivel: 'medio',
      enunciado: R`<p>Use a regra do quociente para mostrar que \((\tg x)' = \sec^2 x\).</p>`,
      confere: { derivada: 'tan(x)', dom: [-1.3, 1.3] },
      passos: [
        { tex: R`\tg x = \frac{\sen x}{\cos x}, \qquad u = \sen x, \quad v = \cos x`, txt: R`Escrevemos a tangente como quociente.` },
        { tex: R`(\tg x)' = \frac{\cos x \cdot \cos x - \sen x \cdot (-\sen x)}{\cos^2 x}`, txt: R`Regra do quociente \(\dfrac{u'v - uv'}{v^2}\), com \(u' = \cos x\) e \(v' = -\sen x\).`, c: 1 },
        { tex: R`(\tg x)' = \frac{\cos^2 x + \sen^2 x}{\cos^2 x} = \frac{1}{\cos^2 x}`, txt: R`Menos com menos dá mais, e usamos a identidade fundamental \(\sen^2 x + \cos^2 x = 1\).`, c: 1 },
        { tex: R`(\tg x)' = \sec^2 x`, txt: R`Por definição, \(\sec x = \dfrac{1}{\cos x}\).`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Cadeia com funções trigonométricas', nivel: 'dificil',
      enunciado: R`<p>Derive \(f(x) = \sen^3(2x) + \cos(x^2)\).</p>`,
      confere: { derivada: 'sin(2x)^3 + cos(x^2)' },
      passos: [
        { tex: R`\big(\sen^3(2x)\big)' = \underbrace{3\sen^2(2x)}_{\text{cubo}} \cdot \underbrace{\cos(2x)}_{\text{seno}} \cdot \underbrace{2}_{2x}`, txt: R`Primeiro termo: três camadas. De fora para dentro: o cubo, o seno e \(2x\). Derivamos cada camada e multiplicamos.`, c: { derivada: 'sin(2x)^3' } },
        { tex: R`\big(\cos(x^2)\big)' = -\sen(x^2) \cdot 2x`, txt: R`Segundo termo: a de fora é o cosseno (derivada \(-\sen\)) e a de dentro é \(x^2\) (derivada \(2x\)).`, c: { derivada: 'cos(x^2)' } },
        { tex: R`f'(x) = 6\sen^2(2x)\cos(2x) - 2x\sen(x^2)`, txt: R`Somamos e organizamos os fatores numéricos na frente.`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Usando o limite fundamental', nivel: 'medio',
      enunciado: R`<p>Calcule \(\displaystyle\lim_{x \to 0} \frac{\sen 5x}{2x}\).</p>`,
      confere: { limite: { f: 'sin(5x)/(2x)', a: 0 } },
      passos: [
        { tex: R`\frac{\sen 5x}{2x} = \frac{5}{2} \cdot \frac{\sen 5x}{5x}`, txt: R`O limite fundamental exige o <em>mesmo</em> argumento no seno e no denominador. Multiplicamos e dividimos por \(5\) para fazer aparecer \(5x\) embaixo.`, c: { igual: 'sin(5x)/(2x)', dom: [0.1, 1] } },
        { tex: R`\lim_{x \to 0} \frac{\sen 5x}{5x} = 1`, txt: R`Com \(u = 5x\), quando \(x \to 0\) temos \(u \to 0\), e \(\dfrac{\sen u}{u} \to 1\).`, c: { limite: { f: 'sin(5x)/(5x)', a: 0 } }, seg: 'ultimo' },
        { tex: R`\lim_{x \to 0} \frac{\sen 5x}{2x} = \frac{5}{2} \cdot 1 = \frac{5}{2}`, txt: R`A constante sai do limite.`, c: 1, seg: [1, 2] },
      ],
    } },

    { erros: [
      { e: R`Errar o sinal: \((\cos x)' = \sen x\).`,
        c: R`\((\cos x)' = -\sen x\). O cosseno vale \(1\) em \(x = 0\) e começa <em>descendo</em>.` },
      { e: R`Usar graus: “\((\sen x)' = \cos x\) com \(x = 30°\)”.`,
        c: R`As fórmulas só valem em radianos. Em graus apareceria um fator \(\pi/180\).` },
      { e: R`\(\big(\sen 2x\big)' = \cos 2x\) ou \(\big(\sen 2x\big)' = 2\cos x\).`,
        c: R`Regra da cadeia: \(\big(\sen 2x\big)' = \cos(2x) \cdot 2 = 2\cos 2x\).` },
      { e: R`\(\big(\sen^2 x\big)' = \cos^2 x\).`,
        c: R`\(\sen^2 x = (\sen x)^2\): a de fora é o quadrado. \(\big(\sen^2 x\big)' = 2\sen x\cos x\).` },
      { e: R`“Cancelar” o seno: \(\dfrac{\sen 5x}{x} = \sen 5\).`,
        c: R`\(\sen\) é uma função, não um fator. Use o limite fundamental: \(\dfrac{\sen 5x}{x} = 5 \cdot \dfrac{\sen 5x}{5x} \to 5\).` },
    ] },

    { exercicios: [
      { q: R`Derive \(f(x) = x^2 \cos x\).`,
        r: R`<p>\(f'(x) = 2x\cos x - x^2 \sen x\).</p>`,
        c: { derivada: 'x^2*cos(x)', tex: R`f'(x) = 2x\cos x - x^2 \sen x` } },
      { q: R`Derive \(g(x) = \tg(3x)\).`,
        r: R`<p>\(g'(x) = 3\sec^2(3x)\).</p>`,
        c: { derivada: 'tan(3x)', dom: [-0.45, 0.45], tex: R`g'(x) = 3\sec^2(3x)` } },
      { q: R`Calcule \(\displaystyle\lim_{x \to 0} \dfrac{\sen 3x}{\sen 2x}\).`,
        r: R`<p>\(\dfrac{\sen 3x}{\sen 2x} = \dfrac{3}{2} \cdot \dfrac{\sen 3x}{3x} \cdot \dfrac{2x}{\sen 2x} \to \dfrac{3}{2}\).</p>`,
        c: { limite: { f: 'sin(3x)/sin(2x)', a: 0 }, tex: R`\dfrac{3}{2}`, seg: 'tudo' } },
    ] },
  ],
};
