// Seção 5 — Regras básicas
import { R } from '../ui/tex.js';

export default {
  lide: R`Calcular limites toda vez é trabalhoso. As primeiras regras de derivação resolvem, de cabeça, qualquer polinômio e qualquer soma de potências.`,
  objetivos: [
    R`Derivar constantes e potências \(x^n\), inclusive com expoente negativo ou fracionário.`,
    R`Usar as regras do <strong>múltiplo constante</strong>, da <strong>soma</strong> e da <strong>diferença</strong>.`,
    R`Reescrever raízes e frações como potências antes de derivar.`,
  ],
  blocos: [
    { h2: 'Um padrão que se repete' },
    { html: R`
      <p>Pela definição já obtivemos: \((x^2)' = 2x\), \((x^3)' = 3x^2\), \((\sqrt{x})' = \dfrac{1}{2\sqrt{x}}\) e
      \(\left(\dfrac{1}{x}\right)' = -\dfrac{1}{x^2}\). Escritas como potências, todas seguem o mesmo padrão:</p>
      \[ (x^2)' = 2x^1, \qquad (x^3)' = 3x^2, \qquad (x^{1/2})' = \tfrac{1}{2}x^{-1/2}, \qquad (x^{-1})' = -1 \cdot x^{-2}. \]` },
    { caixa: 'intuicao', titulo: '“Tomba e diminui um”',
      html: R`
      <p>O expoente <strong>desce</strong> multiplicando e, no lugar dele, fica o expoente <strong>menos um</strong>.
      E derivar é uma operação <em>linear</em>: constantes multiplicando “passam direto” e somas são derivadas termo a termo.
      Faz sentido: se uma grandeza é o triplo de outra, ela varia três vezes mais rápido; e a taxa de variação de uma soma é a soma das taxas.</p>` },

    { h2: 'As regras' },
    { caixa: 'formula', titulo: 'Constante e potência',
      html: R`
      \[ \frac{d}{dx}(c) = 0 \qquad\qquad \frac{d}{dx}(x) = 1 \qquad\qquad \frac{d}{dx}(x^n) = n\,x^{n-1} \]
      <p>A regra da potência vale para <strong>qualquer</strong> expoente real \(n\) (inteiro, negativo ou fracionário).</p>`,
      porque: R`
      <p>Para \(n\) inteiro positivo, expanda \((x + h)^n = x^n + n x^{n-1} h + (\text{termos com } h^2 \text{ ou mais})\).
      Então \(\dfrac{(x + h)^n - x^n}{h} = n x^{n-1} + (\text{termos com } h)\), que tende a \(n x^{n-1}\) quando \(h \to 0\).
      A constante tem gráfico horizontal: inclinação zero em todo ponto.</p>` },
    { caixa: 'formula', titulo: 'Múltiplo constante, soma e diferença',
      html: R`
      \[ (c \cdot f)' = c \cdot f' \qquad\qquad (f + g)' = f' + g' \qquad\qquad (f - g)' = f' - g' \]
      <p>Juntas, permitem derivar qualquer polinômio termo a termo:</p>
      \[ \frac{d}{dx}\left(a_n x^n + \dots + a_1 x + a_0\right) = n a_n x^{n-1} + \dots + a_1. \]` },
    { tabela: {
      classe: 'tabela--centro',
      cab: ['Como aparece', 'Como potência', 'Derivada', 'De volta à forma usual'],
      linhas: [
        [R`\(\sqrt{x}\)`, R`\(x^{1/2}\)`, R`\(\tfrac{1}{2}x^{-1/2}\)`, R`\(\dfrac{1}{2\sqrt{x}}\)`],
        [R`\(\sqrt[3]{x}\)`, R`\(x^{1/3}\)`, R`\(\tfrac{1}{3}x^{-2/3}\)`, R`\(\dfrac{1}{3\sqrt[3]{x^2}}\)`],
        [R`\(\dfrac{1}{x}\)`, R`\(x^{-1}\)`, R`\(-x^{-2}\)`, R`\(-\dfrac{1}{x^2}\)`],
        [R`\(\dfrac{1}{x^2}\)`, R`\(x^{-2}\)`, R`\(-2x^{-3}\)`, R`\(-\dfrac{2}{x^3}\)`],
        [R`\(x\sqrt{x}\)`, R`\(x^{3/2}\)`, R`\(\tfrac{3}{2}x^{1/2}\)`, R`\(\dfrac{3\sqrt{x}}{2}\)`],
      ],
      legenda: 'Raízes e frações com potências de x no denominador: reescreva como potência, derive e volte.',
    } },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Um polinômio', nivel: 'facil',
      enunciado: R`<p>Derive \(f(x) = 3x^4 - 5x^2 + 7x - 2\).</p>`,
      confere: { derivada: '3x^4 - 5x^2 + 7x - 2' },
      passos: [
        { tex: R`f'(x) = (3x^4)' - (5x^2)' + (7x)' - (2)'`, txt: R`Regras da soma e da diferença: derivamos termo a termo.` },
        { tex: R`f'(x) = 3 \cdot 4x^3 - 5 \cdot 2x + 7 \cdot 1 - 0`, txt: R`Em cada termo a constante fica multiplicando (múltiplo constante) e aplicamos a regra da potência. A derivada de \(7x\) é \(7\) e a da constante \(-2\) é zero.`, c: 1 },
        { tex: R`f'(x) = 12x^3 - 10x + 7`, txt: R`Efetuamos os produtos.`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Raízes e potências no denominador', nivel: 'medio',
      enunciado: R`<p>Derive \(f(x) = 4\sqrt{x} - \dfrac{3}{x^2}\).</p>`,
      confere: { derivada: '4*sqrt(x) - 3/x^2', dom: [0.4, 3] },
      passos: [
        { tex: R`f(x) = 4x^{1/2} - 3x^{-2}`, txt: R`Reescrevemos tudo como potência de \(x\): \(\sqrt{x} = x^{1/2}\) e \(\dfrac{1}{x^2} = x^{-2}\).`, c: { igual: '4*sqrt(x) - 3/x^2', dom: [0.4, 3] } },
        { tex: R`f'(x) = 4 \cdot \tfrac{1}{2}x^{-1/2} - 3 \cdot (-2)x^{-3}`, txt: R`Regra da potência em cada termo: \(\tfrac12 - 1 = -\tfrac12\) e \(-2 - 1 = -3\). Atenção ao sinal do expoente negativo.`, c: 1 },
        { tex: R`f'(x) = 2x^{-1/2} + 6x^{-3}`, txt: R`Efetuamos os produtos: menos com menos dá mais.`, c: 1 },
        { tex: R`f'(x) = \frac{2}{\sqrt{x}} + \frac{6}{x^3}`, txt: R`Voltamos à notação de raiz e fração.`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Simplificar antes de derivar', nivel: 'dificil',
      enunciado: R`<p>Derive \(f(x) = \dfrac{x^3 - 2x + 5}{x}\) usando apenas as regras básicas.</p>`,
      confere: { derivada: '(x^3 - 2x + 5)/x', dom: [0.4, 3] },
      passos: [
        { tex: R`f(x) = \frac{x^3}{x} - \frac{2x}{x} + \frac{5}{x} = x^2 - 2 + 5x^{-1}`, txt: R`O denominador é um único termo, então podemos dividir cada parcela do numerador por \(x\). Isso transforma o quociente em uma soma de potências.`, c: { igual: '(x^3 - 2x + 5)/x', dom: [0.4, 3] } },
        { tex: R`f'(x) = 2x - 0 + 5 \cdot (-1)x^{-2}`, txt: R`Derivamos termo a termo com a regra da potência.`, c: 1 },
        { tex: R`f'(x) = 2x - \frac{5}{x^2}`, txt: R`Simplificamos. Esse caminho é bem mais curto do que a regra do quociente (próxima seção).`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Velocidade de um móvel', nivel: 'medio',
      enunciado: R`<p>A posição de uma partícula é \(s(t) = 2t^3 - 9t^2 + 12t\) (metros, segundos). Determine a velocidade \(v(t)\) e os instantes em que a partícula está parada.</p>`,
      confere: { derivada: '2t^3 - 9t^2 + 12t', var: 't' },
      passos: [
        { tex: R`v(t) = s'(t) = 6t^2 - 18t + 12`, txt: R`A velocidade é a derivada da posição: derivamos o polinômio termo a termo.`, c: 1, seg: 'ultimo' },
        { tex: R`6t^2 - 18t + 12 = 6(t - 1)(t - 2)`, txt: R`Fatoramos para encontrar as raízes.`, c: 1, seg: 'tudo' },
        { tex: R`v(t) = 0 \;\Rightarrow\; t = 1 \text{ s} \quad \text{ou} \quad t = 2 \text{ s}`, txt: R`A partícula para (momentaneamente) nesses dois instantes. Entre eles, \(v(t) < 0\): ela está voltando.`, c: { fn: (m) => m.perto(m.d('2t^3 - 9t^2 + 12t', 1, 't'), 0, 1e-9, 1e-9) && m.perto(m.d('2t^3 - 9t^2 + 12t', 2, 't'), 0, 1e-9, 1e-9) } },
      ],
    } },

    { erros: [
      { e: R`Derivar uma constante como se fosse potência: \((5)' = 5\) ou \((\pi^2)' = 2\pi\).`,
        c: R`Constante não varia: \((5)' = 0\) e \((\pi^2)' = 0\) (não há \(x\) em \(\pi^2\)).` },
      { e: R`Errar a conta com expoente negativo: \((x^{-2})' = -2x^{-1}\).`,
        c: R`Subtrair 1 de \(-2\) dá \(-3\): \((x^{-2})' = -2x^{-3}\).` },
      { e: R`Derivar \(\dfrac{1}{x^3}\) como \(\dfrac{1}{3x^2}\) (derivando só o denominador).`,
        c: R`Reescreva: \(\dfrac{1}{x^3} = x^{-3}\), cuja derivada é \(-3x^{-4} = -\dfrac{3}{x^4}\).` },
      { e: R`Aplicar a regra da potência a \(2^x\): \((2^x)' = x\,2^{x-1}\).`,
        c: R`A regra vale quando a <em>base</em> é \(x\) e o expoente é constante. \(2^x\) é exponencial (veja a <a href="teoria.html?s=exponenciais-logaritmicas">seção 9</a>).` },
      { e: R`“Distribuir” a derivada em um produto: \((x^2 \cdot x^3)' = 2x \cdot 3x^2\).`,
        c: R`Soma se deriva termo a termo; produto não. Aqui basta simplificar antes: \(x^2 \cdot x^3 = x^5\), cuja derivada é \(5x^4\).` },
    ] },

    { exercicios: [
      { q: R`Derive \(f(x) = x^5 - 4x^3 + x - 9\).`,
        r: R`<p>\(f'(x) = 5x^4 - 12x^2 + 1\).</p>`,
        c: { derivada: 'x^5 - 4x^3 + x - 9', tex: R`f'(x) = 5x^4 - 12x^2 + 1`, seg: 'ultimo' } },
      { q: R`Derive \(g(x) = \dfrac{2}{x} + 6\sqrt[3]{x}\).`,
        r: R`<p>\(g(x) = 2x^{-1} + 6x^{1/3}\), logo \(g'(x) = -\dfrac{2}{x^2} + \dfrac{2}{\sqrt[3]{x^2}}\).</p>`,
        c: { derivada: '2/x + 6*x^(1/3)', dom: [0.4, 3], tex: R`g'(x) = -\dfrac{2}{x^2} + \dfrac{2}{\sqrt[3]{x^2}}`, seg: 'ultimo' } },
      { q: R`Em que pontos o gráfico de \(y = x^3 - 12x\) tem tangente horizontal?`,
        r: R`<p>\(y' = 3x^2 - 12 = 0\) quando \(x = \pm 2\): pontos \((2, -16)\) e \((-2, 16)\).</p>`,
        c: { derivada: 'x^3 - 12x', tex: R`y' = 3x^2 - 12`, seg: 'ultimo' } },
    ] },
  ],
};
