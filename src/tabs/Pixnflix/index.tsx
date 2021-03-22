import React from 'react';

type Props = {
  children?: never;
  className?: string;
  debuggerContext: any;
};

type State = {};

class Repeat extends React.Component<Props, State> {
  private $video: HTMLVideoElement | null = null;

  private $canvas: HTMLCanvasElement | null = null;

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    if (this.$video && this.$canvas) {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.debuggerContext.result.value.init(
        this.$video,
        this.$canvas,
        this.printError
      );
    }
  }

  public printError = () => {};

  public render() {
    return (
      <div>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={(r) => {
            this.$video = r;
          }}
          autoPlay
          id='livefeed'
          width={400}
          height={300}
          style={{ display: 'none' }}
        />
        <canvas
          ref={(r) => {
            this.$canvas = r;
          }}
          width={400}
          height={300}
        />
      </div>
    );
  }
}

export default {
  toSpawn: () => true,
  body: (debuggerContext: any) => <Repeat debuggerContext={debuggerContext} />,
  label: 'PixNFlix Live Feed',
  iconName: 'mobile-video',
};
