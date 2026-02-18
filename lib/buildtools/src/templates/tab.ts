import fs from 'fs/promises';
import pathlib from 'path';
import type { Interface } from 'readline/promises';
import { getBundleManifests } from '@sourceacademy/modules-repotools/manifest';
import type { BundleManifest, ModulesManifest } from '@sourceacademy/modules-repotools/types';
import { omit } from 'es-toolkit/object';
import _package from '../../../../package.json' with { type: 'json' };
import { formatResult } from '../build/formatter.js';
import { askQuestion, error, success, warn } from './print.js';
import { check, isPascalCase } from './utilities.js';

async function askModuleName(manifest: ModulesManifest, rl: Interface) {
  while (true) {
    const name = await askQuestion('Add a new tab to which module?', rl);
    if (!check(manifest, name)) {
      warn(`Module ${name} does not exist.`);
    } else {
      return name;
    }
  }
}

function checkTabExists(manifest: ModulesManifest, name: string) {
  return Object.values(manifest).flatMap(x => x.tabs).includes(name);
}

async function askTabName(manifest: ModulesManifest, rl: Interface) {
  while (true) {
    const name = await askQuestion('What is the name of your new tab? (eg. BinaryTree)', rl);
    if (checkTabExists(manifest, name)) {
      warn('A tab with the same name already exists.');
    } else if (!isPascalCase(name)) {
      warn('Tab names must be in pascal case. (eg. BinaryTree)');
    } else {
      return name;
    }
  }
}

export async function addNew(bundlesDir: string, tabsDir: string, rl: Interface) {
  const manifestResult = await getBundleManifests(bundlesDir);
  if (manifestResult.severity === 'error') {
    error(formatResult(manifestResult));
    return;
  }
  const manifest = manifestResult.manifests;

  const moduleName = await askModuleName(manifest, rl);
  const tabName = await askTabName(manifest, rl);

  await fs.mkdir(tabsDir, { recursive: true });

  const reactVersion = _package.peerDependencies.react;
  const {
    '@types/react': reactTypesVersion,
    typescript: typescriptVersion
  } = _package.devDependencies;

  const packageJson = {
    name: `@sourceacademy/tab-${tabName}`,
    private: true,
    version: '1.0.0',
    devDependencies: {
      '@sourceacademy/modules-buildtools': 'workspace:^',
      '@types/react': reactTypesVersion,
      'typescript': typescriptVersion,
    },
    dependencies: {
      '@sourceacademy/modules-lib': 'workspace:^',
      react: reactVersion,
    },
    scripts: {
      build: 'buildtools build tab .',
      lint: 'buildtools lint .',
      test: 'buildtools test --project .',
      tsc: 'buildtools tsc .',
      serve: 'yarn buildtools serve'
    }
  };

  // Version property gets stored in package.json, not manifest.json
  const requiredProperties = omit(manifest[moduleName], 'version');

  const newManifest: BundleManifest = {
    ...requiredProperties,
    tabs: [
      ...requiredProperties.tabs ?? [],
      tabName
    ]
  };

  const tabDestination = pathlib.join(tabsDir, tabName);
  await fs.cp(pathlib.join(import.meta.dirname, 'templates', 'tab'), tabDestination, { recursive: true });
  await Promise.all([
    fs.writeFile(pathlib.join(tabDestination, 'package.json'), JSON.stringify(packageJson, null, 2)),
    fs.writeFile(pathlib.join(bundlesDir, moduleName, 'manifest.json'), JSON.stringify(newManifest, null, 2))
  ]);

  success(
    `Tab ${tabName} for module ${moduleName} created at ${tabDestination}.`
  );
}
