/* [Imports] */
import { Core } from '@sourceacademy/bundle-csg/core';
import { CsgModuleState } from '@sourceacademy/bundle-csg/utilities';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import CanvasHolder from './canvas_holder';

/* [Exports] */
export default defineTab({
  // Called by the frontend to decide whether to spawn the CSG tab
  toSpawn(debuggerContext) {
    const moduleState = getModuleState<CsgModuleState>(debuggerContext, 'csg');
    if (moduleState === null) return false;

    // toSpawn() is checked before the frontend calls body() if needed, so we
    // initialise Core for the first time over on the tabs' end here
    Core.initialize(moduleState);

    return Core.getRenderGroupManager()
      .shouldRender();
  },
  // Called by the frontend to know what to render in the CSG tab
  body() {
    return (
      <CanvasHolder
        componentNumber={Core.nextComponent()}
      />
    );
  },

  // BlueprintJS icon name
  iconName: 'shapes',

  // Icon tooltip in sidebar
  label: 'CSG Tab'
});
