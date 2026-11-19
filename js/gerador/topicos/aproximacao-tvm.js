// Aproximação linear / diferenciais e Teorema do Valor Médio.
import { A, X, num, mul, soma, pot, tex, poli, FUNCOES } from '../base.js';
import { texEm, texPar, comAprox } from '../formatar.js';
import { campoConjunto } from './criticos.js';

const { div, neg, sub, texto, derivar, subs, valor, sim, raiz, PI, E } = A;

const racional = (v) => num(Math.round(v * 1000), 1000);
/** Racional com decimal finito em LaTeX decimal (2{,}025); senão, forma exata com aproximação. */
const texDec = (r) => {
  const v = valor(r);
  return r.t === 'n' && Math.abs(v * 1e6 - Math.round(v * 1e6)) < 1e-6 ? String(Number(v.toFixed(6))).replace('.', '{,}') : comAprox(r);
};
const textoDec = (v) => String(Number(v.toFixed(6))).replace('.', ',');
const menos = (a, b) => (valor(b) === 0 ? tex(a) : `${tex(a)} - ${texPar(b)}`);

/** √n simplificada: √12 = 2√3. */
function raizInteira(n) {
  let fora = 1;
  let dentro = n;
  for (let k = 2; k * k <= dentro; k++) {
    while (dentro % (k * k) === 0) { dentro /= k * k; fora *= k; }
  }
  return mul(fora, raiz(num(dentro)));
}
/** √(n/d) racionalizada: √(n·d)/d. */
const raizRacional = (n, d) => mul(num(1, d), raizInteira(n * d));

// ---------- Aproximação linear e diferenciais ----------

function linear(rng, dificuldade) {
  if (dificuldade === 'dificil') {
    const forma = rng.escolha([
      { nome: 'cubo', f: pot(X, 3), grandeza: 'o volume de um cubo', medida: 'a aresta', simbolo: 'V', unidade: ['cm³', 'cm'], formula: 'V = x^{3}' },
      { nome: 'esfera', f: mul(num(4, 3), PI, pot(X, 3)), grandeza: 'o volume de uma esfera', medida: 'o raio', simbolo: 'V', unidade: ['cm³', 'cm'], formula: 'V = \\frac{4}{3}\\pi x^{3}' },
      { nome: 'circulo', f: mul(PI, pot(X, 2)), grandeza: 'a área de um círculo', medida: 'o raio', simbolo: 'A', unidade: ['cm²', 'cm'], formula: 'A = \\pi x^{2}' },
      { nome: 'quadrado', f: pot(X, 2), grandeza: 'a área de um quadrado', medida: 'o lado', simbolo: 'A', unidade: ['cm²', 'cm'], formula: 'A = x^{2}' },
    ]);
    const x0 = rng.escolha([5, 10, 20, 30]);
    const dx = rng.escolha([0.05, 0.1, 0.2, 0.5]);
    const dxR = racional(dx);
    const df = derivar(forma.f);
    const d = mul(subs(df, 'x', num(x0)), dxR);
    const rel = div(d, subs(forma.f, 'x', num(x0)));
    const S = forma.simbolo;
    const conf = { f: texto(forma.f), x0, dx };
    return {
      enunciado: `Mediu-se ${forma.medida} de uma figura obtendo ${x0} cm, com erro máximo de ${textoDec(dx)} cm. Use diferenciais para estimar o erro máximo em ${forma.grandeza} calculado e o erro relativo correspondente.`,
      campos: [
        { id: 'erro', tipo: 'numero', rotulo: `d${S} =`, unidade: forma.unidade[0], respostaLatex: texDec(d), respostaExpr: texto(d), conferencia: { tipo: 'diferencial', ...conf } },
        { id: 'relativo', tipo: 'numero', rotulo: `\\dfrac{d${S}}{${S}} =`, respostaLatex: texDec(rel), respostaExpr: texto(rel), conferencia: { tipo: 'diferencial-relativo', ...conf } },
      ],
      dicas: [`A diferencial é \\(d${S} = ${S}'(x)\\,dx\\). O erro relativo é \\(\\dfrac{d${S}}{${S}}\\) (pode ser dado em decimal ou com %).`, `\\(${forma.formula}\\), então \\(d${S} = ${tex(df)}\\,dx\\).`],
      passos: [
        { tex: `${forma.formula} \\;\\Rightarrow\\; d${S} = ${tex(df)}\\,dx`, txt: 'Diferencial: derivada vezes a variação (aqui, o erro) da medida.' },
        { tex: `d${S} = ${texEm(df, String(x0))} \\cdot ${String(dx).replace('.', '{,}')} = ${texDec(d)}`, txt: `Substituímos \\(x = ${x0}\\) e \\(dx = ${String(dx).replace('.', '{,}')}\\).` },
        { tex: `\\frac{d${S}}{${S}} = ${texDec(rel)}`, txt: `Dividimos pelo valor calculado, \\(${S}(${x0}) = ${tex(subs(forma.f, 'x', num(x0)))}\\). Isso corresponde a ${textoDec(valor(rel) * 100)}% de erro.` },
      ],
    };
  }
  let f; let a; let dx; let m; let fp; let nomeF;
  if (dificuldade === 'facil') {
    m = rng.escolha([2, 4, 5, 10]);
    a = m * m;
    dx = rng.escolha([0.1, 0.2, 0.3, 0.5, -0.1, -0.2, -0.3]);
    f = raiz(X);
    nomeF = '\\sqrt{x}';
  } else if (rng.chance(0.5)) {
    [m, dx] = rng.escolha([[2, 0.12], [2, 0.24], [2, -0.12], [2, 0.36], [3, 0.27], [3, 0.54], [3, -0.27], [10, 3], [10, -3], [10, 6]]);
    a = m ** 3;
    f = pot(X, A.q(1, 3));
    nomeF = '\\sqrt[3]{x}';
  } else {
    const n = rng.escolha([3, 4, 5, 6, 10]);
    a = 1;
    m = 1;
    dx = rng.escolha([0.01, 0.02, 0.03, -0.01, -0.02]);
    f = pot(X, n);
    nomeF = `x^{${n}}`;
  }
  fp = subs(derivar(f), 'x', num(a));
  const dxR = racional(dx);
  const x = soma(num(a), dxR);
  const L = soma(num(m), mul(fp, dxR));
  const xTex = texDec(x);
  const alvo = dificuldade === 'facil' ? `\\sqrt{${xTex}}` : nomeF.includes('sqrt') ? `\\sqrt[3]{${xTex}}` : `(${xTex})^{${nomeF.match(/\{(\d+)\}/)[1]}}`;
  return {
    enunciado: `Use a aproximação linear (reta tangente) de \\(f(x) = ${nomeF}\\) em \\(a = ${a}\\) para estimar \\(${alvo}\\).`,
    tipoResposta: 'numero',
    rotulo: `${alvo} \\approx`,
    respostaLatex: texDec(L),
    respostaExpr: texto(L),
    tolerancia: 1e-9,
    dicas: ['Use \\(L(x) = f(a) + f\'(a)(x - a)\\) e calcule \\(L\\) no valor pedido (não use a calculadora para a raiz/potência).', `\\(f(${a}) = ${m}\\) e \\(f'(${a}) = ${tex(fp)}\\).`],
    passos: [
      { tex: `f(${a}) = ${m} \\qquad f'(x) = ${tex(derivar(f))} \\;\\Rightarrow\\; f'(${a}) = ${tex(fp)}`, txt: `Valor e inclinação no ponto \\(a = ${a}\\), escolhido perto de \\(${xTex}\\) e com valor fácil de calcular.` },
      { tex: `L(x) = ${m} + ${tex(fp)}(x - ${a})`, txt: 'Linearização: a reta tangente ao gráfico em \\(x = ' + a + '\\).' },
      { tex: `${alvo} \\approx L(${xTex}) = ${m} + ${tex(fp)} \\cdot ${dx < 0 ? `(${String(dx).replace('.', '{,}')})` : String(dx).replace('.', '{,}')} = ${texDec(L)}`, txt: `Calculamos a reta em \\(x = ${xTex}\\) (\\(\\Delta x = ${String(dx).replace('.', '{,}')}\\)). O valor real difere muito pouco, porque \\(x\\) está perto de \\(a\\).` },
    ],
    errosComuns: [{ expr: `(${texto(x)})${nomeF.includes('sqrt[3]') ? '^(1/3)' : nomeF.includes('sqrt') ? '^(1/2)' : `^${nomeF.match(/\{(\d+)\}/)[1]}`}`, msg: 'Esse é o valor exato (da calculadora). O exercício pede a <strong>estimativa pela reta tangente</strong>, \\(L(x)\\).' }],
    conferencia: { tipo: 'linear', f: texto(f), a, x: valor(x) },
  };
}

// ---------- Teorema do Valor Médio ----------

function tvm(rng, dificuldade) {
  let f; let a; let b; let cs; let resolucao;
  if (dificuldade === 'facil') {
    f = poli(rng, 2, { minimo: 2, max: 4 });
    a = rng.int(-2, 2);
    b = a + rng.escolha([2, 3, 4]);
    cs = [num(a + b, 2)];
  } else if (dificuldade === 'medio') {
    const opcao = rng.int(0, 2);
    if (opcao === 0) {
      a = rng.int(0, 2);
      b = a + rng.int(1, 3);
      f = soma(pot(X, 3), mul(rng.int(-3, 3), X));
      cs = [raizRacional(a * a + a * b + b * b, 3)];
    } else if (opcao === 1) {
      const [p, q2] = [rng.int(1, 2), rng.int(3, 4)];
      a = p * p; b = q2 * q2;
      f = raiz(X);
      cs = [num((p + q2) ** 2, 4)];
    } else {
      const [p, q2] = rng.escolha([[1, 4], [1, 9], [2, 8], [1, 16], [4, 9], [2, 18]]);
      a = p; b = q2;
      f = div(rng.int(1, 3), X);
      cs = [num(Math.sqrt(p * q2))];
    }
  } else {
    const opcao = rng.int(0, 2);
    if (opcao === 0) {
      const k = rng.int(1, 4);
      a = -rng.int(1, 3); b = -a;
      f = soma(pot(X, 3), mul(-k, X));
      const c = raizRacional(b * b, 3);
      cs = [neg(c), c];
    } else if (opcao === 1) {
      f = FUNCOES.ln(X); a = 1; b = E;
      cs = [soma(E, -1)];
    } else {
      f = FUNCOES.exp(X); a = 0; b = 1;
      cs = [FUNCOES.ln(soma(E, -1))];
    }
  }
  const [na, nb] = [typeof a === 'number' ? num(a) : a, typeof b === 'number' ? num(b) : b];
  const [fa, fb] = [subs(f, 'x', na), subs(f, 'x', nb)];
  const media = div(sub(fb, fa), sub(nb, na));
  const df = derivar(f);
  const C = sim('c');
  resolucao = `${tex(subs(df, 'x', C))} = ${tex(media)} \\;\\Rightarrow\\; ${cs.map((c) => `c = ${tex(c)}`).join(' \\ \\text{ ou } \\ ')}`;
  const intervalo = `\\left[${tex(na)}, ${tex(nb)}\\right]`;
  return {
    enunciado: `Verifique que \\(f(x) = ${tex(f)}\\) satisfaz as hipóteses do Teorema do Valor Médio em \\(${intervalo}\\) e encontre ${cs.length > 1 ? 'todos os valores' : 'o valor'} de \\(c\\) garantido(s) pelo teorema.`,
    campos: [{ ...campoConjunto('c', 'c =', cs), conferencia: { tipo: 'tvm', f: texto(f), a: valor(na), b: valor(nb) } }],
    dicas: ['O TVM garante \\(c\\) em \\((a, b)\\) com \\(f\'(c) = \\dfrac{f(b) - f(a)}{b - a}\\). Calcule a taxa média e resolva.', `A taxa média no intervalo é \\(${tex(media)}\\) e \\(f'(x) = ${tex(df)}\\).`],
    passos: [
      { tex: `f(${tex(na)}) = ${tex(fa)} \\qquad f(${tex(nb)}) = ${tex(fb)}`, txt: `\\(f\\) é contínua em \\(${intervalo}\\) e derivável no intervalo aberto${f.t === 'f' || (f.t === '*' && f.f.some((x) => x.e.n < 0)) ? ' (o ponto problemático, \\(x = 0\\), está fora do intervalo)' : ''}: as hipóteses valem. Calculamos os valores nos extremos.` },
      { tex: `\\frac{f(${tex(nb)}) - f(${tex(na)})}{${menos(nb, na)}} = ${tex(media)}`, txt: 'Taxa de variação média: inclinação da secante.' },
      { tex: `f'(x) = ${tex(df)}`, txt: 'Derivamos \\(f\\).' },
      { tex: resolucao, txt: `Igualamos \\(f'(c)\\) à taxa média e resolvemos. ${cs.length > 1 ? 'As duas soluções estão' : 'A solução está'} dentro de \\((${tex(na)}, ${tex(nb)})\\)${dificuldade === 'medio' && cs.length === 1 && f.t !== 'f' ? '; outras raízes, se houver, ficam fora do intervalo e são descartadas' : ''}.` },
    ],
  };
}

export const linearModelo = { id: 'aproximacao-linear', titulo: 'Aproximação linear e diferenciais', gerar: linear };
export const tvmModelo = { id: 'tvm', titulo: 'Teorema do Valor Médio', gerar: tvm };
export { linearModelo as linear, tvmModelo as tvm };
