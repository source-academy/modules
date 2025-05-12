import type { DebuggerContext } from '../types';

export function getModuleState<T>({ context }: DebuggerContext, name: string): T {
  return context.moduleContexts[name].state;
}
