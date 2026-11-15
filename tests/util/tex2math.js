// Conversor de LaTeX (o subconjunto usado no site) para expressões do math.js.
//
// Serve para conferir o que o aluno realmente lê: os testes pegam a fórmula
// exibida, convertem para uma expressão avaliável e comparam numericamente com
// o valor de referência calculado pelo math.js.
//
// Convenções aceitas (as mesmas do conteúdo e do gerador):
//   - funções: \sen \cos \tg \cotg \sec \cossec \ln \log \log_{a} \arcsen \arccos \arctg
//     (e as formas internacionais \sin \tan \cot \csc \arcsin \arctan);
//   - argumento sem parênteses vai até o próximo operador ou função:
//     \sen 2x = sen(2x), \cos x^2 = cos(x²), \sen x \cos x = sen(x)·cos(x);
//   - \sen^2 x = (sen x)²; \log sem base é o logaritmo decimal;
//   - 0{,}5 é o decimal 0,5; \text{...} (unidades) é ignorado.

const FUNCOES = {
  sen: 'sin', sin: 'sin', cos: 'cos', tg: 'tan', tan: 'tan', cotg: 'cot', cot: 'cot',
  sec: 'sec', cossec: 'csc', csc: 'csc', ln: 'log', exp: 'exp',
  arcsen: 'asin', arcsin: 'asin', arccos: 'acos', arctg: 'atan', arctan: 'atan',
  senh: 'sinh', sinh: 'sinh', cosh: 'cosh', tgh: 'tanh', tanh: 'tanh',
};
const LETRAS_GREGAS = new Set(['theta', 'alpha', 'beta', 'gamma', 'omega', 'phi', 'lambda']);
const ENVOLTORIOS = new Set(['boxed', 'mathbf', 'mathit', 'bm']);

function limpar(tex) {
  return String(tex)
    .replace(/−/g, '-')
    .replace(/\\(?:left|right)\s*\./g, ' ')
    .replace(/\\(?:left|right|bigl|bigr|Bigl|Bigr|biggl|biggr|Biggl|Biggr|bigg|Bigg|big|Big|displaystyle|textstyle|limits|nolimits)(?![a-zA-Z])/g, ' ')
    .replace(/\\(?:text|mathrm|textit|textbf)\s*\{[^{}]*\}/g, ' ')
    .replace(/\\operatorname\s*\{\s*([a-zA-Z]+)\s*\}/g, '\\$1 ')
    .replace(/\\[dt]frac(?![a-zA-Z])/g, '\\frac')
    .replace(/\\(?:quad|qquad)(?![a-zA-Z])/g, ' ')
    .replace(/\\[,;:! ]/g, ' ')
    .replace(/\\(?:cdot|times)(?![a-zA-Z])/g, '*')
    .replace(/\\div(?![a-zA-Z])/g, '/')
    .replace(/\\(?:lbrace|\{)/g, '(')
    .replace(/\\(?:rbrace|\})/g, ')')
    .replace(/\\(?:lvert|rvert|vert|\|)(?![a-zA-Z])/g, '|')
    .replace(/[~&]/g, ' ')
    .replace(/·/g, '*');
}

function tokenizar(tex) {
  const fonte = limpar(tex);
  const tokens = [];
  let i = 0;
  while (i < fonte.length) {
    const c = fonte[i];
    if (/\s/.test(c)) { i += 1; continue; }
    const numero = /^\d+(?:(?:\{,\}|\.)\d+)?/.exec(fonte.slice(i));
    if (numero) {
      tokens.push({ tipo: 'num', valor: numero[0].replace('{,}', '.') });
      i += numero[0].length;
      continue;
    }
    if (c === '\\') {
      const comando = /^\\([a-zA-Z]+)/.exec(fonte.slice(i));
      if (!comando) throw new Error(`comando LaTeX inesperado em "${fonte.slice(i, i + 8)}"`);
      tokens.push({ tipo: 'cmd', valor: comando[1] });
      i += comando[0].length;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) { tokens.push({ tipo: 'letra', valor: c }); i += 1; continue; }
    if ("+-*/^_()[]{}|!',.<>=".includes(c)) { tokens.push({ tipo: 'sim', valor: c }); i += 1; continue; }
    throw new Error(`caractere inesperado "${c}"`);
  }
  return tokens;
}

class Analisador {
  constructor(tex) {
    this.tex = tex;
    this.tokens = tokenizar(tex);
    this.pos = 0;
    this.modulo = 0; // profundidade de |...| para decidir se "|" abre ou fecha
  }

  get atual() { return this.tokens[this.pos]; }
  eh(valor, tipo = 'sim') { const t = this.atual; return Boolean(t) && t.tipo === tipo && t.valor === valor; }
  avancar() { return this.tokens[this.pos++]; }
  exigir(valor) {
    if (!this.eh(valor)) this.falha(`esperava "${valor}"`);
    this.pos += 1;
  }
  falha(mensagem) {
    const visto = this.atual ? `"${this.atual.valor}"` : 'fim da expressão';
    throw new Error(`${mensagem}, mas encontrei ${visto} em: ${this.tex}`);
  }

  analisar() {
    const resultado = this.soma();
    if (this.pos < this.tokens.length) this.falha('sobraram símbolos');
    return resultado;
  }

  soma() {
    let esquerda = this.produto();
    while (this.eh('+') || this.eh('-')) {
      const operador = this.avancar().valor;
      esquerda = `(${esquerda} ${operador} ${this.produto()})`;
    }
    return esquerda;
  }

  produto() {
    let esquerda = this.unario();
    for (;;) {
      if (this.eh('*')) { this.pos += 1; esquerda = `(${esquerda} * ${this.unario()})`; }
      else if (this.eh('/')) { this.pos += 1; esquerda = `(${esquerda} / ${this.unario()})`; }
      else if (this.iniciaFator()) esquerda = `(${esquerda} * ${this.fator()})`;
      else break;
    }
    return esquerda;
  }

  unario() {
    if (this.eh('-')) { this.pos += 1; return `(-${this.unario()})`; }
    if (this.eh('+')) { this.pos += 1; return this.unario(); }
    return this.fator();
  }

  iniciaFator() {
    const t = this.atual;
    if (!t) return false;
    if (t.tipo === 'num' || t.tipo === 'letra') return true;
    if (t.tipo === 'sim') return t.valor === '(' || t.valor === '[' || t.valor === '{' || (t.valor === '|' && this.modulo === 0);
    return t.valor === 'frac' || t.valor === 'sqrt' || t.valor === 'pi' || t.valor === 'infty' || t.valor === 'log'
      || t.valor === 'underbrace' || t.valor === 'overbrace' || t.valor in FUNCOES || LETRAS_GREGAS.has(t.valor) || ENVOLTORIOS.has(t.valor);
  }

  fator() {
    let base = this.base();
    for (;;) {
      if (this.eh('^')) { this.pos += 1; base = `((${base})^(${this.expoente()}))`; }
      else if (this.eh('!')) { this.pos += 1; base = `factorial(${base})`; }
      else if (this.eh("'")) this.falha('não sei avaliar uma derivada indicada com apóstrofo');
      else break;
    }
    return base;
  }

  grupo() {
    this.exigir('{');
    const dentro = this.soma();
    this.exigir('}');
    return dentro;
  }

  /** Expoente ou índice: um grupo {...} ou um único símbolo. */
  expoente() {
    if (this.eh('{')) return this.grupo();
    const t = this.atual;
    if (!t) this.falha('esperava um expoente');
    if (t.tipo === 'num') {
      // Em LaTeX, x^12 significa x¹ seguido de 2: só o primeiro dígito é o expoente.
      if (t.valor.length > 1) this.falha('expoente com mais de um dígito precisa de chaves');
      this.pos += 1;
      return t.valor;
    }
    if (t.tipo === 'letra') { this.pos += 1; return t.valor; }
    if (t.tipo === 'cmd' && t.valor === 'pi') { this.pos += 1; return 'pi'; }
    return this.falha('expoente inválido');
  }

  indice() {
    this.exigir('_');
    if (this.eh('{')) {
      this.pos += 1;
      let texto = '';
      while (this.atual && !this.eh('}')) texto += this.avancar().valor;
      this.exigir('}');
      return texto;
    }
    return this.avancar().valor;
  }

  base() {
    const t = this.atual;
    if (!t) this.falha('expressão incompleta');
    if (t.tipo === 'num') { this.pos += 1; return t.valor; }
    if (t.tipo === 'letra') {
      this.pos += 1;
      if (t.valor === 'e' && !this.eh('_')) return 'e';
      if (this.eh('_')) return `${t.valor}_${this.indice().replace(/[^a-zA-Z0-9]/g, '')}`;
      return t.valor;
    }
    if (t.tipo === 'sim') {
      if (t.valor === '(' || t.valor === '[') {
        this.pos += 1;
        const dentro = this.soma();
        this.exigir(t.valor === '(' ? ')' : ']');
        return `(${dentro})`;
      }
      if (t.valor === '{') return `(${this.grupo()})`;
      if (t.valor === '|') {
        this.pos += 1;
        this.modulo += 1;
        const dentro = this.soma();
        this.exigir('|');
        this.modulo -= 1;
        return `abs(${dentro})`;
      }
      this.falha('símbolo inesperado');
    }
    // comandos
    this.pos += 1;
    const nome = t.valor;
    if (nome === 'frac') {
      const numerador = this.grupo();
      const denominador = this.grupo();
      return `((${numerador}) / (${denominador}))`;
    }
    if (nome === 'sqrt') {
      if (this.eh('[')) {
        this.pos += 1;
        const indice = this.soma();
        this.exigir(']');
        return `nthRoot(${this.grupo()}, ${indice})`;
      }
      return `sqrt(${this.grupo()})`;
    }
    if (nome === 'pi') return 'pi';
    if (nome === 'infty') return 'Infinity';
    if (LETRAS_GREGAS.has(nome)) return nome;
    if (ENVOLTORIOS.has(nome)) return `(${this.grupo()})`;
    if (nome === 'underbrace' || nome === 'overbrace') {
      const dentro = this.grupo();
      if (this.eh('_') || this.eh('^')) {
        this.pos += 1;
        if (this.eh('{')) {
          let profundidade = 0;
          do {
            if (this.eh('{')) profundidade += 1;
            if (this.eh('}')) profundidade -= 1;
            this.pos += 1;
          } while (profundidade > 0 && this.atual);
        } else this.pos += 1;
      }
      return `(${dentro})`;
    }
    if (nome === 'log' || nome in FUNCOES) return this.funcao(nome);
    this.pos -= 1;
    return this.falha(`comando \\${nome} não suportado`);
  }

  funcao(nome) {
    let baseLog = null;
    let potencia = null;
    if (nome === 'log' && this.eh('_')) { this.pos += 1; baseLog = this.expoente(); }
    if (this.eh('^')) { this.pos += 1; potencia = this.expoente(); }
    const argumento = this.argumento();
    let resultado;
    if (nome === 'log') resultado = baseLog ? `log(${argumento}, ${baseLog})` : `log10(${argumento})`;
    else resultado = `${FUNCOES[nome]}(${argumento})`;
    return potencia ? `((${resultado})^(${potencia}))` : resultado;
  }

  argumento() {
    if (this.eh('(')) {
      this.pos += 1;
      const dentro = this.soma();
      this.exigir(')');
      return dentro;
    }
    if (this.eh('|') && this.modulo === 0) return this.base(); // \ln|x|
    // Argumento sem parênteses: fatores simples em sequência (2x, x^2, \frac{x}{2}, \pi ...).
    const partes = [];
    for (;;) {
      const t = this.atual;
      const simples = t && (t.tipo === 'num' || t.tipo === 'letra' || (t.tipo === 'sim' && t.valor === '{')
        || (t.tipo === 'cmd' && (t.valor === 'frac' || t.valor === 'sqrt' || t.valor === 'pi' || LETRAS_GREGAS.has(t.valor))));
      if (!simples) break;
      partes.push(this.fator());
    }
    if (!partes.length) this.falha('função sem argumento');
    return partes.join(' * ');
  }
}

/** Converte uma expressão LaTeX (sem sinal de igual) em expressão do math.js. */
export function texParaMath(tex) {
  return new Analisador(tex).analisar();
}

/**
 * Divide uma linha em trechos separados por "=", "≈" e setas de implicação
 * (apenas fora de chaves). Ex.: "f'(x) = 2 \cdot 3x^2 = 6x^2" → ["f'(x)", "2 \cdot 3x^2", "6x^2"].
 */
export function segmentos(tex) {
  const fonte = String(tex)
    .replace(/\\begin\{(?:aligned|align\*?|gathered)\}/g, ' ')
    .replace(/\\end\{(?:aligned|align\*?|gathered)\}/g, ' ')
    .replace(/\\\\/g, ' ')
    .replace(/&/g, ' ');
  const partes = [];
  let profundidade = 0;
  let atual = '';
  for (let i = 0; i < fonte.length; i++) {
    const c = fonte[i];
    if (c === '{') profundidade += 1;
    if (c === '}') profundidade -= 1;
    if (profundidade === 0) {
      if (c === '=') { partes.push(atual); atual = ''; continue; }
      const separador = /^\\(?:approx|simeq|Rightarrow|Longrightarrow|implies|iff)(?![a-zA-Z])/.exec(fonte.slice(i));
      if (separador) { partes.push(atual); atual = ''; i += separador[0].length - 1; continue; }
    }
    atual += c;
  }
  partes.push(atual);
  return partes.map((p) => p.trim()).filter((p) => p.length > 0);
}
