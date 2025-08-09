// Loader making use of build-time data loading: https://vitepress.dev/guide/data-loading

import fs from 'fs/promises';
import pathlib from 'path';
import { createContentLoader } from 'vitepress';

const files = await fs.readdir(import.meta.dirname, { withFileTypes: true });

// Any markdown files within the lib/dev directory will be considered
// except for the index.md file
const filesToInclude = files.filter(each => {
  if (!each.isFile()) return false;
  if (pathlib.extname(each.name) !== '.md') return false;
  return each.name !== 'index.md';
}).map(each => {
  // Paths are resolved relative to the src directory
  return pathlib.join('/lib/dev', each.name);
});

export default createContentLoader(filesToInclude, {
  transform(data) {
    // Append the base path
    data.forEach(each => {
      each.url = `/devdocs${each.url}`;
    });
    return data;
  }
});
