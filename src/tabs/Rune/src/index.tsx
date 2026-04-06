import { isHollusionRune, type RuneModuleState } from '@sourceacademy/bundle-rune/functions';
import AnimationCanvas from '@sourceacademy/modules-lib/tabs/AnimationCanvas';
import MultiItemDisplay from '@sourceacademy/modules-lib/tabs/MultiItemDisplay/index';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import { glAnimation, type ModuleTab } from '@sourceacademy/modules-lib/types';
import HollusionCanvas from './hollusion_canvas';
import { serializeDrawnRune, deserializeDrawnRune } from '@sourceacademy/bundle-rune/rune';

export const RuneTab: ModuleTab = ({ context }) => {
  // const { drawnRunes } = getModuleState<RuneModuleState>(context, 'rune');
  const deserializedDrawnRunes = context.context.moduleContexts.rune.state.deserializedDrawnRunes
  console.log("deserializedDrawnRune inside Tab Render");
  console.log(deserializedDrawnRunes);

  const runeCanvases = deserializedDrawnRunes.map((rune, i) => {
    const elemKey = i.toString();

    if (glAnimation.isAnimation(rune)) {
      return <AnimationCanvas animation={rune} key={elemKey} />;
    }
    if (isHollusionRune(rune)) {
      return <HollusionCanvas rune={rune} key={elemKey} />;
    }
    return (
      <WebGLCanvas
        ref={(r) => {
          if (r) {
            rune.draw(r);
          }
        }}
        key={elemKey}
      />
    );
  });

  return <MultiItemDisplay elements={runeCanvases} />;
};

export default defineTab({
  serialize(debuggerContext) {
    const drawnRunes = debuggerContext.context?.moduleContexts?.rune?.state?.drawnRunes ?? [];
    debuggerContext.context.moduleContexts.rune.state.serializedDrawnRunes = drawnRunes.map((r: any) => serializeDrawnRune(r));
    return debuggerContext;
  },
  deserialize(debuggerContext) {
    const serializedDrawnRunes = debuggerContext.context?.moduleContexts?.rune?.state?.serializedDrawnRunes ?? [];
    debuggerContext.context.moduleContexts.rune.state.deserializedDrawnRunes = serializedDrawnRunes.map((s: any) => deserializeDrawnRune(s));
    return debuggerContext;
  },
  toSpawn(debuggerContext) {
    const serializedDrawnRunes = debuggerContext.context?.moduleContexts?.rune?.state?.serializedDrawnRunes ?? [];
    return serializedDrawnRunes.length > 0;
  },
  body(context) {
    return <RuneTab context={context} />;
  },
  label: 'Runes Tab',
  iconName: 'group-objects'
});
