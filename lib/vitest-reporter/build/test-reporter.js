// src/test-reporter.ts
import fs from 'fs';

function* formatTestCase(testCase) {
  const passed = testCase.ok();
  const diagnostics = testCase.diagnostic();
  const durationStr = diagnostics ? `${diagnostics.duration.toFixed(0)}ms` : '';
  yield `${passed ? '\u2705' : '\u274C'} ${testCase.name} ${durationStr}
`;
}
function* formatTestSuite(suite) {
  const suiteName = suite.name;
  const passed = suite.ok();
  yield `${passed ? '\u2705' : '\u274C'} ${suiteName}<ul>`;
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
function getTestCount(item) {
  if (item.type === 'test') return 1;
  let output = 0;
  for (const child of item.children) {
    output += getTestCount(child);
  }
  return output;
}
var GithubActionsSummaryReporter = class {
  writeStream = null;
  vitest = null;
  onInit(vitest) {
    this.vitest = vitest;
    if (process.env.GITHUB_STEP_SUMMARY) {
      this.writeStream = fs.createWriteStream(process.env.GITHUB_STEP_SUMMARY, { encoding: 'utf-8', flags: 'a' });
    }
  }
  onTestRunEnd(modules) {
    if (!this.writeStream) return;
    this.writeStream.write('## Test Results\n');
    for (const testModule of modules) {
      const formatRow2 = function(...items) {
        const tds = items.map((item) => `<td>${item}</td>`);
        return `<tr>${tds.join('')}</tr>
`;
      };
      var formatRow = formatRow2;
      const passed = testModule.ok();
      const testCount = getTestCount(testModule);
      this.writeStream.write(`${passed ? '\u2705' : '\u274C'} (fileName) (${testCount} test${testCount === 1 ? '' : 's'}) 
`);
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
      this.writeStream.write('#### Summary\n');
      this.writeStream.write('<table>');
      this.writeStream.write(formatRow2('Test Files', ''));
      this.writeStream.write(formatRow2('Tests', testCount.toString()));
      this.writeStream.write(formatRow2('Start at', ''));
      this.writeStream.write(formatRow2('Duration', `${totalDuration}ms`));
      this.writeStream.write('</table>');
    }
    this.writeStream.close();
  }
};
export {
  GithubActionsSummaryReporter as default
};
