// Conferência independente das questões geradas.
//
// Para cada questão, a resposta certa é recalculada a partir dos DADOS do
// enunciado (guardados em `conferencia`) usando o math.js e métodos numéricos,
// sem usar a conta feita pelo modelo. Também confere o LaTeX (renderização no
// KaTeX e ausência de "sujeira") e se o verificador aceita a resposta certa.

import { math, avaliar, derivada, compararFuncoes, pontosDaCurva, derivadaImplicita, perto } from './numerico.js';
import { texParaMath, segmentos } from './tex2math.js';
import { erroDeRenderizacao, formulasDoTexto, sujeiras, sujeirasDeTexto } from './formulas.js';
import { verificarCampo } from '../../js/gerador/verificador.js';

const cacheDerivadas = new Map();
function derivadaTexto(f, v = 'x', ordem = 1) {
  const chave = `${f}|${v}|${ordem}`;
  if (!cacheDerivadas.has(chave)) {
    if (cacheDerivadas.size > 50000) cacheDerivadas.clear();
    cacheDerivadas.set(chave, derivada(f, v, ordem).toString());
  }
  return cacheDerivadas.get(chave);
}
const d1 = (f, x, v = 'x') => avaliar(derivadaTexto(f, v), { [v]: x });

const cacheTex = new Map();
function renderiza(fonte, destaque) {
  const chave = `${destaque ? 'D' : 'I'}${fonte}`;
  if (!cacheTex.has(chave)) {
    if (cacheTex.size > 200000) cacheTex.clear();
    cacheTex.set(chave, erroDeRenderizacao(fonte, destaque));
  }
  return cacheTex.get(chave);
}

/** Raízes de g em (a, b): mudanças de sinal e tangências (mínimos de |g| ≈ 0). */
function raizes(g, a, b, n = 3000) {
  const encontradas = [];
  const h = (b - a) / n;
  const xs = Array.from({ length: n + 1 }, (_, i) => a + i * h);
  const gs = xs.map((x) => g(x));
  const refinar = (lo, hi) => {
    let [p, q] = [lo, hi];
    let gp = g(p);
    for (let k = 0; k < 80; k++) {
      const m = (p + q) / 2;
      const gm = g(m);
      if (gp * gm <= 0) q = m; else { p = m; gp = gm; }
    }
    return (p + q) / 2;
  };
  for (let i = 0; i < n; i++) {
    if (!Number.isFinite(gs[i]) || !Number.isFinite(gs[i + 1])) continue;
    if (gs[i] === 0) encontradas.push(xs[i]);
    else if (gs[i] * gs[i + 1] < 0) encontradas.push(refinar(xs[i], xs[i + 1]));
    else if (i > 0 && Math.abs(gs[i]) < Math.abs(gs[i - 1]) && Math.abs(gs[i]) <= Math.abs(gs[i + 1])) {
      // tangência: minimiza |g| por seção áurea
      let [p, q] = [xs[i - 1], xs[i + 1]];
      for (let k = 0; k < 100; k++) {
        const m1 = p + (q - p) / 3;
        const m2 = q - (q - p) / 3;
        if (Math.abs(g(m1)) < Math.abs(g(m2))) q = m2; else p = m1;
      }
      const x = (p + q) / 2;
      if (Math.abs(g(x)) < 1e-9) encontradas.push(x);
    }
  }
  const unicas = [];
  for (const r of encontradas.sort((u, v) => u - v)) if (!unicas.some((u) => Math.abs(u - r) < 1e-5)) unicas.push(r);
  return unicas.filter((r) => r > a + 1e-9 && r < b - 1e-9);
}

/** Ponto ótimo de f em (a, b) por varredura e seção áurea. */
function otimo(f, [a, b], sentido) {
  const sinal = sentido === 'max' ? -1 : 1;
  const g = (x) => { const v = f(x); return Number.isFinite(v) ? sinal * v : Infinity; };
  const n = 20000;
  let melhor = a;
  for (let i = 1; i < n; i++) { const x = a + ((b - a) * i) / n; if (g(x) < g(melhor)) melhor = x; }
  let [p, q] = [melhor - (b - a) / n, melhor + (b - a) / n];
  for (let k = 0; k < 120; k++) {
    const m1 = p + (q - p) / 3;
    const m2 = q - (q - p) / 3;
    if (g(m1) < g(m2)) q = m2; else p = m1;
  }
  return (p + q) / 2;
}

function limite(f, a, lado) {
  const em = (x) => avaliar(f, { x });
  if (a === 'inf') {
    let ultimo = NaN;
    for (let x = 100; x <= 1e7; x *= 10) { const v = em(x); if (Number.isFinite(v)) ultimo = v; }
    return ultimo;
  }
  const h = 1e-4;
  if (lado === '+') return em(a + h);
  return (em(a + h) + em(a - h)) / 2;
}

const conjuntoIgual = (obtidos, esperados, tol = 1e-5) => obtidos.length === esperados.length
  && esperados.every((e) => obtidos.some((o) => perto(o, e, tol, tol)));

/** Valor esperado de um campo numérico, calculado só com os dados do enunciado. */
function esperadoNumero(conf) {
  switch (conf.tipo) {
    case 'ponto': return avaliar(derivadaTexto(conf.f, 'x', conf.ordem ?? 1), { x: conf.a });
    case 'media': return (avaliar(conf.f, { x: conf.b }) - avaliar(conf.f, { x: conf.a })) / (conf.b - conf.a);
    case 'reta-b': return avaliar(conf.f, { x: conf.a }) - d1(conf.f, conf.a) * conf.a;
    case 'linear': return avaliar(conf.f, { x: conf.a }) + d1(conf.f, conf.a) * (conf.x - conf.a);
    case 'diferencial': return d1(conf.f, conf.x0) * conf.dx;
    case 'diferencial-relativo': return (d1(conf.f, conf.x0) * conf.dx) / avaliar(conf.f, { x: conf.x0 });
    case 'tempo': return avaliar(derivadaTexto(conf.expr, 't'), { t: 0 });
    case 'limite': return limite(conf.f, conf.a, conf.lado);
    case 'otimo': {
      const x = otimo((v) => avaliar(conf.f, { x: v }), conf.intervalo, conf.sentido);
      return avaliar(conf.resposta, { x });
    }
    case 'inversa': {
      // f crescente: acha a com f(a) = b por bisseção
      let [p, q] = [-10, 10];
      for (let k = 0; k < 100; k++) { const m = (p + q) / 2; if (avaliar(conf.f, { x: m }) < conf.b) p = m; else q = m; }
      return 1 / d1(conf.f, (p + q) / 2);
    }
    case 'implicita-ponto': {
      if (Math.abs(avaliar(conf.F, { x: conf.x0, y: conf.y0 })) > 1e-9) return NaN;
      return derivadaImplicita(conf.F)(conf.x0, conf.y0);
    }
    default: return undefined;
  }
}

/** Confere a resposta de um campo. Devolve uma mensagem de erro ou null. */
function conferirResposta(q, campo) {
  const conf = campo.conferencia ?? q.conferencia;
  if (!conf) return 'campo sem dados de conferência';
  const valores = campo.valores;
  const ref = campo.respostaExpr;
  if (campo.tipo === 'escolha') {
    if (conf.tipo !== 'derivavel') return `conferência ${conf.tipo} inesperada para escolha`;
    const continua = perto(avaliar(conf.f1, { x: conf.a }), avaliar(conf.f2, { x: conf.a }), 1e-9, 1e-9);
    const mesmaInclinacao = perto(d1(conf.f1, conf.a), d1(conf.f2, conf.a), 1e-9, 1e-9);
    return (continua && mesmaInclinacao ? 0 : 1) === campo.correta ? null : 'conclusão sobre a derivabilidade errada';
  }
  if (campo.tipo === 'conjunto') {
    let esperados;
    if (conf.tipo === 'criticos') {
      const df = (x) => d1(conf.f, x);
      const criticos = raizes(df, ...conf.intervalo);
      const tipo = (r) => {
        const [esq, dir] = [df(r - 1e-4), df(r + 1e-4)];
        return esq > 0 && dir < 0 ? 'max' : esq < 0 && dir > 0 ? 'min' : 'nenhum';
      };
      esperados = { criticos, maximos: criticos.filter((r) => tipo(r) === 'max'), minimos: criticos.filter((r) => tipo(r) === 'min') }[campo.id];
    } else if (conf.tipo === 'inflexao') {
      const d2 = derivadaTexto(conf.f, 'x', 2);
      const g = (x) => avaliar(d2, { x });
      esperados = raizes(g, ...conf.intervalo).filter((r) => g(r - 1e-4) * g(r + 1e-4) < 0);
    } else if (conf.tipo === 'tvm') {
      const media = (avaliar(conf.f, { x: conf.b }) - avaliar(conf.f, { x: conf.a })) / (conf.b - conf.a);
      esperados = raizes((x) => d1(conf.f, x) - media, conf.a, conf.b);
    } else return `conferência ${conf.tipo} inesperada para conjunto`;
    if (!esperados) return `campo ${campo.id} sem referência`;
    return conjuntoIgual(valores, esperados) ? null : `valores [${valores.map((v) => v.toFixed(5))}] ≠ esperados [${esperados.map((v) => v.toFixed(5))}]`;
  }
  if (campo.tipo === 'reta') {
    const m0 = d1(conf.f, conf.a);
    const m = conf.normal ? -1 / m0 : m0;
    const b = avaliar(conf.f, { x: conf.a }) - m * conf.a;
    const [b1, m1] = [avaliar(ref, { x: 0 }), avaliar(ref, { x: 1 }) - avaliar(ref, { x: 0 })];
    return perto(m, m1, 1e-7, 1e-9) && perto(b, b1, 1e-7, 1e-9) ? null : `reta y = ${m1}x + ${b1}, esperada y = ${m}x + ${b}`;
  }
  if (campo.tipo === 'implicita' || conf.tipo === 'implicita') {
    const dydx = derivadaImplicita(conf.F);
    const pontos = pontosDaCurva(conf.F, { x: conf.x, y: conf.y, quantos: 10 });
    let validos = 0;
    for (const { x, y } of pontos) {
      const [e, o] = [dydx(x, y), avaliar(ref, { x, y })];
      if (!Number.isFinite(e) || !Number.isFinite(o)) continue;
      validos += 1;
      if (!perto(o, e, 1e-6, 1e-8)) return `dy/dx em (${x.toFixed(3)}, ${y.toFixed(3)}): ${o} ≠ ${e}`;
    }
    return validos >= 4 ? null : `só ${validos} ponto(s) da curva para comparar`;
  }
  if (campo.tipo === 'expressao') {
    let alvo;
    if (conf.tipo === 'derivada') alvo = derivadaTexto(conf.f, conf.var ?? 'x', conf.ordem ?? 1);
    else if (conf.tipo === 'inflexao' && campo.id === 'segunda') alvo = derivadaTexto(conf.f, 'x', 2);
    else return `conferência ${conf.tipo} inesperada para expressão`;
    const r = compararFuncoes(ref, alvo, { vars: campo.variaveis ?? ['x'], dom: campo.dominio ?? [-3, 3], minimo: 5, tolAbs: 1e-7 });
    return r.ok ? null : r.motivo;
  }
  const esperado = esperadoNumero(conf);
  if (esperado === undefined) return `conferência ${conf.tipo} desconhecida`;
  const obtido = avaliar(ref);
  return perto(obtido, esperado, conf.tipo === 'limite' ? 1e-5 : 1e-6, 1e-6) ? null : `valor ${obtido}, esperado ${esperado}`;
}

/** A resposta exibida (LaTeX) diz o mesmo que a resposta interna? */
function conferirLatexDaResposta(campo) {
  if (campo.tipo === 'escolha' || campo.tipo === 'conjunto') return null;
  const partes = segmentos(campo.respostaLatex);
  const fonte = campo.tipo === 'reta' ? partes.at(-1) : partes[0];
  let expr;
  try { expr = texParaMath(fonte); } catch (erro) { return `LaTeX da resposta ilegível: ${erro.message}`; }
  if (campo.tipo === 'numero') {
    const [a, b] = [avaliar(expr), avaliar(campo.respostaExpr)];
    if (!perto(a, b, 1e-9, 1e-12)) return `LaTeX da resposta vale ${a}, resposta interna ${b}`;
    if (partes.length > 1) {
      const aprox = avaliar(texParaMath(partes[1]));
      if (!perto(aprox, b, 1e-2, 1e-2)) return `aproximação ${aprox} longe de ${b}`;
    }
    return null;
  }
  const vars = campo.variaveis ?? ['x'];
  const opcoes = campo.tipo === 'implicita'
    ? { vars: ['x', 'y'], dom: { x: [0.3, 2.5], y: [0.4, 2.7] }, minimo: 5 }
    : { vars, dom: campo.dominio ?? [-3, 3], minimo: 5 };
  const r = compararFuncoes(expr, campo.respostaExpr, opcoes);
  return r.ok ? null : `LaTeX da resposta difere da interna: ${r.motivo}`;
}

/** Todas as fórmulas e textos da questão. */
function partesDaQuestao(q) {
  const textos = [
    ['enunciado', q.enunciado],
    ...q.dicas.map((d, i) => [`dica ${i + 1}`, d]),
    ...q.passos.map((p, i) => [`passo ${i + 1} (texto)`, p.txt]),
    ...q.campos.flatMap((c) => (c.errosComuns ?? []).map((e, i) => [`erro comum ${i + 1}`, e.msg])),
  ];
  const formulas = [
    ...q.passos.map((p, i) => [`passo ${i + 1}`, p.tex, true]),
    ...q.campos.flatMap((c) => [[`resposta ${c.id}`, c.respostaLatex, true], ...(c.rotulo ? [[`rótulo ${c.id}`, c.rotulo, false]] : [])]),
    ...textos.flatMap(([onde, t]) => formulasDoTexto(t).map((f) => [onde, f.fonte, f.destaque])),
  ];
  return { textos, formulas };
}

/**
 * Confere uma questão gerada. Devolve a lista de problemas (vazia se tudo certo).
 */
export function conferirQuestao(q, { verificador = true } = {}) {
  const problemas = [];
  if (!q.enunciado || q.passos.length < 2 || q.dicas.length < 2 || !q.campos.length) problemas.push('estrutura incompleta (enunciado, ≥2 passos, ≥2 dicas, campos)');
  for (const p of q.passos) if (!p.tex || !p.txt) problemas.push('passo sem expressão ou sem justificativa');

  const { textos, formulas } = partesDaQuestao(q);
  for (const [onde, texto] of textos) {
    const s = sujeirasDeTexto(texto);
    if (s.length) problemas.push(`${onde}: texto com ${s.join(', ')}`);
  }
  for (const [onde, fonte, destaque] of formulas) {
    const erro = renderiza(fonte, destaque);
    if (erro) problemas.push(`${onde}: KaTeX não renderiza "${fonte}" (${erro.slice(0, 80)})`);
    // rótulos terminam em "=" ou "≈" de propósito (o campo de resposta vem depois)
    const s = sujeiras(onde.startsWith('rótulo') ? fonte.replace(/\s*(?:=|\\approx)\s*$/, '') : fonte);
    if (s.length) problemas.push(`${onde}: LaTeX sujo (${s.join(', ')}) em "${fonte}"`);
  }

  for (const campo of q.campos) {
    const erroResposta = conferirResposta(q, campo);
    if (erroResposta) problemas.push(`resposta ${campo.id} errada: ${erroResposta}`);
    const erroLatex = conferirLatexDaResposta(campo);
    if (erroLatex) problemas.push(`campo ${campo.id}: ${erroLatex}`);
    if (verificador) {
      const certa = campo.tipo === 'escolha' ? String(campo.correta) : campo.respostaExpr;
      const r = verificarCampo(campo, certa, math);
      if (r.estado !== 'correto') problemas.push(`verificador recusou a resposta certa de ${campo.id} (${certa}): ${r.mensagem}`);
      const errada = campo.tipo === 'escolha' ? String(1 - campo.correta)
        : campo.tipo === 'conjunto' ? `${campo.respostaExpr === 'nenhum' ? '' : `${campo.respostaExpr}; `}123`
          : campo.tipo === 'implicita' ? `(${campo.respostaExpr}) + x + 3` : `(${campo.respostaExpr}) + 1`;
      const r2 = verificarCampo(campo, errada, math);
      if (r2.estado === 'correto') problemas.push(`verificador aceitou uma resposta errada em ${campo.id}: ${errada}`);
    }
  }
  return problemas;
}
