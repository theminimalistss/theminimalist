import { expect, it } from 'vitest';
import { cssTimeMs } from './cssTime';

it('preserves duration when production CSS rewrites milliseconds as seconds', () => {
  expect(cssTimeMs('600ms', 400)).toBe(600);
  expect(cssTimeMs('.6s', 400)).toBe(600);
  expect(cssTimeMs(' 1.25s ', 400)).toBe(1250);
  expect(cssTimeMs('0s', 400)).toBe(0);
  for (const invalid of ['', 'invalid', '-1s', 'Infinityms']) {
    expect(cssTimeMs(invalid, 400)).toBe(400);
  }
});
