// Fundamentos: taxa de variação, derivada pela definição e diferenciabilidade.
import { A, X, num, mul, soma, pot, tex, coef, poli, FUNCOES } from '../base.js';
import { texEm, texPar, comAprox, texNum } from '../formatar.js';

const { div, neg, sub, texto, derivar, subs, valor, sim, expandir, raiz, E } = A;
const H = sim('h');

/** "A - B" em LaTeX, omitindo "- 0". */
const menos = (a, b) => (valor(b) === 0 ? tex(a) : `${tex(a)} - ${texPar(b)}`);
/** Fração em LaTeX que some quando o denominador é 1. */
const fracao = (cima, baixo) => (baixo === '1' ? cima : `\frac{${cima}}{${baixo}}`);

function campoNumero(id, rotulo, r, conferencia, extra = {}) {
  return { id, tipo: 'numero', rotulo, respostaLatex: comAprox(r), respostaExpr: texto(r), conferencia, ...extra };
}

// ---------- Taxa de variação média e instantânea ----------

function taxaMedia(rng, dificuldade) {
  if (dificuldade === 'facil') {
    const f = poli(rng, rng.int(2, 3), { minimo: 2, max: 4 });
    const a = rng.int(-2, 2);
    const b = a + rng.int(1, 3);
    const [fa, fb] = [subs(f, 'x', num(a)), subs(f, 'x', num(b))];
    const r = div(sub(fb, fa), b - a);
    return {
      enunciado: `Calcule a taxa de variação média de \\(f(x) = ${tex(f)}\\) no intervalo \\([${a}, ${b}]\\).`,
      campos: [campoNumero('media', '\\dfrac{\\Delta y}{\\Delta x} =', r, { tipo: 'media', f: texto(f), a, b })],
      dicas: ['Taxa média = variação de \\(y\\) dividida pela variação de \\(x\\): \\(\\dfrac{f(b) - f(a)}{b - a}\\).', `Comece calculando \\(f(${a})\\) e \\(f(${b})\\).`],
      passos: [
        { tex: `f(${a}) = ${texEm(f, String(a))} = ${tex(fa)}`, txt: 'Valor da função no início do intervalo.' },
        { tex: `f(${b}) = ${texEm(f, String(b))} = ${tex(fb)}`, txt: 'Valor da função no fim do intervalo.' },
        { tex: `\\frac{\\Delta y}{\\Delta x} = \\frac{${menos(fb, fa)}}{${b - a}} = ${tex(r)}`, txt: 'Dividimos a variação de \\(y\\) pela variação de \\(x\\). É a inclinação da reta secante pelos dois pontos.' },
      ],
    };
  }
  let f; let a; let b; let nome = 'f'; let variavel = 'x';
  if (dificuldade === 'medio') {
    nome = 's'; variavel = 't';
    const [p, q2, c] = [rng.int(1, 5), rng.int(-4, 6), rng.int(0, 10)];
    f = A.polinomio([p, q2, c]);
    a = rng.int(0, 3);
    b = a + rng.int(1, 3);
  } else {
    const opcoes = [
      () => { const m = rng.int(1, 3); const n = m + rng.int(1, 3); return [raiz(X), m * m, n * n]; },
      () => { const m = rng.int(1, 3); return [div(rng.int(2, 6), X), m, m + rng.int(1, 3)]; },
      () => [FUNCOES.exp(X), 0, 1],
      () => [FUNCOES.ln(X), 1, E],
      () => { const m = rng.int(1, 3); return [pot(X, 3), -m, m + 1]; },
    ];
    [f, a, b] = rng.escolha(opcoes)();
  }
  const [na, nb] = [typeof a === 'number' ? num(a) : a, typeof b === 'number' ? num(b) : b];
  const [fa, fb] = [subs(f, 'x', na), subs(f, 'x', nb)];
  const media = div(sub(fb, fa), sub(nb, na));
  const df = derivar(f);
  const inst = subs(df, 'x', nb);
  const fT = (e) => tex(subs(e, 'x', sim(variavel)));
  const rotuloMedia = dificuldade === 'medio' ? 'v_m =' : '\\dfrac{\\Delta y}{\\Delta x} =';
  const rotuloInst = dificuldade === 'medio' ? `v(${tex(nb)}) =` : `f'(${tex(nb)}) =`;
  const enunciado = dificuldade === 'medio'
    ? `A posição de uma partícula é \\(s(t) = ${fT(f)}\\) (em metros, com \\(t\\) em segundos). Calcule a velocidade média entre \\(t = ${tex(na)}\\) e \\(t = ${tex(nb)}\\) e a velocidade instantânea em \\(t = ${tex(nb)}\\).`
    : `Para \\(f(x) = ${tex(f)}\\), calcule a taxa de variação média no intervalo \\(\\left[${tex(na)}, ${tex(nb)}\\right]\\) e a taxa de variação instantânea em \\(x = ${tex(nb)}\\).`;
  return {
    enunciado,
    campos: [
      campoNumero('media', rotuloMedia, media, { tipo: 'media', f: texto(f), a: valor(na), b: valor(nb) }, { unidade: dificuldade === 'medio' ? 'm/s' : undefined }),
      campoNumero('instantanea', rotuloInst, inst, { tipo: 'ponto', f: texto(f), a: valor(nb) }, { unidade: dificuldade === 'medio' ? 'm/s' : undefined }),
    ],
    dicas: [
      'A taxa média usa dois pontos: \\(\\dfrac{f(b) - f(a)}{b - a}\\). A instantânea é a derivada no ponto.',
      `Derivada: \\(${nome}'(${variavel}) = ${fT(df)}\\).`,
    ],
    passos: [
      { tex: `${nome}(${tex(na)}) = ${tex(fa)} \\qquad ${nome}(${tex(nb)}) = ${tex(fb)}`, txt: 'Valores nos extremos do intervalo.' },
      { tex: `${rotuloMedia.replace(' =', '')} = \\frac{${menos(fb, fa)}}{${menos(nb, na)}} = ${comAprox(media)}`, txt: 'Taxa de variação média: inclinação da secante.' },
      { tex: `${nome}'(${variavel}) = ${fT(df)}`, txt: 'A taxa instantânea é a derivada. Derivamos pelas regras já conhecidas.' },
      { tex: `${rotuloInst.replace(' =', '')} = ${comAprox(inst)}`, txt: `Calculamos a derivada em \\(${variavel} = ${tex(nb)}\\): é a inclinação da tangente nesse ponto.` },
    ],
  };
}

// ---------- Derivada pela definição ----------

function passosPolinomio(f) {
  const fxh = subs(f, 'x', soma(X, H));
  const exp = expandir(fxh);
  const dif = expandir(sub(fxh, f));
  const quoc = expandir(mul(dif, pot(H, -1)));
  const lim = subs(quoc, 'h', num(0));
  return {
    df: lim,
    passos: [
      { tex: `f(x + h) = ${tex(fxh)} = ${tex(exp)}`, txt: 'Trocamos cada \\(x\\) por \\((x + h)\\) e expandimos.' },
      { tex: `f(x + h) - f(x) = ${tex(dif)}`, txt: 'Subtraímos \\(f(x)\\): os termos sem \\(h\\) se cancelam.' },
      { tex: `\\frac{f(x + h) - f(x)}{h} = ${tex(quoc)}`, txt: 'Dividimos por \\(h\\): todo termo tinha pelo menos um fator \\(h\\).' },
      { tex: `f'(x) = \\lim_{h \\to 0} \\left(${tex(quoc)}\\right) = ${tex(lim)}`, txt: 'Fazemos \\(h \\to 0\\): os termos que ainda têm \\(h\\) desaparecem.' },
    ],
  };
}

function definicao(rng, dificuldade) {
  let f;
  let passos;
  if (dificuldade === 'facil' || (dificuldade === 'medio' && rng.chance(0.4))) {
    f = dificuldade === 'facil' ? poli(rng, 2, { minimo: 2, max: 4 }) : soma(mul(rng.escolha([1, 2, -1]), pot(X, 3)), mul(coef(rng, 3), X));
    passos = passosPolinomio(f).passos;
  } else if (dificuldade === 'medio') {
    const k = rng.int(2, 6);
    const b = rng.int(0, 4);
    const w = soma(X, b);
    const u = soma(X, H, b);
    f = div(k, w);
    const df = derivar(f);
    passos = [
      { tex: `f(x + h) - f(x) = ${tex(div(k, u))} - ${tex(div(k, w))}`, txt: 'Montamos a diferença, trocando \\(x\\) por \\((x + h)\\).' },
      { tex: `f(x + h) - f(x) = \\frac{${tex(mul(k, w))} - ${tex(mul(k, u))}}{${tex(mul(u, w))}} = ${tex(div(mul(-k, H), mul(u, w)))}`, txt: 'Reduzimos ao mesmo denominador; no numerador, quase tudo se cancela.' },
      { tex: `\\frac{f(x + h) - f(x)}{h} = ${tex(div(-k, mul(u, w)))}`, txt: 'Dividimos por \\(h\\), cancelando o fator \\(h\\) do numerador.' },
      { tex: `f'(x) = \\lim_{h \\to 0} ${tex(div(-k, mul(u, w)))} = ${tex(df)}`, txt: `Com \\(h \\to 0\\), \\(${tex(u)}\\) tende a \\(${tex(w)}\\).` },
    ];
  } else if (rng.chance(0.5)) {
    const a = rng.int(1, 4);
    const b = rng.int(0, 5);
    const dentro = soma(mul(a, X), b);
    const dentroH = soma(mul(a, soma(X, H)), b);
    f = raiz(dentro);
    const soma2 = `\\sqrt{${tex(dentroH)}} + \\sqrt{${tex(dentro)}}`;
    passos = [
      { tex: `\\frac{f(x + h) - f(x)}{h} = \\frac{\\sqrt{${tex(dentroH)}} - \\sqrt{${tex(dentro)}}}{h}`, txt: 'Quociente de Newton. Com raízes, não dá para simplificar direto.' },
      { tex: `\\frac{f(x + h) - f(x)}{h} = \\frac{\\left(${tex(dentroH)}\\right) - \\left(${tex(dentro)}\\right)}{h\\left(${soma2}\\right)} = \\frac{${tex(mul(a, H))}}{h\\left(${soma2}\\right)}`, txt: 'Multiplicamos em cima e embaixo pelo <strong>conjugado</strong> \\(\\sqrt{A} + \\sqrt{B}\\); no numerador, \\((\\sqrt{A} - \\sqrt{B})(\\sqrt{A} + \\sqrt{B}) = A - B\\).' },
      { tex: `\\frac{f(x + h) - f(x)}{h} = \\frac{${a}}{${soma2}}`, txt: 'Cancelamos o \\(h\\).' },
      { tex: `f'(x) = \\lim_{h \\to 0} \\frac{${a}}{${soma2}} = ${tex(derivar(f))}`, txt: `Com \\(h \\to 0\\), o denominador tende a \\(2\\sqrt{${tex(dentro)}}\\).` },
    ];
  } else {
    const k = rng.int(1, 5);
    f = div(k, pot(X, 2));
    const xh = soma(X, H);
    const den = mul(pot(X, 2), pot(xh, 2));
    passos = [
      { tex: `f(x + h) - f(x) = ${tex(div(k, pot(xh, 2)))} - ${tex(f)} = ${tex(div(mul(k, sub(pot(X, 2), pot(xh, 2))), den))}`, txt: 'Reduzimos ao mesmo denominador.' },
      { tex: `f(x + h) - f(x) = ${tex(div(mul(k, expandir(sub(pot(X, 2), pot(xh, 2)))), den))}`, txt: 'Expandimos \\((x + h)^2 = x^2 + 2xh + h^2\\): o \\(x^2\\) se cancela.' },
      { tex: `\\frac{f(x + h) - f(x)}{h} = ${tex(div(mul(-k, soma(mul(2, X), H)), den))}`, txt: 'Colocamos \\(h\\) em evidência no numerador e cancelamos com o denominador.' },
      { tex: `f'(x) = \\lim_{h \\to 0} ${tex(div(mul(-k, soma(mul(2, X), H)), den))} = ${tex(derivar(f))}`, txt: `Com \\(h \\to 0\\), o numerador tende a \\(${tex(mul(-2 * k, X))}\\) e o denominador a \\(x^4\\); simplificando, sobra uma potência de \\(x\\) no denominador.` },
    ];
  }
  const df = derivar(f);
  return {
    enunciado: `Use a <strong>definição</strong> de derivada, \\(f'(x) = \\displaystyle\\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}\\), para calcular \\(f'(x)\\), sendo \\(f(x) = ${tex(f)}\\).`,
    tipoResposta: 'expressao',
    rotulo: "f'(x) =",
    respostaLatex: tex(df),
    respostaExpr: texto(df),
    variaveis: ['x'],
    dominio: dificuldade === 'dificil' ? [0.4, 4] : [-3, 3],
    dicas: ['Siga o roteiro: calcule \\(f(x + h)\\), subtraia \\(f(x)\\), divida por \\(h\\) e faça \\(h \\to 0\\).', `Primeiro passo: \\(${passos[0].tex}\\).`],
    passos,
    errosComuns: [{ expr: texto(f), msg: 'Essa é a própria função. Você precisa calcular o limite do quociente de Newton.' }],
    conferencia: { tipo: 'derivada', f: texto(f), var: 'x' },
  };
}

// ---------- Diferenciabilidade ----------

function diferenciabilidade(rng, dificuldade) {
  if (dificuldade === 'facil') {
    const c = rng.int(-1, 2);
    const p1 = poli(rng, 2, { minimo: 2, max: 3 });
    const v = subs(p1, 'x', num(c));
    const s = subs(derivar(p1), 'x', num(c));
    const derivavel = rng.chance(0.5);
    const m = derivavel ? s : soma(s, rng.naoNulo(-3, 3));
    const p2 = expandir(soma(mul(m, soma(X, -c)), v));
    const [l1, l2] = [subs(derivar(p1), 'x', num(c)), subs(derivar(p2), 'x', num(c))];
    return {
      enunciado: `Considere \\(f(x) = \\begin{cases} ${tex(p1)} & \\text{se } x \\le ${c} \\\\ ${tex(p2)} & \\text{se } x > ${c} \\end{cases}\\). Calcule as derivadas laterais em \\(x = ${c}\\) e decida se \\(f\\) é derivável nesse ponto.`,
      campos: [
        campoNumero('esquerda', `f'_-(${c}) =`, l1, { tipo: 'ponto', f: texto(p1), a: c }),
        campoNumero('direita', `f'_+(${c}) =`, l2, { tipo: 'ponto', f: texto(p2), a: c }),
        { id: 'derivavel', tipo: 'escolha', rotulo: `f\\ \\text{é derivável em}\\ x = ${c}\\text{?}`, opcoes: ['Sim', 'Não'], correta: derivavel ? 0 : 1, respostaLatex: derivavel ? '\\text{Sim}' : '\\text{Não}', respostaExpr: derivavel ? 'Sim' : 'Não', conferencia: { tipo: 'derivavel', f1: texto(p1), f2: texto(p2), a: c } },
      ],
      dicas: ['Cada lado tem sua fórmula: derive cada ramo e calcule a derivada em \\(x = ' + c + '\\). Confira também a continuidade.', `\\(f\\) é derivável em \\(${c}\\) se for contínua ali e as derivadas laterais forem iguais.`],
      passos: [
        { tex: `\\lim_{x \\to ${c}^-} f(x) = ${tex(v)} \\qquad \\lim_{x \\to ${c}^+} f(x) = ${tex(subs(p2, 'x', num(c)))}`, txt: 'Os dois ramos chegam ao mesmo valor: \\(f\\) é contínua no ponto, então faz sentido comparar as inclinações.' },
        { tex: `f'_-(${c}) = \\left(${tex(derivar(p1))}\\right)\\Big|_{x = ${c}} = ${tex(l1)}`, txt: 'Derivada pela esquerda: usamos o ramo de \\(x \\le ' + c + '\\).' },
        { tex: `f'_+(${c}) = ${tex(l2)}`, txt: 'Derivada pela direita: o ramo de \\(x > ' + c + '\\) é uma reta, cuja derivada é a inclinação.' },
        { tex: derivavel ? `f'_-(${c}) = f'_+(${c}) = ${tex(l1)}` : `f'_-(${c}) \\neq f'_+(${c})`, txt: derivavel ? 'Derivadas laterais iguais: \\(f\\) é derivável em \\(x = ' + c + '\\) (a reta é tangente à parábola, a emenda é suave).' : 'Derivadas laterais diferentes: o gráfico tem um <strong>bico</strong> e \\(f\\) não é derivável em \\(x = ' + c + '\\).' },
      ],
    };
  }
  let g; let c;
  if (dificuldade === 'medio') {
    g = poli(rng, 2, { minimo: 2, max: 3 });
    c = rng.int(-1, 2);
  } else {
    const k = rng.escolha([2, 3, -1, -2]);
    [g, c] = rng.escolha([
      () => [pot(X, 3), rng.escolha([1, 2, -1])],
      () => [FUNCOES.exp(mul(k, X)), 0],
      () => [FUNCOES.sen(mul(Math.abs(k), X)), 0],
      () => [FUNCOES.ln(X), 1],
      () => { const m = rng.int(1, 3); return [raiz(X), m * m]; },
      () => [soma(1, mul(k, FUNCOES.cos(X))), 0],
    ])();
  }
  const a = subs(derivar(g), 'x', num(c));
  const gc = subs(g, 'x', num(c));
  const b = soma(gc, neg(mul(a, c)));
  const cT = texNum(c);
  return {
    enunciado: `Determine as constantes \\(a\\) e \\(b\\) para que \\(f(x) = \\begin{cases} ${tex(g)} & \\text{se } x \\le ${cT} \\\\ ax + b & \\text{se } x > ${cT} \\end{cases}\\) seja derivável em \\(x = ${cT}\\).`,
    campos: [
      campoNumero('a', 'a =', a, { tipo: 'ponto', f: texto(g), a: c }),
      campoNumero('b', 'b =', b, { tipo: 'reta-b', f: texto(g), a: c }),
    ],
    dicas: ['Duas condições: <strong>continuidade</strong> em \\(x = ' + cT + '\\) (os ramos têm o mesmo valor) e derivadas laterais iguais (mesma inclinação).', `A inclinação do ramo da direita é \\(a\\); a do ramo da esquerda em \\(x = ${cT}\\) é \\(g'(${cT})\\), com \\(g(x) = ${tex(g)}\\).`],
    passos: [
      { tex: `a = \\left(${tex(derivar(g))}\\right)\\Big|_{x = ${cT}} = ${tex(a)}`, txt: 'Derivadas laterais iguais: a inclinação da reta \\(ax + b\\) deve ser a derivada do ramo da esquerda no ponto.' },
      { tex: `${tex(soma(mul(a, c), sim('b')))} = ${tex(gc)}`, txt: 'Continuidade: o valor da reta em \\(x = ' + cT + '\\) deve ser igual ao valor do outro ramo.' },
      { tex: `b = ${tex(b)}`, txt: 'Isolamos \\(b\\). A reta \\(y = ax + b\\) obtida é exatamente a <strong>reta tangente</strong> ao primeiro ramo em \\(x = ' + cT + '\\).' },
    ],
  };
}

export const taxaMediaModelo = { id: 'taxa-media', titulo: 'Taxa de variação', gerar: taxaMedia };
export const definicaoModelo = { id: 'definicao', titulo: 'Derivada pela definição', gerar: definicao };
export const diferenciabilidadeModelo = { id: 'diferenciabilidade', titulo: 'Diferenciabilidade', gerar: diferenciabilidade };
export { taxaMediaModelo as taxaMedia, definicaoModelo as definicao, diferenciabilidadeModelo as diferenciabilidade };
