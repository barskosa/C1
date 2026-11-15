// Servidor estático mínimo (sem dependências) para rodar o site localmente.
// Também é usado pelos scripts de teste no navegador.
//
// Uso direto:  node scripts/servidor.mjs [porta]     (padrão: 8080)

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

/** Inicia o servidor em 127.0.0.1 (porta 0 = qualquer porta livre). */
export function iniciarServidor(porta = 0) {
  const servidor = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      let caminho = decodeURIComponent(url.pathname);
      if (caminho.endsWith('/')) caminho += 'index.html';
      const arquivo = path.join(RAIZ, caminho);
      if (!arquivo.startsWith(RAIZ)) throw new Error('fora da raiz');
      const dados = await readFile(arquivo);
      res.writeHead(200, { 'content-type': TIPOS[path.extname(arquivo)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(dados);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Não encontrado');
    }
  });
  return new Promise((resolve, reject) => {
    servidor.once('error', reject);
    servidor.listen(porta, '127.0.0.1', () => resolve(servidor));
  });
}

/** Caminho de um Chrome/Edge instalado (ou o da variável CHROME_PATH). */
export function localizarNavegador() {
  const candidatos = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge',
  ].filter(Boolean);
  return candidatos.find((c) => existsSync(c));
}

// Execução direta: sobe o servidor e fica escutando.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const porta = Number(process.argv[2]) || 8080;
  const servidor = await iniciarServidor(porta);
  console.log(`Derivadas · Cálculo 1 em http://localhost:${servidor.address().port}  (Ctrl+C para encerrar)`);
}
