// Gráfico interativo da aproximação linear: compara f(a + Δx) com o valor
// lido na reta tangente, L(a + Δx) = f(a) + f′(a)·Δx, e mostra o erro.

import { h as el } from '../../ui/dom.js';
import { criarGrafico, numeroBr } from '../plano.js';
import { deslizante, seletor, leitura } from '../controles.js';

const FUNCOES = {
  raiz: { rotulo: 'f(x) = √x em a = 4', f: (x) => (x >= 0 ? Math.sqrt(x) : NaN), a: 4, m: 0.25, x: [-0.5, 9], y: [-0.3, 3.6], dx: [-3.5, 4.5] },
  exp: { rotulo: 'f(x) = eˣ em a = 0', f: Math.exp, a: 0, m: 1, x: [-2.5, 2.5], y: [-1, 7], dx: [-2, 2] },
  seno: { rotulo: 'f(x) = sen x em a = 0', f: Math.sin, a: 0, m: 1, x: [-3.3, 3.3], y: [-2.2, 2.2], dx: [-3, 3] },
  inversa: { rotulo: 'f(x) = 1/x em a = 1', f: (x) => (x > 0 ? 1 / x : NaN), a: 1, m: -1, x: [-0.2, 3.5], y: [-0.6, 3.2], dx: [-0.7, 2.2] },
};

export function montar(container, opcoes = {}) {
  let chave = opcoes.funcao && FUNCOES[opcoes.funcao] ? opcoes.funcao : 'raiz';
  let funcao = FUNCOES[chave];
  let dx = 1;

  const area = el('div');
  const grafico = criarGrafico(area, { x: funcao.x, y: funcao.y, descricao: 'Gráfico de f, de sua reta tangente em a e da diferença entre as duas em x = a + Δx.' });
  const painel = leitura([
    { chave: 'x', rotulo: 'x = a + Δx' },
    { chave: 'f', rotulo: 'f(x) (valor real)' },
    { chave: 'l', rotulo: 'L(x) (reta tangente)', destaque: true },
    { chave: 'e', rotulo: 'erro |f(x) − L(x)|' },
  ]);
  const mensagem = el('p', { class: 'passos__convite', role: 'status' });

  function desenhar() {
    const { f, a, m } = funcao;
    const fa = f(a);
    const x = a + dx;
    const real = f(x);
    const linear = fa + m * dx;
    grafico.definir([
      { tipo: 'funcao', f, cor: 1 },
      { tipo: 'reta', ponto: [a, fa], m, cor: 2 },
      { tipo: 'segmento', de: [x, real], ate: [x, linear], cor: 4 },
      { tipo: 'ponto', x: a, y: fa, cor: 0, rotulo: 'a', pos: 's' },
      { tipo: 'ponto', x, y: real, cor: 1, rotulo: 'f(x)', pos: dx >= 0 ? 'se' : 'sw' },
      { tipo: 'ponto', x, y: linear, cor: 2, rotulo: 'L(x)', pos: dx >= 0 ? 'nw' : 'ne' },
    ]);
    painel.definir('x', numeroBr(x, 2));
    painel.definir('f', numeroBr(real, 5));
    painel.definir('l', numeroBr(linear, 5));
    painel.definir('e', numeroBr(Math.abs(real - linear), 5));
    mensagem.textContent = Math.abs(dx) <= 0.2
      ? 'Perto de a, a reta tangente e a curva quase coincidem: a aproximação é excelente.'
      : 'Quanto mais longe de a, maior o erro: a aproximação linear é uma ferramenta local.';
  }

  const controle = deslizante({ rotulo: 'Δx', min: funcao.dx[0], max: funcao.dx[1], passo: 0.01, valor: dx, aoMudar: (v) => { dx = v; desenhar(); } });
  const escolha = seletor({
    rotulo: 'Função',
    opcoes: Object.entries(FUNCOES).map(([valor, f]) => ({ valor, rotulo: f.rotulo })),
    valor: chave,
    aoMudar: (nova) => {
      chave = nova;
      funcao = FUNCOES[chave];
      dx = Math.min(1, funcao.dx[1]);
      const entrada = controle.el.querySelector('input');
      entrada.min = funcao.dx[0];
      entrada.max = funcao.dx[1];
      controle.definir(dx);
      grafico.janela({ x: funcao.x, y: funcao.y });
      desenhar();
    },
  });
  grafico.aoArrastar((x) => {
    dx = Math.max(funcao.dx[0], Math.min(funcao.dx[1], Math.round((x - funcao.a) * 100) / 100));
    controle.definir(dx);
    desenhar();
  });

  container.append(area, el('div', { class: 'painel-widget' }, escolha.el, controle.el, painel.el, mensagem));
  desenhar();
}
