import fs from 'fs/promises';
import pathlib from 'path';
import type { Interface } from 'readline/promises';
import { getBundleManifests } from '@sourceacademy/modules-repotools/manifest';
import type { BundleManifest, ModulesManifest } from '@sourceacademy/modules-repotools/types';
import _package from '../../../../package.json' with { type: 'json' };
import { formatResult } from '../formatter.js';
import sampleTsconfig from './bundle_tsconfig.json' with { type: 'json' };
import { askQuestion, error, success, warn } from './print.js';
import { check, isSnakeCase } from './utilities.js';

async function askModuleName(manifest: ModulesManifest, rl: Interface) {
  while (true) {
    const name = await askQuestion('What is the name of your new module? (eg. binary_tree)', rl);
    if (!isSnakeCase(name)) {
      warn('Module names must be in snake case. (eg. binary_tree)');
    } else if (check(manifest, name)) {
      warn('A module with the same name already exists.');
    } else {
      return name;
    }
  }
}

export async function addNew(bundlesDir: string, rl: Interface) {
  const manifest = await getBundleManifests(bundlesDir);
  if (manifest.severity === 'error') {
    error(formatResult(manifest));
    return;
  }

  const moduleName = await askModuleName(manifest.manifests, rl);
  const bundleDestination = pathlib.join(bundlesDir, moduleName);

  await fs.mkdir(bundlesDir, { recursive: true });
  await fs.cp(pathlib.join(import.meta.dirname, 'templates', 'bundle'), bundleDestination, { recursive: true });

  const typescriptVersion = _package.devDependencies.typescript;

  const packageJson = {
    name: `@sourceacademy/bundle-${moduleName}`,
    private: true,
    version: '1.0.0',
    devDependencies: {
      '@sourceacademy/modules-buildtools': 'workspace:^',
      typescript: typescriptVersion,
    },
    type: 'module',
    scripts: {
      build: 'buildtools build bundle .',
      lint: 'buildtools lint .',
      serve: 'yarn buildtools serve',
      test: 'buildtools test --project .',
      tsc: 'tsc --project ./tsconfig.json',
    },
    exports: {
      '.': './dist/index.js',
      './*': './dist/*.js'
    }
  };

  sampleTsconfig.typedocOptions = {
    name: moduleName
  };

  const bundleManifest: BundleManifest = {
    tabs: []
  };

  await Promise.all([
    fs.writeFile(pathlib.join(bundleDestination, 'package.json'), JSON.stringify(packageJson, null, 2) + '\n'),
    fs.writeFile(pathlib.join(bundleDestination, 'manifest.json'), JSON.stringify(bundleManifest, null, 2) + '\n'),
    fs.writeFile(pathlib.join(bundleDestination, 'tsconfig.json'), `// ${moduleName} tsconfig\n${JSON.stringify(sampleTsconfig, null, 2)}\n`),
  ]);

  success(`Bundle for module ${moduleName} created at ${bundleDestination}.`);
}
