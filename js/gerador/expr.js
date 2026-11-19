// Mini-álgebra simbólica do gerador.
//
// Os modelos de questão montam as funções com os construtores daqui (soma,
// mul, pot, fn ...). Da mesma árvore saem o LaTeX exibido (formatar.js), a
// expressão para o math.js (texto) e a derivada simplificada (derivar). Os
// construtores já simplificam o trivial (1·x, x + 0, x¹, sinais), o que evita
// LaTeX "sujo" por construção.
//
// Nós: {t:'n', n, d} racional | {t:'s', v} símbolo | {t:'+', a} soma |
//      {t:'*', c, f:[{b, e}]} produto com coeficiente racional e expoentes racionais |
//      {t:'^', b, e} potência com expoente não numérico | {t:'f', n, a, base} função

const mdc = (a, b) => (b ? mdc(b, a % b) : Math.abs(a));

/** Racional normalizado n/d. */
export function q(n, d = 1) {
  if (d === 0) throw new Error('divisão por zero');
  if (!Number.isInteger(n) || !Number.isInteger(d)) throw new Error(`racional inválido: ${n}/${d}`);
  const g = mdc(n, d) || 1;
  const s = d < 0 ? -1 : 1;
  return { n: (s * n) / g, d: (s * d) / g };
}
const rq = (x) => (typeof x === 'number' ? q(x) : x);
export const qSoma = (a, b) => q(a.n * b.d + b.n * a.d, a.d * b.d);
export const qMul = (a, b) => q(a.n * b.n, a.d * b.d);
export const qInt = (a) => a.d === 1;
export const qNum = (a) => a.n / a.d;
const UM = q(1);

export const num = (n, d = 1) => ({ t: 'n', ...q(n, d) });
export const sim = (v) => ({ t: 's', v });
export const X = sim('x');
export const PI = sim('pi');
export const E = sim('e');
export const ZERO = num(0);
const no = (x) => (typeof x === 'number' ? num(x) : x);

export const ehNum = (e) => e.t === 'n';
export const ehZero = (e) => e.t === 'n' && e.n === 0;
export const ehUm = (e) => e.t === 'n' && e.n === 1 && e.d === 1;
const CONSTANTES = new Set(['pi', 'e']);

/** Texto no formato do math.js (também serve de chave de igualdade estrutural). */
export function texto(e) {
  switch (e.t) {
    case 'n': return e.d === 1 ? (e.n < 0 ? `(${e.n})` : `${e.n}`) : `(${e.n}/${e.d})`;
    case 's': return e.v;
    // termos e fatores ordenados: a mesma expressão sempre gera o mesmo texto (chave canônica)
    case '+': return `(${e.a.map(texto).sort().join(' + ')})`;
    case '*': {
      const fator = ({ b, e: ex }) => {
        const base = texto(b);
        const abs = { n: Math.abs(ex.n), d: ex.d };
        if (abs.n === 1 && abs.d === 1) return base;
        if (abs.n === 1 && abs.d === 2) return `sqrt(${base})`;
        return `(${base})^(${abs.d === 1 ? abs.n : `${abs.n}/${abs.d}`})`;
      };
      const cima = e.f.filter((f) => f.e.n > 0).map(fator).sort();
      const baixo = e.f.filter((f) => f.e.n < 0).map(fator).sort();
      if (Math.abs(e.c.n) !== 1 || !cima.length) cima.unshift(String(Math.abs(e.c.n)));
      if (e.c.d !== 1) baixo.unshift(String(e.c.d));
      const corpo = baixo.length ? `(${cima.join('*')})/(${baixo.join('*')})` : cima.join('*');
      return e.c.n < 0 ? `(-${corpo})` : `(${corpo})`;
    }
    case '^': return `((${texto(e.b)})^(${texto(e.e)}))`;
    case 'f': return e.n === 'ln' ? `log(${texto(e.a)})` : e.n === 'log' ? `log(${texto(e.a)}, ${texto(e.base)})` : `${e.n}(${texto(e.a)})`;
    default: throw new Error(`nó desconhecido: ${JSON.stringify(e)}`);
  }
}
const chave = texto;

/** Potência inteira de racional. */
function qPot(a, k) {
  if (k < 0) return qPot(q(a.d, a.n), -k);
  return q(a.n ** k, a.d ** k);
}

const raizExata = (n, indice) => {
  const r = Math.round(Math.abs(n) ** (1 / indice));
  return r ** indice === Math.abs(n) ? r : null;
};

/** Produto simplificado. Aceita números e expressões. */
export function mul(...args) {
  let c = UM;
  const mapa = new Map();
  const incluir = (b, ex) => {
    if (b.t === 'n') {
      if (qInt(ex)) { c = qMul(c, qPot(b, ex.n)); return; }
      const rn = raizExata(b.n, ex.d);
      const rd = raizExata(b.d, ex.d);
      if (b.n > 0 && rn != null && rd != null) { c = qMul(c, qPot(q(rn, rd), ex.n)); return; }
    }
    if (b.t === '*' && qInt(ex)) {
      c = qMul(c, qPot(b.c, ex.n));
      for (const f of b.f) incluir(f.b, qMul(f.e, ex));
      return;
    }
    const k = chave(b);
    const atual = mapa.get(k);
    if (atual) atual.e = qSoma(atual.e, ex); else mapa.set(k, { b, e: ex });
  };
  for (const arg of args) incluir(no(arg), UM);
  if (c.n === 0) return ZERO;
  const f = [...mapa.values()].filter((x) => x.e.n !== 0);
  if (!f.length) return { t: 'n', ...c };
  if (c.n === 1 && c.d === 1 && f.length === 1 && f[0].e.n === 1 && f[0].e.d === 1) return f[0].b;
  return { t: '*', c, f };
}

/** Potência: expoente racional (número ou q) vira fator; expoente simbólico vira nó '^'. */
export function pot(base, expoente) {
  const b = no(base);
  if (typeof expoente === 'number' || (expoente.t === undefined && 'n' in expoente)) {
    return mul({ t: '*', c: UM, f: [{ b, e: rq(expoente) }] });
  }
  if (expoente.t === 'n') return pot(b, q(expoente.n, expoente.d));
  if (ehUm(b)) return num(1);
  return { t: '^', b, e: expoente };
}
export const raiz = (e) => pot(e, q(1, 2));
export const div = (a, b) => mul(a, pot(b, -1));
export const neg = (e) => mul(-1, e);
export const exp = (e) => pot(E, no(e));

/** Separa coeficiente racional e parte literal de um termo. */
function termo(e) {
  if (e.t === 'n') return { c: q(e.n, e.d), resto: null, k: '1' };
  if (e.t === '*') {
    const resto = mul({ t: '*', c: UM, f: e.f });
    return { c: e.c, resto, k: chave(resto) };
  }
  return { c: UM, resto: e, k: chave(e) };
}

/** Soma simplificada: junta termos semelhantes e descarta zeros. */
export function soma(...args) {
  const ordem = [];
  const mapa = new Map();
  const incluir = (e) => {
    if (e.t === '+') { e.a.forEach(incluir); return; }
    const { c, resto, k } = termo(e);
    const atual = mapa.get(k);
    if (atual) atual.c = qSoma(atual.c, c);
    else { mapa.set(k, { c, resto }); ordem.push(k); }
  };
  args.map(no).forEach(incluir);
  const termos = ordem.map((k) => mapa.get(k)).filter((x) => x.c.n !== 0)
    .map(({ c, resto }) => (resto ? mul({ t: 'n', ...c }, resto) : { t: 'n', ...c }));
  if (!termos.length) return ZERO;
  return termos.length === 1 ? termos[0] : { t: '+', a: termos };
}
export const sub = (a, b) => soma(a, neg(no(b)));

// ---- Funções elementares, com valores exatos em ângulos notáveis ----

const R2 = raiz(num(2));
const R3 = raiz(num(3));
const NOTAVEIS = [[0, ZERO], [0.5, num(1, 2)], [Math.SQRT1_2, mul(num(1, 2), R2)], [Math.sqrt(3) / 2, mul(num(1, 2), R3)],
  [1, num(1)], [Math.sqrt(3) / 3, mul(num(1, 3), R3)], [Math.sqrt(3), R3]];

/** Se e = r·π com r racional, devolve r. */
function multiploDePi(e) {
  if (ehZero(e)) return q(0);
  if (e.t === 's' && e.v === 'pi') return UM;
  if (e.t === '*' && e.f.length === 1 && e.f[0].b.t === 's' && e.f[0].b.v === 'pi' && e.f[0].e.n === 1 && e.f[0].e.d === 1) return e.c;
  return null;
}
const negativo = (e) => (e.t === 'n' && e.n < 0) || (e.t === '*' && e.c.n < 0);

export function fn(nome, argumento, base) {
  const a = no(argumento);
  const r = multiploDePi(a);
  if (r && ['sin', 'cos', 'tan'].includes(nome) && [1, 2, 3, 4, 6].includes(r.d)) {
    const v = Math[nome](qNum(r) * Math.PI);
    if (Math.abs(v) < 1e6) {
      const achado = NOTAVEIS.find(([valor]) => Math.abs(Math.abs(v) - valor) < 1e-9);
      if (achado) return v < -1e-9 ? neg(achado[1]) : achado[1];
    }
  }
  if (negativo(a)) {
    if (['sin', 'tan', 'asin', 'atan'].includes(nome)) return neg(fn(nome, neg(a)));
    if (nome === 'cos') return fn(nome, neg(a));
  }
  if (nome === 'ln') {
    if (ehUm(a)) return ZERO;
    if (a.t === 's' && a.v === 'e') return num(1);
    if (a.t === '^' && a.b.t === 's' && a.b.v === 'e') return a.e;
  }
  if ((nome === 'asin' || nome === 'atan') && ehZero(a)) return ZERO;
  if (nome === 'atan' && ehUm(a)) return mul(num(1, 4), PI);
  return base ? { t: 'f', n: nome, a, base: no(base) } : { t: 'f', n: nome, a };
}
export const sen = (a) => fn('sin', a);
export const cos = (a) => fn('cos', a);
export const tg = (a) => fn('tan', a);
export const ln = (a) => fn('ln', a);

// ---- Consultas ----

export function depende(e, v = 'x') {
  switch (e.t) {
    case 'n': return false;
    case 's': return e.v === v;
    case '+': return e.a.some((x) => depende(x, v));
    case '*': return e.f.some((f) => depende(f.b, v));
    case '^': return depende(e.b, v) || depende(e.e, v);
    default: return depende(e.a, v);
  }
}

/** É polinômio na variável v (expoentes inteiros não negativos, sem funções)? */
export function ehPolinomio(e, v = 'x') {
  switch (e.t) {
    case 'n': return true;
    case 's': return true;
    case '+': return e.a.every((x) => ehPolinomio(x, v));
    case '*': return e.c.d === 1 && e.f.every((f) => qInt(f.e) && f.e.n > 0 && ehPolinomio(f.b, v));
    default: return !depende(e, v) && e.t !== 'f' && e.t !== '^';
  }
}

/** Valor numérico (NaN fora do domínio real). */
export function valor(e, amb = {}) {
  switch (e.t) {
    case 'n': return e.n / e.d;
    case 's': return e.v === 'pi' ? Math.PI : e.v === 'e' ? Math.E : amb[e.v] ?? NaN;
    case '+': return e.a.reduce((s, x) => s + valor(x, amb), 0);
    case '*': return e.f.reduce((p, f) => {
      const b = valor(f.b, amb);
      const ex = qNum(f.e);
      const r = f.e.d % 2 === 1 && b < 0 ? -((-b) ** Math.abs(ex)) * (f.e.n % 2 === 0 ? -1 : 1) : b ** Math.abs(ex);
      return ex < 0 ? p / r : p * r;
    }, qNum(e.c));
    case '^': return valor(e.b, amb) ** valor(e.e, amb);
    default: {
      const a = valor(e.a, amb);
      switch (e.n) {
        case 'sin': return Math.sin(a);
        case 'cos': return Math.cos(a);
        case 'tan': return Math.tan(a);
        case 'sec': return 1 / Math.cos(a);
        case 'csc': return 1 / Math.sin(a);
        case 'cot': return 1 / Math.tan(a);
        case 'ln': return a > 0 ? Math.log(a) : NaN;
        case 'log': return a > 0 ? Math.log(a) / Math.log(valor(e.base, amb)) : NaN;
        case 'asin': return Math.asin(a);
        case 'acos': return Math.acos(a);
        case 'atan': return Math.atan(a);
        default: throw new Error(`função desconhecida: ${e.n}`);
      }
    }
  }
}

/** Substitui o símbolo v por uma expressão (ou número), simplificando. */
export function subs(e, v, por) {
  const p = no(por);
  const ir = (x) => {
    switch (x.t) {
      case 'n': return x;
      case 's': return x.v === v ? p : x;
      case '+': return soma(...x.a.map(ir));
      case '*': return mul({ t: 'n', ...x.c }, ...x.f.map((f) => pot(ir(f.b), f.e)));
      case '^': return pot(ir(x.b), ir(x.e));
      default: return fn(x.n, ir(x.a), x.base);
    }
  };
  return ir(e);
}

/** Distribui produtos e potências inteiras de somas (para polinômios). */
export function expandir(e) {
  return ordenar(distribuir(e));
}

/** Ordena os termos de uma soma por grau decrescente (polinômios na forma usual). */
export function ordenar(e) {
  if (e.t !== '+') return e;
  const grau = (t) => (t.t === '*' ? t.f.reduce((g, f) => g + (f.b.t === 's' && !CONSTANTES.has(f.b.v) ? qNum(f.e) : 0), 0) : t.t === 's' && !CONSTANTES.has(t.v) ? 1 : 0);
  return { t: '+', a: e.a.map((t, i) => ({ t, i })).sort((a, b) => grau(b.t) - grau(a.t) || a.i - b.i).map((x) => x.t) };
}

function distribuir(e) {
  if (e.t === '+') return soma(...e.a.map(distribuir));
  if (e.t !== '*') return e;
  let termos = [{ t: 'n', ...e.c }];
  for (const f of e.f) {
    const base = distribuir(f.b);
    if (base.t === '+' && qInt(f.e) && f.e.n > 0 && f.e.n <= 6) {
      for (let i = 0; i < f.e.n; i++) termos = termos.flatMap((t) => base.a.map((p) => mul(t, p)));
    } else {
      termos = termos.map((t) => mul(t, pot(base, f.e)));
    }
  }
  return soma(...termos);
}

// ---- Derivada ----

const DERIVADA_FN = {
  sin: (a) => cos(a),
  cos: (a) => neg(sen(a)),
  tan: (a) => pot(fn('sec', a), 2),
  sec: (a) => mul(fn('sec', a), tg(a)),
  csc: (a) => neg(mul(fn('csc', a), fn('cot', a))),
  cot: (a) => neg(pot(fn('csc', a), 2)),
  ln: (a) => pot(a, -1),
  asin: (a) => pot(sub(1, pot(a, 2)), q(-1, 2)),
  acos: (a) => neg(pot(sub(1, pot(a, 2)), q(-1, 2))),
  atan: (a) => pot(soma(1, pot(a, 2)), -1),
};

/** Parte de cima e parte de baixo de um produto (expoentes positivos / negativos). */
export function fracao(e) {
  if (e.t !== '*') return { cima: e, baixo: num(1) };
  const cima = mul(num(e.c.n), ...e.f.filter((f) => f.e.n > 0).map((f) => pot(f.b, f.e)));
  const baixo = mul(num(e.c.d), ...e.f.filter((f) => f.e.n < 0).map((f) => pot(f.b, q(-f.e.n, f.e.d))));
  return { cima, baixo };
}

/** Derivada simbólica simplificada em relação a v. */
export function derivar(e, v = 'x') {
  const d = (x) => derivar(x, v);
  switch (e.t) {
    case 'n': return ZERO;
    case 's': return e.v === v ? num(1) : ZERO;
    case '+': return soma(...e.a.map(d));
    case '*': {
      const { cima, baixo } = fracao(e);
      if (depende(baixo, v) && depende(cima, v)) {
        // quociente: (u'v − uv')/v², com o numerador expandido quando é polinômio
        let numerador = sub(mul(d(cima), baixo), mul(cima, d(baixo)));
        if (ehPolinomio(cima, v) && ehPolinomio(baixo, v)) numerador = expandir(numerador);
        return div(numerador, pot(baixo, 2));
      }
      const coef = { t: 'n', ...e.c };
      return soma(...e.f.map((f, i) => {
        if (!depende(f.b, v)) return ZERO;
        const outros = e.f.filter((_, j) => j !== i).map((o) => pot(o.b, o.e));
        return mul(coef, { t: 'n', ...f.e }, pot(f.b, qSoma(f.e, q(-1))), d(f.b), ...outros);
      }));
    }
    case '^': {
      if (!depende(e.b, v)) return mul(e, ln(e.b), d(e.e));
      return mul(e, soma(mul(d(e.e), ln(e.b)), mul(e.e, d(e.b), pot(e.b, -1))));
    }
    default: {
      if (e.n === 'log') return mul(d(e.a), pot(mul(e.a, ln(e.base)), -1));
      return mul(DERIVADA_FN[e.n](e.a), d(e.a));
    }
  }
}

/** Polinômio a partir dos coeficientes (do maior grau para o menor). */
export function polinomio(coeficientes, v = X) {
  const grau = coeficientes.length - 1;
  return soma(...coeficientes.map((c, i) => mul(no(c), pot(v, grau - i))));
}

export const iguais = (a, b) => chave(a) === chave(b);
export { CONSTANTES };
