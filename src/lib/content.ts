import { getCollection, type CollectionEntry } from 'astro:content';
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
