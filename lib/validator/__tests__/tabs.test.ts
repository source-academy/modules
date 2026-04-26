import type { ModuleSideContent } from '@sourceacademy/modules-lib/types';
import { describe, expect, test } from 'vitest';
import manifest from '../../../build/modules.json' with { type: 'json' };
import { tabRequireProvider } from './utils';

const tabNames = Object.values(manifest).flatMap(({ tabs }) => tabs);

describe('Tab loading', () => {
  test.for(tabNames)('%s tab', async tabName => {
    const { default: partialTab } = await import(`#tab/${tabName}`);
    const sideContent: ModuleSideContent = partialTab(tabRequireProvider).default;

    expect(sideContent).toHaveProperty('label', expect.any(String));
    expect(sideContent).toHaveProperty('iconName', expect.any(String));
    expect(sideContent).toHaveProperty('body', expect.any(Function));

    if ('toSpawn' in sideContent) {
      expect(sideContent.toSpawn).toEqual(expect.any(Function));
    }
  });
});
