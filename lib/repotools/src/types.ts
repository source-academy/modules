export const severity = {
  ERROR: 'error',
  WARN: 'warn',
  SUCCESS: 'success'
} as const;

interface DefaultErrorInfo<TError = any> {
  error: TError;
};

export type Severity = (typeof severity)[keyof typeof severity];

export type BaseDiagnostic<T extends Severity, Info extends object = object> = {
  severity: T;
} & Info;

export type ErrorDiagnostic<Info extends object = DefaultErrorInfo> = BaseDiagnostic<'error', Info>;
export type WarnDiagnostic<Info extends object = object> = BaseDiagnostic<'warn', Info>;
export type SuccessDiagnostic<Info extends object = object> = BaseDiagnostic<'success', Info>;

export type DiagnosticWithoutWarn<
  SuccessInfo extends object = object,
  ErrorInfo extends object = DefaultErrorInfo
> = ErrorDiagnostic<ErrorInfo> | SuccessDiagnostic<SuccessInfo>;

export type Diagnostic<
  SuccessInfo extends object = object,
  ErrorInfo extends object = DefaultErrorInfo,
  WarnInfo extends object = object,
> = DiagnosticWithoutWarn<SuccessInfo, ErrorInfo> | WarnDiagnostic<WarnInfo>;

export type ExtractDiagnosticSeverity<T extends Severity, U extends Diagnostic<any, any, any>> =
  T extends 'success'
  ? Extract<U, { severity: 'success' }>
  : T extends 'warn'
  ? Extract<U, { severity: 'success' | 'warn' }>
  : T extends 'error'
  ? Extract<U, { severity: 'error' | 'success' | 'warn' }>
  : never;

export type ResultTypeWithoutWarn<
  T extends (SuccessDiagnostic<any> | ErrorDiagnostic<any>),
  SuccInfo extends object = object,
  ErrInfo extends object = object
> = ({
  severity: 'error';
  diagnostics: ExtractDiagnosticSeverity<'error', T>[];
} & ErrInfo) | ({
  severity: 'success';
  // diagnostics: ExtractDiagnosticSeverity<'success', T>;
} & SuccInfo);

export type ResultType<
  T extends Diagnostic<any, any, any> = Diagnostic,
  SuccInfo extends object = object,
  ErrInfo extends object = object,
  WarnInfo extends object = object
> = (SuccInfo & {
  severity: 'success';
}) | (WarnInfo & {
  severity: 'warn';
  diagnostics: ExtractDiagnosticSeverity<'warn', T>[];
}) | (ErrInfo & {
  severity: 'error';
  diagnostics: ExtractDiagnosticSeverity<'error', T>[];
});

/**
 * Represents the result of building either a tab or a bundle
 */
export type BuildDiagnostic = DiagnosticWithoutWarn<{ outpath: string }> & { input: InputAsset };

/**
 * Represnts the overall results of building either a tab or a bundle
 */
export type BuildResult = ResultTypeWithoutWarn<BuildDiagnostic>;

/**
 * Represnts the result of building JSON documentation
 */
export type JsonDiagnostic = Diagnostic<object, DefaultErrorInfo, { warning: string }>;

export type JsonResult = ResultType<JsonDiagnostic, { outpath: string }, object, { outpath: string }>;

/**
 * A bundle manifest, including the `version` field from `package.json`
 */
export interface BundleManifest {
  requires?: number;
  version?: string;
  tabs?: string[];
}

/**
 * The combined modules manifest. Keys are bundle names and values are their
 * corresponding {@link BundleManifest}.
 */
export interface ModulesManifest {
  [name: string]: BundleManifest;
};

// #region ResolvedBundle
/**
 * Represents all the information about a bundle.
 */
export interface ResolvedBundle {
  type: 'bundle';
  /**
   * The name of this bundle
   */
  name: string;

  /**
   * The {@link BundleManifest} corresponding to this bundle
   */
  manifest: BundleManifest;

  /**
   * The path to the directory that contains the bundle
   */
  directory: string;
}
// #endregion ResolvedBundle

// #region ResolvedTab
/**
 * Represents all the information about a tab
 */
export interface ResolvedTab {
  type: 'tab';

  /**
   * The path to the directory that contains the tab
   */
  directory: string;

  /**
   * The path to the entry point file of the tab. This is either a `index.tsx` or `src/index.tsx`
   * file that is located in the tab's directory.
   */
  entryPoint: string;

  /**
   * Name of the tab
   */
  name: string;
}
// #endregion ResolvedTab

export type InputAsset = ResolvedBundle | ResolvedTab;
