// Seção 14.9 — Regra de L'Hôpital
import { R } from '../ui/tex.js';

export default {
  lide: R`Quando um limite dá \(\tfrac{0}{0}\) ou \(\tfrac{\infty}{\infty}\), as derivadas do numerador e do denominador revelam quem “ganha a corrida”.`,
  objetivos: [
    R`Reconhecer as formas indeterminadas \(\tfrac00\) e \(\tfrac{\infty}{\infty}\).`,
    R`Aplicar a <strong>Regra de L’Hôpital</strong>, inclusive mais de uma vez.`,
    R`Reduzir as formas \(0 \cdot \infty\), \(\infty - \infty\), \(1^\infty\), \(0^0\) e \(\infty^0\) a um quociente.`,
  ],
  blocos: [
    { h2: 'Uma corrida entre numerador e denominador' },
    { caixa: 'intuicao', titulo: 'Compare as velocidades',
      html: R`
      <p>Se \(f\) e \(g\) tendem ambas a zero quando \(x \to a\), o quociente \(\dfrac{f(x)}{g(x)}\) depende de <em>quão rápido</em> cada uma
      chega lá. Perto de \(a\), cada função se parece com sua reta tangente: \(f(x) \approx f'(a)(x - a)\) e \(g(x) \approx g'(a)(x - a)\).
      O fator \((x - a)\) cancela e sobra a razão entre as inclinações, \(\dfrac{f'(a)}{g'(a)}\).</p>` },
    { caixa: 'teorema', titulo: 'Regra de L’Hôpital',
      html: R`
      <p>Se \(\displaystyle\lim_{x \to a} \frac{f(x)}{g(x)}\) é uma indeterminação do tipo \(\dfrac{0}{0}\) ou \(\dfrac{\infty}{\infty}\), então</p>
      \[ \lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}, \]
      <p>desde que o limite da direita exista (ou seja \(\pm\infty\)). Vale também para limites laterais e para \(x \to \pm\infty\).</p>` },
    { caixa: 'atencao', titulo: 'Deriva-se em cima e embaixo, separadamente',
      html: R`<p>Não é a regra do quociente! Deriva-se o numerador, deriva-se o denominador e monta-se um novo quociente.
      E só vale para indeterminações: antes de aplicar, substitua e confirme que deu \(\tfrac00\) ou \(\tfrac{\infty}{\infty}\).</p>` },
    { tabela: {
      cab: ['Forma', 'Como transformar em quociente', 'Exemplo'],
      linhas: [
        [R`\(0 \cdot \infty\)`, R`Escreva \(f \cdot g = \dfrac{f}{1/g}\)`, R`\(x \ln x = \dfrac{\ln x}{1/x}\)`],
        [R`\(\infty - \infty\)`, 'Reduza ao mesmo denominador ou fatore', R`\(\dfrac{1}{x} - \dfrac{1}{\sen x} = \dfrac{\sen x - x}{x \sen x}\)`],
        [R`\(1^\infty,\ 0^0,\ \infty^0\)`, R`Tome \(\ln\): se \(\ln y \to L\), então \(y \to e^L\)`, R`\(\left(1 + \tfrac{1}{x}\right)^x\)`],
      ],
      legenda: 'Outras formas indeterminadas precisam ser reescritas antes de aplicar a regra.',
    } },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Forma 0/0', nivel: 'facil',
      enunciado: R`<p>Calcule \(\displaystyle\lim_{x \to 0} \frac{e^{2x} - 1}{\sen 3x}\).</p>`,
      confere: { limite: { f: '(e^(2x) - 1)/sin(3x)', a: 0 } },
      passos: [
        { tex: R`\frac{e^{0} - 1}{\sen 0} = \frac{0}{0}`, txt: R`Substituindo \(x = 0\) obtemos a indeterminação \(\tfrac00\): podemos usar L’Hôpital.` },
        { tex: R`\lim_{x \to 0} \frac{e^{2x} - 1}{\sen 3x} = \lim_{x \to 0} \frac{2e^{2x}}{3\cos 3x}`, txt: R`Derivamos o numerador, \((e^{2x} - 1)' = 2e^{2x}\), e o denominador, \((\sen 3x)' = 3\cos 3x\), separadamente.` },
        { tex: R`\frac{2e^{0}}{3\cos 0} = \frac{2}{3}`, txt: R`Agora a substituição funciona.`, c: 1, seg: 'tudo' },
      ],
    } },
    { exemplo: {
      titulo: 'Aplicando duas vezes', nivel: 'medio',
      enunciado: R`<p>Calcule \(\displaystyle\lim_{x \to 0} \frac{1 - \cos x}{x^2}\).</p>`,
      confere: { limite: { f: '(1 - cos(x))/x^2', a: 0 } },
      passos: [
        { tex: R`\lim_{x \to 0} \frac{1 - \cos x}{x^2} = \lim_{x \to 0} \frac{\sen x}{2x}`, txt: R`Forma \(\tfrac00\). Derivamos em cima (\(\sen x\)) e embaixo (\(2x\)). O novo limite ainda é \(\tfrac00\).` },
        { tex: R`\lim_{x \to 0} \frac{\sen x}{2x} = \lim_{x \to 0} \frac{\cos x}{2}`, txt: R`Aplicamos a regra de novo (verificando de novo a indeterminação).` },
        { tex: R`\frac{\cos 0}{2} = \frac{1}{2}`, txt: R`Substituímos. (O segundo passo também sai do limite fundamental \(\tfrac{\sen x}{x} \to 1\).)`, c: 1, seg: 'tudo' },
      ],
    } },
    { exemplo: {
      titulo: 'Produto 0 · ∞', nivel: 'medio',
      enunciado: R`<p>Calcule \(\displaystyle\lim_{x \to 0^+} x \ln x\).</p>`,
      confere: { limite: { f: 'x*log(x)', a: 0, lado: '+' } },
      passos: [
        { tex: R`x \ln x = \frac{\ln x}{1/x}`, txt: R`Quando \(x \to 0^+\), \(x \to 0\) e \(\ln x \to -\infty\): forma \(0 \cdot \infty\). Reescrevemos como quociente, agora do tipo \(\tfrac{\infty}{\infty}\).`, c: { igual: 'x*log(x)', dom: [0.2, 3] } },
        { tex: R`\lim_{x \to 0^+} \frac{\ln x}{1/x} = \lim_{x \to 0^+} \frac{1/x}{-1/x^2}`, txt: R`L’Hôpital: \((\ln x)' = \dfrac{1}{x}\) e \(\left(\dfrac{1}{x}\right)' = -\dfrac{1}{x^2}\).` },
        { tex: R`\frac{1/x}{-1/x^2} = -x`, txt: R`Simplificamos a fração de frações antes de calcular o limite.`, c: { igual: '(1/x)/(-1/x^2)', dom: [0.2, 3] } },
        { tex: R`\lim_{x \to 0^+} (-x) = 0`, txt: R`O fator \(x\) “vence” o logaritmo: o produto tende a zero.`, c: 1, seg: 'ultimo' },
      ],
    } },
    { exemplo: {
      titulo: 'Potência 1 elevado a infinito: o número e', nivel: 'dificil',
      enunciado: R`<p>Calcule \(\displaystyle\lim_{x \to +\infty} \left(1 + \frac{1}{x}\right)^{x}\).</p>`,
      confere: { limite: { f: '(1 + 1/x)^x', a: 'inf' } },
      passos: [
        { tex: R`\ln y = x \ln\left(1 + \frac{1}{x}\right) = \frac{\ln\left(1 + \frac{1}{x}\right)}{1/x}`, txt: R`Forma \(1^\infty\). Chamamos a expressão de \(y\), aplicamos \(\ln\) e escrevemos o produto como quociente (\(\tfrac00\)).`, c: { igual: 'log((1 + 1/x)^x)', dom: [1, 6] } },
        { tex: R`\lim_{x \to +\infty} \frac{\ln\left(1 + \frac{1}{x}\right)}{1/x} = \lim_{x \to +\infty} \frac{\dfrac{1}{1 + \frac{1}{x}} \cdot \left(-\dfrac{1}{x^2}\right)}{-\dfrac{1}{x^2}}`, txt: R`L’Hôpital, com a regra da cadeia no numerador.` },
        { tex: R`\lim_{x \to +\infty} \frac{1}{1 + \frac{1}{x}} = 1`, txt: R`Os fatores \(-\dfrac{1}{x^2}\) cancelam e \(\dfrac{1}{x} \to 0\). Portanto \(\ln y \to 1\).`, c: { limite: { f: 'log((1 + 1/x)^x)', a: 'inf' } }, seg: 'ultimo' },
        { tex: R`\lim_{x \to +\infty} \left(1 + \frac{1}{x}\right)^{x} = e^{1} = e`, txt: R`Se \(\ln y \to 1\), então \(y \to e^1\). Este limite é uma das definições do número \(e\).`, c: 1, seg: [1, 2] },
      ],
    } },

    { erros: [
      { e: R`Usar a regra do quociente: \(\left(\dfrac{f}{g}\right)'\) no lugar de \(\dfrac{f'}{g'}\).`,
        c: R`Em L’Hôpital, numerador e denominador são derivados <em>separadamente</em>.` },
      { e: R`Aplicar a regra sem indeterminação: \(\displaystyle\lim_{x \to 0} \frac{x + 1}{x + 2} = \lim \frac{1}{1} = 1\).`,
        c: R`Substituindo direto: \(\dfrac{1}{2}\). A regra só vale para \(\tfrac00\) ou \(\tfrac{\infty}{\infty}\).` },
      { e: R`Continuar derivando depois que a indeterminação acabou.`,
        c: R`Verifique a forma a cada passo. Assim que a substituição funcionar, pare.` },
      { e: R`Em formas exponenciais, esquecer de “desfazer” o logaritmo no final.`,
        c: R`Se \(\ln y \to L\), a resposta é \(e^L\), não \(L\).` },
    ] },

    { exercicios: [
      { q: R`Calcule \(\displaystyle\lim_{x \to 1} \frac{\ln x}{x - 1}\).`,
        r: R`<p>Forma \(\tfrac00\): \(\displaystyle\lim_{x \to 1} \frac{1/x}{1} = 1\).</p>`,
        c: { limite: { f: 'log(x)/(x - 1)', a: 1 }, tex: R`\frac{1/x}{1} = 1`, seg: 'ultimo' } },
      { q: R`Calcule \(\displaystyle\lim_{x \to +\infty} \frac{x^2}{e^x}\).`,
        r: R`<p>Forma \(\tfrac{\infty}{\infty}\), duas vezes: \(\dfrac{2x}{e^x}\), depois \(\dfrac{2}{e^x} \to 0\). A exponencial cresce mais rápido que qualquer potência.</p>` },
      { q: R`Calcule \(\displaystyle\lim_{x \to 0} \frac{x - \sen x}{x^3}\).`,
        r: R`<p>Três aplicações: \(\dfrac{1 - \cos x}{3x^2}\), \(\dfrac{\sen x}{6x}\), \(\dfrac{\cos x}{6} \to \dfrac{1}{6}\).</p>`,
        c: { limite: { f: '(x - sin(x))/x^3', a: 0 }, tex: R`\dfrac{1}{6}`, seg: 'tudo' } },
    ] },
  ],
};
