// Testes da mini-álgebra: para expressões aleatórias, o LaTeX exibido, o texto
// para o math.js e o avaliador interno precisam concordar entre si, a derivada
// precisa bater com a do math.js e o LaTeX não pode ter "sujeira".

import test from 'node:test';
import assert from 'node:assert/strict';
import * as A from '../js/gerador/expr.js';
import { tex, texSoma, texMenos } from '../js/gerador/formatar.js';
import { criarRng } from '../js/gerador/rng.js';
import { texParaMath } from './util/tex2math.js';
import { avaliar, derivada, perto } from './util/numerico.js';
import { sujeiras, erroDeRenderizacao } from './util/formulas.js';

const { X, num, mul, soma, pot, raiz, div, fn, exp, q } = A;

function aleatoria(rng, nivel = 0) {
  const folha = () => rng.escolha([X, X, num(rng.naoNulo(-5, 5)), num(rng.naoNulo(-3, 3), rng.int(2, 4)), pot(X, rng.int(2, 4))]);
  if (nivel >= 3 || rng.chance(0.25)) return folha();
  const sub = () => aleatoria(rng, nivel + 1);
  switch (rng.int(0, 7)) {
    case 0: return soma(sub(), sub());
    case 1: return mul(sub(), sub());
    case 2: return div(sub(), soma(pot(sub(), 2), 1));
    case 3: return fn(rng.escolha(['sin', 'cos', 'tan', 'atan']), sub());
    case 4: return exp(sub());
    case 5: return fn('ln', soma(pot(sub(), 2), 1));
    case 6: return raiz(soma(pot(sub(), 2), rng.int(1, 4)));
    default: return pot(sub(), rng.escolha([2, 3, q(1, 2), -1, -2, q(3, 2)]));
  }
}

test('LaTeX, texto do math.js e avaliador interno concordam; derivada bate com o math.js', () => {
  const rng = criarRng(2024);
  let conferidas = 0;
  for (let i = 0; i < 1500; i++) {
    const e = aleatoria(rng);
    const fonte = tex(e);
    assert.deepEqual(sujeiras(fonte), [], `LaTeX sujo: ${fonte}`);
    if (i % 5 === 0) assert.equal(erroDeRenderizacao(fonte), null, `não renderiza: ${fonte}`);
    const lido = texParaMath(fonte);
    const d = A.derivar(e);
    const dRef = derivada(A.texto(e));
    for (const x of [0.37, 1.21, 2.6]) {
      const interno = A.valor(e, { x });
      const viaTexto = avaliar(A.texto(e), { x });
      if (!Number.isFinite(interno) || !Number.isFinite(viaTexto) || Math.abs(interno) > 1e6) continue;
      assert.ok(perto(interno, viaTexto, 1e-8), `avaliador ≠ math.js em ${A.texto(e)}`);
      assert.ok(perto(avaliar(lido, { x }), viaTexto, 1e-8), `LaTeX ≠ expressão: ${fonte} | ${A.texto(e)}`);
      const esperado = avaliar(dRef, { x });
      const obtido = avaliar(A.texto(d), { x });
      if (!Number.isFinite(esperado) || Math.abs(esperado) > 1e6) continue;
      assert.ok(perto(obtido, esperado, 1e-6, 1e-7), `derivada errada de ${A.texto(e)}: ${A.texto(d)} (${obtido} ≠ ${esperado})`);
      assert.deepEqual(sujeiras(tex(d)), [], `LaTeX sujo na derivada: ${tex(d)}`);
      conferidas += 1;
    }
  }
  assert.ok(conferidas > 2000, `poucas conferências (${conferidas})`);
});

test('simplificações básicas e LaTeX limpo', () => {
  const casos = [
    [mul(1, X), 'x'], [mul(-1, X), '-x'], [soma(X, 0), 'x'], [pot(X, 1), 'x'], [pot(X, 0), '1'],
    [soma(mul(2, X), num(-3)), '2x - 3'], [soma(pot(X, 2), mul(-1, X)), 'x^{2} - x'], [mul(2, X, pot(X, 2)), '2x^{3}'],
    [soma(mul(2, X), mul(3, X)), '5x'], [soma(X, mul(-1, X)), '0'], [div(1, X), '\\frac{1}{x}'], [div(X, 2), '\\frac{x}{2}'],
    [raiz(X), '\\sqrt{x}'], [div(1, mul(2, raiz(X))), '\\frac{1}{2\\sqrt{x}}'], [raiz(num(9)), '3'], [raiz(num(12)), '\\sqrt{12}'],
    [mul(pot(X, 2), fn('sin', X)), 'x^{2}\\sen x'], [mul(fn('sin', X), fn('cos', X)), '\\sen x \\cdot \\cos x'],
    [pot(fn('sin', mul(2, X)), 3), '\\sen^{3}(2x)'], [exp(mul(-2, X)), 'e^{-2x}'], [mul(3, pot(num(2), X)), '3 \\cdot 2^{x}'],
    [fn('sin', A.PI), '0'], [fn('cos', mul(num(1, 3), A.PI)), '\\frac{1}{2}'], [fn('sin', mul(num(1, 3), A.PI)), '\\frac{\\sqrt{3}}{2}'],
    [fn('ln', A.E), '1'], [fn('ln', num(1)), '0'], [fn('cos', mul(-3, X)), '\\cos(3x)'], [mul(2, A.PI, X), '2\\pi x'],
    [soma(1, mul(-1, pot(X, 2))), '1 - x^{2}'], [mul(soma(X, 1), soma(X, -1)), '(x + 1)(x - 1)'], [pot(soma(X, 1), -2), '\\frac{1}{(x + 1)^{2}}'],
  ];
  for (const [e, esperado] of casos) assert.equal(tex(e), esperado);
  assert.equal(texSoma(['2x', '-3', '5']), '2x - 3 + 5');
  assert.equal(texMenos('x', num(-2)), '(x + 2)');
  assert.equal(texMenos('x', num(0)), 'x');
  assert.equal(tex(A.expandir(mul(soma(X, 1), soma(X, -1)))), 'x^{2} - 1');
  assert.equal(tex(A.derivar(div(soma(mul(2, X), 1), soma(pot(X, 2), 3)))), '\\frac{-2x^{2} - 2x + 6}{(x^{2} + 3)^{2}}');
});
