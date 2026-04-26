import { createContext, type Context } from 'js-slang';
import { getRequireProvider, type RequireProvider } from 'js-slang/dist/modules/loader/requireProvider';
import { describe, expect, test as baseTest } from 'vitest';
import manifest from '../../../build/modules.json' with { type: 'json' };

interface Fixtures {
  context: Context;
  require: RequireProvider;
}

const test = baseTest.extend<Fixtures>({
  context: ({}, use) => use(createContext()),
  require: ({ context }, use) => use(getRequireProvider(context))
});

describe('Loading Bundles', () => {
  test.for(Object.keys(manifest))('%s bundle', async (bundleName, { context, require }) => {
    context.moduleContexts[bundleName] = {
      state: null,
      tabs: null
    };

    const { default: partialBundle } = await import(`#bundle/${bundleName}`);

    expect(() => partialBundle(require)).not.toThrow();
  });
});
