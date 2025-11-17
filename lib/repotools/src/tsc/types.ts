import type ts from 'typescript';

export type FormattableTscResult<TSuccess extends object = object> = {
  severity: 'error';
  errors: any[];
} | {
  severity: 'error';
  results: ts.Diagnostic[];
} | ({
  severity: 'success' | 'warn';
  results: ts.Diagnostic[];
} & TSuccess);
