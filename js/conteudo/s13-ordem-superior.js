// Seção 13 — Derivadas de ordem superior
import { R } from '../ui/tex.js';

export default {
  lide: R`A derivada é uma função, então pode ser derivada de novo. A segunda derivada mede como a inclinação muda: é a aceleração de um movimento e a curvatura de um gráfico.`,
  objetivos: [
    R`Calcular derivadas segunda, terceira e de ordem \(n\), e reconhecer as notações.`,
    R`Interpretar a segunda derivada como <strong>aceleração</strong> e como taxa de variação da inclinação.`,
    R`Identificar padrões nas derivadas sucessivas de polinômios, exponenciais, senos e cossenos.`,
  ],
  blocos: [
    { h2: 'Derivar de novo' },
    { caixa: 'intuicao', titulo: 'Posição, velocidade, aceleração',
      html: R`
      <p>Se \(s(t)\) é a posição de um carro, \(s'(t)\) é a velocidade (o velocímetro). A derivada da velocidade diz quão
      rápido o velocímetro está mudando: é a <strong>aceleração</strong>, \(a(t) = v'(t) = s''(t)\). No gráfico de uma função,
      \(f''\) mede como a <em>inclinação</em> varia: \(f'' > 0\) significa inclinações crescentes (a curva “vira para cima”);
      \(f'' < 0\), inclinações decrescentes (a curva “vira para baixo”).</p>` },
    { caixa: 'definicao', titulo: 'Derivadas de ordem superior',
      html: R`
      <p>A <strong>segunda derivada</strong> de \(f\) é a derivada de \(f'\): \(f'' = (f')'\). Repetindo o processo, obtemos
      \(f''' = (f'')'\) e, em geral, a <strong>derivada de ordem \(n\)</strong>, \(f^{(n)}\), derivando \(n\) vezes.</p>` },
    { tabela: {
      classe: 'tabela--centro',
      cab: ['Ordem', 'Lagrange', 'Leibniz', 'Euler', 'Newton'],
      linhas: [
        ['1ª', R`\(f'(x)\), \(y'\)`, R`\(\dfrac{dy}{dx}\)`, R`\(Df\)`, R`\(\dot{y}\)`],
        ['2ª', R`\(f''(x)\), \(y''\)`, R`\(\dfrac{d^2y}{dx^2}\)`, R`\(D^2f\)`, R`\(\ddot{y}\)`],
        ['3ª', R`\(f'''(x)\), \(y'''\)`, R`\(\dfrac{d^3y}{dx^3}\)`, R`\(D^3f\)`, '—'],
        [R`\(n\)-ésima`, R`\(f^{(n)}(x)\), \(y^{(n)}\)`, R`\(\dfrac{d^ny}{dx^n}\)`, R`\(D^nf\)`, '—'],
      ],
      legenda: R`A partir da quarta ordem usa-se o número entre parênteses: \(f^{(4)}\). Os parênteses distinguem a derivada \(f^{(4)}\) da potência \(f^4\).`,
    } },

    { h2: 'Padrões úteis' },
    { caixa: 'formula', titulo: 'Derivadas sucessivas',
      html: R`
      <ul>
        <li><strong>Polinômios:</strong> cada derivação baixa o grau em 1. Para \(f(x) = x^n\), \(f^{(n)}(x) = n!\) e as derivadas seguintes são zero.</li>
        <li><strong>Exponencial:</strong> \(\dfrac{d^n}{dx^n}\,e^{kx} = k^n e^{kx}\).</li>
        <li><strong>Seno e cosseno:</strong> repetem-se em ciclos de quatro:
          \(\sen x \to \cos x \to -\sen x \to -\cos x \to \sen x \to \cdots\)</li>
      </ul>` },
    { grafico: {
      x: [-0.4, 4.4], y: [-10, 12], proporcao: 0.56,
      descricao: 'Gráficos da posição s, da velocidade v e da aceleração a de uma partícula.',
      itens: [
        { tipo: 'funcao', f: (t) => t ** 3 - 6 * t * t + 9 * t, cor: 1, dominio: [0, 4.4] },
        { tipo: 'funcao', f: (t) => 3 * t * t - 12 * t + 9, cor: 2, dominio: [0, 4.4] },
        { tipo: 'funcao', f: (t) => 6 * t - 12, cor: 3, dominio: [0, 4.4] },
        { tipo: 'texto', x: 4.05, y: 5.6, texto: 's(t)', cor: 1, pos: 'w' },
        { tipo: 'texto', x: 3.75, y: 10.4, texto: 'v(t)', cor: 2, pos: 'w' },
        { tipo: 'texto', x: 3.2, y: 9, texto: 'a(t)', cor: 3, pos: 'w' },
      ],
      legenda: R`Posição \(s(t) = t^3 - 6t^2 + 9t\) (azul), velocidade \(v = s'\) (laranja) e aceleração \(a = s''\) (verde): veja o Exemplo 2.`,
    } },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Todas as derivadas de um polinômio', nivel: 'facil',
      enunciado: R`<p>Calcule as derivadas sucessivas de \(f(x) = x^4 - 3x^2 + 2x\) até que se anulem.</p>`,
      confere: { derivada: 'x^4 - 3x^2 + 2x' },
      passos: [
        { tex: R`f'(x) = 4x^3 - 6x + 2`, txt: R`Primeira derivada: regra da potência termo a termo.`, c: 1 },
        { tex: R`f''(x) = 12x^2 - 6`, txt: R`Derivamos \(f'\).`, c: { derivada: 'x^4 - 3x^2 + 2x', ordem: 2 } },
        { tex: R`f'''(x) = 24x`, txt: R`Derivamos \(f''\).`, c: { derivada: 'x^4 - 3x^2 + 2x', ordem: 3 } },
        { tex: R`f^{(4)}(x) = 24`, txt: R`A quarta derivada de um polinômio de grau 4 é constante: \(4! = 24\) vezes o coeficiente líder.`, c: { derivada: 'x^4 - 3x^2 + 2x', ordem: 4 } },
        { tex: R`f^{(5)}(x) = 0`, txt: R`A partir daqui, todas as derivadas são nulas.`, c: { derivada: 'x^4 - 3x^2 + 2x', ordem: 5 } },
      ],
    } },
    { exemplo: {
      titulo: 'Velocidade e aceleração', nivel: 'medio',
      enunciado: R`<p>Uma partícula se move com posição \(s(t) = t^3 - 6t^2 + 9t\) (metros, segundos), \(t \geq 0\). Determine a velocidade, a aceleração e o instante em que a aceleração é nula.</p>`,
      confere: { derivada: 't^3 - 6t^2 + 9t', var: 't', ordem: 2 },
      passos: [
        { tex: R`v(t) = s'(t) = 3t^2 - 12t + 9`, txt: R`A velocidade é a primeira derivada da posição.`, c: { derivada: 't^3 - 6t^2 + 9t', var: 't' }, seg: 'ultimo' },
        { tex: R`a(t) = v'(t) = s''(t) = 6t - 12`, txt: R`A aceleração é a derivada da velocidade, ou seja, a segunda derivada da posição.`, c: 1, seg: 'ultimo' },
        { tex: R`6t - 12 = 0 \;\Rightarrow\; t = 2 \,\text{s}`, txt: R`Aceleração nula em \(t = 2\) s. Antes disso \(a < 0\) (a velocidade está diminuindo); depois, \(a > 0\) (a velocidade está aumentando).`, c: { valor: 2 }, seg: 'ultimo' },
        { tex: R`v(2) = 3 \cdot 2^2 - 12 \cdot 2 + 9 = -3 \,\text{m/s}`, txt: R`Nesse instante a velocidade atinge seu valor mínimo, \(-3\) m/s: a partícula está voltando o mais rápido que consegue.`, c: { valor: (m) => m.d('t^3 - 6t^2 + 9t', 2, 't') } },
      ],
    } },
    { exemplo: {
      titulo: 'Segunda derivada com produto e cadeia', nivel: 'dificil',
      enunciado: R`<p>Calcule \(f''(x)\) para \(f(x) = x\,e^{2x}\).</p>`,
      confere: { derivada: 'x*e^(2x)', ordem: 2 },
      passos: [
        { tex: R`f'(x) = 1 \cdot e^{2x} + x \cdot 2e^{2x} = e^{2x}(1 + 2x)`, txt: R`Primeira derivada: regra do produto, com \(\big(e^{2x}\big)' = 2e^{2x}\) pela regra da cadeia. Deixamos fatorado para facilitar a próxima derivação.`, c: { derivada: 'x*e^(2x)' } },
        { tex: R`f''(x) = 2e^{2x}(1 + 2x) + e^{2x} \cdot 2`, txt: R`Derivamos \(f'\), que é outro produto: \(u = e^{2x}\) (com \(u' = 2e^{2x}\)) e \(v = 1 + 2x\) (com \(v' = 2\)).`, c: 1 },
        { tex: R`f''(x) = e^{2x}(2 + 4x + 2) = 4e^{2x}(1 + x)`, txt: R`Colocamos \(e^{2x}\) em evidência e simplificamos.`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Encontrando o padrão da n-ésima derivada', nivel: 'dificil',
      enunciado: R`<p>Obtenha uma fórmula para \(f^{(n)}(x)\), sendo \(f(x) = \ln x\).</p>`,
      confere: { derivada: 'log(x)', dom: [0.4, 3] },
      passos: [
        { tex: R`f'(x) = \frac{1}{x} = x^{-1}`, txt: R`Primeira derivada, já escrita como potência para derivar de novo com facilidade.`, c: 1 },
        { tex: R`f''(x) = -x^{-2} \qquad f'''(x) = 2x^{-3} \qquad f^{(4)}(x) = -6x^{-4}`, txt: R`Cada derivação multiplica pelo expoente e o diminui em 1: aparecem os fatores \(-1\), \(-2\), \(-3\), …`, c: { fn: (m) => m.perto(m.d('log(x)', 1.7, 'x', 2), -(1.7 ** -2)) && m.perto(m.d('log(x)', 1.7, 'x', 3), 2 * 1.7 ** -3) && m.perto(m.d('log(x)', 1.7, 'x', 4), -6 * 1.7 ** -4) } },
        { tex: R`f^{(n)}(x) = \frac{(-1)^{n-1}\,(n-1)!}{x^n}`, txt: R`O sinal alterna (começando positivo), os fatores acumulados formam \((n-1)!\) e o expoente de \(x\) é \(n\). Conferindo com \(n = 4\): \(\dfrac{(-1)^3 \cdot 3!}{x^4} = -\dfrac{6}{x^4}\).`, c: { derivada: 'log(x)', ordem: 4, dom: [0.4, 3], fixos: { n: 4 } } },
      ],
    } },

    { erros: [
      { e: R`Confundir \(f''(x)\) com \(\big(f'(x)\big)^2\).`,
        c: R`\(f''\) é a derivada <em>da derivada</em>. Para \(f(x) = x^3\): \(f'' = 6x\), enquanto \((f')^2 = 9x^4\).` },
      { e: R`Ler \(\dfrac{d^2y}{dx^2}\) como \(\left(\dfrac{dy}{dx}\right)^2\).`,
        c: R`\(\dfrac{d^2y}{dx^2} = \dfrac{d}{dx}\left(\dfrac{dy}{dx}\right)\): é aplicar \(\dfrac{d}{dx}\) duas vezes.` },
      { e: R`Errar o ciclo do seno: \((\sen x)'' = \sen x\).`,
        c: R`\(\sen x \to \cos x \to -\sen x\). Logo \((\sen x)'' = -\sen x\).` },
      { e: R`Esquecer a cadeia a cada derivação: \(\big(e^{3x}\big)'' = 3e^{3x}\).`,
        c: R`Cada derivação traz um fator \(3\): \(\big(e^{3x}\big)'' = 9e^{3x}\).` },
    ] },

    { exercicios: [
      { q: R`Calcule \(f''(x)\) para \(f(x) = x^3 - 5x\).`,
        r: R`<p>\(f'(x) = 3x^2 - 5\) e \(f''(x) = 6x\).</p>`,
        c: { derivada: 'x^3 - 5x', ordem: 2, tex: R`f''(x) = 6x` } },
      { q: R`Calcule \(g''(x)\) para \(g(x) = \cos(3x)\).`,
        r: R`<p>\(g'(x) = -3\sen(3x)\) e \(g''(x) = -9\cos(3x)\).</p>`,
        c: [{ derivada: 'cos(3x)', tex: R`g'(x) = -3\sen(3x)` }, { derivada: 'cos(3x)', ordem: 2, tex: R`g''(x) = -9\cos(3x)` }] },
      { q: R`Calcule \(h''(x)\) para \(h(x) = \sqrt{x}\).`,
        r: R`<p>\(h'(x) = \tfrac{1}{2}x^{-1/2}\) e \(h''(x) = -\tfrac{1}{4}x^{-3/2} = -\dfrac{1}{4x\sqrt{x}}\).</p>`,
        c: { derivada: 'sqrt(x)', ordem: 2, dom: [0.4, 3], tex: R`h''(x) = -\tfrac{1}{4}x^{-3/2} = -\dfrac{1}{4x\sqrt{x}}` } },
    ] },
  ],
};
