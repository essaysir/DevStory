import { test, expect } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const CONTENT = resolve(import.meta.dirname, '../../src/content');

test('posts·reviews의 .md/.mdx는 전부 <컬렉션>/<폴더>/index.md(x) 형태다', () => {
  const stray: string[] = [];
  for (const collection of ['posts', 'reviews']) {
    const dir = join(CONTENT, collection);
    if (!existsSync(dir)) continue;
    for (const rel of readdirSync(dir, { recursive: true }) as string[]) {
      const parts = rel.replaceAll('\\', '/').split('/');
      if (!/\.mdx?$/.test(parts.at(-1)!)) continue;
      if (parts.length !== 2 || !/^index\.mdx?$/.test(parts[1])) stray.push(`${collection}/${parts.join('/')}`);
    }
  }
  expect(stray).toEqual([]);
});
