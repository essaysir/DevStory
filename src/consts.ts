export const SITE_TITLE = 'DevStory';
export const SITE_DESCRIPTION = '개발하며 배운 것과 강의·책 후기를 적는 블로그';
export const SITE_INDEXABLE = false;
export const AUTHOR = { name: 'essaysir', github: 'https://github.com/essaysir' } as const;
export const SECTIONS = {
  reviews: { label: '후기', slug: 'reviews' },
  shelf: { label: '서재', slug: 'shelf' },
} as const;
