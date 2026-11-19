// Pontos críticos e classificação (máximo/mínimo local).
import { A, X, num, mul, soma, pot, tex, FUNCOES } from '../base.js';
import { texEm } from '../formatar.js';

const { derivar, subs, texto, valor, polinomio } = A;

/** Campo de resposta do tipo conjunto de valores de x. */
export function campoConjunto(id, rotulo, pontos) {
  return {
    id, tipo: 'conjunto', rotulo,
    valores: pontos.map((p) => valor(p)),
    respostaLatex: pontos.length ? pontos.map((p) => `x = ${tex(p)}`).join(' \\text{ e } ') : '\\text{nenhum}',
    respostaExpr: pontos.length ? pontos.map(texto).join('; ') : 'nenhum',
  };
}

function funcoes(rng, dificuldade) {
  const c = rng.int(-5, 5);
  if (dificuldade === 'facil') {
    const [a, r] = [rng.naoNulo(-3, 3), rng.naoNulo(-4, 4)];
    return { f: polinomio([a, -2 * a * r, a * r * r + c]), raizes: [num(r)], intervalo: [-8, 8] };
  }
  if (dificuldade === 'medio') {
    const r1 = rng.int(-3, 2);
    const r2 = rng.int(r1 + 1, 4);
    const s = rng.sinal();
    return { f: polinomio([2 * s, -3 * s * (r1 + r2), 6 * s * r1 * r2, c]), raizes: [num(r1), num(r2)], intervalo: [-6, 7], fatorada: `${6 * s}${fator(r1)}${fator(r2)}` };
  }
  const a = rng.int(1, 3);
  const k = rng.escolha([1, 2, -1, -2]);
  return rng.escolha([
    () => ({ f: polinomio([3, -4 * a, 0, 0, c]), raizes: [num(0), num(a)], intervalo: [-4, 6], fatorada: `12x^{2}${fator(a)}` }),
    () => ({ f: polinomio([1, 0, -2 * a * a, 0, c]), raizes: [num(-a), num(0), num(a)], intervalo: [-6, 6], fatorada: `4x${fator(a)}${fator(-a)}` }),
    () => ({ f: mul(X, FUNCOES.exp(mul(k, X))), raizes: [num(-1, k)], intervalo: [-4, 4] }),
    () => ({ f: mul(pot(X, 2), FUNCOES.exp(X)), raizes: [num(-2), num(0)], intervalo: [-6, 3] }),
    () => ({ f: soma(X, mul(a * a, pot(X, -1))), raizes: [num(-a), num(a)], intervalo: [-6, 6], dominio: '\\(x \\neq 0\\)' }),
  ])();
}
const fator = (r) => (r === 0 ? 'x' : `(x ${r > 0 ? '-' : '+'} ${Math.abs(r)})`);

export default {
  id: 'criticos',
  titulo: 'Pontos críticos e classificação',
  gerar(rng, dificuldade) {
    const { f, raizes, intervalo, fatorada, dominio } = funcoes(rng, dificuldade);
    const d1 = derivar(f);
    const d2 = derivar(d1);
    const maximos = [];
    const minimos = [];
    const passos = [
      { tex: `f'(x) = ${tex(d1)}${fatorada ? ` = ${fatorada}` : ''}`, txt: `Derivamos${fatorada ? ' e fatoramos' : ''}. Os pontos críticos são os valores de \\(x\\) em que \\(f'(x) = 0\\) (aqui \\(f'\\) existe em todo o domínio${dominio ? `, ${dominio}` : ''}).` },
      { tex: `f'(x) = 0 \\;\\Rightarrow\\; ${raizes.map((r) => `x = ${tex(r)}`).join(' \\ \\text{ ou } \\ ')}`, txt: 'Resolvemos a equação. Uma exponencial nunca se anula, então só os outros fatores contam.' },
      { tex: `f''(x) = ${tex(d2)}`, txt: 'Calculamos a segunda derivada para classificar cada ponto crítico.' },
    ];
    for (const r of raizes) {
      const v = subs(d2, 'x', r);
      const sinal = Math.sign(valor(v));
      if (sinal > 0) minimos.push(r); else if (sinal < 0) maximos.push(r);
      passos.push({
        tex: `f''(${tex(r)}) = ${tex(v)}${sinal > 0 ? ' > 0' : sinal < 0 ? ' < 0' : ''}`,
        txt: sinal > 0 ? `Concavidade para cima: <strong>mínimo local</strong> em \\(x = ${tex(r)}\\), com \\(f(${tex(r)}) = ${tex(subs(f, 'x', r))}\\).`
          : sinal < 0 ? `Concavidade para baixo: <strong>máximo local</strong> em \\(x = ${tex(r)}\\), com \\(f(${tex(r)}) = ${tex(subs(f, 'x', r))}\\).`
            : `O teste da segunda derivada é inconclusivo. Olhando o sinal de \\(f'\\): ele <strong>não muda</strong> ao passar por \\(x = ${tex(r)}\\), então esse ponto crítico não é máximo nem mínimo.`,
      });
    }
    return {
      enunciado: `Encontre os pontos críticos de \\(f(x) = ${tex(f)}\\)${dominio ? ` (${dominio})` : ''} e classifique cada um como máximo local, mínimo local ou nenhum dos dois.`,
      campos: [
        campoConjunto('criticos', 'Pontos críticos: x =', raizes),
        campoConjunto('maximos', 'Máximos locais em x =', maximos),
        campoConjunto('minimos', 'Mínimos locais em x =', minimos),
      ],
      dicas: ["Pontos críticos: resolva \\(f'(x) = 0\\). Para classificar, use o sinal de \\(f''\\) em cada ponto (ou a mudança de sinal de \\(f'\\)).", `\\(f'(x) = ${tex(d1)}\\). Iguale a zero.`],
      passos,
      conferencia: { tipo: 'criticos', f: texto(f), fTex: tex(f), criticos: raizes.map((r) => valor(r)), max: maximos.map((r) => valor(r)), min: minimos.map((r) => valor(r)), intervalo },
    };
  },
};
export { texEm };
