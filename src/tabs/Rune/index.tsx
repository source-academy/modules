/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { drawRune } from '../../bundles/runes/runes_webgl';
import { Rune } from '../../bundles/runes/types';

/**
 * TODO: This tab is for displaying of Drawing of Runes
 * @Hou Ruomu
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
   * This is the Entrypoint for the tab.
   * ---------------
   * Developer's Notes:
   * - Access the result from the REPL console using
   * this.props.context.result.value
   */
  public componentDidMount() {
    if (this.$canvas) {
      const {
        context: {
          result: { value },
        },
      } = this.props;
      drawRune(this.$canvas, value);
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
          ref={(r) => {
            this.$canvas = r;
          }}
          width={500}
          height={500}
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toSpawn: (context: any) => {
    function isValidFunction(value: any): value is Rune {
      try {
        return value.toReplString() === '<RUNE>';
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
