/* [Imports] */
import { IconNames } from '@blueprintjs/icons';
import { ModuleContext, ModuleState } from 'js-slang';
import React, { ReactElement } from 'react';
import { Core } from '../../bundles/csg/core.js';
import {
  CsgModuleState,
  getModuleContext,
  looseInstanceof,
} from '../../bundles/csg/utilities.js';
import { DebuggerContext, ModuleContexts } from '../../typings/type_helpers';
import CanvasHolder from './canvas_holder';

/* [Main] */
export default {
  // Called by the frontend to decide whether to spawn the CSG tab
  toSpawn(_debuggerContext: DebuggerContext): boolean {
    return Core.getRenderGroupManager().render();
  },

  // Called by the frontend to know what to render in the CSG tab
  body(debuggerContext: DebuggerContext): ReactElement {
    let moduleContexts: ModuleContexts = debuggerContext.context.moduleContexts;
    let potentialModuleContext: ModuleContext | null = getModuleContext(
      moduleContexts
    );
    if (potentialModuleContext === null) return <div></div>;
    let moduleContext: ModuleContext = potentialModuleContext;

    let potentialModuleState: ModuleState | null | undefined =
      moduleContext.state;
    if (!looseInstanceof(potentialModuleState, CsgModuleState))
      return <div></div>;
    let moduleState = potentialModuleState as CsgModuleState;

    Core.initialize(moduleState);
    return <CanvasHolder moduleState={moduleState} />;
  },

  // BlueprintJS icon name
  iconName: IconNames.SHAPES,

  // Icon tooltip in sidebar
  label: 'CSG Tab',
};
