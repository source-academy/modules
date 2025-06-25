/* [Imports] */
import { IconNames } from '@blueprintjs/icons';
import { Core } from '@sourceacademy/bundle-csg/core';
import type { CsgModuleState } from '@sourceacademy/bundle-csg/utilities';
import { defineTab } from '@sourceacademy/modules-lib/tabs';
import type { DebuggerContext } from '@sourceacademy/modules-lib/types';
import type { ReactElement } from 'react';
import CanvasHolder from './canvas_holder';

/* [Exports] */
export default defineTab({
  // Called by the frontend to decide whether to spawn the CSG tab
  toSpawn(debuggerContext: DebuggerContext): boolean {
    const moduleState: CsgModuleState = debuggerContext.context.moduleContexts.csg.state;
    // toSpawn() is checked before the frontend calls body() if needed, so we
    // initialise Core for the first time over on the tabs' end here
    Core.initialize(moduleState);

    return Core.getRenderGroupManager()
      .shouldRender();
  },
  // Called by the frontend to know what to render in the CSG tab
  body(_debuggerContext: DebuggerContext): ReactElement {
    return (
      <CanvasHolder
        componentNumber={Core.nextComponent()}
      />
    );
  },

  // BlueprintJS icon name
  iconName: IconNames.SHAPES,

  // Icon tooltip in sidebar
  label: 'CSG Tab'
});
