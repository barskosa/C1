// Índice das seções de teoria, na ordem de estudo.
// Cada seção é um módulo carregado sob demanda (um arquivo por seção).
//
// Campos: id (usado na URL), num, titulo, curto (rótulo do menu), grupo,
// resumo (cartão da página inicial), praticar (tópicos do gerador ligados à
// seção) e carregar (import dinâmico do conteúdo).

export const GRUPOS = [
  { id: 'fundamentos', titulo: 'Fundamentos', descricao: 'De onde vem a derivada: taxas de variação, o limite que a define e o que ela significa no gráfico.' },
  { id: 'regras', titulo: 'Regras de derivação', descricao: 'As ferramentas para derivar qualquer função sem voltar ao limite toda vez.' },
  { id: 'tecnicas', titulo: 'Técnicas', descricao: 'Quando y não está isolado, quando a variável está no expoente, funções inversas e derivadas de derivadas.' },
  { id: 'aplicacoes', titulo: '14 · Aplicações', descricao: 'O que a derivada resolve: retas tangentes, taxas, aproximações, máximos e mínimos, gráficos e limites.' },
  { id: 'resumo', titulo: 'Resumo', descricao: 'Todas as fórmulas em um só lugar, prontas para imprimir.' },
];

export const SECOES = [
  {
    id: 'motivacao', num: '1', grupo: 'fundamentos',
    titulo: 'Motivação: taxas de variação', curto: 'Motivação',
    resumo: 'Taxa média × instantânea, velocidade instantânea e a inclinação da reta tangente.',
    praticar: [['taxa-variacao', 'Praticar taxas de variação']],
    carregar: () => import('./s01-motivacao.js'),
  },
  {
    id: 'definicao', num: '2', grupo: 'fundamentos',
    titulo: 'Definição de derivada', curto: 'Definição pelo limite',
    resumo: 'A derivada em um ponto, a derivada como função e as notações f′(x), dy/dx, Df e ẏ.',
    praticar: [['definicao', 'Praticar derivada pela definição']],
    carregar: () => import('./s02-definicao.js'),
  },
  {
    id: 'interpretacao-geometrica', num: '3', grupo: 'fundamentos',
    titulo: 'Interpretação geométrica', curto: 'Interpretação geométrica',
    resumo: 'Veja a reta secante virar tangente quando h → 0 em um gráfico interativo.',
    praticar: [['definicao', 'Praticar derivada pela definição'], ['ponto', 'Praticar derivada em um ponto']],
    carregar: () => import('./s03-interpretacao-geometrica.js'),
  },
  {
    id: 'diferenciabilidade', num: '4', grupo: 'fundamentos',
    titulo: 'Diferenciabilidade e continuidade', curto: 'Diferenciabilidade',
    resumo: 'Derivável implica contínua, mas não o contrário: bicos, cúspides, tangentes verticais e saltos.',
    praticar: [['diferenciabilidade', 'Praticar diferenciabilidade']],
    carregar: () => import('./s04-diferenciabilidade.js'),
  },
  {
    id: 'regras-basicas', num: '5', grupo: 'regras',
    titulo: 'Regras básicas', curto: 'Regras básicas',
    resumo: 'Constante, potência, múltiplo constante, soma e diferença.',
    praticar: [['basicas', 'Praticar regras básicas']],
    carregar: () => import('./s05-regras-basicas.js'),
  },
  {
    id: 'produto-quociente', num: '6', grupo: 'regras',
    titulo: 'Regras do produto e do quociente', curto: 'Produto e quociente',
    resumo: 'Como derivar multiplicações e divisões de funções (e por que não é “derivar cada parte”).',
    praticar: [['produto', 'Praticar regra do produto'], ['quociente', 'Praticar regra do quociente']],
    carregar: () => import('./s06-produto-quociente.js'),
  },
  {
    id: 'regra-da-cadeia', num: '7', grupo: 'regras',
    titulo: 'Regra da cadeia', curto: 'Regra da cadeia',
    resumo: 'Funções compostas: derivada de fora vezes derivada de dentro, inclusive com várias camadas.',
    praticar: [['cadeia', 'Praticar regra da cadeia']],
    carregar: () => import('./s07-regra-da-cadeia.js'),
  },
  {
    id: 'trigonometricas', num: '8', grupo: 'regras',
    titulo: 'Derivadas trigonométricas', curto: 'Trigonométricas',
    resumo: 'O limite fundamental sen(x)/x e as derivadas de sen, cos, tg, cotg, sec e cossec.',
    praticar: [['trig', 'Praticar derivadas trigonométricas']],
    carregar: () => import('./s08-trigonometricas.js'),
  },
  {
    id: 'exponenciais-logaritmicas', num: '9', grupo: 'regras',
    titulo: 'Exponenciais e logaritmos', curto: 'Exponenciais e logaritmos',
    resumo: 'As derivadas de eˣ, aˣ, ln x e logₐ x, e por que o número e é especial.',
    praticar: [['exp-log', 'Praticar exponenciais e logaritmos']],
    carregar: () => import('./s09-exponenciais-logaritmicas.js'),
  },
  {
    id: 'implicita', num: '10', grupo: 'tecnicas',
    titulo: 'Derivação implícita', curto: 'Derivação implícita',
    resumo: 'Encontrar dy/dx quando x e y estão misturados na mesma equação.',
    praticar: [['implicita', 'Praticar derivação implícita']],
    carregar: () => import('./s10-implicita.js'),
  },
  {
    id: 'logaritmica', num: '11', grupo: 'tecnicas',
    titulo: 'Derivação logarítmica', curto: 'Derivação logarítmica',
    resumo: 'Aplicar ln antes de derivar: funções como xˣ e produtos com muitos fatores.',
    praticar: [['logaritmica', 'Praticar derivação logarítmica']],
    carregar: () => import('./s11-logaritmica.js'),
  },
  {
    id: 'inversas', num: '12', grupo: 'tecnicas',
    titulo: 'Funções inversas e trigonométricas inversas', curto: 'Funções inversas',
    resumo: 'A derivada da inversa e as derivadas de arcsen, arccos e arctg.',
    praticar: [['inversas', 'Praticar funções inversas']],
    carregar: () => import('./s12-inversas.js'),
  },
  {
    id: 'ordem-superior', num: '13', grupo: 'tecnicas',
    titulo: 'Derivadas de ordem superior', curto: 'Ordem superior',
    resumo: 'Segunda derivada, aceleração, notações e padrões nas derivadas sucessivas.',
    praticar: [['ordem-superior', 'Praticar derivadas de ordem superior']],
    carregar: () => import('./s13-ordem-superior.js'),
  },
  {
    id: 'tangente-normal', num: '14.1', grupo: 'aplicacoes',
    titulo: 'Reta tangente e reta normal', curto: 'Reta tangente e normal',
    resumo: 'Equações das retas tangente e normal ao gráfico em um ponto.',
    praticar: [['tangente', 'Praticar reta tangente e normal']],
    carregar: () => import('./s14-1-tangente-normal.js'),
  },
  {
    id: 'taxas-relacionadas', num: '14.2', grupo: 'aplicacoes',
    titulo: 'Taxas relacionadas', curto: 'Taxas relacionadas',
    resumo: 'Escadas que deslizam, balões que inflam: como uma taxa determina a outra.',
    praticar: [['taxas', 'Praticar taxas relacionadas']],
    carregar: () => import('./s14-2-taxas-relacionadas.js'),
  },
  {
    id: 'aproximacao-linear', num: '14.3', grupo: 'aplicacoes',
    titulo: 'Aproximação linear e diferenciais', curto: 'Aproximação linear',
    resumo: 'Usar a reta tangente para estimar valores e propagar erros de medida.',
    praticar: [['linear', 'Praticar aproximação linear']],
    carregar: () => import('./s14-3-aproximacao-linear.js'),
  },
  {
    id: 'rolle-tvm', num: '14.4', grupo: 'aplicacoes',
    titulo: 'Teorema de Rolle e Teorema do Valor Médio', curto: 'Rolle e Valor Médio',
    resumo: 'Em algum ponto, a taxa instantânea é igual à taxa média.',
    praticar: [['tvm', 'Praticar Teorema do Valor Médio']],
    carregar: () => import('./s14-4-rolle-tvm.js'),
  },
  {
    id: 'pontos-criticos', num: '14.5', grupo: 'aplicacoes',
    titulo: 'Pontos críticos, crescimento e extremos', curto: 'Pontos críticos e extremos',
    resumo: 'Onde a função cresce ou decresce e os testes da primeira e da segunda derivada.',
    praticar: [['criticos', 'Praticar pontos críticos']],
    carregar: () => import('./s14-5-pontos-criticos.js'),
  },
  {
    id: 'concavidade', num: '14.6', grupo: 'aplicacoes',
    titulo: 'Concavidade e pontos de inflexão', curto: 'Concavidade e inflexão',
    resumo: 'O que a segunda derivada diz sobre a curvatura do gráfico.',
    praticar: [['concavidade', 'Praticar concavidade e inflexão']],
    carregar: () => import('./s14-6-concavidade.js'),
  },
  {
    id: 'esboco-de-graficos', num: '14.7', grupo: 'aplicacoes',
    titulo: 'Esboço de gráficos', curto: 'Esboço de gráficos',
    resumo: 'Um roteiro para desenhar o gráfico de uma função usando f, f′ e f″.',
    praticar: [['criticos', 'Praticar pontos críticos'], ['concavidade', 'Praticar concavidade e inflexão']],
    carregar: () => import('./s14-7-esboco-de-graficos.js'),
  },
  {
    id: 'otimizacao', num: '14.8', grupo: 'aplicacoes',
    titulo: 'Otimização', curto: 'Otimização',
    resumo: 'Problemas de máximo e mínimo: cercas, caixas, latas e distâncias.',
    praticar: [['otimizacao', 'Praticar otimização']],
    carregar: () => import('./s14-8-otimizacao.js'),
  },
  {
    id: 'lhopital', num: '14.9', grupo: 'aplicacoes',
    titulo: 'Regra de L’Hôpital', curto: 'Regra de L’Hôpital',
    resumo: 'Limites indeterminados 0/0 e ∞/∞ (e as formas que se reduzem a elas).',
    praticar: [['lhopital', 'Praticar L’Hôpital']],
    carregar: () => import('./s14-9-lhopital.js'),
  },
  {
    id: 'tabela-resumo', num: '15', grupo: 'resumo',
    titulo: 'Tabela-resumo', curto: 'Tabela-resumo (colinha)',
    resumo: 'A “colinha”: todas as regras e fórmulas de derivadas, pronta para imprimir.',
    praticar: [['misto', 'Praticar tudo misturado']],
    carregar: () => import('./s15-tabela-resumo.js'),
  },
];

const porId = new Map(SECOES.map((secao, indice) => [secao.id, { secao, indice }]));

export function obterSecao(id) {
  return porId.get(id)?.secao ?? null;
}

export function vizinhas(id) {
  const indice = porId.get(id)?.indice ?? -1;
  return {
    anterior: indice > 0 ? SECOES[indice - 1] : null,
    proxima: indice >= 0 && indice < SECOES.length - 1 ? SECOES[indice + 1] : null,
  };
}

export const urlSecao = (id) => `teoria.html?s=${encodeURIComponent(id)}`;
export const urlPraticar = (topico) => `praticar.html?topico=${encodeURIComponent(topico)}`;
