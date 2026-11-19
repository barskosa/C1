// Segunda derivada (derivadas de ordem superior).
import { A, X, mul, soma, pot, tex, coef, poli, multiplo, FUNCOES } from '../base.js';
import { resolverDerivada } from '../regras.js';

export default {
  id: 'segunda',
  titulo: 'Segunda derivada',
  gerar(rng, dificuldade) {
    const k = () => rng.escolha([2, 3, -1, -2]);
    const opcoes = {
      facil: [() => ({ f: poli(rng, rng.int(3, 5), { minimo: 3, max: 4 }) })],
      medio: [
        () => ({ f: mul(X, FUNCOES.exp(mul(k(), X))) }),
        () => ({ f: mul(coef(rng, 4), FUNCOES[rng.escolha(['sen', 'cos'])](multiplo(rng, [2, 3, 4]))) }),
        () => ({ f: mul(pot(X, rng.int(2, 3)), FUNCOES.ln(X)), dominio: [0.3, 4] }),
        () => ({ f: soma(mul(coef(rng, 4), pot(X, -rng.int(1, 2))), mul(coef(rng, 3), pot(X, rng.int(2, 3)))), dominio: [0.3, 4] }),
        () => ({ f: soma(FUNCOES.exp(mul(k(), X)), poli(rng, 2, { minimo: 2, max: 3 })) }),
        () => ({ f: mul(X, FUNCOES[rng.escolha(['sen', 'cos'])](X)) }),
      ],
      dificil: [
        () => ({ f: FUNCOES.exp(mul(rng.escolha([1, -1, 2]), pot(X, 2))), dominio: [-1.2, 1.2] }),
        () => ({ f: mul(pot(X, 2), FUNCOES.exp(mul(k(), X))), dominio: [-2, 2] }),
        () => ({ f: FUNCOES.ln(soma(pot(X, 2), rng.int(1, 4))) }),
        () => ({ f: A.div(X, soma(X, rng.int(1, 4))), dominio: [0, 4] }),
        () => ({ f: mul(X, FUNCOES[rng.escolha(['sen', 'cos'])](multiplo(rng, [2, 3]))) }),
        () => ({ f: pot(FUNCOES[rng.escolha(['sen', 'cos'])](X), 2) }),
      ],
    };
    const { f, dominio } = rng.escolha(opcoes[dificuldade])();
    const primeira = resolverDerivada(f);
    const segunda = resolverDerivada(primeira.df, { rotulo: "f''(x)", rotuloF: "f'(x)" });
    return {
      enunciado: `Calcule a segunda derivada, \\(f''(x)\\), de \\(f(x) = ${tex(f)}\\).`,
      tipoResposta: 'expressao',
      rotulo: "f''(x) =",
      respostaLatex: tex(segunda.df),
      respostaExpr: A.texto(segunda.df),
      variaveis: ['x'],
      dominio: dominio ?? [-3, 3],
      dicas: ["A segunda derivada é a derivada da primeira: calcule \\(f'(x)\\) e derive de novo.", `\\(f'(x) = ${tex(primeira.df)}\\). Agora derive essa função.`],
      passos: [
        ...primeira.passos,
        { tex: `f''(x) = \\left(f'(x)\\right)'`, txt: `Agora derivamos \\(f'(x) = ${tex(primeira.df)}\\) mais uma vez.` },
        ...segunda.passos,
      ],
      errosComuns: [
        { expr: A.texto(primeira.df), msg: "Essa é a <strong>primeira</strong> derivada. Derive mais uma vez para obter \\(f''(x)\\)." },
        { expr: A.texto(pot(primeira.df, 2)), msg: "\\(f''\\) não é \\((f')^2\\): é a derivada de \\(f'\\)." },
      ],
      conferencia: { tipo: 'derivada', f: A.texto(f), fTex: tex(f), var: 'x', ordem: 2 },
    };
  },
};
