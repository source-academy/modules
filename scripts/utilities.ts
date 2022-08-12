/**
 * Utilities for scripts
 */
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import _modules from '../modules.json';

export type ModuleManifest = {
  [name: string]: {
    tabs: string[];
  };
};

export const modules = _modules as ModuleManifest;

/**
 * Function to replace the functionality of `__dirname` in CommonJS modules
 */
export const cjsDirname = (url: string) => dirname(fileURLToPath(url));
