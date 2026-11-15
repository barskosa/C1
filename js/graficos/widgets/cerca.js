// Gráfico interativo de otimização: cercar um terreno retangular à beira de um
// rio com 100 m de cerca. À esquerda o terreno; à direita a área A(x) = x(100 − 2x).

import { h as el } from '../../ui/dom.js';
import { criarGrafico, numeroBr } from '../plano.js';
import { deslizante, leitura } from '../controles.js';

const CERCA = 100;

export function montar(container) {
  let x = 10;
  const areaTerreno = el('div');
  const areaFuncao = el('div');
  const terreno = criarGrafico(areaTerreno, {
    x: [-10, 110], y: [-12, 62], proporcao: 0.62, grade: false, eixos: false, marcas: false,
    descricao: 'Terreno retangular com um lado no rio: dois lados de comprimento x e um lado de comprimento y = 100 − 2x.',
  });
  const funcao = criarGrafico(areaFuncao, {
    x: [-4, 54], y: [-150, 1400], proporcao: 0.62, nomes: ['x', 'A'], passo: [10, 250],
    descricao: 'Gráfico da área A em função de x: uma parábola com máximo em x = 25.',
  });
  const painel = leitura([
    { chave: 'x', rotulo: 'x (cada lado perpendicular)' },
    { chave: 'y', rotulo: 'y = 100 − 2x' },
    { chave: 'a', rotulo: 'Área A = x·y', destaque: true },
    { chave: 'd', rotulo: 'A′(x) = 100 − 4x' },
  ]);
  const mensagem = el('p', { class: 'passos__convite', role: 'status' });

  const area = (v) => v * (CERCA - 2 * v);

  function desenhar() {
    const y = CERCA - 2 * x;
    const esquerda = (100 - y) / 2;
    terreno.definir([
      { tipo: 'poligono', pontos: [[-10, 50], [110, 50], [110, 62], [-10, 62]], cor: 1, contorno: false },
      { tipo: 'texto', x: 50, y: 56, texto: 'rio', cor: 1 },
      { tipo: 'poligono', pontos: [[esquerda, 50 - x], [esquerda + y, 50 - x], [esquerda + y, 50], [esquerda, 50]], cor: 3, contorno: false },
      { tipo: 'segmento', de: [esquerda, 50], ate: [esquerda, 50 - x], cor: 3 },
      { tipo: 'segmento', de: [esquerda + y, 50], ate: [esquerda + y, 50 - x], cor: 3 },
      { tipo: 'segmento', de: [esquerda, 50 - x], ate: [esquerda + y, 50 - x], cor: 3 },
      { tipo: 'texto', x: esquerda, y: 50 - x / 2, texto: `x = ${numeroBr(x, 1)}`, pos: 'w' },
      { tipo: 'texto', x: 50, y: 50 - x, texto: `y = ${numeroBr(y, 1)}`, pos: 's' },
    ]);
    funcao.definir([
      { tipo: 'funcao', f: area, cor: 1, dominio: [0, 50] },
      { tipo: 'segmento', de: [x, 0], ate: [x, area(x)], cor: 0, pontilhado: true },
      { tipo: 'reta', ponto: [x, area(x)], m: CERCA - 4 * x, cor: 2, fino: true },
      { tipo: 'ponto', x, y: area(x), cor: 2 },
    ]);
    painel.definir('x', `${numeroBr(x, 1)} m`);
    painel.definir('y', `${numeroBr(y, 1)} m`);
    painel.definir('a', `${numeroBr(area(x), 1)} m²`);
    painel.definir('d', numeroBr(CERCA - 4 * x, 1));
    mensagem.textContent = Math.abs(x - 25) < 0.26
      ? 'Máximo: em x = 25 a tangente é horizontal (A′ = 0) e a área vale 1250 m².'
      : x < 25
        ? 'A′(x) > 0: aumentar x ainda aumenta a área.'
        : 'A′(x) < 0: aumentar x agora diminui a área.';
  }

  const controle = deslizante({
    rotulo: 'x', min: 1, max: 49, passo: 0.5, valor: x,
    formatar: (v) => `${numeroBr(v, 1)} m`,
    aoMudar: (v) => { x = v; desenhar(); },
  });
  funcao.aoArrastar((px) => {
    x = Math.max(1, Math.min(49, Math.round(px * 2) / 2));
    controle.definir(x);
    desenhar();
  });

  container.append(
    el('div', { class: 'figura-grade' }, areaTerreno, areaFuncao),
    el('div', { class: 'painel-widget' }, controle.el, painel.el, mensagem),
  );
  desenhar();
}
