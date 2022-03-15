/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { CurveDrawn } from '../../bundles/curve/curves_webgl';
import { CurveAnimation, CurveModuleState } from '../../bundles/curve/types';
import MultiItemDisplay from '../../typings/multi_item';
import { DebuggerContext } from '../../typings/type_helpers';
import CurveCanvas from './curve_canvas';
import CurveCanvas3D, { AnimationCanvas } from './curve_canvas3d';

export default {
  toSpawn: (context: DebuggerContext) => {
    const moduleContext = context.context?.moduleContexts.get('curve');
    if (moduleContext == null) {
      return false;
    }

    const moduleState = moduleContext.state as CurveModuleState;
    if (moduleState == null) {
      return false;
    }

    return moduleState.drawnCurves.length > 0;
  },
  body: (context: DebuggerContext) => {
    const moduleContext = context.context?.moduleContexts.get('curve');
    const moduleState = moduleContext!.state as CurveModuleState;
    const curves = moduleState!.drawnCurves
      .filter((curve) => (curve as any).numFrames === undefined)
      .map((curve) => {
        if ((curve as any).numFrames !== undefined) {
          return <AnimationCanvas animation={curve as CurveAnimation} />;
        }
        return (curve as CurveDrawn).is3D() ? (
          <CurveCanvas3D curve={curve as CurveDrawn} />
        ) : (
          <CurveCanvas curve={curve as CurveDrawn} />
        );
      });

    return <MultiItemDisplay elements={curves} />;
  },
  label: 'Curves Tab',
  iconName: 'media', // See https://blueprintjs.com/docs/#icons for more options
};
