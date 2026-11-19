// Exponenciais e logaritmos: e^x, a^x, ln x, log_a x.
import { A, X, num, mul, soma, pot, fn, coef, monomio, multiplo, quadPositiva, FUNCOES, modeloDerivada } from '../base.js';

const POSITIVO = [0.3, 4];
const logBase = (base, u) => fn('log', u, num(base));

export function construir(rng, dificuldade) {
  const base = rng.escolha([2, 3, 5, 10]);
  if (dificuldade === 'facil') {
    const pecas = rng.embaralhar([
      () => mul(coef(rng), FUNCOES.exp(X)),
      () => mul(coef(rng), FUNCOES.ln(X)),
      () => pot(num(base), X),
      () => logBase(base, X),
      () => monomio(rng, [1, 2, 3]),
    ]).slice(0, 2).map((p) => p());
    return { f: soma(...pecas), dominio: POSITIVO };
  }
  if (dificuldade === 'medio') {
    const opcoes = [
      () => ({ f: mul(monomio(rng, [1, 2, 3], 3), FUNCOES.exp(multiplo(rng))) }),
      () => ({ f: FUNCOES.ln(soma(mul(rng.int(1, 3), pot(X, 2)), rng.int(1, 6))) }),
      () => ({ f: mul(pot(X, rng.int(1, 3)), FUNCOES.ln(X)), dominio: POSITIVO }),
      () => ({ f: A.div(FUNCOES.exp(multiplo(rng, [2, 3, -1, -2])), pot(X, rng.int(1, 2))), dominio: POSITIVO }),
      () => ({ f: pot(num(base), multiplo(rng, [2, 3, -1, -2])) }),
      () => ({ f: logBase(base, soma(pot(X, 2), rng.int(1, 5))) }),
      () => ({ f: mul(coef(rng, 3), FUNCOES.exp(mul(rng.sinal(), pot(X, 2)))), dominio: [-1.5, 1.5] }),
    ];
    return rng.escolha(opcoes)();
  }
  const opcoes = [
    () => ({ f: mul(FUNCOES.exp(pot(X, 2)), FUNCOES.ln(X)), dominio: [0.3, 1.6] }),
    () => ({ f: FUNCOES.ln(A.raiz(quadPositiva(rng))) }),
    () => ({ f: mul(pot(X, rng.int(1, 2)), FUNCOES.exp(mul(-1, pot(X, 2)))), dominio: [-1.5, 1.5] }),
    () => ({ f: FUNCOES.ln(FUNCOES.ln(X)), dominio: [1.5, 5] }),
    () => ({ f: FUNCOES.exp(A.raiz(soma(mul(rng.int(1, 3), X), rng.int(1, 4)))), dominio: [0, 4] }),
    () => ({ f: FUNCOES.ln(soma(X, A.raiz(quadPositiva(rng)))) }),
    () => ({ f: A.div(FUNCOES.ln(X), soma(1, FUNCOES.exp(multiplo(rng, [2, -1])))), dominio: POSITIVO }),
    () => ({ f: pot(num(base), soma(pot(X, 2), coef(rng, 3))), dominio: [-1.5, 1.5] }),
  ];
  return rng.escolha(opcoes)();
}

export default modeloDerivada('exp-log', 'Exponenciais e logaritmos', construir);
