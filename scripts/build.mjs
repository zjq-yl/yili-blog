import { readFile, readdir, mkdir, copyFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

const root = path.resolve(import.meta.dirname, '..');
const postsDir = path.join(root, 'posts');
const outDir = path.join(root, 'dist');
const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function layout(title, description, content) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <title>${escapeHtml(title)} · 逸里</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="site-shell">
    <header class="site-header"><a class="brand" href="/">逸里<span class="brand-dot">.</span></a><span class="header-note">写点日常，记点技术</span></header>
    <main>${content}</main>
    <footer class="site-footer">© ${new Date().getFullYear()} 逸里 · 记录学习与生活</footer>
  </div>
</body>
</html>`;
}

await rm(outDir, { recursive: true, force: true });
await mkdir(path.join(outDir, 'posts'), { recursive: true });
await copyFile(path.join(root, 'style.css'), path.join(outDir, 'style.css'));

const entries = await readdir(postsDir, { withFileTypes: true });
const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.md'));
const posts = [];

for (const file of files) {
  const slug = path.basename(file.name, '.md');
  const source = await readFile(path.join(postsDir, file.name), 'utf8');
  const tokens = marked.lexer(source);
  const heading = tokens.find((token) => token.type === 'heading' && token.depth === 1);
  const paragraph = tokens.find((token) => token.type === 'paragraph');
  const title = heading?.text.replace(/<[^>]+>/g, '') ?? slug;
  const excerpt = paragraph?.text.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '') ?? '';
  const date = /^\d{4}-\d{2}-\d{2}/.exec(slug)?.[0] ?? '';
  const url = `/posts/${slug}.html`;
  const body = `<div class="article-top"><a class="back-link" href="/">返回文章列表</a><span>${date}</span></div><article class="prose">${marked.parse(source)}</article><div class="article-bottom"><a href="/">返回首页</a></div>`;
  await writeFile(path.join(outDir, 'posts', `${slug}.html`), layout(title, excerpt, body));
  posts.push({ title, excerpt, date, url });
}

posts.sort((a, b) => b.date.localeCompare(a.date));
const cards = posts.map((post) => `<article class="post-card"><time datetime="${post.date}">${post.date}</time><h2><a href="${post.url}">${escapeHtml(post.title)}</a></h2><p>${escapeHtml(post.excerpt)}</p><a class="read-link" href="${post.url}">阅读全文</a></article>`).join('\n');
const home = `<section class="hero"><p class="eyebrow">PERSONAL BLOG</p><h1>你好，这里是逸里。</h1><p class="hero-copy">把学到的东西、遇到的问题和解决的过程，慢慢写下来。</p></section><section class="post-list"><div class="section-heading"><h2>文章</h2><span>${posts.length} 篇记录</span></div>${cards || '<p>第一篇文章正在路上。</p>'}</section>`;
await writeFile(path.join(outDir, 'index.html'), layout('首页', '逸里的个人博客，记录学习与生活。', home));

const imageDir = entries.find((entry) => entry.isDirectory() && entry.name === 'images');
if (imageDir) {
  await mkdir(path.join(outDir, 'posts', 'images'), { recursive: true });
  for (const image of await readdir(path.join(postsDir, 'images'), { withFileTypes: true })) {
    if (image.isFile()) await copyFile(path.join(postsDir, 'images', image.name), path.join(outDir, 'posts', 'images', image.name));
  }
}

console.log(`Built ${posts.length} post(s) into dist/`);
