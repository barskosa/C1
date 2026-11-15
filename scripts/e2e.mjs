// Teste de fumaça no navegador: serve o site localmente, abre cada página em um
// Chrome/Edge headless e falha se houver qualquer erro no console, exceção de
// script, requisição que falhou ou fórmula que o KaTeX não conseguiu renderizar.
//
// Uso:
//   npm run e2e                 abre todas as páginas e seções
//   npm run e2e -- --capturas   também salva capturas de tela em .e2e/
//   npm run e2e -- --so teoria  só URLs que contêm "teoria"
//
// Requer um Chrome ou Edge instalado (ou a variável CHROME_PATH).

import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { SECOES } from '../js/conteudo/indice.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const comCapturas = args.includes('--capturas');
const filtro = args.includes('--so') ? args[args.indexOf('--so') + 1] : null;

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};

function localizarNavegador() {
  const candidatos = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].filter(Boolean);
  return candidatos.find((c) => existsSync(c));
}

function iniciarServidor() {
  const servidor = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      let caminho = decodeURIComponent(url.pathname);
      if (caminho.endsWith('/')) caminho += 'index.html';
      const arquivo = path.join(raiz, caminho);
      if (!arquivo.startsWith(raiz)) throw new Error('fora da raiz');
      const dados = await readFile(arquivo);
      res.writeHead(200, { 'content-type': TIPOS[path.extname(arquivo)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(dados);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Não encontrado');
    }
  });
  return new Promise((resolve) => servidor.listen(0, '127.0.0.1', () => resolve(servidor)));
}

const executavel = localizarNavegador();
if (!executavel) {
  console.error('Nenhum Chrome/Edge encontrado. Defina CHROME_PATH com o caminho do executável.');
  process.exit(2);
}

const servidor = await iniciarServidor();
const base = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await puppeteer.launch({ executablePath: executavel, headless: true, args: ['--no-first-run', '--disable-extensions'] });

const paginas = [
  { nome: 'inicio', url: '/index.html' },
  ...SECOES.map((s) => ({ nome: `teoria-${s.num.replace('.', '_')}-${s.id}`, url: `/teoria.html?s=${s.id}`, teoria: true })),
  { nome: 'praticar', url: '/praticar.html' },
].filter((p) => !filtro || p.url.includes(filtro) || p.nome.includes(filtro));

const problemas = [];
if (comCapturas) await mkdir(path.join(raiz, '.e2e'), { recursive: true });

for (const alvo of paginas) {
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: 1280, height: 900 });
  const erros = [];
  pagina.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warn') erros.push(`console.${msg.type()}: ${msg.text()}`);
  });
  pagina.on('pageerror', (erro) => erros.push(`exceção: ${erro.message}`));
  pagina.on('requestfailed', (req) => erros.push(`requisição falhou: ${req.url()} (${req.failure()?.errorText})`));
  pagina.on('response', (res) => { if (res.status() >= 400) erros.push(`HTTP ${res.status()}: ${res.url()}`); });

  await pagina.goto(base + alvo.url, { waitUntil: 'networkidle0' });
  if (alvo.teoria) {
    await pagina.waitForFunction(() => document.querySelector('#artigo')?.getAttribute('aria-busy') !== 'true', { timeout: 15000 });
    // Revela todos os passos e respostas para renderizar todas as fórmulas.
    await pagina.evaluate(() => {
      for (const botao of document.querySelectorAll('.passos__controles .btn')) {
        if (botao.textContent.includes('Mostrar tudo')) botao.click();
      }
      for (const detalhe of document.querySelectorAll('details')) detalhe.open = true;
    });
  }
  await new Promise((r) => setTimeout(r, 250));

  const diagnostico = await pagina.evaluate(() => ({
    formulasComErro: document.querySelectorAll('.erro-tex, .katex-error').length,
    avisos: [...document.querySelectorAll('.aviso-erro')].map((n) => n.textContent.trim()).filter((t) => !t.includes('JavaScript')),
    larguraExcedente: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    formulas: document.querySelectorAll('.katex').length,
    titulo: document.title,
  }));
  if (diagnostico.formulasComErro) erros.push(`${diagnostico.formulasComErro} fórmula(s) com erro de KaTeX`);
  for (const aviso of diagnostico.avisos) erros.push(`aviso de erro na página: ${aviso}`);
  if (diagnostico.larguraExcedente > 2) erros.push(`rolagem horizontal na página (${diagnostico.larguraExcedente}px a mais)`);

  if (comCapturas) {
    await pagina.screenshot({ path: path.join(raiz, '.e2e', `${alvo.nome}-claro.png`), fullPage: false });
    await pagina.setViewport({ width: 390, height: 800, deviceScaleFactor: 2 });
    await pagina.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
    await new Promise((r) => setTimeout(r, 200));
    const excedente = await pagina.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (excedente > 2) erros.push(`rolagem horizontal no celular (${excedente}px a mais)`);
    await pagina.screenshot({ path: path.join(raiz, '.e2e', `${alvo.nome}-celular-escuro.png`), fullPage: false });
  }

  const estado = erros.length ? 'FALHOU' : 'ok';
  console.log(`${estado.padEnd(6)} ${alvo.url.padEnd(48)} ${String(diagnostico.formulas).padStart(4)} fórmulas`);
  for (const erro of erros) console.log(`         - ${erro}`);
  if (erros.length) problemas.push({ alvo, erros });
  await pagina.close();
}

await navegador.close();
servidor.close();

if (problemas.length) {
  console.error(`\n${problemas.length} página(s) com problemas.`);
  process.exit(1);
}
console.log(`\nTodas as ${paginas.length} páginas abriram sem erros no console.`);
