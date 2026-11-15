// Seção 14.4 — Teorema de Rolle e Teorema do Valor Médio
import { R } from '../ui/tex.js';

export default {
  lide: R`Se você percorreu 150 km em 2 horas, em algum instante o velocímetro marcou exatamente 75 km/h. O Teorema do Valor Médio torna essa ideia precisa e sustenta quase tudo o que vem depois.`,
  objetivos: [
    R`Enunciar o <strong>Teorema de Rolle</strong> e o <strong>Teorema do Valor Médio</strong> (TVM), com suas hipóteses.`,
    R`Encontrar o(s) ponto(s) \(c\) garantidos pelos teoremas.`,
    R`Entender por que o sinal de \(f'\) determina o crescimento de \(f\).`,
  ],
  blocos: [
    { h2: 'Taxa média = taxa instantânea em algum ponto' },
    { caixa: 'intuicao', titulo: 'A tangente paralela à secante',
      html: R`
      <p>Ligue os extremos de um trecho do gráfico por uma reta (a secante). Se o gráfico é contínuo e suave, em algum ponto
      intermediário a tangente é <strong>paralela</strong> a essa secante: a inclinação instantânea iguala a inclinação média.
      Ajuste \(a\) e \(b\) no gráfico e veja onde isso acontece (às vezes em mais de um ponto).</p>` },
    { widget: 'tvm',
      legenda: R`A secante por \((a, f(a))\) e \((b, f(b))\) (laranja) e as tangentes paralelas a ela (verde, tracejadas) nos pontos \(c\) do Teorema do Valor Médio.` },
    { caixa: 'teorema', titulo: 'Teorema de Rolle',
      html: R`
      <p>Se \(f\) é contínua em \([a, b]\), derivável em \((a, b)\) e \(f(a) = f(b)\), então existe pelo menos um \(c\) em \((a, b)\) tal que</p>
      \[ f'(c) = 0. \]
      <p>Em palavras: se a função sai e chega na mesma altura, em algum ponto do caminho a tangente é horizontal.</p>` },
    { caixa: 'teorema', titulo: 'Teorema do Valor Médio (Lagrange)',
      html: R`
      <p>Se \(f\) é contínua em \([a, b]\) e derivável em \((a, b)\), então existe pelo menos um \(c\) em \((a, b)\) tal que</p>
      \[ f'(c) = \frac{f(b) - f(a)}{b - a}. \]
      <p>O Teorema de Rolle é o caso particular em que \(f(a) = f(b)\).</p>`,
      porque: R`
      <p>Subtraia de \(f\) a reta secante: \(g(x) = f(x) - \left[f(a) + \dfrac{f(b) - f(a)}{b - a}(x - a)\right]\). Essa função vale zero em \(a\) e em \(b\),
      então, pelo Teorema de Rolle, \(g'(c) = 0\) para algum \(c\); e \(g'(c) = f'(c) - \dfrac{f(b) - f(a)}{b - a}\).</p>` },
    { caixa: 'formula', rotulo: 'Consequências', titulo: 'O que o TVM garante',
      html: R`
      <ul>
        <li>Se \(f'(x) = 0\) em todo um intervalo, então \(f\) é <strong>constante</strong> nele.</li>
        <li>Se \(f'(x) > 0\) em um intervalo, \(f\) é <strong>crescente</strong> nele; se \(f'(x) < 0\), é <strong>decrescente</strong>.</li>
        <li>Se duas funções têm a mesma derivada em um intervalo, elas diferem por uma constante.</li>
      </ul>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Verificando o Teorema de Rolle', nivel: 'facil',
      enunciado: R`<p>Verifique as hipóteses do Teorema de Rolle para \(f(x) = x^2 - 4x + 3\) em \([1, 3]\) e encontre o ponto \(c\).</p>`,
      confere: { valor: 2 },
      passos: [
        { tex: R`f(1) = 1 - 4 + 3 = 0 \qquad f(3) = 9 - 12 + 3 = 0`, txt: R`\(f\) é um polinômio (contínua e derivável em toda parte) e tem o mesmo valor nos extremos. As hipóteses valem.`, c: { fn: (m) => m.perto(m.num('x^2 - 4x + 3', { x: 1 }), 0, 1e-9, 1e-9) && m.perto(m.num('x^2 - 4x + 3', { x: 3 }), 0, 1e-9, 1e-9) } },
        { tex: R`f'(x) = 2x - 4`, txt: R`Derivamos.`, c: { derivada: 'x^2 - 4x + 3' } },
        { tex: R`2c - 4 = 0 \;\Rightarrow\; c = 2`, txt: R`Resolvemos \(f'(c) = 0\). O ponto \(c = 2\) está em \((1, 3)\): é o vértice da parábola, onde a tangente é horizontal.`, c: 1, seg: 'ultimo' },
      ],
    } },
    { exemplo: {
      titulo: 'O ponto do Teorema do Valor Médio', nivel: 'medio',
      enunciado: R`<p>Encontre o valor de \(c\) garantido pelo TVM para \(f(x) = x^3\) no intervalo \([0, 3]\).</p>`,
      confere: { valor: 'sqrt(3)' },
      passos: [
        { tex: R`\frac{f(3) - f(0)}{3 - 0} = \frac{27 - 0}{3} = 9`, txt: R`Taxa de variação média no intervalo (inclinação da secante).`, c: { valor: 9, seg: [1, 2] } },
        { tex: R`f'(c) = 3c^2`, txt: R`Derivada no ponto \(c\) a determinar.` },
        { tex: R`3c^2 = 9 \;\Rightarrow\; c^2 = 3 \;\Rightarrow\; c = \sqrt{3} \approx 1{,}73`, txt: R`Igualamos. Das duas soluções \(\pm\sqrt{3}\), só \(\sqrt{3}\) pertence ao intervalo \((0, 3)\).`, c: { fn: (m) => m.perto(m.d('x^3', Math.sqrt(3)), 9) } },
      ],
    } },
    { exemplo: {
      titulo: 'Quando o teorema não se aplica', nivel: 'dificil',
      enunciado: R`<p>Para \(f(x) = |x|\) em \([-1, 2]\), existe \(c\) com \(f'(c) = \dfrac{f(2) - f(-1)}{2 - (-1)}\)? O TVM se aplica?</p>`,
      confere: { valor: 1 / 3 },
      passos: [
        { tex: R`\frac{f(2) - f(-1)}{2 - (-1)} = \frac{2 - 1}{3} = \frac{1}{3}`, txt: R`Taxa média no intervalo.`, c: 1, seg: [1, 2] },
        { tex: R`f'(x) = -1 \ \text{ se } x < 0 \qquad f'(x) = 1 \ \text{ se } x > 0`, txt: R`Onde existe, a derivada do módulo só assume os valores \(-1\) e \(1\); em \(x = 0\) ela não existe (bico).` },
        { tex: R`f'(c) \neq \frac{1}{3} \ \text{ para todo } c`, txt: R`Não existe \(c\) com \(f'(c) = \tfrac13\). Isso não contradiz o teorema: a hipótese “derivável em \((a, b)\)” falha em \(x = 0\). As hipóteses não são formalidade.` },
      ],
    } },

    { erros: [
      { e: R`Aplicar o TVM sem verificar as hipóteses (continuidade no intervalo fechado e derivabilidade no aberto).`,
        c: R`Com um bico, um salto ou uma assíntota no intervalo, o ponto \(c\) pode não existir.` },
      { e: R`Aceitar soluções fora do intervalo aberto \((a, b)\).`,
        c: R`Em \(3c^2 = 9\) para \([0, 3]\), só \(c = \sqrt{3}\) serve; \(c = -\sqrt{3}\) está fora.` },
      { e: R`Achar que o ponto \(c\) é sempre único, ou sempre o ponto médio do intervalo.`,
        c: R`O teorema garante <em>pelo menos um</em>. Só para funções quadráticas \(c\) é sempre o ponto médio.` },
      { e: R`Confundir \(f(c)\) com \(f'(c)\) na conclusão.`,
        c: R`O TVM fala da <em>derivada</em> em \(c\): \(f'(c)\) é igual à taxa média.` },
    ] },

    { exercicios: [
      { q: R`Encontre \(c\) do TVM para \(f(x) = x^2\) em \([1, 5]\).`,
        r: R`<p>Taxa média: \(\dfrac{25 - 1}{4} = 6\). \(f'(c) = 2c = 6\), logo \(c = 3\) (o ponto médio, como em toda parábola).</p>`,
        c: { valor: 6, tex: R`\dfrac{25 - 1}{4} = 6`, seg: 'tudo' } },
      { q: R`Encontre \(c\) do TVM para \(f(x) = \sqrt{x}\) em \([1, 9]\).`,
        r: R`<p>Taxa média: \(\dfrac{3 - 1}{8} = \dfrac{1}{4}\). \(\dfrac{1}{2\sqrt{c}} = \dfrac{1}{4}\) dá \(\sqrt{c} = 2\), isto é, \(c = 4\).</p>`,
        c: { valor: (m) => m.d('sqrt(x)', 4), tex: R`\dfrac{3 - 1}{8} = \dfrac{1}{4}`, seg: 'tudo' } },
      { q: R`Um carro passou por dois radares a 10 km de distância em 5 minutos. O limite da via é 100 km/h. Dá para afirmar que ele excedeu o limite?`,
        r: R`<p>Sim. A velocidade média foi \(\dfrac{10}{5/60} = 120\) km/h; pelo TVM, em algum instante a velocidade foi exatamente 120 km/h.</p>`,
        c: { valor: 120, tex: R`\dfrac{10}{5/60} = 120`, seg: 'tudo' } },
    ] },
  ],
};
