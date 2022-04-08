/* [Imports] */
import { IconNames } from '@blueprintjs/icons';
import React from 'react';
import { looseInstanceOf, Shape } from '../../bundles/csg/utilities';
import { DebuggerContext } from '../../typings/type_helpers';
import CanvasHolder from './canvas_holder';

/* [Main] */
export default {
  // Called by the frontend to decide whether to spawn the CSG tab.
  // If the Source program results in a Shape, we use its spawnsTab property to
  // decide
  toSpawn(debuggerContext: DebuggerContext) {
    const potentialShape: any = debuggerContext?.result?.value;
    if (!looseInstanceOf(potentialShape, Shape)) {
      return false;
    }
    // potentialShape is likely a Shape

    let shape: Shape;
    try {
      shape = potentialShape as Shape;
    } catch (error: any) {
      console.error(error);
      return false;
    }

    return shape.spawnsTab;
  },

  // Called by the frontend to know what to render in the CSG tab
  body: (debuggerContext: DebuggerContext) => (
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
