/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { CurveDrawn } from '../../bundles/curve/curves_webgl';
import { CurveAnimation, CurveModuleState } from '../../bundles/curve/types';
import { glAnimation } from '../../typings/anim_types';
import MultiItemDisplay from '../../typings/multi_item';
import { DebuggerContext } from '../../typings/type_helpers';
import Curve3DAnimationCanvas from './3Dcurve_anim_canvas';
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

    const canvases = moduleState!.drawnCurves.map((curve) => {
      if (glAnimation.isAnimation(curve)) {
        const anim = curve as CurveAnimation;
        return anim.is3D ? (
          <Curve3DAnimationCanvas animation={anim} />
        ) : (
          <AnimationCanvas animation={anim} />
        );
      }
      const curveDrawn = curve as CurveDrawn;
      return curveDrawn.is3D() ? (
        <CurveCanvas3D curve={curveDrawn} />
      ) : (
        <canvas
          ref={(r) => {
            if (r) {
              curveDrawn.init(r);
              curveDrawn.redraw(0);
            }
          }}
          height={500}
          width={500}
        />
      );
    });

    return <MultiItemDisplay elements={canvases} />;
  },
  label: 'Curves Tab',
  iconName: 'media', // See https://blueprintjs.com/docs/#icons for more options
};
