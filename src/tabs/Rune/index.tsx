import React from 'react';
import { HollusionRune } from '../../bundles/rune/functions';
import type {
  AnimatedRune,
  DrawnRune,
  RunesModuleState,
} from '../../bundles/rune/rune';
import { glAnimation } from '../../typings/anim_types';
import MultiItemDisplay from '../common/multi_item_display';
import { DebuggerContext } from '../../typings/type_helpers';
import AnimationCanvas from '../common/animation_canvas';
import HollusionCanvas from './hollusion_canvas';
import WebGLCanvas from '../common/webgl_canvas';

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when there is at least one rune to be
   * displayed
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn(context: DebuggerContext) {
    const moduleContext = context.context?.moduleContexts.get('rune');
    if (!moduleContext) {
      return false;
    }

    const moduleState = moduleContext.state as RunesModuleState;
    if (!moduleState) {
      return false;
    }

    return moduleState.drawnRunes.length > 0;
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body(context: DebuggerContext) {
    // eslint-disable-next-line react/destructuring-assignment
    const moduleContext = context.context?.moduleContexts.get('rune');
    const moduleState = moduleContext!.state as RunesModuleState;

    // Based on the toSpawn conditions, it should be safe to assume
    // that neither moduleContext or moduleState are null
    const runeCanvases = moduleState.drawnRunes.map((rune, i) => {
      const elemKey = i.toString();

      if (glAnimation.isAnimation(rune)) {
        return (
          <AnimationCanvas animation={rune as AnimatedRune} key={elemKey} />
        );
      }
      const drawnRune = rune as DrawnRune;
      if (drawnRune.isHollusion) {
        return (
          <HollusionCanvas rune={drawnRune as HollusionRune} key={elemKey} />
        );
      }
      return (
        <WebGLCanvas
          ref={(r) => {
            if (r) {
              drawnRune.draw(r);
            }
          }}
          key={elemKey}
        />
      );
    });

    return <MultiItemDisplay elements={runeCanvases} />;
  },

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Runes Tab',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'group-objects',
};
