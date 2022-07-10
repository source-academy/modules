/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars, jsx-a11y/media-has-caption */
import React from 'react';
import { StereoSoundsModuleState } from '../../bundles/stereo_sound/types';
import { DebuggerContext } from '../../typings/type_helpers';
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
  toSpawn: (context: any) => {
    const moduleContext = context.context?.moduleContexts.get('stereo_sound');
    if (moduleContext == null) {
      return false;
    }

    const moduleState = moduleContext.state as StereoSoundsModuleState;
    if (moduleState == null) {
      return false;
    }

    return moduleState.audioPlayed.length > 0;
  },
  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (context: DebuggerContext) => {
    const moduleContext = context.context?.moduleContexts.get('sound');
    const moduleState = (moduleContext!.state as StereoSoundsModuleState)
      .audioPlayed;
    const elements = moduleState.map((audio) => (
      <audio
        src={audio.dataUri}
        controls
        id='sound-tab-player'
        style={{ width: '100%' }}
      />
    ));

    return (
      <div>
        <p id='sound-default-text'>
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
