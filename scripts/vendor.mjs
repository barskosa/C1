// Copia KaTeX e math.js de node_modules para vendor/, para que o site rode
// como arquivos estáticos (sem CDN e sem etapa de build).
// Uso: npm install && npm run vendor
import { cp, mkdir, readdir, rm, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nm = (...p) => path.join(raiz, 'node_modules', ...p);
const vendor = (...p) => path.join(raiz, 'vendor', ...p);

async function versao(pacote) {
  const pkg = JSON.parse(await readFile(nm(pacote, 'package.json'), 'utf8'));
  return pkg.version;
}

await rm(vendor(), { recursive: true, force: true });

// KaTeX: script, CSS e apenas as fontes woff2 (todos os navegadores atuais as usam).
await mkdir(vendor('katex', 'fonts'), { recursive: true });
await cp(nm('katex', 'dist', 'katex.min.js'), vendor('katex', 'katex.min.js'));
await cp(nm('katex', 'dist', 'katex.min.css'), vendor('katex', 'katex.min.css'));
await cp(nm('katex', 'LICENSE'), vendor('katex', 'LICENSE'));
for (const arquivo of await readdir(nm('katex', 'dist', 'fonts'))) {
  if (arquivo.endsWith('.woff2')) {
    await cp(nm('katex', 'dist', 'fonts', arquivo), vendor('katex', 'fonts', arquivo));
  }
}

// math.js: bundle para navegador (define a variável global `math`).
await mkdir(vendor('mathjs'), { recursive: true });
// O comentário de source map é removido: o .map (3 MB) não é copiado e o
// navegador reclamaria da ausência dele com o DevTools aberto.
const bundle = await readFile(nm('mathjs', 'lib', 'browser', 'math.js'), 'utf8');
await writeFile(vendor('mathjs', 'math.js'), bundle.replace(/\n\/\/# sourceMappingURL=.*\s*$/, '\n'));
await cp(nm('mathjs', 'LICENSE'), vendor('mathjs', 'LICENSE'));

const versoes = { katex: await versao('katex'), mathjs: await versao('mathjs') };
await writeFile(vendor('VERSOES.json'), JSON.stringify(versoes, null, 2) + '\n');
console.log('vendor/ atualizado:', versoes);
