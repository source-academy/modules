import React from 'react';
import { ErrorLogger } from '../../bundles/pix_n_flix/types';

type Props = {
  children?: never;
  className?: string;
  debuggerContext: any;
};

type State = {};

export type PixNFlix = {
  toReplString: () => string;
  init: (
    video: HTMLVideoElement | null,
    canvas: HTMLCanvasElement | null,
    errorLogger: ErrorLogger
  ) => void;
  deinit: () => void;
  snapPicture: () => void;
  updateFPS: (fps: number) => void;
  updateDimensions: (width: number, height: number) => void;
};

class Repeat extends React.Component<Props, State> {
  private $video: HTMLVideoElement | null = null;

  private $canvas: HTMLCanvasElement | null = null;

  private pixNFlix: PixNFlix;

  constructor(props: any) {
    super(props);
    this.state = {};
    const { debuggerContext } = this.props;
    this.pixNFlix = debuggerContext.result.value;
  }

  public componentDidMount() {
    if (this.$video && this.$canvas) {
      const { debuggerContext } = this.props;
      this.pixNFlix = debuggerContext.result.value;
      this.pixNFlix.init(this.$video, this.$canvas, this.printError);
    }
    window.addEventListener('beforeunload', this.pixNFlix.deinit);
  }

  public componentWillUnmount() {
    this.pixNFlix.deinit();
    window.removeEventListener('beforeunload', this.pixNFlix.deinit);
  }

  public printError: ErrorLogger = () => {};

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
