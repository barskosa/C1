// Explicadores das regras de derivação.
//
// Cada modelo de questão escolhe a estrutura da função (produto, quociente,
// composição ...) e chama `resolverDerivada`, que reconhece a regra aplicada em
// cada nível e escreve os passos como um professor faria: identifica u e v,
// deriva cada parte dizendo qual regra usou, substitui na fórmula e simplifica.
// Não há CAS genérico aqui: cada função abaixo explica UMA regra.

import * as A from './expr.js';
import { tex, texPar, texVezes, texSoma } from './formatar.js';

const { X, num, mul, soma, sub, pot, div, derivar, depende, texto } = A;

const NOME_FN = {
  sin: 'do seno', cos: 'do cosseno', tan: 'da tangente', sec: 'da secante', csc: 'da cossecante', cot: 'da cotangente',
  ln: 'do logaritmo natural', log: 'do logaritmo', asin: 'do arco seno', acos: 'do arco cosseno', atan: 'do arco tangente',
};
const FORMULA_FN = {
  sin: String.raw`(\sen x)' = \cos x`, cos: String.raw`(\cos x)' = -\sen x`, tan: String.raw`(\tg x)' = \sec^2 x`,
  sec: String.raw`(\sec x)' = \sec x \,\tg x`, csc: String.raw`(\cossec x)' = -\cossec x \,\cotg x`, cot: String.raw`(\cotg x)' = -\cossec^2 x`,
  ln: String.raw`(\ln x)' = \dfrac{1}{x}`, log: String.raw`(\log_a x)' = \dfrac{1}{x \ln a}`,
  asin: String.raw`(\arcsen x)' = \dfrac{1}{\sqrt{1 - x^2}}`, acos: String.raw`(\arccos x)' = -\dfrac{1}{\sqrt{1 - x^2}}`, atan: String.raw`(\arctg x)' = \dfrac{1}{1 + x^2}`,
};

const ehVar = (e, v) => e.t === 's' && e.v === v;
const um = (ex) => ex.n === 1 && ex.d === 1;

/** Separa a constante multiplicativa da parte que depende de v. */
function separar(e, v) {
  if (e.t !== '*') return { k: num(1), lit: e };
  const fixos = e.f.filter((f) => !depende(f.b, v));
  const variaveis = e.f.filter((f) => depende(f.b, v));
  return {
    k: mul({ t: 'n', ...e.c }, ...fixos.map((f) => pot(f.b, f.e))),
    lit: mul(...variaveis.map((f) => pot(f.b, f.e))),
  };
}

/** c·x^r (ou constante)? */
function ehMonomio(e, v) {
  if (!depende(e, v)) return true;
  if (ehVar(e, v)) return true;
  return e.t === '*' && e.f.every((f) => !depende(f.b, v) || ehVar(f.b, v));
}

/** Regra principal que se aplica à expressão. */
export function classificar(e, v = 'x') {
  if (!depende(e, v)) return 'constante';
  if (ehMonomio(e, v) || (e.t === '+' && e.a.every((t) => ehMonomio(t, v)))) return 'potencias';
  if (e.t === '+') return 'soma';
  const { k, lit } = separar(e, v);
  if (!A.ehUm(k)) return 'multiplo';
  if (lit.t === 'f') return ehVar(lit.a, v) ? 'elementar' : 'cadeia';
  if (lit.t === '^') {
    if (!depende(lit.b, v)) return ehVar(lit.e, v) ? 'elementar' : 'cadeia';
    return depende(lit.e, v) ? 'logaritmica' : 'cadeia';
  }
  const positivos = lit.f.filter((f) => f.e.n > 0);
  const negativos = lit.f.filter((f) => f.e.n < 0);
  if (negativos.length && positivos.length) return 'quociente';
  if (lit.f.length === 1) return 'cadeia';
  return negativos.length ? 'cadeia' : 'produto';
}

const NOME_REGRA = {
  constante: 'derivada de constante', potencias: 'regra da potência', soma: 'regra da soma (termo a termo)', multiplo: 'regra do múltiplo constante',
  produto: 'regra do produto', quociente: 'regra do quociente', cadeia: 'regra da cadeia', logaritmica: 'derivação logarítmica',
};

/** Frase curta dizendo por que regra uma parte é derivada. */
function motivo(e, v) {
  const c = classificar(e, v);
  if (c === 'elementar') {
    const { lit } = separar(e, v);
    return lit.t === 'f' ? `derivada ${NOME_FN[lit.n]}` : 'derivada da exponencial';
  }
  if (c === 'multiplo') return motivo(separar(e, v).lit, v);
  return NOME_REGRA[c];
}

/** Tira uma camada de uma composição: e = F(g). */
function descascar(e, v) {
  if (e.t === 'f' && !ehVar(e.a, v)) return { F: (u) => A.fn(e.n, u, e.base), g: e.a };
  if (e.t === '^' && !depende(e.b, v) && !ehVar(e.e, v)) return { F: (u) => pot(e.b, u), g: e.e };
  if (e.t === '*' && um(e.c) && e.f.length === 1 && !um(e.f[0].e) && !ehVar(e.f[0].b, v)) {
    const { b, e: ex } = e.f[0];
    return { F: (u) => pot(u, ex), g: b };
  }
  return null;
}

/** Fatores (derivada de cada camada, de fora para dentro) de uma composição. */
function fatoresDaCadeia(e, v) {
  const fatores = [];
  const camadas = [];
  let atual = e;
  for (let camada = descascar(atual, v); camada; camada = descascar(atual, v)) {
    const U = A.sim('u');
    fatores.push(A.subs(derivar(camada.F(U), 'u'), 'u', camada.g));
    camadas.push(camada);
    atual = camada.g;
  }
  fatores.push(derivar(atual, v));
  return { fatores, camadas, dentro: atual };
}

function fatoresDoProduto(e, v) {
  const [primeiro, ...resto] = e.f;
  return [pot(primeiro.b, primeiro.e), mul(...resto.map((f) => pot(f.b, f.e)))];
}

/** Linha "crua" (antes de simplificar) da regra aplicada a uma parte. */
function linhaCrua(e, v) {
  const c = classificar(e, v);
  if (c === 'produto') {
    const [u, w] = fatoresDoProduto(e, v);
    return texSoma([texVezes(derivar(u, v), w), texVezes(u, derivar(w, v))]);
  }
  if (c === 'quociente') {
    const { cima, baixo } = A.fracao(e);
    return String.raw`\frac{${texVezes(derivar(cima, v), baixo)} - ${texVezes(cima, derivar(baixo, v))}}{${tex(pot(baixo, 2))}}`;
  }
  if (c === 'cadeia') return texVezes(...fatoresDaCadeia(e, v).fatores);
  if (c === 'multiplo') {
    const { k, lit } = separar(e, v);
    const dentro = linhaCrua(lit, v);
    return dentro ? `${texPar(k)} \\cdot \\left[${dentro}\\right]` : null;
  }
  return null;
}

/** Passo(s) explicando a derivada de uma parte nomeada (u, v ...). */
function passoDaParte(nome, e, v) {
  const d = derivar(e, v);
  const crua = linhaCrua(e, v);
  const porque = motivo(e, v);
  const final = tex(d);
  return {
    tex: crua && crua !== final ? `${nome}' = ${crua} = ${final}` : `${nome}' = ${final}`,
    txt: `Derivamos \\(${nome} = ${tex(e)}\\) pela ${porque}${classificar(e, v) === 'cadeia' ? ' (derivada de fora vezes derivada de dentro)' : ''}.`,
    simples: !crua,
    porque,
  };
}

const passo = (t, txt) => ({ tex: t, txt });

/**
 * Deriva `f` explicando passo a passo.
 * @returns {{df, passos, dicas, regra, erros}} df = derivada simplificada; erros = respostas erradas típicas
 */
export function resolverDerivada(f, opcoes = {}) {
  const v = opcoes.v ?? 'x';
  const nome = opcoes.nome ?? 'f';
  const rot = opcoes.rotulo ?? `${nome}'(${v})`;
  const fx = opcoes.rotuloF ?? `${nome}(${v})`;
  const regra = classificar(f, v);
  const passos = [];
  const erros = [];
  let df = derivar(f, v);
  let dicas;
  const fim = (crua, txt = 'Simplificamos.') => {
    const final = tex(df);
    if (crua !== final) passos.push(passo(`${rot} = ${final}`, txt));
  };

  if (regra === 'constante') {
    passos.push(passo(`${rot} = 0`, 'A derivada de uma constante é zero.'));
    dicas = ['A função não depende da variável.', 'A derivada de uma constante é zero.'];
  } else if (regra === 'potencias') {
    const termos = f.t === '+' ? f.a : [f];
    const dados = termos.map((t) => {
      if (!depende(t, v)) return { k: t, ex: A.q(0), t };
      const { k, lit } = separar(t, v);
      return { k, ex: ehVar(lit, v) ? A.q(1) : lit.f[0].e, t };
    });
    const estranho = dados.some(({ ex }) => ex.d !== 1 || ex.n < 0);
    const texPot = ({ k, ex }) => (ex.n === 0 ? tex(k) : `${A.ehUm(k) ? '' : A.ehUm(A.neg(k)) ? '-' : k.t === 'n' ? tex(k) : texPar(k)}${v}${um(ex) ? '' : `^{${ex.d === 1 ? ex.n : `${ex.n}/${ex.d}`}}`}`);
    if (estranho) {
      passos.push(passo(`${fx} = ${texSoma(dados.map(texPot))}`, 'Reescrevemos raízes e frações como potências de \\(x\\): \\(\\sqrt{x} = x^{1/2}\\), \\(\\dfrac{1}{x^n} = x^{-n}\\).'));
    }
    const crua = texSoma(dados.filter(({ ex }) => ex.n !== 0).map(({ k, ex }) => {
      if (um(ex)) return tex(k);
      const novo = A.qSoma(ex, A.q(-1));
      const expoente = um(novo) ? '' : `^{${novo.d === 1 ? novo.n : `${novo.n}/${novo.d}`}}`;
      const fator = ex.n < 0 || ex.d !== 1 ? `\\left(${tex({ t: 'n', ...ex })}\\right)` : `${ex.n}`;
      return A.ehUm(k) ? `${ex.d === 1 && ex.n > 0 ? ex.n : fator}${v}${expoente}` : A.ehUm(A.neg(k)) ? `-${ex.d === 1 && ex.n > 0 ? ex.n : fator}${v}${expoente}` : `${tex(k)} \\cdot ${fator}${v}${expoente}`;
    }));
    const constante = dados.some(({ ex }) => ex.n === 0) && dados.length > 1;
    passos.push(passo(`${rot} = ${crua}`,
      `${dados.length > 1 ? 'Derivamos termo a termo com a regra da potência' : 'Regra da potência'}, \\((x^n)' = n\\,x^{n-1}\\): o expoente desce multiplicando e diminui em 1${constante ? '; a derivada da constante é zero' : ''}.`));
    fim(crua, estranho ? 'Efetuamos os produtos e voltamos à notação de raízes e frações.' : 'Efetuamos os produtos.');
    dicas = [
      estranho ? 'Reescreva cada termo como potência de \\(x\\) e use a regra da potência termo a termo.' : 'Use a regra da potência em cada termo: \\((x^n)\' = n\\,x^{n-1}\\).',
      estranho ? `Comece reescrevendo: \\(${fx} = ${texSoma(dados.map(texPot))}\\).` : `O primeiro termo fica \\(${tex(derivar(termos[0], v))}\\).`,
    ];
  } else if (regra === 'elementar') {
    const { lit } = separar(f, v);
    passos.push(passo(`${rot} = ${tex(df)}`, lit.t === 'f'
      ? `Derivada ${NOME_FN[lit.n]}: \\(${FORMULA_FN[lit.n]}\\).`
      : `Derivada da exponencial: \\(${lit.b.t === 's' ? "(e^x)' = e^x" : "(a^x)' = a^x \\ln a"}\\).`));
    dicas = ['É uma derivada de tabela (função elementar).', lit.t === 'f' ? `Lembre: \\(${FORMULA_FN[lit.n]}\\).` : "Lembre: \\((a^x)' = a^x \\ln a\\) e \\((e^x)' = e^x\\)."];
  } else if (regra === 'soma' || regra === 'multiplo') {
    const termos = f.t === '+' ? f.a : [f];
    const usados = new Set();
    termos.forEach((t) => {
      const { k, lit } = separar(t, v);
      const c = classificar(lit, v);
      usados.add(motivo(lit, v));
      if (['produto', 'quociente', 'cadeia'].includes(c)) {
        const p = passoDaParte(`\\left(${tex(lit)}\\right)`, lit, v);
        passos.push(passo(p.tex, `${termos.length > 1 ? 'Um dos termos' : 'A função'} ${A.ehUm(k) ? '' : `(sem a constante \\(${tex(k)}\\)) `}pede a ${p.porque}${c === 'cadeia' ? ': derivada de fora vezes derivada de dentro' : ''}.`));
      }
    });
    passos.push(passo(`${rot} = ${tex(df)}`,
      `${termos.length > 1 ? 'Derivamos termo a termo' : 'A constante fica multiplicando'}${termos.length > 1 && termos.some((t) => !A.ehUm(separar(t, v).k)) ? ', mantendo as constantes multiplicativas' : ''}. Regras usadas: ${[...usados].join('; ')}.`));
    dicas = [
      `${termos.length > 1 ? 'Derive termo a termo' : 'A constante multiplicativa fica de fora'}. Você vai precisar de: ${[...usados].join('; ')}.`,
      `Derivada do primeiro termo: \\(${tex(derivar(termos[0], v))}\\).`,
    ];
  } else if (regra === 'produto') {
    const [u, w] = fatoresDoProduto(f, v);
    const du = derivar(u, v);
    const dw = derivar(w, v);
    const pu = passoDaParte('u', u, v);
    const pw = passoDaParte('v', w, v);
    passos.push(passo(`u = ${tex(u)} \\qquad v = ${tex(w)}`, `\\(${fx}\\) é um produto de duas funções. Regra do produto: \\((uv)' = u'v + uv'\\).`));
    if (pu.simples && pw.simples) {
      passos.push(passo(`u' = ${tex(du)} \\qquad v' = ${tex(dw)}`, `Derivamos cada fator: \\(u'\\) pela ${pu.porque} e \\(v'\\) pela ${pw.porque}.`));
    } else {
      passos.push(passo(pu.tex, pu.txt), passo(pw.tex, pw.txt));
    }
    const crua = texSoma([texVezes(du, w), texVezes(u, dw)]);
    passos.push(passo(`${rot} = u'v + uv' = ${crua}`, 'Substituímos na regra do produto.'));
    const polinomios = A.ehPolinomio(u, v) && A.ehPolinomio(w, v);
    df = polinomios ? A.expandir(soma(mul(du, w), mul(u, dw))) : soma(mul(du, w), mul(u, dw));
    fim(crua, polinomios ? 'Expandimos e juntamos os termos semelhantes.' : 'Organizamos os fatores.');
    dicas = ["É um produto: use \\((uv)' = u'v + uv'\\).", `Tome \\(u = ${tex(u)}\\) e \\(v = ${tex(w)}\\); então \\(u' = ${tex(du)}\\).`];
    erros.push({ expr: mul(du, dw), msg: "Parece que você multiplicou as derivadas dos fatores. A derivada do produto não é \\(u'v'\\): é \\(u'v + uv'\\)." });
    erros.push({ expr: sub(mul(du, w), mul(u, dw)), msg: "Na regra do produto as duas parcelas são <strong>somadas</strong>: \\(u'v + uv'\\). O sinal de menos é da regra do quociente." });
  } else if (regra === 'quociente') {
    const { cima: u, baixo: w } = A.fracao(f);
    const du = derivar(u, v);
    const dw = derivar(w, v);
    const pu = passoDaParte('u', u, v);
    const pw = passoDaParte('v', w, v);
    passos.push(passo(`u = ${tex(u)} \\qquad v = ${tex(w)}`, `\\(${fx}\\) é um quociente. Regra do quociente: \\(\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^2}\\).`));
    if (pu.simples && pw.simples) {
      passos.push(passo(`u' = ${tex(du)} \\qquad v' = ${tex(dw)}`, `Derivamos o numerador (${pu.porque}) e o denominador (${pw.porque}).`));
    } else {
      passos.push(passo(pu.tex, pu.txt), passo(pw.tex, pw.txt));
    }
    const crua = String.raw`\frac{${texVezes(du, w)} - ${texVezes(u, dw)}}{${tex(pot(w, 2))}}`;
    passos.push(passo(`${rot} = \\frac{u'v - uv'}{v^2} = ${crua}`, 'Substituímos na regra do quociente. Atenção à ordem e ao sinal de menos, que vale para todo o produto \\(uv\'\\).'));
    fim(crua, A.ehPolinomio(u, v) && A.ehPolinomio(w, v) ? 'Expandimos o numerador (distribuindo o sinal de menos) e juntamos os termos semelhantes.' : 'Simplificamos o numerador.');
    dicas = ["É um quociente: use \\(\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^2}\\).", `Tome \\(u = ${tex(u)}\\) e \\(v = ${tex(w)}\\); então \\(u' = ${tex(du)}\\) e \\(v' = ${tex(dw)}\\).`];
    erros.push({ expr: div(sub(mul(u, dw), mul(du, w)), pot(w, 2)), msg: "O sinal saiu trocado: o numerador é \\(u'v - uv'\\), começando pela derivada do numerador." });
    erros.push({ expr: div(du, dw), msg: "A derivada do quociente não é o quociente das derivadas. Use \\(\\dfrac{u'v - uv'}{v^2}\\)." });
    erros.push({ expr: div(sub(mul(du, w), mul(u, dw)), w), msg: 'Faltou elevar o denominador ao quadrado: \\(v^2\\).' });
    erros.push({ expr: div(soma(mul(du, w), mul(u, dw)), pot(w, 2)), msg: "No numerador há um sinal de <strong>menos</strong>: \\(u'v - uv'\\)." });
  } else if (regra === 'cadeia') {
    const { fatores, camadas, dentro } = fatoresDaCadeia(f, v);
    const nomes = ['u', 'w', 'z', 's'].slice(0, camadas.length);
    const variaveis = ['y', ...nomes];
    const definicoes = camadas.map((camada, i) => `${variaveis[i]} = ${tex(camada.F(A.sim(nomes[i])))}`);
    definicoes.push(`${nomes.at(-1)} = ${tex(dentro)}`);
    passos.push(passo(definicoes.join(', \\qquad '),
      camadas.length === 1
        ? `Função composta: a de <strong>dentro</strong> é \\(u = ${tex(dentro)}\\) e a de <strong>fora</strong> é \\(${tex(camadas[0].F(A.sim('u')))}\\).`
        : `Função composta em ${camadas.length + 1} camadas. Identificamos de fora para dentro, dando um nome a cada “miolo”.`));
    const derivadas = camadas.map((camada, i) => `\\frac{d${variaveis[i]}}{d${nomes[i]}} = ${tex(derivar(camada.F(A.sim(nomes[i])), nomes[i]))}`);
    const pDentro = passoDaParte(nomes.at(-1), dentro, v);
    derivadas.push(`\\frac{d${nomes.at(-1)}}{d${v}} = ${tex(derivar(dentro, v))}`);
    if (!pDentro.simples) passos.push(passo(pDentro.tex, `A função de dentro precisa de uma regra própria: ${pDentro.porque}.`));
    passos.push(passo(derivadas.join(', \\qquad '), 'Derivamos cada camada em relação à sua própria variável.'));
    const crua = texVezes(...fatores);
    passos.push(passo(`${rot} = ${crua}`, 'Regra da cadeia: multiplicamos as derivadas das camadas e voltamos para a variável \\(x\\). A derivada de fora é calculada na função de dentro, que fica intacta.'));
    fim(crua, 'Organizamos os fatores.');
    dicas = ['É uma função composta: regra da cadeia (derivada de fora vezes derivada de dentro).', `A função de dentro é \\(${nomes[0]} = ${tex(camadas[0].g)}\\). Derive a de fora e multiplique pela derivada de dentro.`];
    erros.push({ expr: mul(...fatores.slice(0, -1)), msg: 'Faltou multiplicar pela derivada da função de dentro (regra da cadeia).' });
    if (camadas.length > 1) erros.push({ expr: mul(fatores[0], fatores.at(-1)), msg: 'Há mais de duas camadas: faltou a derivada de uma camada intermediária.' });
  } else {
    // logarítmica: f = b^e com variável na base e no expoente
    const lnY = mul(f.e, A.ln(f.b));
    const dLn = derivar(lnY, v);
    passos.push(passo(`\\ln y = ${tex(lnY)}`, 'Há variável na base e no expoente. Fazemos \\(y = ' + tex(f) + '\\) e aplicamos \\(\\ln\\) dos dois lados: o expoente desce multiplicando.'));
    const crua = linhaCrua(lnY, v);
    passos.push(passo(`\\frac{y'}{y} = ${crua && crua !== tex(dLn) ? `${crua} = ` : ''}${tex(dLn)}`, "Derivamos os dois lados. À esquerda, \\((\\ln y)' = y'/y\\) (regra da cadeia); à direita, " + motivo(lnY, v) + '.'));
    df = mul(f, dLn);
    passos.push(passo(`${rot} = ${tex(df)}`, 'Multiplicamos por \\(y\\) e voltamos à expressão original.'));
    dicas = ['Variável na base e no expoente: use derivação logarítmica.', `Aplique \\(\\ln\\): \\(\\ln y = ${tex(lnY)}\\). Depois derive os dois lados.`];
    erros.push({ expr: dLn, msg: "Isso é \\(y'/y\\). Falta multiplicar por \\(y\\)." });
    erros.push({ expr: mul(f, A.ln(f.b)), msg: 'Você tratou como exponencial de base constante. Com variável também na base, use derivação logarítmica.' });
  }
  return { df, passos, dicas, regra, erros: erros.map((e) => ({ expr: texto(e.expr), msg: e.msg })) };
}

export { NOME_REGRA, X };
