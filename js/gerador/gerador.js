// Registro dos modelos de questão e geração reproduzível.
//
// Uma questão é identificada por (modelo, dificuldade, seed): a mesma tripla
// sempre gera a mesma questão. Os tópicos do filtro agrupam um ou mais modelos.

import { criarRng, hashTexto } from './rng.js';
import basicas from './topicos/basicas.js';
import produto from './topicos/produto.js';
import quociente from './topicos/quociente.js';
import cadeia from './topicos/cadeia.js';
import trig from './topicos/trig.js';
import expLog from './topicos/exp-log.js';
import inversas from './topicos/inversas.js';
import logaritmica from './topicos/logaritmica.js';
import mistas from './topicos/mistas.js';
import ponto from './topicos/ponto.js';
import { tangente, normal } from './topicos/tangente.js';
import segunda from './topicos/segunda.js';
import implicita from './topicos/implicita.js';
import criticos from './topicos/criticos.js';
import inflexao from './topicos/inflexao.js';
import lhopital from './topicos/lhopital.js';
import { escada, balao, cone, sombra } from './topicos/taxas.js';
import { cerca, caixa, lata } from './topicos/otimizacao.js';
import { taxaMedia, definicao, diferenciabilidade } from './topicos/fundamentos.js';
import { linear, tvm } from './topicos/aproximacao-tvm.js';

export const DIFICULDADES = [
  { id: 'facil', rotulo: 'Fácil', descricao: 'uma regra, coeficientes pequenos' },
  { id: 'medio', rotulo: 'Médio', descricao: 'combina duas regras' },
  { id: 'dificil', rotulo: 'Difícil', descricao: 'composições aninhadas e problemas contextualizados' },
];

const LISTA = [
  taxaMedia, definicao, diferenciabilidade,
  basicas, produto, quociente, cadeia, trig, expLog, inversas, logaritmica, mistas,
  ponto, segunda, implicita,
  tangente, normal, linear, tvm, criticos, inflexao, lhopital,
  escada, balao, cone, sombra, cerca, caixa, lata,
];

export const MODELOS = Object.fromEntries(LISTA.map((m) => [m.id, m]));

export const TOPICOS = [
  { id: 'taxa-variacao', titulo: 'Taxa de variação média e instantânea', grupo: 'Fundamentos', modelos: ['taxa-media'] },
  { id: 'definicao', titulo: 'Derivada pela definição (limite)', grupo: 'Fundamentos', modelos: ['definicao'] },
  { id: 'diferenciabilidade', titulo: 'Diferenciabilidade', grupo: 'Fundamentos', modelos: ['diferenciabilidade'] },
  { id: 'basicas', titulo: 'Regras básicas', grupo: 'Calcular f′(x)', modelos: ['basicas'] },
  { id: 'produto', titulo: 'Regra do produto', grupo: 'Calcular f′(x)', modelos: ['produto'] },
  { id: 'quociente', titulo: 'Regra do quociente', grupo: 'Calcular f′(x)', modelos: ['quociente'] },
  { id: 'cadeia', titulo: 'Regra da cadeia', grupo: 'Calcular f′(x)', modelos: ['cadeia'] },
  { id: 'trig', titulo: 'Trigonométricas', grupo: 'Calcular f′(x)', modelos: ['trig'] },
  { id: 'exp-log', titulo: 'Exponenciais e logaritmos', grupo: 'Calcular f′(x)', modelos: ['exp-log'] },
  { id: 'inversas', titulo: 'Funções inversas', grupo: 'Calcular f′(x)', modelos: ['inversas'] },
  { id: 'logaritmica', titulo: 'Derivação logarítmica', grupo: 'Calcular f′(x)', modelos: ['logaritmica'] },
  { id: 'mistas', titulo: 'Regras mistas', grupo: 'Calcular f′(x)', modelos: ['mistas'] },
  { id: 'ponto', titulo: 'Derivada em um ponto', grupo: 'Técnicas', modelos: ['ponto'] },
  { id: 'ordem-superior', titulo: 'Segunda derivada', grupo: 'Técnicas', modelos: ['segunda'] },
  { id: 'implicita', titulo: 'Derivação implícita', grupo: 'Técnicas', modelos: ['implicita'] },
  { id: 'tangente', titulo: 'Reta tangente e reta normal', grupo: 'Aplicações', modelos: ['tangente', 'normal'] },
  { id: 'taxas', titulo: 'Taxas relacionadas', grupo: 'Aplicações', modelos: ['taxas-escada', 'taxas-balao', 'taxas-cone', 'taxas-sombra'] },
  { id: 'linear', titulo: 'Aproximação linear e diferenciais', grupo: 'Aplicações', modelos: ['aproximacao-linear'] },
  { id: 'tvm', titulo: 'Teorema do Valor Médio', grupo: 'Aplicações', modelos: ['tvm'] },
  { id: 'criticos', titulo: 'Pontos críticos e classificação', grupo: 'Aplicações', modelos: ['criticos'] },
  { id: 'concavidade', titulo: 'Concavidade e inflexão', grupo: 'Aplicações', modelos: ['inflexao'] },
  { id: 'otimizacao', titulo: 'Otimização', grupo: 'Aplicações', modelos: ['otim-cerca', 'otim-caixa', 'otim-lata'] },
  { id: 'lhopital', titulo: 'Regra de L’Hôpital', grupo: 'Aplicações', modelos: ['lhopital'] },
];

export const TOPICO_MISTO = { id: 'misto', titulo: 'Misto (todos os tópicos)', grupo: '', modelos: LISTA.map((m) => m.id) };

export function obterTopico(id) {
  return id === 'misto' ? TOPICO_MISTO : TOPICOS.find((t) => t.id === id) ?? null;
}

export function topicoDoModelo(modeloId) {
  return TOPICOS.find((t) => t.modelos.includes(modeloId)) ?? TOPICO_MISTO;
}

/** Escolhe (de forma determinística pela seed) um modelo do tópico. */
export function sortearModelo(topicoId, seed) {
  const topico = obterTopico(topicoId) ?? TOPICO_MISTO;
  return topico.modelos[hashTexto(`${topico.id}|${seed}`) % topico.modelos.length];
}

const TEXTO_PROIBIDO = /NaN|undefined|Infinity|\[object/;

function temTextoProibido(questao) {
  const partes = [questao.enunciado, ...questao.dicas, ...questao.passos.flatMap((p) => [p.tex, p.txt]),
    ...questao.campos.flatMap((c) => [c.respostaLatex, c.respostaExpr, c.rotulo])];
  return partes.some((p) => typeof p !== 'string' || TEXTO_PROIBIDO.test(p));
}

/**
 * Gera a questão (modelo, dificuldade, seed). Sorteios que dariam uma questão
 * degenerada são descartados e refeitos, sempre de forma determinística.
 */
export function gerar(modeloId, dificuldade, seed) {
  const modelo = MODELOS[modeloId];
  if (!modelo) throw new Error(`Modelo desconhecido: ${modeloId}`);
  if (!DIFICULDADES.some((d) => d.id === dificuldade)) throw new Error(`Dificuldade desconhecida: ${dificuldade}`);
  let ultimoErro = null;
  for (let tentativa = 0; tentativa < 60; tentativa++) {
    const rng = criarRng(`${modeloId}|${dificuldade}|${seed}|${tentativa}`);
    try {
      const q = modelo.gerar(rng, dificuldade);
      q.campos ??= [{
        id: 'resposta', tipo: q.tipoResposta, rotulo: q.rotulo ?? '', respostaLatex: q.respostaLatex, respostaExpr: q.respostaExpr,
        variaveis: q.variaveis, dominio: q.dominio, errosComuns: q.errosComuns, curva: q.curva, tolerancia: q.tolerancia,
        unidade: q.unidade, conferencia: q.conferencia,
      }];
      for (const campo of q.campos) campo.rotulo ??= '';
      if (temTextoProibido(q)) throw new Error('texto inválido na questão');
      return { ...q, modelo: modeloId, titulo: modelo.titulo, topico: topicoDoModelo(modeloId).id, dificuldade, seed };
    } catch (erro) {
      ultimoErro = erro;
    }
  }
  throw new Error(`Não foi possível gerar ${modeloId}/${dificuldade}/${seed}: ${ultimoErro?.message}`);
}
