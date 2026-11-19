// Derivada em um ponto: f'(a) com valor exato.
import { A, X, num, mul, soma, pot, tex, coef, afim, poli, FUNCOES } from '../base.js';
import { texEm } from '../formatar.js';
import { resolverDerivada } from '../regras.js';

const { PI, subs, derivar, texto } = A;

/** Funções com um ponto em que f e f' têm valor exato "bonito". Usado também pelas retas tangente e normal. */
export function funcaoComPonto(rng, dificuldade) {
  const inteiro = () => num(rng.escolha([-2, -1, 1, 2, 3]));
  if (dificuldade === 'facil') return { f: poli(rng, rng.int(2, 3), { minimo: 2, max: 3 }), a: inteiro() };
  if (dificuldade === 'medio') {
    const opcoes = [
      () => ({ f: mul(afim(rng, 3), soma(pot(X, 2), coef(rng, 4))), a: inteiro() }),
      () => {
        const a = rng.int(1, 3);
        const d = rng.int(1, 4);
        return { f: A.div(soma(mul(coef(rng, 3), X), coef(rng, 4)), soma(X, d)), a: num(a), dominio: [-0.5, 4] };
      },
      () => {
        const [k, a, m] = [rng.int(1, 4), rng.int(1, 3), rng.int(2, 5)];
        return { f: A.raiz(soma(mul(k, X), m * m - k * a)), a: num(a), dominio: [a - 0.5, a + 3] };
      },
      () => ({ f: mul(rng.int(2, 5), pot(X, rng.escolha([-1, -2]))), a: num(rng.escolha([1, 2, -1])), dominio: [0.3, 4] }),
      () => ({ f: FUNCOES.exp(mul(rng.escolha([2, 3, -1, -2]), X)), a: num(0) }),
      () => ({ f: mul(pot(X, rng.int(1, 3)), FUNCOES.ln(X)), a: num(1), dominio: [0.3, 4] }),
    ];
    return rng.escolha(opcoes)();
  }
  const angulo = () => mul(rng.escolha([num(1, 6), num(1, 4), num(1, 3), num(1, 2), num(1)]), PI);
  const opcoes = [
    () => ({ f: mul(X, FUNCOES[rng.escolha(['sen', 'cos'])](X)), a: rng.escolha([mul(num(1, 2), PI), PI]) }),
    () => ({ f: FUNCOES[rng.escolha(['sen', 'cos'])](mul(2, X)), a: angulo() }),
    () => ({ f: pot(FUNCOES[rng.escolha(['sen', 'cos'])](X), 2), a: mul(rng.escolha([num(1, 6), num(1, 4), num(1, 3)]), PI) }),
    () => ({ f: mul(soma(mul(rng.int(1, 3), X), rng.int(1, 4)), FUNCOES.exp(mul(rng.escolha([2, -1, -2]), X))), a: num(0) }),
    () => ({ f: FUNCOES.ln(soma(pot(X, 2), rng.int(1, 3))), a: num(rng.escolha([1, 2, -1])) }),
    () => ({ f: mul(pot(X, 2), FUNCOES.exp(soma(X, -1))), a: num(1) }),
    () => ({ f: FUNCOES.arctg(mul(rng.int(1, 3), X)), a: num(rng.escolha([0, 1])) }),
  ];
  return rng.escolha(opcoes)();
}

export default {
  id: 'ponto',
  titulo: 'Derivada em um ponto',
  gerar(rng, dificuldade) {
    const { f, a } = funcaoComPonto(rng, dificuldade);
    const r = resolverDerivada(f);
    const valor = subs(r.df, 'x', a);
    const aTex = tex(a);
    const cru = texEm(r.df, aTex);
    return {
      enunciado: `Calcule \\(f'(${aTex})\\), sendo \\(f(x) = ${tex(f)}\\).`,
      tipoResposta: 'numero',
      rotulo: `f'(${aTex}) =`,
      respostaLatex: tex(valor),
      respostaExpr: texto(valor),
      dicas: ['Derive primeiro a função; só depois substitua o ponto.', r.dicas[0]],
      passos: [
        ...r.passos,
        { tex: `f'(${aTex}) = ${cru}${cru === tex(valor) ? '' : ` = ${tex(valor)}`}`, txt: `Substituímos \\(x = ${aTex}\\) na derivada e calculamos.` },
      ],
      errosComuns: [
        { expr: texto(subs(f, 'x', a)), msg: 'Esse é o valor da função, \\(f(a)\\). O que se pede é o valor da <strong>derivada</strong> no ponto.' },
        { expr: '0', msg: 'Você derivou depois de substituir? Substituir primeiro transforma a função em constante. Derive e só então substitua.' },
      ],
      conferencia: { tipo: 'ponto', f: texto(f), fTex: tex(f), a: A.valor(a), ordem: 1 },
    };
  },
};
export { derivar };
