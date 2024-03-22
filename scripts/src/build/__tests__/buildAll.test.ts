import type { MockedFunction } from "jest-mock";
import getBuildAllCommand from "..";
import * as jsonModule from "../docs/json";
import * as htmlModule from "../docs/html";
import * as tabsModule from "../modules/tabs";
import * as bundleModule from "../modules/bundles";

import { testBuildCommand } from "./testingUtils";

jest.mock("../prebuild/tsc");
jest.mock("../prebuild/lint");
jest.mock("../docs/docsUtils");

jest.mock("esbuild", () => ({
	build: jest.fn()
		.mockResolvedValue({ outputFiles: [] })
}));

jest.spyOn(jsonModule, "buildJsons");
jest.spyOn(htmlModule, "buildHtml");
jest.spyOn(tabsModule, "bundleTabs");
jest.spyOn(bundleModule, "bundleBundles");

const asMock = <T extends (...any: any[]) => any>(func: T) => func as MockedFunction<typeof func>;
const runCommand = (...args: string[]) => getBuildAllCommand()
	.parseAsync(args, { from: "user" });

describe("test build all command", () => {
	testBuildCommand(
		"buildAll",
		getBuildAllCommand,
		[
			jsonModule.buildJsons,
			htmlModule.buildHtml,
			tabsModule.bundleTabs,
			bundleModule.bundleBundles
		]
	);

	it("should exit with code 1 if buildJsons returns with an error", async () => {
		asMock(jsonModule.buildJsons)
			.mockResolvedValueOnce({
				jsons: [{
					severity: "error",
					name: "test0",
					error: {}
				}]
			});
		try {
			await runCommand();
		} catch (error) {
			expect(error)
				.toEqual(new Error("process.exit called with 1"));
		}

		expect(process.exit)
			.toHaveBeenCalledWith(1);
	});

	it("should exit with code 1 if buildHtml returns with an error", async () => {
		asMock(htmlModule.buildHtml)
			.mockResolvedValueOnce({
				elapsed: 0,
				result: {
					severity: "error",
					error: {}
				}
			});

		try {
			await runCommand();
		} catch (error) {
			expect(error)
				.toEqual(new Error("process.exit called with 1"));
		}

		expect(process.exit)
			.toHaveBeenCalledWith(1);

		expect(htmlModule.buildHtml)
			.toHaveBeenCalledTimes(1);
	});
});
