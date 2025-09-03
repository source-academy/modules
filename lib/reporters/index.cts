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
    .map(range => {
      const { length } = range;
      if (length === 1) return range[0];
      return `${range[0]}-${range[1]}`;
    });

  return ranges.join(',');
}

const { ReportBase }: typeof report = require('istanbul-lib-report');

const headers = ['Statements', 'Branches', 'Functions', 'Lines']

type ResultObject = {
  branches: number
  functions: number
  lines: number
  statements: number
  uncoveredLines: string
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
    core.summary.addHeading('Test Coverage', 3);
    core.summary.addRaw('<table>');
    core.summary.addRaw('<thead><tr>');
    for (const heading of ['File', ...headers, 'Uncovered Lines']) {
      core.summary.addRaw(`<th>${heading}</th>`);
    }
    core.summary.addRaw('</tr></thead><tbody>');
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
      uncoveredLines: nodeMissing(node),
    }
  }

  onDetail(node: report.ReportNode, context: report.Context) {
    return this.onSummary(node, context);
  }

  private colorizer(value: number, watermark: keyof report.Watermarks) {
    if (!this.watermarks) return `<td>${value}</td>`
    const [low, high] = this.watermarks[watermark];

    if (value < low) {
      return `<td><p style="color:red">${value}</p></td>`
    }

    if (value > high) {
      return `<td><p style="color:green">${value}</p></td>`
    }

    return `<td><p style="color:yellow">${value}</p></td>`
  }

  onEnd() {
    const fileNames = Object.keys(this.results).sort();

    for (const fileName of fileNames) {
      const metrics = this.results[fileName];
      core.summary.addRaw('<tr>');
      core.summary.addRaw(`<td><code>${fileName}</code></td>`);
      core.summary.addRaw(this.colorizer(metrics.statements, 'statements'));
      core.summary.addRaw(this.colorizer(metrics.branches, 'branches'));
      core.summary.addRaw(this.colorizer(metrics.functions, 'functions'));
      core.summary.addRaw(this.colorizer(metrics.lines, 'lines'));
      core.summary.addRaw(`<td>${metrics.uncoveredLines}</td>`);
      core.summary.addRaw('</tr>');
    }

    core.summary.addRaw('</tbody></table>');
    core.summary.write();
  }
}
