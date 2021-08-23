import React from 'react';
import {
  drawAnaglyph,
  drawHollusion,
  drawRune,
} from '../../bundles/rune/runes_webgl';
import { Rune } from '../../bundles/rune/types';

/**
 * tab for displaying runes
 * @author Hou Ruomu
 */

/**
 * React Component props for the Tab.
 * Provided by the template, nothing was changed.
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
class WebGLCanvas extends React.Component<Props, State> {
  private $canvas: HTMLCanvasElement | null = null;

  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * This function is called when the tab is created.
   * This is the entrypoint for the tab.
   */
  public componentDidMount() {
    if (this.$canvas) {
      const {
        context: {
          result: { value },
        },
      } = this.props;
      if (value.drawMethod === 'anaglyph') {
        drawAnaglyph(this.$canvas, value);
      } else if (value.drawMethod === 'hollusion') {
        drawHollusion(this.$canvas, value);
      } else if (value.drawMethod === 'normal') {
        drawRune(this.$canvas, value);
      } else {
        throw Error(`Unexpected Drawing Method ${value.drawMethod}`);
      }
    }
  }

  /**
   * This function sets the layout of the React Component in HTML
   * Notice the the Canvas hook in "ref" property.
   * @returns HTMLComponent
   */
  public render() {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          paddingLeft: '20px',
          paddingRight: '20px',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <canvas
          id='runesCanvas'
          ref={(r) => {
            this.$canvas = r;
          }}
          width={512}
          height={512}
        />
      </div>
    );
  }
}

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when the result in the REPL is "<RUNE>".
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn: (context: any) => {
    function isValidFunction(value: any): value is Rune {
      try {
        return (
          value.toReplString() === '<RENDERING>' && value.drawMethod !== ''
        );
      } catch (e) {
        return false;
      }
    }
    return isValidFunction(context.result.value);
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (context: any) => <WebGLCanvas context={context} />,

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
