// Regra da cadeia (inclusive composições aninhadas).
import { A, X, mul, soma, pot, q, coef, afim, poli, multiplo, quadPositiva, FUNCOES, modeloDerivada } from '../base.js';

export function construir(rng, dificuldade) {
  if (dificuldade === 'facil') {
    const opcoes = [
      () => ({ f: pot(afim(rng), rng.int(3, 7)) }),
      () => ({ f: FUNCOES[rng.escolha(['sen', 'cos'])](multiplo(rng, [2, 3, 4, 5, 6])) }),
      () => ({ f: FUNCOES.exp(multiplo(rng)) }),
      () => ({ f: A.raiz(soma(mul(rng.int(1, 5), X), rng.int(1, 9))), dominio: [0, 4] }),
      () => ({ f: FUNCOES.ln(soma(mul(rng.int(2, 5), X), rng.int(1, 9))), dominio: [0, 4] }),
    ];
    return rng.escolha(opcoes)();
  }
  if (dificuldade === 'medio') {
    const opcoes = [
      () => ({ f: pot(poli(rng, 2, { minimo: 2 }), rng.int(3, 5)), dominio: [-2, 2] }),
      () => ({ f: FUNCOES.exp(poli(rng, 2, { max: 3, minimo: 2 })), dominio: [-1.5, 1.5] }),
      () => ({ f: FUNCOES[rng.escolha(['sen', 'cos'])](soma(pot(X, rng.int(2, 3)), coef(rng))), dominio: [-2, 2] }),
      () => ({ f: A.raiz(soma(pot(X, 2), mul(rng.int(1, 4), X), rng.int(5, 9))) }),
      () => ({ f: FUNCOES.ln(soma(mul(rng.int(1, 3), pot(X, 2)), rng.int(1, 6))) }),
      () => ({ f: pot(quadPositiva(rng), -rng.int(1, 3)) }),
      () => ({ f: FUNCOES.exp(FUNCOES[rng.escolha(['sen', 'cos'])](X)) }),
      () => ({ f: pot(soma(mul(rng.int(2, 4), X), rng.int(1, 5)), q(rng.escolha([3, 5]), 2)), dominio: [0, 4] }),
    ];
    return rng.escolha(opcoes)();
  }
  // difícil: três camadas, ou cadeia com produto/quociente por dentro
  const trig = () => FUNCOES[rng.escolha(['sen', 'cos'])];
  const opcoes = [
    () => ({ f: pot(trig()(multiplo(rng, [2, 3, 4])), rng.int(2, 4)) }),
    () => ({ f: FUNCOES.exp(trig()(multiplo(rng, [2, 3, 4]))) }),
    () => ({ f: A.raiz(soma(rng.int(1, 4), FUNCOES.exp(multiplo(rng, [2, 3, -2])))) }),
    () => ({ f: trig()(A.raiz(quadPositiva(rng))) }),
    () => ({ f: trig()(FUNCOES.exp(multiplo(rng, [2, 3, -1]))), dominio: [-1.5, 1.5] }),
    () => ({ f: FUNCOES.ln(soma(rng.int(2, 4), pot(FUNCOES.sen(X), 2))) }),
    () => ({ f: pot(soma(1, A.raiz(soma(mul(rng.int(1, 3), X), rng.int(1, 4)))), rng.int(3, 5)), dominio: [0, 4] }),
    () => ({ f: trig()(mul(X, FUNCOES.exp(multiplo(rng, [2, -1])))), dominio: [-1.5, 1.5] }),
    () => ({ f: A.raiz(A.div(soma(pot(X, 2), rng.int(1, 4)), soma(pot(X, 2), rng.int(5, 9)))) }),
  ];
  return rng.escolha(opcoes)();
}

export default modeloDerivada('cadeia', 'Regra da cadeia', construir);
