// Seção 15 — Tabela-resumo (colinha para imprimir)
import { R } from '../ui/tex.js';

const tabela = (titulo, linhas, cab = ['Função', 'Derivada']) => ({
  html: `<section class="colinha__bloco"><h3>${titulo}</h3><div class="tabela-rolagem"><table class="tabela tabela--centro"><thead><tr>${cab
    .map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${linhas
    .map((l) => `<tr>${l.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`,
});

export default {
  imprimivel: true,
  lide: R`Todas as regras e fórmulas de derivadas do curso em uma página. Use o botão “Imprimir” para levar a colinha no caderno.`,
  blocos: [
    tabela('Definição', [
      [R`\(f'(a) = \displaystyle\lim_{h \to 0} \frac{f(a + h) - f(a)}{h}\)`, 'derivada no ponto a = inclinação da tangente'],
      [R`\(y - f(a) = f'(a)(x - a)\)`, 'reta tangente'],
      [R`\(y - f(a) = -\dfrac{1}{f'(a)}(x - a)\)`, 'reta normal'],
    ], ['Fórmula', 'Significado']),
    tabela('Regras de derivação', [
      ['Constante', R`\((c)' = 0\)`],
      ['Potência', R`\((x^n)' = n\,x^{n-1}\)`],
      ['Múltiplo constante', R`\((c\,f)' = c\,f'\)`],
      ['Soma e diferença', R`\((f \pm g)' = f' \pm g'\)`],
      ['Produto', R`\((uv)' = u'v + uv'\)`],
      ['Quociente', R`\(\left(\dfrac{u}{v}\right)' = \dfrac{u'v - uv'}{v^2}\)`],
      ['Cadeia', R`\(\big(f(g(x))\big)' = f'(g(x)) \cdot g'(x)\)`],
      ['Inversa', R`\(\left(f^{-1}\right)'(b) = \dfrac{1}{f'(a)}\), com \(b = f(a)\)`],
    ], ['Regra', 'Fórmula']),
    tabela('Potências e raízes', [
      [R`\(x\)`, R`\(1\)`],
      [R`\(\sqrt{x}\)`, R`\(\dfrac{1}{2\sqrt{x}}\)`],
      [R`\(\dfrac{1}{x}\)`, R`\(-\dfrac{1}{x^2}\)`],
      [R`\(\dfrac{1}{x^n}\)`, R`\(-\dfrac{n}{x^{n+1}}\)`],
    ]),
    tabela('Exponenciais e logaritmos', [
      [R`\(e^x\)`, R`\(e^x\)`],
      [R`\(a^x\)`, R`\(a^x \ln a\)`],
      [R`\(\ln x\)`, R`\(\dfrac{1}{x}\)`],
      [R`\(\log_a x\)`, R`\(\dfrac{1}{x \ln a}\)`],
    ]),
    tabela('Trigonométricas', [
      [R`\(\sen x\)`, R`\(\cos x\)`],
      [R`\(\cos x\)`, R`\(-\sen x\)`],
      [R`\(\tg x\)`, R`\(\sec^2 x\)`],
      [R`\(\cotg x\)`, R`\(-\cossec^2 x\)`],
      [R`\(\sec x\)`, R`\(\sec x \,\tg x\)`],
      [R`\(\cossec x\)`, R`\(-\cossec x \,\cotg x\)`],
    ]),
    tabela('Trigonométricas inversas', [
      [R`\(\arcsen x\)`, R`\(\dfrac{1}{\sqrt{1 - x^2}}\)`],
      [R`\(\arccos x\)`, R`\(-\dfrac{1}{\sqrt{1 - x^2}}\)`],
      [R`\(\arctg x\)`, R`\(\dfrac{1}{1 + x^2}\)`],
    ]),
    tabela('Com a regra da cadeia (u = u(x))', [
      [R`\(u^n\)`, R`\(n\,u^{n-1}\,u'\)`],
      [R`\(\sqrt{u}\)`, R`\(\dfrac{u'}{2\sqrt{u}}\)`],
      [R`\(e^u\)`, R`\(e^u\,u'\)`],
      [R`\(a^u\)`, R`\(a^u \ln a \; u'\)`],
      [R`\(\ln u\)`, R`\(\dfrac{u'}{u}\)`],
      [R`\(\sen u\)`, R`\(\cos u \; u'\)`],
      [R`\(\cos u\)`, R`\(-\sen u \; u'\)`],
      [R`\(\tg u\)`, R`\(\sec^2 u \; u'\)`],
      [R`\(\arcsen u\)`, R`\(\dfrac{u'}{\sqrt{1 - u^2}}\)`],
      [R`\(\arctg u\)`, R`\(\dfrac{u'}{1 + u^2}\)`],
    ]),
    tabela('Técnicas', [
      ['Implícita', R`derive os dois lados; cada \(y\) gera um \(y'\): \((y^n)' = n\,y^{n-1}\,y'\)`],
      ['Logarítmica', R`\(\ln y = \ln f(x)\), derive, \(y' = y \cdot (\ldots)\); ex.: \((x^x)' = x^x(\ln x + 1)\)`],
      ['Ordem superior', R`\(f'' = (f')'\); \(\dfrac{d^n}{dx^n}e^{kx} = k^n e^{kx}\); \((\sen x)'' = -\sen x\)`],
    ], ['Técnica', 'Como fazer']),
    tabela('Aplicações', [
      ['Aproximação linear', R`\(f(x) \approx f(a) + f'(a)(x - a)\); diferencial: \(dy = f'(x)\,dx\)`],
      ['Valor Médio', R`existe \(c \in (a, b)\) com \(f'(c) = \dfrac{f(b) - f(a)}{b - a}\)`],
      ['Crescimento', R`\(f' > 0\): crescente; \(f' < 0\): decrescente`],
      ['Ponto crítico', R`\(f'(c) = 0\) ou \(f'(c)\) não existe`],
      ['Teste da 1ª derivada', R`\(f'\) de \(+\) para \(-\): máximo; de \(-\) para \(+\): mínimo`],
      ['Teste da 2ª derivada', R`\(f'(c) = 0\) e \(f''(c) > 0\): mínimo; \(f''(c) < 0\): máximo`],
      ['Concavidade', R`\(f'' > 0\): para cima; \(f'' < 0\): para baixo; inflexão onde \(f''\) troca de sinal`],
      ['L’Hôpital', R`\(\tfrac00\) ou \(\tfrac{\infty}{\infty}\): \(\displaystyle\lim \frac{f}{g} = \lim \frac{f'}{g'}\)`],
      ['Limite fundamental', R`\(\displaystyle\lim_{x \to 0} \frac{\sen x}{x} = 1\)`],
    ], ['Tema', 'Resultado']),
  ],
};
