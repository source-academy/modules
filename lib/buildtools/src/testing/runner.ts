import { mergeConfig, type TestProjectInlineConfiguration } from 'vitest/config';
import { startVitest, type VitestRunMode } from 'vitest/node';
import { sharedVitestConfiguration } from './configs.js';
import type { RunVitestBoolOptions } from './types.js';

/**
 * Create a new Vitest instance and run it. Refer to https://vitest.dev/advanced/api/#startvitest for more information.
 */
export async function runVitest(mode: VitestRunMode, filters: string[] | undefined, projects: TestProjectInlineConfiguration[], options: RunVitestBoolOptions) {
  try {
    const finalConfig = mergeConfig(
      sharedVitestConfiguration.test!,
      {
        config: false,
        projects,
        watch: !!options.watch,
        update: !!options.update,
        coverage: {
          // Coverage is always just blank so I can never seem to get
          // specific coverage reports only
          // include: filters?.map(each => `${each}/**/*.tsx`),
          enabled: !!options.coverage
        },
      }
    );

    const vitest = await startVitest(mode, filters, finalConfig);

    if (vitest.shouldKeepServer()) {
    // If Vitest is called in watch mode, then we wait for the onClose hook
    // to be called to return instead
    // Refer to https://vitest.dev/advanced/api/vitest.html#shouldkeepserver
      await new Promise<void>(resolve => vitest.onClose(resolve));
    } else {
      await vitest.close();
    }
  } catch (error) {
    console.error(error);
  }
}
