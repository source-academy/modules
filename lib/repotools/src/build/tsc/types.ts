import type ts from 'typescript';
import type { Diagnostic, ResultType } from '../../types.js';

/**
 * Wrapper type around a {@link ts.Diagnostic | Diagnostic} to make it compatible with our
 * own diagnostic type
 */
export type TSDiagnostic = Diagnostic<ts.Diagnostic, ts.Diagnostic | { errors: any[] }, ts.Diagnostic>;

/**
 * Represnts the result of running an operation with the Typescript compiler
 */
export type FormattableTscResult<SuccessInfo extends object = object> = ResultType<TSDiagnostic, SuccessInfo, object, SuccessInfo>;
