import fs from 'fs';
import type { RunnerTestFile, TestCase, TestModule, TestSuite, Vitest } from 'vitest/node';
import { BasicReporter } from 'vitest/reporters';

function* formatTestCase(testCase: TestCase, prefixes: string[]) {
  const passed = testCase.ok();
  const diagnostics = testCase.diagnostic();
  const durationStr = diagnostics ? `${diagnostics.duration}ms` : '';

  if (prefixes.length > 0) {
    yield `- ${passed ? '✅' : '❌'} ${prefixes.join(' > ')} > ${testCase.name} ${durationStr}`;
  } else {
    yield `- ${passed ? '✅' : '❌'} ${testCase.name} ${durationStr}`;
  }
}

function* formatTestSuite(suite: TestSuite, prefixes: string[]): Generator<string> {
  const suiteName = suite.name;

  for (const child of suite.children) {
    if (child.type === 'suite') {
      yield* formatTestSuite(child, [...prefixes, suiteName]);
    } else {
      yield* formatTestCase(child, [...prefixes, suiteName]);
    }
  }
}

function getTestCount(item: TestModule | TestSuite | TestCase): number {
  if (item.type === 'test') return 1;

  let output = 0;
  for (const child of item.children) {
    output += getTestCount(child);
  }

  return output;
}

export default class GithubActionsSummaryReporter extends BasicReporter {
  private writeStream: fs.WriteStream | null = null;
  private vitest: Vitest | null = null;

  onInit(vitest: Vitest) {
    this.vitest = vitest;

    if (process.env.GITHUB_STEP_SUMMARY) {
      this.writeStream = fs.createWriteStream(process.env.GITHUB_STEP_SUMMARY, { encoding: 'utf-8', flags: 'a' });
    }
  }

  onTestRunEnd(files: RunnerTestFile[]) {
    if (!this.writeStream) return;

    this.writeStream.write('<h3>Test Results</h3>');
    for (const file of files) {
      const testModule = this.vitest!.state.getReportedEntity(file) as TestModule;
      const passed = testModule.ok();
      const testCount = getTestCount(testModule);

      this.writeStream.write(`${passed ? '✅' : '❌'} \`${file.filepath}\` (${testCount} test${testCount === 1 ? '' : 's'}) \n`);

      for (const child of testModule.children) {
        const formatter = child.type === 'suite' ? formatTestSuite(child, []) : formatTestCase(child, []);
        const line = Array.from(formatter).join('');
        this.writeStream.write(line);
      }
    }

    this.writeStream.close();
  }
}
