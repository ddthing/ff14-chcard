import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = join(projectRoot, 'dist');
const serverEntry = join(projectRoot, '.prerender', 'entry-server.js');
const template = await readFile(join(distDirectory, 'index.html'), 'utf8');
const { render } = await import(pathToFileURL(serverEntry).href);

const publicRoutes = ['/guide', '/about', '/faq', '/contact', '/terms', '/privacy'];

function removeRootOnlyMetadata(html) {
    return html
        .replace(/\s*<meta\s+(?:property|name)="(?:og:|twitter:)[^>]*>\s*/gi, '\n')
        .replace(/\s*<script\s+type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '\n');
}

function createPage(templateHtml, page) {
    const cleanTemplate = removeRootOnlyMetadata(templateHtml)
        .replace(/\s*<title>[\s\S]*?<\/title>\s*/i, '\n')
        .replace(/\s*<meta\s+name="description"[^>]*>\s*/i, '\n')
        .replace(/\s*<link\s+rel="canonical"[^>]*>\s*/i, '\n')
        .replace(/<head>/i, `<head>\n  ${page.head}`)
        .replace(/<div id="root">[\s\S]*?<\/div>\s*<\/body>/i, `<div id="root">${page.body}</div>\n</body>`);

    if (!cleanTemplate.includes(page.body)) {
        throw new Error('Failed to inject server-rendered page body');
    }

    return cleanTemplate;
}

for (const route of publicRoutes) {
    const page = render(route);
    const outputPath = join(distDirectory, route.slice(1), 'index.html');
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, createPage(template, page), 'utf8');
    console.log(`prerendered ${route} -> ${outputPath}`);
}
