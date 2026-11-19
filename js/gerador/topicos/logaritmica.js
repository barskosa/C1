// Derivação logarítmica: variável na base e no expoente, ou muitos fatores.
import { A, X, mul, soma, pot, tex, q, FUNCOES, questaoDerivada } from '../base.js';
import { texSoma } from '../formatar.js';

const { derivar, ln, texto } = A;

/** Produto/quociente de potências de fatores afins: y'/y é uma soma de frações simples. */
function muitosFatores(rng) {
  const deslocamentos = rng.embaralhar([1, 2, 3, 4, 5]).slice(0, 3);
  const expoentes = [rng.int(2, 4), rng.escolha([q(1, 2), q(3, 2), q(1, 3)]), -rng.int(2, 4)];
  const fatores = deslocamentos.map((d, i) => ({ base: soma(X, d), e: typeof expoentes[i] === 'number' ? q(expoentes[i]) : expoentes[i] }));
  const y = mul(...fatores.map((f) => pot(f.base, f.e)));
  const lnTermos = fatores.map((f) => mul({ t: 'n', ...f.e }, ln(f.base)));
  const dTermos = fatores.map((f) => mul({ t: 'n', ...f.e }, pot(f.base, -1)));
  const soma1 = texSoma(lnTermos.map(tex));
  const soma2 = texSoma(dTermos.map(tex));
  return {
    enunciado: `Use derivação logarítmica para calcular a derivada de \\(y = ${tex(y)}\\), para \\(x > 0\\).`,
    tipoResposta: 'expressao',
    rotulo: "y' =",
    respostaLatex: `${tex(y)}\\left(${soma2}\\right)`,
    respostaExpr: `${texto(y)}*(${dTermos.map(texto).join(' + ')})`,
    variaveis: ['x'],
    dominio: [0.3, 4],
    dicas: ['Aplique \\(\\ln\\) dos dois lados: produto vira soma, quociente vira diferença e os expoentes descem.', `\\(\\ln y = ${soma1}\\). Agora derive os dois lados.`],
    passos: [
      { tex: `\\ln y = ${soma1}`, txt: 'Aplicamos \\(\\ln\\) e usamos as propriedades: \\(\\ln(AB) = \\ln A + \\ln B\\), \\(\\ln\\frac{A}{B} = \\ln A - \\ln B\\), \\(\\ln A^r = r\\ln A\\).' },
      { tex: `\\frac{y'}{y} = ${soma2}`, txt: "Derivamos os dois lados: \\((\\ln y)' = y'/y\\) e, em cada termo, \\((\\ln u)' = u'/u\\)." },
      { tex: `y' = ${tex(y)}\\left(${soma2}\\right)`, txt: 'Multiplicamos por \\(y\\) e voltamos à expressão original.' },
    ],
    errosComuns: [{ expr: dTermos.map(texto).join(' + '), msg: "Isso é \\(y'/y\\). Falta multiplicar por \\(y\\)." }],
    conferencia: { tipo: 'derivada', f: texto(y), fTex: tex(y), var: 'x' },
  };
}

export default {
  id: 'logaritmica',
  titulo: 'Derivação logarítmica',
  gerar(rng, dificuldade) {
    if (dificuldade === 'dificil' && rng.chance(0.5)) return muitosFatores(rng);
    const k = rng.int(2, 4);
    const opcoes = {
      facil: [() => pot(X, X), () => pot(X, mul(k, X)), () => pot(mul(k, X), X), () => pot(X, pot(X, 2))],
      medio: [() => pot(X, FUNCOES.sen(X)), () => pot(X, FUNCOES.cos(X)), () => pot(X, A.raiz(X)), () => pot(soma(pot(X, 2), 1), X), () => pot(X, ln(X)), () => pot(X, A.div(1, X))],
      dificil: [() => pot(FUNCOES.sen(X), X), () => pot(soma(1, pot(X, 2)), FUNCOES.sen(X)), () => pot(ln(X), X), () => pot(soma(X, 1), A.raiz(X))],
    };
    const f = rng.escolha(opcoes[dificuldade])();
    const dominio = dificuldade === 'dificil' ? [1.3, 2.8] : [0.3, 3];
    return questaoDerivada(f, { dominio, nome: 'y', rotulo: "y'", rotuloF: 'y', enunciado: `Calcule a derivada de \\(y = ${tex(f)}\\), para \\(x\\) em que a base é positiva.` });
  },
};
export { derivar };
