import { expect, test } from 'vitest';
import { RENDER_THUMBNAIL_SYMBOL } from '../thumbnail';

test('is a global-registry symbol keyed by the documented string', () => {
  expect(typeof RENDER_THUMBNAIL_SYMBOL).toBe('symbol');
  expect(RENDER_THUMBNAIL_SYMBOL).toBe(Symbol.for('source-academy.stepper.renderThumbnail'));
});
