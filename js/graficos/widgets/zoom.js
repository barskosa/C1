// Gráfico interativo de "linearidade local": ao ampliar o gráfico em torno de
// um ponto onde a função é derivável, a curva se confunde com uma reta. Em um
// bico, uma cúspide ou uma tangente vertical, isso não acontece.

import { h as el } from '../../ui/dom.js';
import { criarGrafico, numeroBr } from '../plano.js';
import { deslizante, seletor } from '../controles.js';

const raizCubica = (x) => Math.cbrt(x);

const FUNCOES = {
  suave: { rotulo: 'f(x) = x² em a = 1 (derivável)', f: (x) => x * x, a: 1, veredito: 'Ampliando, o gráfico fica indistinguível de uma reta de inclinação 2: f é derivável em 1 e f′(1) = 2.' },
  seno: { rotulo: 'f(x) = sen x em a = 0 (derivável)', f: Math.sin, a: 0, veredito: 'Ampliando, o gráfico se confunde com a reta y = x: f é derivável em 0 e f′(0) = 1.' },
  bico: { rotulo: 'f(x) = |x| em a = 0 (bico)', f: Math.abs, a: 0, veredito: 'O bico não desaparece com a ampliação: as inclinações laterais são −1 e 1, então f′(0) não existe.' },
  cuspide: { rotulo: 'f(x) = ∛(x²) em a = 0 (cúspide)', f: (x) => raizCubica(x * x), a: 0, veredito: 'A ponta fica cada vez mais fina: as inclinações laterais tendem a −∞ e +∞, então f′(0) não existe.' },
  vertical: { rotulo: 'f(x) = ∛x em a = 0 (tangente vertical)', f: raizCubica, a: 0, veredito: 'O gráfico se aproxima de uma reta vertical: a inclinação tende a +∞, então f′(0) não existe.' },
};

export function montar(container, opcoes = {}) {
  let chave = opcoes.funcao && FUNCOES[opcoes.funcao] ? opcoes.funcao : 'suave';
  let zoom = 1;
  const area = el('div');
  const grafico = criarGrafico(area, { x: [-2, 2], y: [-2, 2], proporcao: 0.62, descricao: 'Gráfico ampliado em torno do ponto escolhido.' });
  const veredito = el('p', { class: 'passos__convite', role: 'status' });

  function desenhar() {
    const { f, a } = FUNCOES[chave];
    const meia = 2.2 / zoom;
    const centroY = f(a);
    // Mantém a mesma escala nos dois eixos para não distorcer as inclinações.
    grafico.janela({ x: [a - meia, a + meia], y: [centroY - meia * 0.62, centroY + meia * 0.62] });
    grafico.definir([
      { tipo: 'funcao', f, cor: 1 },
      { tipo: 'ponto', x: a, y: centroY, cor: 2 },
    ]);
    veredito.textContent = zoom >= 20 ? FUNCOES[chave].veredito : 'Aumente a ampliação para ver como o gráfico se comporta bem perto do ponto.';
  }

  const controle = deslizante({
    rotulo: 'Ampliação', min: 0, max: 3, passo: 0.02, valor: 0,
    formatar: (v) => `${numeroBr(10 ** v, v < 1 ? 1 : 0)}×`,
    aoMudar: (v) => { zoom = 10 ** v; desenhar(); },
  });
  const escolha = seletor({
    rotulo: 'Função e ponto',
    opcoes: Object.entries(FUNCOES).map(([valor, f]) => ({ valor, rotulo: f.rotulo })),
    valor: chave,
    aoMudar: (nova) => { chave = nova; desenhar(); },
  });

  container.append(area, el('div', { class: 'painel-widget' }, escolha.el, controle.el, veredito));
  desenhar();
}
