// Testes do gerador de questões. Para cada modelo e cada dificuldade, gera
// QUESTOES questões com seeds diferentes e verifica:
//   (a) a resposta bate com a recalculada pelo math.js a partir dos dados;
//   (b) nenhum texto ou LaTeX tem "NaN", "undefined", "1x", "x^1", "+ -" etc.;
//   (c) todo LaTeX (enunciado, dicas, passos, rótulos, resposta) renderiza no KaTeX;
//   (d) o LaTeX exibido da resposta é igual à resposta interna;
//   (e) o verificador aceita a resposta certa e recusa uma errada.
// Também testa a reprodutibilidade pela seed e o registro de tópicos.
//
// QUESTOES=1000 node --test tests/gerador.test.js   (para uma bateria maior)

import test from 'node:test';
import assert from 'node:assert/strict';
import { MODELOS, DIFICULDADES, TOPICOS, TOPICO_MISTO, gerar, sortearModelo, obterTopico } from '../js/gerador/gerador.js';
import { SECOES } from '../js/conteudo/indice.js';
import { conferirQuestao } from './util/conferir-gerador.js';

const QUESTOES = Number(process.env.QUESTOES ?? 300);

for (const id of Object.keys(MODELOS)) {
  test(`modelo ${id}`, async (t) => {
    for (const { id: dificuldade } of DIFICULDADES) {
      await t.test(`${dificuldade}: ${QUESTOES} questões`, () => {
        const falhas = [];
        const enunciados = new Set();
        for (let seed = 1; seed <= QUESTOES && falhas.length < 8; seed++) {
          let q;
          try {
            q = gerar(id, dificuldade, seed);
          } catch (erro) {
            falhas.push(`seed ${seed}: não gerou (${erro.message})`);
            continue;
          }
          enunciados.add(q.enunciado);
          // o verificador é exercitado em parte das seeds (é a etapa mais lenta)
          const problemas = conferirQuestao(q, { verificador: seed % 3 === 1 });
          if (problemas.length) falhas.push(`seed ${seed}: ${problemas.slice(0, 3).join(' | ')}\n    enunciado: ${q.enunciado}`);
        }
        assert.deepEqual(falhas, [], `${id}/${dificuldade}:\n${falhas.join('\n')}`);
        assert.ok(enunciados.size >= Math.min(12, QUESTOES / 10), `pouca variedade: só ${enunciados.size} enunciados diferentes`);
      });
    }
  });
}

test('a mesma seed reproduz exatamente a mesma questão', () => {
  for (const id of Object.keys(MODELOS)) {
    for (const { id: dificuldade } of DIFICULDADES) {
      for (const seed of [7, 123456]) {
        assert.deepEqual(gerar(id, dificuldade, seed), gerar(id, dificuldade, seed), `${id}/${dificuldade}/${seed}`);
      }
    }
  }
});

test('tópicos: todo modelo pertence a um tópico e a escolha pela seed é determinística', () => {
  const usados = new Set(TOPICOS.flatMap((t) => t.modelos));
  for (const id of Object.keys(MODELOS)) assert.ok(usados.has(id), `modelo ${id} sem tópico`);
  for (const t of [...TOPICOS, TOPICO_MISTO]) {
    for (const m of t.modelos) assert.ok(MODELOS[m], `tópico ${t.id} cita modelo inexistente ${m}`);
    assert.equal(sortearModelo(t.id, 42), sortearModelo(t.id, 42));
    assert.ok(t.modelos.includes(sortearModelo(t.id, 99)));
  }
  const sorteados = new Set(Array.from({ length: 400 }, (_, s) => sortearModelo('misto', s)));
  assert.ok(sorteados.size > Object.keys(MODELOS).length * 0.8, 'o modo misto deveria cobrir quase todos os modelos');
});

test('todo botão "Praticar" da teoria aponta para um tópico existente', () => {
  for (const secao of SECOES) {
    for (const [topico] of secao.praticar ?? []) assert.ok(obterTopico(topico), `seção ${secao.num}: tópico "${topico}" não existe`);
  }
});
