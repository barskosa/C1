// Plotador de funções em SVG, sem dependências.
//
// Por que não uma biblioteca pronta? Os gráficos do site são simples (curvas,
// retas, pontos e rótulos, alguns com um controle deslizante). Um módulo
// pequeno em SVG herda as cores do tema claro/escuro por variáveis CSS, fica
// nítido em qualquer tela e evita carregar centenas de kB extras.
//
// Uso:
//   const g = criarGrafico(elemento, { x: [-3, 3], y: [-1, 9], itens: [...] });
//   g.definir(novosItens);   // redesenha (usado pelos gráficos interativos)
//
// Itens aceitos (coordenadas sempre no sistema da função):
//   { tipo: 'funcao', f, cor, dominio, tracejado, fino }
//   { tipo: 'ponto', x, y, cor, aberto, rotulo, pos }
//   { tipo: 'segmento', de: [x, y], ate: [x, y], cor, tracejado, pontilhado, fino }
//   { tipo: 'reta', ponto: [x, y], m, cor, tracejado, fino }
//   { tipo: 'vertical', x, ... } | { tipo: 'horizontal', y, ... }
//   { tipo: 'texto', x, y, texto, cor, pos }
//   { tipo: 'area', f, g, de, ate, cor }
//   { tipo: 'poligono', pontos: [[x, y], ...], cor, contorno }

const NS = 'http://www.w3.org/2000/svg';

function el(nome, atributos, texto) {
  const no = document.createElementNS(NS, nome);
  for (const [chave, valor] of Object.entries(atributos || {})) {
    if (valor != null && valor !== false) no.setAttribute(chave, String(valor));
  }
  if (texto != null) no.textContent = texto;
  return no;
}

/** Passo "redondo" (1, 2 ou 5 × 10^k) para cerca de `alvo` divisões. */
export function passoRedondo(amplitude, alvo = 8) {
  const bruto = amplitude / alvo;
  const potencia = 10 ** Math.floor(Math.log10(bruto));
  const fracao = bruto / potencia;
  const base = fracao < 1.5 ? 1 : fracao < 3.5 ? 2 : fracao < 7.5 ? 5 : 10;
  return base * potencia;
}

/** Número no padrão brasileiro (vírgula decimal), sem zeros à direita. */
export function numeroBr(valor, casas = 2) {
  if (!Number.isFinite(valor)) return '—';
  const arredondado = Number(valor.toFixed(casas));
  const texto = (Object.is(arredondado, -0) ? 0 : arredondado).toString().replace('.', ',');
  return texto.replace('-', '−');
}

const DESLOCAMENTO = {
  n: [0, -11, 'middle'], s: [0, 19, 'middle'], e: [10, 4, 'start'], w: [-10, 4, 'end'],
  ne: [8, -8, 'start'], nw: [-8, -8, 'end'], se: [8, 17, 'start'], sw: [-8, 17, 'end'], c: [0, 4, 'middle'],
};

let contador = 0;

export function criarGrafico(container, opcoes = {}) {
  const cfg = {
    x: [-5, 5], y: [-5, 5],
    proporcao: 0.62, alturaMin: 210, alturaMax: 440,
    grade: true, eixos: true, marcas: true,
    nomes: ['x', 'y'], passo: null, rotuloX: null, rotuloY: null,
    descricao: 'Gráfico',
    ...opcoes,
  };
  let itens = cfg.itens ? [...cfg.itens] : [];
  const id = `grafico-${++contador}`;
  const margem = { esq: 8, dir: 8, topo: 8, base: 8 };
  let largura = 600;
  let altura = 372;

  const svg = el('svg', { class: 'grafico', role: 'img', 'aria-label': cfg.descricao, preserveAspectRatio: 'xMidYMid meet' });
  container.append(svg);

  const escala = () => {
    const [x0, x1] = cfg.x;
    const [y0, y1] = cfg.y;
    const w = largura - margem.esq - margem.dir;
    const a = altura - margem.topo - margem.base;
    return {
      px: (x) => margem.esq + ((x - x0) / (x1 - x0)) * w,
      py: (y) => margem.topo + (1 - (y - y0) / (y1 - y0)) * a,
      mx: (px) => x0 + ((px - margem.esq) / w) * (x1 - x0),
      my: (py) => y0 + (1 - (py - margem.topo) / a) * (y1 - y0),
    };
  };

  function caminhoDaFuncao(f, dominio, e) {
    const [x0, x1] = cfg.x;
    const [y0, y1] = cfg.y;
    const a = Math.max(x0, dominio?.[0] ?? x0);
    const b = Math.min(x1, dominio?.[1] ?? x1);
    if (!(b > a)) return '';
    const folga = (y1 - y0) * 1.5;
    const n = Math.max(160, Math.round(largura * 1.2));
    let caminho = '';
    let aberto = false;
    let yAnterior = NaN;
    for (let i = 0; i <= n; i++) {
      const x = a + ((b - a) * i) / n;
      let y;
      try { y = f(x); } catch { y = NaN; }
      if (typeof y !== 'number' || !Number.isFinite(y)) { aberto = false; yAnterior = NaN; continue; }
      // Salto entre lados opostos da janela: é uma assíntota vertical, não liga os ramos.
      const salto = Number.isFinite(yAnterior) && ((yAnterior > y1 && y < y0) || (yAnterior < y0 && y > y1));
      const yDesenho = Math.min(y1 + folga, Math.max(y0 - folga, y));
      caminho += `${aberto && !salto ? 'L' : 'M'}${e.px(x).toFixed(2)} ${e.py(yDesenho).toFixed(2)}`;
      aberto = true;
      yAnterior = y;
    }
    return caminho;
  }

  const classeCor = (cor, prefixo = 'c') => `${prefixo}${cor ?? 1}`;
  const estiloTraco = (item) =>
    `${item.tracejado ? ' g-tracejado' : ''}${item.pontilhado ? ' g-pontilhado' : ''}${item.fino ? ' g-fino' : ''}`;

  function desenharFundo(e) {
    const grupo = el('g');
    const [x0, x1] = cfg.x;
    const [y0, y1] = cfg.y;
    const dx = cfg.passo?.[0] ?? passoRedondo(x1 - x0, largura < 420 ? 6 : 9);
    const dy = cfg.passo?.[1] ?? passoRedondo(y1 - y0, altura < 280 ? 5 : 7);
    const eixoY = x0 <= 0 && x1 >= 0 ? e.px(0) : null;
    const eixoX = y0 <= 0 && y1 >= 0 ? e.py(0) : null;
    const quaseZero = (v, passo) => Math.abs(v) < passo * 1e-6;

    if (cfg.grade) {
      for (let x = Math.ceil(x0 / dx) * dx; x <= x1 + dx * 1e-9; x += dx) {
        grupo.append(el('line', { class: 'g-grade', x1: e.px(x), x2: e.px(x), y1: margem.topo, y2: altura - margem.base }));
      }
      for (let y = Math.ceil(y0 / dy) * dy; y <= y1 + dy * 1e-9; y += dy) {
        grupo.append(el('line', { class: 'g-grade', x1: margem.esq, x2: largura - margem.dir, y1: e.py(y), y2: e.py(y) }));
      }
    }
    if (cfg.eixos) {
      if (eixoX != null) grupo.append(el('line', { class: 'g-eixo', x1: margem.esq, x2: largura - margem.dir, y1: eixoX, y2: eixoX }));
      if (eixoY != null) grupo.append(el('line', { class: 'g-eixo', x1: eixoY, x2: eixoY, y1: margem.topo, y2: altura - margem.base }));
    }
    if (cfg.marcas) {
      const linhaX = eixoX != null ? Math.min(eixoX + 14, altura - margem.base - 4) : altura - margem.base - 4;
      const colunaY = eixoY != null ? Math.max(eixoY - 6, margem.esq + 4) : margem.esq + 4;
      const ancoraY = eixoY != null && eixoY - 6 > margem.esq + 22 ? 'end' : 'start';
      for (let x = Math.ceil(x0 / dx) * dx; x <= x1 + dx * 1e-9; x += dx) {
        if (quaseZero(x, dx) && eixoY != null) continue;
        const px = e.px(x);
        if (px < margem.esq + 10 || px > largura - margem.dir - 10) continue;
        grupo.append(el('text', { class: 'g-marca', x: px, y: linhaX, 'text-anchor': 'middle' }, cfg.rotuloX ? cfg.rotuloX(x) : numeroBr(x, 4)));
      }
      for (let y = Math.ceil(y0 / dy) * dy; y <= y1 + dy * 1e-9; y += dy) {
        if (quaseZero(y, dy) && eixoX != null) continue;
        const py = e.py(y);
        if (py < margem.topo + 10 || py > altura - margem.base - 8) continue;
        grupo.append(el('text', { class: 'g-marca', x: ancoraY === 'end' ? colunaY : colunaY + 2, y: py + 4, 'text-anchor': ancoraY }, cfg.rotuloY ? cfg.rotuloY(y) : numeroBr(y, 4)));
      }
      if (eixoX != null && eixoY != null && eixoY - 6 > margem.esq + 10) {
        grupo.append(el('text', { class: 'g-marca', x: eixoY - 6, y: Math.min(eixoX + 14, altura - margem.base - 4), 'text-anchor': 'end' }, '0'));
      }
    }
    if (cfg.eixos && cfg.nomes) {
      if (eixoX != null) grupo.append(el('text', { class: 'g-nome-eixo', x: largura - margem.dir - 6, y: Math.max(eixoX - 8, margem.topo + 14), 'text-anchor': 'end' }, cfg.nomes[0]));
      if (eixoY != null) grupo.append(el('text', { class: 'g-nome-eixo', x: Math.min(eixoY + 9, largura - margem.dir - 14), y: margem.topo + 14 }, cfg.nomes[1]));
    }
    return grupo;
  }

  function desenharItem(item, e, camada, rotulos) {
    const [x0, x1] = cfg.x;
    const [y0, y1] = cfg.y;
    switch (item.tipo) {
      case 'funcao': {
        const d = caminhoDaFuncao(item.f, item.dominio, e);
        if (d) camada.append(el('path', { class: `g-curva ${classeCor(item.cor)}${estiloTraco(item)}`, d }));
        break;
      }
      case 'area': {
        const a = Math.max(x0, item.de);
        const b = Math.min(x1, item.ate);
        if (!(b > a)) break;
        const g = item.g ?? (() => 0);
        const n = 80;
        const cima = [];
        const baixo = [];
        for (let i = 0; i <= n; i++) {
          const x = a + ((b - a) * i) / n;
          const yf = item.f(x);
          const yg = g(x);
          if (!Number.isFinite(yf) || !Number.isFinite(yg)) continue;
          cima.push(`${e.px(x).toFixed(2)},${e.py(yf).toFixed(2)}`);
          baixo.unshift(`${e.px(x).toFixed(2)},${e.py(yg).toFixed(2)}`);
        }
        camada.append(el('polygon', { class: `g-area ${classeCor(item.cor, 'f')}`, points: [...cima, ...baixo].join(' ') }));
        break;
      }
      case 'poligono': {
        const pontos = item.pontos.map(([x, y]) => `${e.px(x).toFixed(2)},${e.py(y).toFixed(2)}`).join(' ');
        camada.append(el('polygon', { class: `g-area ${classeCor(item.cor, 'f')}`, points: pontos }));
        if (item.contorno !== false) camada.append(el('polygon', { class: `g-reta g-fino ${classeCor(item.cor)}`, points: pontos }));
        break;
      }
      case 'segmento': {
        camada.append(el('line', {
          class: `g-reta ${classeCor(item.cor)}${estiloTraco(item)}`,
          x1: e.px(item.de[0]), y1: e.py(item.de[1]), x2: e.px(item.ate[0]), y2: e.py(item.ate[1]),
        }));
        break;
      }
      case 'reta': {
        const [px0, py0] = item.ponto;
        const f = (x) => py0 + item.m * (x - px0);
        camada.append(el('line', {
          class: `g-reta ${classeCor(item.cor)}${estiloTraco(item)}`,
          x1: e.px(x0), y1: e.py(f(x0)), x2: e.px(x1), y2: e.py(f(x1)),
        }));
        break;
      }
      case 'vertical': {
        const de = item.de ?? y0;
        const ate = item.ate ?? y1;
        camada.append(el('line', { class: `g-reta ${classeCor(item.cor ?? 0)}${estiloTraco(item)}`, x1: e.px(item.x), x2: e.px(item.x), y1: e.py(de), y2: e.py(ate) }));
        break;
      }
      case 'horizontal': {
        const de = item.de ?? x0;
        const ate = item.ate ?? x1;
        camada.append(el('line', { class: `g-reta ${classeCor(item.cor ?? 0)}${estiloTraco(item)}`, x1: e.px(de), x2: e.px(ate), y1: e.py(item.y), y2: e.py(item.y) }));
        break;
      }
      case 'ponto': {
        if (!Number.isFinite(item.x) || !Number.isFinite(item.y)) break;
        const cx = e.px(item.x);
        const cy = e.py(item.y);
        rotulos.append(el('circle', {
          class: item.aberto ? `g-ponto--aberto ${classeCor(item.cor)}` : `g-ponto ${classeCor(item.cor, 'f')}${item.arrastavel ? ' g-arrastavel' : ''}`,
          cx, cy, r: item.raio ?? 5.5,
        }));
        if (item.rotulo) {
          const [dx, dy, ancora] = DESLOCAMENTO[item.pos ?? 'ne'];
          rotulos.append(el('text', { class: `g-rotulo ${classeCor(item.cor, 'f')}`, x: cx + dx, y: cy + dy, 'text-anchor': ancora }, item.rotulo));
        }
        break;
      }
      case 'texto': {
        const [dx, dy, ancora] = DESLOCAMENTO[item.pos ?? 'c'];
        rotulos.append(el('text', {
          class: `g-rotulo ${item.cor != null ? classeCor(item.cor, 'f') : ''}`,
          x: e.px(item.x) + dx, y: e.py(item.y) + dy, 'text-anchor': ancora,
          'font-style': item.italico ? 'italic' : null,
        }, item.texto));
        break;
      }
      default:
        break;
    }
  }

  function redesenhar() {
    const disponivel = container.clientWidth || 600;
    largura = Math.max(240, Math.round(disponivel));
    altura = Math.round(Math.min(cfg.alturaMax, Math.max(cfg.alturaMin, largura * cfg.proporcao)));
    svg.setAttribute('viewBox', `0 0 ${largura} ${altura}`);
    svg.setAttribute('width', largura);
    svg.setAttribute('height', altura);
    const e = escala();

    const recorte = el('clipPath', { id: `${id}-recorte` });
    recorte.append(el('rect', { x: margem.esq, y: margem.topo, width: largura - margem.esq - margem.dir, height: altura - margem.topo - margem.base }));
    const defs = el('defs');
    defs.append(recorte);

    const camada = el('g', { 'clip-path': `url(#${id}-recorte)` });
    const rotulos = el('g');
    for (const item of itens) {
      if (item) desenharItem(item, e, camada, rotulos);
    }
    svg.replaceChildren(defs, desenharFundo(e), camada, rotulos);
  }

  let larguraVista = 0;
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(() => {
      const nova = container.clientWidth;
      if (nova && Math.abs(nova - larguraVista) > 1) {
        larguraVista = nova;
        redesenhar();
      }
    }).observe(container);
  }
  larguraVista = container.clientWidth;
  redesenhar();

  return {
    svg,
    definir(novosItens) { itens = [...novosItens]; redesenhar(); },
    janela(nova) { Object.assign(cfg, nova); redesenhar(); },
    redesenhar,
    get limites() { return { x: cfg.x, y: cfg.y }; },
    /** Chama `aoMover(x, y)` enquanto o usuário arrasta o ponteiro sobre o gráfico. */
    aoArrastar(aoMover) {
      let ativo = false;
      const emitir = (evento) => {
        const caixa = svg.getBoundingClientRect();
        if (!caixa.width) return;
        const e = escala();
        const px = ((evento.clientX - caixa.left) / caixa.width) * largura;
        const py = ((evento.clientY - caixa.top) / caixa.height) * altura;
        aoMover(e.mx(px), e.my(py));
      };
      svg.addEventListener('pointerdown', (evento) => {
        ativo = true;
        svg.setPointerCapture?.(evento.pointerId);
        emitir(evento);
      });
      svg.addEventListener('pointermove', (evento) => { if (ativo) emitir(evento); });
      const parar = () => { ativo = false; };
      svg.addEventListener('pointerup', parar);
      svg.addEventListener('pointercancel', parar);
    },
  };
}
