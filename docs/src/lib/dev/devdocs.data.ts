// Loader making use of build-time data loading: https://vitepress.dev/guide/data-loading

import fs from 'fs/promises';
import pathlib from 'path';
import { createContentLoader } from 'vitepress';

const files = await fs.readdir(import.meta.dirname, { withFileTypes: true });

const filesToInclude = files.filter(each => {
  if (!each.isFile()) return false;
  if (pathlib.extname(each.name) !== '.md') return false;
  return each.name !== 'index.md';
}).map(each => {
  return pathlib.join('/lib/dev', each.name);
});

export default createContentLoader(filesToInclude);
