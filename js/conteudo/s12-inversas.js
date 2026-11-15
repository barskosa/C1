// Seção 12 — Funções inversas e trigonométricas inversas
import { R } from '../ui/tex.js';

export default {
  lide: R`Se você conhece a derivada de uma função, conhece também a da inversa: as inclinações são recíprocas. Daí saem as derivadas de \(\arcsen\), \(\arccos\) e \(\arctg\).`,
  objetivos: [
    R`Calcular \((f^{-1})'(b)\) a partir de \(f'\), sem precisar da fórmula de \(f^{-1}\).`,
    R`Deduzir e usar as derivadas de \(\arcsen x\), \(\arccos x\) e \(\arctg x\).`,
    R`Combinar essas derivadas com a regra da cadeia.`,
  ],
  blocos: [
    { h2: 'Inclinações recíprocas' },
    { html: R`
      <p>O gráfico de \(f^{-1}\) é o espelho do gráfico de \(f\) em relação à reta \(y = x\): cada ponto \((a, b)\) de \(f\)
      vira o ponto \((b, a)\) de \(f^{-1}\). O espelhamento troca os papéis de “subir” e “andar”.</p>` },
    { caixa: 'intuicao', titulo: 'Trocar os eixos inverte a inclinação',
      html: R`
      <p>Se a tangente a \(f\) em \((a, b)\) sobe \(4\) para cada \(1\) que anda (inclinação \(4\)), a tangente à inversa no
      ponto espelhado \((b, a)\) sobe \(1\) para cada \(4\) que anda (inclinação \(\tfrac14\)). Na notação de Leibniz, parece uma fração invertida:</p>
      \[ \frac{dx}{dy} = \frac{1}{\,dy/dx\,}. \]` },
    { grafico: {
      x: [-0.6, 6.6], y: [-0.6, 6.6], proporcao: 0.86, alturaMax: 440,
      descricao: 'Gráficos de y = x² (para x ≥ 0) e de sua inversa y = √x, espelhados em relação à reta y = x, com as tangentes em (2, 4) e (4, 2).',
      itens: [
        { tipo: 'reta', ponto: [0, 0], m: 1, cor: 0, tracejado: true, fino: true },
        { tipo: 'funcao', f: (x) => x * x, cor: 1, dominio: [0, 3] },
        { tipo: 'funcao', f: (x) => Math.sqrt(x), cor: 3, dominio: [0, 6.6] },
        { tipo: 'reta', ponto: [2, 4], m: 4, cor: 1, fino: true },
        { tipo: 'reta', ponto: [4, 2], m: 0.25, cor: 3, fino: true },
        { tipo: 'ponto', x: 2, y: 4, cor: 1, rotulo: '(2, 4): inclinação 4', pos: 'e' },
        { tipo: 'ponto', x: 4, y: 2, cor: 3, rotulo: '(4, 2): inclinação 1/4', pos: 'se' },
        { tipo: 'texto', x: 5.6, y: 5.6, texto: 'y = x', pos: 'nw' },
      ],
      legenda: R`\(f(x) = x^2\) (azul) e \(f^{-1}(x) = \sqrt{x}\) (verde). Em pontos espelhados, as inclinações são \(4\) e \(\tfrac14\).`,
    } },
    { caixa: 'teorema', titulo: 'Derivada da função inversa',
      html: R`
      <p>Se \(f\) é inversível e derivável em \(a\), com \(f'(a) \neq 0\), e \(b = f(a)\), então \(f^{-1}\) é derivável em \(b\) e</p>
      \[ \left(f^{-1}\right)'(b) = \frac{1}{f'(a)} = \frac{1}{f'\!\left(f^{-1}(b)\right)}. \]
      <p>Cuidado com o ponto: a derivada de \(f\) é calculada em \(a = f^{-1}(b)\), e não em \(b\).</p>`,
      porque: R`
      <p>Por definição de inversa, \(f\big(f^{-1}(x)\big) = x\). Derivando os dois lados com a regra da cadeia:
      \(f'\big(f^{-1}(x)\big) \cdot \big(f^{-1}\big)'(x) = 1\). Basta dividir.</p>` },

    { h2: 'Trigonométricas inversas' },
    { html: R`
      <p>\(\arcsen x\) é o ângulo entre \(-\tfrac{\pi}{2}\) e \(\tfrac{\pi}{2}\) cujo seno é \(x\); \(\arccos x\) é o ângulo entre \(0\) e \(\pi\) cujo cosseno é \(x\);
      \(\arctg x\) é o ângulo entre \(-\tfrac{\pi}{2}\) e \(\tfrac{\pi}{2}\) cuja tangente é \(x\). A notação \(\sen^{-1} x\) também é usada para \(\arcsen x\)
      e <strong>não</strong> significa \(\dfrac{1}{\sen x}\).</p>` },
    { caixa: 'formula', titulo: 'Derivadas das trigonométricas inversas',
      html: R`
      \[ (\arcsen x)' = \frac{1}{\sqrt{1 - x^2}} \qquad (\arccos x)' = -\frac{1}{\sqrt{1 - x^2}} \qquad (\arctg x)' = \frac{1}{1 + x^2} \]
      <p>As duas primeiras valem para \(-1 < x < 1\); a terceira, para todo \(x\). Com a regra da cadeia:
      \(\big(\arcsen u\big)' = \dfrac{u'}{\sqrt{1 - u^2}}\) e \(\big(\arctg u\big)' = \dfrac{u'}{1 + u^2}\).</p>`,
      porque: R`
      <p>Se \(y = \arcsen x\), então \(\sen y = x\). Derivando implicitamente: \(\cos y \cdot y' = 1\), logo \(y' = \dfrac{1}{\cos y}\).
      Como \(y\) está entre \(-\tfrac{\pi}{2}\) e \(\tfrac{\pi}{2}\), \(\cos y \geq 0\) e \(\cos y = \sqrt{1 - \sen^2 y} = \sqrt{1 - x^2}\).
      O caso do arco tangente está no Exemplo 2.</p>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Derivada da inversa sem conhecer a inversa', nivel: 'facil',
      enunciado: R`<p>Seja \(f(x) = x^3 + x\). Calcule \(\left(f^{-1}\right)'(2)\).</p>`,
      confere: { valor: (m) => 1 / m.d('x^3 + x', 1) },
      passos: [
        { tex: R`f(1) = 1^3 + 1 = 2 \;\Rightarrow\; f^{-1}(2) = 1`, txt: R`Precisamos do ponto \(a\) com \(f(a) = 2\). Não dá para inverter \(x^3 + x\) por fórmula simples, mas por inspeção \(a = 1\) funciona.`, c: { valor: 2, seg: [1, 2] } },
        { tex: R`f'(x) = 3x^2 + 1 \;\Rightarrow\; f'(1) = 4`, txt: R`Derivamos \(f\) e calculamos em \(a = 1\) (não em \(2\)!).`, c: { valor: (m) => m.d('x^3 + x', 1), seg: 'ultimo' } },
        { tex: R`\left(f^{-1}\right)'(2) = \frac{1}{f'(1)} = \frac{1}{4}`, txt: R`A inclinação da inversa é o recíproco da inclinação de \(f\) no ponto correspondente.`, c: 1, seg: 'ultimo' },
      ],
    } },
    { exemplo: {
      titulo: 'De onde vem a derivada do arco tangente', nivel: 'medio',
      enunciado: R`<p>Mostre que \((\arctg x)' = \dfrac{1}{1 + x^2}\).</p>`,
      confere: { derivada: 'atan(x)' },
      passos: [
        { tex: R`y = \arctg x \;\Longleftrightarrow\; \tg y = x`, txt: R`Reescrevemos sem a função inversa (com \(y\) entre \(-\tfrac{\pi}{2}\) e \(\tfrac{\pi}{2}\)).` },
        { tex: R`\sec^2 y \cdot y' = 1`, txt: R`Derivamos implicitamente: \((\tg y)' = \sec^2 y \cdot y'\), pela regra da cadeia.` },
        { tex: R`y' = \frac{1}{\sec^2 y} = \frac{1}{1 + \tg^2 y}`, txt: R`Isolamos \(y'\) e usamos a identidade \(\sec^2 y = 1 + \tg^2 y\).`, c: { igual: '1/sec(y)^2', vars: ['y'], dom: [-1.3, 1.3] } },
        { tex: R`y' = \frac{1}{1 + x^2}`, txt: R`Como \(\tg y = x\), trocamos \(\tg^2 y\) por \(x^2\).`, c: 1 },
      ],
    } },
    { exemplo: {
      titulo: 'Cadeia e produto com trigonométricas inversas', nivel: 'dificil',
      enunciado: R`<p>Derive \(f(x) = \arctg(2x) + x\arcsen x\).</p>`,
      confere: { derivada: 'atan(2x) + x*asin(x)', dom: [-0.9, 0.9] },
      passos: [
        { tex: R`\big(\arctg(2x)\big)' = \frac{1}{1 + (2x)^2} \cdot 2 = \frac{2}{1 + 4x^2}`, txt: R`Regra da cadeia: \(\big(\arctg u\big)' = \dfrac{u'}{1 + u^2}\), com \(u = 2x\). Atenção ao quadrado: \((2x)^2 = 4x^2\).`, c: { derivada: 'atan(2x)' } },
        { tex: R`\big(x\arcsen x\big)' = 1 \cdot \arcsen x + x \cdot \frac{1}{\sqrt{1 - x^2}}`, txt: R`Regra do produto com \(u = x\) e \(v = \arcsen x\).`, c: { derivada: 'x*asin(x)', dom: [-0.9, 0.9] } },
        { tex: R`f'(x) = \frac{2}{1 + 4x^2} + \arcsen x + \frac{x}{\sqrt{1 - x^2}}`, txt: R`Somamos as duas partes.`, c: 1 },
      ],
    } },

    { erros: [
      { e: R`Ler \(\sen^{-1} x\) como \(\dfrac{1}{\sen x}\).`,
        c: R`\(\sen^{-1} x = \arcsen x\) (função inversa). O recíproco \(\dfrac{1}{\sen x}\) é a cossecante.` },
      { e: R`Calcular a derivada de \(f\) no ponto errado: \(\left(f^{-1}\right)'(b) = \dfrac{1}{f'(b)}\).`,
        c: R`\(\left(f^{-1}\right)'(b) = \dfrac{1}{f'(a)}\), com \(a = f^{-1}(b)\), isto é, \(f(a) = b\).` },
      { e: R`Esquecer a cadeia ou o quadrado: \(\big(\arctg(2x)\big)' = \dfrac{1}{1 + 2x^2}\).`,
        c: R`\(\big(\arctg(2x)\big)' = \dfrac{2}{1 + (2x)^2} = \dfrac{2}{1 + 4x^2}\).` },
      { e: R`Esquecer o sinal de menos do arco cosseno.`,
        c: R`\((\arccos x)' = -\dfrac{1}{\sqrt{1 - x^2}}\): o arco cosseno é decrescente.` },
    ] },

    { exercicios: [
      { q: R`Derive \(f(x) = \arctg(x^2)\).`,
        r: R`<p>\(f'(x) = \dfrac{2x}{1 + x^4}\).</p>`,
        c: { derivada: 'atan(x^2)', tex: R`f'(x) = \dfrac{2x}{1 + x^4}` } },
      { q: R`Derive \(g(x) = \arcsen(3x)\).`,
        r: R`<p>\(g'(x) = \dfrac{3}{\sqrt{1 - 9x^2}}\), para \(|x| < \tfrac13\).</p>`,
        c: { derivada: 'asin(3x)', dom: [-0.3, 0.3], tex: R`g'(x) = \dfrac{3}{\sqrt{1 - 9x^2}}` } },
      { q: R`Para \(f(x) = e^x + x\), calcule \(\left(f^{-1}\right)'(1)\).`,
        r: R`<p>Como \(f(0) = 1\) e \(f'(x) = e^x + 1\), temos \(f'(0) = 2\) e \(\left(f^{-1}\right)'(1) = \dfrac{1}{2}\).</p>`,
        c: { valor: (m) => 1 / m.d('e^x + x', 0), tex: R`\dfrac{1}{2}`, seg: 'tudo' } },
    ] },
  ],
};
