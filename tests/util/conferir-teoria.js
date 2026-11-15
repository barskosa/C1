// Conferência matemática dos exemplos resolvidos (e exercícios) da teoria.
//
// Cada exemplo declara em `confere` o que é a resposta certa, em termos que o
// math.js sabe calcular, e marca com `c` os passos cuja fórmula EXIBIDA deve
// bater com essa referência. A fórmula em LaTeX é convertida de volta para
// expressão (tex2math) e comparada numericamente.
//
// Referências aceitas (em `confere` do exemplo ou no `c` de um passo):
//   { derivada: 'f(x)', var, ordem, dom }  o trecho deve ser a derivada de f
//   { igual: 'expr', vars, dom }           o trecho deve ser igual à expressão
//   { valor: número | 'expr' | (m) => número, tol }   o trecho deve ter esse valor
//   { reta: { f, a, normal } | { m, b } }  a equação do passo deve ser essa reta
//   { implicita: 'F(x, y)', x, y }         o trecho deve ser dy/dx sobre a curva F = 0
//   { limite: { f, a, lado }, tol }        o trecho deve ser o valor do limite
//   { fn: (m) => boolean }                 conferência livre
//   { conceitual: 'motivo' }               exemplo sem conta a conferir
// Opção `seg`: 'todos' (padrão: todos os trechos depois do primeiro "="),
// 'ultimo', 'tudo' (inclui o primeiro) ou um índice.

import { texParaMath, segmentos } from './tex2math.js';
import {
  math, avaliar, derivada, perto, compararFuncoes, limiteNumerico, pontosDaCurva, derivadaImplicita,
} from './numerico.js';

const ajuda = {
  math,
  num: (expr, escopo) => avaliar(expr, escopo),
  d: (f, x0, variavel = 'x', ordem = 1) => avaliar(derivada(f, variavel, ordem), { [variavel]: x0 }),
  lim: limiteNumerico,
  perto,
};

function valorEsperado(valor) {
  if (typeof valor === 'function') return valor(ajuda);
  if (typeof valor === 'string') return avaliar(valor);
  return valor;
}

function trechos(tex, modo = 'todos') {
  const partes = segmentos(tex);
  if (modo === 'tudo' || partes.length === 1) return partes;
  if (modo === 'ultimo') return partes.slice(-1);
  if (typeof modo === 'number') return [partes.at(modo)];
  if (Array.isArray(modo)) return modo.map((i) => partes.at(i));
  return partes.slice(1);
}

function conferirTrecho(ref, trechoTex) {
  const expr = texParaMath(trechoTex);
  if (ref.derivada != null) {
    const alvo = derivada(ref.derivada, ref.var ?? 'x', ref.ordem ?? 1);
    return compararFuncoes(expr, alvo, { vars: [ref.var ?? 'x'], dom: ref.dom, tol: ref.tol });
  }
  if (ref.igual != null) {
    return compararFuncoes(expr, ref.igual, { vars: ref.vars ?? [ref.var ?? 'x'], dom: ref.dom, tol: ref.tol, fixos: ref.fixos });
  }
  if (ref.valor != null) {
    const esperado = valorEsperado(ref.valor);
    const obtido = avaliar(expr, ref.fixos ?? {});
    return perto(obtido, esperado, ref.tol ?? 1e-6)
      ? { ok: true }
      : { ok: false, motivo: `valor ${obtido}, esperado ${esperado}` };
  }
  if (ref.limite != null) {
    const { f, a, lado } = ref.limite;
    const esperado = limiteNumerico(f, a, lado, ref.limite.var ?? 'x');
    const obtido = avaliar(expr);
    return perto(obtido, esperado, ref.tol ?? 2e-3, 2e-3)
      ? { ok: true }
      : { ok: false, motivo: `valor ${obtido}, limite numérico ${esperado}` };
  }
  if (ref.implicita != null) {
    const dydx = derivadaImplicita(ref.implicita);
    const pontos = pontosDaCurva(ref.implicita, { x: ref.x, y: ref.y });
    let validos = 0;
    for (const { x, y } of pontos) {
      const esperado = dydx(x, y);
      const obtido = avaliar(expr, { x, y });
      if (Number.isNaN(esperado) || Number.isNaN(obtido)) continue;
      validos += 1;
      if (!perto(obtido, esperado, 1e-5, 1e-7)) {
        return { ok: false, motivo: `em (${x.toFixed(3)}, ${y.toFixed(3)}): ${obtido} ≠ ${esperado}` };
      }
    }
    return validos >= 5 ? { ok: true } : { ok: false, motivo: `só ${validos} ponto(s) da curva para comparar` };
  }
  return { ok: false, motivo: 'referência de conferência não reconhecida' };
}

/** Confere uma equação de reta ("y = ..." ou "y - y0 = m(x - x0)") contra a reta esperada. */
function conferirReta(ref, tex) {
  let m;
  let b;
  if (ref.reta.f != null) {
    const { f, a } = ref.reta;
    const inclinacao = avaliar(derivada(f, 'x'), { x: a });
    const y0 = avaliar(f, { x: a });
    m = ref.reta.normal ? -1 / inclinacao : inclinacao;
    b = y0 - m * a;
  } else {
    ({ m, b } = ref.reta);
    m = valorEsperado(m);
    b = valorEsperado(b);
  }
  if (!Number.isFinite(m) || !Number.isFinite(b)) return { ok: false, motivo: 'reta de referência indefinida' };
  const lados = segmentos(tex).map(texParaMath);
  if (lados.length < 2) return { ok: false, motivo: 'a linha não é uma equação' };
  for (const x of [-1.7, 0.4, 2.3]) {
    const escopo = { x, y: m * x + b };
    const primeiro = avaliar(lados[0], escopo);
    for (const lado of lados.slice(1)) {
      const valor = avaliar(lado, escopo);
      if (!perto(primeiro, valor, 1e-6, 1e-8)) {
        return { ok: false, motivo: `a reta esperada (m = ${m}, b = ${b}) não satisfaz a equação em x = ${x}` };
      }
    }
  }
  // Um ponto fora da reta não pode satisfazer a equação (senão ela é uma identidade).
  const fora = { x: 0.9, y: m * 0.9 + b + 1.3 };
  if (perto(avaliar(lados[0], fora), avaliar(lados.at(-1), fora), 1e-6, 1e-8)) {
    return { ok: false, motivo: 'a equação vale também fora da reta' };
  }
  return { ok: true };
}

function conferirPasso(ref, tex) {
  const resultados = [];
  try {
    if (ref.fn) {
      const partes = segmentos(tex);
      const ok = ref.fn({ ...ajuda, partes, exprs: () => partes.map(texParaMath) });
      resultados.push(ok === false ? { ok: false, motivo: 'conferência livre falhou' } : { ok: true });
    } else if (ref.reta) {
      resultados.push(conferirReta(ref, tex));
    } else {
      const lista = trechos(tex, ref.seg);
      if (!lista.length) resultados.push({ ok: false, motivo: 'nenhum trecho para conferir' });
      for (const trecho of lista) resultados.push({ ...conferirTrecho(ref, trecho), trecho });
    }
  } catch (erro) {
    resultados.push({ ok: false, motivo: erro.message });
  }
  return resultados;
}

/**
 * Confere todos os exemplos e exercícios de uma seção.
 * @returns {{exemplos: number, verificacoes: number, falhas: string[], semConferencia: string[]}}
 */
export function conferirSecao(modulo) {
  const relatorio = { exemplos: 0, verificacoes: 0, falhas: [], semConferencia: [] };
  let numero = 0;
  for (const bloco of modulo.blocos ?? []) {
    if (bloco.exemplo) {
      numero += 1;
      relatorio.exemplos += 1;
      const exemplo = bloco.exemplo;
      const nome = `Exemplo ${numero} (${exemplo.titulo ?? 'sem título'})`;
      const padrao = exemplo.confere;
      if (!padrao) { relatorio.semConferencia.push(nome); continue; }
      if (padrao.conceitual) continue;
      let conferidos = 0;
      exemplo.passos.forEach((passo, i) => {
        if (!passo.c) return;
        const ref = passo.c === true || passo.c === 1 ? { ...padrao } : { ...passo.c };
        if (ref.seg == null && passo.seg != null) ref.seg = passo.seg;
        for (const r of conferirPasso(ref, passo.tex)) {
          conferidos += 1;
          relatorio.verificacoes += 1;
          if (!r.ok) relatorio.falhas.push(`${nome}, passo ${i + 1}${r.trecho ? ` [${r.trecho}]` : ''}: ${r.motivo}`);
        }
      });
      if (conferidos === 0) relatorio.semConferencia.push(`${nome}: nenhum passo marcado para conferência`);
    }
    if (bloco.exercicios) {
      bloco.exercicios.forEach((item, i) => {
        if (!item.c) return;
        const lista = Array.isArray(item.c) ? item.c : [item.c];
        for (const ref of lista) {
          if (!item.r.includes(ref.tex)) {
            relatorio.falhas.push(`Exercício ${i + 1}: a fórmula conferida não aparece na resposta exibida (${ref.tex})`);
            continue;
          }
          for (const r of conferirPasso({ seg: 'tudo', ...ref }, ref.tex)) {
            relatorio.verificacoes += 1;
            if (!r.ok) relatorio.falhas.push(`Exercício ${i + 1} [${ref.tex}]: ${r.motivo}`);
          }
        }
      });
    }
  }
  return relatorio;
}
