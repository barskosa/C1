// Concavidade e pontos de inflexão.
import { A, X, num, mul, soma, pot, tex, FUNCOES } from '../base.js';
import { campoConjunto } from './criticos.js';

const { derivar, texto, valor, polinomio, raiz } = A;

function funcoes(rng, dificuldade) {
  const c = rng.int(-4, 4);
  const a = rng.naoNulo(-3, 3);
  if (dificuldade === 'facil') {
    return { f: polinomio([1, -3 * a, rng.int(-5, 5), c]), pontos: [num(a)], intervalo: [-6, 6] };
  }
  if (dificuldade === 'medio') {
    if (rng.chance(0.25)) return { f: polinomio([1, 0, 0, rng.naoNulo(-4, 4), c]), pontos: [], candidatos: [num(0)], intervalo: [-4, 4] };
    const b = rng.int(a + 1, a + 4);
    return { f: polinomio([1, -2 * (a + b), 6 * a * b, rng.int(-3, 3), c]), pontos: [num(a), num(b)], intervalo: [-8, 10] };
  }
  const k = rng.escolha([1, 2, -1, -2]);
  const m = rng.int(1, 3);
  return rng.escolha([
    () => ({ f: mul(X, FUNCOES.exp(mul(k, X))), pontos: [num(-2, k)], intervalo: [-5, 5] }),
    () => ({ f: FUNCOES.ln(soma(pot(X, 2), m * m)), pontos: [num(-m), num(m)], intervalo: [-6, 6] }),
    () => ({ f: FUNCOES.exp(mul(-1, pot(X, 2))), pontos: [mul(num(-1, 2), raiz(num(2))), mul(num(1, 2), raiz(num(2)))], intervalo: [-3, 3] }),
    () => ({ f: A.div(1, soma(pot(X, 2), 3 * m * m)), pontos: [num(-m), num(m)], intervalo: [-6, 6] }),
  ])();
}

export default {
  id: 'inflexao',
  titulo: 'Concavidade e pontos de inflexão',
  gerar(rng, dificuldade) {
    const { f, pontos, candidatos, intervalo } = funcoes(rng, dificuldade);
    const d1 = derivar(f);
    const d2 = derivar(d1);
    const lista = (ps) => ps.map((p) => `x = ${tex(p)}`).join(' \\ \\text{ ou } \\ ');
    const passos = [
      { tex: `f'(x) = ${tex(d1)}`, txt: 'Primeira derivada.' },
      { tex: `f''(x) = ${tex(d2)}`, txt: 'Segunda derivada: seu sinal determina a concavidade.' },
      { tex: `f''(x) = 0 \\;\\Rightarrow\\; ${lista(candidatos ?? pontos)}`, txt: 'Candidatos a ponto de inflexão: onde \\(f\'\'\\) se anula (exponenciais e denominadores positivos não mudam o sinal).' },
    ];
    passos.push(pontos.length
      ? { tex: `\\text{inflexão em } ${lista(pontos).replaceAll('\\text{ ou }', '\\text{ e }')}`, txt: 'Em cada candidato, \\(f\'\'\\) <strong>troca de sinal</strong> (teste um valor de cada lado): a concavidade muda, então são pontos de inflexão.' }
      : { tex: `f''(x) = ${tex(d2)} \\geq 0 \\ \\text{ para todo } x`, txt: '\\(f\'\'\\) se anula no candidato, mas <strong>não troca de sinal</strong>: a concavidade é a mesma dos dois lados. Não há ponto de inflexão.' });
    return {
      enunciado: `Para \\(f(x) = ${tex(f)}\\), calcule \\(f''(x)\\) e determine as abscissas dos pontos de inflexão (se houver).`,
      campos: [
        { id: 'segunda', tipo: 'expressao', rotulo: "f''(x) =", respostaLatex: tex(d2), respostaExpr: texto(d2), variaveis: ['x'], dominio: [-3, 3] },
        campoConjunto('inflexao', 'Pontos de inflexão em x =', pontos),
      ],
      dicas: ["Pontos de inflexão: onde \\(f''\\) muda de sinal. Calcule \\(f''(x)\\) e resolva \\(f''(x) = 0\\).", `\\(f'(x) = ${tex(d1)}\\). Derive de novo e iguale a zero; depois confira se o sinal de \\(f''\\) troca.`],
      passos,
      conferencia: { tipo: 'inflexao', f: texto(f), fTex: tex(f), pontos: pontos.map((p) => valor(p)), intervalo },
    };
  },
};
