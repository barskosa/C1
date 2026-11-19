// Limites pela Regra de L'Hôpital.
import { A, X, num, mul, soma, pot, tex, FUNCOES } from '../base.js';
import { texNum } from '../formatar.js';

const { derivar, subs, sub, div, ehZero, texto, exp, ln, expandir } = A;
const frac = (n, d) => `\\frac{${tex(n)}}{${tex(d)}}`;

/** Quocientes N/D com N(a) = D(a) = 0. */
function indeterminados(rng, dificuldade) {
  const [k, m] = [rng.int(2, 5), rng.int(2, 5)];
  if (dificuldade === 'facil') {
    const [r, s, t] = rng.embaralhar([-3, -2, -1, 1, 2, 3, 4]).slice(0, 3);
    return rng.escolha([
      () => ({ N: expandir(mul(soma(X, -r), soma(X, -s))), D: expandir(mul(soma(X, -r), soma(X, -t))), a: num(r) }),
      () => ({ N: FUNCOES.sen(mul(k, X)), D: mul(m, X), a: num(0) }),
      () => ({ N: soma(FUNCOES.exp(mul(k, X)), -1), D: mul(m, X), a: num(0) }),
      () => ({ N: ln(X), D: soma(mul(k, X), -k), a: num(1) }),
      () => ({ N: FUNCOES.tg(mul(k, X)), D: FUNCOES.sen(mul(m, X)), a: num(0) }),
    ])();
  }
  return rng.escolha([
    () => ({ N: sub(1, FUNCOES.cos(mul(k, X))), D: mul(m, pot(X, 2)), a: num(0) }),
    () => ({ N: soma(FUNCOES.exp(mul(k, X)), -1, mul(-k, X)), D: pot(X, 2), a: num(0) }),
    () => ({ N: sub(FUNCOES.sen(mul(k, X)), mul(k, X)), D: pot(X, 3), a: num(0) }),
    () => ({ N: sub(FUNCOES.cos(mul(k, X)), FUNCOES.cos(mul(k + 1, X))), D: pot(X, 2), a: num(0) }),
    () => ({ N: sub(soma(X, -1), ln(X)), D: expandir(pot(soma(X, -1), 2)), a: num(1) }),
  ])();
}

/** Aplica a regra até a indeterminação acabar; devolve o limite e os passos. */
function aplicar(N, D, a, lim) {
  const passos = [];
  let [n, d] = [N, D];
  for (let vez = 1; vez <= 4; vez++) {
    if (!ehZero(subs(n, 'x', a)) || !ehZero(subs(d, 'x', a))) break;
    const [dn, dd] = [derivar(n), derivar(d)];
    passos.push({
      tex: `${lim} ${frac(n, d)} = ${lim} ${frac(dn, dd)}`,
      txt: `${vez === 1 ? 'Substituindo' : 'Substituindo de novo'} \\(x = ${tex(a)}\\), numerador e denominador se anulam: forma \\(\\tfrac{0}{0}\\). Pela Regra de L’Hôpital, derivamos o numerador e o denominador <strong>separadamente</strong>.`,
    });
    [n, d] = [dn, dd];
  }
  const [vn, vd] = [subs(n, 'x', a), subs(d, 'x', a)];
  if (ehZero(vd)) throw new Error('limite não finito');
  const L = div(vn, vd);
  const cru = `\\frac{${tex(vn)}}{${tex(vd)}}`;
  passos.push({ tex: `${lim} ${frac(n, d)} = ${cru}${cru === tex(L) || A.ehUm(vd) ? '' : ` = ${tex(L)}`}`.replace(cru, A.ehUm(vd) ? tex(L) : cru), txt: 'Agora a substituição direta funciona: o limite é esse valor.' });
  return { L, passos };
}

function especiais(rng) {
  const k = rng.int(2, 4);
  const n = rng.int(2, 3);
  const infinito = '\\lim_{x \\to +\\infty}';
  return rng.escolha([
    () => {
      const L = pot(A.E, num(k));
      return {
        fTex: `\\left(1 + \\frac{${k}}{x}\\right)^{x}`, f: `(1 + ${k}/x)^x`, lim: infinito, a: 'inf', L,
        dicas: ['Forma \\(1^\\infty\\): chame a expressão de \\(y\\), aplique \\(\\ln\\) e transforme em quociente.', `\\(\\ln y = x\\ln\\left(1 + \\frac{${k}}{x}\\right) = \\dfrac{\\ln\\left(1 + \\frac{${k}}{x}\\right)}{1/x}\\), que é \\(\\tfrac{0}{0}\\).`],
        passos: [
          { tex: `\\ln y = x\\ln\\left(1 + \\frac{${k}}{x}\\right) = \\frac{\\ln\\left(1 + \\frac{${k}}{x}\\right)}{1/x}`, txt: 'Forma \\(1^\\infty\\). Chamamos a expressão de \\(y\\), aplicamos \\(\\ln\\) e escrevemos o produto como quociente, agora do tipo \\(\\tfrac{0}{0}\\).' },
          { tex: `${infinito} \\frac{\\ln\\left(1 + \\frac{${k}}{x}\\right)}{1/x} = ${infinito} \\frac{\\dfrac{1}{1 + \\frac{${k}}{x}} \\cdot \\left(-\\dfrac{${k}}{x^{2}}\\right)}{-\\dfrac{1}{x^{2}}} = ${infinito} \\frac{${k}}{1 + \\frac{${k}}{x}} = ${k}`, txt: 'L’Hôpital (com a regra da cadeia no numerador). Os fatores \\(-\\dfrac{1}{x^2}\\) cancelam e \\(\\dfrac{' + k + '}{x} \\to 0\\).' },
          { tex: `${infinito} y = e^{${k}}`, txt: `Se \\(\\ln y \\to ${k}\\), então \\(y \\to e^{${k}}\\).` },
        ],
        erros: [{ expr: `${k}`, msg: 'Esse é o limite de \\(\\ln y\\). Falta “desfazer” o logaritmo: a resposta é \\(e\\) elevado a esse valor.' }, { expr: '1', msg: '\\(1^\\infty\\) é uma forma indeterminada: não vale 1 automaticamente.' }],
      };
    },
    () => ({
      fTex: `x^{${n}}\\ln x`, f: `x^${n}*log(x)`, lim: '\\lim_{x \\to 0^+}', a: 0, lado: '+', L: num(0),
      dicas: ['Forma \\(0 \\cdot \\infty\\): reescreva o produto como quociente para poder usar L’Hôpital.', `Escreva \\(x^{${n}}\\ln x = \\dfrac{\\ln x}{x^{-${n}}}\\), do tipo \\(\\tfrac{\\infty}{\\infty}\\).`],
      passos: [
        { tex: `x^{${n}}\\ln x = \\frac{\\ln x}{x^{-${n}}}`, txt: 'Forma \\(0 \\cdot \\infty\\) (\\(\\ln x \\to -\\infty\\)). Reescrevemos como quociente do tipo \\(\\tfrac{\\infty}{\\infty}\\).' },
        { tex: `\\lim_{x \\to 0^+} \\frac{\\ln x}{x^{-${n}}} = \\lim_{x \\to 0^+} \\frac{1/x}{-${n}x^{-${n + 1}}} = \\lim_{x \\to 0^+} \\left(-\\frac{x^{${n}}}{${n}}\\right)`, txt: 'L’Hôpital: derivamos em cima e embaixo e simplificamos a fração de frações.' },
        { tex: `\\lim_{x \\to 0^+} \\left(-\\frac{x^{${n}}}{${n}}\\right) = 0`, txt: 'A potência “vence” o logaritmo: o produto tende a zero.' },
      ],
      erros: [],
    }),
    () => {
      const grau = rng.int(1, 2);
      const passos = [];
      let [N, D] = [pot(X, grau), exp(mul(k, X))];
      for (let i = 0; i < grau; i++) {
        const [dn, dd] = [derivar(N), derivar(D)];
        passos.push({ tex: `${infinito} ${frac(N, D)} = ${infinito} ${frac(dn, dd)}`, txt: 'Forma \\(\\tfrac{\\infty}{\\infty}\\): aplicamos L’Hôpital, derivando numerador e denominador separadamente.' });
        [N, D] = [dn, dd];
      }
      passos.push({ tex: `${infinito} ${frac(N, D)} = 0`, txt: 'O numerador agora é constante e o denominador cresce sem limite: a exponencial cresce mais rápido que qualquer potência.' });
      return {
        fTex: frac(pot(X, grau), exp(mul(k, X))), f: `x^${grau}/e^(${k}*x)`, lim: infinito, a: 'inf', L: num(0), passos,
        dicas: ['Forma \\(\\tfrac{\\infty}{\\infty}\\): L’Hôpital se aplica diretamente.', 'Derive em cima e embaixo até o numerador virar constante.'], erros: [],
      };
    },
  ])();
}

export default {
  id: 'lhopital',
  titulo: 'Regra de L’Hôpital',
  gerar(rng, dificuldade) {
    if (dificuldade === 'dificil') {
      const e = especiais(rng);
      return {
        enunciado: `Calcule \\(\\displaystyle ${e.lim} ${e.fTex}\\).`,
        tipoResposta: 'numero', rotulo: 'Limite =', respostaLatex: tex(e.L), respostaExpr: texto(e.L),
        dicas: e.dicas, passos: e.passos, errosComuns: e.erros,
        conferencia: { tipo: 'limite', f: e.f, a: e.a, lado: e.lado },
      };
    }
    const { N, D, a } = indeterminados(rng, dificuldade);
    const lim = `\\lim_{x \\to ${tex(a)}}`;
    const { L, passos } = aplicar(N, D, a, lim);
    const vezes = passos.length - 1;
    return {
      enunciado: `Calcule \\(\\displaystyle ${lim} ${frac(N, D)}\\).`,
      tipoResposta: 'numero', rotulo: 'Limite =', respostaLatex: tex(L), respostaExpr: texto(L),
      dicas: [`Substitua \\(x = ${texNum(A.valor(a))}\\): dá \\(\\tfrac{0}{0}\\), então a Regra de L’Hôpital se aplica${vezes > 1 ? ' (será preciso usá-la mais de uma vez)' : ''}.`, `Derive numerador e denominador separadamente: \\(${frac(derivar(N), derivar(D))}\\).`],
      passos,
      errosComuns: [{ expr: '0', msg: '\\(\\tfrac{0}{0}\\) não é zero: é uma forma indeterminada. Use L’Hôpital.' }],
      conferencia: { tipo: 'limite', f: `(${texto(N)})/(${texto(D)})`, a: A.valor(a) },
    };
  },
};
