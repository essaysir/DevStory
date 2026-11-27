process.env.TZ = 'UTC';
import { test, expect } from 'vitest';
import type { ArticleLike } from '../../src/lib/entries';

const { SECTIONS } = await import('../../src/consts');
const { entryKey, entryUrl, sortByDateDesc, groupByYear, collectTags, reviewsByShelf, stars } =
	await import('../../src/lib/entries');

const post = (id: string, pubDate: string, tags: string[] = []): ArticleLike => ({
	collection: 'posts',
	id,
	data: { title: id, pubDate: new Date(pubDate), tags },
});
const ids = (xs: { id: string }[]) => xs.map((x) => x.id);

test('entryKey / entryUrl', () => {
	expect(entryKey({ collection: 'reviews', id: 'x' })).toBe('reviews/x');
	expect(entryUrl({ collection: 'posts', id: 'a' })).toBe('/posts/a/');
	expect(entryUrl({ collection: 'reviews', id: 'b' })).toBe(`/${SECTIONS.reviews.slug}/b/`);
});

test('sortByDateDesc: 최신순, 같은 날짜는 id 오름차순, 입력 불변', () => {
	const input = [post('a', '2025-01-01'), post('c', '2026-01-01'), post('b', '2026-01-01')];
	const out = sortByDateDesc(input);
	expect(ids(out)).toEqual(['b', 'c', 'a']);
	expect(ids(input)).toEqual(['a', 'c', 'b']);
	expect(out).not.toBe(input);
});

test('groupByYear: 한국 연도 기준, 연도 내림차순, 묶음 안은 최신순', () => {
	const out = groupByYear([
		post('p1', '2025-03-01'),
		post('p2', '2026-11-20'),
		post('p3', '2026-01-05'),
		post('p4', '2025-12-31T15:30:00Z'),
	]);
	expect(out.map((g) => ({ year: g.year, ids: ids(g.items) }))).toEqual([
		{ year: 2026, ids: ['p2', 'p3', 'p4'] },
		{ year: 2025, ids: ['p1'] },
	]);
	expect(groupByYear([])).toEqual([]);
});

test('collectTags: 쓰인 태그만, 키는 이름순, 값은 최신순', () => {
	const m = collectTags([
		post('p1', '2026-01-01', ['db']),
		post('p2', '2026-02-01', ['react', 'db']),
		post('p3', '2026-03-01', []),
	]);
	expect([...m.keys()]).toEqual(['db', 'react']);
	expect(ids(m.get('db')!)).toEqual(['p2', 'p1']);
	expect(m.has('astro')).toBe(false);
});

test('reviewsByShelf: 서재 항목별, 오래된 순', () => {
	const r = (id: string, pubDate: string, shelf: string) => ({
		id,
		data: { pubDate: new Date(pubDate), shelf: { id: shelf } },
	});
	const m = reviewsByShelf([
		r('r1', '2026-02-01', 'a'),
		r('r2', '2025-05-01', 'a'),
		r('r3', '2026-01-01', 'b'),
	]);
	expect(ids(m.get('a')!)).toEqual(['r2', 'r1']);
	expect(ids(m.get('b')!)).toEqual(['r3']);
	expect(m.get('zzz')).toBeUndefined();
});

test('stars: 5칸', () => {
	expect(stars(4)).toBe('★★★★☆');
	expect(stars(5)).toBe('★★★★★');
	expect(stars(1)).toBe('★☆☆☆☆');
});
