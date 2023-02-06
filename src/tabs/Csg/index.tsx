/* [Imports] */
import React, { type ReactElement } from 'react';
import { IconNames } from '@blueprintjs/icons';
import { Core } from '../../bundles/csg/core.js';
import {
  type CsgModuleState,
} from '../../bundles/csg/utilities.js';
import { type DebuggerContext } from '../../typings/type_helpers';
import CanvasHolder from './canvas_holder';



/* [Exports] */
export default {
  // Called by the frontend to decide whether to spawn the CSG tab
  toSpawn(debuggerContext: DebuggerContext): boolean {
    let moduleState: CsgModuleState = debuggerContext.context.moduleContexts.csg.state;
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
  label: 'CSG Tab',
};
