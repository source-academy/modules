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

  // TODO: Currently not using any error logger to stop the rendering of canvas
  public componentDidMount() {
    if (this.$canvas) {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.context.result.value.init(this.$canvas);
    }
  }

  public render() {
    return (
      <div>
        <canvas
          ref={(r) => {
            this.$canvas = r;
          }}
          width={400}
          height={400}
        />
      </div>
    );
  }
}

export default {
  toSpawn: () => true, // TODO: Always set to true as for now, but may want to disable it when ShapeDrawn is not returned
  body: (context: any) => <Canvas context={context} />,
  label: 'Curves Canvas',
  iconName: 'media', // See https://blueprintjs.com/docs/#icons for more options
};
