// Gráfico interativo do problema clássico de taxas relacionadas: uma escada de
// 5 m apoiada na parede, com a base se afastando a 1 m/s. Mostra que a
// velocidade do topo não é constante: dy/dt = −(x/y)·dx/dt.

import { h as el } from '../../ui/dom.js';
import { criarGrafico, numeroBr } from '../plano.js';
import { deslizante, leitura } from '../controles.js';

const COMPRIMENTO = 5;
const VELOCIDADE_BASE = 1;

export function montar(container) {
  let x = 3;
  const area = el('div', { style: 'max-width: 30rem; margin: 0 auto;' });
  const grafico = criarGrafico(area, {
    x: [-0.9, 6.1], y: [-0.9, 6.1], proporcao: 1, alturaMax: 480, grade: false, eixos: false, marcas: false,
    descricao: 'Escada de 5 metros apoiada em uma parede vertical, com a base a x metros da parede e o topo a y metros do chão.',
  });
  const painel = leitura([
    { chave: 'x', rotulo: 'x (base até a parede)' },
    { chave: 'y', rotulo: 'y (altura do topo)' },
    { chave: 'dx', rotulo: 'dx/dt' },
    { chave: 'dy', rotulo: 'dy/dt', destaque: true },
  ]);
  const mensagem = el('p', { class: 'passos__convite', role: 'status' });

  function desenhar() {
    const y = Math.sqrt(COMPRIMENTO ** 2 - x ** 2);
    const taxa = -(x / y) * VELOCIDADE_BASE;
    grafico.definir([
      { tipo: 'poligono', pontos: [[-0.5, 0], [0, 0], [0, 5.8], [-0.5, 5.8]], cor: 0, contorno: false },
      { tipo: 'poligono', pontos: [[-0.5, -0.4], [5.9, -0.4], [5.9, 0], [-0.5, 0]], cor: 0, contorno: false },
      { tipo: 'segmento', de: [0, 0], ate: [0, 5.8], cor: 0 },
      { tipo: 'segmento', de: [0, 0], ate: [5.9, 0], cor: 0 },
      { tipo: 'segmento', de: [x, 0], ate: [0, y], cor: 1 },
      { tipo: 'segmento', de: [x, 0], ate: [Math.min(5.8, x + 0.9 * VELOCIDADE_BASE), 0], cor: 3 },
      { tipo: 'segmento', de: [0, y], ate: [0, Math.max(0, y + 0.9 * taxa)], cor: 2 },
      { tipo: 'ponto', x, y: 0, cor: 3 },
      { tipo: 'ponto', x: 0, y, cor: 2 },
      { tipo: 'texto', x: x / 2, y: 0, texto: `x = ${numeroBr(x, 2)} m`, pos: 's', cor: 3 },
      { tipo: 'texto', x: 0, y: y / 2, texto: `y = ${numeroBr(y, 2)} m`, pos: 'e' },
      { tipo: 'texto', x: x / 2, y: y / 2, texto: '5 m', pos: 'ne', cor: 1 },
    ]);
    painel.definir('x', `${numeroBr(x, 2)} m`);
    painel.definir('y', `${numeroBr(y, 2)} m`);
    painel.definir('dx', `${numeroBr(VELOCIDADE_BASE, 2)} m/s`);
    painel.definir('dy', `${numeroBr(taxa, 2)} m/s`);
    mensagem.textContent = x < 3.6
      ? 'A base anda sempre a 1 m/s, mas o topo desce cada vez mais rápido à medida que a escada se inclina.'
      : 'Com a escada quase deitada, y fica pequeno e dy/dt = −x/y cresce muito (em módulo).';
  }

  const controle = deslizante({
    rotulo: 'x', min: 0.5, max: 4.9, passo: 0.01, valor: x,
    formatar: (v) => `${numeroBr(v, 2)} m`,
    aoMudar: (v) => { x = v; desenhar(); },
  });
  grafico.aoArrastar((px) => {
    x = Math.max(0.5, Math.min(4.9, Math.round(px * 100) / 100));
    controle.definir(x);
    desenhar();
  });

  container.append(area, el('div', { class: 'painel-widget' }, controle.el, painel.el, mensagem));
  desenhar();
}
