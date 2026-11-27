import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';

// 스키마의 이미지 필드가 unknown으로 지워지지 않고 ImageMetadata로 이어지는지 `astro check`가 확인한다.
// (unknown은 ImageMetadata에 대입할 수 없으므로 타입이 지워지면 여기서 에러가 난다.)
export function imageTypesFlow(
	post: CollectionEntry<'posts'>,
	review: CollectionEntry<'reviews'>,
	shelf: CollectionEntry<'shelf'>,
) {
	const postThumbnail: ImageMetadata | undefined = post.data.thumbnail;
	const reviewThumbnail: ImageMetadata | undefined = review.data.thumbnail;
	const shelfImage: ImageMetadata = shelf.data.image;
	return [postThumbnail, reviewThumbnail, shelfImage];
}
