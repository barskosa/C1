// Peças compartilhadas pelos modelos de questão: sorteio de funções "bonitas"
// e montagem da questão padrão "calcule f'(x)".

import * as A from './expr.js';
import { tex } from './formatar.js';
import { resolverDerivada } from './regras.js';

const { X, num, mul, soma, pot, fn, exp, ln, q } = A;

/** Inteiro não nulo pequeno. */
export const coef = (rng, max = 5) => rng.naoNulo(-max, max);

/** ax + b com a ≠ 0 e b ≠ 0. */
export const afim = (rng, max = 4) => soma(mul(coef(rng, max), X), coef(rng, max + 1));

/** x² + a, com a > 0 (nunca se anula). */
export const quadPositiva = (rng) => soma(pot(X, 2), rng.int(1, 5));

/** Polinômio de grau dado, com pelo menos `minimo` termos e coeficientes pequenos. */
export function poli(rng, grau, { max = 5, minimo = 2 } = {}) {
  for (;;) {
    const cs = Array.from({ length: grau + 1 }, (_, i) => (i === 0 ? coef(rng, max) : rng.chance(0.75) ? coef(rng, max + 2) : 0));
    if (cs.filter((c) => c !== 0).length >= minimo) return A.polinomio(cs);
  }
}

/** Monômio c·x^n. */
export const monomio = (rng, graus = [1, 2, 3], max = 4) => mul(rng.chance(0.5) ? 1 : coef(rng, max), pot(X, rng.escolha(graus)));

/** k·x, com k inteiro (≠ 0, ±1 opcional). */
export const multiplo = (rng, ks = [2, 3, 4, 5, -2, -3]) => mul(rng.escolha(ks), X);

export const FUNCOES = {
  sen: (u) => fn('sin', u), cos: (u) => fn('cos', u), tg: (u) => fn('tan', u), sec: (u) => fn('sec', u),
  cossec: (u) => fn('csc', u), cotg: (u) => fn('cot', u), exp: (u) => exp(u), ln: (u) => ln(u),
  arctg: (u) => fn('atan', u), arcsen: (u) => fn('asin', u), arccos: (u) => fn('acos', u), raiz: (u) => A.raiz(u),
};

/**
 * Questão padrão "calcule a derivada": os passos vêm do explicador da regra
 * que se aplica à estrutura montada pelo modelo.
 */
export function questaoDerivada(f, opcoes = {}) {
  const r = resolverDerivada(f, opcoes);
  const fTex = tex(f);
  return {
    enunciado: opcoes.enunciado ?? `Calcule a derivada de \\(f(x) = ${fTex}\\).`,
    tipoResposta: 'expressao',
    rotulo: "f'(x) =",
    respostaLatex: tex(r.df),
    respostaExpr: A.texto(r.df),
    variaveis: ['x'],
    dominio: opcoes.dominio ?? [-3, 3],
    dicas: r.dicas,
    passos: [...(opcoes.antes ?? []), ...r.passos],
    errosComuns: r.erros,
    conferencia: { tipo: 'derivada', f: A.texto(opcoes.original ?? f), fTex: opcoes.fTex ?? fTex, var: 'x' },
    regra: r.regra,
  };
}

/** Cria um modelo "calcule f'(x)" a partir de uma função construir(rng, dificuldade) → { f, dominio }. */
export function modeloDerivada(id, titulo, construir) {
  return {
    id,
    titulo,
    construir,
    gerar(rng, dificuldade) {
      const { f, dominio, ...resto } = construir(rng, dificuldade);
      return questaoDerivada(f, { dominio, ...resto });
    },
  };
}

export { A, X, num, mul, soma, pot, fn, exp, ln, q, tex };
