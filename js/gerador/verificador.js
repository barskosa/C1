// Verificação das respostas por equivalência numérica.
//
// A resposta do aluno e a resposta certa são avaliadas em vários pontos
// aleatórios do domínio (pulando os pontos em que alguma não está definida).
// Assim, formas equivalentes (2x·cos(x²) e cos(x²)·2x) são aceitas.
//   expressao  → compara funções de x (ou de x e y)
//   numero     → compara valores, com tolerância
//   reta       → compara coeficiente angular e linear
//   implicita  → compara dy/dx em pontos que pertencem à curva
//   conjunto   → compara o conjunto de valores (ordem não importa)
//   escolha    → compara a opção marcada

import { ler, ErroEntrada, normalizar } from './entrada.js';
import { criarRng } from './rng.js';

const ESTRITO = 1e-6;
const FROUXO = 2e-3;
const perto = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
const pertoRel = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(Math.abs(a), Math.abs(b)) + 1e-9;
const fmt = (v) => String(Number(v.toPrecision(4))).replace('.', ',');

function compilarRef(math, expr) {
  const c = math.compile(expr);
  return (escopo) => {
    try {
      const v = c.evaluate({ ...escopo });
      return typeof v === 'number' && Number.isFinite(v) ? v : NaN;
    } catch {
      return NaN;
    }
  };
}

/** Pontos (x, y) sobre a curva F(x, y) = 0, por varredura em y e bisseção. */
export function pontosDaCurva(math, F, xs, ys, quantos = 10, semente = 'curva') {
  const f = compilarRef(math, F);
  const rng = criarRng(semente);
  const pontos = [];
  for (let tentativa = 0; tentativa < 120 && pontos.length < quantos; tentativa++) {
    const x = xs[0] + (xs[1] - xs[0]) * rng.real();
    const n = 160;
    let yAnt = ys[0];
    let fAnt = f({ x, y: yAnt });
    for (let i = 1; i <= n; i++) {
      const y = ys[0] + ((ys[1] - ys[0]) * i) / n;
      const fy = f({ x, y });
      if (Number.isFinite(fAnt) && Number.isFinite(fy) && fAnt * fy < 0) {
        let [a, b, fa] = [yAnt, y, fAnt];
        for (let k = 0; k < 55; k++) {
          const m = (a + b) / 2;
          const fm = f({ x, y: m });
          if (!Number.isFinite(fm)) break;
          if (fa * fm <= 0) b = m; else { a = m; fa = fm; }
        }
        const raiz = (a + b) / 2;
        if (Math.abs(f({ x, y: raiz })) < 1e-7) { pontos.push({ x, y: raiz }); break; }
      }
      yAnt = y;
      fAnt = fy;
    }
  }
  return pontos;
}

/** Compara duas funções em pontos dados. Devolve 'estrito' | 'frouxo' | 'diferente' | 'poucos'. */
function compararEm(pontos, aluno, ref, minimo = 5) {
  let validos = 0;
  let frouxo = false;
  let indefinidos = 0;
  for (const p of pontos) {
    const b = ref(p);
    if (Number.isNaN(b)) continue;
    const a = aluno(p);
    if (Number.isNaN(a)) { indefinidos += 1; continue; }
    validos += 1;
    if (pertoRel(a, b, ESTRITO)) continue;
    if (pertoRel(a, b, FROUXO)) { frouxo = true; continue; }
    return 'diferente';
  }
  if (indefinidos > validos) return 'diferente';
  if (validos < minimo) return 'poucos';
  return frouxo ? 'frouxo' : 'estrito';
}

function amostras(campo, n = 18) {
  const vars = campo.variaveis ?? ['x'];
  const dom = campo.dominio ?? [-3, 3];
  const rng = criarRng(`amostras|${campo.respostaExpr}`);
  return Array.from({ length: n }, () => Object.fromEntries(vars.map((v) => [v, dom[0] + (dom[1] - dom[0]) * rng.real()])));
}

/** Mensagem de erro comum (do modelo) ou genérica (sinal trocado, fator constante). */
function diagnosticar(campo, pontos, aluno, ref, math) {
  for (const erro of campo.errosComuns ?? []) {
    const r = compararEm(pontos, aluno, compilarRef(math, erro.expr), 3);
    if (r === 'estrito' || r === 'frouxo') return erro.msg;
  }
  const razoes = pontos.map((p) => aluno(p) / ref(p)).filter((r) => Number.isFinite(r));
  if (razoes.length >= 4 && razoes.every((r) => pertoRel(r, razoes[0], 1e-6))) {
    const k = razoes[0];
    if (pertoRel(k, -1, 1e-6)) return 'O sinal está trocado. Confira os sinais de cada termo (e a ordem na regra do quociente).';
    if (Math.abs(k) > 1e-9) return `Sua resposta é \\(${fmt(k).replace(',', '{,}')}\\) vezes a correta: falta ou sobra um fator constante (a derivada de dentro, na regra da cadeia?).`;
  }
  return null;
}

const resultado = (estado, mensagem, extra = {}) => ({ estado, mensagem, ...extra });

function lerSeguro(texto, opcoes) {
  try {
    return { lido: ler(texto, opcoes) };
  } catch (erro) {
    if (erro instanceof ErroEntrada) return { erro: erro.message };
    throw erro;
  }
}

/** Tira um rótulo do começo ("f'(x) =", "y' =", "c ="), exceto em equações de reta. */
const semRotulo = (texto) => (texto.includes('=') ? texto.slice(texto.lastIndexOf('=') + 1) : texto);

function verificarFuncao(campo, texto, math) {
  const variaveis = campo.variaveis ?? ['x'];
  const { lido, erro } = lerSeguro(semRotulo(texto), { math, variaveis });
  if (erro) return resultado('invalido', erro);
  const ref = compilarRef(math, campo.respostaExpr);
  const aluno = (p) => lido.avaliar(p);
  const pontos = campo.tipo === 'implicita'
    ? pontosDaCurva(math, campo.curva.F, campo.curva.x, campo.curva.y, 12, `curva|${campo.curva.F}`)
    : amostras(campo);
  const r = compararEm(pontos, aluno, ref);
  const latexAluno = lido.latex;
  if (r === 'estrito') return resultado('correto', 'Correto!', { latexAluno });
  if (r === 'frouxo') return resultado('correto', 'Correto (com arredondamento numérico).', { latexAluno });
  if (r === 'poucos') return resultado('incorreto', 'Sua expressão não está definida na maior parte do domínio da resposta. Confira raízes, logaritmos e denominadores.', { latexAluno });
  const dica = diagnosticar(campo, pontos, aluno, ref, math);
  return resultado('incorreto', dica ?? (campo.tipo === 'implicita'
    ? 'Ainda não. Nos pontos da curva, sua expressão dá uma inclinação diferente da correta.'
    : 'Ainda não: sua expressão não é equivalente à resposta correta.'), { latexAluno });
}

function compararNumero(a, b, campo) {
  if (campo.tolerancia != null) return pertoRel(a, b, campo.tolerancia) ? 'estrito' : 'diferente';
  if (perto(a, b, ESTRITO)) return 'estrito';
  // arredondamento aceito: ~3 algarismos significativos (sem aceitar 801 no lugar de 800)
  if (Math.abs(a - b) <= Math.max(5e-4 * Math.abs(b), 5e-3)) return 'frouxo';
  return 'diferente';
}

function verificarNumero(campo, texto, math) {
  const { lido, erro } = lerSeguro(semRotulo(texto), { math, variaveis: [] });
  if (erro) return resultado('invalido', erro);
  const a = lido.avaliar();
  if (Number.isNaN(a)) return resultado('invalido', 'Esse valor não é um número real (divisão por zero, raiz de negativo…?).');
  const b = compilarRef(math, campo.respostaExpr)({});
  const r = compararNumero(a, b, campo);
  const latexAluno = lido.latex;
  if (r === 'estrito') return resultado('correto', 'Correto!', { latexAluno });
  if (r === 'frouxo') return resultado('correto', 'Correto (valor aproximado aceito).', { latexAluno });
  for (const erroComum of campo.errosComuns ?? []) {
    const v = compilarRef(math, erroComum.expr)({});
    if (Number.isFinite(v) && compararNumero(a, v, campo) !== 'diferente') return resultado('incorreto', erroComum.msg, { latexAluno });
  }
  if (Number.isFinite(b) && perto(a, -b, FROUXO) && Math.abs(b) > 1e-9) return resultado('incorreto', 'O valor absoluto está certo, mas o sinal não.', { latexAluno });
  if (campo.tolerancia != null && perto(a, b, FROUXO)) return resultado('incorreto', 'Está perto, mas não é o valor pedido. Use a fórmula indicada em vez do valor da calculadora, e não arredonde.', { latexAluno });
  return resultado('incorreto', 'Ainda não: o valor não confere.', { latexAluno });
}

function verificarReta(campo, texto, math) {
  const partes = texto.split('=');
  if (partes.length > 2) return resultado('invalido', 'Use no máximo um sinal de igual.');
  const lados = [];
  for (const parte of partes.length === 2 ? partes : ['y', partes[0]]) {
    const { lido, erro } = lerSeguro(parte, { math, variaveis: ['x', 'y'] });
    if (erro) return resultado('invalido', erro);
    lados.push(lido);
  }
  const g = (x, y) => lados[0].avaliar({ x, y }) - lados[1].avaliar({ x, y });
  const yDe = (x) => {
    const [g0, g1, g2] = [g(x, 0), g(x, 1), g(x, 2)];
    const c = g1 - g0;
    if (!Number.isFinite(c) || Math.abs(c) < 1e-12 || !pertoRel(g2 - g1, c, 1e-7)) return NaN;
    return -g0 / c;
  };
  const latexAluno = `${lados[0].latex} = ${lados[1].latex}`;
  const xs = [-1.3, 0, 0.7, 2.1];
  const ys = xs.map(yDe);
  if (ys.some(Number.isNaN)) return resultado('invalido', 'Escreva a equação de uma reta, por exemplo \\(y = 2x - 1\\) ou \\(y - 1 = 2(x - 1)\\).', { latexAluno });
  const m = (ys[3] - ys[0]) / (xs[3] - xs[0]);
  const b = ys[1];
  if (!xs.every((x, i) => pertoRel(ys[i], m * x + b, 1e-7))) return resultado('invalido', 'Essa equação não é de uma reta.', { latexAluno });
  const ref = compilarRef(math, campo.respostaExpr);
  const [b0, m0] = [ref({ x: 0 }), ref({ x: 1 }) - ref({ x: 0 })];
  const mOk = perto(m, m0, ESTRITO) || perto(m, m0, FROUXO);
  const bOk = perto(b, b0, ESTRITO) || perto(b, b0, FROUXO);
  if (mOk && bOk) return resultado('correto', 'Correto!', { latexAluno });
  for (const erro of campo.errosComuns ?? []) {
    const e = compilarRef(math, erro.expr);
    const [be, me] = [e({ x: 0 }), e({ x: 1 }) - e({ x: 0 })];
    if (perto(m, me, FROUXO) && perto(b, be, FROUXO)) return resultado('incorreto', erro.msg, { latexAluno });
  }
  if (mOk) return resultado('incorreto', 'A inclinação está certa, mas a reta não passa pelo ponto do gráfico: confira o coeficiente linear.', { latexAluno });
  if (bOk) return resultado('incorreto', 'O coeficiente linear confere, mas a inclinação não. Confira a derivada no ponto.', { latexAluno });
  return resultado('incorreto', 'Ainda não: nem a inclinação nem o coeficiente linear conferem.', { latexAluno });
}

const VAZIO = /^(nenhum|nenhuma|vazio|nao ha|nao existe|nao existem|nao tem|conjunto vazio|\{\s*\}|∅|-)$/;

function verificarConjunto(campo, texto, math) {
  const bruto = texto.replace(/[{}]/g, ' ').trim();
  let valores = [];
  let latexAluno = '\\varnothing';
  if (!VAZIO.test(normalizar(bruto)) && bruto !== '∅') {
    // separadores: ";", " ou ", " e ", e vírgula seguida de espaço ("1,5" sem espaço é decimal)
    const pedacos = bruto
      .replace(/\b[a-zA-Z]\s*=/g, ' ')
      .split(/;|\s+ou\s+|\s+e\s+|,\s+/i)
      .map((p) => p.trim())
      .filter(Boolean);
    if (!pedacos.length) return resultado('invalido', 'Digite os valores separados por “;”, ou escreva “nenhum”.');
    const textos = [];
    for (const pedaco of pedacos) {
      const pm = pedaco.match(/^(?:\+\/?-|±)/);
      const corpo = pm ? pedaco.slice(pm[0].length) : pedaco;
      const { lido, erro } = lerSeguro(corpo, { math, variaveis: [] });
      if (erro) return resultado('invalido', erro);
      const v = lido.avaliar();
      if (Number.isNaN(v)) return resultado('invalido', `“${pedaco}” não é um número real.`);
      if (pm) { valores.push(v, -v); textos.push(`\\pm ${lido.latex}`); } else { valores.push(v); textos.push(lido.latex); }
    }
    latexAluno = textos.join(';\\ ');
  }
  valores = valores.filter((v, i) => valores.findIndex((w) => perto(v, w, ESTRITO)) === i);
  const esperados = campo.valores ?? [];
  const faltam = esperados.filter((e) => !valores.some((v) => perto(v, e, FROUXO)));
  const sobram = valores.filter((v) => !esperados.some((e) => perto(v, e, FROUXO)));
  if (!faltam.length && !sobram.length) return resultado('correto', 'Correto!', { latexAluno });
  if (!esperados.length) return resultado('incorreto', 'Não há nenhum valor neste caso: a resposta é “nenhum”.', { latexAluno });
  const partes = [];
  if (faltam.length) partes.push(`falta${faltam.length > 1 ? 'm' : ''} ${faltam.length} valor${faltam.length > 1 ? 'es' : ''}`);
  if (sobram.length) partes.push(`há ${sobram.length} valor${sobram.length > 1 ? 'es' : ''} que não ${sobram.length > 1 ? 'fazem' : 'faz'} parte da resposta`);
  return resultado('incorreto', `Ainda não: ${partes.join(' e ')}.`, { latexAluno });
}

/**
 * Verifica a resposta de um campo.
 * @returns {{estado: 'vazio'|'invalido'|'correto'|'incorreto', mensagem: string, latexAluno?: string}}
 */
export function verificarCampo(campo, entrada, math = globalThis.math) {
  if (campo.tipo === 'escolha') {
    if (entrada == null || entrada === '') return resultado('vazio', 'Escolha uma opção.');
    const indice = Number(entrada);
    const latexAluno = `\\text{${campo.opcoes[indice]}}`;
    return indice === campo.correta ? resultado('correto', 'Correto!', { latexAluno }) : resultado('incorreto', 'Não é essa a conclusão.', { latexAluno });
  }
  const texto = String(entrada ?? '').trim();
  if (!texto) return resultado('vazio', 'Digite sua resposta.');
  switch (campo.tipo) {
    case 'numero': return verificarNumero(campo, texto, math);
    case 'reta': return verificarReta(campo, texto, math);
    case 'conjunto': return verificarConjunto(campo, texto, math);
    default: return verificarFuncao(campo, texto, math);
  }
}

/** Prévia em LaTeX do que o aluno está digitando (ou null, se ainda não dá para ler). */
export function previa(campo, entrada, math = globalThis.math) {
  const texto = String(entrada ?? '').trim();
  if (!texto) return { latex: null };
  try {
    if (campo.tipo === 'reta') {
      const partes = texto.split('=');
      const lados = (partes.length === 2 ? partes : ['y', partes[0]]).map((p) => ler(p, { math, variaveis: ['x', 'y'] }).latex);
      return { latex: lados.join(' = ') };
    }
    if (campo.tipo === 'conjunto') {
      const r = verificarConjunto({ ...campo, valores: [] }, texto, math);
      return r.estado === 'invalido' ? { erro: r.mensagem } : { latex: r.latexAluno };
    }
    const variaveis = campo.tipo === 'numero' ? [] : campo.variaveis ?? ['x'];
    return { latex: ler(semRotulo(texto), { math, variaveis }).latex };
  } catch (erro) {
    if (erro instanceof ErroEntrada) return { erro: erro.message };
    return { erro: 'Não consegui ler a expressão.' };
  }
}
