// O conversor LaTeX → math.js é a base da conferência; estes testes garantem
// que ele lê a notação do site como um leitor humano leria.

import test from 'node:test';
import assert from 'node:assert/strict';
import { texParaMath, segmentos } from './util/tex2math.js';
import { avaliar, perto } from './util/numerico.js';

const R = String.raw;
const x = 0.83;
const y = 1.37;

const CASOS = [
  [R`3x^2 - 5x + 2`, 3 * x ** 2 - 5 * x + 2],
  [R`-x^2`, -(x ** 2)],
  [R`(-x)^2`, x ** 2],
  [R`2x \cos x - x^2 \sen x`, 2 * x * Math.cos(x) - x ** 2 * Math.sin(x)],
  [R`\sen 2x`, Math.sin(2 * x)],
  [R`\cos x^2`, Math.cos(x ** 2)],
  [R`\sen^2 x`, Math.sin(x) ** 2],
  [R`\sen^{2}(3x) \cos(2x)`, Math.sin(3 * x) ** 2 * Math.cos(2 * x)],
  [R`\operatorname{sen} x \cos x`, Math.sin(x) * Math.cos(x)],
  [R`\frac{x^2 + 1}{x - 3}`, (x ** 2 + 1) / (x - 3)],
  [R`\dfrac{1}{2\sqrt{x}}`, 1 / (2 * Math.sqrt(x))],
  [R`\sqrt[3]{x^2}`, Math.cbrt(x ** 2)],
  [R`e^{-2x}`, Math.exp(-2 * x)],
  [R`x e^{x^2}`, x * Math.exp(x ** 2)],
  [R`2^x \ln 2`, 2 ** x * Math.log(2)],
  [R`\ln(x^2 + 1)`, Math.log(x ** 2 + 1)],
  [R`\ln x \cdot x`, Math.log(x) * x],
  [R`\log_{2} x`, Math.log2(x)],
  [R`\log x`, Math.log10(x)],
  [R`\tg x + \sec^2 x`, Math.tan(x) + 1 / Math.cos(x) ** 2],
  [R`\cotg x - \cossec x`, 1 / Math.tan(x) - 1 / Math.sin(x)],
  [R`\arctg x + \arcsen\left(\frac{x}{2}\right)`, Math.atan(x) + Math.asin(x / 2)],
  [R`\left(x^2 + 1\right)^{3/2}`, (x ** 2 + 1) ** 1.5],
  [R`3 \cdot 2^2 - 4 \cdot 2 + 1`, 5],
  [R`0{,}5 \cdot 4`, 2],
  [R`\frac{\sqrt{3}}{2} - \frac{\pi}{12}`, Math.sqrt(3) / 2 - Math.PI / 12],
  [R`|x - 2|`, Math.abs(x - 2)],
  [R`\ln|x|`, Math.log(Math.abs(x))],
  [R`12\,\text{m/s}`, 12],
  [R`\underbrace{3(2x+1)^2}_{\text{fora}} \cdot \underbrace{2}_{\text{dentro}}`, 3 * (2 * x + 1) ** 2 * 2],
  [R`-\frac{x}{y}`, -x / y],
  [R`\frac{2x - y}{x - 2y}`, (2 * x - y) / (x - 2 * y)],
  [R`x^x(\ln x + 1)`, x ** x * (Math.log(x) + 1)],
  [R`3!`, 6],
];

test('texParaMath lê a notação do site', () => {
  for (const [tex, esperado] of CASOS) {
    const expr = texParaMath(tex);
    const valor = avaliar(expr, { x, y });
    assert.ok(perto(valor, esperado, 1e-9), `${tex} → ${expr} = ${valor}, esperado ${esperado}`);
  }
});

test('texParaMath recusa o que não sabe avaliar', () => {
  assert.throws(() => texParaMath(R`(x^2)' + 1`));
  assert.throws(() => texParaMath(R`\frac{1}{`));
  assert.throws(() => texParaMath(R`x^12`), /chaves/);
  assert.throws(() => texParaMath(R`\desconhecido{x}`));
});

test('segmentos separa uma linha pelos sinais de igual', () => {
  assert.deepEqual(segmentos(R`f'(x) = 2 \cdot 3x^2 = 6x^2`), [`f'(x)`, R`2 \cdot 3x^2`, `6x^2`]);
  assert.deepEqual(segmentos(R`\begin{aligned} f'(x) &= a \\ &= b \end{aligned}`), [`f'(x)`, 'a', 'b']);
  assert.deepEqual(segmentos(R`\sqrt{4{,}1} \approx 2{,}025`), [R`\sqrt{4{,}1}`, R`2{,}025`]);
  assert.deepEqual(segmentos(R`\underbrace{x}_{a = b} = 1`), [R`\underbrace{x}_{a = b}`, '1']);
});
