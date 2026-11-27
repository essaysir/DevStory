import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const DIST: string = resolve(import.meta.dirname, '../../dist');

export function htmlFiles(): string[] {
  return (readdirSync(DIST, { recursive: true }) as string[])
    .map((p) => p.replaceAll('\\', '/'))
    .filter((p) => p.endsWith('.html') && !p.startsWith('pagefind/'));
}

export function readDist(rel: string): string {
  return readFileSync(join(DIST, rel), 'utf8');
}

export function exists(rel: string): boolean {
  return existsSync(join(DIST, rel));
}
