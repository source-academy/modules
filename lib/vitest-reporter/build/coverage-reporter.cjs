"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/coverage-reporter.ts
var coverage_reporter_exports = {};
__export(coverage_reporter_exports, {
  default: () => GithubActionsCoverageReporter
});
module.exports = __toCommonJS(coverage_reporter_exports);
var import_fs = __toESM(require("fs"), 1);
var import_istanbul_lib_report = require("istanbul-lib-report");
function isFull(metrics) {
  return metrics.statements.pct === 100 && metrics.branches.pct === 100 && metrics.functions.pct === 100 && metrics.lines.pct === 100;
}
function getUncoveredLines(node) {
  if (node.isSummary()) {
    return [];
  }
  const metrics = node.getCoverageSummary(false);
  const isEmpty = metrics.isEmpty();
  const lines = isEmpty ? 0 : metrics.lines.pct;
  let coveredLines;
  const fileCoverage = node.getFileCoverage();
  if (lines === 100) {
    const branches = fileCoverage.getBranchCoverageByLine();
    coveredLines = Object.entries(branches).map(([key, { coverage }]) => [key, coverage === 100]);
  } else {
    coveredLines = Object.entries(fileCoverage.getLineCoverage());
  }
  let newRange = true;
  const ranges = coveredLines.reduce((acum, [line, hit]) => {
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
  }, []);
  return ranges;
}
var headers = ["Statements", "Branches", "Functions", "Lines"];
var GithubActionsCoverageReporter = class extends import_istanbul_lib_report.ReportBase {
  skipEmpty;
  skipFull;
  results = {};
  cw = null;
  watermarks = null;
  constructor(opts) {
    super(opts);
    this.skipEmpty = Boolean(opts.skipEmpty);
    this.skipFull = Boolean(opts.skipFull);
  }
  onStart(_node, context) {
    if (!process.env.GITHUB_STEP_SUMMARY) {
      console.log("Reporter not being executed in Github Actions environment");
      return;
    }
    this.cw = import_fs.default.createWriteStream(process.env.GITHUB_STEP_SUMMARY, { encoding: "utf-8", flags: "a" });
    this.watermarks = context.watermarks;
    this.cw.write("<h2>Test Coverage</h2>");
    this.cw.write("<table><thead><tr>");
    for (const heading of ["File", ...headers, "Uncovered Lines"]) {
      this.cw.write(`<th>${heading}</th>`);
    }
    this.cw.write("</tr></thead><tbody>");
  }
  onSummary(node) {
    const nodeName = node.getRelativeName() || "All Files";
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
      uncoveredLines: getUncoveredLines(node)
    };
  }
  onDetail(node) {
    return this.onSummary(node);
  }
  formatter(pct, watermark) {
    if (!this.watermarks || this.watermarks[watermark] === void 0) return `<td>${pct}%</td>`;
    const [low, high] = this.watermarks[watermark];
    if (pct < low) {
      return `<td><p style="color:red">${pct}%</p></td>`;
    }
    if (pct > high) {
      return `<td><p style="color:green">${pct}%</p></td>`;
    }
    return `<td><p style="color:yellow">${pct}%</p></td>`;
  }
  onEnd() {
    if (!this.cw) return;
    const fileNames = Object.keys(this.results).sort();
    for (const fileName of fileNames) {
      const metrics = this.results[fileName];
      this.cw.write(`<tr><td><code>${fileName}</code></td>`);
      this.cw.write(this.formatter(metrics.statements, "statements"));
      this.cw.write(this.formatter(metrics.branches, "branches"));
      this.cw.write(this.formatter(metrics.functions, "functions"));
      this.cw.write(this.formatter(metrics.lines, "lines"));
      if (metrics.uncoveredLines.length > 0) {
        this.cw.write("<td><details><summary>Expand</summary><ul>");
        for (const range of metrics.uncoveredLines) {
          if (range.length === 1) {
            this.cw.write(`<li>${range[0]}</li>`);
          } else {
            this.cw.write(`<li>${range[0]}-${range[1]}</li>`);
          }
        }
        this.cw.write("</ul></details></td>");
      } else {
        this.cw.write("<td></td>");
      }
      this.cw.write("</tr>");
    }
    this.cw.write("</tbody></table>");
    this.cw.close();
  }
};
