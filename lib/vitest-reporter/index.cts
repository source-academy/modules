/**
 * For whatever reason, this reporter doesn't really work if its written in ESM,
 * so its written in and compiled to CJS
 *
 * Heavily based on the default text reporter
 */
import type { CoverageSummary } from 'istanbul-lib-coverage';
import type * as report from 'istanbul-lib-report';

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
    if (hit) {
      newRange = true;
    } else {
      const linenum = parseInt(line);
      if (newRange) {
        acum.push([linenum]);
        newRange = false;
      } else {
        acum[acum.length - 1][1] = linenum;
      }
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

module.exports = class GithubActionsCoverageReporter extends ReportBase {
  private readonly skipEmpty: boolean;
  private readonly skipFull: boolean;
  private readonly results: Record<string, ResultObject> = {};
  private cw: report.ContentWriter | null = null;
  private watermarks: report.Watermarks | null;

  constructor(opts: any) {
    super(opts);

    this.skipEmpty = Boolean(opts.skipEmpty);
    this.skipFull = Boolean(opts.skipFull);
    this.watermarks = null;
  }

  onStart(_node: any, context: report.Context) {
    if (!process.env.GITHUB_STEP_SUMMARY) {
      console.log('Reporter not being executed in Github Actions environment')
      return;
    }

    this.cw = context.writer.writeFile(process.env.GITHUB_STEP_SUMMARY);

    this.watermarks = context.watermarks;
    this.cw.println('<h3>Test Coverage</h3>')
    this.cw.println('<table><thead><tr>');
    for (const heading of ['File', ...headers, 'Uncovered Lines']) {
      this.cw.println(`<th>${heading}</th>`);
    }
    this.cw.println('</tr></thead><tbody>');
  }

  onSummary(node: report.ReportNode) {
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

  onDetail(node: report.ReportNode) {
    return this.onSummary(node);
  }

  private formatter(pct: number, watermark: keyof report.Watermarks) {
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
    if (!this.cw) return;

    const fileNames = Object.keys(this.results).sort();

    for (const fileName of fileNames) {
      const metrics = this.results[fileName];
      this.cw.println(`<tr><td><code>${fileName}</code></td>`);
      this.cw.println(this.formatter(metrics.statements, 'statements'));
      this.cw.println(this.formatter(metrics.branches, 'branches'));
      this.cw.println(this.formatter(metrics.functions, 'functions'));
      this.cw.println(this.formatter(metrics.lines, 'lines'));

      if (metrics.uncoveredLines.length > 0) {
        this.cw.println('<td><details><summary>Expand</summary><ul>');
        for (const range of metrics.uncoveredLines) {
          if (range.length === 1) {
            this.cw.println(`<li>${range[0]}</li>`)
          } else {
            this.cw.println(`<li>${range[0]}-${range[1]}</li>`)
          }
        }
        this.cw.println('</ul></details></td>');
      } else {
        this.cw.println('<td></td>');
      }

      this.cw.println('</tr>');
    }

    this.cw.println('</tbody></table>');
    this.cw.close();
  }
}
