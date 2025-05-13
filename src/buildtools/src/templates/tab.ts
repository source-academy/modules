import fs from 'fs/promises';
import type { Interface } from 'readline/promises';
import { askQuestion, success, warn } from './print';
import { check, isPascalCase } from './utilities';
import { getBundleManifest, getBundleManifests, type BundleManifest, type ModulesManifest } from '../build/modules/manifest';

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
  return Object.values(manifest).flatMap(x => x.tabs).includes(name)
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
  const manifest = await getBundleManifests(bundlesDir)
  const moduleName = await askModuleName(manifest, rl);
  const tabName = await askTabName(manifest, rl);

  // Copy module tab template into correct destination and show success message
  const tabDestination = `${tabsDir}/${tabName}`;
  await fs.mkdir(tabDestination, { recursive: true });

  const packageJson = {
    name: `@sourceacademy/tab-${tabName}`,
    private: true,
    version: "1.0.0",
    devDependencies: {
      "@sourceacademy/module-buildtools": "workspace:^",
      "@types/react": "^18.3.1",
      "typescript": "^5.8.2"
    },
    dependencies: {
      react: "^18.3.1"
    },
    scripts: {
      "build": "buildtools build tab ."
    }
  }

  await fs.cp('buildtools/src/templates/templates/tabs', tabDestination)
  await Promise.all([
    fs.writeFile(`${tabDestination}/package.json`, JSON.stringify(packageJson, null, 2)),
    getBundleManifest(`${bundlesDir}/${moduleName}`)
      .then(async bundleManifest => {
        const newManifest: BundleManifest = {
          ...bundleManifest,
          tabs: [
            ...bundleManifest.tabs,
            tabName
          ]
        }

        await fs.writeFile(`${bundlesDir}/${moduleName}/manifest.json`, JSON.stringify(newManifest, null, 2))
      })
  ])

  success(
    `Tab ${tabName} for module ${moduleName} created at ${tabDestination}.`
  );
}
