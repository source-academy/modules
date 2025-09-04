import type { DebuggerContext, ModuleSideContent } from '../types';

/**
 * Helper function for extracting the state object for your bundle
 * @template T The type of your bundle's state object
 * @param debuggerContext DebuggerContext as returned by the frontend
 * @param name Name of your bundle
 * @returns The state object of your bundle
 */
export function getModuleState<T>(debuggerContext: DebuggerContext, name: string): T {
  return debuggerContext.context.moduleContexts[name].state;
}

/**
 * Helper for typing tabs
 */
export function defineTab<T extends ModuleSideContent>(tab: T) {
  return tab;
}
