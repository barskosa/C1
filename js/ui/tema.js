// Modo claro/escuro. A escolha fica salva; sem escolha, segue o sistema.
// (O atributo data-theme já é aplicado por um script inline no <head>,
// antes da primeira pintura, para evitar o "flash" do tema errado.)

import { ler, gravar } from './armazenamento.js';

const raiz = document.documentElement;

function temaDoSistema() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function aplicar(tema) {
  raiz.dataset.theme = tema;
  const botao = document.getElementById('btn-tema');
  if (botao) {
    const escuro = tema === 'dark';
    botao.setAttribute('aria-pressed', String(escuro));
    botao.setAttribute('aria-label', escuro ? 'Mudar para o modo claro' : 'Mudar para o modo escuro');
    botao.title = escuro ? 'Modo claro' : 'Modo escuro';
  }
  document.dispatchEvent(new CustomEvent('derivadas:tema', { detail: { tema } }));
}

export function iniciarTema() {
  const salvo = ler('tema', null);
  aplicar(salvo === 'dark' || salvo === 'light' ? salvo : temaDoSistema());

  document.getElementById('btn-tema')?.addEventListener('click', () => {
    const novo = raiz.dataset.theme === 'dark' ? 'light' : 'dark';
    gravar('tema', novo);
    aplicar(novo);
  });

  // Sem escolha salva, acompanha mudanças do sistema.
  if (typeof matchMedia === 'function') {
    matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
      if (ler('tema', null) == null) aplicar(temaDoSistema());
    });
  }
}
