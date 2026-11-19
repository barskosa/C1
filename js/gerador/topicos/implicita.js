// Derivação implícita: dy/dx a partir de uma equação em x e y.
import { A, X, num, mul, soma, pot, tex, FUNCOES } from '../base.js';
import { texPar, texNum } from '../formatar.js';

const { sim, sub, neg, div, derivar, subs, texto, E } = A;
const Y = sim('y');
const YL = sim("y'");
const negativo = (e) => { const t = e.t === '+' ? e.a[0] : e; return (t.t === 'n' && t.n < 0) || (t.t === '*' && t.c.n < 0); };

function curvas(rng, dificuldade) {
  const [a, b, k] = [rng.int(1, 4), rng.int(1, 4), rng.int(2, 4)];
  const [x0, y0] = [rng.escolha([1, 2, 3]), rng.escolha([1, 2, 3])];
  if (dificuldade === 'facil') {
    const c = a * x0 * x0 + b * y0 * y0;
    return rng.escolha([
      { esq: soma(mul(a, pot(X, 2)), mul(b, pot(Y, 2))), dir: num(c), x: [-0.8 * Math.sqrt(c / a), 0.8 * Math.sqrt(c / a)], y: [-Math.sqrt(c / b) - 0.5, Math.sqrt(c / b) + 0.5], x0, y0 },
      { esq: soma(pot(X, 3), pot(Y, 3)), dir: num(x0 ** 3 + y0 ** 3), x: [-2, 2], y: [-4.5, 4.5], x0, y0 },
      { esq: soma(mul(a, pot(X, 2)), mul(-1, pot(Y, 2))), dir: num(a * 9 - y0 * y0), x: [3, 5], y: [0.3, 12], x0: 3, y0 },
    ]);
  }
  if (dificuldade === 'medio') {
    return rng.escolha([
      { esq: soma(pot(X, 2), mul(a, X, Y), pot(Y, 2)), dir: num(x0 * x0 + a * x0 * y0 + y0 * y0), x: [-1, 1], y: [0.2, 9], x0, y0 },
      { esq: soma(pot(X, 3), pot(Y, 3)), dir: mul(2 * k, X, Y), x: [0.1 * k, k], y: [0.06 * k, 1.1 * k], x0: k, y0: k },
      { esq: soma(mul(pot(X, 2), Y), mul(b, Y)), dir: num((x0 * x0 + b) * y0), x: [-2, 2], y: [0.05, 12], x0, y0 },
      { esq: soma(mul(X, pot(Y, 2)), mul(a, X)), dir: num(x0 * (y0 * y0 + a)), x: [0.5, 3], y: [0.2, 9], x0, y0 },
    ]);
  }
  return rng.escolha([
    { esq: soma(FUNCOES.exp(Y), mul(k, X, Y)), dir: E, x: [-0.25, 0.8], y: [-2, 2.5], x0: 0, y0: 1 },
    { esq: soma(FUNCOES.ln(Y), mul(k, X, Y)), dir: num(k * x0), x: [0.3, 3], y: [0.05, 6], x0, y0: 1 },
    { esq: soma(mul(X, FUNCOES.exp(Y)), Y), dir: num(x0), x: [0.3, 3], y: [-3, 2], x0, y0: 0 },
    { esq: soma(FUNCOES.sen(Y), mul(a, pot(X, 2))), dir: mul(k, Y), x: [-0.9, 0.9], y: [-0.2, 2.5], x0: 0, y0: 0 },
  ]);
}

export default {
  id: 'implicita',
  titulo: 'Derivação implícita',
  gerar(rng, dificuldade) {
    const { esq, dir, x, y, x0, y0 } = curvas(rng, dificuldade);
    const F = sub(esq, dir);
    let cima = neg(derivar(F, 'x'));
    let baixo = derivar(F, 'y');
    if (negativo(baixo)) { cima = neg(cima); baixo = neg(baixo); }
    const resposta = div(cima, baixo);
    const lado = (e) => tex(soma(derivar(e, 'x'), mul(derivar(e, 'y'), YL)));
    const coefY = A.ehUm(baixo) ? '' : baixo.t === '+' ? texPar(baixo) : tex(baixo);
    const passos = [
      { tex: `${lado(esq)} = ${lado(dir)}`, txt: "Derivamos os dois lados em relação a \\(x\\), tratando \\(y\\) como função de \\(x\\): cada termo com \\(y\\) ganha um fator \\(y'\\) (regra da cadeia) e produtos como \\(xy\\) pedem a regra do produto." },
      { tex: `${coefY}${coefY ? '\\,' : ''}y' = ${tex(cima)}`, txt: "Levamos os termos com \\(y'\\) para um lado, os demais para o outro, e colocamos \\(y'\\) em evidência." },
      { tex: `y' = ${tex(resposta)}`, txt: "Isolamos \\(y'\\)." },
    ];
    const noPonto = dificuldade !== 'facil' && rng.chance(0.35);
    const base = {
      dicas: ["Derive os dois lados em relação a \\(x\\). Lembre que \\(\\dfrac{d}{dx}\\,y^n = n\\,y^{n-1}\\,y'\\) e \\((xy)' = y + x\\,y'\\).", `Derivando: \\(${passos[0].tex}\\). Agora isole \\(y'\\).`],
      curva: { F: texto(F), x, y },
    };
    if (noPonto) {
      const valor = subs(subs(resposta, 'x', num(x0)), 'y', num(y0));
      if (!Number.isFinite(A.valor(valor))) throw new Error('inclinação indefinida no ponto');
      return {
        ...base,
        enunciado: `A curva \\(${tex(esq)} = ${tex(dir)}\\) passa pelo ponto \\((${texNum(x0)},\\ ${texNum(y0)})\\). Calcule a inclinação da reta tangente nesse ponto.`,
        tipoResposta: 'numero',
        rotulo: `\\left.\\dfrac{dy}{dx}\\right|_{(${texNum(x0)},\\,${texNum(y0)})} =`,
        respostaLatex: tex(valor),
        respostaExpr: texto(valor),
        passos: [...passos, { tex: `y'\\Big|_{(${texNum(x0)},\\,${texNum(y0)})} = ${tex(valor)}`, txt: `Substituímos \\(x = ${texNum(x0)}\\) e \\(y = ${texNum(y0)}\\).` }],
        conferencia: { tipo: 'implicita-ponto', F: texto(F), x0, y0 },
      };
    }
    return {
      ...base,
      enunciado: `Determine \\(\\dfrac{dy}{dx}\\) por derivação implícita: \\(${tex(esq)} = ${tex(dir)}\\).`,
      tipoResposta: 'implicita',
      rotulo: "y' =",
      respostaLatex: tex(resposta),
      respostaExpr: texto(resposta),
      variaveis: ['x', 'y'],
      passos,
      errosComuns: [{ expr: texto(div(neg(cima), baixo)), msg: "O sinal ficou trocado. Ao passar os termos sem \\(y'\\) para o outro lado, eles mudam de sinal." }],
      conferencia: { tipo: 'implicita', F: texto(F), x, y },
    };
  },
};
