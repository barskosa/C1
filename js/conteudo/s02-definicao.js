// Seção 2 — Definição de derivada
import { R } from '../ui/tex.js';

export default {
  lide: R`O limite da seção anterior ganha nome, notação e uma receita de cálculo: a derivada em um ponto e a derivada como função.`,
  objetivos: [
    R`Calcular \(f'(a)\) diretamente pela definição (limite do quociente de Newton).`,
    R`Obter a <strong>função derivada</strong> \(f'(x)\) e entender o que ela mede.`,
    R`Ler e escrever as notações \(f'(x)\), \(\dfrac{dy}{dx}\), \(Df\) e \(\dot{y}\).`,
  ],
  blocos: [
    { h2: 'Do limite à derivada' },
    { html: R`
      <p>Na <a href="teoria.html?s=motivacao">seção 1</a> apareceu sempre a mesma conta: a variação de \(f\) entre
      \(a\) e \(a + h\), dividida por \(h\), com \(h\) tendendo a zero. Essa fração é chamada de
      <span class="termo">quociente de Newton</span> (ou razão incremental), e o seu limite é a derivada.</p>` },
    { caixa: 'intuicao', titulo: 'A derivada é uma “máquina de inclinações”',
      html: R`
      <p>Em cada ponto do gráfico existe uma inclinação (a da reta tangente). A derivada \(f'\) é a função que
      guarda todas essas inclinações: você entrega um \(x\) e ela devolve a inclinação do gráfico de \(f\) naquele \(x\).
      Onde \(f\) sobe depressa, \(f'\) é grande; onde \(f\) desce, \(f'\) é negativa; nos topos e fundos, \(f'\) vale zero.</p>` },
    { caixa: 'definicao', titulo: 'Derivada em um ponto',
      html: R`
      <p>A derivada de \(f\) no ponto \(a\) é o número</p>
      \[ f'(a) = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h}, \]
      <p>desde que esse limite exista (e seja finito). Nesse caso dizemos que \(f\) é <strong>derivável</strong> (ou diferenciável) em \(a\).
      Trocando \(a + h\) por \(x\), a mesma definição fica</p>
      \[ f'(a) = \lim_{x \to a} \frac{f(x) - f(a)}{x - a}. \]` },
    { caixa: 'definicao', titulo: 'Derivada como função',
      html: R`
      <p>Deixando o ponto variar, obtemos uma nova função, a <strong>função derivada</strong> de \(f\):</p>
      \[ f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}. \]
      <p>Seu domínio é o conjunto dos pontos em que o limite existe. Calcular esse limite é <em>derivar</em> a função.</p>` },
    { widget: 'tracador', funcoes: ['quadratica', 'cubica', 'seno'],
      legenda: R`Mova o ponto: a altura do gráfico de baixo (\(f'\)) é sempre igual à inclinação da tangente no gráfico de cima (\(f\)).` },

    { h2: 'Notações' },
    { html: R`<p>A mesma derivada aparece escrita de várias formas, cada uma herdada de um matemático. Todas significam a mesma coisa; vale reconhecer todas.</p>` },
    { tabela: {
      cab: ['Notação', 'Nome', 'Como se lê', 'Quando costuma aparecer'],
      linhas: [
        [R`\(f'(x)\), \(y'\)`, 'Lagrange', R`“f linha de x”`, 'Uso geral; é a mais compacta.'],
        [R`\(\dfrac{dy}{dx}\), \(\dfrac{df}{dx}\), \(\dfrac{d}{dx}\,f(x)\)`, 'Leibniz', R`“dê y dê x”`, R`Deixa claro em relação a qual variável se deriva; ótima na regra da cadeia.`],
        [R`\(Df\), \(D_x f\)`, 'Euler', R`“D de f”`, 'Trata a derivação como um operador aplicado à função.'],
        [R`\(\dot{y}\)`, 'Newton', R`“y ponto”`, R`Derivadas em relação ao <em>tempo</em>, comum na Física.`],
      ],
      legenda: R`No ponto \(a\): \(f'(a)\), ou \(\left.\dfrac{dy}{dx}\right|_{x=a}\) na notação de Leibniz.`,
    } },
    { caixa: 'nota',
      html: R`<p>Na notação de Leibniz, \(\dfrac{dy}{dx}\) <strong>não é uma fração</strong> comum: é o limite de
      \(\dfrac{\Delta y}{\Delta x}\). Os símbolos \(dy\) e \(dx\) não podem ser “cancelados”, embora a notação
      seja construída para lembrar uma fração (o que ajuda muito na <a href="teoria.html?s=regra-da-cadeia">regra da cadeia</a>).</p>` },

    { h2: 'A receita em quatro passos' },
    { caixa: 'formula', rotulo: 'Roteiro', titulo: 'Derivando pela definição',
      html: R`
      <ol>
        <li>Calcule \(f(x + h)\), trocando cada \(x\) por \((x + h)\).</li>
        <li>Monte a diferença \(f(x + h) - f(x)\) e simplifique (os termos sem \(h\) devem cancelar).</li>
        <li>Divida por \(h\), cancelando o fator \(h\).</li>
        <li>Faça \(h \to 0\) no que sobrou.</li>
      </ol>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Derivada em um ponto', nivel: 'facil',
      enunciado: R`<p>Use a definição para calcular \(f'(3)\), sendo \(f(x) = x^2\).</p>`,
      confere: { valor: (m) => m.d('x^2', 3) },
      passos: [
        { tex: R`f(3 + h) = (3 + h)^2 = 9 + 6h + h^2`, txt: R`Passo 1: calculamos a função em \(3 + h\) (lembre de \((a + b)^2 = a^2 + 2ab + b^2\)).`, c: { igual: '(3 + h)^2', vars: ['h'] } },
        { tex: R`f(3 + h) - f(3) = 9 + 6h + h^2 - 9 = 6h + h^2`, txt: R`Passo 2: subtraímos \(f(3) = 9\). O termo sem \(h\) cancela.`, c: { igual: '(3 + h)^2 - 9', vars: ['h'] } },
        { tex: R`\frac{f(3 + h) - f(3)}{h} = \frac{6h + h^2}{h} = 6 + h`, txt: R`Passo 3: dividimos por \(h\), colocando \(h\) em evidência no numerador.`, c: { igual: '((3 + h)^2 - 9)/h', vars: ['h'] } },
        { tex: R`f'(3) = \lim_{h \to 0} (6 + h) = 6`, txt: R`Passo 4: com \(h \to 0\), sobra \(6\). A tangente à parábola em \(x = 3\) tem inclinação \(6\).`, c: 1, seg: 'ultimo' },
      ],
    } },
    { exemplo: {
      titulo: 'A função derivada de um polinômio', nivel: 'medio',
      enunciado: R`<p>Determine \(f'(x)\) pela definição, para \(f(x) = x^2 - 3x\).</p>`,
      confere: { derivada: 'x^2 - 3x' },
      passos: [
        { tex: R`f(x + h) = (x + h)^2 - 3(x + h) = x^2 + 2xh + h^2 - 3x - 3h`, txt: R`Trocamos cada \(x\) por \((x + h)\) e expandimos.`, c: { igual: '(x + h)^2 - 3*(x + h)', vars: ['x', 'h'] } },
        { tex: R`f(x + h) - f(x) = 2xh + h^2 - 3h`, txt: R`Subtraímos \(f(x) = x^2 - 3x\): os termos \(x^2\) e \(-3x\) cancelam, e todos os que sobram têm \(h\).`, c: { igual: '(x + h)^2 - 3*(x + h) - (x^2 - 3x)', vars: ['x', 'h'] } },
        { tex: R`\frac{f(x + h) - f(x)}{h} = \frac{h(2x + h - 3)}{h} = 2x + h - 3`, txt: R`Colocamos \(h\) em evidência e cancelamos com o denominador.`, c: { igual: '((x + h)^2 - 3*(x + h) - (x^2 - 3x))/h', vars: ['x', 'h'] } },
        { tex: R`f'(x) = \lim_{h \to 0} (2x + h - 3) = 2x - 3`, txt: R`Fazendo \(h \to 0\). O resultado é uma função: em \(x = 0\) a inclinação é \(-3\); em \(x = 1{,}5\) ela é zero.`, c: 1, seg: 'ultimo' },
      ],
    } },
    { exemplo: {
      titulo: 'Raiz quadrada: o truque do conjugado', nivel: 'dificil',
      enunciado: R`<p>Determine \(f'(x)\) pela definição, para \(f(x) = \sqrt{x}\) com \(x > 0\).</p>`,
      confere: { derivada: 'sqrt(x)', dom: [0.3, 4] },
      passos: [
        { tex: R`\frac{f(x + h) - f(x)}{h} = \frac{\sqrt{x + h} - \sqrt{x}}{h}`, txt: R`Montamos o quociente de Newton. Aqui não dá para “expandir” a raiz, então precisamos de outra ideia.`, c: { igual: '(sqrt(x + h) - sqrt(x))/h', vars: ['x', 'h'], dom: { x: [0.5, 4], h: [0.05, 0.4] } } },
        { tex: R`\frac{\sqrt{x + h} - \sqrt{x}}{h} \cdot \frac{\sqrt{x + h} + \sqrt{x}}{\sqrt{x + h} + \sqrt{x}} = \frac{(x + h) - x}{h\left(\sqrt{x + h} + \sqrt{x}\right)}`, txt: R`Multiplicamos em cima e embaixo pelo <strong>conjugado</strong> do numerador. Em cima usamos \((A - B)(A + B) = A^2 - B^2\), o que elimina as raízes.`, c: { igual: '(sqrt(x + h) - sqrt(x))/h', vars: ['x', 'h'], dom: { x: [0.5, 4], h: [0.05, 0.4] }, seg: 'tudo' } },
        { tex: R`\frac{h}{h\left(\sqrt{x + h} + \sqrt{x}\right)} = \frac{1}{\sqrt{x + h} + \sqrt{x}}`, txt: R`O numerador se reduz a \(h\), que cancela com o \(h\) do denominador.`, c: { igual: '(sqrt(x + h) - sqrt(x))/h', vars: ['x', 'h'], dom: { x: [0.5, 4], h: [0.05, 0.4] }, seg: 'tudo' } },
        { tex: R`f'(x) = \lim_{h \to 0} \frac{1}{\sqrt{x + h} + \sqrt{x}} = \frac{1}{2\sqrt{x}}`, txt: R`Com \(h \to 0\), o denominador tende a \(\sqrt{x} + \sqrt{x} = 2\sqrt{x}\). Repare que \(f'\) não existe em \(x = 0\), embora \(f\) exista.`, c: 1, seg: 'ultimo' },
      ],
    } },

    { erros: [
      { e: R`Escrever \(f(x + h) = f(x) + h\), por exemplo \((x + h)^2 = x^2 + h\).`,
        c: R`\(f(x + h)\) significa <em>substituir</em> \(x\) por \((x + h)\) em toda a expressão: \((x + h)^2 = x^2 + 2xh + h^2\).` },
      { e: R`Esquecer os parênteses ao subtrair: \(f(x + h) - x^2 - 3x\) no lugar de \(f(x + h) - (x^2 - 3x)\).`,
        c: R`O sinal de menos vale para a função inteira: \(-(x^2 - 3x) = -x^2 + 3x\).` },
      { e: R`Tratar \(\dfrac{dy}{dx}\) como fração e “cancelar os d”.`,
        c: R`\(\dfrac{dy}{dx}\) é um símbolo único para o limite de \(\dfrac{\Delta y}{\Delta x}\).` },
      { e: R`Para achar \(f'(3)\), calcular primeiro \(f(3) = 9\) e depois “derivar o 9”, obtendo zero.`,
        c: R`Derive primeiro a função e só depois substitua o ponto: \(f'(x) = 2x \Rightarrow f'(3) = 6\).` },
    ] },

    { exercicios: [
      { q: R`Calcule \(f'(x)\) pela definição para \(f(x) = 3x + 2\). O resultado depende de \(x\)?`,
        r: R`<p>\(\dfrac{3(x + h) + 2 - (3x + 2)}{h} = \dfrac{3h}{h} = 3\). A derivada é a constante \(3\): uma reta tem a mesma inclinação em todos os pontos.</p>`,
        c: { derivada: '3x + 2', tex: R`\dfrac{3h}{h} = 3`, seg: 'ultimo' } },
      { q: R`Calcule \(f'(-1)\) pela definição para \(f(x) = x^2 + 1\).`,
        r: R`<p>\(\dfrac{(-1 + h)^2 + 1 - 2}{h} = \dfrac{-2h + h^2}{h} = -2 + h\), que tende a \(-2\).</p>`,
        c: { igual: '((-1 + h)^2 + 1 - 2)/h', vars: ['h'], tex: R`\dfrac{(-1 + h)^2 + 1 - 2}{h} = \dfrac{-2h + h^2}{h} = -2 + h`, seg: 'tudo' } },
      { q: R`Use \((x + h)^3 = x^3 + 3x^2h + 3xh^2 + h^3\) para derivar \(f(x) = x^3\) pela definição.`,
        r: R`<p>\(\dfrac{(x + h)^3 - x^3}{h} = 3x^2 + 3xh + h^2\), que tende a \(f'(x) = 3x^2\).</p>`,
        c: [{ igual: '((x + h)^3 - x^3)/h', vars: ['x', 'h'], tex: R`\dfrac{(x + h)^3 - x^3}{h} = 3x^2 + 3xh + h^2`, seg: 'tudo' }, { derivada: 'x^3', tex: R`f'(x) = 3x^2`, seg: 'ultimo' }] },
    ] },
  ],
};
