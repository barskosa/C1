// Regras básicas: constante, potência, múltiplo constante, soma e diferença.
import { A, X, mul, soma, pot, q, tex, coef, poli, modeloDerivada } from '../base.js';
import { resolverDerivada } from '../regras.js';

const EXPOENTES = [q(1, 2), q(-1), q(-2), q(3, 2), q(1, 3), q(-3), q(-1, 2), q(2), q(3)];

function construir(rng, dificuldade) {
  if (dificuldade === 'facil') return { f: poli(rng, rng.int(2, 4), { minimo: 2 }) };
  if (dificuldade === 'medio') {
    // soma de potências com expoentes negativos e fracionários (raízes e frações)
    const expoentes = rng.embaralhar(EXPOENTES).slice(0, rng.int(2, 3));
    if (expoentes.every((e) => e.d === 1 && e.n > 0)) expoentes[0] = q(1, 2);
    const f = soma(...expoentes.map((e) => mul(coef(rng, 6), pot(X, e))), rng.chance(0.4) ? coef(rng, 9) : 0);
    return { f, dominio: [0.3, 4] };
  }
  // difícil: é preciso reescrever antes (dividir por x^k ou distribuir √x)
  const numerador = poli(rng, rng.int(2, 3), { minimo: 3 });
  const original = rng.chance(0.5) ? mul(numerador, pot(X, -rng.int(1, 2))) : mul(A.raiz(X), numerador);
  const f = A.expandir(original);
  const dividiu = original.f.some((x) => x.e.n < 0);
  return {
    f, original, fTex: tex(original), dominio: [0.3, 4],
    enunciado: `Calcule a derivada de \\(f(x) = ${tex(original)}\\) usando apenas as regras básicas.`,
    antes: [{
      tex: `f(x) = ${tex(f)}`,
      txt: dividiu
        ? 'O denominador é um único termo: dividimos cada parcela do numerador por ele, transformando o quociente em soma de potências.'
        : 'Distribuímos \\(\\sqrt{x} = x^{1/2}\\) em cada parcela, somando os expoentes: o produto vira uma soma de potências.',
    }],
  };
}

const modelo = modeloDerivada('basicas', 'Regras básicas', construir);
const gerarPadrao = modelo.gerar;
modelo.gerar = (rng, dificuldade) => {
  const questao = gerarPadrao(rng, dificuldade);
  if (dificuldade === 'dificil') {
    questao.dicas = ['Não é preciso a regra do produto nem a do quociente: reescreva a função como soma de potências de \\(x\\).', `Reescrevendo: \\(${questao.passos[0].tex}\\). Agora derive termo a termo.`];
  }
  return questao;
};
export { resolverDerivada };
export default modelo;
