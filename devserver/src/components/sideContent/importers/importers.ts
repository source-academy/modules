import type { Context } from 'js-slang';
import React from 'react';
import modulesManifest from '../../../../../build/modules.json' with { type: 'json' };
import type { ModuleSideContent, RawTab, SideContentTab } from '../types';
import { requireProvider } from './requireProvider';

/**
 * Use dynamic imports to load the raw typescript. This allows Vite to
 * detect file changes and use HMR to display the changes in real time
 */
export async function getDynamicTabs(context: Context) {
  const moduleSideContents = await Promise.all(Object.keys(context.moduleContexts)
    .map(async (moduleName) => {
      const manifest = (modulesManifest as any)[moduleName];
      if (manifest.tabs) {
        const tabsToSpawn = manifest.tabs as string[];
        return Promise.all(tabsToSpawn.map(async (tabName): Promise<ModuleSideContent> => {
          try {
            const { default: rawTab } = await import(`../../../../../src/tabs/${tabName}/src/index.tsx`);
            return rawTab;
          } catch {
            const { default: rawTab } = await import(`../../../../../src/tabs/${tabName}/index.tsx`);
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
}

/**
 * Instead of loading the from the raw typescript, use the compiled versions
 * from the `build` folder.
 * Useful for checking that the tabs still work after compilation
 */
export async function getCompiledTabs(context: Context) {
  const moduleSideContents = await Promise.all(Object.keys(context.moduleContexts)
    .map(async (moduleName) => {
      const manifest = (modulesManifest as any)[moduleName];
      if (manifest.tabs) {
        const tabsToSpawn = manifest.tabs as string[];
        return Promise.all(tabsToSpawn.map(async (tabName): Promise<ModuleSideContent> => {
          const { default: rawTab } = await import(`../../../../../build/tabs/${tabName}.js`);
          const { default: content } = await (rawTab as RawTab)(requireProvider, React);
          return content;
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
