import fs from 'fs/promises';
import type { Interface } from 'readline/promises';
import { askQuestion, success, warn } from './print';
import { check, isSnakeCase } from './utilities';
import { getBundleManifests, type BundleManifest, type ModulesManifest } from '../build/modules/manifest';

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
  const manifest = await getBundleManifests(bundlesDir)
  const moduleName = await askModuleName(manifest, rl);
  const bundleDestination = `${bundlesDir}/${moduleName}`;
  await fs.cp('./src/templates/templates/bundle', bundleDestination)

  const packageJson = {
    name: `@sourceacademy/bundle-${moduleName}`,
    private: true,
    version: "1.0.0",
    devDependencies: {
      "@sourceacademy/module-buildtools": "workspace:^",
      "typescript": "^5.8.2"
    },
    type: "module",
    scripts: {
      tsc: "tsc --project ./tsconfig.json",
      build: 'buildtools build bundle .'
    },
    exports: {
      ".": "./dist/index.js",
      "./*": "./dist/*.js",
      "./*.js": "./dist/*.js"
    }
  }

  const bundleManifest: BundleManifest = {
    name: moduleName,
    tabs: []
  }

  await Promise.all([
    fs.writeFile(`${bundleDestination}/package.json`, JSON.stringify(packageJson, null, 2)),
    fs.writeFile(`${bundleDestination}/manifest.json`, JSON.stringify(bundleManifest, null, 2))
  ])

  success(`Bundle for module ${moduleName} created at ${bundleDestination}.`);
}
