// src/test-reporter.ts
import fs from "fs";
import { BasicReporter } from "vitest/reporters";
function* formatTestCase(testCase, prefixes) {
  const passed = testCase.ok();
  const diagnostics = testCase.diagnostic();
  const durationStr = diagnostics ? `${diagnostics.duration}ms` : "";
  if (prefixes.length > 0) {
    yield `- ${passed ? "\u2705" : "\u274C"} ${prefixes.join(" > ")} > ${testCase.name} ${durationStr}`;
  } else {
    yield `- ${passed ? "\u2705" : "\u274C"} ${testCase.name} ${durationStr}`;
  }
}
function* formatTestSuite(suite, prefixes) {
  const suiteName = suite.name;
  for (const child of suite.children) {
    if (child.type === "suite") {
      yield* formatTestSuite(child, [...prefixes, suiteName]);
    } else {
      yield* formatTestCase(child, [...prefixes, suiteName]);
    }
  }
}
function getTestCount(item) {
  if (item.type === "test") return 1;
  let output = 0;
  for (const child of item.children) {
    output += getTestCount(child);
  }
  return output;
}
var GithubActionsSummaryReporter = class extends BasicReporter {
  writeStream = null;
  vitest = null;
  onInit(vitest) {
    this.vitest = vitest;
    if (process.env.GITHUB_STEP_SUMMARY) {
      this.writeStream = fs.createWriteStream(process.env.GITHUB_STEP_SUMMARY, { encoding: "utf-8", flags: "a" });
    }
  }
  onTestRunEnd(files) {
    if (!this.writeStream) return;
    this.writeStream.write("<h3>Test Results</h3>");
    for (const file of files) {
      const testModule = this.vitest.state.getReportedEntity(file);
      if (testModule === void 0) continue;
      const passed = testModule.ok();
      const testCount = getTestCount(testModule);
      this.writeStream.write(`${passed ? "\u2705" : "\u274C"} \`${file.filepath}\` (${testCount} test${testCount === 1 ? "" : "s"}) 
`);
      for (const child of testModule.children) {
        const formatter = child.type === "suite" ? formatTestSuite(child, []) : formatTestCase(child, []);
        const line = Array.from(formatter).join("");
        this.writeStream.write(line);
      }
    }
    this.writeStream.close();
  }
};
export {
  GithubActionsSummaryReporter as default
};
