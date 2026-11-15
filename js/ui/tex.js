// Renderização de fórmulas com KaTeX.
// O conteúdo usa \( ... \) para fórmulas no meio do texto e \[ ... \] para
// fórmulas em destaque. As macros abaixo dão a notação usada no Brasil.

/** Atalho para escrever LaTeX sem precisar duplicar as barras invertidas. */
export const R = String.raw;

export const MACROS = Object.freeze({
  '\\sen': '\\operatorname{sen}',
  '\\tg': '\\operatorname{tg}',
  '\\cotg': '\\operatorname{cotg}',
  '\\cossec': '\\operatorname{cossec}',
  '\\arcsen': '\\operatorname{arcsen}',
  '\\arctg': '\\operatorname{arctg}',
  '\\arccotg': '\\operatorname{arccotg}',
  '\\arcsec': '\\operatorname{arcsec}',
  '\\arccossec': '\\operatorname{arccossec}',
  '\\dd': '\\mathrm{d}',
  '\\R': '\\mathbb{R}',
});

const escaparHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Converte uma fórmula LaTeX em HTML (string). Nunca lança erro na página. */
export function tex(fonte, destaque = false) {
  const katex = globalThis.katex;
  if (!katex) return `<code>${escaparHtml(fonte)}</code>`;
  try {
    return katex.renderToString(String(fonte), {
      displayMode: destaque,
      throwOnError: true,
      strict: 'ignore',
      trust: false,
      macros: { ...MACROS },
    });
  } catch (erro) {
    console.error('Fórmula inválida:', fonte, erro);
    return `<span class="erro-tex" title="${escaparHtml(erro.message)}">${escaparHtml(fonte)}</span>`;
  }
}

const RE_DESTAQUE = /\\\[([\s\S]+?)\\\]/g;
const RE_LINHA = /\\\(([\s\S]+?)\\\)/g;

/** Substitui \( ... \) e \[ ... \] dentro de um trecho de HTML pelas fórmulas renderizadas. */
export function mathHtml(html) {
  return String(html)
    .replace(RE_DESTAQUE, (_, fonte) => tex(fonte.trim(), true))
    .replace(RE_LINHA, (_, fonte) => tex(fonte.trim(), false));
}

/** Lista as fórmulas de um trecho de HTML (usado pelos testes). */
export function extrairFormulas(html) {
  const formulas = [];
  const texto = String(html);
  for (const m of texto.matchAll(RE_DESTAQUE)) formulas.push({ fonte: m[1].trim(), destaque: true });
  for (const m of texto.replace(RE_DESTAQUE, ' ').matchAll(RE_LINHA)) formulas.push({ fonte: m[1].trim(), destaque: false });
  return formulas;
}

/** Renderiza uma fórmula dentro de um elemento já existente. */
export function texEm(elemento, fonte, destaque = false) {
  elemento.innerHTML = tex(fonte, destaque);
  return elemento;
}
