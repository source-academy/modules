import { join, resolve } from 'path';

const testMocksDir = resolve(import.meta.dirname, '../../../__test_mocks__');

export const bundlesDir = join(testMocksDir, 'src', 'bundles');
export const tabsDir = join(testMocksDir, 'src', 'tabs');
export const outDir = '/build';
export const getGitRoot = () => Promise.resolve(testMocksDir);
