// Persistência em localStorage, tolerante a navegadores que bloqueiam o acesso
// (modo privado, cookies desativados): nesses casos tudo funciona só em memória.

const PREFIXO = 'derivadas:';
const memoria = new Map();

export function ler(chave, padrao = null) {
  try {
    const bruto = localStorage.getItem(PREFIXO + chave);
    if (bruto != null) return JSON.parse(bruto);
  } catch { /* cai para a memória */ }
  return memoria.has(chave) ? memoria.get(chave) : padrao;
}

export function gravar(chave, valor) {
  memoria.set(chave, valor);
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
  } catch { /* sem armazenamento persistente */ }
}

// ---- Seções estudadas ----

export function secoesEstudadas() {
  const lista = ler('estudadas', []);
  return new Set(Array.isArray(lista) ? lista : []);
}

export function marcarEstudada(id, estudada) {
  const conjunto = secoesEstudadas();
  if (estudada) conjunto.add(id); else conjunto.delete(id);
  gravar('estudadas', [...conjunto]);
  document.dispatchEvent(new CustomEvent('derivadas:estudadas', { detail: { id, estudada } }));
  return conjunto;
}

// ---- Última seção visitada ----

export const ultimaSecao = () => ler('ultima', null);
export const registrarUltimaSecao = (id) => gravar('ultima', id);
