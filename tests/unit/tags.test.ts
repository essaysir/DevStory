import { test, expect } from 'vitest';
import { TAGS } from '../../src/tags';

test('모든 태그는 주소에 그대로 쓸 수 있는 소문자·숫자·하이픈이다', () => {
	for (const tag of TAGS) expect(tag).toMatch(/^[a-z0-9-]+$/);
});

test('태그에 중복이 없다', () => {
	expect(new Set(TAGS).size).toBe(TAGS.length);
});
