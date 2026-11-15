// Controles reutilizados pelos gráficos interativos: controle deslizante com
// rótulo e valor, seletor de opções, caixa de marcação e painel de leitura.
// Todos são elementos nativos (acessíveis por teclado) com <label> associado.

import { h } from '../ui/dom.js';
import { numeroBr } from './plano.js';

let serie = 0;
const novoId = (prefixo) => `${prefixo}-${++serie}`;

/**
 * Controle deslizante. `formatar(valor)` devolve o texto mostrado ao lado.
 * @returns {{el: HTMLElement, valor: number, definir(v: number, avisar?: boolean): void}}
 */
export function deslizante({ rotulo, min, max, passo = 0.01, valor, formatar = (v) => numeroBr(v, 2), aoMudar }) {
  const id = novoId('deslizante');
  const entrada = h('input', { type: 'range', id, min, max, step: passo, value: valor });
  const saida = h('output', { for: id }, formatar(Number(valor)));
  const el = h('div', { class: 'controle' }, h('label', { for: id }, rotulo), entrada, saida);
  const api = {
    el,
    get valor() { return Number(entrada.value); },
    definir(v, avisar = false) {
      entrada.value = String(v);
      saida.textContent = formatar(Number(entrada.value));
      if (avisar) aoMudar?.(Number(entrada.value));
    },
  };
  entrada.addEventListener('input', () => {
    saida.textContent = formatar(Number(entrada.value));
    aoMudar?.(Number(entrada.value));
  });
  return api;
}

/** Seletor (<select>) com rótulo. `opcoes`: [{ valor, rotulo }]. */
export function seletor({ rotulo, opcoes, valor, aoMudar }) {
  const id = novoId('seletor');
  const campo = h('select', { id, class: 'seletor' },
    opcoes.map((o) => h('option', { value: o.valor, selected: o.valor === valor }, o.rotulo)));
  campo.addEventListener('change', () => aoMudar?.(campo.value));
  return { el: h('div', { class: 'painel-widget__linha' }, h('label', { for: id }, rotulo), campo), get valor() { return campo.value; } };
}

/** Caixa de marcação com rótulo. */
export function marcacao({ rotulo, marcado = false, aoMudar }) {
  const id = novoId('marcacao');
  const campo = h('input', { type: 'checkbox', id, checked: marcado });
  campo.addEventListener('change', () => aoMudar?.(campo.checked));
  return { el: h('div', { class: 'painel-widget__linha' }, campo, h('label', { for: id }, rotulo)), get marcado() { return campo.checked; } };
}

/**
 * Painel de leitura: pares rótulo/valor atualizáveis.
 * `itens`: [{ chave, rotulo, destaque }]. Use `definir(chave, texto)`.
 */
export function leitura(itens) {
  const valores = new Map();
  const el = h('div', { class: 'leitura-widget', role: 'status', 'aria-live': 'off' },
    itens.map((item) => {
      const numero = h('div', { class: 'numero' }, '—');
      valores.set(item.chave, numero);
      return h('div', { class: item.destaque ? 'destaque' : null }, h('div', { class: 'rotulo' }, item.rotulo), numero);
    }));
  return { el, definir(chave, texto) { const no = valores.get(chave); if (no) no.textContent = texto; } };
}

/** Anima um valor de `de` até `ate`; devolve função para cancelar. */
export function animar({ de, ate, duracao = 2600, aoQuadro, aoFim }) {
  let cancelado = false;
  let inicio = null;
  const reduzido = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduzido) {
    aoQuadro(ate);
    aoFim?.();
    return () => {};
  }
  const quadro = (agora) => {
    if (cancelado) return;
    inicio ??= agora;
    const t = Math.min(1, (agora - inicio) / duracao);
    const suave = 1 - (1 - t) ** 3;
    aoQuadro(de + (ate - de) * suave);
    if (t < 1) requestAnimationFrame(quadro); else aoFim?.();
  };
  requestAnimationFrame(quadro);
  return () => { cancelado = true; };
}
