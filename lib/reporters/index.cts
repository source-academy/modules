/**
 * For whatever reason, this reporter doesn't really work if its written in ESM,
 * so its written in and compiled to CJS
 *
 * Heavily based on the default text reporter
 */
import type * as corelib from '@actions/core';
import type { CoverageSummary } from 'istanbul-lib-coverage';
import type * as report from 'istanbul-lib-report';

const core: typeof corelib = require('@actions/core');

/**
 * Determines if the coverage summary has full coverage
 */
function isFull(metrics: CoverageSummary) {
  return (
    metrics.statements.pct === 100 &&
    metrics.branches.pct === 100 &&
    metrics.functions.pct === 100 &&
    metrics.lines.pct === 100
  );
}

/**
 * Determines the uncovered lines
 */
function nodeMissing(node: report.ReportNode) {
  if (node.isSummary()) {
    return '';
  }

  const metrics = node.getCoverageSummary(false);
  const isEmpty = metrics.isEmpty();
  const lines = isEmpty ? 0 : metrics.lines.pct;

  let coveredLines;

  const fileCoverage = node.getFileCoverage();
  if (lines === 100) {
    const branches = fileCoverage.getBranchCoverageByLine();
    coveredLines = Object.entries(branches).map(([key, { coverage }]) => [
      key,
      coverage === 100
    ]);
  } else {
    coveredLines = Object.entries(fileCoverage.getLineCoverage());
  }

  let newRange = true;
  const ranges = coveredLines
    .reduce((acum, [line, hit]) => {
      if (hit) newRange = true;
      else {
        line = parseInt(line);
        if (newRange) {
          acum.push([line]);
          newRange = false;
        } else acum[acum.length - 1][1] = line;
      }

      return acum;
    }, [])
    .map(range => {
      const { length } = range;

      if (length === 1) return range[0];

      return `${range[0]}-${range[1]}`;
    });

  return [].concat(...ranges).join(',');
}

const { ReportBase }: typeof report = require('istanbul-lib-report');

const headers = ['Statements', 'Branches', 'Functions', 'Lines']

module.exports = class GithubActionsReporter extends ReportBase {
  private readonly skipEmpty: boolean;
  private readonly skipFull: boolean;

  constructor(opts: any) {
    super(opts);

    this.skipEmpty = Boolean(opts.skipEmpty);
    this.skipFull = Boolean(opts.skipFull);
  }

  onStart() {
    if (!core) {
      console.log('@actions/core could not be found in the environment!');
      return;
    }

    core.summary.addRaw('<table>');
    core.summary.addRaw('<thead><tr>');
    for (const heading of ['File', ...headers, 'Uncovered Lines']) {
      core.summary.addRaw(`<th>${heading}</th>`);
    }
    core.summary.addRaw('</tr></thead><tbody>');
  }

  onSummary(node: report.ReportNode) {
    if (!core) return;

    const nodeName = node.getRelativeName() ?? 'All Files';
    const rawMetrics = node.getCoverageSummary(false);
    const isEmpty = rawMetrics.isEmpty();

    if (this.skipEmpty && isEmpty) {
      return;
    }
    if (this.skipFull && isFull(rawMetrics)) {
      return;
    }

    const metrics = {
      statements: isEmpty ? 0 : rawMetrics.statements.pct,
      branches: isEmpty ? 0 : rawMetrics.branches.pct,
      functions: isEmpty ? 0 : rawMetrics.functions.pct,
      lines: isEmpty ? 0 : rawMetrics.lines.pct
    };

    core.summary.addRaw('<tr>');
    core.summary.addRaw(`<td>${nodeName}</td>`);
    for (const value of Object.values(metrics)) {
      core.summary.addRaw(`<td>${value}%</td>`);
    }

    core.summary.addRaw(`<td>${nodeMissing(node)}</td>`)
    core.summary.addRaw('</tr>');
  }

  onDetail(node: report.ReportNode) {
    return this.onSummary(node);
  }

  onEnd() {
    core?.summary.addRaw('</tbody></table>');
    core?.summary.write();
  }
}
