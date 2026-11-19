// Gerador pseudoaleatório com seed (mulberry32): a mesma seed sempre produz a
// mesma questão, o que permite reproduzir e compartilhar questões pela URL.

/** Hash FNV-1a de 32 bits de um texto. */
export function hashTexto(texto) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function criarRng(semente) {
  let estado = (typeof semente === 'string' ? hashTexto(semente) : semente) >>> 0;
  const proximo = () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng = {
    /** Real em [0, 1). */
    real: proximo,
    /** Inteiro em [min, max]. */
    int: (min, max) => min + Math.floor(proximo() * (max - min + 1)),
    /** Inteiro não nulo em [min, max]. */
    naoNulo(min, max) {
      let v = 0;
      while (v === 0) v = rng.int(min, max);
      return v;
    },
    /** Elemento aleatório de uma lista. */
    escolha: (lista) => lista[Math.floor(proximo() * lista.length)],
    /** true com probabilidade p. */
    chance: (p = 0.5) => proximo() < p,
    /** +1 ou −1. */
    sinal: () => (proximo() < 0.5 ? -1 : 1),
    /** Cópia embaralhada da lista. */
    embaralhar(lista) {
      const copia = [...lista];
      for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(proximo() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
      }
      return copia;
    },
  };
  return rng;
}

/** Seed nova (6 dígitos) para o botão "Nova questão". */
export function novaSeed() {
  return 100000 + Math.floor(Math.random() * 900000);
}
