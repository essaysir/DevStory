import { test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const config = JSON.parse(readFileSync(resolve(import.meta.dirname, '../../wrangler.jsonc'), 'utf8'));

test('정적 전용: main 없이 assets.directory만 ./dist', () => {
  expect(config).not.toHaveProperty('main');
  expect(config.assets.directory).toBe('./dist');
});
