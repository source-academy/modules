import React from 'react';
import { ScreenStateContext } from 'saar/libraries/screen_state_library/ScreenStateContext';
import { getModuleState } from '../../bundles/ar/AR';
import { StartButton } from './StartButton';

/**
 * Tab for viewing augmented reality content
 * @module ar
 * @author Chong Wen Hao
 */

/**
 * React Component props for the Tab.
 */
type Props = {};

/**
 * The main React Component of the Tab.
 */
class ARMainComponent extends React.Component<Props> {
  public render() {
    return (
      <div>
        <p>Instructions:</p>
        <p>Click on the toggle below to enter AR mode.</p>
        <ScreenStateContext>
          <StartButton {...getModuleState()} />
        </ScreenStateContext>
      </div>
    );
  }
}

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when the result in the REPL is "test".
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn: (_: any) => getModuleState() !== undefined,

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (_context: any) => <ARMainComponent />,

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'AR Tab',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'intelligence',
};
