import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { sortByDateDesc } from './entries';

export type PostEntry = CollectionEntry<'posts'>;
export type ReviewEntry = CollectionEntry<'reviews'>;
export type ShelfEntry = CollectionEntry<'shelf'>;
export type ArticleEntry = PostEntry | ReviewEntry;

// draft 필터는 여기 한 곳에서만 한다. dev 서버에서는 draft도 보인다.
export async function getPublished<C extends 'posts' | 'reviews'>(
	collection: C,
): Promise<CollectionEntry<C>[]> {
	const entries = await getCollection(collection);
	return sortByDateDesc(
		entries.filter((e) => import.meta.env.DEV || !e.data.draft) as CollectionEntry<C>[],
	);
}

export async function getArticles(): Promise<ArticleEntry[]> {
	const [posts, reviews] = await Promise.all([getPublished('posts'), getPublished('reviews')]);
	return sortByDateDesc<ArticleEntry>([...posts, ...reviews]);
}

export async function getShelf(): Promise<ShelfEntry[]> {
	const items = await getCollection('shelf');
	return items.sort(
		(a, b) =>
			b.data.finishedAt.getTime() - a.data.finishedAt.getTime() ||
			(a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
	);
}

// Astro는 없는 참조만으로는 빌드를 실패시키지 않으므로 여기서 직접 던진다.
export async function getShelfItem(review: ReviewEntry): Promise<ShelfEntry> {
	const item = await getEntry(review.data.shelf);
	if (!item) {
		throw new Error(`reviews/${review.id}: shelf "${review.data.shelf.id}" 항목이 없음`);
	}
	return item;
}
