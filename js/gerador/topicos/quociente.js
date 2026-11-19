// Regra do quociente.
import { A, X, mul, soma, pot, coef, afim, poli, multiplo, quadPositiva, FUNCOES, modeloDerivada } from '../base.js';

const { div } = A;

export function construir(rng, dificuldade) {
  if (dificuldade === 'facil') {
    const opcoes = [
      () => {
        for (;;) {
          const [u, v] = [afim(rng), afim(rng)];
          // evita numerador proporcional ao denominador (quociente constante)
          if (Math.abs(A.valor(div(u, v), { x: 0.37 }) - A.valor(div(u, v), { x: 1.91 })) > 1e-6) return { f: div(u, v) };
        }
      },
      () => ({ f: div(mul(coef(rng, 4), pot(X, rng.int(1, 2))), quadPositiva(rng)) }),
      () => ({ f: div(FUNCOES[rng.escolha(['sen', 'cos', 'exp'])](X), pot(X, rng.int(1, 2))), dominio: [0.3, 4] }),
      () => ({ f: div(pot(X, rng.int(1, 3)), afim(rng)) }),
    ];
    return rng.escolha(opcoes)();
  }
  if (dificuldade === 'medio') {
    const opcoes = [
      () => ({ f: div(poli(rng, 2, { minimo: 2 }), quadPositiva(rng)) }),
      () => ({ f: div(FUNCOES.sen(X), soma(rng.int(2, 4), FUNCOES.cos(X))) }),
      () => ({ f: div(FUNCOES.exp(multiplo(rng)), afim(rng)) }),
      () => ({ f: div(FUNCOES.ln(X), pot(X, rng.int(1, 3))), dominio: [0.3, 4] }),
      () => ({ f: div(afim(rng), soma(FUNCOES.exp(X), rng.int(1, 4))) }),
    ];
    return rng.escolha(opcoes)();
  }
  const opcoes = [
    () => ({ f: div(FUNCOES.exp(mul(rng.sinal(), pot(X, 2))), quadPositiva(rng)), dominio: [-1.5, 1.5] }),
    () => ({ f: div(FUNCOES[rng.escolha(['sen', 'cos'])](multiplo(rng, [2, 3, 4])), quadPositiva(rng)) }),
    () => ({ f: div(A.raiz(soma(X, rng.int(1, 5))), quadPositiva(rng)), dominio: [0, 4] }),
    () => ({ f: div(pot(afim(rng, 3), rng.int(2, 3)), quadPositiva(rng)), dominio: [-2, 2] }),
    () => ({ f: div(FUNCOES.ln(quadPositiva(rng)), afim(rng)) }),
    () => ({ f: div(mul(pot(X, rng.int(1, 2)), FUNCOES.exp(multiplo(rng, [2, -1, -2]))), quadPositiva(rng)), dominio: [-2, 2] }),
  ];
  return rng.escolha(opcoes)();
}

export default modeloDerivada('quociente', 'Regra do quociente', construir);
