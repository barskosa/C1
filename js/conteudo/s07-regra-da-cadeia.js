// Seção 7 — Regra da cadeia
import { R } from '../ui/tex.js';

export default {
  lide: R`Quase toda função interessante é uma função “dentro” de outra. A regra da cadeia é a ferramenta para derivar composições, e é a regra mais usada de todo o Cálculo.`,
  objetivos: [
    R`Reconhecer uma função composta e separar a função <strong>de fora</strong> da função <strong>de dentro</strong>.`,
    R`Aplicar a regra da cadeia: derivada de fora (na de dentro) vezes derivada de dentro.`,
    R`Derivar composições com <strong>várias camadas</strong> e combinar a cadeia com produto e quociente.`,
  ],
  blocos: [
    { h2: 'Funções dentro de funções' },
    { html: R`
      <p>Em \(y = (3x + 1)^5\), primeiro calcula-se \(3x + 1\) e depois eleva-se o resultado à quinta potência.
      São duas operações encadeadas: uma função <span class="termo">de dentro</span>, \(u = 3x + 1\), e uma
      <span class="termo">de fora</span>, \(y = u^5\). Escrevemos \(y = f(g(x))\), a composição de \(f\) com \(g\).</p>` },
    { caixa: 'intuicao', titulo: 'Engrenagens: as taxas se multiplicam',
      html: R`
      <p>Se \(u\) varia <strong>3 vezes</strong> mais rápido que \(x\), e \(y\) varia <strong>2 vezes</strong> mais rápido que \(u\),
      então \(y\) varia \(2 \cdot 3 = 6\) vezes mais rápido que \(x\). É como um jogo de engrenagens: as razões de transmissão se multiplicam.
      Na notação de Leibniz isso fica quase óbvio:</p>
      \[ \frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}. \]` },
    { caixa: 'formula', titulo: 'Regra da cadeia',
      html: R`
      <p>Se \(y = f(u)\) e \(u = g(x)\) são deriváveis, então</p>
      \[ \frac{d}{dx}\, f(g(x)) = f'(g(x)) \cdot g'(x). \]
      <p><strong>Derivada da de fora, calculada na de dentro, vezes a derivada da de dentro.</strong></p>` },
    { html: R`<p>Na prática, a regra da cadeia transforma cada fórmula básica em uma versão “com \(u\)”:</p>` },
    { tabela: {
      classe: 'tabela--centro',
      cab: ['Função', 'Derivada', 'Exemplo'],
      linhas: [
        [R`\(u^n\)`, R`\(n\,u^{n-1} \cdot u'\)`, R`\(\big((x^2 + 1)^3\big)' = 3(x^2 + 1)^2 \cdot 2x\)`],
        [R`\(\sqrt{u}\)`, R`\(\dfrac{u'}{2\sqrt{u}}\)`, R`\(\big(\sqrt{x^2 + 1}\big)' = \dfrac{2x}{2\sqrt{x^2 + 1}}\)`],
        [R`\(\sen u\)`, R`\(\cos u \cdot u'\)`, R`\(\big(\sen 3x\big)' = 3\cos 3x\)`],
        [R`\(e^u\)`, R`\(e^u \cdot u'\)`, R`\(\big(e^{-2x}\big)' = -2e^{-2x}\)`],
        [R`\(\ln u\)`, R`\(\dfrac{u'}{u}\)`, R`\(\big(\ln(x^2 + 1)\big)' = \dfrac{2x}{x^2 + 1}\)`],
      ],
      legenda: R`As derivadas de \(\sen\), \(e^x\) e \(\ln\) são deduzidas nas seções <a href="teoria.html?s=trigonometricas">8</a> e <a href="teoria.html?s=exponenciais-logaritmicas">9</a>.`,
    } },

    { h2: 'Várias camadas' },
    { html: R`
      <p>Quando há mais de duas funções encadeadas, a regra se repete: derive de fora para dentro, uma camada por vez,
      e multiplique tudo. Para \(y = f(g(k(x)))\):</p>
      \[ \frac{dy}{dx} = f'\big(g(k(x))\big) \cdot g'\big(k(x)\big) \cdot k'(x). \]
      <p>Uma boa maneira de enxergar as camadas é perguntar: <em>“qual é a última operação que eu faria ao calcular isso?”</em>
      Essa é a função de fora. Em \(\sen^3(2x)\), por exemplo, a última operação é elevar ao cubo; antes dela, o seno; antes, o dobro.</p>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Potência de uma função afim', nivel: 'facil',
      enunciado: R`<p>Derive \(f(x) = (3x + 1)^5\).</p>`,
      confere: { derivada: '(3x + 1)^5' },
      passos: [
        { tex: R`u = 3x + 1 \qquad y = u^5`, txt: R`Função de dentro: \(u = 3x + 1\). Função de fora: elevar à quinta potência.` },
        { tex: R`\frac{dy}{du} = 5u^4 \qquad \frac{du}{dx} = 3`, txt: R`Derivamos cada uma em relação à sua própria variável.` },
        { tex: R`f'(x) = \underbrace{5(3x + 1)^4}_{\text{derivada de fora}} \cdot \underbrace{3}_{\text{derivada de dentro}}`, txt: R`Regra da cadeia: multiplicamos, voltando \(u\) para \(3x + 1\). O “de dentro” não muda ao derivar a de fora.`, c: 1 },
        { tex: R`f'(x) = 15(3x + 1)^4`, txt: R`Simplificamos. Não é preciso (nem desejável) expandir a quinta potência.`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Raiz de um polinômio', nivel: 'medio',
      enunciado: R`<p>Derive \(f(x) = \sqrt{x^2 + 9}\).</p>`,
      confere: { derivada: 'sqrt(x^2 + 9)' },
      passos: [
        { tex: R`f(x) = (x^2 + 9)^{1/2}`, txt: R`Escrevemos a raiz como potência. De dentro: \(u = x^2 + 9\); de fora: \(u^{1/2}\).`, c: { igual: 'sqrt(x^2 + 9)' } },
        { tex: R`f'(x) = \tfrac{1}{2}(x^2 + 9)^{-1/2} \cdot 2x`, txt: R`Derivada de fora, \(\tfrac12 u^{-1/2}\), calculada em \(u = x^2 + 9\), vezes a derivada de dentro, \(2x\).`, c: 1 },
        { tex: R`f'(x) = \frac{x}{\sqrt{x^2 + 9}}`, txt: R`O \(2\) cancela com o \(\tfrac12\), e o expoente negativo leva a raiz para o denominador.`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Três camadas', nivel: 'dificil',
      enunciado: R`<p>Derive \(f(x) = \big(1 + \sqrt{2x + 1}\,\big)^4\).</p>`,
      confere: { derivada: '(1 + sqrt(2x + 1))^4', dom: [0, 3] },
      passos: [
        { tex: R`y = u^4, \qquad u = 1 + \sqrt{w}, \qquad w = 2x + 1`, txt: R`Identificamos as camadas, de fora para dentro: a quarta potência, depois “um mais a raiz”, depois \(2x + 1\).` },
        { tex: R`\frac{dy}{du} = 4u^3 \qquad \frac{du}{dw} = \frac{1}{2\sqrt{w}} \qquad \frac{dw}{dx} = 2`, txt: R`Derivada de cada camada em relação à variável da camada seguinte.` },
        { tex: R`f'(x) = 4\big(1 + \sqrt{2x + 1}\,\big)^3 \cdot \frac{1}{2\sqrt{2x + 1}} \cdot 2`, txt: R`Multiplicamos as três derivadas e voltamos tudo para a variável \(x\).`, c: 1 },
        { tex: R`f'(x) = \frac{4\big(1 + \sqrt{2x + 1}\,\big)^3}{\sqrt{2x + 1}}`, txt: R`Simplificamos \(\tfrac{1}{2} \cdot 2 = 1\).`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Cadeia combinada com produto', nivel: 'dificil',
      enunciado: R`<p>Derive \(f(x) = x^2 (2x - 5)^4\).</p>`,
      confere: { derivada: 'x^2*(2x - 5)^4' },
      passos: [
        { tex: R`u = x^2 \qquad v = (2x - 5)^4`, txt: R`A operação “mais externa” é um produto, então começamos pela regra do produto.` },
        { tex: R`u' = 2x \qquad v' = 4(2x - 5)^3 \cdot 2 = 8(2x - 5)^3`, txt: R`\(u'\) pela regra da potência; \(v'\) pela regra da cadeia (a derivada de dentro, \(2x - 5\), é \(2\)).` },
        { tex: R`f'(x) = 2x(2x - 5)^4 + x^2 \cdot 8(2x - 5)^3`, txt: R`Montamos \(u'v + uv'\).`, c: 1 },
        { tex: R`f'(x) = 2x(2x - 5)^3\big[(2x - 5) + 4x\big] = 2x(2x - 5)^3(6x - 5)`, txt: R`Colocamos em evidência o fator comum \(2x(2x - 5)^3\). A forma fatorada é a mais útil para estudar o sinal da derivada.`, c: 1 },
      ],
    } },

    { erros: [
      { e: R`Esquecer a derivada de dentro: \(\big((3x + 1)^5\big)' = 5(3x + 1)^4\).`,
        c: R`Falta multiplicar por \((3x + 1)' = 3\): o resultado é \(15(3x + 1)^4\).` },
      { e: R`Derivar a de dentro <em>no lugar</em> dela: \(\big((x^2 + 1)^3\big)' = 3(2x)^2\).`,
        c: R`A de dentro fica intacta na derivada de fora: \(3(x^2 + 1)^2 \cdot 2x\).` },
      { e: R`Parar na segunda camada: \(\big(\sen^3(2x)\big)' = 3\sen^2(2x) \cdot \cos(2x)\).`,
        c: R`Ainda falta a derivada de \(2x\): \(3\sen^2(2x) \cdot \cos(2x) \cdot 2\).` },
      { e: R`Confundir \(\sen(x^2)\) com \(\sen^2 x\).`,
        c: R`Em \(\sen(x^2)\) a de fora é o seno: derivada \(2x\cos(x^2)\). Em \(\sen^2 x = (\sen x)^2\) a de fora é o quadrado: derivada \(2\sen x \cos x\).` },
    ] },

    { exercicios: [
      { q: R`Derive \(f(x) = (x^2 - 4x)^6\).`,
        r: R`<p>\(f'(x) = 6(x^2 - 4x)^5(2x - 4)\).</p>`,
        c: { derivada: '(x^2 - 4x)^6', tex: R`f'(x) = 6(x^2 - 4x)^5(2x - 4)` } },
      { q: R`Derive \(g(x) = \dfrac{1}{(2x + 3)^2}\) reescrevendo como potência.`,
        r: R`<p>\(g(x) = (2x + 3)^{-2}\), logo \(g'(x) = -2(2x + 3)^{-3} \cdot 2 = -\dfrac{4}{(2x + 3)^3}\).</p>`,
        c: { derivada: '1/(2x + 3)^2', tex: R`g'(x) = -2(2x + 3)^{-3} \cdot 2 = -\dfrac{4}{(2x + 3)^3}` } },
      { q: R`Derive \(h(x) = \sqrt{1 + \sqrt{x}}\).`,
        r: R`<p>\(h'(x) = \dfrac{1}{2\sqrt{1 + \sqrt{x}}} \cdot \dfrac{1}{2\sqrt{x}} = \dfrac{1}{4\sqrt{x}\,\sqrt{1 + \sqrt{x}}}\).</p>`,
        c: { derivada: 'sqrt(1 + sqrt(x))', dom: [0.3, 4], tex: R`h'(x) = \dfrac{1}{2\sqrt{1 + \sqrt{x}}} \cdot \dfrac{1}{2\sqrt{x}} = \dfrac{1}{4\sqrt{x}\,\sqrt{1 + \sqrt{x}}}` } },
    ] },
  ],
};
