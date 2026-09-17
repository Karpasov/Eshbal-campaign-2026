import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// SITE_URL is the stable public origin, not an individual preview deployment URL.
const input = process.env.SITE_URL?.trim();
if (!input) throw new Error('Set SITE_URL to your public address, e.g. https://your-project.pages.dev');
const url = new URL(input);
if (url.username || url.password || url.search || url.hash || url.pathname !== '/') {
  throw new Error('SITE_URL must be an origin only, without credentials, path, query or fragment.');
}
if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) {
  throw new Error('Use HTTPS for SITE_URL (HTTP is allowed only for local development).');
}
const source = fileURLToPath(new URL('../public/', import.meta.url));
const output = fileURLToPath(new URL('../dist/', import.meta.url));
const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
if (!html.includes('__SITE_URL__')) throw new Error('The site URL placeholder is missing.');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
await writeFile(new URL('../dist/index.html', import.meta.url), html.replaceAll('__SITE_URL__', url.origin));
console.log(`Site ready in dist/ with sharing URLs for ${url.origin}`);
