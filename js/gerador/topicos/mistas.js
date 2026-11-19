// Regras mistas: sorteia a estrutura entre os modelos de regra, sem dizer qual é.
import { questaoDerivada } from '../base.js';
import { construir as produto } from './produto.js';
import { construir as quociente } from './quociente.js';
import { construir as cadeia } from './cadeia.js';
import { construir as trig } from './trig.js';
import { construir as expLog } from './exp-log.js';
import { construir as inversas } from './inversas.js';

const CONSTRUTORES = [produto, quociente, cadeia, trig, expLog, inversas];

export default {
  id: 'mistas',
  titulo: 'Regras mistas',
  gerar(rng, dificuldade) {
    const { f, dominio } = rng.escolha(CONSTRUTORES)(rng, dificuldade);
    const questao = questaoDerivada(f, { dominio });
    questao.dicas = ['Antes de derivar, descubra a estrutura: qual é a última operação que você faria para calcular \\(f(x)\\)? Soma, produto, quociente ou composição?', ...questao.dicas.slice(0, 1)];
    return questao;
  },
};
