import React from 'react';

/**
 * Currently used for rendering HTML canvas element for curves.
 * The same tab will be used if we are trying ThreeJS Canvas in
 * the future.
 * @author Lee Zheng Han
 * @author Ng Yong Xiang
 */

type Props = {
  children?: never;
  className?: never;
  context?: any;
};

type State = {};

class Canvas extends React.Component<Props, State> {
  private $canvas: HTMLCanvasElement | null = null;

  constructor(props) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    if (this.$canvas) {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.context.result.value.init(this.$canvas);
    }
  }

  // public printError = () => { };

  public render() {
    return (
      <div>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <canvas
          ref={(r) => {
            this.$canvas = r;
          }}
          // id='glCanvas'
          width={400}
          height={400}
        />

      </div>
    );
  }
}

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when the result in the REPL is "test".
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn: () => true,

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (context: any) => <Canvas context={context} />,

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Curves Canvas',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'media',
};
