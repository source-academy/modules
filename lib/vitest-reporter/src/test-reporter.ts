import fs from 'fs';
import pathlib from 'path';
import type { Reporter, RunnerTestFile, TestCase, TestModule, TestSuite } from 'vitest/node';

function getIcon(passed: boolean) {
  return passed ? '✅' : '❌';
}

function* formatTestCase(testCase: TestCase) {
  const passed = testCase.ok();
  const diagnostics = testCase.diagnostic();
  const durationStr = diagnostics && testCase.result().state !== 'skipped'
    ? ` <code>${diagnostics.duration.toFixed(0)}ms</code>`
    : '';

  yield `${getIcon(passed)} ${testCase.name}${durationStr}`;

  if (diagnostics?.slow) {
    yield ' ⚠️';
  }

  yield '\n';
}

function* formatTestSuite(suite: TestSuite): Generator<string> {
  const suiteName = suite.name;
  const passed = suite.ok();

  yield `${getIcon(passed)} ${suiteName}<ul>`;

  for (const child of suite.children) {
    if (child.type === 'suite') {
      yield* formatTestSuite(child);
    } else {
      yield '<li>';
      yield* formatTestCase(child);
      yield '</li>\n';
    }
  }

  yield '</ul>\n';
}

function formatRow(...items: string[]) {
  const tds = items.map(item => `<td>${item}</td>`);
  return `<tr>${tds.join('')}</tr>\n`;
}

interface TestCount {
  failed: number;
  passed: number;
  skipped: number;
}

function getTestCount(item: TestModule | TestSuite | TestCase): TestCount {
  if (item.type === 'test') {
    switch (item.result().state) {
      case 'failed':
        return { failed: 1, passed: 0, skipped: 0 };
      case 'passed':
        return { failed: 0, passed: 1, skipped: 0 };
      case 'skipped':
        return { failed: 0, passed: 0, skipped: 1 };
      default:
        throw new Error('Should not get here');
    }
  }

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const child of item.children) {
    const {
      failed: failCount,
      passed: passCount,
      skipped: skipCount
    } = getTestCount(child);

    passed += passCount;
    failed += failCount;
    skipped += skipCount;
  }

  return { failed, passed, skipped };
}

/**
 * A Vitest reporter that writes results to the Github Actions summary
 */
export default class GithubActionsSummaryReporter implements Reporter {
  private writeStream: fs.WriteStream | null = null;
  private startTimes: Record<string, Date> = {};

  onInit() {
    if (process.env.GITHUB_STEP_SUMMARY) {
      this.writeStream = fs.createWriteStream(process.env.GITHUB_STEP_SUMMARY, { encoding: 'utf-8', flags: 'a' });
    }
  }

  onTestModuleStart(module: TestModule) {
    this.startTimes[module.id] = new Date();
  }

  onTestRunEnd(modules: readonly TestModule[]) {
    if (!this.writeStream) return;

    this.writeStream.write('<h2>Test Results</h2>\n');
    for (const testModule of modules) {
      const passed = testModule.ok();
      // @ts-expect-error idk where else to get the file information from
      const file: RunnerTestFile = testModule.task;
      const relpath = pathlib.relative(testModule.project.config.root, file.filepath);
      const {
        failed: failCount,
        passed: passCount,
        skipped: skipCount
      } = getTestCount(testModule);
      const testCount = passCount + failCount + skipCount;

      this.writeStream.write(`<h3>${getIcon(passed)} <code>${relpath}</code> (${testCount} test${testCount === 1 ? '' : 's'})</h3>\n`);

      this.writeStream.write('<ul>');
      for (const child of testModule.children) {
        const formatter = child.type === 'suite' ? formatTestSuite(child) : formatTestCase(child);
        const line = Array.from(formatter).join('');
        this.writeStream.write(`<li>${line}</li>\n`);
      }
      this.writeStream.write('</ul>');

      const diagnostics = testModule.diagnostic();
      const totalDuration = diagnostics.duration.toFixed(0);

      const startTime = this.startTimes[testModule.id];
      const hours = startTime.getHours().toString().padStart(2, '0');
      const minutes = startTime.getMinutes().toString().padStart(2, '0');
      const seconds = startTime.getSeconds().toString().padStart(2, '0');

      this.writeStream.write('\n\n');
      this.writeStream.write(`<h4>Summary for <code>${relpath}</code></h4>\n`);
      this.writeStream.write('<table>\n');

      function* formatSummary() {
        if (failCount > 0) {
          yield `${failCount} Failed`;
        }

        if (skipCount > 0) {
          yield `${skipCount} Skipped`;
        }

        yield `${passCount} Passed`;
      }

      this.writeStream.write(formatRow('Tests', Array.from(formatSummary()).join(' | ')));
      this.writeStream.write(formatRow('Start at', `${hours}:${minutes}:${seconds}`));
      this.writeStream.write(formatRow('Duration', `${totalDuration}ms`));
      this.writeStream.write('</table>');
    }

    this.writeStream.close();
  }
}
