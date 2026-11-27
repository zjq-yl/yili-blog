import type { CollectionEntry } from 'astro:content';

export function postInfo(post: CollectionEntry<'blog'>) {
  const lines = post.body.split(/\r?\n/).map((line) => line.trim());
  const title = lines.find((line) => line.startsWith('# '))?.slice(2) ?? post.id;
  const excerpt = lines.find((line) => line && !line.startsWith('#') && !line.startsWith('>') && !line.startsWith('![')) ?? '';
  const date = /^\d{4}-\d{2}-\d{2}/.exec(post.id)?.[0] ?? '';
  return { title, excerpt, date, url: `/posts/${post.id}.html` };
}
