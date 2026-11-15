// Confere matematicamente todos os exemplos resolvidos da teoria.
//
// Para cada exemplo, a resposta de referência é calculada pelo math.js
// (derivadas simbólicas, valores, limites numéricos) e comparada numericamente
// com as fórmulas escritas nos passos, que são lidas diretamente do LaTeX
// exibido ao aluno. Sai com código 1 se houver qualquer divergência.
//
// Uso: npm run conferir            (todas as seções)
//      npm run conferir -- cadeia  (só seções cujo id contém "cadeia")

import { SECOES } from '../js/conteudo/indice.js';
import { conferirSecao } from '../tests/util/conferir-teoria.js';

const filtro = process.argv[2];
let totalExemplos = 0;
let totalVerificacoes = 0;
let totalFalhas = 0;

console.log('Seção  Título                                          Exemplos  Verificações  Situação');
console.log('-----  ----------------------------------------------  --------  ------------  --------');

for (const secao of SECOES) {
  if (filtro && !secao.id.includes(filtro)) continue;
  const modulo = (await secao.carregar()).default;
  const relatorio = conferirSecao(modulo);
  const problemas = [...relatorio.falhas, ...relatorio.semConferencia.map((s) => `${s}: sem conferência declarada`)];
  totalExemplos += relatorio.exemplos;
  totalVerificacoes += relatorio.verificacoes;
  totalFalhas += problemas.length;
  console.log(
    `${secao.num.padEnd(5)}  ${secao.titulo.padEnd(46).slice(0, 46)}  ${String(relatorio.exemplos).padStart(8)}  ${String(relatorio.verificacoes).padStart(12)}  ${problemas.length ? 'DIVERGE' : 'ok'}`,
  );
  for (const problema of problemas) console.log(`         ✗ ${problema}`);
}

console.log('-----');
console.log(`${totalExemplos} exemplos, ${totalVerificacoes} verificações numéricas, ${totalFalhas} divergência(s).`);
process.exit(totalFalhas ? 1 : 0);
