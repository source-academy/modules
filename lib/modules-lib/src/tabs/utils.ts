import type { DebuggerContext, ModuleSideContent } from '../types';

/**
 * Helper function for extracting the state object for your bundle.
 * If the your bundle state cannot be found or is still uninitialized, then it will return `null`.
 *
 * @category Utilities
 * @template T The type of your bundle's state object
 * @param debuggerContext DebuggerContext as returned by the frontend
 * @param name Name of your bundle
 * @returns The state object of your bundle
 */
export function getModuleState<T>(debuggerContext: DebuggerContext, name: string): T | null {
  const { context: { moduleContexts } } = debuggerContext;
  return name in moduleContexts ? moduleContexts[name].state : null;
}

/**
 * Helper for typing tabs
 * @category Utilities
 */
export function defineTab<T extends ModuleSideContent>(tab: T) {
  return tab;
}
