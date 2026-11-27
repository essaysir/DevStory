import { describe, test, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_INDEXABLE } from '../../src/consts';
import { DIST, exists, htmlFiles, readDist } from './helpers';

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
});

test('서버 코드 없음', () => {
  expect(exists('_worker.js')).toBe(false);
  expect(exists('_routes.json')).toBe(false);
});

test('Pretendard 폰트가 CSS에 들어 있다', () => {
  const css = readdirSync(join(DIST, '_astro')).filter((f) => f.endsWith('.css'));
  expect(css.some((f) => readDist(`_astro/${f}`).includes('Pretendard Variable'))).toBe(true);
});
