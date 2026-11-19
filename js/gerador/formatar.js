// Montagem de LaTeX limpo a partir das expressões de expr.js, na notação
// brasileira (sen, tg, cotg, cossec, arcsen, arctg, ln). Regras garantidas
// aqui: nada de "1x", "x^1", "+ -", "0x"; sinais resolvidos; frações com o
// sinal na frente; funções com parênteses sempre que o argumento não é um
// símbolo sozinho.

import { num, mul, soma, pot, ehNum, q, valor } from './expr.js';

const NOMES = {
  sin: '\\sen', cos: '\\cos', tan: '\\tg', sec: '\\sec', csc: '\\cossec', cot: '\\cotg',
  ln: '\\ln', asin: '\\arcsen', acos: '\\arccos', atan: '\\arctg',
};
const TRIG = new Set(['sin', 'cos', 'tan', 'sec', 'csc', 'cot']);
const SIMBOLOS = { pi: '\\pi', e: 'e', theta: '\\theta' };

const texSimbolo = (v) => SIMBOLOS[v] ?? v;
const alto = (s) => s.includes('\\frac');
const par = (s) => (alto(s) ? `\\left(${s}\\right)` : `(${s})`);
const ehNegativo = (e) => (e.t === 'n' && e.n < 0) || (e.t === '*' && e.c.n < 0);
const oposto = (e) => mul(-1, e);

function texRacional(c) {
  const sinal = c.n < 0 ? '-' : '';
  return c.d === 1 ? `${sinal}${Math.abs(c.n)}` : `${sinal}\\frac{${Math.abs(c.n)}}{${c.d}}`;
}

function texExpoente(ex) {
  return ex.d === 1 ? `${ex.n}` : `${ex.n}/${ex.d}`;
}

function texFuncao(e, expoente) {
  const nome = e.n === 'log' ? `\\log_{${tex(e.base)}}` : NOMES[e.n];
  const argumento = tex(e.a);
  const simples = e.a.t === 's';
  const corpo = simples ? ` ${argumento}` : par(argumento);
  if (!expoente) return `${nome}${corpo}`;
  if (TRIG.has(e.n)) return `${nome}^{${expoente}}${corpo}`;
  return `${par(`${nome}${corpo}`)}^{${expoente}}`;
}

/** Classe de ordenação dos fatores em um produto (constantes, variáveis, somas, raízes, exponenciais, funções). */
function classe({ b, e }) {
  if (b.t === 'n') return 1;
  if (b.t === 's') return b.v === 'pi' || b.v === 'e' ? 0 : 2;
  if (e.d !== 1) return 4;
  if (b.t === '+') return 3;
  if (b.t === '^') return 5;
  if (b.t === 'f') return 6;
  return 3;
}

/** LaTeX de base^expoente (expoente racional positivo). */
function texFator(b, ex) {
  const um = ex.n === 1 && ex.d === 1;
  if (ex.d === 2 && ex.n === 1) return `\\sqrt{${tex(b)}}`;
  if (ex.d === 3 && ex.n === 1) return `\\sqrt[3]{${tex(b)}}`;
  if (b.t === 'f') return um ? texFuncao(b) : texFuncao(b, texExpoente(ex));
  if (b.t === '^') {
    if (um) return tex(b);
    if (ex.d === 1 && (b.b.t === 'n' || (b.b.t === 's' && (b.b.v === 'e' || b.b.v === 'pi')))) return tex(pot(b.b, mul(num(ex.n), b.e)));
    return `${par(tex(b))}^{${texExpoente(ex)}}`;
  }
  const precisaPar = b.t === '+' || b.t === '*' || (b.t === 'n' && (b.n < 0 || b.d !== 1));
  const base = precisaPar ? par(tex(b)) : tex(b);
  return um ? base : `${base}^{${texExpoente(ex)}}`;
}

function juntar(pecas) {
  let saida = '';
  let anterior = null;
  for (const peca of pecas) {
    if (anterior == null) saida = peca.s;
    // "·" explícito antes de número (3 · 2^x) e entre funções (sen x · cos x)
    else if (/^\d/.test(peca.s) || anterior.k === 6) saida += ` \\cdot ${peca.s}`;
    // espaço só para não colar letras (\pi x)
    else saida += (/[a-zA-Z]$/.test(anterior.s) && /^[a-zA-Z]/.test(peca.s) ? ' ' : '') + peca.s;
    anterior = peca;
  }
  return saida;
}

function texProduto(e) {
  const ordenados = e.f.map((f, i) => ({ f, i, k: classe(f) })).sort((a, b) => a.k - b.k || a.i - b.i);
  const cima = ordenados.filter(({ f }) => f.e.n > 0).map(({ f, k }) => ({ s: texFator(f.b, f.e), k, f }));
  const baixo = ordenados.filter(({ f }) => f.e.n < 0).map(({ f, k }) => ({ s: texFator(f.b, q(-f.e.n, f.e.d)), k, f }));
  const sinal = e.c.n < 0 ? '-' : '';
  const n = Math.abs(e.c.n);
  const temFracao = e.c.d !== 1 || baixo.length > 0;
  // dentro de uma fração, uma soma sozinha no numerador ou no denominador dispensa parênteses
  const semPar = (lista, sozinho) => { if (temFracao && sozinho && lista.length === 1 && lista[0].f.b.t === '+' && lista[0].f.e.n === lista[0].f.e.d * Math.sign(lista[0].f.e.n) && Math.abs(lista[0].f.e.n) === 1) lista[0].s = tex(lista[0].f.b); };
  semPar(cima, n === 1);
  semPar(baixo, e.c.d === 1);
  if (n !== 1 || !cima.length) cima.unshift({ s: String(n), k: -1 });
  if (!baixo.length && e.c.d === 1) return sinal + juntar(cima);
  if (e.c.d !== 1) baixo.unshift({ s: String(e.c.d), k: -1 });
  return `${sinal}\\frac{${juntar(cima)}}{${juntar(baixo)}}`;
}

/** LaTeX de uma expressão. */
export function tex(e) {
  switch (e.t) {
    case 'n': return texRacional(e);
    case 's': return texSimbolo(e.v);
    case '+': return e.a.map((t, i) => (i === 0 ? tex(t) : ehNegativo(t) ? ` - ${tex(oposto(t))}` : ` + ${tex(t)}`)).join('');
    case '*': return texProduto(e);
    case '^': {
      const simples = e.b.t === 's' || (e.b.t === 'n' && e.b.n > 0 && e.b.d === 1);
      return `${simples ? tex(e.b) : par(tex(e.b))}^{${tex(e.e)}}`;
    }
    default: return texFuncao(e);
  }
}

/** LaTeX entre parênteses quando a expressão é soma ou começa com sinal de menos. */
export function texPar(e) {
  const s = tex(e);
  return e.t === '+' || ehNegativo(e) ? par(s) : s;
}

/** Produto "cru" (sem simplificar), para mostrar a aplicação de uma regra: a · b · c. */
export function texVezes(...fatores) {
  return fatores.map((f) => (typeof f === 'string' ? f : texPar(f))).join(' \\cdot ');
}

/** Soma de trechos já em LaTeX, resolvendo os sinais: ["2x", "-3"] → "2x - 3". */
export function texSoma(trechos) {
  return trechos.map((s, i) => (i === 0 ? s : s.startsWith('-') ? ` - ${s.slice(1).trimStart()}` : ` + ${s}`)).join('');
}

/** Número inteiro ou racional em LaTeX; aceita número JS (inteiro) ou {n, d}. */
export const texNum = (v) => texRacional(typeof v === 'number' ? q(v) : v);

/** Decimal no padrão brasileiro para LaTeX: 0.5 → 0{,}5. */
export function texDecimal(valor, casas = 2) {
  return String(Number(valor.toFixed(casas))).replace('.', '{,}');
}

/** Equação da reta y = mx + b, com m e b expressões. */
export function texReta(m, b) {
  return `y = ${tex(soma(mul(m, { t: 's', v: 'x' }), b))}`;
}

/** "(x - a)" com o sinal resolvido: a = -2 → "(x + 2)"; a = 0 → "x". */
export function texMenos(variavel, a) {
  const e = soma({ t: 's', v: variavel }, mul(-1, a));
  return e.t === '+' ? `(${tex(e)})` : tex(e);
}

/** Decimal em texto corrido, no padrão brasileiro: 1.5 → "1,5". */
export function decimalBr(v) {
  return String(Number(Number(v).toFixed(6))).replace('.', ',').replace('-', '−');
}

/** Valor aproximado em LaTeX com 3 algarismos significativos: 0.31831 → 0{,}318. */
export function texAprox(v) {
  const r = Math.abs(v) >= 100 ? Number(v.toFixed(1)) : Number(v.toPrecision(3));
  return String(r).replace('.', '{,}');
}

const decimalFinito = (d) => {
  let n = d;
  while (n % 2 === 0) n /= 2;
  while (n % 5 === 0) n /= 5;
  return n === 1;
};

/** LaTeX exato da resposta, com o valor aproximado quando ele não é um decimal curto. */
export function comAprox(e) {
  const v = valor(e);
  if (e.t === 'n' && decimalFinito(e.d)) return tex(e);
  return `${tex(e)} \\approx ${texAprox(v)}`;
}

/** LaTeX da expressão com a variável trocada por (valor): mostra a substituição antes da conta. */
export function texEm(e, valorTex, v = 'x') {
  return tex(e).replace(new RegExp(`(?<![a-zA-Z\\\\])${v}(?![a-zA-Z])`, 'g'), `(${valorTex})`);
}

export { ehNum };
