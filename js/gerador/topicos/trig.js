// Derivadas trigonométricas.
import { A, X, mul, soma, pot, coef, monomio, multiplo, FUNCOES, modeloDerivada } from '../base.js';

const TODAS = ['sen', 'cos', 'tg', 'sec', 'cossec', 'cotg'];
// tg, sec, cossec e cotg têm assíntotas: amostramos longe delas
const dominioDe = (nomes) => (nomes.some((n) => ['cossec', 'cotg'].includes(n)) ? [0.3, 2.8] : nomes.some((n) => ['tg', 'sec'].includes(n)) ? [-1.2, 1.2] : [-3, 3]);

export function construir(rng, dificuldade) {
  if (dificuldade === 'facil') {
    const [a, b] = rng.embaralhar(TODAS).slice(0, 2);
    const termos = [mul(coef(rng), FUNCOES[a](X)), rng.chance(0.6) ? mul(coef(rng), FUNCOES[b](X)) : monomio(rng, [1, 2, 3])];
    return { f: soma(...termos), dominio: dominioDe([a, b]) };
  }
  if (dificuldade === 'medio') {
    const t = rng.escolha(['sen', 'cos']);
    const opcoes = [
      () => ({ f: mul(monomio(rng, [1, 2, 3], 3), FUNCOES[t](X)) }),
      () => ({ f: soma(FUNCOES.sen(multiplo(rng, [2, 3, 4])), mul(coef(rng, 3), FUNCOES.cos(multiplo(rng, [2, 3, 5])))) }),
      () => ({ f: mul(coef(rng, 3), FUNCOES.sen(X), FUNCOES.cos(X)) }),
      () => ({ f: FUNCOES.tg(multiplo(rng, [2, 3])), dominio: [-0.45, 0.45] }),
      () => ({ f: pot(FUNCOES[t](X), rng.int(2, 4)) }),
      () => ({ f: A.div(FUNCOES.sen(X), soma(rng.int(2, 3), FUNCOES.cos(X))) }),
      () => ({ f: mul(X, FUNCOES[rng.escolha(['tg', 'sec'])](X)), dominio: [-1.2, 1.2] }),
    ];
    return rng.escolha(opcoes)();
  }
  const t = rng.escolha(['sen', 'cos']);
  const opcoes = [
    () => ({ f: pot(FUNCOES[t](multiplo(rng, [2, 3, 4])), rng.int(2, 4)) }),
    () => ({ f: mul(pot(X, rng.int(1, 2)), FUNCOES.sec(multiplo(rng, [2, 3]))), dominio: [-0.45, 0.45] }),
    () => ({ f: mul(FUNCOES.sen(pot(X, 2)), FUNCOES.cos(multiplo(rng, [2, 3]))), dominio: [-2, 2] }),
    () => ({ f: A.raiz(soma(rng.int(1, 4), pot(FUNCOES[t](X), 2))) }),
    () => ({ f: FUNCOES.cos(FUNCOES.sen(multiplo(rng, [2, 3]))) }),
    () => ({ f: pot(FUNCOES.tg(multiplo(rng, [2, 3])), rng.int(2, 3)), dominio: [-0.45, 0.45] }),
    () => ({ f: A.div(FUNCOES[t](multiplo(rng, [2, 3])), soma(pot(X, 2), rng.int(1, 4))) }),
  ];
  return rng.escolha(opcoes)();
}

export default modeloDerivada('trig', 'Derivadas trigonométricas', construir);
