import type { AudioPlayed, SoundModuleState } from '../../bundles/sound/types';
import { getModuleState, type DebuggerContext } from '../../typings/type_helpers';
import MultiItemDisplay from '../common/multi_item_display';

export type SoundTabProps<T> = {
  getAudioPlayed: () => T[]
};

/**
 * Tab for Source Academy Sounds Module
 * @author Koh Shang Hui
 * @author Samyukta Sounderraman
 */
export const SoundTab = ({ getAudioPlayed }: SoundTabProps<AudioPlayed>) => {
  const audioPlayed = getAudioPlayed();
  const elements = audioPlayed.map((audio) => (
    <audio
      src={audio.dataUri}
      controls
      id="sound-tab-player"
      style={{ width: '100%' }}
    />
  ));

  return (
    <div>
      <p id="sound-default-text">
          The sound tab gives you control over your custom sounds. You can play,
          pause, adjust the volume and download your sounds.
        <br />
        <br />
        <MultiItemDisplay elements={elements} />
        <br />
      </p>
    </div>
  );
};

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered.
   * @returns {boolean}
   */
  toSpawn(context: DebuggerContext) {
    const audioPlayed = context.context?.moduleContexts?.sound?.state?.audioPlayed;
    return audioPlayed.length > 0;
  },
  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body(context: DebuggerContext) {
    return <SoundTab getAudioPlayed={() => getModuleState<SoundModuleState>(context, 'sound').audioPlayed} />;
  },

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Sounds',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'music',
};
