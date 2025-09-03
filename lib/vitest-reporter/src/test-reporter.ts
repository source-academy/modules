import fs from 'fs';
import pathlib from 'path';
import type { Reporter, RunnerTestFile, TestCase, TestModule, TestSuite, Vitest } from 'vitest/node';

function* formatTestCase(testCase: TestCase) {
  const passed = testCase.ok();
  const diagnostics = testCase.diagnostic();
  const durationStr = diagnostics ? `${diagnostics.duration.toFixed(0)}ms` : '';

  yield `${passed ? '✅' : '❌'} ${testCase.name} ${durationStr}\n`;
}

function* formatTestSuite(suite: TestSuite): Generator<string> {
  const suiteName = suite.name;
  const passed = suite.ok();

  yield `${passed ? '✅' : '❌'} ${suiteName}<ul>`;

  for (const child of suite.children) {
    if (child.type === 'suite') {
      yield* formatTestSuite(child);
    } else {
      yield '<li>';
      yield* formatTestCase(child);
      yield '</li>';
    }
  }

  yield '</ul>\n';
}

function formatRow(...items: string[]) {
  const tds = items.map(item => `<td>${item}</td>`);
  return `<tr>${tds.join('')}</tr>\n`;
}

function getTestCount(item: TestModule | TestSuite | TestCase): number {
  if (item.type === 'test') return 1;

  let output = 0;
  for (const child of item.children) {
    output += getTestCount(child);
  }

  return output;
}

export default class GithubActionsSummaryReporter implements Reporter {
  private writeStream: fs.WriteStream | null = null;
  private vitest: Vitest | null = null;

  onInit(vitest: Vitest) {
    this.vitest = vitest;

    if (process.env.GITHUB_STEP_SUMMARY) {
      this.writeStream = fs.createWriteStream(process.env.GITHUB_STEP_SUMMARY, { encoding: 'utf-8', flags: 'a' });
    }
  }

  onTestRunEnd(modules: readonly TestModule[]) {
    if (!this.writeStream) return;

    this.writeStream.write('## Test Results\n');
    for (const testModule of modules) {
      const passed = testModule.ok();
      // @ts-expect-error idk where else to get the file information from
      const file: RunnerTestFile = testModule.task;
      const relpath = pathlib.relative(testModule.project.config.root, file.filepath);
      const testCount = getTestCount(testModule);

      this.writeStream.write(`<h3>${passed ? '✅' : '❌'} <code>${relpath}</code> (${testCount} test${testCount === 1 ? '' : 's'})</h3>\n`);

      this.writeStream.write('<ul>');
      for (const child of testModule.children) {
        const formatter = child.type === 'suite' ? formatTestSuite(child) : formatTestCase(child);
        const line = Array.from(formatter).join('');
        this.writeStream.write(`<li>${line}</li>`);
      }
      this.writeStream.write('</ul>');

      const diagnostics = testModule.diagnostic();
      const totalDuration = diagnostics.duration.toFixed(0);

      this.writeStream.write('\n\n');
      this.writeStream.write(`<h4>Summary for <code>${file.filepath}</code></h4>\n`);
      this.writeStream.write('<table>\n');
      this.writeStream.write(formatRow('Test Files', ''));
      this.writeStream.write(formatRow('Tests', testCount.toString()));
      this.writeStream.write(formatRow('Start at', ''));
      this.writeStream.write(formatRow('Duration', `${totalDuration}ms`));
      this.writeStream.write('</table>');
    }

    this.writeStream.close();
  }
}
