import { describe, test, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_INDEXABLE } from '../../src/consts';
import { DIST, exists, htmlFiles, readDist } from './helpers';

test('dist에 HTML이 있다', () => expect(htmlFiles().length).toBeGreaterThan(0));

describe.each(htmlFiles())('%s', (file) => {
  const html = readDist(file);

  test('lang ko', () => expect(html).toContain('<html lang="ko"'));
  test('h1은 정확히 하나', () => expect(html.match(/<h1[\s>]/g)?.length).toBe(1));
  test('noindex는 SITE_INDEXABLE이 false일 때만', () =>
    expect(html.includes('<meta name="robots" content="noindex"')).toBe(!SITE_INDEXABLE));
  test('canonical은 https://tommycommits.dev/ 로 시작하고 / 로 끝난다 (404.html 제외)', () => {
    if (file === '404.html') return;
    const m = html.match(/<link rel="canonical" href="([^"]+)"/);
    expect(m).not.toBeNull();
    expect(m![1].startsWith('https://tommycommits.dev/')).toBe(true);
    expect(m![1].endsWith('/')).toBe(true);
  });
  test('모든 img에 비어 있지 않은 alt', () => {
    for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
      expect(img).toMatch(/\salt="[^"]+"/);
    }
  });
});

test('서버 코드 없음', () => {
  expect(exists('_worker.js')).toBe(false);
  expect(exists('_routes.json')).toBe(false);
});

test('Pretendard 폰트가 CSS에 들어 있다', () => {
  const css = readdirSync(join(DIST, '_astro')).filter((f) => f.endsWith('.css'));
  expect(css.some((f) => readDist(`_astro/${f}`).includes('Pretendard Variable'))).toBe(true);
});

test('내부 링크는 실제 파일을 가리킨다', () => {
  const broken: string[] = [];
  for (const file of htmlFiles()) {
    for (const m of readDist(file).matchAll(/href="(\/[^"]*)"/g)) {
      const href = m[1];
      if (href.startsWith('//')) continue;
      const path = href.split('#')[0].split('?')[0];
      const last = path.split('/').pop() ?? '';
      const ok = last.includes('.')
        ? exists(path.slice(1))
        : path.endsWith('/') && exists(`${path.slice(1)}index.html`);
      if (!ok) broken.push(`${file}: ${href}`);
    }
  }
  expect(broken).toEqual([]);
});

test('title은 페이지마다 다르다', () => {
  const seen = new Map<string, string>();
  for (const file of htmlFiles()) {
    const m = readDist(file).match(/<title>([^<]+)<\/title>/);
    expect(m, `${file}: title 없음`).not.toBeNull();
    expect(seen.get(m![1]), `${file}: title "${m![1]}" 중복`).toBeUndefined();
    seen.set(m![1], file);
  }
});

test('description은 비어 있지 않다', () => {
  for (const file of htmlFiles()) {
    expect(readDist(file), file).toMatch(/<meta name="description" content="[^"]+"/);
  }
});
