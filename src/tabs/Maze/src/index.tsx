import type { Maze as MazeState } from '@sourceacademy/bundle-maze/types';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import type { ModuleTab } from '@sourceacademy/modules-lib/types';
import MazeSimulation from './MazeSimulation';

/**
 * Renders the maze simulation in the assessment workspace
 * @author Koh Wai Kei
 * @author Justin Cheng
 */
const Maze: ModuleTab = ({ debuggerCtx }) => {
  const state = getModuleState<MazeState>(debuggerCtx, 'maze')!;
  return <MazeSimulation state={state} />;
};

export default defineTab({
  /**
   * This function will be called to determine if the component will be
   * rendered.
   */
  toSpawn: ctx => {
    const state = getModuleState<MazeState>(ctx, 'maze');
    return state !== null && state.isInit;
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   */
  body: debuggerCtx => <Maze debuggerCtx={debuggerCtx} />,

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Maze',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'layout-grid',
});
