import { baseVitestConfig } from '@sourceacademy/modules-repotools/testing';
import { mergeConfig, type TestProjectInlineConfiguration, type ViteUserConfig } from 'vitest/config';
import { startVitest, type VitestRunMode } from 'vitest/node';

interface RunVitestBoolOptions {
  watch?: boolean
  coverage?: boolean
  update?: boolean
  allowOnly?: boolean
}

function getIncludes({ test }: TestProjectInlineConfiguration) {
  const output: string[] = [];

  if (test?.include) {
    output.push(...test.include);
  }

  if (test?.browser?.enabled && test?.browser?.instances) {
    for (const { include } of test.browser.instances) {
      if (include) {
        output.push(...include);
      }
    }
  }

  return output;
}

/**
 * Create a new Vitest instance and run it. Refer to https://vitest.dev/advanced/api/#startvitest for more information.
 */
export async function runVitest(mode: VitestRunMode, filters: string[], projects: TestProjectInlineConfiguration[], options: RunVitestBoolOptions) {
  try {
    const coverageIncludeFilters = filters.length === 0 ? filters : projects.flatMap(getIncludes);
    const runtimeOptions: ViteUserConfig['test'] = {
      projects,
      update: !!options.update,
      coverage: {
        include: coverageIncludeFilters,
        enabled: !!options.coverage,
      },
      allowOnly: !!options.allowOnly,
      watch: !!options.watch,
    };

    const finalConfig = mergeConfig(
      baseVitestConfig.test!,
      {
        config: false,
        ...runtimeOptions
      }
    );

    finalConfig.coverage.include = coverageIncludeFilters;
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
