// Utilitários de teste para fórmulas: renderização estrita no KaTeX e
// detecção de LaTeX "sujo" (1x, x^1, + -, NaN ...).

import katex from 'katex';
import { MACROS, extrairFormulas } from '../../js/ui/tex.js';

/** Lança erro se o KaTeX não conseguir renderizar a fórmula. */
export function renderizar(fonte, destaque = false) {
  return katex.renderToString(fonte, {
    displayMode: destaque,
    throwOnError: true,
    strict: (codigo) => (codigo === 'unicodeTextInMathMode' || codigo === 'htmlExtension' ? 'ignore' : 'error'),
    macros: { ...MACROS },
  });
}

/** Devolve a mensagem de erro do KaTeX, ou null se a fórmula é válida. */
export function erroDeRenderizacao(fonte, destaque = false) {
  try {
    renderizar(fonte, destaque);
    return null;
  } catch (erro) {
    return erro.message;
  }
}

/** Todas as fórmulas \( ... \) e \[ ... \] de um texto com HTML. */
export function formulasDoTexto(texto) {
  return extrairFormulas(texto);
}

// Padrões que nunca podem aparecer em LaTeX gerado. Os lookbehinds evitam
// falsos positivos como "11x", "10x" ou "x^{10}".
// Depois de um "1" ou "0" solto, estes comandos são aceitáveis (operadores,
// espaços, relações, texto); qualquer outro comando, letra ou parêntese
// indicaria um coeficiente 1 ou 0 escrito à toa, como em "1x" ou "0\cos x".
const COMANDOS_NEUTROS = 'cdot|times|quad|qquad|text|right|to|le|ge|lt|gt|leq|geq|neq|ne|approx|in|pm|mp|end|Rightarrow|implies|iff|ldots|dots|cdots';
const coeficienteSolto = (digito) => new RegExp(
  String.raw`(?<![\d.,}])${digito}\s*(?:[a-zA-Z(]|\\(?!(?:${COMANDOS_NEUTROS})(?![a-zA-Z])|[,;!:%\\{} ]))`,
);

export const PADROES_PROIBIDOS = [
  { nome: 'NaN', re: /NaN/ },
  { nome: 'undefined', re: /undefined/ },
  { nome: 'null', re: /\bnull\b/ },
  { nome: 'Infinity', re: /Infinity/ },
  { nome: '[object', re: /\[object/ },
  { nome: 'coeficiente 1 explícito (1x)', re: coeficienteSolto('1') },
  { nome: 'coeficiente 0 explícito (0x)', re: coeficienteSolto('0') },
  { nome: 'expoente 1 (x^1)', re: /\^\s*(?:1(?![\d/.,{])|\{\s*1\s*\})/ },
  { nome: 'sinais seguidos (+ -)', re: /\+\s*-/ },
  { nome: 'sinais seguidos (- -)', re: /-\s*-/ },
  { nome: 'sinais seguidos (- +)', re: /-\s*\+/ },
  { nome: 'sinais seguidos (+ +)', re: /\+\s*\+/ },
  { nome: 'operador seguido de sinal (· -)', re: /\\(?:cdot|times)\s*[-+]/ },
  { nome: 'soma com zero (+ 0)', re: /[+-]\s*0(?![\d.,{])/ },
  { nome: 'grupo vazio {}', re: /\{\s*\}/ },
  { nome: 'parênteses vazios ()', re: /\(\s*\)|\\left\(\s*\\right\)/ },
  { nome: 'fração com denominador 1', re: /\\frac\{[^{}]*\}\{1\}/ },
  { nome: 'operador no fim', re: /(?:[-+*/^_=]|\\cdot)\s*$/ },
  { nome: 'operador no começo', re: /^\s*(?:[+*/^_=]|\\cdot)/ },
];

/** Lista os nomes dos padrões proibidos encontrados em uma fórmula LaTeX. */
export function sujeiras(fonte) {
  return PADROES_PROIBIDOS.filter(({ re }) => re.test(fonte)).map(({ nome }) => nome);
}

/** Sujeiras que podem aparecer em texto corrido (fora das fórmulas). */
export function sujeirasDeTexto(texto) {
  const semFormulas = String(texto).replace(/\\\[[\s\S]+?\\\]/g, ' ').replace(/\\\([\s\S]+?\\\)/g, ' ');
  return ['NaN', 'undefined', 'Infinity', '[object'].filter((p) => semFormulas.includes(p));
}
