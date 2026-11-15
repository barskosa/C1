// Testa o detector de LaTeX "sujo": ele precisa acusar 1x, x^1, + - etc.
// sem dar alarme falso em fórmulas legítimas como 11x, 10x ou x^{10}.

import test from 'node:test';
import assert from 'node:assert/strict';
import { sujeiras, erroDeRenderizacao } from './util/formulas.js';

const R = String.raw;

test('fórmulas limpas não são acusadas', () => {
  const limpas = [
    R`11x^2 - 10x + 1`, R`21x`, R`x^{10} + x^{12}`, R`x^{1/2}`, R`\frac{1}{x}`, R`\frac{1}{2}x^2`, R`0{,}5x`, R`10\,\text{m}`,
    R`1 \cdot \sen x + x \cdot \cos x`, R`2 \cdot 1 + 3`, R`\sqrt{1 - x^2}`, R`(x - 1)(x + 1)`, R`y - 1 = 2(x - 3)`,
    R`\lim_{x \to 0} \frac{\sen x}{x} = 1`, R`\lim_{h \to 0} (6 + h)`, R`x = 1 \text{ ou } x = 3`, R`\log_{10} x`, R`e^{-x}`, R`x^{-1}`,
    R`3 \cdot (-2)^2 - 4 \cdot (-2) + 1`, R`f(x_0)(x - x_0)`, R`2^{x+1}(x - 1)`, R`\frac{-h}{2(2 + h)}`, R`1 - \frac{1}{x}`,
    R`\begin{cases} x^2 & \text{se } x \le 1 \\ 2x - 1 & \text{se } x > 1 \end{cases}`, R`0 \le x \le 10`, R`f'(0) = 1`,
  ];
  for (const tex of limpas) {
    assert.deepEqual(sujeiras(tex), [], `alarme falso em: ${tex}`);
    assert.equal(erroDeRenderizacao(tex), null, `não renderiza: ${tex}`);
  }
});

test('fórmulas sujas são acusadas', () => {
  const sujas = [
    R`1x + 2`, R`3 + 1x^2`, R`2x^1`, R`x^{1} + 1`, R`x + -3`, R`x - -3`, R`x - +3`, R`0x + 5`, R`x^2 + 0`, R`2 \cdot -3`,
    R`1\sen x`, R`1(x + 1)`, R`0\cos x`, R`\frac{x}{1}`, R`NaN`, R`x + undefined`, R`\frac{}{2}`, R`2x +`, R`e^{1x}`, R`1\left(x\right)`,
    R`x - 0`, R`()`,
  ];
  for (const tex of sujas) {
    assert.ok(sujeiras(tex).length > 0, `deveria acusar: ${tex}`);
  }
});
