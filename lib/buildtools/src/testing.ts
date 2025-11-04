import { baseVitestConfig } from '@sourceacademy/modules-repotools/testing';
import { mergeConfig, type TestProjectInlineConfiguration } from 'vitest/config';
import { startVitest, type InlineConfig, type VitestRunMode } from 'vitest/node';

interface RunVitestBoolOptions {
  watch?: boolean;
  coverage?: boolean;
  update?: boolean;
  allowOnly?: boolean;
  silent?: boolean | 'passed-only';
}

/**
 * Create a new Vitest instance and run it. Refer to https://vitest.dev/advanced/api/#startvitest for more information.
 */
export async function runVitest(mode: VitestRunMode, filters: string[], projects: TestProjectInlineConfiguration[], options: RunVitestBoolOptions) {
  try {
    const runtimeOptions: InlineConfig = {
      projects,
      update: !!options.update,
      coverage: {
        enabled: !!options.coverage,
      },
      allowOnly: !!options.allowOnly,
      watch: !!options.watch,
      silent: options.silent
    };

    const finalConfig: InlineConfig = mergeConfig(
      baseVitestConfig.test!,
      {
        config: false,
        ...runtimeOptions
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
