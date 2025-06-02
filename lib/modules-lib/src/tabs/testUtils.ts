import type { DebuggerContext } from '../types';

export const mockDebuggerContext = <T>(state: T, moduleName: string) => ({
  context: {
    moduleContexts: {
      [moduleName]: {
        state
      }
    }
  }
}) as DebuggerContext;
