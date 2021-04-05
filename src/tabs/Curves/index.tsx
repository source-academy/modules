import React from 'react';
import { ShapeDrawn } from '../../bundles/curves/types';

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

class WebGLCanvas extends React.Component<Props, State> {
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

  public render() {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
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
  toSpawn: (context: any) => {
    function isValidFunction(value: any): value is ShapeDrawn {
      try {
        return value instanceof Object && value.init instanceof Function;
      } catch (e) {
        return false;
      }
    }
    return isValidFunction(context.result.value);
  },
  body: (context: any) => <WebGLCanvas context={context} />,
  label: 'Curves Canvas',
  iconName: 'media', // See https://blueprintjs.com/docs/#icons for more options
};
