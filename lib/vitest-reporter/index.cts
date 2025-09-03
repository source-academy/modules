/**
 * For whatever reason, this reporter doesn't really work if its written in ESM,
 * so its written in and compiled to CJS
 *
 * Heavily based on the default text reporter
 */
import type * as corelib from '@actions/core';
import type { CoverageSummary } from 'istanbul-lib-coverage';
import type * as report from 'istanbul-lib-report';

const { summary }: typeof corelib = require('@actions/core');
const { ReportBase }: typeof report = require('istanbul-lib-report');

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
function getUncoveredLines(node: report.ReportNode) {
  if (node.isSummary()) {
    return [];
  }

  const metrics = node.getCoverageSummary(false);
  const isEmpty = metrics.isEmpty();
  const lines = isEmpty ? 0 : metrics.lines.pct;

  let coveredLines: [string, boolean | number][];

  const fileCoverage = node.getFileCoverage();
  if (lines === 100) {
    const branches = fileCoverage.getBranchCoverageByLine();
    coveredLines = Object.entries(branches)
      .map(([key, { coverage }]) => [key, coverage === 100] as [string, boolean]);
  } else {
    coveredLines = Object.entries(fileCoverage.getLineCoverage());
  }

  let newRange = true;
  const ranges = coveredLines
    .reduce<([number] | [number, number])[]>((acum, [line, hit]) => {
    if (hit) newRange = true;
    else {
      const linenum = parseInt(line);
      if (newRange) {
        acum.push([linenum]);
        newRange = false;
      } else acum[acum.length - 1][1] = linenum;
    }

    return acum;
  }, [])

  return ranges
}

const headers = ['Statements', 'Branches', 'Functions', 'Lines']

interface ResultObject {
  branches: number
  functions: number
  lines: number
  statements: number
  uncoveredLines: ([number] | [number, number])[]
}

module.exports = class GithubActionsReporter extends ReportBase {
  private readonly skipEmpty: boolean;
  private readonly skipFull: boolean;
  private readonly results: Record<string, ResultObject> = {};
  private watermarks: report.Watermarks | null;

  constructor(opts: any) {
    super(opts);

    this.skipEmpty = Boolean(opts.skipEmpty);
    this.skipFull = Boolean(opts.skipFull);
    this.watermarks = null;
  }

  onStart() {
    summary.addHeading('Test Coverage', 3);
    summary.addRaw('<table>');
    summary.addRaw('<thead><tr>');
    for (const heading of ['File', ...headers, 'Uncovered Lines']) {
      summary.addRaw(`<th>${heading}</th>`);
    }
    summary.addRaw('</tr></thead><tbody>');
  }

  onSummary(node: report.ReportNode, context: report.Context) {
    this.watermarks = context.watermarks;

    const nodeName = node.getRelativeName() || 'All Files';
    const rawMetrics = node.getCoverageSummary(false);
    const isEmpty = rawMetrics.isEmpty();

    if (this.skipEmpty && isEmpty) {
      return;
    }
    if (this.skipFull && isFull(rawMetrics)) {
      return;
    }

    this.results[nodeName] = {
      statements: isEmpty ? 0 : rawMetrics.statements.pct,
      branches: isEmpty ? 0 : rawMetrics.branches.pct,
      functions: isEmpty ? 0 : rawMetrics.functions.pct,
      lines: isEmpty ? 0 : rawMetrics.lines.pct,
      uncoveredLines: getUncoveredLines(node),
    }
  }

  onDetail(node: report.ReportNode, context: report.Context) {
    return this.onSummary(node, context);
  }

  private colorizer(pct: number, watermark: keyof report.Watermarks) {
    if (!this.watermarks) return `<td>${pct}%</td>`
    const [low, high] = this.watermarks[watermark];

    if (pct < low) {
      return `<td><p style="color:red">${pct}%</p></td>`
    }

    if (pct > high) {
      return `<td><p style="color:green">${pct}%</p></td>`
    }

    return `<td><p style="color:yellow">${pct}%</p></td>`
  }

  onEnd() {
    const fileNames = Object.keys(this.results).sort();

    for (const fileName of fileNames) {
      const metrics = this.results[fileName];
      summary.addRaw('<tr>');
      summary.addRaw(`<td><code>${fileName}</code></td>`);
      summary.addRaw(this.colorizer(metrics.statements, 'statements'));
      summary.addRaw(this.colorizer(metrics.branches, 'branches'));
      summary.addRaw(this.colorizer(metrics.functions, 'functions'));
      summary.addRaw(this.colorizer(metrics.lines, 'lines'));

      if (metrics.uncoveredLines.length > 0) {
        summary.addRaw('<td><details><summary>Expand</summary><ul>');
        for (const range of metrics.uncoveredLines) {
          const { length } = range;
          if (length === 1) {
            summary.addRaw(`<li>${range[0]}</li>`)
          } else {
            summary.addRaw(`<li>${range[0]}-${range[1]}</li>`)
          }
        }
        summary.addRaw('</ul></details></td>');
      } else {
        summary.addRaw('<td></td>');
      }

      summary.addRaw('</tr>');
    }

    summary.addRaw('</tbody></table>');
    summary.write();
  }
}
