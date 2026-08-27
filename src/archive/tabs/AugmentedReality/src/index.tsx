import { IconNames } from '@blueprintjs/icons';
import { getModuleState } from '@sourceacademy/bundle-ar/AR';
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
import { ScreenStateContext } from 'saar/libraries/screen_state_library/ScreenStateContext';
import { StartButton } from './StartButton';

/**
 * Tab for viewing augmented reality content
 * @module ar
 * @author Chong Wen Hao
 */

/**
 * The main React Component of the Tab.
 */
function ARMainComponent() {
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

export default defineTab({
  toSpawn: () => getModuleState() !== undefined,
  body: () => <ARMainComponent />,
  label: 'AR Tab',
  iconName: IconNames.Intelligence
});
