// Ponto de entrada comum às três páginas (index, teoria e praticar).
// Inicializa o que é compartilhado e carrega o módulo da página atual.

import { iniciarTema } from './ui/tema.js';
import { iniciarMenu } from './ui/menu.js';
import { iniciarBarraLeitura } from './ui/progresso.js';

const PAGINAS = {
  inicio: () => import('./paginas/inicio.js'),
  teoria: () => import('./paginas/teoria.js'),
  praticar: () => import('./paginas/praticar.js'),
};

function mostrarFalha(erro) {
  console.error(erro);
  const principal = document.getElementById('conteudo');
  if (!principal) return;
  const aviso = document.createElement('p');
  aviso.className = 'aviso-erro';
  aviso.textContent = 'Algo deu errado ao carregar esta página. Abra o site por um servidor local (por exemplo, "npx serve") em vez de abrir o arquivo diretamente.';
  principal.prepend(aviso);
}

iniciarTema();
iniciarMenu();
iniciarBarraLeitura();

const carregar = PAGINAS[document.body.dataset.pagina];
if (carregar) {
  carregar().then((modulo) => modulo.iniciar()).catch(mostrarFalha);
}
