// Funções inversas e trigonométricas inversas.
import { A, X, num, mul, soma, pot, tex, coef, monomio, FUNCOES, questaoDerivada } from '../base.js';
import { texNum, texEm } from '../formatar.js';

const DENTRO = [-0.85, 0.85];

export function construir(rng, dificuldade) {
  if (dificuldade === 'facil') {
    const nome = rng.escolha(['arctg', 'arcsen', 'arccos']);
    return { f: soma(mul(coef(rng), FUNCOES[nome](X)), rng.chance(0.7) ? monomio(rng, [1, 2, 3]) : 0), dominio: nome === 'arctg' ? [-3, 3] : DENTRO };
  }
  if (dificuldade === 'medio') {
    const k = rng.int(2, 4);
    const opcoes = [
      () => ({ f: FUNCOES.arctg(mul(rng.escolha([2, 3, 4, 5]), X)) }),
      () => ({ f: FUNCOES.arcsen(mul(k, X)), dominio: [-0.85 / k, 0.85 / k] }),
      () => ({ f: mul(pot(X, rng.int(1, 2)), FUNCOES.arctg(X)) }),
      () => ({ f: FUNCOES.arctg(pot(X, rng.int(2, 3))) }),
      () => ({ f: mul(X, FUNCOES.arcsen(X)), dominio: DENTRO }),
      () => ({ f: FUNCOES.arccos(mul(k, X)), dominio: [-0.85 / k, 0.85 / k] }),
    ];
    return rng.escolha(opcoes)();
  }
  const opcoes = [
    () => ({ f: FUNCOES.arctg(FUNCOES.exp(mul(rng.escolha([1, 2, -1]), X))) }),
    () => ({ f: FUNCOES.arcsen(A.raiz(X)), dominio: [0.05, 0.9] }),
    () => ({ f: pot(FUNCOES.arctg(X), rng.int(2, 3)) }),
    () => ({ f: FUNCOES.exp(FUNCOES.arctg(X)) }),
    () => ({ f: FUNCOES.arctg(A.div(1, X)), dominio: [0.3, 4] }),
    () => ({ f: mul(pot(X, 2), FUNCOES.arcsen(pot(X, 2))), dominio: DENTRO }),
    () => ({ f: FUNCOES.ln(soma(1, pot(FUNCOES.arctg(X), 2))) }),
  ];
  return rng.escolha(opcoes)();
}

/** (f⁻¹)'(b) para uma cúbica crescente, sem precisar da fórmula da inversa. */
function derivadaDaInversa(rng) {
  const a = rng.int(1, 4);
  const c = rng.int(-4, 4);
  const f = soma(pot(X, 3), mul(a, X), c);
  const x0 = rng.escolha([-2, -1, 1, 2]);
  const b = A.valor(f, { x: x0 });
  const df = A.derivar(f);
  const inclinacao = A.valor(df, { x: x0 });
  return {
    enunciado: `Seja \\(f(x) = ${tex(f)}\\), que é crescente e, portanto, inversível. Calcule \\(\\left(f^{-1}\\right)'(${texNum(b)})\\).`,
    tipoResposta: 'numero',
    rotulo: `\\left(f^{-1}\\right)'(${texNum(b)}) =`,
    respostaLatex: tex(num(1, inclinacao)),
    respostaExpr: `1/${inclinacao}`,
    dicas: ["Use \\(\\left(f^{-1}\\right)'(b) = \\dfrac{1}{f'(a)}\\), em que \\(f(a) = b\\).", `Procure, por tentativa com inteiros pequenos, o valor \\(a\\) tal que \\(f(a) = ${texNum(b)}\\).`],
    passos: [
      { tex: `f(${texNum(x0)}) = ${texNum(b)} \\;\\Rightarrow\\; f^{-1}(${texNum(b)}) = ${texNum(x0)}`, txt: `Primeiro encontramos o ponto \\(a\\) em que \\(f(a) = ${texNum(b)}\\). Testando inteiros pequenos, \\(a = ${texNum(x0)}\\) funciona.` },
      { tex: `f'(x) = ${tex(df)}`, txt: 'Derivamos \\(f\\) pela regra da potência, termo a termo.' },
      { tex: `f'(${texNum(x0)}) = ${texEm(df, texNum(x0))} = ${inclinacao}`, txt: `Calculamos a derivada no ponto \\(a = ${texNum(x0)}\\) (e não em \\(${texNum(b)}\\)).` },
      { tex: `\\left(f^{-1}\\right)'(${texNum(b)}) = \\frac{1}{f'(${texNum(x0)})} = ${tex(num(1, inclinacao))}`, txt: 'A inclinação da inversa é o recíproco da inclinação de \\(f\\) no ponto correspondente.' },
    ],
    errosComuns: [
      { expr: `1/(${A.valor(df, { x: b })})`, msg: "Você calculou \\(f'\\) no ponto errado. A derivada de \\(f\\) deve ser calculada em \\(a = f^{-1}(b)\\), não em \\(b\\)." },
      { expr: `${inclinacao}`, msg: "Esse é \\(f'(a)\\). A derivada da inversa é o <strong>recíproco</strong>: \\(1/f'(a)\\)." },
    ],
    conferencia: { tipo: 'inversa', f: A.texto(f), b },
  };
}

export default {
  id: 'inversas',
  titulo: 'Funções inversas',
  construir,
  gerar(rng, dificuldade) {
    if (dificuldade !== 'facil' && rng.chance(0.25)) return derivadaDaInversa(rng);
    const { f, dominio } = construir(rng, dificuldade);
    return questaoDerivada(f, { dominio });
  },
};
