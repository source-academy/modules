import pathlib from 'path';
import react from '@vitejs/plugin-react';
import type { TestProjectConfiguration } from 'vitest/config';
import { startVitest, type VitestRunMode } from 'vitest/node';
import { getGitRoot } from './getGitRoot.js';
import type { ResolvedBundle, ResolvedTab } from './types.js';

interface RunVitestBoolOptions {
  watch?: boolean
  coverage?: boolean
  update?: boolean
}

const rootConfigPath = pathlib.join(await getGitRoot(), 'vitest.config.js');

/**
 * Create a new Vitest instance and run it. Refer to https://vitest.dev/advanced/api/#startvitest for more information.
 */
async function runVitest(mode: VitestRunMode, filters: string[] | undefined, projects: TestProjectConfiguration[], options: RunVitestBoolOptions) {
  // When we use the root config, what happens is the `projects` field remains populated. This causes unwanted tests to run, and for whatever
  // reason I couldn't get directory filtering to work properly. So by defining each bundle/tab as a separate project and by overriding
  // the root `projects` config, I can create an isolated test environment for each bundle and tab with potentially customized names

  const vitest = await startVitest(mode, filters, {
    config: rootConfigPath,
    projects,
    watch: options.watch,
    update: options.update,
    coverage: {
      // include: filters?.map(each => `${each}/**/*.tsx`),
      enabled: options.coverage
    }
  });

  if (vitest.shouldKeepServer()) {
    // If Vitest is called in watch mode, then we wait for the onClose hook
    // to be called to return instead
    // Refer to https://vitest.dev/advanced/api/vitest.html#shouldkeepserver
    await new Promise<void>(resolve => vitest.onClose(resolve));
  } else {
    await vitest.close();
  }
}

/**
 * Run Vitest on the given tab or bundle
 */
export function runIndividualVitest(mode: VitestRunMode, asset: ResolvedBundle | ResolvedTab, options: RunVitestBoolOptions) {
  if (asset.type === 'tab') {
    return runVitest(mode, [asset.directory], [{
      // @ts-expect-error Weird stuff happening with plugin again
      plugins: [react()],
      extends: rootConfigPath,
      optimizeDeps: {
        include: [
          '@blueprintjs/core',
          '@blueprintjs/icons',
          'gl-matrix',
          'js-slang',
          'lodash',
        ]
      },
      test: {
        include: [], // Use the browser mode configuration instead
        browser: {
          enabled: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium',
            name: `${asset.name} ${asset.type}`,
            headless: !options.watch,
            include: [`${asset.directory}/**/__tests__/*.{ts,tsx}`]
          }]
        }
      }
    }], options);
  } else {
    return runVitest(mode, [asset.directory], [{
      extends: rootConfigPath,
      test: {
        name: `${asset.type} ${asset.name}`,
        environment: 'jsdom',
        include: [`${asset.directory}/**/__tests__/*.{ts,tsx}`],
      }
    }], options);
  }

}
