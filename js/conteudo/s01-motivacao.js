// Seção 1 — Motivação: taxas de variação
import { R } from '../ui/tex.js';

export default {
  lide: R`Antes de qualquer fórmula, a pergunta que a derivada responde: <em>com que rapidez uma grandeza está mudando neste exato instante?</em>`,
  objetivos: [
    R`Calcular a <strong>taxa de variação média</strong> de uma função em um intervalo.`,
    R`Entender a <strong>velocidade instantânea</strong> como limite de velocidades médias.`,
    R`Ligar taxa média à inclinação da reta <strong>secante</strong> e taxa instantânea à inclinação da reta <strong>tangente</strong>.`,
  ],
  blocos: [
    { h2: 'O problema: quão rápido algo muda?' },
    { html: R`
      <p>Imagine uma viagem de carro de 150 km feita em 2 horas. A <span class="termo">velocidade média</span> foi de
      \(150/2 = 75\) km/h. Mas ninguém dirige exatamente a 75 km/h o tempo todo: o velocímetro mostra um número diferente
      a cada momento. Esse número é a <span class="termo">velocidade instantânea</span>.</p>
      <p>Só que há um problema. Velocidade é distância dividida por tempo, e em um único instante não passa tempo
      nenhum nem se percorre distância nenhuma. A conta seria \(0/0\), que não tem significado. Como, então, dar sentido
      à velocidade <em>em um instante</em>?</p>` },
    { caixa: 'intuicao', titulo: 'Olhe intervalos cada vez menores',
      html: R`
      <p>Calcule a velocidade média em um intervalo curto que começa no instante desejado. Depois em um intervalo mais
      curto. E mais curto ainda. Se esses valores se aproximam de um número fixo, esse número é a velocidade naquele
      instante. A derivada é exatamente esse “número para o qual as taxas médias tendem”.</p>` },

    { h2: 'Taxa de variação média' },
    { html: R`
      <p>Para uma função qualquer \(y = f(x)\), quando \(x\) passa de \(a\) para \(b\), a variação da entrada é
      \(\Delta x = b - a\) e a variação da saída é \(\Delta y = f(b) - f(a)\). A taxa média diz quanto \(y\) variou
      <em>por unidade</em> de \(x\).</p>` },
    { caixa: 'definicao', titulo: 'Taxa de variação média',
      html: R`
      <p>A taxa de variação média de \(f\) no intervalo \([a, b]\) é</p>
      \[ \frac{\Delta y}{\Delta x} = \frac{f(b) - f(a)}{b - a}. \]
      <p>No gráfico, é a <strong>inclinação da reta secante</strong> que passa pelos pontos \((a, f(a))\) e \((b, f(b))\).</p>` },
    { grafico: {
      x: [-0.6, 4], y: [-1, 10.5],
      descricao: 'Parábola y = x² com a reta secante pelos pontos (1, 1) e (3, 9).',
      itens: [
        { tipo: 'funcao', f: (x) => x * x, cor: 1 },
        { tipo: 'reta', ponto: [1, 1], m: 4, cor: 2 },
        { tipo: 'segmento', de: [1, 1], ate: [3, 1], cor: 0, pontilhado: true },
        { tipo: 'segmento', de: [3, 1], ate: [3, 9], cor: 0, pontilhado: true },
        { tipo: 'texto', x: 2, y: 1, texto: 'Δx = 2', pos: 's' },
        { tipo: 'texto', x: 3, y: 5, texto: 'Δy = 8', pos: 'e' },
        { tipo: 'ponto', x: 1, y: 1, cor: 2, rotulo: '(1, 1)', pos: 'nw' },
        { tipo: 'ponto', x: 3, y: 9, cor: 2, rotulo: '(3, 9)', pos: 'nw' },
      ],
      legenda: R`Para \(f(x) = x^2\) em \([1, 3]\): \(\Delta y / \Delta x = 8/2 = 4\), a inclinação da secante (em laranja).`,
    } },

    { h2: 'Da taxa média à taxa instantânea' },
    { html: R`
      <p>Um objeto em queda livre percorre aproximadamente \(s(t) = 5t^2\) metros em \(t\) segundos. Qual é a
      velocidade dele exatamente em \(t = 1\) s? Vamos calcular a velocidade média no intervalo \([1, 1 + h]\), para
      valores de \(h\) cada vez menores:</p>
      \[ v_m = \frac{s(1 + h) - s(1)}{h} = \frac{5(1 + h)^2 - 5}{h} = \frac{10h + 5h^2}{h} = 10 + 5h. \]` },
    { tabela: {
      classe: 'tabela--centro tabela--numeros',
      cab: [R`\(h\) (s)`, '1', '0,5', '0,1', '0,01', '0,001'],
      linhas: [[R`\(v_m = 10 + 5h\) (m/s)`, '15', '12,5', '10,5', '10,05', '10,005']],
      legenda: R`Quanto menor o intervalo, mais perto de 10 m/s fica a velocidade média.`,
    } },
    { html: R`
      <p>Os valores se aproximam de \(10\). Repare que <em>não</em> colocamos \(h = 0\) na fração original (daria
      \(0/0\)); primeiro simplificamos e só então observamos o que acontece quando \(h\) fica arbitrariamente pequeno.
      Esse processo é um <strong>limite</strong>, e escrevemos \(v(1) = \lim_{h \to 0} (10 + 5h) = 10\) m/s.</p>` },
    { caixa: 'definicao', titulo: 'Taxa de variação instantânea',
      html: R`
      <p>A taxa de variação instantânea de \(f\) em \(x = a\) é o limite das taxas médias em intervalos \([a, a + h]\)
      cada vez menores:</p>
      \[ \lim_{h \to 0} \frac{f(a + h) - f(a)}{h}. \]
      <p>Quando \(f\) é a posição \(s(t)\) de um móvel, esse limite é a <strong>velocidade instantânea</strong> \(v(a)\).</p>` },

    { h2: 'A mesma ideia no gráfico: a reta tangente' },
    { html: R`
      <p>Cada taxa média é a inclinação de uma secante. Quando o segundo ponto se aproxima do primeiro, as secantes
      giram e se aproximam de uma reta-limite: a <span class="termo">reta tangente</span>, que apenas “encosta” no
      gráfico naquele ponto, acompanhando a direção da curva.</p>` },
    { grafico: {
      x: [-0.6, 3.6], y: [-1.5, 10],
      descricao: 'Parábola y = x² com secantes a partir do ponto (1, 1) para h = 2, 1 e 0,5 e a reta tangente em (1, 1).',
      itens: [
        { tipo: 'funcao', f: (x) => x * x, cor: 1 },
        { tipo: 'reta', ponto: [1, 1], m: 4, cor: 2, fino: true },
        { tipo: 'reta', ponto: [1, 1], m: 3, cor: 2, fino: true },
        { tipo: 'reta', ponto: [1, 1], m: 2.5, cor: 2, fino: true },
        { tipo: 'reta', ponto: [1, 1], m: 2, cor: 3 },
        { tipo: 'ponto', x: 3, y: 9, cor: 2, rotulo: 'h = 2', pos: 'w' },
        { tipo: 'ponto', x: 2, y: 4, cor: 2, rotulo: 'h = 1', pos: 'nw' },
        { tipo: 'ponto', x: 1.5, y: 2.25, cor: 2, rotulo: 'h = 0,5', pos: 'nw' },
        { tipo: 'ponto', x: 1, y: 1, cor: 3, rotulo: 'P', pos: 'se' },
      ],
      legenda: R`Secantes por \(P = (1, 1)\) com inclinações \(4\), \(3\) e \(2{,}5\) (laranja) aproximando-se da tangente, de inclinação \(2\) (verde).`,
    } },
    { caixa: 'formula', rotulo: 'Resumo', titulo: 'Três leituras do mesmo limite',
      html: R`
      \[ \lim_{h \to 0} \frac{f(a + h) - f(a)}{h} \]
      <ul>
        <li><strong>Taxa de variação instantânea</strong> de \(f\) em \(a\).</li>
        <li><strong>Velocidade instantânea</strong>, quando \(f\) é a posição de um móvel.</li>
        <li><strong>Inclinação da reta tangente</strong> ao gráfico de \(f\) no ponto \((a, f(a))\).</li>
      </ul>
      <p>Na próxima seção esse limite ganha nome e notação: é a <a href="teoria.html?s=definicao">derivada</a> de \(f\) em \(a\).</p>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Taxa de variação média', nivel: 'facil',
      enunciado: R`<p>Calcule a taxa de variação média de \(f(x) = x^2 + 1\) no intervalo \([1, 3]\).</p>`,
      confere: { valor: 4 },
      passos: [
        { tex: R`f(1) = 1^2 + 1 = 2 \qquad f(3) = 3^2 + 1 = 10`, txt: R`Calculamos o valor da função nos dois extremos do intervalo.` },
        { tex: R`\frac{\Delta y}{\Delta x} = \frac{f(3) - f(1)}{3 - 1}`, txt: R`Aplicamos a definição: variação de \(y\) dividida pela variação de \(x\).` },
        { tex: R`\frac{\Delta y}{\Delta x} = \frac{10 - 2}{2} = 4`, txt: R`Em média, \(f\) aumenta 4 unidades para cada unidade de \(x\) nesse intervalo. É a inclinação da secante por \((1, 2)\) e \((3, 10)\).`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Velocidade média e velocidade instantânea', nivel: 'medio',
      enunciado: R`<p>A posição de um carrinho é \(s(t) = t^2 + 2t\) (em metros, com \(t\) em segundos). Determine
        (a) a velocidade média entre \(t = 2\) e \(t = 4\) e (b) a velocidade instantânea em \(t = 2\).</p>`,
      confere: { valor: (m) => m.d('t^2 + 2t', 2, 't') },
      passos: [
        { tex: R`v_m = \frac{24 - 8}{4 - 2} = 8 \,\text{m/s}`, txt: R`(a) Velocidade média: variação da posição dividida pelo tempo gasto, com \(s(4) = 16 + 8 = 24\) e \(s(2) = 4 + 4 = 8\).`, c: { valor: 8 } },
        { tex: R`s(2 + h) = (2 + h)^2 + 2(2 + h) = 8 + 6h + h^2`, txt: R`(b) Para a velocidade instantânea, calculamos a posição um pouquinho depois de \(t = 2\), no instante \(2 + h\).`, c: { igual: '(2 + h)^2 + 2*(2 + h)', vars: ['h'] } },
        { tex: R`\frac{s(2 + h) - s(2)}{h} = \frac{6h + h^2}{h} = 6 + h`, txt: R`Montamos a velocidade média em \([2, 2 + h]\) e simplificamos: como \(h \neq 0\), podemos cancelar \(h\).`, c: { igual: '((2 + h)^2 + 2*(2 + h) - 8)/h', vars: ['h'] } },
        { tex: R`v(2) = \lim_{h \to 0} (6 + h) = 6 \,\text{m/s}`, txt: R`Quando \(h\) tende a zero, \(6 + h\) tende a \(6\). No instante \(t = 2\) o carrinho está a 6 m/s.`, c: 1, seg: 'ultimo' },
      ],
    } },
    { exemplo: {
      titulo: 'Inclinação da reta tangente por limite', nivel: 'dificil',
      enunciado: R`<p>Determine a inclinação da reta tangente ao gráfico de \(f(x) = \dfrac{1}{x}\) no ponto de abscissa \(x = 2\).</p>`,
      confere: { valor: (m) => m.d('1/x', 2) },
      passos: [
        { tex: R`\frac{f(2 + h) - f(2)}{h} = \frac{1}{h}\left( \frac{1}{2 + h} - \frac{1}{2} \right)`, txt: R`Escrevemos a inclinação da secante que passa pelos pontos de abscissas \(2\) e \(2 + h\).`, c: { igual: '(1/(2 + h) - 1/2)/h', vars: ['h'], dom: [-1, 1] } },
        { tex: R`\frac{1}{2 + h} - \frac{1}{2} = \frac{2 - (2 + h)}{2(2 + h)} = \frac{-h}{2(2 + h)}`, txt: R`Reduzimos as duas frações ao mesmo denominador.`, c: { igual: '1/(2 + h) - 1/2', vars: ['h'], dom: [-1, 1] } },
        { tex: R`\frac{f(2 + h) - f(2)}{h} = \frac{1}{h} \cdot \frac{-h}{2(2 + h)} = -\frac{1}{2(2 + h)}`, txt: R`Agora o \(h\) do numerador cancela com o \(h\) do denominador.`, c: { igual: '(1/(2 + h) - 1/2)/h', vars: ['h'], dom: [-1, 1] } },
        { tex: R`m = \lim_{h \to 0} \left( -\frac{1}{2(2 + h)} \right) = -\frac{1}{4}`, txt: R`Com \(h \to 0\), o denominador tende a \(2 \cdot 2 = 4\). A tangente em \(x = 2\) tem inclinação \(-\tfrac{1}{4}\): a função está decrescendo ali.`, c: 1, seg: 'ultimo' },
      ],
    } },

    { erros: [
      { e: R`Substituir \(h = 0\) direto no quociente \(\dfrac{f(a + h) - f(a)}{h}\) e concluir que “dá \(0/0\), então não existe”.`,
        c: R`\(0/0\) só indica que ainda falta simplificar. Primeiro cancele o fator \(h\); depois faça \(h \to 0\).` },
      { e: R`Expandir \((a + h)^2\) como \(a^2 + h^2\).`,
        c: R`\((a + h)^2 = a^2 + 2ah + h^2\). O termo \(2ah\) é justamente o que sobra depois de dividir por \(h\).` },
      { e: R`Calcular a taxa média como \(\dfrac{f(b)}{b}\) ou como a média entre \(f(a)\) e \(f(b)\).`,
        c: R`Taxa média é quociente de <em>variações</em>: \(\dfrac{f(b) - f(a)}{b - a}\).` },
      { e: R`Inverter a ordem em apenas uma das diferenças: \(\dfrac{f(a) - f(b)}{b - a}\).`,
        c: R`Use a mesma ordem em cima e embaixo (final menos inicial); senão o sinal da taxa sai trocado.` },
    ] },

    { exercicios: [
      { q: R`Calcule a taxa de variação média de \(f(x) = x^3\) no intervalo \([1, 2]\).`,
        r: R`<p>\(\dfrac{f(2) - f(1)}{2 - 1} = \dfrac{8 - 1}{1} = 7\).</p>`,
        c: { valor: 7, tex: R`\dfrac{8 - 1}{1} = 7`, seg: 'tudo' } },
      { q: R`Para \(s(t) = 3t^2\) (metros, segundos), simplifique a velocidade média em \([1, 1 + h]\) e obtenha a velocidade instantânea em \(t = 1\).`,
        r: R`<p>\(\dfrac{3(1 + h)^2 - 3}{h} = \dfrac{6h + 3h^2}{h} = 6 + 3h\), que tende a \(6\) m/s quando \(h \to 0\).</p>`,
        c: { igual: '(3*(1 + h)^2 - 3)/h', vars: ['h'], tex: R`\dfrac{3(1 + h)^2 - 3}{h} = \dfrac{6h + 3h^2}{h} = 6 + 3h`, seg: 'tudo' } },
      { q: R`Qual é a inclinação da secante ao gráfico de \(f(x) = x^2 - x\) pelos pontos de abscissas \(0\) e \(2\)?`,
        r: R`<p>\(\dfrac{f(2) - f(0)}{2 - 0} = \dfrac{2 - 0}{2} = 1\).</p>`,
        c: { valor: 1, tex: R`\dfrac{2 - 0}{2} = 1`, seg: 'tudo' } },
    ] },
  ],
};
