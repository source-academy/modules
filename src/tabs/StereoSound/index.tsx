import React from 'react';
import type { DebuggerContext } from '../../typings/type_helpers';
import MultiItemDisplay from '../common/multi_item_display';

/**
 * Tab for Source Academy Sounds Module
 * @author Koh Shang Hui
 * @author Samyukta Sounderraman
 */

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered.
   * @returns {boolean}
   */
  toSpawn(context: any) {
    const audioPlayed = context.context?.moduleContexts?.stereo_sound?.state?.audioPlayed;
    return audioPlayed.length > 0;
  },
  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body(context: DebuggerContext) {
    const audioPlayed = context.context?.moduleContexts.stereo_sound.state.audioPlayed;
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
  },

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Stereo Sounds',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'music',
};
