import React from 'react';
import { Button, ButtonGroup, Divider, NumericInput } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import {
  ErrorLogger,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_FPS,
} from '../../bundles/pix_n_flix/types';

type Props = {
  children?: never;
  className?: string;
  debuggerContext: any;
};

type SideContentVideoDisplayMode = 'video' | 'still';

type State = {
  width: number;
  height: number;
  FPS: number;
  mode: SideContentVideoDisplayMode;
};

type PixNFlix = {
  toReplString: () => string;
  init: (
    video: HTMLVideoElement | null,
    canvas: HTMLCanvasElement | null,
    errorLogger: ErrorLogger
  ) => void;
  deinit: () => void;
  startVideo: () => void;
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
    this.state = {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      FPS: DEFAULT_FPS,
      mode: 'video' as SideContentVideoDisplayMode,
    };
    const { debuggerContext } = this.props;
    this.pixNFlix = debuggerContext.result.value;
  }

  public componentDidMount() {
    this.setupVideoService();
    window.addEventListener('beforeunload', this.pixNFlix.deinit);
  }

  public componentWillUnmount() {
    this.closeVideo();
    window.removeEventListener('beforeunload', this.pixNFlix.deinit);
  }

  public setupVideoService = () => {
    if (this.$video && this.$canvas) {
      const { debuggerContext } = this.props;
      this.pixNFlix = debuggerContext.result.value;
      this.pixNFlix.init(this.$video, this.$canvas, this.printError);
    }
  };

  public closeVideo = () => {
    this.pixNFlix.deinit();
  };

  public handleStartVideo = () => {
    this.pixNFlix.startVideo();
  };

  public handleSnapPicture = () => {
    this.pixNFlix.snapPicture();
  };

  public handleWidthChange = (n: number) => {
    if (n > 0 && n <= 500) {
      this.setState((prevState) => ({
        width: n,
        height: prevState.height,
      }));
      const { height } = this.state;
      this.handleUpdateDimensions(n, height);
    }
  };

  public handleHeightChange = (m: number) => {
    if (m > 0 && m <= 500) {
      this.setState((prevState) => ({
        width: prevState.width,
        height: m,
      }));
      const { width } = this.state;
      this.handleUpdateDimensions(width, m);
    }
  };

  public handleFPSChange = (m: number) => {
    // these magic numbers are based off video library
    if (m > 2 && m < 30) {
      this.setState({
        FPS: m,
      });
      this.pixNFlix.updateFPS(m);
    }
  };

  public handleUpdateDimensions = (n: number, m: number) => {
    this.pixNFlix.updateDimensions(n, m);
  };

  public printError: ErrorLogger = () => {};

  private swapModes = (mode: SideContentVideoDisplayMode) => () => {
    switch (mode) {
      case 'video':
        this.setState(
          (state: State) => ({
            ...state,
            mode: 'still' as SideContentVideoDisplayMode,
          }),
          this.handleSnapPicture
        );
        break;
      // case 'still':
      default:
        this.setState(
          (state: State) => ({
            ...state,
            mode: 'video' as SideContentVideoDisplayMode,
          }),
          this.handleStartVideo
        );
        break;
    }
  };

  public render() {
    const { mode, width, height, FPS } = this.state;
    const videoIsActive = mode === ('video' as SideContentVideoDisplayMode);
    const stillIsActive = mode === ('still' as SideContentVideoDisplayMode);
    return (
      <div className='sa-video'>
        <div className='sa-video-header'>
          <div className='sa-video-header-element'>
            <ButtonGroup>
              <Button
                className='sa-live-video-button'
                icon={IconNames.VIDEO}
                active={videoIsActive}
                onClick={this.swapModes(mode)}
                text='Live Video'
              />
              <Button
                className='sa-still-image-button'
                icon={IconNames.CAMERA}
                active={stillIsActive}
                onClick={
                  stillIsActive ? this.handleSnapPicture : this.swapModes(mode)
                }
                text='Still Image'
              />
            </ButtonGroup>
          </div>
          <Divider />
          <div className='sa-video-header-element'>
            <div className='sa-video-header-numeric-input'>
              {/* <Tooltip2 content='Change width'> */}
              <NumericInput
                leftIcon={IconNames.HORIZONTAL_DISTRIBUTION}
                style={{ width: 70 }}
                value={width}
                onValueChange={this.handleWidthChange}
                minorStepSize={1}
                stepSize={10}
                majorStepSize={100}
                max={500}
              />
              {/* </Tooltip2> */}
            </div>
            <div className='sa-video-header-numeric-input'>
              {/* <Tooltip2 content='Change height'> */}
              <NumericInput
                leftIcon={IconNames.VERTICAL_DISTRIBUTION}
                style={{ width: 70 }}
                value={height}
                onValueChange={this.handleHeightChange}
                minorStepSize={1}
                stepSize={10}
                majorStepSize={100}
                max={500}
              />
              {/* </Tooltip2> */}
            </div>
            <div className='sa-video-header-numeric-input'>
              {/* <Tooltip2 content='Change FPS'> */}
              <NumericInput
                leftIcon={IconNames.STOPWATCH}
                style={{ width: 60 }}
                value={FPS}
                onValueChange={this.handleFPSChange}
                minorStepSize={null}
                stepSize={1}
                majorStepSize={null}
                max={30}
                min={2}
              />
              {/* </Tooltip2> */}
            </div>
          </div>
        </div>
        <div className='sa-video-element'>
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
          <br />
          <p style={{ fontFamily: 'courier' }}>
            Note: Is video lagging? Switch to &apos;still image&apos; or adjust
            FPS rate!
          </p>
        </div>
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
