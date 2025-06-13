import fs from 'fs/promises';
import type { Interface } from 'readline/promises';
import _package from '../../../../package.json' with { type: 'json' };
import { getBundleManifests } from '../build/manifest.js';
import type { ModulesManifest, BundleManifest } from '../types.js';
import { askQuestion, success, warn } from './print.js';
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
  const manifest = await getBundleManifests(bundlesDir);
  const moduleName = await askModuleName(manifest, rl);
  const tabName = await askTabName(manifest, rl);

  await fs.mkdir(tabsDir, { recursive: true });

  const reactVersion = _package.dependencies.react;
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
      react: reactVersion,
    },
    scripts: {
      build: 'buildtools build tab .',
      tsc: 'tsc --project ./tsconfig.json'
    }
  };

  const newManifest: BundleManifest = {
    ...manifest[moduleName],
    tabs: [
      ...manifest[moduleName].tabs ?? [],
      tabName
    ]
  };

  const tabDestination = `${tabsDir}/${tabName}`;
  await fs.cp(`${import.meta.dirname}/templates/tabs`, tabDestination);
  await Promise.all([
    fs.writeFile(`${tabDestination}/package.json`, JSON.stringify(packageJson, null, 2)),
    fs.writeFile(`${bundlesDir}/${moduleName}/manifest.json`, JSON.stringify(newManifest, null, 2))
  ]);

  success(
    `Tab ${tabName} for module ${moduleName} created at ${tabDestination}.`
  );
}
