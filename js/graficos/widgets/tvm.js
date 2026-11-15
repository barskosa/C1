// Gráfico interativo do Teorema do Valor Médio: para o intervalo [a, b]
// escolhido, desenha a secante pelos extremos e a(s) tangente(s) paralelas a
// ela nos pontos c em que f′(c) = [f(b) − f(a)] / (b − a).

import { h as el } from '../../ui/dom.js';
import { criarGrafico, numeroBr } from '../plano.js';
import { deslizante, leitura } from '../controles.js';

const f = (x) => 0.25 * x ** 3 - 0.75 * x * x + 2;
const df = (x) => 0.75 * x * x - 1.5 * x;

/** Raízes de g em (a, b) por varredura e bisseção. */
function raizes(g, a, b) {
  const encontradas = [];
  const n = 400;
  let xAnterior = a;
  let gAnterior = g(a);
  for (let i = 1; i <= n; i++) {
    const x = a + ((b - a) * i) / n;
    const gx = g(x);
    if (gAnterior === 0 && i > 1) encontradas.push(xAnterior);
    else if (gAnterior * gx < 0) {
      let lo = xAnterior;
      let hi = x;
      let glo = gAnterior;
      for (let k = 0; k < 50; k++) {
        const meio = (lo + hi) / 2;
        const gm = g(meio);
        if (glo * gm <= 0) hi = meio; else { lo = meio; glo = gm; }
      }
      encontradas.push((lo + hi) / 2);
    }
    xAnterior = x;
    gAnterior = gx;
  }
  return encontradas;
}

export function montar(container) {
  let a = -0.5;
  let b = 3.5;
  const area = el('div');
  const grafico = criarGrafico(area, { x: [-1.8, 4.6], y: [-0.8, 5.2], descricao: 'Gráfico de f com a reta secante pelos pontos de abscissas a e b e as tangentes paralelas a ela.' });
  const painel = leitura([
    { chave: 'm', rotulo: 'Taxa média em [a, b]', destaque: true },
    { chave: 'c', rotulo: 'c com f′(c) = taxa média' },
  ]);

  function desenhar() {
    const m = (f(b) - f(a)) / (b - a);
    const cs = raizes((x) => df(x) - m, a, b);
    const itens = [
      { tipo: 'funcao', f, cor: 1 },
      { tipo: 'reta', ponto: [a, f(a)], m, cor: 2 },
    ];
    for (const c of cs) {
      itens.push({ tipo: 'reta', ponto: [c, f(c)], m, cor: 3, tracejado: true });
      itens.push({ tipo: 'ponto', x: c, y: f(c), cor: 3, rotulo: 'c', pos: 'n' });
    }
    itens.push(
      { tipo: 'ponto', x: a, y: f(a), cor: 2, rotulo: 'a', pos: 'nw' },
      { tipo: 'ponto', x: b, y: f(b), cor: 2, rotulo: 'b', pos: 'se' },
    );
    grafico.definir(itens);
    painel.definir('m', numeroBr(m, 3));
    painel.definir('c', cs.length ? cs.map((c) => numeroBr(c, 2)).join(' e ') : '—');
  }

  const controleA = deslizante({
    rotulo: 'a', min: -1.5, max: 4.2, passo: 0.05, valor: a,
    aoMudar: (v) => {
      a = v;
      if (b < a + 0.3) { b = Math.min(4.3, a + 0.3); controleB.definir(b); }
      desenhar();
    },
  });
  const controleB = deslizante({
    rotulo: 'b', min: -1.2, max: 4.3, passo: 0.05, valor: b,
    aoMudar: (v) => {
      b = v;
      if (a > b - 0.3) { a = Math.max(-1.5, b - 0.3); controleA.definir(a); }
      desenhar();
    },
  });

  container.append(area, el('div', { class: 'painel-widget' },
    el('div', { class: 'painel-widget__linha' }, controleA.el, controleB.el), painel.el));
  desenhar();
}
