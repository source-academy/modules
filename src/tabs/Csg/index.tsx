/* [Imports] */
import { IconNames } from '@blueprintjs/icons';
import { ModuleContext, ModuleState } from 'js-slang';
import React, { ReactElement } from 'react';
import { CsgModuleState, getModuleContext } from '../../bundles/csg/utilities';
import { DebuggerContext, ModuleContexts } from '../../typings/type_helpers';
import CanvasHolder from './canvas_holder';

/* [Main] */
export default {
  // Called by the frontend to decide whether to spawn the CSG tab
  toSpawn(debuggerContext: DebuggerContext): boolean {
    let moduleContexts: ModuleContexts = debuggerContext.context.moduleContexts;
    let potentialModuleContext: ModuleContext | null = getModuleContext(
      moduleContexts
    );
    if (potentialModuleContext === null) return false;
    let moduleContext: ModuleContext = potentialModuleContext;

    let potentialModuleState: ModuleState | undefined | null =
      moduleContext.state;
    if (!(potentialModuleState instanceof CsgModuleState)) return false;
    let moduleState: CsgModuleState = potentialModuleState;

    return moduleState.renderGroupManager.render();
  },

  //TODO no debugger context, and just get from core
  // Called by the frontend to know what to render in the CSG tab
  body: (debuggerContext: DebuggerContext): ReactElement => (
    <CanvasHolder
      // debuggerContext passed as part of Component Props
      debuggerContext={debuggerContext}
    />
  ),

  // BlueprintJS icon name
  iconName: IconNames.SHAPES,

  // Icon tooltip in sidebar
  label: 'CSG Tab',
};
