import pathlib from 'path';
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
  return runVitest(mode, [asset.directory], [{
    extends: rootConfigPath,
    test: {
      environment: 'jsdom',
      name: `${asset.name} ${asset.type}`,
      include: [`${asset.directory}/**/__tests__/*.{ts,tsx}`]
    }
  }], options);
}
