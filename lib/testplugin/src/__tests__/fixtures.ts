import { test as baseTest } from 'vitest';
import { TestDataHandler } from '..';

export const test = baseTest.extend('handler', () => new TestDataHandler());
