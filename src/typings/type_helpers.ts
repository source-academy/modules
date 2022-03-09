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

export interface ReplResult {
  toReplString: () => string;
}
