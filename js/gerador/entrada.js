// Leitura da resposta digitada pelo aluno.
//
// Aceita notação brasileira e internacional (sen/sin, tg/tan, cotg, cossec,
// arcsen, arctg, ln, log, raiz/sqrt, pi/π, e^x, vírgula decimal, ², ·, √) e
// converte para uma expressão do math.js com multiplicações explícitas.
// Convenções (as mesmas do LaTeX do site):
//   sen x cos x = sen(x)·cos(x)    sen 2x = sen(2x)    sen^2 x = (sen x)^2
//   e^2x = e^(2x)                   ln|x| = ln(|x|)     log x = log na base 10
//   0,5 = 0.5 (decimal)             log(x; 2) = log de x na base 2

export class ErroEntrada extends Error {}

const FUNCOES = {
  sen: 'sin', sin: 'sin', cos: 'cos', tg: 'tan', tan: 'tan', cotg: 'cot', cotan: 'cot', cot: 'cot', ctg: 'cot',
  sec: 'sec', cossec: 'csc', cosec: 'csc', csc: 'csc',
  arcsen: 'asin', arcsin: 'asin', asen: 'asin', asin: 'asin', arccos: 'acos', acos: 'acos',
  arctg: 'atan', arctan: 'atan', atan: 'atan', atg: 'atan',
  ln: 'log', log: 'log10', log10: 'log10', log2: 'log2', exp: 'exp', raiz: 'sqrt', sqrt: 'sqrt', cbrt: 'cbrt', abs: 'abs',
  senh: 'sinh', sinh: 'sinh', cosh: 'cosh', tgh: 'tanh', tanh: 'tanh',
};
const CONSTANTES = { pi: 'pi', e: 'e' };
const NOMES = [...Object.keys(FUNCOES), ...Object.keys(CONSTANTES)].sort((a, b) => b.length - a.length);
const SOBRESCRITOS = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };

/** Limpa caracteres: sinais tipográficos, sobrescritos, acentos, vírgula decimal. */
export function normalizar(texto) {
  return String(texto)
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (s) => `^(${[...s].map((c) => SOBRESCRITOS[c]).join('')})`)
    .replace(/[−–—]/g, '-')
    .replace(/[·×⋅∙•]/g, '*')
    .replace(/÷/g, '/')
    .replace(/√/g, ' sqrt ')
    .replace(/π/g, ' pi ')
    .replace(/[′’]/g, "'")
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/;/g, ',')
    .replace(/(\d(?:\.\d+)?)\s*%/g, '($1/100)')
    .replace(/\*\*/g, '^')
    .trim();
}

function tokenizar(texto, permitidas) {
  const tokens = [];
  const re = /(\s+)|(\d+(?:\.\d+)?|\.\d+)|(log10|log2|[a-z]+)|([+\-*/^(),=|!])/gy;
  let m;
  let espaco = false;
  while (re.lastIndex < texto.length) {
    const inicio = re.lastIndex;
    m = re.exec(texto);
    if (!m) throw new ErroEntrada(`Não entendi o símbolo “${texto[inicio]}”.`);
    if (m[1]) { espaco = true; continue; }
    if (m[2]) tokens.push({ t: 'num', v: m[2].startsWith('.') ? `0${m[2]}` : m[2], espaco });
    else if (m[3]) tokens.push(...decompor(m[3], permitidas).map((t, i) => ({ ...t, espaco: i === 0 ? espaco : false })));
    else tokens.push({ t: m[4] === '(' || m[4] === ')' || m[4] === '|' || m[4] === ',' ? m[4] : 'op', v: m[4], espaco });
    espaco = false;
  }
  return tokens;
}

/** Separa um identificador colado ("xsenx" → x, sen, x). */
function decompor(id, permitidas) {
  const partes = [];
  let i = 0;
  while (i < id.length) {
    const nome = NOMES.find((n) => id.startsWith(n, i));
    if (nome) {
      partes.push(FUNCOES[nome] ? { t: 'fn', v: FUNCOES[nome], nome } : { t: 'const', v: CONSTANTES[nome] });
      i += nome.length;
    } else if (permitidas.includes(id[i])) {
      partes.push({ t: 'var', v: id[i] });
      i += 1;
    } else {
      const letra = id.length === 1;
      throw new ErroEntrada(letra
        ? `“${id}” não faz parte desta resposta. ${permitidas.length ? `Use a variável ${permitidas.join(' e ')}.` : 'A resposta deve ser um número (pode usar frações, raiz, pi, e, ln…).'}`
        : `Não reconheço “${id}”. Use, por exemplo: sen, cos, tg, ln, raiz, pi, e.`);
    }
  }
  return partes;
}

class Conversor {
  constructor(tokens) { this.tokens = tokens; this.i = 0; }
  get atual() { return this.tokens[this.i]; }
  eh(tipo, valor) { const t = this.atual; return Boolean(t) && t.t === tipo && (valor === undefined || t.v === valor); }

  sequencia(fim) {
    let saida = '';
    let operando = false;
    while (this.atual && !this.eh(')') && !(fim === '|' && this.eh('|') && operando)) {
      const t = this.atual;
      if (t.t === 'op' || t.t === ',') {
        if (t.v === '^') throw new ErroEntrada('Falta a base antes de “^”.');
        saida += t.v === ',' ? ', ' : t.v;
        operando = false;
        this.i += 1;
        continue;
      }
      if (operando) saida += '*';
      saida += this.operando();
      operando = true;
    }
    return saida;
  }

  grupo(abre, fecha, nome) {
    this.i += 1;
    const dentro = this.sequencia(fecha);
    if (!this.eh(fecha === ')' ? ')' : '|')) throw new ErroEntrada(`Falta fechar ${nome}.`);
    this.i += 1;
    if (!dentro.trim()) throw new ErroEntrada(`Há ${nome} vazio.`);
    return dentro;
  }

  /** Operando com potências e fatorial em seguida. */
  operando() {
    const t = this.atual;
    let base;
    if (t.t === 'num' || t.t === 'var' || t.t === 'const') { base = t.v; this.i += 1; }
    else if (t.t === '(') base = `(${this.grupo('(', ')', 'um parêntese')})`;
    else if (t.t === '|') base = `abs(${this.grupo('|', '|', 'o módulo |…|')})`;
    else if (t.t === 'fn') base = this.funcao();
    else throw new ErroEntrada(`Não esperava “${t.v}” aqui.`);
    for (;;) {
      if (this.eh('op', '!')) { base += '!'; this.i += 1; }
      else if (this.eh('op', '^')) { this.i += 1; base += `^${this.expoente(t)}`; }
      else break;
    }
    return base;
  }

  expoente(base) {
    let sinal = '';
    if (this.eh('op', '-') || this.eh('op', '+')) { sinal = this.atual.v === '-' ? '-' : ''; this.i += 1; }
    const t = this.atual;
    if (!t) throw new ErroEntrada('O expoente está incompleto.');
    let corpo;
    if (t.t === '(') corpo = `(${this.grupo('(', ')', 'um parêntese')})`;
    else if (t.t === 'num') {
      const partes = [t.v];
      this.i += 1;
      // e^2x significa e^(2x): número colado a variáveis, quando a base é e ou um número
      const colar = base.t === 'const' || base.t === 'num';
      while (colar && this.atual && !this.atual.espaco && (this.eh('var') || this.eh('const'))) { partes.push(this.atual.v); this.i += 1; }
      corpo = partes.length > 1 ? `(${partes.join('*')})` : partes[0];
    } else if (t.t === 'var' || t.t === 'const') { corpo = t.v; this.i += 1; }
    else if (t.t === 'fn') corpo = `(${this.funcao()})`;
    else if (t.t === '|') corpo = `abs(${this.grupo('|', '|', 'o módulo |…|')})`;
    else throw new ErroEntrada('O expoente está incompleto.');
    return sinal ? `(-${corpo})` : corpo;
  }

  funcao() {
    const { v: nome, nome: digitado } = this.atual;
    this.i += 1;
    let potencia = null;
    if (this.eh('op', '^')) { this.i += 1; potencia = this.expoente({ t: 'fn' }); }
    let argumento;
    if (this.eh('(')) argumento = this.grupo('(', ')', 'um parêntese');
    else if (this.eh('|')) argumento = `abs(${this.grupo('|', '|', 'o módulo |…|')})`;
    else {
      const partes = [];
      while (this.eh('num') || this.eh('var') || this.eh('const')) partes.push(this.operando());
      if (!partes.length) throw new ErroEntrada(`Falta o argumento de “${digitado}”: escreva, por exemplo, ${digitado}(x).`);
      argumento = partes.join('*');
    }
    let nomeMath = nome;
    if (nome === 'log10' && /,/.test(argumento.replace(/\([^()]*\)/g, ''))) nomeMath = 'log';
    const chamada = `${nomeMath}(${argumento})`;
    return potencia ? `${chamada}^${potencia}` : chamada;
  }
}

/** Converte um lado (sem "=") para texto do math.js. */
export function converter(texto, permitidas = ['x']) {
  const tokens = tokenizar(normalizar(texto), permitidas);
  if (!tokens.length) throw new ErroEntrada('Digite uma resposta.');
  const c = new Conversor(tokens);
  const saida = c.sequencia();
  if (c.i < tokens.length) throw new ErroEntrada('Há um parêntese fechando sem ter sido aberto.');
  return saida;
}

const NOMES_TEX = {
  sin: '\\operatorname{sen}', cos: '\\cos', tan: '\\operatorname{tg}', cot: '\\operatorname{cotg}', sec: '\\sec', csc: '\\operatorname{cossec}',
  asin: '\\operatorname{arcsen}', acos: '\\arccos', atan: '\\operatorname{arctg}', log: '\\ln', log10: '\\log', log2: '\\log_{2}',
  exp: '\\exp', sinh: '\\operatorname{senh}', cosh: '\\cosh', tanh: '\\operatorname{tgh}',
};

function manipuladorTex(no, opcoes) {
  if (no.type === 'FunctionNode') {
    const nome = no.fn?.name;
    const arg = (k) => no.args[k].toTex(opcoes);
    if (nome === 'sqrt' && no.args.length === 1) return `\\sqrt{${arg(0)}}`;
    if (nome === 'cbrt' && no.args.length === 1) return `\\sqrt[3]{${arg(0)}}`;
    if (nome === 'abs' && no.args.length === 1) return `\\left|${arg(0)}\\right|`;
    if (nome === 'log' && no.args.length === 2) return `\\log_{${arg(1)}}\\left(${arg(0)}\\right)`;
    if (NOMES_TEX[nome] && no.args.length === 1) return `${NOMES_TEX[nome]}\\left(${arg(0)}\\right)`;
  }
  if (no.type === 'SymbolNode' && no.name === 'pi') return '\\pi';
  return undefined;
}

/**
 * Lê a resposta: devolve { expr (texto do math.js), no, latex, avaliar(escopo) }.
 * @param {string} texto  o que o aluno digitou (um lado só, sem "=")
 * @param {{math, variaveis?: string[]}} opcoes
 */
export function ler(texto, { math, variaveis = ['x'] }) {
  const expr = converter(texto, variaveis);
  let no;
  try {
    no = math.parse(expr);
  } catch (erro) {
    throw new ErroEntrada(/end of expression|Unexpected end/i.test(erro.message) ? 'A expressão está incompleta.' : 'Não consegui entender a expressão. Confira os operadores e os parênteses.');
  }
  const compilado = no.compile();
  return {
    expr,
    no,
    latex: no.toTex({ parenthesis: 'auto', implicit: 'hide', handler: manipuladorTex }),
    avaliar(escopo = {}) {
      try {
        const v = compilado.evaluate({ ...escopo });
        return typeof v === 'number' && Number.isFinite(v) ? v : NaN;
      } catch {
        return NaN;
      }
    },
  };
}
