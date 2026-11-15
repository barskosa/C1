// Teste de fumaça no navegador: serve o site localmente, abre cada página em um
// Chrome/Edge headless e falha se houver qualquer erro no console, exceção de
// script, requisição que falhou, fórmula que o KaTeX não conseguiu renderizar
// ou rolagem horizontal da página.
//
// Uso:
//   npm run e2e                 abre todas as páginas e seções
//   npm run e2e -- --capturas   também salva capturas de tela em .e2e/
//   npm run e2e -- --so teoria  só URLs que contêm "teoria"
//
// Requer um Chrome ou Edge instalado (ou a variável CHROME_PATH).

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { SECOES } from '../js/conteudo/indice.js';
import { RAIZ, iniciarServidor, localizarNavegador } from './servidor.mjs';

const args = process.argv.slice(2);
const comCapturas = args.includes('--capturas');
const paginaInteira = args.includes('--inteira');
const filtro = args.includes('--so') ? args[args.indexOf('--so') + 1] : null;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

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
  { nome: 'praticar', url: '/praticar.html', praticar: true },
].filter((p) => !filtro || p.url.includes(filtro) || p.nome.includes(filtro));

const problemas = [];
if (comCapturas) await mkdir(path.join(RAIZ, '.e2e'), { recursive: true });

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
    // Mexe em todos os controles dos gráficos interativos.
    await espera(300);
    await pagina.evaluate(() => {
      for (const controle of document.querySelectorAll('.painel-widget input[type="range"]')) {
        for (const fracao of [0, 1, 0.5]) {
          controle.value = String(Number(controle.min) + fracao * (Number(controle.max) - Number(controle.min)));
          controle.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
      for (const seletor of document.querySelectorAll('.painel-widget select')) {
        for (const opcao of [...seletor.options].reverse()) {
          seletor.value = opcao.value;
          seletor.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      for (const caixa of document.querySelectorAll('.painel-widget input[type="checkbox"]')) caixa.click();
    });
  }
  await espera(250);

  const diagnostico = await pagina.evaluate(() => ({
    formulasComErro: document.querySelectorAll('.erro-tex, .katex-error').length,
    avisos: [...document.querySelectorAll('.aviso-erro')].map((n) => n.textContent.trim()).filter((t) => !t.includes('JavaScript')),
    larguraExcedente: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    formulas: document.querySelectorAll('.katex').length,
    graficos: document.querySelectorAll('svg.grafico').length,
  }));
  if (diagnostico.formulasComErro) erros.push(`${diagnostico.formulasComErro} fórmula(s) com erro de KaTeX`);
  for (const aviso of diagnostico.avisos) erros.push(`aviso de erro na página: ${aviso}`);
  if (diagnostico.larguraExcedente > 2) erros.push(`rolagem horizontal na página (${diagnostico.larguraExcedente}px a mais)`);

  // Mesma página em tela de celular e tema escuro.
  if (comCapturas) await pagina.screenshot({ path: path.join(RAIZ, '.e2e', `${alvo.nome}-claro.png`), fullPage: paginaInteira });
  await pagina.setViewport({ width: 390, height: 800, deviceScaleFactor: 2 });
  await pagina.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await espera(250);
  const excedente = await pagina.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (excedente > 2) erros.push(`rolagem horizontal no celular (${excedente}px a mais)`);
  if (comCapturas) await pagina.screenshot({ path: path.join(RAIZ, '.e2e', `${alvo.nome}-celular-escuro.png`), fullPage: paginaInteira });

  const estado = erros.length ? 'FALHOU' : 'ok';
  console.log(`${estado.padEnd(6)} ${alvo.url.padEnd(48)} ${String(diagnostico.formulas).padStart(4)} fórmulas  ${String(diagnostico.graficos).padStart(2)} gráficos`);
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
console.log(`\nTodas as ${paginas.length} páginas abriram sem erros no console (computador e celular).`);
