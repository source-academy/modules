import * as tabs from "../tabs";
import { testBuildCommand } from '@src/build/__tests__/testingUtils';

jest.mock('esbuild', () => ({
	build: jest.fn()
		.mockResolvedValue({ outputFiles: [] })
}));

jest.spyOn(tabs, 'bundleTabs')

testBuildCommand(
	'buildTabs',
	tabs.getBuildTabsCommand,
	[tabs.bundleTabs]
)
