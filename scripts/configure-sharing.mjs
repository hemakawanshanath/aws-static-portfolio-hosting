// Run with the final public site URL, including any project subdirectory.
import fs from 'node:fs';
const url = new URL(process.argv[2]);
if (url.protocol !== 'https:') throw new Error('Use the public HTTPS website URL.');
url.search = '';
url.hash = '';
if (!url.pathname.endsWith('/')) url.pathname += '/';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const path = new URL('../index.html', import.meta.url);
let html = fs.readFileSync(path, 'utf8');
const image = escape(new URL('assets/brand/social-preview.png', url).href);
html = html.replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*(">)/g, `$1${image}$2`);
html = html.replace(/\s*<meta property="og:url" content="[^"]*">/g, '');
html = html.replace(/\s*<link rel="canonical" href="[^"]*">/g, '');
html = html.replace('    <meta property="og:type"', `    <link rel="canonical" href="${escape(url.href)}">\n    <meta property="og:url" content="${escape(url.href)}">\n    <meta property="og:type"`);
fs.writeFileSync(path, html);
console.log(`Sharing metadata configured for ${url.href}`);
