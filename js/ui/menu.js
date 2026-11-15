// Menu lateral: índice das seções com destaque da seção atual e marca de
// "estudada". Em telas largas fica fixo na página de teoria; em telas
// estreitas vira uma gaveta aberta pelo botão do cabeçalho (em todas as páginas).

import { h, $ } from './dom.js';
import { GRUPOS, SECOES, urlSecao } from '../conteudo/indice.js';
import { secoesEstudadas } from './armazenamento.js';

const PRINCIPAL = [
  { href: 'index.html', rotulo: 'Início', pagina: 'inicio' },
  { href: 'teoria.html', rotulo: 'Teoria', pagina: 'teoria' },
  { href: 'praticar.html', rotulo: 'Praticar', pagina: 'praticar' },
  { href: 'teoria.html?s=tabela-resumo', rotulo: 'Colinha', pagina: 'colinha' },
];

let secaoAtual = null;

function montarLista() {
  const estudadas = secoesEstudadas();
  const lista = h('ul', { class: 'lista-secoes' });
  for (const grupo of GRUPOS) {
    const secoes = SECOES.filter((s) => s.grupo === grupo.id);
    lista.append(
      h('li', null,
        h('p', { class: 'lista-secoes__grupo', id: `grupo-${grupo.id}` }, grupo.titulo),
        h('ul', { 'aria-labelledby': `grupo-${grupo.id}` },
          secoes.map((secao) =>
            h('li', null,
              h('a', {
                href: urlSecao(secao.id),
                dataset: { secao: secao.id, estudada: String(estudadas.has(secao.id)) },
                'aria-current': secao.id === secaoAtual ? 'page' : null,
              },
                h('span', { class: 'lista-secoes__num' }, secao.num),
                h('span', null, secao.curto),
                h('span', { class: 'lista-secoes__ok', title: 'Seção estudada' },
                  '✓', h('span', { class: 'sr-only' }, ' (estudada)')),
              ),
            ),
          ),
        ),
      ),
    );
  }
  return lista;
}

function atualizarProgresso() {
  const estudadas = secoesEstudadas();
  const feitas = SECOES.filter((s) => estudadas.has(s.id)).length;
  const texto = $('#menu-progresso-texto');
  const barra = $('#menu-progresso-barra');
  if (texto) texto.textContent = `${feitas} de ${SECOES.length} seções estudadas`;
  if (barra) barra.style.width = `${(100 * feitas) / SECOES.length}%`;
}

function atualizarMarcas() {
  const estudadas = secoesEstudadas();
  for (const link of document.querySelectorAll('.lista-secoes a[data-secao]')) {
    link.dataset.estudada = String(estudadas.has(link.dataset.secao));
  }
  atualizarProgresso();
}

/** Destaca a seção atual no menu (chamado pela página de teoria a cada navegação). */
export function destacarSecao(id) {
  secaoAtual = id;
  for (const link of document.querySelectorAll('.lista-secoes a[data-secao]')) {
    if (link.dataset.secao === id) {
      link.setAttribute('aria-current', 'page');
      // Mantém o item visível dentro do menu rolável.
      const menu = link.closest('.lateral');
      if (menu && menu.scrollHeight > menu.clientHeight) {
        const r = link.getBoundingClientRect();
        const m = menu.getBoundingClientRect();
        if (r.top < m.top + 40 || r.bottom > m.bottom - 40) {
          menu.scrollTop += r.top - m.top - menu.clientHeight / 2;
        }
      }
    } else {
      link.removeAttribute('aria-current');
    }
  }
}

function fecharMenu() {
  if (document.body.dataset.menu !== 'aberto') return;
  delete document.body.dataset.menu;
  const botao = $('#btn-menu');
  botao?.setAttribute('aria-expanded', 'false');
  botao?.setAttribute('aria-label', 'Abrir menu');
}

function abrirMenu() {
  document.body.dataset.menu = 'aberto';
  const botao = $('#btn-menu');
  botao?.setAttribute('aria-expanded', 'true');
  botao?.setAttribute('aria-label', 'Fechar menu');
  $('#menu-lateral a')?.focus({ preventScroll: true });
}

export function iniciarMenu() {
  const lateral = $('#menu-lateral');
  if (!lateral) return;
  const pagina = document.body.dataset.pagina;
  const params = new URLSearchParams(location.search);
  const naColinha = pagina === 'teoria' && params.get('s') === 'tabela-resumo';

  lateral.replaceChildren(
    h('nav', { class: 'lateral__principal', 'aria-label': 'Páginas' },
      PRINCIPAL.map((item) => {
        const atual = item.pagina === 'colinha' ? naColinha : item.pagina === pagina && !(pagina === 'teoria' && naColinha);
        return h('a', { href: item.href, 'aria-current': atual ? 'page' : null }, item.rotulo);
      }),
    ),
    h('nav', { 'aria-label': 'Seções de teoria' },
      h('p', { class: 'lateral__titulo' }, 'Seções'),
      h('div', { class: 'lateral__progresso' },
        h('span', { id: 'menu-progresso-texto' }),
        h('div', { class: 'medidor', role: 'presentation' }, h('div', { class: 'medidor__fill', id: 'menu-progresso-barra' })),
      ),
      montarLista(),
    ),
  );
  atualizarProgresso();

  const botao = $('#btn-menu');
  botao?.addEventListener('click', () => (document.body.dataset.menu === 'aberto' ? fecharMenu() : abrirMenu()));
  $('#fundo-menu')?.addEventListener('click', fecharMenu);
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && document.body.dataset.menu === 'aberto') {
      fecharMenu();
      botao?.focus();
    }
  });
  lateral.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) fecharMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 920) fecharMenu(); });
  document.addEventListener('derivadas:estudadas', atualizarMarcas);
  window.addEventListener('storage', atualizarMarcas);

  // Destaque do link da barra superior.
  for (const link of document.querySelectorAll('.topo__nav a')) {
    const item = PRINCIPAL.find((p) => p.href === link.getAttribute('href'));
    if (!item) continue;
    const atual = item.pagina === 'colinha' ? naColinha : item.pagina === pagina && !(pagina === 'teoria' && naColinha);
    if (atual) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  }
}

/** Atualiza o destaque "Teoria × Colinha" quando a seção muda sem recarregar a página. */
export function atualizarNavegacaoPrincipal(idSecao) {
  const naColinha = idSecao === 'tabela-resumo';
  for (const link of document.querySelectorAll('.topo__nav a, .lateral__principal a')) {
    const href = link.getAttribute('href');
    const atual = href === 'teoria.html?s=tabela-resumo' ? naColinha : href === 'teoria.html' ? !naColinha : false;
    if (atual) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  }
}
