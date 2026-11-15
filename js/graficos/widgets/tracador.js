// Gráfico interativo "f e f′": em cima a função com a reta tangente no ponto
// x = a; embaixo a derivada, cujo valor em a é justamente a inclinação da tangente.

import { h as el } from '../../ui/dom.js';
import { criarGrafico, numeroBr } from '../plano.js';
import { deslizante, seletor, leitura } from '../controles.js';

const FUNCOES = {
  quadratica: { rotulo: 'f(x) = x²', derivada: 'f′(x) = 2x', f: (x) => x * x, df: (x) => 2 * x, x: [-3, 3], y: [-1, 8], dy: [-6.5, 6.5], a: 1 },
  cubica: { rotulo: 'f(x) = x³/3 − x', derivada: 'f′(x) = x² − 1', f: (x) => x ** 3 / 3 - x, df: (x) => x * x - 1, x: [-3, 3], y: [-3, 3], dy: [-2, 6], a: -1.5 },
  seno: { rotulo: 'f(x) = sen x', derivada: 'f′(x) = cos x', f: Math.sin, df: Math.cos, x: [-1, 7], y: [-1.6, 1.6], dy: [-1.6, 1.6], a: 0.8 },
  cosseno: { rotulo: 'f(x) = cos x', derivada: 'f′(x) = −sen x', f: Math.cos, df: (x) => -Math.sin(x), x: [-1, 7], y: [-1.6, 1.6], dy: [-1.6, 1.6], a: 0.8 },
  exponencial: { rotulo: 'f(x) = eˣ', derivada: 'f′(x) = eˣ', f: Math.exp, df: Math.exp, x: [-3, 2.2], y: [-0.6, 8], dy: [-0.6, 8], a: 0.5 },
  logaritmo: { rotulo: 'f(x) = ln x', derivada: 'f′(x) = 1/x', f: (x) => (x > 0 ? Math.log(x) : NaN), df: (x) => (x > 0 ? 1 / x : NaN), x: [-0.4, 6], y: [-2.6, 2.4], dy: [-0.4, 4.4], a: 1 },
};

export function montar(container, opcoes = {}) {
  const chaves = opcoes.funcoes ?? Object.keys(FUNCOES);
  let chave = opcoes.funcao && FUNCOES[opcoes.funcao] ? opcoes.funcao : chaves[0];
  let funcao = FUNCOES[chave];
  let a = funcao.a;

  const areaF = el('div');
  const areaD = el('div');
  const graficoF = criarGrafico(areaF, { x: funcao.x, y: funcao.y, proporcao: 0.46, alturaMin: 190, alturaMax: 300, descricao: 'Gráfico de f com a reta tangente no ponto x = a.' });
  const graficoD = criarGrafico(areaD, { x: funcao.x, y: funcao.dy, proporcao: 0.4, alturaMin: 170, alturaMax: 260, nomes: ['x', 'y′'], descricao: 'Gráfico da derivada f′; o ponto marcado tem altura igual à inclinação da tangente.' });

  const painel = leitura([
    { chave: 'a', rotulo: 'a' },
    { chave: 'fa', rotulo: 'f(a)' },
    { chave: 'da', rotulo: 'f′(a) = inclinação', destaque: true },
  ]);
  const mensagem = el('p', { class: 'passos__convite', role: 'status' });

  const limitesA = () => {
    const margem = (funcao.x[1] - funcao.x[0]) * 0.04;
    return [chave === 'logaritmo' ? 0.25 : funcao.x[0] + margem, funcao.x[1] - margem];
  };

  function desenhar() {
    const { f, df } = funcao;
    const m = df(a);
    graficoF.definir([
      { tipo: 'funcao', f, cor: 1 },
      { tipo: 'vertical', x: a, pontilhado: true },
      { tipo: 'reta', ponto: [a, f(a)], m, cor: 2 },
      { tipo: 'ponto', x: a, y: f(a), cor: 2 },
      { tipo: 'texto', x: funcao.x[0], y: funcao.y[1], texto: funcao.rotulo, pos: 'se', cor: 1 },
    ]);
    graficoD.definir([
      { tipo: 'funcao', f: df, cor: 2 },
      { tipo: 'vertical', x: a, pontilhado: true },
      { tipo: 'segmento', de: [a, 0], ate: [a, m], cor: 2, fino: true },
      { tipo: 'ponto', x: a, y: m, cor: 2 },
      { tipo: 'texto', x: funcao.x[0], y: funcao.dy[1], texto: funcao.derivada, pos: 'se', cor: 2 },
    ]);
    painel.definir('a', numeroBr(a, 2));
    painel.definir('fa', numeroBr(f(a), 3));
    painel.definir('da', numeroBr(m, 3));
    mensagem.textContent = Math.abs(m) < 0.04
      ? 'f′(a) ≈ 0: tangente horizontal (candidato a máximo ou mínimo de f).'
      : m > 0
        ? 'f′(a) > 0: a tangente sobe, f é crescente perto de a.'
        : 'f′(a) < 0: a tangente desce, f é decrescente perto de a.';
  }

  const [aMin, aMax] = limitesA();
  const controleA = deslizante({ rotulo: 'a', min: aMin, max: aMax, passo: 0.02, valor: a, aoMudar: (v) => { a = v; desenhar(); } });
  const mover = (x) => {
    const [min, max] = limitesA();
    a = Math.max(min, Math.min(max, Math.round(x * 50) / 50));
    controleA.definir(a);
    desenhar();
  };
  graficoF.aoArrastar(mover);
  graficoD.aoArrastar(mover);

  const linhas = [];
  if (chaves.length > 1) {
    const escolha = seletor({
      rotulo: 'Função',
      opcoes: chaves.map((valor) => ({ valor, rotulo: FUNCOES[valor].rotulo })),
      valor: chave,
      aoMudar: (nova) => {
        chave = nova;
        funcao = FUNCOES[chave];
        a = funcao.a;
        const [min, max] = limitesA();
        const entrada = controleA.el.querySelector('input');
        entrada.min = min;
        entrada.max = max;
        controleA.definir(a);
        graficoF.janela({ x: funcao.x, y: funcao.y });
        graficoD.janela({ x: funcao.x, y: funcao.dy });
        desenhar();
      },
    });
    linhas.push(escolha.el);
  }

  container.append(areaF, areaD, el('div', { class: 'painel-widget' }, ...linhas, controleA.el, painel.el, mensagem));
  desenhar();
}
