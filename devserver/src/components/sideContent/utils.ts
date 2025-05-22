import type { Context } from 'js-slang';
import type { ModuleSideContent, SideContentTab } from './types';

export const getDynamicTabs = async (context: Context) => {
  const moduleSideContents = await Promise.all(Object.keys(context.moduleContexts)
    .map(async (moduleName) => {
      const manifest = await import(`../../../../src/bundles/${moduleName}/manifest.json`, { with: { type: 'json' }});
      if (manifest.tabs) {
        const tabsToSpawn = manifest.tabs as string[];
        return Promise.all(tabsToSpawn.map(async (tabName): Promise<ModuleSideContent> => {
          try {
            const { default: rawTab } = await import(`../../../../src/tabs/${tabName}/src/index.tsx`);
            return rawTab;
          } catch {
            const { default: rawTab } = await import(`../../../../src/tabs/${tabName}/index.tsx`);
            return rawTab;
          }
        }));
      } else {
        return [];
      }
    }));

  return moduleSideContents.flat().filter(({ toSpawn }) => !toSpawn || toSpawn({ context }))
    .map((tab): SideContentTab => ({
      ...tab,
      // In the frontend, module tabs use their labels as IDs
      id: tab.label,
      body: tab.body({ context })
    }));
};
