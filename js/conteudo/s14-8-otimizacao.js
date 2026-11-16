// Seção 14.8 — Otimização
import { R } from '../ui/tex.js';

export default {
  lide: R`Maior área, menor custo, maior volume: problemas de otimização pedem o máximo ou o mínimo de uma grandeza, e a derivada mostra onde ele está.`,
  objetivos: [
    R`Transformar um enunciado em uma <strong>função de uma variável</strong> a ser maximizada ou minimizada.`,
    R`Usar a <strong>restrição</strong> do problema para eliminar variáveis.`,
    R`Encontrar o ponto ótimo com a derivada e <strong>justificar</strong> que é máximo (ou mínimo).`,
  ],
  blocos: [
    { h2: 'O melhor valor possível' },
    { caixa: 'intuicao', titulo: 'No ponto ótimo, a taxa de variação é zero',
      html: R`
      <p>Com 100 m de cerca e um rio servindo de quarto lado, qual terreno retangular tem a maior área? Se os lados perpendiculares ao rio
      forem curtos, o terreno é uma faixa fina; se forem longos demais, também. Entre os extremos há um valor ideal.
      Mova o controle: a área cresce enquanto a derivada é positiva e passa a diminuir quando ela fica negativa. O máximo está
      exatamente onde a derivada se anula.</p>` },
    { widget: 'cerca',
      legenda: R`Terreno com um lado no rio e 100 m de cerca: \(A(x) = x(100 - 2x)\). O máximo ocorre em \(x = 25\) m, onde \(A'(x) = 0\).` },
    { caixa: 'formula', rotulo: 'Roteiro', titulo: 'Como resolver um problema de otimização',
      html: R`
      <ol>
        <li><strong>Entenda e desenhe.</strong> Dê nomes às grandezas variáveis.</li>
        <li><strong>Função objetivo:</strong> escreva a grandeza a otimizar (área, volume, custo, …).</li>
        <li><strong>Restrição:</strong> use a condição do problema para deixar a função objetivo com <em>uma só variável</em>.</li>
        <li><strong>Domínio:</strong> determine os valores possíveis da variável (comprimentos positivos etc.).</li>
        <li><strong>Derive, iguale a zero</strong> e resolva para achar os pontos críticos.</li>
        <li><strong>Justifique</strong> (teste da 1ª ou 2ª derivada, ou comparação com os extremos do domínio) e responda à pergunta feita, com unidades.</li>
      </ol>` },
    { caixa: 'definicao', titulo: 'Por que os testes garantem o ótimo',
      html: R`
      <p>Em um intervalo fechado \([a, b]\), uma função contínua sempre atinge máximo e mínimo absolutos, em pontos críticos ou nos extremos.
      Em um intervalo qualquer, se há <strong>um único ponto crítico</strong> e nele a função tem máximo local (por exemplo, \(f'' < 0\)), então esse é o máximo absoluto;
      o mesmo vale para mínimos.</p>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'A cerca à beira do rio', nivel: 'facil',
      enunciado: R`<p>Com 100 m de cerca, deseja-se cercar um terreno retangular em que um dos lados fica à beira de um rio e não precisa de cerca. Quais dimensões dão a maior área?</p>`,
      confere: { valor: 1250 },
      passos: [
        { tex: R`A = x \cdot y`, txt: R`Sejam \(x\) cada lado perpendicular ao rio e \(y\) o lado paralelo. A função objetivo é a área.` },
        { tex: R`2x + y = 100 \;\Rightarrow\; y = 100 - 2x`, txt: R`Restrição: a cerca cobre dois lados \(x\) e um lado \(y\).` },
        { tex: R`A(x) = x(100 - 2x) = 100x - 2x^2`, txt: R`Área em função de uma só variável, com domínio \(0 < x < 50\).`, c: { igual: 'x*(100 - 2x)', seg: [1, 2] } },
        { tex: R`A'(x) = 100 - 4x = 0 \;\Rightarrow\; x = 25`, txt: R`Derivamos e igualamos a zero.`, c: { derivada: '100x - 2x^2', seg: [1] } },
        { tex: R`A''(x) = -4 < 0`, txt: R`Segunda derivada negativa: o único ponto crítico é um máximo (a parábola tem concavidade para baixo).`, c: { derivada: '100x - 2x^2', ordem: 2, seg: [1] } },
        { tex: R`y = 100 - 2 \cdot 25 = 50 \qquad A = 25 \cdot 50 = 1250 \,\text{m}^2`, txt: R`Dimensões ótimas: 25 m (perpendiculares ao rio) por 50 m (paralelo). Área máxima: 1250 m².`, c: { fn: (m) => { let maior = 0; for (let x = 0; x <= 50; x += 0.01) maior = Math.max(maior, m.num('x*(100 - 2x)', { x })); return m.perto(maior, 1250, 1e-6); } } },
      ],
    } },
    { exemplo: {
      titulo: 'Caixa sem tampa', nivel: 'medio',
      enunciado: R`<p>De uma folha quadrada de papelão de 30 cm de lado recortam-se quadrados de lado \(x\) nos quatro cantos, e as abas são dobradas para formar uma caixa sem tampa. Qual valor de \(x\) dá o maior volume?</p>`,
      confere: { valor: 2000 },
      passos: [
        { tex: R`V(x) = x(30 - 2x)^2, \qquad 0 < x < 15`, txt: R`A base da caixa é um quadrado de lado \(30 - 2x\) e a altura é \(x\). Volume = área da base × altura.` },
        { tex: R`V'(x) = (30 - 2x)^2 + x \cdot 2(30 - 2x)(-2)`, txt: R`Regra do produto, com a regra da cadeia em \((30 - 2x)^2\).`, c: { derivada: 'x*(30 - 2x)^2' } },
        { tex: R`V'(x) = (30 - 2x)(30 - 2x - 4x) = (30 - 2x)(30 - 6x)`, txt: R`Colocamos \((30 - 2x)\) em evidência.`, c: { derivada: 'x*(30 - 2x)^2' } },
        { tex: R`V'(x) = 0 \;\Rightarrow\; x = 15 \ \text{ ou } \ x = 5`, txt: R`\(x = 15\) está fora do domínio (não sobraria base). O único ponto crítico válido é \(x = 5\).`, c: { fn: (m) => m.perto(m.d('x*(30 - 2x)^2', 5), 0, 1e-9, 1e-9) } },
        { tex: R`V(5) = 5 \cdot 20^2 = 2000 \,\text{cm}^3`, txt: R`\(V' > 0\) para \(x < 5\) e \(V' < 0\) para \(5 < x < 15\): máximo. A caixa ótima tem 20 cm × 20 cm × 5 cm e volume de 2000 cm³.`, c: { fn: (m) => { let maior = 0; for (let x = 0; x <= 15; x += 0.005) maior = Math.max(maior, m.num('x*(30 - 2x)^2', { x })); return m.perto(maior, 2000, 1e-5); } } },
      ],
    } },
    { exemplo: {
      titulo: 'A lata mais econômica', nivel: 'dificil',
      enunciado: R`<p>Uma lata cilíndrica fechada deve ter volume de \(54\pi\) cm³ (cerca de 170 mL). Que raio e que altura minimizam a quantidade de material (área total)?</p>`,
      confere: { valor: 3 },
      passos: [
        { tex: R`S = 2\pi r^2 + 2\pi r h`, txt: R`Função objetivo: área total = duas tampas circulares + lateral (um retângulo de base \(2\pi r\) e altura \(h\)).` },
        { tex: R`\pi r^2 h = 54\pi \;\Rightarrow\; h = \frac{54}{r^2}`, txt: R`Restrição: o volume é fixo. Isolamos \(h\).` },
        { tex: R`S(r) = 2\pi r^2 + 2\pi r \cdot \frac{54}{r^2} = 2\pi r^2 + \frac{108\pi}{r}`, txt: R`Área em função apenas do raio, com \(r > 0\).`, c: { igual: '2*pi*r^2 + 2*pi*r*(54/r^2)', vars: ['r'], dom: [0.5, 6], seg: [1, 2] } },
        { tex: R`S'(r) = 4\pi r - \frac{108\pi}{r^2}`, txt: R`Derivamos (lembrando que \(\dfrac{1}{r} = r^{-1}\)).`, c: { derivada: '2*pi*r^2 + 108*pi/r', var: 'r', dom: [0.5, 6] } },
        { tex: R`4\pi r = \frac{108\pi}{r^2} \;\Rightarrow\; r^3 = 27 \;\Rightarrow\; r = 3 \,\text{cm}`, txt: R`Igualamos a zero. Como \(S''(r) = 4\pi + \dfrac{216\pi}{r^3} > 0\) para \(r > 0\), é um mínimo.`, c: 1, seg: 'ultimo' },
        { tex: R`h = \frac{54}{3^2} = 6 \,\text{cm}`, txt: R`A lata ótima tem \(h = 2r\): a altura é igual ao diâmetro. Esse resultado vale para qualquer volume.`, c: { valor: 6 } },
      ],
    } },

    { erros: [
      { e: R`Derivar a função objetivo ainda com duas variáveis.`,
        c: R`Use a restrição para escrever tudo em função de uma só variável <em>antes</em> de derivar.` },
      { e: R`Parar em “\(x = 25\)” sem verificar se é máximo ou mínimo.`,
        c: R`\(f'(x) = 0\) só dá candidatos. Justifique com o teste da 1ª ou 2ª derivada, ou comparando com os extremos do domínio.` },
      { e: R`Ignorar o domínio e aceitar soluções impossíveis, como \(x = 15\) na caixa de 30 cm.`,
        c: R`Dimensões precisam ser positivas e compatíveis com o problema. Descarte pontos críticos fora do domínio.` },
      { e: R`Responder outra coisa: dar \(x\) quando se pede a área máxima, ou só uma das dimensões.`,
        c: R`Releia a pergunta no final e responda exatamente o que foi pedido, com unidades.` },
    ] },

    { exercicios: [
      { q: R`Dois números positivos somam 20. Qual é o maior produto possível?`,
        r: R`<p>\(P(x) = x(20 - x)\), \(P'(x) = 20 - 2x = 0\) em \(x = 10\). Os números são \(10\) e \(10\) e o produto máximo é \(100\).</p>`,
        c: { derivada: 'x*(20 - x)', tex: R`P'(x) = 20 - 2x`, seg: 'ultimo' } },
      { q: R`Um retângulo tem perímetro de 40 cm. Quais dimensões dão a maior área?`,
        r: R`<p>\(A(x) = x(20 - x)\): o máximo ocorre em \(x = 10\). O retângulo de maior área é o quadrado de lado 10 cm (área 100 cm²).</p>` },
      { q: R`Uma caixa de base quadrada e sem tampa deve ter volume de 32 cm³. Que dimensões gastam menos material?`,
        r: R`<p>Com lado \(x\) e altura \(h = \dfrac{32}{x^2}\): \(S(x) = x^2 + \dfrac{128}{x}\), \(S'(x) = 2x - \dfrac{128}{x^2} = 0\) dá \(x = 4\) cm e \(h = 2\) cm.</p>`,
        c: { derivada: 'x^2 + 128/x', dom: [0.5, 8], tex: R`S'(x) = 2x - \dfrac{128}{x^2}`, seg: 'ultimo' } },
    ] },
  ],
};
