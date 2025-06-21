import type { IconName } from '@blueprintjs/icons';
import type { DebuggerContext } from '../types';

export function getModuleState<T>({ context }: DebuggerContext, name: string): T {
  return context.moduleContexts[name].state;
}

/**
 * Helper for typing tabs
 */
export function defineTab(tab: {
  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: IconName
  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: string
  /**
   * This function will be called to determine if the component will be
   * rendered
   */
  toSpawn?: (context: DebuggerContext) => boolean
  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   */
  body: (context: DebuggerContext) => JSX.Element
}) {
  return tab;
}
