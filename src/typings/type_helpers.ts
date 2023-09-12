import type { Context } from 'js-slang';

/**
 * DebuggerContext type used by frontend to assist typing information
 */
export type DebuggerContext = {
  result: any;
  lastDebuggerResult: any;
  code: string;
  context: Context;
  workspaceLocation?: any;
};

export type ModuleContexts = Context['moduleContexts'];

/**
 * Interface to represent objects that require a string representation in the
 * REPL
 */
export interface ReplResult {
  toReplString: () => string;
}

export type ModuleTab = React.FC<{ context: DebuggerContext }>;

export const getModuleState = <T>({ context: { moduleContexts } }: DebuggerContext, moduleName: string) => moduleContexts[moduleName].state as T;
