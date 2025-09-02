import { IconNames } from '@blueprintjs/icons';
import type { CurveModuleState } from '@sourceacademy/bundle-curve/types';
import AnimationCanvas from '@sourceacademy/modules-lib/tabs/AnimationCanvas';
import MultiItemDisplay from '@sourceacademy/modules-lib/tabs/MultiItemDisplay';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import { glAnimation, type ModuleTab } from '@sourceacademy/modules-lib/types';
import CurveCanvas3D from './canvas_3d_curve';
import Curve3DAnimationCanvas from './curve_3d_animation_canvas';

export const CurveTab: ModuleTab = ({ context }) => {
  const { drawnCurves } = getModuleState<CurveModuleState>(context, 'curve');
  const canvases = drawnCurves.map((curve, i) => {
    const elemKey = i.toString();

    if (glAnimation.isAnimation(curve)) {
      return curve.is3D
        ? <Curve3DAnimationCanvas animation={curve} key={elemKey} />
        : <AnimationCanvas animation={curve} key={elemKey} />;
    }
    return curve.is3D()
      ? <CurveCanvas3D curve={curve} key={elemKey} />
      : (
        <WebGLCanvas
          ref={(r) => {
            if (r) {
              curve.init(r);
              curve.redraw(0);
            }
          }}
          key={elemKey}
        />
      );
  });

  return <MultiItemDisplay elements={canvases} />;
};

export default defineTab({
  toSpawn(context) {
    const drawnCurves = context.context?.moduleContexts?.curve?.state?.drawnCurves;
    return drawnCurves.length > 0;
  },
  body(context) {
    return <CurveTab context={context} />;
  },
  label: 'Curves Tab',
  iconName: IconNames.MEDIA // See https://blueprintjs.com/docs/#icons for more options
});
