// Ferramentas numéricas compartilhadas pelos testes e pelo script de conferência.
// Tudo aqui usa o math.js como "juiz": derivadas simbólicas via math.derivative
// e comparação de expressões em vários pontos.

import { create, all } from 'mathjs';

export const math = create(all);

const cache = new Map();

/** Compila (com cache) uma expressão do math.js. */
export function compilar(expr) {
  const chave = typeof expr === 'string' ? expr : expr.toString();
  let compilada = cache.get(chave);
  if (!compilada) {
    compilada = (typeof expr === 'string' ? math.parse(expr) : expr).compile();
    if (cache.size > 20000) cache.clear();
    cache.set(chave, compilada);
  }
  return compilada;
}

/** Avalia e devolve um número real finito, ou NaN (indefinido, complexo, infinito). */
export function avaliar(expr, escopo = {}) {
  try {
    const valor = compilar(expr).evaluate({ ...escopo });
    return typeof valor === 'number' && Number.isFinite(valor) ? valor : NaN;
  } catch {
    return NaN;
  }
}

/** Derivada simbólica (math.js) de ordem n, como nó. */
export function derivada(expr, variavel = 'x', ordem = 1) {
  let no = typeof expr === 'string' ? math.parse(expr) : expr;
  for (let i = 0; i < ordem; i++) no = math.derivative(no, variavel);
  return no;
}

export function perto(a, b, tolRel = 1e-6, tolAbs = 1e-9) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  return Math.abs(a - b) <= tolAbs + tolRel * Math.max(Math.abs(a), Math.abs(b));
}

/** Gerador determinístico simples para os pontos de amostragem. */
export function sorteador(semente = 12345) {
  let estado = semente >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function intervaloDe(dom, variavel) {
  if (Array.isArray(dom)) return dom;
  if (dom && Array.isArray(dom[variavel])) return dom[variavel];
  return [-2.5, 2.5];
}

/**
 * Compara duas expressões em pontos aleatórios do domínio, pulando os pontos
 * em que alguma delas não está definida.
 * @returns {{ok: boolean, motivo?: string, validos: number}}
 */
export function compararFuncoes(a, b, opcoes = {}) {
  const vars = opcoes.vars ?? ['x'];
  const minimo = opcoes.minimo ?? 6;
  const alvo = opcoes.pontos ?? 14;
  const tol = opcoes.tol ?? 1e-6;
  const aleatorio = sorteador(opcoes.semente ?? 20240229);
  let validos = 0;
  for (let tentativa = 0; tentativa < 400 && validos < alvo; tentativa++) {
    const escopo = { ...(opcoes.fixos ?? {}) };
    for (const v of vars) {
      const [min, max] = intervaloDe(opcoes.dom, v);
      escopo[v] = min + (max - min) * aleatorio();
    }
    const va = avaliar(a, escopo);
    const vb = avaliar(b, escopo);
    if (Number.isNaN(va) || Number.isNaN(vb)) continue;
    validos += 1;
    if (!perto(va, vb, tol, opcoes.tolAbs ?? 1e-8)) {
      const ponto = vars.map((v) => `${v} = ${escopo[v].toFixed(4)}`).join(', ');
      return { ok: false, validos, motivo: `diferem em ${ponto}: ${va} ≠ ${vb}` };
    }
  }
  if (validos < minimo) return { ok: false, validos, motivo: `só ${validos} ponto(s) válidos para comparar (mínimo ${minimo})` };
  return { ok: true, validos };
}

/** Estimativa numérica de lim f(x) quando x → a (a pode ser 'inf' ou '-inf'). */
export function limiteNumerico(f, a, lado = null, variavel = 'x') {
  const em = (x) => avaliar(f, { [variavel]: x });
  if (a === 'inf' || a === Infinity) return em(1e6);
  if (a === '-inf' || a === -Infinity) return em(-1e6);
  const h = 1e-5;
  const direita = em(a + h);
  const esquerda = em(a - h);
  if (lado === '+') return direita;
  if (lado === '-') return esquerda;
  if (Number.isNaN(direita)) return esquerda;
  if (Number.isNaN(esquerda)) return direita;
  return (direita + esquerda) / 2;
}

/** Pontos (x, y) sobre a curva F(x, y) = 0, encontrados por varredura e bisseção. */
export function pontosDaCurva(F, opcoes = {}) {
  const [x0, x1] = opcoes.x ?? [-3, 3];
  const [y0, y1] = opcoes.y ?? [-4, 4];
  const quantos = opcoes.quantos ?? 12;
  const aleatorio = sorteador(opcoes.semente ?? 777);
  const f = (x, y) => avaliar(F, { x, y });
  const pontos = [];
  for (let tentativa = 0; tentativa < 300 && pontos.length < quantos; tentativa++) {
    const x = x0 + (x1 - x0) * aleatorio();
    const n = 240;
    let yAnterior = y0;
    let fAnterior = f(x, y0);
    const raizes = [];
    for (let i = 1; i <= n; i++) {
      const y = y0 + ((y1 - y0) * i) / n;
      const fy = f(x, y);
      if (Number.isFinite(fAnterior) && Number.isFinite(fy) && fAnterior * fy < 0) {
        let a = yAnterior;
        let b = y;
        let fa = fAnterior;
        for (let k = 0; k < 60; k++) {
          const m = (a + b) / 2;
          const fm = f(x, m);
          if (!Number.isFinite(fm)) break;
          if (fa * fm <= 0) { b = m; } else { a = m; fa = fm; }
        }
        const raiz = (a + b) / 2;
        if (Math.abs(f(x, raiz)) < 1e-7) raizes.push(raiz);
      }
      yAnterior = y;
      fAnterior = fy;
    }
    if (raizes.length) pontos.push({ x, y: raizes[Math.floor(aleatorio() * raizes.length)] });
  }
  return pontos;
}

/** dy/dx de F(x, y) = 0 pela fórmula −Fx/Fy (derivadas parciais via math.js). */
export function derivadaImplicita(F) {
  const Fx = derivada(F, 'x');
  const Fy = derivada(F, 'y');
  return (x, y) => {
    const fy = avaliar(Fy, { x, y });
    const fx = avaliar(Fx, { x, y });
    return Math.abs(fy) < 1e-6 ? NaN : -fx / fy;
  };
}
