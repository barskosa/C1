// Pequenos utilitários de DOM usados por todas as páginas.

/**
 * Cria um elemento. `props` aceita: class, html, text, dataset, on<Evento> e
 * atributos comuns (valores null/false são ignorados; true vira atributo vazio).
 */
export function h(tag, props, ...filhos) {
  const el = document.createElement(tag);
  for (const [chave, valor] of Object.entries(props || {})) {
    if (valor == null || valor === false) continue;
    if (chave === 'class') el.className = valor;
    else if (chave === 'html') el.innerHTML = valor;
    else if (chave === 'text') el.textContent = valor;
    else if (chave === 'dataset') Object.assign(el.dataset, valor);
    else if (chave.startsWith('on') && typeof valor === 'function') el.addEventListener(chave.slice(2).toLowerCase(), valor);
    else if (valor === true) el.setAttribute(chave, '');
    else el.setAttribute(chave, String(valor));
  }
  acrescentar(el, filhos);
  return el;
}

export function acrescentar(el, filhos) {
  for (const filho of [filhos].flat(Infinity)) {
    if (filho == null || filho === false) continue;
    el.append(filho instanceof Node ? filho : document.createTextNode(String(filho)));
  }
  return el;
}

export const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
export const $$ = (seletor, raiz = document) => Array.from(raiz.querySelectorAll(seletor));

/** Transforma um título em identificador de âncora (sem acentos). */
export function slug(texto) {
  return String(texto)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export const prefereMenosMovimento = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Rola até o elemento apenas se ele não estiver inteiro na tela. */
export function rolarSeNecessario(el) {
  const r = el.getBoundingClientRect();
  const alturaTela = window.innerHeight || document.documentElement.clientHeight;
  if (r.top < 72 || r.bottom > alturaTela - 16) {
    el.scrollIntoView({ block: 'nearest', behavior: prefereMenosMovimento() ? 'auto' : 'smooth' });
  }
}
