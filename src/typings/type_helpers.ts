import { Context } from 'js-slang';

/**
 * DebuggerContext type used by frontend
 * to assist typing information
 */
export type DebuggerContext = {
  result: any;
  lastDebuggerResult: any;
  code: string;
  context: Context;
  workspaceLocation?: any;
};

/**
 * Interface to represent objects that require a
 * string representation in the REPL
 */
export interface ReplResult {
  toReplString: () => string;
}
