process.env.TZ = 'UTC';
import { test, expect } from 'vitest';
import { formatDate, yearOf } from '../../src/lib/dates';

test('formatDate는 한국 날짜 기준으로 포맷한다', () => {
	expect(formatDate(new Date('2026-11-20'))).toBe('2026년 11월 20일');
	expect(formatDate(new Date('2026-12-31T16:00:00Z'))).toBe('2027년 1월 1일');
});

test('yearOf는 한국 기준 연도를 돌려준다', () => {
	expect(yearOf(new Date('2026-12-31T16:00:00Z'))).toBe(2027);
	expect(yearOf(new Date('2026-06-01T00:00:00Z'))).toBe(2026);
});
