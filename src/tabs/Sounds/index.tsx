/* eslint-disable @typescript-eslint/no-unused-vars, jsx-a11y/media-has-caption */
import React from 'react';
import { AudioPlayed } from '../../bundles/sounds/types';
// import sounds from '../../bundles/sounds';

/**
 * Tab for Source Academy Sounds Module
 * @author Koh Shang Hui
 * @author Samyukta Sounderraman
 */

/**
 * React Component props for the Tab.
 */
type Props = {
  children?: never;
  className?: never;
  context?: any;
};

/**
 * React Component state for the Tab.
 */
type State = {};

/**
 * The main React Component of the Tab.
 */
class Sounds extends React.Component<Props, State> {
  private $audio: HTMLAudioElement | null = null;

  constructor(props) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    if (this.$audio) {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.context.result.value.init(this.$audio);
    }
  }

  public render() {
    return (
      <div>
        <p id='sound-default-text'>
          The sound tab gives you control over your custom sounds. You can play,
          pause, adjust the volume and download your sounds.
          <br />
          <br />
          <audio
            ref={(r) => {
              this.$audio = r;
            }}
            src=''
            controls
            id='sound-tab-player'
            style={{ width: '100%' }}
          />
          <br />
        </p>
      </div>
    );
  }
}

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when the result in the REPL is "test".
   * @returns {boolean}
   */
  toSpawn: (context: any) => {
    function valid(value: any): value is AudioPlayed {
      try {
        return value instanceof Object && value.init instanceof Function;
      } catch (e) {
        return false;
      }
    }
    return valid(context.result.value);
  },
  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (context: any) => <Sounds context={context} />,

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
