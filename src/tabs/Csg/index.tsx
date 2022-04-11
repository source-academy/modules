/* [Imports] */
import { IconNames } from '@blueprintjs/icons';
import React, { ReactElement } from 'react';
import { getModuleState } from '../../bundles/csg/core.js';
import { DebuggerContext } from '../../typings/type_helpers';
import CanvasHolder from './canvas_holder';

/* [Main] */
export default {
  // Called by the frontend to decide whether to spawn the CSG tab
  toSpawn(_debuggerContext: DebuggerContext): boolean {
    return getModuleState().renderGroupManager.render();
  },

  // Called by the frontend to know what to render in the CSG tab
  body: (_debuggerContext: DebuggerContext): ReactElement => <CanvasHolder />,

  // BlueprintJS icon name
  iconName: IconNames.SHAPES,

  // Icon tooltip in sidebar
  label: 'CSG Tab',
};
