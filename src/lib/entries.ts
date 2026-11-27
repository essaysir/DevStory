import { SECTIONS } from '../consts';
import { yearOf } from './dates';

export type CollectionName = 'posts' | 'reviews';

export interface ArticleLike {
	collection: CollectionName;
	id: string;
	data: { title: string; pubDate: Date; tags: readonly string[] };
}

export function entryKey(e: { collection: CollectionName; id: string }): string {
	return `${e.collection}/${e.id}`;
}

export function entryUrl(e: { collection: CollectionName; id: string }): string {
	const base = e.collection === 'reviews' ? SECTIONS.reviews.slug : 'posts';
	return `/${base}/${e.id}/`;
}

export function sortByDateDesc<T extends ArticleLike>(items: readonly T[]): T[] {
	return [...items].sort(
		(a, b) =>
			b.data.pubDate.getTime() - a.data.pubDate.getTime() || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
	);
}

export function groupByYear<T extends ArticleLike>(
	items: readonly T[],
): { year: number; items: T[] }[] {
	const groups = new Map<number, T[]>();
	for (const item of sortByDateDesc(items)) {
		const year = yearOf(item.data.pubDate);
		const group = groups.get(year);
		if (group) group.push(item);
		else groups.set(year, [item]);
	}
	return [...groups]
		.map(([year, items]) => ({ year, items }))
		.sort((a, b) => b.year - a.year);
}

export function collectTags<T extends ArticleLike>(items: readonly T[]): Map<string, T[]> {
	const byTag = new Map<string, T[]>();
	for (const item of sortByDateDesc(items)) {
		for (const tag of item.data.tags) {
			const list = byTag.get(tag);
			if (list) list.push(item);
			else byTag.set(tag, [item]);
		}
	}
	return new Map([...byTag].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

export function reviewsByShelf<
	T extends { id: string; data: { pubDate: Date; shelf: { id: string } } },
>(reviews: readonly T[]): Map<string, T[]> {
	const byShelf = new Map<string, T[]>();
	const oldestFirst = [...reviews].sort(
		(a, b) =>
			a.data.pubDate.getTime() - b.data.pubDate.getTime() || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
	);
	for (const review of oldestFirst) {
		const list = byShelf.get(review.data.shelf.id);
		if (list) list.push(review);
		else byShelf.set(review.data.shelf.id, [review]);
	}
	return byShelf;
}

export function stars(rating: number): string {
	return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}
