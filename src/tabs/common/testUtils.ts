import type { DebuggerContext } from '../../typings/type_helpers';

export const mockDebuggerContext = <T>(state: T, moduleName: string) => ({
  context: {
    moduleContexts: {
      [moduleName]: {
        state,
      },
    },
  },
}) as DebuggerContext;
