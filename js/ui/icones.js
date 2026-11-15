// Ícones SVG (traço simples, herdam a cor do texto).

const svg = (conteudo) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${conteudo}</svg>`;

export const ICONES = {
  menu: svg('<path d="M4 6h16M4 12h16M4 18h16"/>'),
  fechar: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  sol: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  lua: svg('<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/>'),
  certo: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  errado: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  direita: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  esquerda: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  lampada: svg('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2.2h5c.1-1 .5-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>'),
  livro: svg('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5z"/>'),
  teorema: svg('<path d="M12 3l2.5 5.6 6 .7-4.5 4.1 1.3 6-5.3-3.1-5.3 3.1 1.3-6L3.5 9.3l6-.7z"/>'),
  alerta: svg('<path d="M12 4L2.5 20h19z"/><path d="M12 10v4.5M12 17.4v.1"/>'),
  lapis: svg('<path d="M4 20l1-4.5L16.5 4a2.1 2.1 0 0 1 3 3L8 18.5z"/><path d="M14.5 6l3.5 3.5"/>'),
  nota: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/>'),
  praticar: svg('<path d="M7 4.5v15l12-7.5z"/>'),
  imprimir: svg('<path d="M7 8V3h10v5M7 17H4.5A1.5 1.5 0 0 1 3 15.5v-6A1.5 1.5 0 0 1 4.5 8h15A1.5 1.5 0 0 1 21 9.5v6a1.5 1.5 0 0 1-1.5 1.5H17"/><path d="M7 14h10v7H7z"/>'),
  repetir: svg('<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.7L4 15.5M4 20v-4.5h4.5"/>'),
  dado: svg('<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9v.1M15 9v.1M12 12v.1M9 15v.1M15 15v.1"/>'),
  elo: svg('<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>'),
  olho: svg('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>'),
  cadeado: svg('<rect x="5" y="11" width="14" height="9.5" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  ajuda: svg('<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.9M12 16.9v.1"/>'),
  trofeu: svg('<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v4M8.5 20.5h7"/>'),
};

export function icone(nome) {
  return ICONES[nome] || '';
}
