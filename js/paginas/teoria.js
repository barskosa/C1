// Leitor de teoria: carrega uma seção por vez (teoria.html?s=<id>) e a
// transforma em página a partir dos "blocos" descritos em js/conteudo/.
//
// Tipos de bloco aceitos (um objeto com uma destas chaves):
//   { h2 } { h3 } { html }
//   { caixa: 'definicao'|'teorema'|'formula'|'intuicao'|'nota'|'atencao'|'dica', titulo, html, porque }
//   { exemplo: { titulo, nivel, enunciado, passos: [{ tex, txt }], confere } }
//   { erros: [{ e, c }] }           erro comum e a forma correta
//   { exercicios: [{ q, r }] }      pergunta e resposta escondida
//   { grafico: {...} } | { graficos: [{...}, ...] }   gráficos estáticos (ver js/graficos/plano.js)
//   { widget: 'nome', ... }         gráfico interativo (js/graficos/widgets/<nome>.js)
//   { tabela: { cab, linhas, legenda, classe } }

import { h, $, slug, acrescentar } from '../ui/dom.js';
import { mathHtml } from '../ui/tex.js';
import { icone } from '../ui/icones.js';
import { criarPassos } from '../ui/passos.js';
import { criarGrafico } from '../graficos/plano.js';
import { SECOES, GRUPOS, obterSecao, vizinhas, urlSecao, urlPraticar } from '../conteudo/indice.js';
import { secoesEstudadas, marcarEstudada, registrarUltimaSecao } from '../ui/armazenamento.js';
import { destacarSecao, atualizarNavegacaoPrincipal } from '../ui/menu.js';

const ROTULOS_CAIXA = {
  definicao: ['Definição', 'livro'],
  teorema: ['Teorema', 'teorema'],
  formula: ['Fórmula', 'teorema'],
  intuicao: ['Ideia intuitiva', 'lampada'],
  nota: ['Observação', 'nota'],
  atencao: ['Atenção', 'alerta'],
  dica: ['Dica', 'lampada'],
};

const NIVEIS = { facil: 'fácil', medio: 'médio', dificil: 'difícil' };

let observadorIndice = null;

/** Converte um trecho de HTML (com fórmulas) em nós prontos para inserir. */
function fragmento(html) {
  const molde = document.createElement('template');
  molde.innerHTML = mathHtml(html);
  return molde.content;
}

function criarCaixa(tipo, { rotulo, titulo, html, porque, filhos } = {}) {
  const [rotuloPadrao, nomeIcone] = ROTULOS_CAIXA[tipo] ?? ROTULOS_CAIXA.nota;
  const caixa = h('section', { class: `caixa caixa--${tipo}` },
    h('p', { class: 'caixa__rotulo', html: `${icone(nomeIcone)}<span>${rotulo ?? rotuloPadrao}</span>` }),
    titulo ? h('h3', { class: 'caixa__titulo', html: mathHtml(titulo) }) : null,
  );
  if (html) caixa.append(fragmento(html));
  if (filhos) acrescentar(caixa, filhos);
  if (porque) {
    const detalhes = h('details', { class: 'porque' }, h('summary', null, porque.titulo ?? 'Por que isso é verdade?'));
    detalhes.append(fragmento(porque.html ?? porque));
    caixa.append(detalhes);
  }
  return caixa;
}

function criarExemplo(exemplo, numero) {
  const artigo = h('article', { class: 'exemplo', id: `exemplo-${numero}` },
    h('header', { class: 'exemplo__cabeca' },
      h('p', { class: 'exemplo__rotulo' },
        h('span', null, `Exemplo ${numero}`),
        exemplo.nivel ? h('span', { class: `chip chip--${exemplo.nivel}` }, NIVEIS[exemplo.nivel] ?? exemplo.nivel) : null,
      ),
      exemplo.titulo ? h('h3', { class: 'exemplo__titulo', html: mathHtml(exemplo.titulo) }) : null,
    ),
  );
  const enunciado = h('div', { class: 'exemplo__enunciado' });
  enunciado.append(fragmento(exemplo.enunciado));
  artigo.append(enunciado);
  if (exemplo.grafico) artigo.append(h('div', { class: 'exemplo__enunciado' }, criarFigura(exemplo.grafico)));
  artigo.append(criarPassos(exemplo.passos));
  return artigo;
}

function criarErros(itens) {
  const lista = h('ul', { class: 'lista-erros' });
  for (const item of itens) {
    lista.append(h('li', null,
      h('div', { class: 'lista-erros__errado' }, h('div', { html: `<span class="sr-only">Errado: </span>${mathHtml(item.e)}` })),
      h('div', { class: 'lista-erros__certo' }, h('div', { html: `<span class="sr-only">Certo: </span>${mathHtml(item.c)}` })),
    ));
  }
  return criarCaixa('erros', { rotulo: 'Erros comuns', filhos: [lista] });
}

function criarExercicios(itens) {
  const lista = h('ol', { class: 'lista-exercicios' });
  for (const item of itens) {
    const corpo = h('div', { class: 'resposta__corpo' });
    corpo.append(fragmento(item.r));
    lista.append(h('li', null,
      h('div', null,
        h('div', { html: mathHtml(item.q) }),
        h('details', { class: 'resposta' },
          h('summary', null,
            h('span', { class: 'resposta__ver' }, 'Ver resposta'),
            h('span', { class: 'resposta__ocultar' }, 'Ocultar resposta')),
          corpo,
        ),
      ),
    ));
  }
  return criarCaixa('exercicios', { rotulo: 'Exercícios rápidos', filhos: [lista] });
}

function criarFigura(config) {
  const corpo = h('div', { class: 'figura__corpo' });
  const figura = h('figure', { class: 'figura' }, corpo,
    config.legenda ? h('figcaption', { html: mathHtml(config.legenda) }) : null);
  // O gráfico precisa estar no documento para medir a largura; desenha no próximo quadro.
  requestAnimationFrame(() => criarGrafico(corpo, config));
  return figura;
}

function criarWidget(bloco) {
  const corpo = h('div', { class: 'figura__corpo' }, h('p', { class: 'passos__convite' }, 'Carregando gráfico interativo…'));
  const figura = h('figure', { class: 'figura' }, corpo,
    bloco.legenda ? h('figcaption', { html: mathHtml(bloco.legenda) }) : null);
  import(`../graficos/widgets/${bloco.widget}.js`)
    .then((modulo) => {
      corpo.replaceChildren();
      modulo.montar(corpo, bloco);
    })
    .catch((erro) => {
      console.error(erro);
      corpo.replaceChildren(h('p', { class: 'aviso-erro' }, 'Não foi possível carregar o gráfico interativo.'));
    });
  return figura;
}

function criarTabela({ cab, linhas, legenda, classe }) {
  const tabela = h('table', { class: `tabela ${classe ?? ''}` },
    legenda ? h('caption', { html: mathHtml(legenda) }) : null,
    cab ? h('thead', null, h('tr', null, cab.map((c) => h('th', { scope: 'col', html: mathHtml(c) })))) : null,
    h('tbody', null, linhas.map((linha) => h('tr', null, linha.map((celula) => h('td', { html: mathHtml(celula) }))))),
  );
  return h('div', { class: 'tabela-rolagem', tabindex: '0', role: 'region', 'aria-label': 'Tabela (role horizontalmente se necessário)' }, tabela);
}

function botoesPraticar(secao, classe = 'btn btn--primario') {
  return (secao.praticar ?? []).map(([topico, rotulo], i) =>
    h('a', { class: i === 0 ? classe : 'btn', href: urlPraticar(topico), html: `${icone('praticar')}<span>${rotulo}</span>` }));
}

function renderizarBlocos(blocos, destino) {
  let numeroExemplo = 0;
  const titulos = [];
  for (const bloco of blocos) {
    if (bloco.h2) {
      const id = bloco.id ?? slug(bloco.h2);
      titulos.push({ id, texto: bloco.h2 });
      destino.append(h('h2', { id, html: mathHtml(bloco.h2) }));
    } else if (bloco.h3) {
      destino.append(h('h3', { id: bloco.id ?? slug(bloco.h3), html: mathHtml(bloco.h3) }));
    } else if (bloco.caixa) {
      destino.append(criarCaixa(bloco.caixa, bloco));
    } else if (bloco.html) {
      destino.append(fragmento(bloco.html));
    } else if (bloco.exemplo) {
      destino.append(criarExemplo(bloco.exemplo, ++numeroExemplo));
    } else if (bloco.erros) {
      destino.append(criarErros(bloco.erros));
    } else if (bloco.exercicios) {
      destino.append(criarExercicios(bloco.exercicios));
    } else if (bloco.grafico) {
      destino.append(criarFigura(bloco.grafico));
    } else if (bloco.graficos) {
      destino.append(h('div', { class: 'figura-grade' }, bloco.graficos.map(criarFigura)));
    } else if (bloco.widget) {
      destino.append(criarWidget(bloco));
    } else if (bloco.tabela) {
      destino.append(criarTabela(bloco.tabela));
    } else {
      console.warn('Bloco de conteúdo desconhecido:', bloco);
    }
  }
  return titulos;
}

function montarIndiceDaPagina(titulos) {
  const aside = $('#nesta-pagina');
  if (!aside) return;
  observadorIndice?.disconnect();
  if (titulos.length < 2) {
    aside.replaceChildren();
    aside.hidden = true;
    return;
  }
  aside.hidden = false;
  const links = new Map();
  aside.replaceChildren(
    h('h2', { id: 'nesta-pagina-titulo' }, 'Nesta página'),
    h('ul', null, titulos.map(({ id, texto }) => {
      const link = h('a', { href: `#${id}`, html: mathHtml(texto) });
      links.set(id, link);
      return h('li', null, link);
    })),
  );
  if (typeof IntersectionObserver !== 'function') return;
  const visiveis = new Set();
  observadorIndice = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (entrada.isIntersecting) visiveis.add(entrada.target.id); else visiveis.delete(entrada.target.id);
    }
    const atual = titulos.find(({ id }) => visiveis.has(id))?.id;
    if (!atual) return;
    for (const [id, link] of links) {
      if (id === atual) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
    }
  }, { rootMargin: '-64px 0px -65% 0px' });
  for (const { id } of titulos) {
    const alvo = document.getElementById(id);
    if (alvo) observadorIndice.observe(alvo);
  }
}

function criarFimDaSecao(secao) {
  const { anterior, proxima } = vizinhas(secao.id);
  const estudada = secoesEstudadas().has(secao.id);
  const botao = h('button', { type: 'button', class: 'btn btn-estudada', 'aria-pressed': String(estudada) });
  const pintar = (marcada) => {
    botao.setAttribute('aria-pressed', String(marcada));
    botao.innerHTML = `${icone('certo')}<span>${marcada ? 'Seção estudada' : 'Marcar seção como estudada'}</span>`;
  };
  pintar(estudada);
  botao.addEventListener('click', () => {
    const nova = botao.getAttribute('aria-pressed') !== 'true';
    marcarEstudada(secao.id, nova);
    pintar(nova);
  });

  return h('footer', { class: 'fim-secao' },
    h('div', { class: 'fim-secao__acoes' }, botao, botoesPraticar(secao, 'btn btn--primario')),
    h('nav', { class: 'nav-secoes', 'aria-label': 'Seção anterior e próxima' },
      anterior ? h('a', { class: 'nav-secoes__ant', href: urlSecao(anterior.id), rel: 'prev' },
        h('small', null, '← Anterior'), h('span', null, `${anterior.num} · ${anterior.curto}`)) : null,
      proxima ? h('a', { class: 'nav-secoes__prox', href: urlSecao(proxima.id), rel: 'next' },
        h('small', null, 'Próxima →'), h('span', null, `${proxima.num} · ${proxima.curto}`)) : null,
    ),
  );
}

let pedido = 0;

async function mostrarSecao(id, { rolar = true } = {}) {
  const secao = obterSecao(id) ?? SECOES[0];
  const artigo = $('#artigo');
  const meuPedido = ++pedido;
  artigo.setAttribute('aria-busy', 'true');

  let modulo;
  try {
    modulo = (await secao.carregar()).default;
  } catch (erro) {
    console.error(erro);
    if (meuPedido !== pedido) return;
    artigo.replaceChildren(h('p', { class: 'aviso-erro' },
      'Não foi possível carregar esta seção. Verifique se o site está sendo servido por um servidor local (veja o README).'));
    artigo.removeAttribute('aria-busy');
    return;
  }
  if (meuPedido !== pedido) return;

  const grupo = GRUPOS.find((g) => g.id === secao.grupo);
  const cabecalho = h('header', { class: 'cabecalho-secao' },
    h('p', { class: 'cabecalho-secao__sobre' },
      h('span', null, `Seção ${secao.num}`),
      grupo ? h('span', { class: 'chip' }, grupo.titulo.replace(/^\d+\s*·\s*/, '')) : null,
    ),
    h('h1', { id: 'titulo-secao', tabindex: '-1' }, secao.titulo),
    h('p', { class: 'cabecalho-secao__lide', html: mathHtml(modulo.lide ?? secao.resumo) }),
    h('div', { class: 'cabecalho-secao__acoes' },
      botoesPraticar(secao, 'btn btn--primario btn--pequeno').map((b) => { b.classList.add('btn--pequeno'); return b; }),
      modulo.imprimivel ? h('button', { type: 'button', class: 'btn btn--pequeno', onClick: () => window.print(), html: `${icone('imprimir')}<span>Imprimir</span>` }) : null,
    ),
  );

  const corpo = h('div', { class: 'prosa' });
  if (modulo.objetivos?.length) {
    corpo.append(h('section', { class: 'objetivos', 'aria-labelledby': 'objetivos-titulo' },
      h('h2', { id: 'objetivos-titulo' }, 'Nesta seção você vai aprender a'),
      h('ul', null, modulo.objetivos.map((o) => h('li', { html: mathHtml(o) }))),
    ));
  }
  const titulos = renderizarBlocos(modulo.blocos ?? [], corpo);

  artigo.replaceChildren(cabecalho, corpo, criarFimDaSecao(secao));
  artigo.dataset.secao = secao.id;
  artigo.classList.toggle('artigo--imprimivel', Boolean(modulo.imprimivel));
  artigo.removeAttribute('aria-busy');

  document.title = `${secao.num}. ${secao.titulo} — Derivadas · Cálculo 1`;
  destacarSecao(secao.id);
  atualizarNavegacaoPrincipal(secao.id);
  registrarUltimaSecao(secao.id);
  montarIndiceDaPagina(titulos);

  if (rolar) {
    const ancora = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    if (ancora) ancora.scrollIntoView();
    else window.scrollTo(0, 0);
  }
  document.dispatchEvent(new CustomEvent('derivadas:conteudo'));
}

function idDaUrl(url = location.href) {
  return new URL(url, location.href).searchParams.get('s') ?? SECOES[0].id;
}

export function iniciar() {
  mostrarSecao(idDaUrl());

  // Navegação entre seções sem recarregar a página.
  document.addEventListener('click', (evento) => {
    if (evento.defaultPrevented || evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    const link = evento.target.closest?.('a[href]');
    if (!link || link.target === '_blank') return;
    const destino = new URL(link.href, location.href);
    if (destino.origin !== location.origin || destino.pathname !== location.pathname) return;
    const atual = new URL(location.href);
    if (destino.search === atual.search) return; // âncora na mesma seção: comportamento padrão
    evento.preventDefault();
    history.pushState(null, '', destino.pathname + destino.search + destino.hash);
    mostrarSecao(idDaUrl()).then(() => {
      if (!destino.hash) $('#titulo-secao')?.focus({ preventScroll: true });
    });
  });
  window.addEventListener('popstate', () => mostrarSecao(idDaUrl()));
}
