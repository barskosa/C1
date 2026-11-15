// Página inicial: trilha de estudo, progresso e gráfico de abertura.

import { h, $, prefereMenosMovimento } from '../ui/dom.js';
import { GRUPOS, SECOES, urlSecao, obterSecao } from '../conteudo/indice.js';
import { secoesEstudadas, ultimaSecao, ler } from '../ui/armazenamento.js';
import { criarGrafico, numeroBr } from '../graficos/plano.js';

function montarGraficoDeAbertura() {
  const corpo = $('#heroi-grafico');
  const leitura = $('#heroi-leitura');
  if (!corpo) return;

  const f = (x) => 0.25 * x ** 3 - 1.2 * x + 1.4;
  const df = (x) => 0.75 * x ** 2 - 1.2;
  let a = -1.6;
  let interagiu = false;

  const grafico = criarGrafico(corpo, {
    x: [-3.2, 3.2], y: [-1.6, 4.4], proporcao: 0.72, alturaMax: 360,
    descricao: 'Gráfico de uma função com a reta tangente em um ponto que pode ser arrastado.',
  });

  const desenhar = () => {
    const m = df(a);
    grafico.definir([
      { tipo: 'funcao', f, cor: 1 },
      { tipo: 'reta', ponto: [a, f(a)], m, cor: 2 },
      { tipo: 'ponto', x: a, y: f(a), cor: 2, arrastavel: true },
    ]);
    if (leitura) {
      const sentido = Math.abs(m) < 0.05 ? 'tangente horizontal' : m > 0 ? 'função crescendo' : 'função decrescendo';
      leitura.textContent = `Inclinação da tangente em x = ${numeroBr(a, 1)}: f′(x) ≈ ${numeroBr(m, 2)} (${sentido})`;
    }
  };

  grafico.aoArrastar((x) => {
    interagiu = true;
    a = Math.min(2.9, Math.max(-2.9, x));
    desenhar();
  });
  desenhar();

  if (prefereMenosMovimento()) return;
  // Animação suave até a primeira interação do usuário.
  let inicio = null;
  const passo = (agora) => {
    if (interagiu || !document.body.contains(corpo)) return;
    inicio ??= agora;
    a = 2.3 * Math.sin((agora - inicio) / 2600 - 0.77);
    if (!document.hidden) desenhar();
    requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

function montarResumo() {
  const destino = $('#resumo-progresso');
  if (!destino) return;
  const estudadas = secoesEstudadas();
  const feitas = SECOES.filter((s) => estudadas.has(s.id)).length;
  const ultima = obterSecao(ultimaSecao());
  const proxima = SECOES.find((s) => !estudadas.has(s.id)) ?? SECOES[0];
  const placar = ler('placar', null);

  const continuar = ultima && !estudadas.has(ultima.id) ? ultima : proxima;
  destino.replaceChildren(
    h('div', { class: 'cartao-info' },
      h('p', { class: 'cartao-info__rotulo' }, 'Seu progresso'),
      h('p', { class: 'cartao-info__valor' }, `${feitas} de ${SECOES.length}`),
      h('div', { class: 'medidor', role: 'progressbar', 'aria-label': 'Seções estudadas', 'aria-valuemin': '0', 'aria-valuemax': String(SECOES.length), 'aria-valuenow': String(feitas) },
        h('div', { class: 'medidor__fill', style: `width:${(100 * feitas) / SECOES.length}%` })),
      h('p', { class: 'cartao-info__nota' }, feitas === SECOES.length ? 'Todas as seções estudadas. Parabéns!' : 'seções marcadas como estudadas'),
    ),
    h('div', { class: 'cartao-info' },
      h('p', { class: 'cartao-info__rotulo' }, feitas === 0 && !ultima ? 'Comece por aqui' : 'Continue de onde parou'),
      h('p', { class: 'cartao-info__valor' }, h('a', { href: urlSecao(continuar.id) }, `${continuar.num} · ${continuar.curto}`)),
      h('p', { class: 'cartao-info__nota' }, continuar.resumo),
    ),
    h('div', { class: 'cartao-info' },
      h('p', { class: 'cartao-info__rotulo' }, 'Placar do gerador'),
      h('p', { class: 'cartao-info__valor' }, placar?.tentativas ? `${placar.acertos} de ${placar.tentativas}` : '—'),
      h('p', { class: 'cartao-info__nota' },
        placar?.tentativas
          ? `acertos nas tentativas · sequência atual: ${placar.sequencia ?? 0}`
          : h('a', { href: 'praticar.html' }, 'Resolva sua primeira questão')),
    ),
  );
}

function montarTrilha() {
  const destino = $('#trilha');
  if (!destino) return;
  const estudadas = secoesEstudadas();
  destino.replaceChildren(
    ...GRUPOS.map((grupo) =>
      h('section', { class: 'trilha__grupo', 'aria-labelledby': `trilha-${grupo.id}` },
        h('h2', { id: `trilha-${grupo.id}` }, grupo.titulo),
        h('p', null, grupo.descricao),
        h('ul', { class: 'trilha__lista' },
          SECOES.filter((s) => s.grupo === grupo.id).map((secao) =>
            h('li', null,
              h('a', { class: 'cartao-secao', href: urlSecao(secao.id), dataset: { estudada: String(estudadas.has(secao.id)) } },
                h('span', { class: 'cartao-secao__num' }, `Seção ${secao.num}`),
                h('span', { class: 'cartao-secao__titulo' }, secao.titulo),
                h('span', { class: 'cartao-secao__resumo' }, secao.resumo),
                h('span', { class: 'cartao-secao__ok' }, '✓ estudada'),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

export function iniciar() {
  montarGraficoDeAbertura();
  montarResumo();
  montarTrilha();
  const ultima = obterSecao(ultimaSecao());
  const botao = $('#btn-comecar');
  if (botao && ultima) {
    botao.href = urlSecao(ultima.id);
    botao.textContent = `Continuar: ${ultima.num} · ${ultima.curto}`;
  }
  document.addEventListener('derivadas:estudadas', () => { montarResumo(); montarTrilha(); });
}
