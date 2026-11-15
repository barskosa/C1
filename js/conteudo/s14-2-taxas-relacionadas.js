// Seção 14.2 — Taxas relacionadas
import { R } from '../ui/tex.js';

export default {
  lide: R`Quando duas grandezas estão ligadas por uma equação, suas taxas de variação no tempo também estão. Conhecendo uma taxa, a derivada entrega a outra.`,
  objetivos: [
    R`Traduzir um enunciado em grandezas que variam com o tempo e uma equação que as relaciona.`,
    R`Derivar essa equação em relação a \(t\) com a regra da cadeia.`,
    R`Resolver os problemas clássicos: escada, balão, tanque cônico e sombra.`,
  ],
  blocos: [
    { h2: 'Uma taxa determina a outra' },
    { caixa: 'intuicao', titulo: 'A escada que escorrega',
      html: R`
      <p>Uma escada de 5 m está apoiada na parede e sua base é puxada a 1 m/s. O topo desce com que velocidade?
      Não é 1 m/s, e nem é constante: no gráfico abaixo, veja que o topo desce devagar no começo e cada vez mais rápido no fim.
      As duas velocidades estão amarradas pelo Teorema de Pitágoras, \(x^2 + y^2 = 25\), e a derivada dessa relação diz exatamente como.</p>` },
    { widget: 'escada',
      legenda: R`Com \(x^2 + y^2 = 25\) e \(\dfrac{dx}{dt} = 1\) m/s, a derivação em relação ao tempo dá \(\dfrac{dy}{dt} = -\dfrac{x}{y}\) m/s. O sinal negativo indica que \(y\) diminui.` },
    { caixa: 'formula', rotulo: 'Roteiro', titulo: 'Como atacar um problema de taxas relacionadas',
      html: R`
      <ol>
        <li><strong>Desenhe</strong> a situação e dê nome às grandezas que <em>variam</em> (letras) e às que são fixas (números).</li>
        <li><strong>Traduza</strong> o enunciado: o que é dado e o que é pedido são derivadas em relação a \(t\) (por exemplo, \(\tfrac{dx}{dt} = 2\); quero \(\tfrac{dy}{dt}\)).</li>
        <li><strong>Relacione</strong> as grandezas por uma equação (Pitágoras, semelhança de triângulos, fórmula de área ou volume).</li>
        <li><strong>Derive</strong> os dois lados em relação a \(t\), usando a regra da cadeia: \(\dfrac{d}{dt}\,x^2 = 2x\,\dfrac{dx}{dt}\).</li>
        <li><strong>Substitua</strong> os valores do instante pedido e resolva.</li>
      </ol>` },
    { caixa: 'atencao', titulo: 'Só substitua depois de derivar',
      html: R`<p>Valores que valem apenas em um instante (como “quando \(x = 3\)”) entram <strong>depois</strong> da derivação.
      Se você trocar \(x\) por \(3\) antes, \(x\) vira constante, sua derivada vira zero e o problema desaparece.</p>` },

    { h2: 'Exemplos resolvidos' },
    { exemplo: {
      titulo: 'Escada deslizando', nivel: 'facil',
      enunciado: R`<p>Uma escada de 5 m está apoiada em uma parede vertical. A base se afasta da parede a 2 m/s. Com que velocidade o topo desce no instante em que a base está a 3 m da parede?</p>`,
      confere: { valor: (m) => m.d('sqrt(25 - (3 + 2t)^2)', 0, 't') },
      passos: [
        { tex: R`x^2 + y^2 = 25`, txt: R`Sejam \(x\) a distância da base à parede e \(y\) a altura do topo. A escada é a hipotenusa: Pitágoras. Dado: \(\dfrac{dx}{dt} = 2\) m/s. Pedido: \(\dfrac{dy}{dt}\) quando \(x = 3\).` },
        { tex: R`2x\,\frac{dx}{dt} + 2y\,\frac{dy}{dt} = 0`, txt: R`Derivamos os dois lados em relação ao tempo. \(x\) e \(y\) são funções de \(t\): regra da cadeia em cada termo.` },
        { tex: R`y = \sqrt{25 - 3^2} = 4`, txt: R`Só agora usamos o instante pedido: quando \(x = 3\), a altura é \(y = 4\) m.`, c: { valor: 4 } },
        { tex: R`2 \cdot 3 \cdot 2 + 2 \cdot 4 \cdot \frac{dy}{dt} = 0 \;\Rightarrow\; \frac{dy}{dt} = -\frac{12}{8} = -\frac{3}{2} \,\text{m/s}`, txt: R`Substituímos \(x = 3\), \(y = 4\) e \(\dfrac{dx}{dt} = 2\). O topo desce a 1,5 m/s (o sinal negativo indica que \(y\) diminui).`, c: 1, seg: [-2, -1] },
      ],
    } },
    { exemplo: {
      titulo: 'Balão inflando', nivel: 'medio',
      enunciado: R`<p>Um balão esférico é inflado à taxa de 100 cm³/s. Com que rapidez o raio aumenta quando ele mede 5 cm?</p>`,
      confere: { valor: (m) => m.d('(3*((4/3)*pi*125 + 100t)/(4*pi))^(1/3)', 0, 't') },
      passos: [
        { tex: R`V = \frac{4}{3}\pi r^3`, txt: R`Volume da esfera. Dado: \(\dfrac{dV}{dt} = 100\) cm³/s. Pedido: \(\dfrac{dr}{dt}\) quando \(r = 5\).` },
        { tex: R`\frac{dV}{dt} = 4\pi r^2\,\frac{dr}{dt}`, txt: R`Derivamos em relação a \(t\): \(\dfrac{d}{dt}\,r^3 = 3r^2\,\dfrac{dr}{dt}\) (cadeia), e \(\tfrac43 \cdot 3 = 4\).` },
        { tex: R`100 = 4\pi \cdot 5^2 \cdot \frac{dr}{dt} = 100\pi\,\frac{dr}{dt}`, txt: R`Substituímos os valores do instante.` },
        { tex: R`\frac{dr}{dt} = \frac{100}{100\pi} = \frac{1}{\pi} \approx 0{,}32 \,\text{cm/s}`, txt: R`O raio cresce cerca de 0,32 cm/s nesse instante. Quanto maior o balão, mais devagar o raio cresce para a mesma vazão de ar.`, c: 1, seg: [1, 2] },
      ],
    } },
    { exemplo: {
      titulo: 'Tanque cônico enchendo', nivel: 'dificil',
      enunciado: R`<p>Um tanque em forma de cone invertido tem 4 m de altura e raio de 2 m no topo. A água entra a 2 m³/min. Com que velocidade o nível sobe quando a profundidade é de 3 m?</p>`,
      confere: { valor: (m) => m.d('(12*(pi*27/12 + 2t)/pi)^(1/3)', 0, 't') },
      passos: [
        { tex: R`V = \frac{1}{3}\pi r^2 h`, txt: R`Volume de água: um cone de raio \(r\) e altura \(h\), ambos variando. Há duas variáveis; precisamos eliminar uma.` },
        { tex: R`\frac{r}{h} = \frac{2}{4} \;\Rightarrow\; r = \frac{h}{2}`, txt: R`Semelhança de triângulos: a água forma um cone com as mesmas proporções do tanque.` },
        { tex: R`V = \frac{1}{3}\pi \left(\frac{h}{2}\right)^2 h = \frac{\pi h^3}{12}`, txt: R`Substituímos \(r\). Essa troca pode ser feita antes de derivar porque vale em todos os instantes.`, c: { igual: '(1/3)*pi*(h/2)^2*h', vars: ['h'] } },
        { tex: R`\frac{dV}{dt} = \frac{\pi h^2}{4}\,\frac{dh}{dt}`, txt: R`Derivamos em relação a \(t\).` },
        { tex: R`\frac{dh}{dt} = \frac{4 \cdot 2}{\pi \cdot 3^2} = \frac{8}{9\pi} \approx 0{,}28 \,\text{m/min}`, txt: R`Com \(\dfrac{dV}{dt} = 2\) e \(h = 3\). O nível sobe cerca de 28 cm por minuto.`, c: 1, seg: [1, 2] },
      ],
    } },
    { exemplo: {
      titulo: 'A sombra que cresce', nivel: 'dificil',
      enunciado: R`<p>Uma pessoa de 1,5 m de altura se afasta de um poste de luz de 4,5 m, caminhando a 1,2 m/s. Com que velocidade (a) o comprimento da sombra aumenta e (b) a ponta da sombra se move?</p>`,
      confere: { valor: 0.6 },
      passos: [
        { tex: R`\frac{s}{1{,}5} = \frac{x + s}{4{,}5}`, txt: R`Sejam \(x\) a distância da pessoa ao poste e \(s\) o comprimento da sombra. O triângulo pequeno (pessoa e sombra) é semelhante ao grande (poste e chão até a ponta da sombra).` },
        { tex: R`4{,}5\,s = 1{,}5\,(x + s) \;\Rightarrow\; s = \frac{x}{2}`, txt: R`Isolamos \(s\): \(3s = 1{,}5x\).` },
        { tex: R`\frac{ds}{dt} = \frac{1}{2} \cdot \frac{dx}{dt} = \frac{1}{2} \cdot 1{,}2 = 0{,}6 \,\text{m/s}`, txt: R`(a) Derivamos em relação a \(t\). A sombra cresce a 0,6 m/s, sempre, não importa a distância ao poste.`, c: 1, seg: [-2, -1] },
        { tex: R`\frac{d}{dt}(x + s) = 1{,}2 + 0{,}6 = 1{,}8 \,\text{m/s}`, txt: R`(b) A ponta da sombra está à distância \(x + s\) do poste: sua velocidade é a soma das duas taxas.`, c: { valor: 1.8 } },
      ],
    } },

    { erros: [
      { e: R`Substituir os valores do instante antes de derivar: \(3^2 + y^2 = 25\) e então derivar.`,
        c: R`Primeiro derive a relação geral, \(2x\,\tfrac{dx}{dt} + 2y\,\tfrac{dy}{dt} = 0\); depois substitua.` },
      { e: R`Esquecer a regra da cadeia: \(\dfrac{d}{dt}\,x^2 = 2x\).`,
        c: R`\(x\) depende de \(t\): \(\dfrac{d}{dt}\,x^2 = 2x\,\dfrac{dx}{dt}\).` },
      { e: R`Ignorar o sinal: tratar uma grandeza que diminui como se tivesse taxa positiva.`,
        c: R`Se a distância diminui 3 m/s, a taxa é \(-3\) m/s. Defina o sentido positivo no desenho.` },
      { e: R`No cone, derivar \(V = \tfrac13 \pi r^2 h\) como se \(r\) fosse constante.`,
        c: R`\(r\) e \(h\) variam juntos. Elimine uma variável por semelhança de triângulos (ou use a regra do produto).` },
    ] },

    { exercicios: [
      { q: R`O raio de um círculo cresce a 2 cm/s. Com que rapidez a área aumenta quando o raio é 5 cm?`,
        r: R`<p>\(A = \pi r^2\), então \(\dfrac{dA}{dt} = 2\pi r\,\dfrac{dr}{dt} = 2\pi \cdot 5 \cdot 2 = 20\pi\) cm²/s.</p>`,
        c: { valor: (m) => m.d('pi*(5 + 2t)^2', 0, 't'), tex: R`2\pi \cdot 5 \cdot 2 = 20\pi`, seg: 'tudo' } },
      { q: R`O lado de um quadrado aumenta 3 cm/s. Qual é a taxa de crescimento da área quando o lado mede 10 cm?`,
        r: R`<p>\(A = \ell^2\), então \(\dfrac{dA}{dt} = 2\ell\,\dfrac{d\ell}{dt} = 2 \cdot 10 \cdot 3 = 60\) cm²/s.</p>`,
        c: { valor: (m) => m.d('(10 + 3t)^2', 0, 't'), tex: R`2 \cdot 10 \cdot 3 = 60`, seg: 'tudo' } },
      { q: R`Uma escada de 13 m tem a base afastada a 0,5 m/s. Qual é \(\dfrac{dy}{dt}\) quando a base está a 5 m da parede?`,
        r: R`<p>\(y = 12\) e \(\dfrac{dy}{dt} = -\dfrac{x}{y}\,\dfrac{dx}{dt} = -\dfrac{5}{12} \cdot 0{,}5 = -\dfrac{5}{24}\) m/s.</p>`,
        c: { valor: (m) => m.d('sqrt(169 - (5 + 0.5t)^2)', 0, 't'), tex: R`-\dfrac{5}{12} \cdot 0{,}5 = -\dfrac{5}{24}`, seg: 'tudo' } },
    ] },
  ],
};
