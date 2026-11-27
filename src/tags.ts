// 허용 태그 목록(임시). 태그는 /tags/{tag}/ 주소가 되므로 소문자·숫자·하이픈만 쓴다.
export const TAGS = ['astro', 'react', 'typescript', 'java', 'spring', 'database', 'infra', 'cs'] as const;

export type Tag = (typeof TAGS)[number];
