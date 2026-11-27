import { test, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../../src');

function filesUnder(dir: string): string[] {
  return (readdirSync(join(ROOT, dir), { recursive: true, withFileTypes: true }))
    .filter((d) => d.isFile())
    .map((d) => join(d.parentPath, d.name));
}

test('getCollection( 은 src/lib/content.ts 밖에 없다 (draft 필터를 한 곳에 묶기)', () => {
  const offenders = ['pages', 'components', 'layouts']
    .flatMap(filesUnder)
    .filter((f) => readFileSync(f, 'utf8').includes('getCollection('));
  expect(offenders).toEqual([]);
});
