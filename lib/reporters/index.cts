/**
 * For whatever reason, this reporter doesn't really work if its written in ESM,
 * so its written in and compiled to CJS
 * 
 * Heavily based on the default text reporter
 */
import type { CoverageSummary } from 'istanbul-lib-coverage';
import type { ReportNode } from 'istanbul-lib-report';

function loadCore() {
  try {
    return require('@actions/core');
  } catch {
    return undefined;
  }
}

const core = loadCore();

function isFull(metrics: CoverageSummary) {
  return (
    metrics.statements.pct === 100 &&
    metrics.branches.pct === 100 &&
    metrics.functions.pct === 100 &&
    metrics.lines.pct === 100
  );
}

const { ReportBase } = require('istanbul-lib-report');

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

    core.summary.addHeading('Test Coverage');
    core.summary.addRaw('<table>');
    core.summary.addRaw('<thead><tr>');
    for (const heading of [
      'file',
      'statements',
      'branches',
      'functions',
      'lines'
    ]) {
      core.summary.addRaw(`<th>${heading}</th>`);
    }
    core.summary.addRaw('</tr></thead><tbody>');
  }

  onSummary(node: ReportNode) {
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

    core.summary.addRaw('</tr>');
  }

  onEnd() {
    core?.summary.addRaw('</tbody></table>');
    core?.summary.write();
  }
}
