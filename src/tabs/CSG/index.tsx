import React from 'react';
import drawCSG from '../../bundles/csg/csg_renderer';
import { CsgObject } from '../../bundles/csg/types';

type Props = {
  children?: never;
  className?: never;
  context?: any;
};

type State = {};

/* eslint-disable react/destructuring-assignment */
class WebGLCanvas extends React.Component<Props, State> {
  private $canvas: HTMLCanvasElement | null = null;

  constructor(props) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    if (this.$canvas) {
      const {
        context: {
          result: { value },
        },
      } = this.props;
      drawCSG(this.$canvas, value);
    }
  }

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
          width={512}
          height={512}
        />
      </div>
    );
  }
}

export default {
  toSpawn: (context: any) => {
    function isValidFunction(value: any): value is CsgObject {
      try {
        return value.toReplString() === '<RENDERING CSG>';
      } catch (e) {
        return false;
      }
    }
    return isValidFunction(context.result.value);
  },
  body: (context: any) => <WebGLCanvas context={context} />,
  label: 'CSG Canvas',
  iconName: 'media', // See https://blueprintjs.com/docs/#icons for more options
};
