// Testes do conteúdo de teoria:
//   1. toda fórmula (texto, caixas, passos, respostas) é renderizável pelo KaTeX;
//   2. cada seção tem a estrutura pedida (intuição antes da parte formal, 2 a 4
//      exemplos passo a passo, erros comuns, 2 ou 3 exercícios, botão de praticar);
//   3. todos os exemplos resolvidos são conferidos numericamente com o math.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { SECOES } from '../js/conteudo/indice.js';
import { conferirSecao } from './util/conferir-teoria.js';
import { erroDeRenderizacao, formulasDoTexto } from './util/formulas.js';

/** Percorre o módulo e devolve todas as strings (com o caminho até elas). */
function* textos(valor, caminho = '') {
  if (typeof valor === 'string') yield { texto: valor, caminho };
  else if (Array.isArray(valor)) for (let i = 0; i < valor.length; i++) yield* textos(valor[i], `${caminho}[${i}]`);
  else if (valor && typeof valor === 'object') {
    for (const [chave, v] of Object.entries(valor)) {
      if (chave === 'confere' || chave === 'c' || chave === 'itens' || chave === 'widget') continue;
      yield* textos(v, caminho ? `${caminho}.${chave}` : chave);
    }
  }
}

const FORMAIS = new Set(['definicao', 'teorema', 'formula']);

for (const secao of SECOES) {
  test(`seção ${secao.num} — ${secao.titulo}`, async (t) => {
    const modulo = (await secao.carregar()).default;
    assert.ok(Array.isArray(modulo.blocos) && modulo.blocos.length > 0, 'a seção precisa ter blocos de conteúdo');

    await t.test('todas as fórmulas são renderizáveis pelo KaTeX', () => {
      const erros = [];
      let total = 0;
      for (const { texto, caminho } of textos(modulo)) {
        if (/\.tex$/.test(caminho)) {
          total += 1;
          const erro = erroDeRenderizacao(texto, true);
          if (erro) erros.push(`${caminho}: ${erro}`);
          continue;
        }
        for (const { fonte, destaque } of formulasDoTexto(texto)) {
          total += 1;
          const erro = erroDeRenderizacao(fonte, destaque);
          if (erro) erros.push(`${caminho}: ${erro}`);
        }
        const semFormulas = texto.replace(/\\\[[\s\S]+?\\\]/g, '').replace(/\\\([\s\S]+?\\\)/g, '');
        if (/\\[()[\]]/.test(semFormulas)) erros.push(`${caminho}: delimitador de fórmula sem par`);
      }
      assert.deepEqual(erros, [], `fórmulas com erro:\n${erros.join('\n')}`);
      assert.ok(total > 0, 'a seção não tem nenhuma fórmula');
    });

    await t.test('estrutura didática', () => {
      const blocos = modulo.blocos;
      assert.ok((secao.praticar ?? []).length > 0, 'falta o botão "Praticar este tópico"');
      if (secao.id === 'tabela-resumo') return;

      const exemplos = blocos.filter((b) => b.exemplo).map((b) => b.exemplo);
      assert.ok(exemplos.length >= 2 && exemplos.length <= 4, `deve ter de 2 a 4 exemplos resolvidos (tem ${exemplos.length})`);
      for (const exemplo of exemplos) {
        assert.ok(exemplo.titulo && exemplo.enunciado, 'exemplo sem título ou enunciado');
        assert.ok(exemplo.passos.length >= 2, `"${exemplo.titulo}": precisa de pelo menos 2 passos`);
        for (const passo of exemplo.passos) {
          assert.ok(passo.tex && passo.txt, `"${exemplo.titulo}": todo passo precisa de expressão (tex) e justificativa (txt)`);
        }
      }

      const erros = blocos.filter((b) => b.erros);
      assert.equal(erros.length, 1, 'deve haver uma caixa de "Erros comuns"');
      assert.ok(erros[0].erros.length >= 2, 'a caixa de erros comuns precisa de pelo menos 2 itens');

      const exercicios = blocos.filter((b) => b.exercicios).flatMap((b) => b.exercicios);
      assert.ok(exercicios.length >= 2 && exercicios.length <= 3, `deve ter 2 ou 3 exercícios rápidos (tem ${exercicios.length})`);
      for (const ex of exercicios) assert.ok(ex.q && ex.r, 'exercício sem pergunta ou resposta');

      const posicaoIntuicao = blocos.findIndex((b) => b.caixa === 'intuicao');
      const posicaoFormal = blocos.findIndex((b) => FORMAIS.has(b.caixa));
      assert.ok(posicaoIntuicao >= 0, 'falta a caixa de explicação intuitiva');
      assert.ok(posicaoFormal >= 0, 'falta uma caixa de definição, teorema ou fórmula');
      assert.ok(posicaoIntuicao < posicaoFormal, 'a explicação intuitiva deve vir antes da formal');
      assert.ok((modulo.objetivos ?? []).length >= 2, 'faltam os objetivos da seção');
    });

    await t.test('exemplos conferidos numericamente com o math.js', () => {
      const relatorio = conferirSecao(modulo);
      assert.deepEqual(relatorio.semConferencia, [], 'exemplos sem conferência declarada');
      assert.deepEqual(relatorio.falhas, [], `divergências:\n${relatorio.falhas.join('\n')}`);
      if (secao.id !== 'tabela-resumo') {
        assert.ok(relatorio.verificacoes >= relatorio.exemplos, 'cada exemplo precisa de ao menos uma verificação');
      }
    });
  });
}
