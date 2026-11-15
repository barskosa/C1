// Seção 9 — Exponenciais e logaritmos
import { R } from '../ui/tex.js';

export default {
  lide: R`A função \(e^x\) é a única (a menos de constante) que é igual à própria derivada. A partir dela obtemos as derivadas de \(a^x\), \(\ln x\) e \(\log_a x\).`,
  objetivos: [
    R`Derivar \(e^x\) e \(a^x\), entendendo de onde vem o fator \(\ln a\).`,
    R`Derivar \(\ln x\) e \(\log_a x\).`,
    R`Combinar essas derivadas com as regras do produto, do quociente e da cadeia.`,
  ],
  blocos: [
    { h2: 'Uma função proporcional ao próprio crescimento' },
    { html: R`
      <p>Aplicando a definição a \(f(x) = a^x\):</p>
      \[ \frac{a^{x+h} - a^x}{h} = a^x \cdot \frac{a^h - 1}{h}. \]
      <p>O primeiro fator é a própria função; o segundo não depende de \(x\) e tende a um número fixo quando \(h \to 0\).
      Ou seja: <strong>a derivada de uma exponencial é proporcional a ela mesma</strong>. É por isso que exponenciais modelam
      populações, juros compostos e decaimento radioativo, em que a taxa de variação é proporcional à quantidade presente.</p>` },
    { caixa: 'intuicao', titulo: 'O número e é a base “sob medida”',
      html: R`
      <p>Para \(a = 2\) a constante de proporcionalidade é cerca de \(0{,}693\); para \(a = 3\), cerca de \(1{,}099\). Entre \(2\) e \(3\)
      existe uma base para a qual a constante vale exatamente \(1\): é o número \(e \approx 2{,}71828\). Para ela,
      a inclinação do gráfico em cada ponto é igual à altura do gráfico naquele ponto.</p>` },
    { widget: 'tracador', funcoes: ['exponencial', 'logaritmo'],
      legenda: R`Para \(f(x) = e^x\), os dois gráficos são iguais: \(f' = f\). Para \(f(x) = \ln x\), a inclinação é \(1/x\): grande perto de zero e cada vez menor.` },

    { h2: 'As fórmulas' },
    { caixa: 'formula', titulo: 'Exponenciais',
      html: R`
      \[ (e^x)' = e^x \qquad\qquad (a^x)' = a^x \ln a \quad (a > 0,\ a \neq 1) \]
      <p>Com a regra da cadeia: \(\big(e^{u}\big)' = e^{u} \cdot u'\) e \(\big(a^{u}\big)' = a^{u} \ln a \cdot u'\).</p>`,
      porque: R`
      <p>O número \(e\) pode ser definido pela propriedade \(\lim_{h \to 0} \dfrac{e^h - 1}{h} = 1\); daí \((e^x)' = e^x \cdot 1\).
      Para outra base, escreva \(a^x = e^{x \ln a}\) e use a regra da cadeia: \((a^x)' = e^{x \ln a} \cdot \ln a = a^x \ln a\).</p>` },
    { caixa: 'formula', titulo: 'Logaritmos',
      html: R`
      \[ (\ln x)' = \frac{1}{x} \qquad\qquad (\log_a x)' = \frac{1}{x \ln a} \qquad (x > 0) \]
      <p>Com a regra da cadeia: \(\big(\ln u\big)' = \dfrac{u'}{u}\). Também vale \(\big(\ln|x|\big)' = \dfrac{1}{x}\) para todo \(x \neq 0\).</p>`,
      porque: R`
      <p>Se \(y = \ln x\), então \(e^y = x\). Derivando os dois lados em relação a \(x\) (regra da cadeia): \(e^y \cdot y' = 1\),
      logo \(y' = \dfrac{1}{e^y} = \dfrac{1}{x}\). Para outra base, \(\log_a x = \dfrac{\ln x}{\ln a}\), e \(\dfrac{1}{\ln a}\) é só uma constante.</p>` },
    { caixa: 'atencao', titulo: 'Potência × exponencial',
      html: R`
      <p>Não confunda: em \(x^3\) a variável está na <strong>base</strong> (regra da potência: \(3x^2\));
      em \(3^x\) a variável está no <strong>expoente</strong> (exponencial: \(3^x \ln 3\)). E quando há variável nos dois,
      como em \(x^x\), nenhuma das duas serve: use a <a href="teoria.html?s=logaritmica">derivação logarítmica</a>.</p>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Somas com exponencial e logaritmo', nivel: 'facil',
      enunciado: R`<p>Derive \(f(x) = 4e^x - 3\ln x + 2^x\).</p>`,
      confere: { derivada: '4*e^x - 3*log(x) + 2^x', dom: [0.3, 3] },
      passos: [
        { tex: R`f'(x) = 4(e^x)' - 3(\ln x)' + (2^x)'`, txt: R`Soma e múltiplo constante: derivamos termo a termo.` },
        { tex: R`f'(x) = 4e^x - 3 \cdot \frac{1}{x} + 2^x \ln 2`, txt: R`\((e^x)' = e^x\), \((\ln x)' = \dfrac{1}{x}\) e \((a^x)' = a^x \ln a\) com \(a = 2\).`, c: 1 },
        { tex: R`f'(x) = 4e^x - \frac{3}{x} + 2^x \ln 2`, txt: R`Simplificamos. Note que \(\ln 2 \approx 0{,}693\) é apenas um número.`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Produto e cadeia com exponencial', nivel: 'medio',
      enunciado: R`<p>Derive \(f(x) = x^2 e^{-3x}\).</p>`,
      confere: { derivada: 'x^2*e^(-3x)' },
      passos: [
        { tex: R`u = x^2 \qquad v = e^{-3x}`, txt: R`É um produto. O segundo fator é uma composição (exponencial de \(-3x\)).` },
        { tex: R`u' = 2x \qquad v' = e^{-3x} \cdot (-3) = -3e^{-3x}`, txt: R`Para \(v\), regra da cadeia: \(\big(e^u\big)' = e^u \cdot u'\), com \(u = -3x\).` },
        { tex: R`f'(x) = 2x \cdot e^{-3x} + x^2 \cdot (-3e^{-3x})`, txt: R`Regra do produto: \(u'v + uv'\).`, c: 1 },
        { tex: R`f'(x) = 2xe^{-3x} - 3x^2e^{-3x} = xe^{-3x}(2 - 3x)`, txt: R`Colocamos \(xe^{-3x}\) em evidência. Como \(e^{-3x} > 0\) sempre, o sinal de \(f'\) depende só de \(x(2 - 3x)\).`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Logaritmo de uma função', nivel: 'medio',
      enunciado: R`<p>Derive \(f(x) = \ln(x^2 + 1)\) e \(g(x) = \log_2(5x)\).</p>`,
      confere: { derivada: 'log(x^2 + 1)' },
      passos: [
        { tex: R`f'(x) = \frac{1}{x^2 + 1} \cdot (x^2 + 1)' = \frac{2x}{x^2 + 1}`, txt: R`Regra da cadeia com o logaritmo: \(\big(\ln u\big)' = \dfrac{u'}{u}\), com \(u = x^2 + 1\) e \(u' = 2x\).`, c: 1, seg: 'ultimo' },
        { tex: R`g'(x) = \frac{1}{5x \ln 2} \cdot 5 = \frac{1}{x \ln 2}`, txt: R`Para a base 2: \(\big(\log_a u\big)' = \dfrac{u'}{u \ln a}\), com \(u = 5x\). O \(5\) cancela, como era de esperar: \(\log_2(5x) = \log_2 5 + \log_2 x\), e a constante \(\log_2 5\) tem derivada zero.`, c: { derivada: 'log(5x, 2)', dom: [0.3, 3] } },
      ],
    } },
    { exemplo: {
      titulo: 'Simplificar com propriedades do logaritmo', nivel: 'dificil',
      enunciado: R`<p>Derive \(f(x) = \ln\!\left(\dfrac{x\,e^{2x}}{\sqrt{x^2 + 1}}\right)\) para \(x > 0\).</p>`,
      confere: { derivada: 'log(x*e^(2x)/sqrt(x^2 + 1))', dom: [0.3, 3] },
      passos: [
        { tex: R`f(x) = \ln x + \ln e^{2x} - \ln\sqrt{x^2 + 1} = \ln x + 2x - \tfrac{1}{2}\ln(x^2 + 1)`, txt: R`Antes de derivar, abrimos o logaritmo: \(\ln(AB) = \ln A + \ln B\), \(\ln\frac{A}{B} = \ln A - \ln B\), \(\ln A^r = r\ln A\) e \(\ln e^{2x} = 2x\).`, c: { igual: 'log(x*e^(2x)/sqrt(x^2 + 1))', dom: [0.3, 3] }, seg: 'ultimo' },
        { tex: R`f'(x) = \frac{1}{x} + 2 - \frac{1}{2} \cdot \frac{2x}{x^2 + 1}`, txt: R`Agora cada termo é imediato; no último, \(\big(\ln u\big)' = \dfrac{u'}{u}\).`, c: 1 },
        { tex: R`f'(x) = \frac{1}{x} + 2 - \frac{x}{x^2 + 1}`, txt: R`Simplificamos. Derivar a expressão original, com quociente, produto e raiz dentro do logaritmo, daria muito mais trabalho.`, c: 1 },
      ],
    } },

    { erros: [
      { e: R`Usar a regra da potência em exponencial: \((e^x)' = x\,e^{x-1}\) ou \((2^x)' = x\,2^{x-1}\).`,
        c: R`A variável está no expoente: \((e^x)' = e^x\) e \((2^x)' = 2^x \ln 2\).` },
      { e: R`Esquecer o fator \(\ln a\): \((3^x)' = 3^x\).`,
        c: R`Só a base \(e\) dispensa o fator, pois \(\ln e = 1\). \((3^x)' = 3^x \ln 3\).` },
      { e: R`\(\big(e^{2x}\big)' = e^{2x}\) ou \(\big(e^{x^2}\big)' = e^{2x}\).`,
        c: R`O expoente não muda; multiplica-se pela derivada dele: \(\big(e^{2x}\big)' = 2e^{2x}\) e \(\big(e^{x^2}\big)' = 2x\,e^{x^2}\).` },
      { e: R`\(\big(\ln(x^2 + 1)\big)' = \dfrac{1}{x^2 + 1}\) ou \(\dfrac{1}{2x}\).`,
        c: R`\(\big(\ln u\big)' = \dfrac{u'}{u}\): o resultado é \(\dfrac{2x}{x^2 + 1}\).` },
      { e: R`Derivar constantes como \(e^2\) ou \(\ln 5\) como se tivessem \(x\).`,
        c: R`\(e^2\) e \(\ln 5\) são números: suas derivadas são zero.` },
    ] },

    { exercicios: [
      { q: R`Derive \(f(x) = e^{x^2}\).`,
        r: R`<p>\(f'(x) = 2x\,e^{x^2}\).</p>`,
        c: { derivada: 'e^(x^2)', tex: R`f'(x) = 2x\,e^{x^2}` } },
      { q: R`Derive \(g(x) = x \ln x\).`,
        r: R`<p>\(g'(x) = 1 \cdot \ln x + x \cdot \dfrac{1}{x} = \ln x + 1\).</p>`,
        c: { derivada: 'x*log(x)', dom: [0.3, 3], tex: R`g'(x) = 1 \cdot \ln x + x \cdot \dfrac{1}{x} = \ln x + 1` } },
      { q: R`Derive \(h(x) = \dfrac{e^x}{x}\).`,
        r: R`<p>\(h'(x) = \dfrac{e^x \cdot x - e^x \cdot 1}{x^2} = \dfrac{e^x(x - 1)}{x^2}\).</p>`,
        c: { derivada: 'e^x/x', dom: [0.3, 3], tex: R`h'(x) = \dfrac{e^x \cdot x - e^x \cdot 1}{x^2} = \dfrac{e^x(x - 1)}{x^2}` } },
    ] },
  ],
};
