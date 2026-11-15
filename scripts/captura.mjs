// Captura de tela de uma página do site (ferramenta de desenvolvimento).
//
// Uso: node scripts/captura.mjs "<caminho>" [opções]
//   --saida arquivo.png   (padrão: .e2e/captura.png)
//   --largura 1280 --altura 900
//   --tema dark|light
//   --seletor "css"       rola até o elemento antes de capturar
//   --clique "css"        clica em todos os elementos que casam com o seletor (repetível)
//   --digitar "css=texto" preenche um campo (repetível)
//   --abrir               revela todos os passos e respostas escondidas
//   --inteira             página inteira
//   --espera 400          milissegundos antes da captura

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { RAIZ, iniciarServidor, localizarNavegador } from './servidor.mjs';

const args = process.argv.slice(2);
const caminho = args[0] ?? '/index.html';
const opcao = (nome, padrao) => (args.includes(`--${nome}`) ? args[args.indexOf(`--${nome}`) + 1] : padrao);
const todas = (nome) => args.flatMap((a, i) => (a === `--${nome}` ? [args[i + 1]] : []));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const saida = path.resolve(RAIZ, opcao('saida', '.e2e/captura.png'));
await mkdir(path.dirname(saida), { recursive: true });

const servidor = await iniciarServidor();
const navegador = await puppeteer.launch({ executablePath: localizarNavegador(), headless: true });
const pagina = await navegador.newPage();
const mensagens = [];
pagina.on('console', (msg) => { if (msg.type() === 'error' || msg.type() === 'warn') mensagens.push(`console.${msg.type()}: ${msg.text()}`); });
pagina.on('pageerror', (erro) => mensagens.push(`exceção: ${erro.message}`));

await pagina.setViewport({ width: Number(opcao('largura', 1280)), height: Number(opcao('altura', 900)), deviceScaleFactor: Number(opcao('escala', 1)) });
await pagina.goto(`http://127.0.0.1:${servidor.address().port}${caminho.startsWith('/') ? caminho : `/${caminho}`}`, { waitUntil: 'networkidle0' });
await espera(300);

const tema = opcao('tema', null);
if (tema) await pagina.evaluate((t) => { document.documentElement.dataset.theme = t; }, tema);

if (args.includes('--abrir')) {
  await pagina.evaluate(() => {
    for (const botao of document.querySelectorAll('.passos__controles .btn')) if (botao.textContent.includes('Mostrar tudo')) botao.click();
    for (const detalhe of document.querySelectorAll('details')) detalhe.open = true;
  });
}
for (const item of todas('digitar')) {
  const [seletor, ...resto] = item.split('=');
  await pagina.click(seletor, { clickCount: 3 });
  await pagina.type(seletor, resto.join('='));
}
for (const seletor of todas('clique')) {
  await pagina.evaluate((s) => { for (const el of document.querySelectorAll(s)) el.click(); }, seletor);
  await espera(150);
}
const seletor = opcao('seletor', null);
if (seletor) {
  await pagina.evaluate((s) => {
    const alvo = document.querySelector(s);
    if (alvo) window.scrollTo({ top: alvo.getBoundingClientRect().top + window.scrollY - 70, behavior: 'instant' });
  }, seletor);
}
await espera(Number(opcao('espera', 400)));
await pagina.screenshot({ path: saida, fullPage: args.includes('--inteira') });

for (const mensagem of mensagens) console.log(mensagem);
console.log(`captura salva em ${path.relative(RAIZ, saida)}`);
await navegador.close();
servidor.close();
