// Equação da reta tangente e da reta normal.
import { A, X, mul, soma, tex } from '../base.js';
import { texEm, texPar, texMenos } from '../formatar.js';
import { resolverDerivada } from '../regras.js';
import { funcaoComPonto } from './ponto.js';

const { subs, neg, div, texto, sim, ehUm } = A;
const Y = sim('y');

/** "m(x − a)" sem coeficiente 1 nem sinais duplicados. */
function ladoDireito(m, a) {
  const dx = soma(X, neg(a));
  if (A.ehZero(m)) return '0';
  if (ehUm(m)) return tex(dx);
  if (ehUm(neg(m))) return `-${texMenos('x', a)}`;
  return `${m.t === 'n' || m.t === 's' ? tex(m) : texPar(m)}${texMenos('x', a)}`;
}

function questaoDeReta(rng, dificuldade, normal) {
  const { f, a } = funcaoComPonto(rng, dificuldade);
  const r = resolverDerivada(f);
  const y0 = subs(f, 'x', a);
  const mTangente = subs(r.df, 'x', a);
  if (!Number.isFinite(A.valor(mTangente)) || !Number.isFinite(A.valor(y0))) throw new Error('ponto fora do domínio');
  if (normal && (Math.abs(A.valor(mTangente)) < 1e-9 || mTangente.t !== 'n')) throw new Error('normal sem inclinação simples');
  const m = normal ? div(-1, mTangente) : mTangente;
  const b = soma(y0, neg(mul(m, a)));
  const reta = soma(mul(m, X), b);
  const aTex = tex(a);
  const nome = normal ? 'normal' : 'tangente';
  const passos = [
    { tex: `f(${aTex}) = ${texEm(f, aTex)} = ${tex(y0)}`, txt: `<strong>Ponto:</strong> calculamos a ordenada. A reta passa por \\(\\left(${aTex},\\ ${tex(y0)}\\right)\\).` },
    ...r.passos,
    { tex: `f'(${aTex}) = ${texEm(r.df, aTex)} = ${tex(mTangente)}`, txt: `<strong>Inclinação da tangente:</strong> substituímos \\(x = ${aTex}\\) na derivada.` },
  ];
  if (normal) passos.push({ tex: `m_{\\text{normal}} = -\\frac{1}{f'(${aTex})} = ${tex(m)}`, txt: 'A reta normal é perpendicular à tangente: sua inclinação é o oposto do inverso.' });
  passos.push(
    { tex: `${tex(soma(Y, neg(y0)))} = ${ladoDireito(m, a)}`, txt: `<strong>Equação:</strong> reta por \\(\\left(${aTex},\\ ${tex(y0)}\\right)\\) com inclinação \\(${tex(m)}\\), na forma \\(y - y_0 = m(x - x_0)\\).` },
    { tex: `y = ${tex(reta)}`, txt: 'Isolamos \\(y\\).' },
  );
  const erros = [{ expr: texto(soma(mul(mTangente, X), y0)), msg: 'A inclinação está certa, mas a reta precisa passar pelo ponto de tangência: use \\(y - y_0 = m(x - x_0)\\).' }];
  if (normal) {
    erros.push({ expr: texto(soma(mul(mTangente, X), soma(y0, neg(mul(mTangente, a))))), msg: 'Essa é a reta <strong>tangente</strong>. A normal tem inclinação \\(-1/f\'(a)\\).' });
    erros.push({ expr: texto(soma(mul(neg(mTangente), X), soma(y0, mul(mTangente, a)))), msg: 'A inclinação da normal é o oposto <strong>do inverso</strong>: \\(-1/m\\), não \\(-m\\).' });
  }
  return {
    enunciado: `Determine a equação da reta ${nome} ao gráfico de \\(f(x) = ${tex(f)}\\) no ponto de abscissa \\(x = ${aTex}\\).`,
    tipoResposta: 'reta',
    rotulo: '',
    respostaLatex: `y = ${tex(reta)}`,
    respostaExpr: texto(reta),
    dicas: [
      normal ? 'Três passos: ponto \\((a, f(a))\\), inclinação da tangente \\(f\'(a)\\) e, para a normal, inclinação \\(-1/f\'(a)\\).' : 'Três passos: ponto \\((a, f(a))\\), inclinação \\(m = f\'(a)\\) e equação \\(y - f(a) = m(x - a)\\).',
      `O ponto é \\(\\left(${aTex},\\ ${tex(y0)}\\right)\\). Agora derive \\(f\\) para achar a inclinação.`,
    ],
    passos,
    errosComuns: erros,
    conferencia: { tipo: 'reta', f: texto(f), fTex: tex(f), a: A.valor(a), normal },
  };
}

export const tangente = { id: 'tangente', titulo: 'Reta tangente', gerar: (rng, d) => questaoDeReta(rng, d, false) };
export const normal = { id: 'normal', titulo: 'Reta normal', gerar: (rng, d) => questaoDeReta(rng, d, true) };
