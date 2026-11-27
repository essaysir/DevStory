import { test, expect } from 'vitest';
import { readdirSync } from 'node:fs';
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

test('후기·서재 페이지', () => {
  expect(exists('reviews/index.html')).toBe(true);
  expect(exists('reviews/sample-course-review/index.html')).toBe(true);
  expect(exists('shelf/index.html')).toBe(true);
  expect(exists('reviews/sample-draft-review/index.html')).toBe(false);
});

test('요약 카드', () => {
  const review = readDist('reviews/sample-course-review/index.html');
  ['샘플 강의: 스프링 데이터 입문', '★★★★☆', '인프런', '샘플 강사', 'https://example.com/course', '보러 가기'].forEach(
    (s) => expect(review).toContain(s),
  );
});

test('서재: 공개 후기가 있는 카드만 링크', () => {
  const shelf = readDist('shelf/index.html');
  const links = shelf.match(/href="\/reviews\/[^"]+\/"/g) ?? [];
  expect(links).toEqual(['href="/reviews/sample-course-review/"']); // sample-book은 draft 후기뿐 → 링크 없음
  expect(shelf).toContain('샘플 책: 데이터베이스 설계 기초');
});

test('태그 페이지는 공개 글에 쓰인 태그만', () => {
  for (const t of ['astro', 'database', 'react', 'spring']) {
    expect(exists(`tags/${t}/index.html`), t).toBe(true);
  }
  expect(exists('tags/java/index.html')).toBe(false); // draft 글에만 쓰인 태그
  const db = readDist('tags/database/index.html');
  expect(db).toContain('/posts/sample-typography/');
  expect(db).toContain('/reviews/sample-course-review/');
});

test('메인에 최근 글·후기·서재', () => {
  const home = readDist('index.html');
  for (const s of [
    '/posts/sample-typography/',
    '/posts/sample-interactive-demo/',
    '/reviews/sample-course-review/',
    '샘플 강의: 스프링 데이터 입문',
    '샘플 책: 데이터베이스 설계 기초',
  ]) {
    expect(home).toContain(s);
  }
});

test('About·404 페이지', () => {
  expect(exists('about/index.html')).toBe(true);
  expect(exists('404.html')).toBe(true);
  expect(exists('tags/index.html')).toBe(true);
});
