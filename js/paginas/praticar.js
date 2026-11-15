// Página do gerador de questões (implementada na etapa do gerador).

import { h, $ } from '../ui/dom.js';

export function iniciar() {
  $('#praticar')?.replaceChildren(
    h('p', { class: 'caixa caixa--nota' }, 'O gerador de questões está sendo montado. Enquanto isso, estude pela teoria.'),
  );
}
