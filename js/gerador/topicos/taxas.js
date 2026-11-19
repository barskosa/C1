// Taxas relacionadas com contexto: escada, balão, tanque cônico e sombra.
// Cada questão traz, para os testes, uma "posição em função do tempo" (tempo):
// a derivada dela em t = 0, calculada pelo math.js, tem de ser a resposta.

import { A, X, num, mul, soma, pot, tex } from '../base.js';
import { texPar, decimalBr, comAprox } from '../formatar.js';

const { div, neg, PI, texto, valor, sim, derivar, subs } = A;
const TRIPLAS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25]];

/** Decimal curto (até 2 casas) como racional exato. */
const racional = (v) => num(Math.round(v * 100), 100);
/** Decimal em LaTeX: 1.5 → 1{,}5. */
const td = (v) => String(v).replace('.', '{,}');

function montar({ enunciado, rotulo, unidade, r, dicas, passos, erros = [], tempo }) {
  if (!Number.isFinite(valor(r))) throw new Error('resposta indefinida');
  return {
    enunciado, tipoResposta: 'numero', rotulo, unidade,
    respostaLatex: comAprox(r), respostaExpr: texto(r),
    dicas, passos, errosComuns: [...erros, { expr: texto(neg(r)), msg: 'O módulo está certo, mas o sinal não. Pense se a grandeza aumenta (taxa positiva) ou diminui (taxa negativa).' }],
    conferencia: { tipo: 'tempo', expr: tempo },
  };
}

function escada(rng, dificuldade) {
  const [a, b, L] = rng.escolha(TRIPLAS);
  const [x0, y0] = rng.chance(0.5) ? [a, b] : [b, a];
  const v = rng.escolha([1, 2, 3, 0.5, 1.5]);
  const vR = racional(v);
  const L2 = L * L;
  const pitagoras = { tex: `x^{2} + y^{2} = ${L2}`, txt: `Sejam \\(x\\) a distância da base à parede e \\(y\\) a altura do topo, ambas variando com o tempo. A escada é a hipotenusa: pelo Teorema de Pitágoras, \\(x^2 + y^2 = ${L}^2\\).` };
  const derivada = { tex: '2x\\,\\frac{dx}{dt} + 2y\\,\\frac{dy}{dt} = 0', txt: 'Derivamos os dois lados em relação ao tempo. Como \\(x\\) e \\(y\\) dependem de \\(t\\), cada termo pede a regra da cadeia.' };
  const dicaBase = 'Relacione \\(x\\) e \\(y\\) pelo Teorema de Pitágoras e derive os dois lados em relação a \\(t\\) (regra da cadeia).';

  if (dificuldade === 'facil') {
    const r = mul(num(-x0, y0), vR);
    return montar({
      enunciado: `Uma escada de ${L} m está apoiada em uma parede vertical. A base se afasta da parede a ${decimalBr(v)} m/s. Com que velocidade o topo da escada desce no instante em que a base está a ${x0} m da parede?`,
      rotulo: '\\dfrac{dy}{dt} =', unidade: 'm/s', r,
      dicas: [dicaBase, `Derivando: \\(2x\\,x' + 2y\\,y' = 0\\). Falta calcular \\(y\\) quando \\(x = ${x0}\\).`],
      passos: [
        { ...pitagoras, txt: `${pitagoras.txt} Dado: \\(\\dfrac{dx}{dt} = ${td(v)}\\). Pedido: \\(\\dfrac{dy}{dt}\\) quando \\(x = ${x0}\\).` },
        derivada,
        { tex: `y = \\sqrt{${L2} - ${x0}^{2}} = ${y0}`, txt: `Só agora usamos o instante pedido: com \\(x = ${x0}\\), a altura é \\(y = ${y0}\\) m.` },
        { tex: `\\frac{dy}{dt} = -\\frac{x}{y} \\cdot \\frac{dx}{dt} = -\\frac{${x0}}{${y0}} \\cdot ${td(v)} = ${tex(r)}`, txt: `Isolamos \\(\\dfrac{dy}{dt}\\) e substituímos. O sinal negativo indica que \\(y\\) diminui: o topo desce a \\(${tex(neg(r))}\\) m/s.` },
      ],
      tempo: `sqrt(${L2} - (${x0} + ${v}*t)^2)`,
    });
  }
  if (dificuldade === 'medio') {
    const r = mul(num(y0, x0), vR);
    return montar({
      enunciado: `Uma escada de ${L} m está apoiada em uma parede vertical e o topo escorrega para baixo a ${decimalBr(v)} m/s. Com que velocidade a base se afasta da parede quando o topo está a ${y0} m do chão?`,
      rotulo: '\\dfrac{dx}{dt} =', unidade: 'm/s', r,
      dicas: [dicaBase, 'Atenção ao sinal do dado: o topo desce, então \\(\\dfrac{dy}{dt}\\) é negativa.'],
      passos: [
        { ...pitagoras, txt: `${pitagoras.txt} Dado: \\(\\dfrac{dy}{dt} = -${td(v)}\\) (negativa, pois \\(y\\) diminui). Pedido: \\(\\dfrac{dx}{dt}\\) quando \\(y = ${y0}\\).` },
        derivada,
        { tex: `x = \\sqrt{${L2} - ${y0}^{2}} = ${x0}`, txt: `No instante pedido, a base está a \\(x = ${x0}\\) m da parede.` },
        { tex: `\\frac{dx}{dt} = -\\frac{y}{x} \\cdot \\frac{dy}{dt} = -\\frac{${y0}}{${x0}} \\cdot (-${td(v)}) = ${tex(r)}`, txt: 'Isolamos \\(\\dfrac{dx}{dt}\\) e substituímos. O resultado é positivo: a base se afasta da parede.' },
      ],
      tempo: `sqrt(${L2} - (${y0} - ${v}*t)^2)`,
    });
  }
  if (rng.chance(0.5)) {
    const r = neg(div(vR, num(y0)));
    return montar({
      enunciado: `Uma escada de ${L} m está apoiada em uma parede vertical e sua base se afasta da parede a ${decimalBr(v)} m/s. Seja \\(\\theta\\) o ângulo entre a escada e o chão. Com que taxa \\(\\theta\\) varia quando a base está a ${x0} m da parede?`,
      rotulo: '\\dfrac{d\\theta}{dt} =', unidade: 'rad/s', r,
      dicas: ['Relacione \\(\\theta\\) com \\(x\\) por trigonometria: \\(\\cos\\theta = \\dfrac{x}{' + L + '}\\). Depois derive em relação a \\(t\\).', 'Derivando: \\(-\\sen\\theta \\cdot \\theta\' = \\dfrac{x\'}{' + L + '}\\). Calcule \\(\\sen\\theta\\) no instante pedido.'],
      passos: [
        { tex: `\\cos\\theta = \\frac{x}{${L}}`, txt: `No triângulo formado pela escada, pelo chão e pela parede, o cateto adjacente a \\(\\theta\\) é \\(x\\) e a hipotenusa é \\(${L}\\).` },
        { tex: `-\\sen\\theta \\cdot \\frac{d\\theta}{dt} = \\frac{1}{${L}} \\cdot \\frac{dx}{dt}`, txt: 'Derivamos em relação ao tempo; à esquerda, regra da cadeia.' },
        { tex: `y = \\sqrt{${L2} - ${x0}^{2}} = ${y0} \\qquad \\sen\\theta = \\frac{${y0}}{${L}}`, txt: 'No instante pedido calculamos a altura e o seno do ângulo.' },
        { tex: `\\frac{d\\theta}{dt} = -\\frac{1}{${L}\\sen\\theta} \\cdot \\frac{dx}{dt} = -\\frac{1}{${y0}} \\cdot ${td(v)} = ${tex(r)}`, txt: 'Isolamos \\(\\dfrac{d\\theta}{dt}\\) (note que \\(' + L + '\\sen\\theta = y\\)). O ângulo diminui: a escada vai se deitando.' },
      ],
      tempo: `acos((${x0} + ${v}*t)/${L})`,
    });
  }
  const yp = mul(num(-x0, y0), vR);
  const r = mul(num(1, 2), soma(mul(vR, y0), mul(x0, yp)));
  return montar({
    enunciado: `Uma escada de ${L} m está apoiada em uma parede vertical e sua base se afasta da parede a ${decimalBr(v)} m/s. A escada, a parede e o chão formam um triângulo. Com que taxa a área desse triângulo varia quando a base está a ${x0} m da parede?`,
    rotulo: '\\dfrac{dA}{dt} =', unidade: 'm²/s', r,
    dicas: ['A área é \\(A = \\dfrac{xy}{2}\\): derive com a regra do produto. Você vai precisar de \\(\\dfrac{dy}{dt}\\), que vem de Pitágoras.', `De \\(x^2 + y^2 = ${L2}\\): \\(\\dfrac{dy}{dt} = -\\dfrac{x}{y}\\,\\dfrac{dx}{dt}\\).`],
    passos: [
      { tex: 'A = \\frac{xy}{2}', txt: 'Área do triângulo retângulo de catetos \\(x\\) (chão) e \\(y\\) (parede).' },
      { tex: '\\frac{dA}{dt} = \\frac{1}{2}\\left(\\frac{dx}{dt}\\,y + x\\,\\frac{dy}{dt}\\right)', txt: 'Derivamos em relação ao tempo com a regra do produto.' },
      { tex: `y = ${y0} \\qquad \\frac{dy}{dt} = -\\frac{x}{y} \\cdot \\frac{dx}{dt} = -\\frac{${x0}}{${y0}} \\cdot ${td(v)} = ${tex(yp)}`, txt: `Com \\(x = ${x0}\\), Pitágoras dá \\(y = ${y0}\\); derivando \\(x^2 + y^2 = ${L2}\\) obtemos \\(\\dfrac{dy}{dt}\\).` },
      { tex: `\\frac{dA}{dt} = \\frac{1}{2}\\left(${td(v)} \\cdot ${y0} + ${x0} \\cdot ${texPar(yp)}\\right) = ${tex(r)}`, txt: `Substituímos. A área está ${valor(r) > 0 ? 'aumentando' : 'diminuindo'} nesse instante.` },
    ],
    tempo: `(${x0} + ${v}*t)*sqrt(${L2} - (${x0} + ${v}*t)^2)/2`,
  });
}

function balao(rng, dificuldade) {
  const Q = rng.escolha([36, 50, 64, 100, 144, 200]);
  const volume = { tex: 'V = \\frac{4}{3}\\pi r^{3}', txt: 'Volume da esfera de raio \\(r\\).' };
  const derivada = { tex: '\\frac{dV}{dt} = 4\\pi r^{2}\\,\\frac{dr}{dt}', txt: 'Derivamos em relação ao tempo: \\(\\dfrac{d}{dt}\\,r^3 = 3r^2\\,\\dfrac{dr}{dt}\\) (regra da cadeia) e \\(\\tfrac{4}{3} \\cdot 3 = 4\\).' };
  if (dificuldade === 'facil') {
    const r0 = rng.escolha([2, 3, 4, 5, 6, 10]);
    const r = div(Q, mul(4, PI, r0 * r0));
    return montar({
      enunciado: `Um balão esférico está sendo inflado a uma taxa de ${Q} cm³/s. Com que rapidez o raio aumenta quando o raio mede ${r0} cm?`,
      rotulo: '\\dfrac{dr}{dt} =', unidade: 'cm/s', r,
      dicas: ['Use o volume da esfera, \\(V = \\tfrac{4}{3}\\pi r^3\\), e derive em relação a \\(t\\).', '\\(\\dfrac{dV}{dt} = 4\\pi r^2\\,\\dfrac{dr}{dt}\\). Substitua \\(\\dfrac{dV}{dt}\\) e \\(r\\).'],
      passos: [
        { ...volume, txt: `${volume.txt} Dado: \\(\\dfrac{dV}{dt} = ${Q}\\). Pedido: \\(\\dfrac{dr}{dt}\\) quando \\(r = ${r0}\\).` },
        derivada,
        { tex: `${Q} = 4\\pi \\cdot ${r0}^{2} \\cdot \\frac{dr}{dt}`, txt: 'Substituímos os valores do instante pedido.' },
        { tex: `\\frac{dr}{dt} = \\frac{${Q}}{${4 * r0 * r0}\\pi} = ${comAprox(r)}`, txt: 'Isolamos a taxa pedida. Quanto maior o balão, mais devagar o raio cresce para a mesma vazão de ar.' },
      ],
      tempo: `(3*(4/3*pi*${r0}^3 + ${Q}*t)/(4*pi))^(1/3)`,
    });
  }
  if (dificuldade === 'medio') {
    const D = rng.escolha([4, 6, 8, 10, 12, 20]);
    const r0 = D / 2;
    const k = rng.escolha([0.5, 1, 2, 3]);
    const r = mul(4, PI, r0 * r0, racional(k));
    return montar({
      enunciado: `O raio de um balão esférico aumenta a ${decimalBr(k)} cm/s. Com que rapidez o volume aumenta quando o <strong>diâmetro</strong> do balão é ${D} cm?`,
      rotulo: '\\dfrac{dV}{dt} =', unidade: 'cm³/s', r,
      dicas: ['Derive \\(V = \\tfrac{4}{3}\\pi r^3\\) em relação a \\(t\\).', `Cuidado: o enunciado dá o diâmetro; o raio é \\(r = ${r0}\\) cm.`],
      passos: [
        { ...volume, txt: `${volume.txt} Dado: \\(\\dfrac{dr}{dt} = ${td(k)}\\). Pedido: \\(\\dfrac{dV}{dt}\\) quando o diâmetro é ${D}, isto é, quando \\(r = ${r0}\\).` },
        derivada,
        { tex: `\\frac{dV}{dt} = 4\\pi \\cdot ${r0}^{2} \\cdot ${td(k)} = ${comAprox(r)}`, txt: 'Substituímos o raio (metade do diâmetro) e a taxa dada.' },
      ],
      erros: [{ expr: texto(mul(4, PI, D * D, racional(k))), msg: 'Você usou o diâmetro no lugar do raio. O raio é metade do diâmetro.' }],
      tempo: `4/3*pi*(${r0} + ${k}*t)^3`,
    });
  }
  const r0 = rng.escolha([3, 6, 9]);
  const V0 = mul(num(4 * r0 ** 3, 3), PI);
  const drdt = div(Q, mul(4, PI, r0 * r0));
  const r = num(2 * Q, r0);
  return montar({
    enunciado: `Um balão esférico é inflado a ${Q} cm³/s. Com que rapidez a <strong>área da superfície</strong> do balão aumenta no instante em que seu volume é \\(${tex(V0)}\\) cm³?`,
    rotulo: '\\dfrac{dS}{dt} =', unidade: 'cm²/s', r,
    dicas: ['São duas relações: \\(V = \\tfrac{4}{3}\\pi r^3\\) (para achar \\(\\tfrac{dr}{dt}\\)) e \\(S = 4\\pi r^2\\) (para achar \\(\\tfrac{dS}{dt}\\)).', `Primeiro descubra o raio: \\(\\tfrac{4}{3}\\pi r^3 = ${tex(V0)}\\) dá \\(r = ${r0}\\).`],
    passos: [
      { tex: `\\frac{4}{3}\\pi r^{3} = ${tex(V0)} \\;\\Rightarrow\\; r^{3} = ${r0 ** 3} \\;\\Rightarrow\\; r = ${r0}`, txt: 'Pelo volume dado, encontramos o raio nesse instante.' },
      { tex: `\\frac{dV}{dt} = 4\\pi r^{2}\\,\\frac{dr}{dt} \\;\\Rightarrow\\; \\frac{dr}{dt} = \\frac{${Q}}{4\\pi \\cdot ${r0}^{2}} = ${tex(drdt)}`, txt: 'Derivando o volume em relação ao tempo, obtemos a taxa de variação do raio.' },
      { tex: 'S = 4\\pi r^{2} \\;\\Rightarrow\\; \\frac{dS}{dt} = 8\\pi r\\,\\frac{dr}{dt}', txt: 'Área da superfície da esfera, derivada em relação ao tempo (regra da cadeia).' },
      { tex: `\\frac{dS}{dt} = 8\\pi \\cdot ${r0} \\cdot ${texPar(drdt)} = ${comAprox(r)}`, txt: 'Substituímos o raio e \\(\\dfrac{dr}{dt}\\). Note que \\(\\dfrac{dS}{dt} = \\dfrac{2}{r}\\,\\dfrac{dV}{dt}\\).' },
    ],
    tempo: `4*pi*((3*(${4 * r0 ** 3}/3*pi + ${Q}*t)/(4*pi))^(1/3))^2`,
  });
}

function cone(rng, dificuldade) {
  const pares = dificuldade === 'facil' ? [[4, 2], [6, 3], [8, 4], [10, 5], [12, 6]] : [[6, 2], [9, 3], [12, 4], [10, 4], [8, 6], [12, 9], [15, 5]];
  const [H, R] = rng.escolha(pares);
  const h0 = rng.int(2, H - 1);
  const Q = rng.escolha([1, 2, 3, 4, 5, 9]);
  const P = dificuldade === 'dificil' ? rng.int(1, Q - 1 || 1) : 0;
  const liquido = Q - P;
  if (liquido <= 0) throw new Error('vazão líquida não positiva');
  const k = num(R, H);
  const hs = sim('h');
  const raio = mul(k, hs);
  const Vh = mul(num(1, 3), PI, pot(raio, 2), hs);
  const dV = derivar(Vh, 'h');
  const dhdt = div(liquido, subs(dV, 'h', num(h0)));
  const pedidoRaio = dificuldade === 'dificil';
  const r = pedidoRaio ? mul(k, dhdt) : dhdt;
  const vazao = P ? `Entra água a ${Q} m³/min, mas um furo no fundo deixa sair ${P} m³/min.` : `Entra água a ${Q} m³/min.`;
  const pergunta = pedidoRaio
    ? `Com que rapidez aumenta o <strong>raio da superfície</strong> da água quando a profundidade é ${h0} m?`
    : `Com que velocidade o nível da água sobe quando a profundidade é ${h0} m?`;
  const passos = [
    { tex: 'V = \\frac{1}{3}\\pi r^{2} h', txt: `Volume de água: um cone de raio \\(r\\) e altura \\(h\\) (a profundidade), ambos variando. ${P ? `A variação líquida do volume é \\(\\dfrac{dV}{dt} = ${Q} - ${P} = ${liquido}\\).` : `Dado: \\(\\dfrac{dV}{dt} = ${Q}\\).`}` },
    { tex: `\\frac{r}{h} = \\frac{${R}}{${H}} \\;\\Rightarrow\\; r = ${tex(raio)}`, txt: 'Semelhança de triângulos: a água forma um cone com as mesmas proporções do tanque. Assim eliminamos uma variável.' },
    { tex: `V = \\frac{1}{3}\\pi\\left(${tex(raio)}\\right)^{2} h = ${tex(Vh)}`, txt: 'Substituímos \\(r\\): o volume passa a depender só de \\(h\\).' },
    { tex: `\\frac{dV}{dt} = ${tex(dV)}\\,\\frac{dh}{dt}`, txt: 'Derivamos em relação ao tempo (regra da cadeia).' },
    { tex: `${liquido} = ${tex(subs(dV, 'h', num(h0)))} \\cdot \\frac{dh}{dt} \\;\\Rightarrow\\; \\frac{dh}{dt} = ${pedidoRaio ? tex(dhdt) : comAprox(dhdt)}`, txt: `Substituímos \\(h = ${h0}\\) e isolamos \\(\\dfrac{dh}{dt}\\).` },
  ];
  if (pedidoRaio) passos.push({ tex: `\\frac{dr}{dt} = ${tex(k)} \\cdot \\frac{dh}{dt} = ${comAprox(r)}`, txt: `Como \\(r = ${tex(raio)}\\) em todo instante, derivando: \\(\\dfrac{dr}{dt} = ${tex(k)}\\,\\dfrac{dh}{dt}\\).` });
  const hDoTempo = `(3*(pi*(${R}/${H})^2*${h0}^3/3 + ${liquido}*t)/(pi*(${R}/${H})^2))^(1/3)`;
  return montar({
    enunciado: `Um tanque tem a forma de um cone invertido (vértice para baixo) com ${H} m de altura e ${R} m de raio no topo. ${vazao} ${pergunta}`,
    rotulo: pedidoRaio ? '\\dfrac{dr}{dt} =' : '\\dfrac{dh}{dt} =', unidade: 'm/min', r,
    dicas: ['Use \\(V = \\tfrac13 \\pi r^2 h\\) e elimine \\(r\\) por semelhança de triângulos antes de derivar.', `Pela semelhança, \\(r = ${tex(raio)}\\), então \\(V = ${tex(Vh)}\\).`],
    passos,
    erros: P ? [{ expr: texto(pedidoRaio ? mul(k, div(Q, subs(dV, 'h', num(h0)))) : div(Q, subs(dV, 'h', num(h0)))), msg: 'Faltou descontar a água que vaza: a variação líquida do volume é a entrada menos a saída.' }] : [],
    tempo: pedidoRaio ? `(${R}/${H})*${hDoTempo}` : hDoTempo,
  });
}

function sombra(rng, dificuldade) {
  const p = rng.escolha([1.5, 1.6, 1.8, 2]);
  const v = rng.escolha([1, 1.2, 1.5, 2]);
  const [pR, vR] = [racional(p), racional(v)];
  if (dificuldade === 'dificil') {
    const D = rng.escolha([10, 12, 15, 20]);
    const d = rng.int(2, D - 3);
    const x0 = D - d;
    const hx = div(mul(pR, D), X);
    const dh = derivar(hx);
    const r = mul(subs(dh, 'x', num(x0)), vR);
    return montar({
      enunciado: `Um holofote no chão ilumina uma parede a ${D} m de distância. Uma pessoa de ${decimalBr(p)} m de altura caminha do holofote em direção à parede a ${decimalBr(v)} m/s. Com que taxa a altura da sombra da pessoa na parede varia quando ela está a ${d} m da parede?`,
      rotulo: '\\dfrac{dh}{dt} =', unidade: 'm/s', r,
      dicas: ['Seja \\(x\\) a distância do holofote à pessoa e \\(h\\) a altura da sombra. Os triângulos com vértice no holofote são semelhantes.', `Semelhança: \\(\\dfrac{h}{${D}} = \\dfrac{${td(p)}}{x}\\). Isole \\(h\\) e derive.`],
      passos: [
        { tex: `\\frac{h}{${D}} = \\frac{${td(p)}}{x}`, txt: 'Sejam \\(x\\) a distância do holofote à pessoa e \\(h\\) a altura da sombra na parede. Os raios de luz saem do holofote, formando triângulos semelhantes.' },
        { tex: `h = ${tex(hx)}`, txt: 'Isolamos \\(h\\).' },
        { tex: `\\frac{dh}{dt} = ${tex(dh)} \\cdot \\frac{dx}{dt}`, txt: 'Derivamos em relação ao tempo (regra da potência com a cadeia).' },
        { tex: `x = ${D} - ${d} = ${x0}`, txt: `A pessoa está a ${d} m da parede, logo a ${x0} m do holofote.` },
        { tex: `\\frac{dh}{dt} = ${tex(subs(dh, 'x', num(x0)))} \\cdot ${td(v)} = ${comAprox(r)}`, txt: 'Substituímos. O sinal negativo indica que a sombra na parede está diminuindo.' },
      ],
      tempo: `${p}*${D}/(${x0} + ${v}*t)`,
    });
  }
  const H = rng.escolha([4.5, 5, 6, 8].filter((h) => h > p + 2));
  const HR = racional(H);
  const c = div(pR, soma(HR, neg(pR)));
  const semelhanca = [
    { tex: `\\frac{s}{${td(p)}} = \\frac{x + s}{${td(H)}}`, txt: 'Sejam \\(x\\) a distância da pessoa ao poste e \\(s\\) o comprimento da sombra. O triângulo pessoa–sombra é semelhante ao triângulo poste–(ponta da sombra).' },
    { tex: `${td(H)}\\,s = ${td(p)}\\,(x + s) \\;\\Rightarrow\\; s = ${tex(mul(c, X))}`, txt: 'Isolamos \\(s\\).' },
  ];
  const enunciadoBase = `Uma pessoa de ${decimalBr(p)} m de altura se afasta de um poste de luz de ${decimalBr(H)} m de altura, caminhando a ${decimalBr(v)} m/s.`;
  if (dificuldade === 'facil') {
    const r = mul(c, vR);
    return montar({
      enunciado: `${enunciadoBase} Com que velocidade o comprimento da sombra da pessoa aumenta?`,
      rotulo: '\\dfrac{ds}{dt} =', unidade: 'm/s', r,
      dicas: ['Use semelhança de triângulos para relacionar \\(s\\) (sombra) com \\(x\\) (distância ao poste).', `Semelhança: \\(\\dfrac{s}{${td(p)}} = \\dfrac{x + s}{${td(H)}}\\).`],
      passos: [...semelhanca, { tex: `\\frac{ds}{dt} = ${tex(c)} \\cdot \\frac{dx}{dt} = ${tex(c)} \\cdot ${td(v)} = ${comAprox(r)}`, txt: 'Derivamos em relação ao tempo. A sombra cresce sempre à mesma taxa, qualquer que seja a distância ao poste.' }],
      tempo: `${p}*(7 + ${v}*t)/(${H} - ${p})`,
    });
  }
  const d = rng.int(3, 12);
  const fator = soma(1, c);
  const r = mul(fator, vR);
  return montar({
    enunciado: `${enunciadoBase} Com que velocidade se move a <strong>ponta</strong> da sombra quando a pessoa está a ${d} m do poste?`,
    rotulo: '\\dfrac{d(x + s)}{dt} =', unidade: 'm/s', r,
    dicas: ['A ponta da sombra está a \\(x + s\\) do poste. Relacione \\(s\\) com \\(x\\) por semelhança de triângulos.', 'A distância de ' + d + ' m é uma informação que não interfere: a resposta não depende dela.'],
    passos: [
      ...semelhanca,
      { tex: `x + s = x + ${tex(mul(c, X))} = ${tex(mul(fator, X))}`, txt: 'A posição da ponta da sombra, medida a partir do poste.' },
      { tex: `\\frac{d(x + s)}{dt} = ${tex(fator)} \\cdot ${td(v)} = ${comAprox(r)}`, txt: `Derivamos em relação ao tempo. A distância de ${d} m não entra na conta: a ponta da sombra anda com velocidade constante.` },
    ],
    erros: [{ expr: texto(mul(c, vR)), msg: 'Essa é a taxa de crescimento da sombra. A ponta da sombra também se move junto com a pessoa: some \\(\\dfrac{dx}{dt}\\).' }],
    tempo: `(7 + ${v}*t) + ${p}*(7 + ${v}*t)/(${H} - ${p})`,
  });
}

export const escadaModelo = { id: 'taxas-escada', titulo: 'Taxas relacionadas: escada', gerar: escada };
export const balaoModelo = { id: 'taxas-balao', titulo: 'Taxas relacionadas: balão', gerar: balao };
export const coneModelo = { id: 'taxas-cone', titulo: 'Taxas relacionadas: tanque cônico', gerar: cone };
export const sombraModelo = { id: 'taxas-sombra', titulo: 'Taxas relacionadas: sombra', gerar: sombra };
export { escadaModelo as escada, balaoModelo as balao, coneModelo as cone, sombraModelo as sombra };
