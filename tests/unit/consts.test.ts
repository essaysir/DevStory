import { test, expect } from 'vitest';
import { SECTIONS } from '../../src/consts';

const RESERVED = ['posts', 'tags', 'about', 'search', 'rss.xml', 'pagefind', '_astro'];
test('섹션 slug는 서로 다르고 예약 경로와 겹치지 않는다', () => {
  const slugs = Object.values(SECTIONS).map((s) => s.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
  for (const s of slugs) { expect(RESERVED).not.toContain(s); expect(s).toMatch(/^[a-z0-9-]+$/); }
});
