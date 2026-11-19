// Otimização com contexto: cerca, caixa sem tampa e lata.
// Para os testes, cada campo traz a função objetivo (em x), o intervalo e o
// que é pedido no ponto ótimo; o teste acha o ótimo numericamente.

import { A, X, num, mul, soma, pot, tex } from '../base.js';
import { comAprox } from '../formatar.js';

const { div, neg, PI, texto, derivar, subs, sim, expandir } = A;

function campo(id, rotulo, r, unidade, conferencia) {
  return { id, tipo: 'numero', rotulo, unidade, respostaLatex: comAprox(r), respostaExpr: texto(r), conferencia };
}
const otimo = (f, intervalo, sentido, resposta) => ({ tipo: 'otimo', f, intervalo, sentido, resposta: resposta ?? f });

function cerca(rng, dificuldade) {
  if (dificuldade === 'dificil') {
    for (;;) {
      const [cf, cp, x0] = [rng.escolha([10, 12, 15, 20, 30]), rng.escolha([5, 6, 8, 10]), rng.escolha([10, 15, 20, 25, 30])];
      if ((2 * cp * x0 * x0) % cf !== 0) continue;
      const area = (2 * cp * x0 * x0) / cf;
      const y0 = area / x0;
      if (!Number.isInteger(y0)) continue;
      const custo = soma(mul(cf * area, pot(X, -1)), mul(2 * cp, X));
      const dC = derivar(custo);
      const Cmin = cf * y0 + 2 * cp * x0;
      const f = `${cf}*${area}/x + 2*${cp}*x`;
      return {
        enunciado: `Um terreno retangular de ${area} m² à beira de um rio reto será cercado em três lados (o lado junto ao rio não recebe cerca). A cerca paralela ao rio custa R$ ${cf} por metro, e a dos dois lados perpendiculares, R$ ${cp} por metro. Determine o comprimento \\(x\\) de cada lado perpendicular ao rio que minimiza o custo e o custo mínimo.`,
        campos: [
          campo('x', 'x =', num(x0), 'm', otimo(f, [0.5, 20 * x0], 'min', 'x')),
          campo('custo', '\\text{Custo mínimo} =', num(Cmin), 'reais', otimo(f, [0.5, 20 * x0], 'min')),
        ],
        dicas: ['Escreva o custo em função de \\(x\\) usando a área para eliminar o outro lado: \\(y = ' + area + '/x\\).', `\\(C(x) = ${tex(custo)}\\). Derive e iguale a zero.`],
        passos: [
          { tex: `C = ${cf}\\,y + ${cp} \\cdot 2x \\qquad xy = ${area}`, txt: `Sejam \\(x\\) cada lado perpendicular ao rio e \\(y\\) o lado paralelo. Função objetivo: o custo. Restrição: a área.` },
          { tex: `C(x) = ${tex(custo)}`, txt: `Isolamos \\(y = \\dfrac{${area}}{x}\\) e substituímos. Domínio: \\(x > 0\\).` },
          { tex: `C'(x) = ${tex(dC)} = 0 \\;\\Rightarrow\\; x^{2} = ${x0 * x0} \\;\\Rightarrow\\; x = ${x0}`, txt: 'Derivamos e igualamos a zero (só a raiz positiva serve).' },
          { tex: `C''(x) = ${tex(derivar(dC))} > 0`, txt: 'A segunda derivada é positiva para \\(x > 0\\): o ponto crítico é um mínimo.' },
          { tex: `y = \\frac{${area}}{${x0}} = ${y0} \\qquad C = ${cf} \\cdot ${y0} + ${2 * cp} \\cdot ${x0} = ${Cmin}`, txt: `Lados de ${x0} m (perpendiculares) e ${y0} m (paralelo); custo mínimo de R$ ${Cmin}.` },
        ],
      };
    }
  }
  const divisorias = dificuldade === 'medio' ? rng.escolha([1, 2]) : 0;
  const m = divisorias + 2;
  const L = (dificuldade === 'medio' ? 4 * m : 4) * rng.escolha([5, 10, 15, 20, 25, 30]);
  const x0 = dificuldade === 'medio' ? L / (2 * m) : L / 4;
  const y0 = dificuldade === 'medio' ? L / 4 : L / 2;
  const area = x0 * y0;
  const Ax = dificuldade === 'medio' ? mul(num(1, 2), X, soma(L, mul(-m, X))) : mul(X, soma(L, mul(-2, X)));
  const Aexp = expandir(Ax);
  const dA = derivar(Aexp);
  const f = dificuldade === 'medio' ? `x*(${L} - ${m}*x)/2` : `x*(${L} - 2*x)`;
  const intervalo = [0, L / (dificuldade === 'medio' ? m : 2)];
  const restricao = dificuldade === 'medio' ? `${m}x + 2y = ${L}` : `2x + y = ${L}`;
  const enunciado = dificuldade === 'medio'
    ? `Com ${L} m de tela, um criador quer construir um cercado retangular dividido em ${divisorias + 1} partes por ${divisorias === 1 ? 'uma cerca interna paralela' : 'duas cercas internas paralelas'} a um dos lados. Seja \\(x\\) o comprimento dos lados paralelos às divisórias. Que valor de \\(x\\) maximiza a área total, e qual é essa área máxima?`
    : `Com ${L} m de cerca, deseja-se cercar um terreno retangular à beira de um rio reto; o lado junto ao rio não precisa de cerca. Seja \\(x\\) o comprimento de cada lado perpendicular ao rio. Que valor de \\(x\\) maximiza a área, e qual é a área máxima?`;
  return {
    enunciado,
    campos: [
      campo('x', 'x =', num(x0), 'm', otimo(f, intervalo, 'max', 'x')),
      campo('area', '\\text{Área máxima} =', num(area), 'm²', otimo(f, intervalo, 'max')),
    ],
    dicas: [`Área \\(A = xy\\) com a restrição \\(${restricao}\\). Isole \\(y\\) e escreva \\(A\\) só em função de \\(x\\).`, `\\(A(x) = ${tex(Aexp)}\\). Derive e iguale a zero.`],
    passos: [
      { tex: `A = x \\cdot y \\qquad ${restricao}`, txt: dificuldade === 'medio' ? `Há ${m} segmentos de comprimento \\(x\\) (dois lados e ${divisorias === 1 ? 'a divisória' : 'as divisórias'}) e dois de comprimento \\(y\\).` : 'Função objetivo: a área. Restrição: o comprimento da cerca (dois lados \\(x\\) e um lado \\(y\\)).' },
      { tex: `A(x) = ${tex(Ax)} = ${tex(Aexp)}`, txt: `Isolamos \\(y\\) na restrição e substituímos. Domínio: \\(0 < x < ${intervalo[1]}\\).` },
      { tex: `A'(x) = ${tex(dA)} = 0 \\;\\Rightarrow\\; x = ${x0}`, txt: 'Derivamos e igualamos a zero.' },
      { tex: `A''(x) = ${tex(derivar(dA))} < 0`, txt: 'Concavidade para baixo: o único ponto crítico é o máximo.' },
      { tex: `y = ${y0} \\qquad A = ${x0} \\cdot ${y0} = ${area}`, txt: `Dimensões ótimas: \\(x = ${x0}\\) m e \\(y = ${y0}\\) m. Área máxima: ${area} m².` },
    ],
  };
}

const CHAPAS = [[8, 15], [5, 8], [3, 8], [16, 21], [7, 15], [5, 21], [10, 16], [6, 16], [14, 30], [15, 24], [24, 45]];

function caixa(rng, dificuldade) {
  if (dificuldade === 'dificil') {
    const [a, b] = rng.escolha(CHAPAS);
    const s = Math.sqrt(a * a - a * b + b * b);
    const r1 = num(a + b - s, 6);
    const r2 = num(a + b + s, 6);
    const Vx = mul(X, soma(a, mul(-2, X)), soma(b, mul(-2, X)));
    const Vexp = expandir(Vx);
    const dV = derivar(Vexp);
    const V0 = subs(Vx, 'x', r1);
    const f = `x*(${a} - 2*x)*(${b} - 2*x)`;
    const intervalo = [0, Math.min(a, b) / 2];
    const disc = 16 * (a + b) ** 2 - 48 * a * b;
    return {
      enunciado: `De uma folha retangular de papelão de ${a} cm por ${b} cm recortam-se quadrados de lado \\(x\\) nos quatro cantos, e as abas são dobradas para formar uma caixa sem tampa. Determine \\(x\\) para que o volume seja máximo e o volume máximo.`,
      campos: [
        campo('x', 'x =', r1, 'cm', otimo(f, intervalo, 'max', 'x')),
        campo('volume', 'V_{\\text{máx}} =', V0, 'cm³', otimo(f, intervalo, 'max')),
      ],
      dicas: [`A base da caixa mede \\((${a} - 2x)\\) por \\((${b} - 2x)\\) e a altura é \\(x\\).`, `\\(V'(x) = ${tex(dV)}\\). Resolva a equação do 2º grau e descarte a raiz fora do domínio.`],
      passos: [
        { tex: `V(x) = ${tex(Vx)} = ${tex(Vexp)}`, txt: `Volume = área da base × altura. Domínio: \\(0 < x < ${intervalo[1].toString().replace('.', '{,}')}\\).` },
        { tex: `V'(x) = ${tex(dV)}`, txt: 'Derivamos o polinômio termo a termo.' },
        { tex: `x = \\frac{${4 * (a + b)} \\pm \\sqrt{${disc}}}{24} = \\frac{${4 * (a + b)} \\pm ${4 * s}}{24}`, txt: 'Resolvemos \\(V\'(x) = 0\\) pela fórmula de Bhaskara.' },
        { tex: `x_1 = ${tex(r1)} \\qquad x_2 = ${tex(r2)}`, txt: `Só \\(x_1\\) está no domínio; \\(x_2\\) é maior que metade do lado menor. Como \\(V\\) é zero nas extremidades e positiva no meio, \\(x_1\\) dá o máximo.` },
        { tex: `V\\left(${tex(r1)}\\right) = ${comAprox(V0)}`, txt: 'Calculamos o volume máximo.' },
      ],
    };
  }
  const L = rng.escolha([12, 18, 24, 30, 36, 42, 48, 60]);
  const x0 = L / 6;
  const Vmax = x0 * (L - 2 * x0) ** 2;
  const f = `x*(${L} - 2*x)^2`;
  const campos = [campo('x', 'x =', num(x0), 'cm', otimo(f, [0, L / 2], 'max', 'x'))];
  if (dificuldade === 'medio') campos.push(campo('volume', 'V_{\\text{máx}} =', num(Vmax), 'cm³', otimo(f, [0, L / 2], 'max')));
  return {
    enunciado: `De uma folha quadrada de papelão de ${L} cm de lado recortam-se quadrados de lado \\(x\\) nos quatro cantos, e as abas são dobradas para formar uma caixa sem tampa. ${dificuldade === 'medio' ? 'Determine \\(x\\) para que o volume seja máximo e o volume máximo.' : 'Que valor de \\(x\\) dá o maior volume?'}`,
    campos,
    dicas: [`A base é um quadrado de lado \\((${L} - 2x)\\) e a altura é \\(x\\): \\(V(x) = x(${L} - 2x)^2\\).`, `Derivando (produto e cadeia): \\(V'(x) = (${L} - 2x)(${L} - 6x)\\).`],
    passos: [
      { tex: `V(x) = x(${L} - 2x)^{2}`, txt: `Volume = área da base × altura. Domínio: \\(0 < x < ${L / 2}\\).` },
      { tex: `V'(x) = (${L} - 2x)^{2} + x \\cdot 2(${L} - 2x) \\cdot (-2)`, txt: 'Regra do produto, com a regra da cadeia em \\((' + L + ' - 2x)^2\\).' },
      { tex: `V'(x) = (${L} - 2x)(${L} - 2x - 4x) = (${L} - 2x)(${L} - 6x)`, txt: 'Colocamos \\((' + L + ' - 2x)\\) em evidência.' },
      { tex: `V'(x) = 0 \\;\\Rightarrow\\; x = ${L / 2} \\ \\text{ ou } \\ x = ${x0}`, txt: `\\(x = ${L / 2}\\) está fora do domínio (não sobraria base). Antes de ${x0}, \\(V' > 0\\); depois, \\(V' < 0\\): máximo em \\(x = ${x0}\\).` },
      { tex: `V(${x0}) = ${x0} \\cdot ${L - 2 * x0}^{2} = ${Vmax}`, txt: `Caixa ótima: base de ${L - 2 * x0} cm × ${L - 2 * x0} cm e altura de ${x0} cm.` },
    ],
  };
}

function lata(rng, dificuldade) {
  const r0 = rng.escolha([2, 3, 4, 5]);
  const R = sim('r');
  const variante = dificuldade === 'dificil' ? rng.escolha(['aberta', 'custo']) : 'fechada';
  const fatorV = { fechada: 2, aberta: 1, custo: 4 }[variante];
  const V = mul(fatorV * r0 ** 3, PI);
  const h = div(V, mul(PI, pot(R, 2)));
  const S = {
    fechada: soma(mul(2, PI, pot(R, 2)), mul(2, PI, R, h)),
    aberta: soma(mul(PI, pot(R, 2)), mul(2, PI, R, h)),
    custo: soma(mul(4, PI, pot(R, 2)), mul(2, PI, R, h)),
  }[variante];
  const dS = derivar(S, 'r');
  const h0 = fatorV * r0;
  const Sx = A.texto(subs(S, 'r', X));
  const hx = A.texto(subs(h, 'r', X));
  const intervalo = [0.2, 6 * r0];
  const campos = [campo('r', 'r =', num(r0), 'cm', otimo(Sx, intervalo, 'min', 'x'))];
  if (dificuldade === 'medio') campos.push(campo('area', 'S_{\\text{mín}} =', subs(S, 'r', num(r0)), 'cm²', otimo(Sx, intervalo, 'min')));
  else campos.push(campo('h', 'h =', num(h0), 'cm', otimo(Sx, intervalo, 'min', hx)));
  const descricao = {
    fechada: `Uma lata cilíndrica fechada deve ter volume de \\(${tex(V)}\\) cm³. Determine o raio \\(r\\) ${dificuldade === 'medio' ? 'que minimiza a quantidade de material (área total) e essa área mínima' : 'e a altura \\(h\\) que minimizam a quantidade de material (área total)'}.`,
    aberta: `Um copo cilíndrico sem tampa deve ter volume de \\(${tex(V)}\\) cm³. Determine o raio \\(r\\) e a altura \\(h\\) que minimizam a quantidade de material.`,
    custo: `Uma lata cilíndrica fechada deve ter volume de \\(${tex(V)}\\) cm³. O material do fundo e da tampa custa o dobro do material da lateral (por cm²). Determine o raio \\(r\\) e a altura \\(h\\) de menor custo.`,
  }[variante];
  const objetivo = {
    fechada: ['S = 2\\pi r^{2} + 2\\pi r h', 'Área total: duas tampas circulares e a lateral (um retângulo de base \\(2\\pi r\\) e altura \\(h\\)).'],
    aberta: ['S = \\pi r^{2} + 2\\pi r h', 'Área de material: só o fundo (sem tampa) e a lateral.'],
    custo: ['C = 2 \\cdot 2\\pi r^{2} + 2\\pi r h', 'Custo proporcional a: fundo e tampa com peso 2 e lateral com peso 1.'],
  }[variante];
  const nomeS = variante === 'custo' ? 'C' : 'S';
  return {
    enunciado: descricao,
    campos,
    dicas: ['Use o volume \\(\\pi r^2 h\\) para escrever \\(h\\) em função de \\(r\\) e substitua na função a minimizar.', `\\(h = ${tex(h)}\\), então \\(${nomeS}(r) = ${tex(S)}\\). Derive e iguale a zero.`],
    passos: [
      { tex: `${objetivo[0]} \\qquad \\pi r^{2} h = ${tex(V)}`, txt: `${objetivo[1]} A restrição é o volume.` },
      { tex: `h = ${tex(h)}`, txt: 'Isolamos \\(h\\) na restrição.' },
      { tex: `${nomeS}(r) = ${tex(S)}`, txt: 'Substituímos: a função passa a depender só de \\(r > 0\\).' },
      { tex: `${nomeS}'(r) = ${tex(dS)} = 0 \\;\\Rightarrow\\; r^{3} = ${r0 ** 3} \\;\\Rightarrow\\; r = ${r0}`, txt: `Derivamos e igualamos a zero. Como \\(${nomeS}''(r) > 0\\) para \\(r > 0\\), é um mínimo.` },
      dificuldade === 'medio'
        ? { tex: `S(${r0}) = ${tex(subs(S, 'r', num(r0)))}`, txt: `Área mínima. A altura ótima é \\(h = ${h0}\\) cm, igual ao diâmetro.` }
        : { tex: `h = ${tex(subs(h, 'r', num(r0)))}`, txt: variante === 'fechada' ? 'A altura ótima é igual ao diâmetro: \\(h = 2r\\).' : variante === 'aberta' ? 'Sem tampa, a altura ótima é igual ao raio.' : 'Com fundo e tampa mais caros, a lata ótima fica mais alta e estreita: \\(h = 4r\\).' },
    ],
  };
}

export const cercaModelo = { id: 'otim-cerca', titulo: 'Otimização: cerca', gerar: cerca };
export const caixaModelo = { id: 'otim-caixa', titulo: 'Otimização: caixa sem tampa', gerar: caixa };
export const lataModelo = { id: 'otim-lata', titulo: 'Otimização: lata', gerar: lata };
export { cercaModelo as cerca, caixaModelo as caixa, lataModelo as lata };
export { neg };
