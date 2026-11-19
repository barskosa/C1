// Regra do produto.
import { A, X, mul, soma, pot, coef, afim, poli, monomio, multiplo, quadPositiva, FUNCOES, modeloDerivada } from '../base.js';

export function construir(rng, dificuldade) {
  const elementar = rng.escolha(['sen', 'cos', 'exp', 'ln']);
  const dominio = (nome) => (nome === 'ln' ? [0.3, 4] : [-3, 3]);
  if (dificuldade === 'facil') {
    if (rng.chance(0.35)) return { f: mul(afim(rng), poli(rng, 2, { minimo: 2 })) };
    return { f: mul(rng.chance(0.6) ? pot(X, rng.int(1, 3)) : afim(rng), FUNCOES[elementar](X)), dominio: dominio(elementar) };
  }
  if (dificuldade === 'medio') {
    // produto + cadeia simples em um dos fatores
    const u = rng.chance(0.5) ? monomio(rng, [1, 2, 3], 3) : afim(rng);
    const opcoes = [
      () => ({ f: mul(u, FUNCOES.exp(multiplo(rng))) }),
      () => ({ f: mul(u, FUNCOES[rng.escolha(['sen', 'cos'])](multiplo(rng, [2, 3, 4, 5]))) }),
      () => ({ f: mul(pot(X, rng.int(1, 3)), FUNCOES.ln(soma(mul(rng.int(2, 4), X), rng.int(1, 5)))), dominio: [0.3, 4] }),
      () => ({ f: mul(u, A.raiz(soma(mul(rng.int(1, 3), X), rng.int(1, 6)))), dominio: [0.2, 4] }),
    ];
    return rng.escolha(opcoes)();
  }
  // difícil: cadeia aninhada dentro do produto
  const opcoes = [
    () => ({ f: mul(pot(X, rng.int(1, 3)), pot(FUNCOES[rng.escolha(['sen', 'cos'])](multiplo(rng, [2, 3, 4])), rng.int(2, 3))) }),
    () => ({ f: mul(FUNCOES.exp(mul(coef(rng, 2), pot(X, 2))), FUNCOES[rng.escolha(['sen', 'cos'])](multiplo(rng, [2, 3]))), dominio: [-1.5, 1.5] }),
    () => ({ f: mul(pot(afim(rng, 3), rng.int(2, 4)), pot(quadPositiva(rng), rng.int(2, 3))), dominio: [-2, 2] }),
    () => ({ f: mul(monomio(rng, [1, 2], 3), FUNCOES.exp(multiplo(rng, [-1, -2, 2])), FUNCOES[rng.escolha(['sen', 'cos'])](X)), dominio: [-2, 2] }),
    () => ({ f: mul(pot(X, rng.int(1, 2)), A.raiz(soma(pot(X, 2), rng.int(1, 9)))), dominio: [-3, 3] }),
  ];
  return rng.escolha(opcoes)();
}

export default modeloDerivada('produto', 'Regra do produto', construir);
