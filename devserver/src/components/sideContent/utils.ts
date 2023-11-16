import type { Context } from "js-slang";
import manifest from "../../../../modules.json";
import type { ModuleSideContent, SideContentTab } from "./types";

const moduleManifest = manifest as Record<string, { tabs: string[] }>;

export const getDynamicTabs = async (context: Context) => {
	const moduleSideContents = await Promise.all(Object.keys(context.moduleContexts)
		.flatMap((moduleName) => moduleManifest[moduleName].tabs.map(async (tabName) => {
			const { default: rawTab } = await import(`../../../../src/tabs/${tabName}/index.tsx`);
			return rawTab as ModuleSideContent;
		})));

	return moduleSideContents.filter(({ toSpawn }) => !toSpawn || toSpawn({ context }))
		.map((tab): SideContentTab => ({
			...tab,
			// In the frontend, module tabs use their labels as IDs
			id: tab.label,
			body: tab.body({ context })
		}));
};
