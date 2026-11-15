// Componente de resolução passo a passo.
// Cada passo tem uma expressão em LaTeX (`tex`) e uma justificativa (`txt`).
// No modo "revelar", os passos aparecem um por vez ("Próximo passo") ou todos
// de uma vez ("Mostrar tudo"). No modo "aberto", a lista já aparece completa.

import { h, rolarSeNecessario } from './dom.js';
import { tex, mathHtml } from './tex.js';

function criarPasso(passo, novo) {
  return h('li', { class: novo ? 'passo passo--novo' : 'passo' },
    passo.tex ? h('div', { class: 'passo__tex', html: tex(passo.tex, true) }) : null,
    passo.txt ? h('div', { class: 'passo__txt', html: mathHtml(passo.txt) }) : null,
  );
}

/**
 * @param {{tex?: string, txt?: string}[]} passos
 * @param {{modo?: 'revelar'|'aberto', convite?: string}} [opcoes]
 */
export function criarPassos(passos, opcoes = {}) {
  const modo = opcoes.modo ?? 'revelar';
  const lista = h('ol', { class: 'passos__lista', 'aria-live': 'polite' });
  const raiz = h('div', { class: 'passos' });

  if (modo === 'aberto') {
    for (const passo of passos) lista.append(criarPasso(passo, false));
    raiz.append(lista);
    return raiz;
  }

  let visiveis = 0;
  const contagem = h('span', { class: 'passos__contagem', 'aria-hidden': 'true' });
  const convite = h('p', { class: 'passos__convite' },
    opcoes.convite ?? 'Tente resolver sozinho antes; depois revele os passos para conferir.');
  const btnProximo = h('button', { type: 'button', class: 'btn btn--primario btn--pequeno' }, 'Próximo passo');
  const btnTudo = h('button', { type: 'button', class: 'btn btn--pequeno' }, 'Mostrar tudo');
  const btnOcultar = h('button', { type: 'button', class: 'btn btn--sutil btn--pequeno', hidden: true }, 'Recolher');

  const atualizar = () => {
    const completo = visiveis >= passos.length;
    contagem.textContent = `Passo ${visiveis} de ${passos.length}`;
    convite.hidden = visiveis > 0;
    btnProximo.hidden = completo;
    btnTudo.hidden = completo;
    btnOcultar.hidden = visiveis === 0;
    btnProximo.textContent = visiveis === 0 ? 'Ver o primeiro passo' : 'Próximo passo';
  };

  const revelar = (quantos, rolar) => {
    let ultimo = null;
    while (visiveis < passos.length && quantos-- > 0) {
      ultimo = criarPasso(passos[visiveis], true);
      lista.append(ultimo);
      visiveis += 1;
    }
    atualizar();
    if (ultimo && rolar) rolarSeNecessario(ultimo);
  };

  btnProximo.addEventListener('click', () => revelar(1, true));
  btnTudo.addEventListener('click', () => revelar(passos.length, false));
  btnOcultar.addEventListener('click', () => {
    lista.replaceChildren();
    visiveis = 0;
    atualizar();
    btnProximo.focus();
  });

  raiz.append(convite, lista, h('div', { class: 'passos__controles' }, btnProximo, btnTudo, btnOcultar, contagem));
  atualizar();
  return raiz;
}
