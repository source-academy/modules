import { Button, ButtonGroup, Divider, NumericInput } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
// eslint-disable-next-line @typescript-eslint/no-shadow
import React, { type ChangeEvent, type DragEvent } from 'react';
import {
  DEFAULT_FPS,
  DEFAULT_HEIGHT,
  DEFAULT_VOLUME,
  DEFAULT_WIDTH,
  MAX_FPS,
  MAX_HEIGHT,
  MAX_WIDTH,
  MIN_FPS,
  MIN_HEIGHT,
  MIN_WIDTH,
} from '../../bundles/pix_n_flix/constants';
import {
  type BundlePacket,
  type ErrorLogger,
  InputFeed,
  type TabsPacket,
} from '../../bundles/pix_n_flix/types';

type Props = {
  children?: never;
  className?: string;
  debuggerContext: any;
};

enum VideoMode {
  Video,
  Still,
  Accepting,
  Image,
}

type State = {
  width: number;
  height: number;
  FPS: number;
  volume: number;
  hasAudio: boolean;
  mode: VideoMode;
};

type Video = {
  toReplString: () => string;
  init: (
    image: HTMLImageElement | null,
    video: HTMLVideoElement | null,
    canvas: HTMLCanvasElement | null,
    errorLogger: ErrorLogger,
    tabsPackage: TabsPacket
  ) => BundlePacket;
  deinit: () => void;
  startVideo: () => void;
  stopVideo: () => void;
  updateFPS: (fps: number) => void;
  updateDimensions: (width: number, height: number) => void;
  updateVolume: (v: number) => void;
};

class PixNFlix extends React.Component<Props, State> {
  private $video: HTMLVideoElement | null = null;

  private $image: HTMLImageElement | null = null;

  private $canvas: HTMLCanvasElement | null = null;

  private pixNFlix: Video;

  constructor(props: Props) {
    super(props);
    this.state = {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      FPS: DEFAULT_FPS,
      volume: DEFAULT_VOLUME,
      hasAudio: false,
      mode: VideoMode.Video,
    };
    const { debuggerContext } = this.props;
    this.pixNFlix = debuggerContext.result.value;
  }

  public componentDidMount() {
    if (this.isPixNFlix()) {
      this.setupVideoService();
      window.addEventListener('beforeunload', this.pixNFlix.deinit);
    }
  }

  public componentWillUnmount() {
    if (this.isPixNFlix()) {
      this.closeVideo();
      window.removeEventListener('beforeunload', this.pixNFlix.deinit);
    }
  }

  public setupVideoService = () => {
    if (this.$video && this.$canvas && this.isPixNFlix()) {
      const { debuggerContext } = this.props;
      this.pixNFlix = debuggerContext.result.value;
      // get the properties of the video in an object
      const { HEIGHT, WIDTH, FPS, VOLUME, inputFeed } = this.pixNFlix.init(
        this.$image,
        this.$video,
        this.$canvas,
        this.printError,
        {
          onClickStill: this.onClickStill,
        },
      );
      let mode: VideoMode = VideoMode.Video;
      if (inputFeed === InputFeed.Local) {
        mode = VideoMode.Accepting;
      } else if (inputFeed === InputFeed.ImageURL) {
        mode = VideoMode.Image;
      }
      this.setState({
        height: HEIGHT,
        width: WIDTH,
        FPS,
        volume: VOLUME,
        hasAudio: inputFeed === InputFeed.VideoURL,
        mode,
      });
    }
  };

  public closeVideo = () => {
    if (this.isPixNFlix()) {
      this.pixNFlix.deinit();
    }
  };

  public handleStartVideo = () => {
    if (this.isPixNFlix()) {
      this.pixNFlix.startVideo();
    }
  };

  public handleStopVideo = () => {
    if (this.isPixNFlix()) {
      this.pixNFlix.stopVideo();
    }
  };

  public onClickStill = () => {
    const { mode } = this.state;
    if (mode === VideoMode.Still) {
      this.handleStopVideo();
    } else if (mode === VideoMode.Video) {
      this.setState(
        () => ({
          mode: VideoMode.Still,
        }),
        this.handleStopVideo,
      );
    }
  };

  public onClickVideo = () => {
    const { mode } = this.state;
    if (mode === VideoMode.Still) {
      this.setState(
        () => ({
          mode: VideoMode.Video,
        }),
        this.handleStartVideo,
      );
    }
  };

  public handleWidthChange = (width: number) => {
    const { height } = this.state;
    this.handleUpdateDimensions(width, height);
  };

  public handleHeightChange = (height: number) => {
    const { width } = this.state;
    this.handleUpdateDimensions(width, height);
  };

  public handleFPSChange = (fps: number) => {
    if (fps >= MIN_FPS && fps <= MAX_FPS) {
      this.setState({
        FPS: fps,
      });
      if (this.isPixNFlix()) {
        this.pixNFlix.updateFPS(fps);
      }
    }
  };

  public handleUpdateDimensions = (w: number, h: number) => {
    if (
      w >= MIN_WIDTH
      && w <= MAX_WIDTH
      && h >= MIN_HEIGHT
      && h <= MAX_HEIGHT
    ) {
      this.setState({
        width: w,
        height: h,
      });
      if (this.isPixNFlix()) {
        this.pixNFlix.updateDimensions(w, h);
      }
    }
  };

  public loadFileToVideo = (file: File) => {
    const { mode } = this.state;
    if (file.type.match('video.*')) {
      if (this.$video && mode === VideoMode.Accepting) {
        this.$video.src = URL.createObjectURL(file);
        this.setState({
          hasAudio: true,
          mode: VideoMode.Video,
        });
        this.handleStartVideo();
      }
    } else if (file.type.match('image.*')) {
      if (this.$image && mode === VideoMode.Accepting) {
        this.$image.src = URL.createObjectURL(file);
        this.setState({
          mode: VideoMode.Image,
        });
      }
    }
  };

  public handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    this.loadFileToVideo(e.dataTransfer.files[0]);
  };

  public handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  public handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target && e.target.files) {
      this.loadFileToVideo(e.target.files[0]);
    }
  };

  public handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const volume = parseFloat(e.target.value);
    this.setState({
      volume,
    });
    this.pixNFlix.updateVolume(volume);
  };

  public printError: ErrorLogger = () => {};

  /**
   * Checks if pixNFlix is initialised as the last line (ie. REPL output is '[Pix N Flix]')
   * @returns Boolean if pixNFlix is intialised
   */
  private isPixNFlix() {
    return (
      this.pixNFlix
      && this.pixNFlix.toReplString
      && this.pixNFlix.toReplString() === '[Pix N Flix]'
    );
  }

  public render() {
    const { mode, width, height, FPS, volume, hasAudio } = this.state;
    const displayOptions = mode === VideoMode.Still || mode === VideoMode.Video;
    const videoIsActive = mode === VideoMode.Video;
    const isAccepting = mode === VideoMode.Accepting;
    return (
      <div
        className="sa-video"
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
      >
        <div className="sa-video-header">
          <div
            className="sa-video-header-element"
            style={{ display: displayOptions ? 'inherit' : 'none' }}
          >
            <ButtonGroup>
              <Button
                className="sa-live-video-button"
                icon={IconNames.VIDEO}
                active={videoIsActive}
                onClick={this.onClickVideo}
                text="Play Video"
              />
              <Button
                className="sa-still-image-button"
                icon={IconNames.CAMERA}
                active={!videoIsActive}
                onClick={this.onClickStill}
                text="Pause Video"
              />
            </ButtonGroup>
          </div>
          <Divider />
          <div
            className="sa-video-header-element"
            style={{ display: displayOptions ? 'inherit' : 'none' }}
          >
            <div className="sa-video-header-numeric-input">
              {/* <Tooltip2 content='Change width'> */}
              <NumericInput
                disabled
                leftIcon={IconNames.HORIZONTAL_DISTRIBUTION}
                style={{ width: 70 }}
                value={width}
                onValueChange={this.handleWidthChange}
                minorStepSize={1}
                stepSize={10}
                majorStepSize={100}
                max={MAX_WIDTH}
                min={MIN_WIDTH}
              />
              {/* </Tooltip2> */}
            </div>
            <div className="sa-video-header-numeric-input">
              {/* <Tooltip2 content='Change height'> */}
              <NumericInput
                disabled
                leftIcon={IconNames.VERTICAL_DISTRIBUTION}
                style={{ width: 70 }}
                value={height}
                onValueChange={this.handleHeightChange}
                minorStepSize={1}
                stepSize={10}
                majorStepSize={100}
                max={MAX_HEIGHT}
                min={MIN_HEIGHT}
              />
              {/* </Tooltip2> */}
            </div>
            <div className="sa-video-header-numeric-input">
              {/* <Tooltip2 content='Change FPS'> */}
              <NumericInput
                leftIcon={IconNames.STOPWATCH}
                style={{ width: 60 }}
                value={FPS}
                onValueChange={this.handleFPSChange}
                minorStepSize={null}
                stepSize={1}
                majorStepSize={null}
                max={MAX_FPS}
                min={MIN_FPS}
              />
              {/* </Tooltip2> */}
            </div>
          </div>
        </div>
        <div className="sa-video-element">
          <img
            ref={(r) => {
              this.$image = r;
            }}
            width={DEFAULT_WIDTH}
            height={DEFAULT_HEIGHT}
            style={{ display: 'none' }}
          />
          <video
            ref={(r) => {
              this.$video = r;
            }}
            autoPlay
            width={DEFAULT_WIDTH}
            height={DEFAULT_HEIGHT}
            style={{ display: 'none' }}
          />
          <canvas
            ref={(r) => {
              this.$canvas = r;
            }}
            width={DEFAULT_WIDTH}
            height={DEFAULT_HEIGHT}
            style={{ display: !isAccepting ? 'initial' : 'none' }}
          />
          <br />
          <div style={{ display: isAccepting ? 'inherit' : 'none' }}>
            <div style={{ fontSize: 40 }}>Drag file here</div>
            <br />
            <input type="file" onChange={this.handleFileUpload} />
          </div>
          <br />
          <div
            style={{ display: hasAudio && !isAccepting ? 'inherit' : 'none' }}
          >
            Volume:
            <input
              type="range"
              onChange={this.handleVolumeChange}
              min={0}
              max={1}
              value={volume}
              step={0.01}
            />
          </div>
          <p
            style={{
              display: displayOptions ? 'inherit' : 'none',
              fontFamily: 'arial',
            }}
          >
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
  body: (debuggerContext: any) => (
    <PixNFlix debuggerContext={debuggerContext} />
  ),
  label: 'PixNFlix Live Feed',
  iconName: 'mobile-video',
};
