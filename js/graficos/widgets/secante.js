// Gráfico interativo "a secante vira tangente": o aluno move h em direção a
// zero e acompanha o quociente de Newton [f(a + h) − f(a)] / h se aproximar de f′(a).

import { h as el } from '../../ui/dom.js';
import { criarGrafico, numeroBr } from '../plano.js';
import { deslizante, seletor, marcacao, leitura, animar } from '../controles.js';

const FUNCOES = {
  quadratica: { rotulo: 'f(x) = x²', f: (x) => x * x, df: (x) => 2 * x, x: [-1.5, 4], y: [-1.5, 10], a: 1, aMin: -1, aMax: 2.5 },
  cubica: { rotulo: 'f(x) = x³ − 3x', f: (x) => x ** 3 - 3 * x, df: (x) => 3 * x * x - 3, x: [-3, 3.4], y: [-6, 8], a: 0.5, aMin: -2.2, aMax: 1.8 },
  seno: { rotulo: 'f(x) = sen x', f: Math.sin, df: Math.cos, x: [-1.5, 7], y: [-1.8, 2.2], a: 1, aMin: -1, aMax: 5 },
  raiz: { rotulo: 'f(x) = √x', f: (x) => (x >= 0 ? Math.sqrt(x) : NaN), df: (x) => 1 / (2 * Math.sqrt(x)), x: [-0.5, 7], y: [-0.5, 3.2], a: 1, aMin: 0.3, aMax: 4.5 },
  inversa: { rotulo: 'f(x) = 1/x', f: (x) => (x > 0 ? 1 / x : NaN), df: (x) => -1 / (x * x), x: [-0.3, 5], y: [-0.3, 4], a: 1, aMin: 0.4, aMax: 3 },
};

export function montar(container, opcoes = {}) {
  let chave = opcoes.funcao && FUNCOES[opcoes.funcao] ? opcoes.funcao : 'quadratica';
  let funcao = FUNCOES[chave];
  let a = funcao.a;
  let h = 1.5;
  let mostrarTangente = false;
  let cancelarAnimacao = null;

  const area = el('div');
  const grafico = criarGrafico(area, {
    x: funcao.x, y: funcao.y,
    descricao: 'Gráfico de f com o ponto P em x = a, o ponto Q em x = a + h e a reta secante que passa por P e Q.',
  });

  const painel = leitura([
    { chave: 'h', rotulo: 'h (Δx)' },
    { chave: 'dy', rotulo: 'f(a + h) − f(a)' },
    { chave: 'q', rotulo: 'Quociente de Newton', destaque: true },
    { chave: 'd', rotulo: 'f′(a) (limite)' },
  ]);
  const tabela = el('div', { class: 'tabela-rolagem' });
  const aviso = el('p', { class: 'passos__convite', role: 'status' });

  function desenhar() {
    const { f, df } = funcao;
    const fa = f(a);
    const fb = f(a + h);
    const itens = [{ tipo: 'funcao', f, cor: 1 }];
    const quociente = h !== 0 ? (fb - fa) / h : NaN;

    if (mostrarTangente || h === 0) itens.push({ tipo: 'reta', ponto: [a, fa], m: df(a), cor: 3, tracejado: h !== 0 });
    if (h !== 0 && Number.isFinite(fb)) {
      itens.push(
        { tipo: 'reta', ponto: [a, fa], m: quociente, cor: 2 },
        { tipo: 'segmento', de: [a, fa], ate: [a + h, fa], cor: 0, pontilhado: true },
        { tipo: 'segmento', de: [a + h, fa], ate: [a + h, fb], cor: 0, pontilhado: true },
        { tipo: 'texto', x: a + h / 2, y: fa, texto: 'h', pos: fb >= fa ? 's' : 'n', italico: true },
        { tipo: 'ponto', x: a + h, y: fb, cor: 2, rotulo: 'Q', pos: h > 0 ? 'se' : 'sw' },
      );
    }
    itens.push({ tipo: 'ponto', x: a, y: fa, cor: 1, rotulo: 'P', pos: 'nw' });
    grafico.definir(itens);

    painel.definir('h', numeroBr(h, 3));
    painel.definir('dy', Number.isFinite(fb) ? numeroBr(fb - fa, 4) : 'fora do domínio');
    painel.definir('q', h === 0 ? '0/0 (indefinido)' : Number.isFinite(quociente) ? numeroBr(quociente, 4) : '—');
    painel.definir('d', mostrarTangente || h === 0 ? numeroBr(df(a), 4) : 'marque “mostrar a tangente”');
    aviso.textContent = h === 0
      ? 'Com h = 0 os pontos P e Q coincidem e o quociente vira 0/0: por isso a derivada é definida como um limite, e não como uma substituição direta.'
      : Math.abs(h) < 0.06
        ? 'Com h tão pequeno, a secante praticamente coincide com a tangente.'
        : 'Aproxime h de zero (pelos dois lados) e observe o quociente de Newton.';
  }

  function montarTabela() {
    const { f, df } = funcao;
    const hs = [1, 0.5, 0.1, 0.01, 0.001, -0.001, -0.01, -0.1];
    tabela.replaceChildren(
      el('table', { class: 'tabela tabela--centro tabela--numeros' },
        el('caption', null, `Quociente de Newton em a = ${numeroBr(a, 2)} para valores de h cada vez menores. O valor exato é f′(a) = ${numeroBr(df(a), 4)}.`),
        el('thead', null, el('tr', null, el('th', { scope: 'row' }, 'h'), hs.map((v) => el('th', { scope: 'col' }, numeroBr(v, 3))))),
        el('tbody', null, el('tr', null, el('th', { scope: 'row' }, 'quociente'),
          hs.map((v) => {
            const q = (f(a + v) - f(a)) / v;
            return el('td', null, Number.isFinite(q) ? numeroBr(q, 4) : '—');
          }))),
      ),
    );
  }

  const controleH = deslizante({
    rotulo: 'h', min: -2, max: 2, passo: 0.01, valor: h,
    formatar: (v) => numeroBr(v, 2),
    aoMudar: (v) => { cancelarAnimacao?.(); h = v; desenhar(); },
  });
  const controleA = deslizante({
    rotulo: 'a', min: funcao.aMin, max: funcao.aMax, passo: 0.05, valor: a,
    aoMudar: (v) => { cancelarAnimacao?.(); a = v; desenhar(); montarTabela(); },
  });
  const escolha = seletor({
    rotulo: 'Função',
    opcoes: Object.entries(FUNCOES).map(([valor, f]) => ({ valor, rotulo: f.rotulo })),
    valor: chave,
    aoMudar: (nova) => {
      cancelarAnimacao?.();
      chave = nova;
      funcao = FUNCOES[chave];
      a = funcao.a;
      const entrada = controleA.el.querySelector('input');
      entrada.min = funcao.aMin;
      entrada.max = funcao.aMax;
      controleA.definir(a);
      grafico.janela({ x: funcao.x, y: funcao.y });
      desenhar();
      montarTabela();
    },
  });
  const caixaTangente = marcacao({
    rotulo: 'Mostrar a reta tangente e o valor de f′(a)',
    aoMudar: (marcado) => { mostrarTangente = marcado; desenhar(); },
  });
  const botaoAnimar = el('button', { type: 'button', class: 'btn btn--pequeno' }, 'Animar h → 0');
  botaoAnimar.addEventListener('click', () => {
    cancelarAnimacao?.();
    const inicio = Math.abs(h) < 0.2 ? 1.5 : h;
    cancelarAnimacao = animar({
      de: inicio, ate: Math.sign(inicio) * 0.01, duracao: 3200,
      aoQuadro: (v) => { h = Math.round(v * 100) / 100 || Math.sign(inicio) * 0.01; controleH.definir(h); desenhar(); },
    });
  });

  grafico.aoArrastar((x) => {
    cancelarAnimacao?.();
    const novoH = Math.round((x - a) * 100) / 100;
    h = Math.max(-2, Math.min(2, novoH));
    controleH.definir(h);
    desenhar();
  });

  container.append(
    area,
    el('div', { class: 'painel-widget' },
      el('div', { class: 'painel-widget__linha' }, escolha.el, botaoAnimar),
      el('div', { class: 'painel-widget__linha' }, controleH.el, controleA.el),
      caixaTangente.el,
      painel.el,
      aviso,
      tabela,
    ),
  );
  desenhar();
  montarTabela();
}
