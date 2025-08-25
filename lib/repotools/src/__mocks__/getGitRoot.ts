import { join, resolve } from 'path';

const testMocksDir = resolve(import.meta.dirname, '../../../__test_mocks__');

export const bundlesDir = join(testMocksDir, 'bundles');
export const tabsDir = join(testMocksDir, 'tabs');
export const outDir = '/build';
export const getGitRoot = () => Promise.resolve(testMocksDir);
