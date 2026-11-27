const TIME_ZONE = 'Asia/Seoul';

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	timeZone: TIME_ZONE,
});
const yearFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: TIME_ZONE });

export function formatDate(d: Date): string {
	return dateFormat.format(d);
}

export function yearOf(d: Date): number {
	return Number(yearFormat.format(d));
}
