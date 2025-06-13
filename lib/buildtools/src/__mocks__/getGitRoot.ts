import { resolve } from 'path';

const testMocksDir = resolve(import.meta.dirname, '../__test_mocks__');

export const getBundlesDir = () => Promise.resolve(`${testMocksDir}/bundles`);
export const getTabsDir = () => Promise.resolve(`${testMocksDir}/tabs`);
export const getOutDir = () => Promise.resolve('/build');
export const getGitRoot = () => Promise.resolve(testMocksDir);
