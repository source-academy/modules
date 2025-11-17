import type { BuildAllResult } from './all.js';
import type { JsonResult } from '../types.js';
import type { BuildHtmlResult } from './docs/index.js';
import type { BuildManifestResult } from './modules/manifest.js';

// Bundles, tabs exports
export { buildBundle, buildTab } from './modules/index.js';
export { buildManifest } from './modules/manifest.js';
export type { BuildManifestResult };

// Documentation exports
export { buildHtml, buildSingleBundleDocs } from './docs/index.js';
export type { BuildHtmlResult };

export { buildJson } from './docs/json.js';
export type { JsonResult };

// Typescript Exports
export {
  convertTsDiagnostic,
  getDiagnosticSeverity,
  getTsconfig,
  runTscCompile,
  runTscCompileFromTsconfig,
  runTypechecking,
  runTypecheckingFromTsconfig,
  type FormattableTscResult
} from './tsc/index.js';

export { buildAll } from './all.js';
export type { BuildAllResult };

export type OverallResultType =
  | BuildAllResult
  | BuildHtmlResult
  | BuildManifestResult
  | JsonResult;
