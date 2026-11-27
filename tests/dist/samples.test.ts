import { test, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, exists, readDist } from './helpers';

const BODY_EXT = /\.(html|xml|txt|json)$/;

test('draft 후기는 어떤 산출물에도 없다', () => {
  const files = (readdirSync(DIST, { recursive: true }) as string[])
    .map((p) => p.replaceAll('\\', '/'))
    .filter((p) => BODY_EXT.test(p));
  expect(files.length).toBeGreaterThan(0);
  const leaked = files.filter((f) => readDist(f).includes('sample-draft-review'));
  expect(leaked).toEqual([]);
});

test('posts 페이지 존재', () => {
  for (const f of [
    'posts/index.html',
    'posts/sample-typography/index.html',
    'posts/sample-interactive-demo/index.html',
  ]) {
    expect(exists(f)).toBe(true);
  }
});

test('posts 목록은 연도별', () => {
  const p = readDist('posts/index.html');
  expect(p).toMatch(/<h2[^>]*>\s*2026\s*<\/h2>/);
  expect(p).toMatch(/<h2[^>]*>\s*2025\s*<\/h2>/);
});

test('타이포 샘플', () => {
  const t = readDist('posts/sample-typography/index.html');
  expect(t).toContain('--shiki-dark');
  expect(t).toContain('aria-label="목차"');
  const imgs = t.match(/<img[^>]+src="\/_astro\/[^"]+"[^>]*>/g) ?? [];
  expect(imgs.length).toBeGreaterThan(0);
  for (const img of imgs) {
    expect(img).toMatch(/\swidth="\d+"/);
    expect(img).toMatch(/\sheight="\d+"/);
  }
});
