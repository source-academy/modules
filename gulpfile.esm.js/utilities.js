/**
 * Utilities for scripts
 */
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line import/prefer-default-export
export const cjsDirname = () => {
  return dirname(fileURLToPath(import.meta.url));
};
