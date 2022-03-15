/* eslint-disable max-classes-per-file */
/* eslint-disable react/destructuring-assignment */

// eslint-disable-next-line @typescript-eslint/naming-convention
export abstract class glAnimation {
  constructor(public readonly numFrames: number) {}

  public abstract getFrame(num: number): AnimFrame;
}

export interface AnimFrame {
  draw: (canvas: HTMLCanvasElement) => void;
}

/*
type Props = {
  animation: glAnimation;
};

// type State = {
  currentFrame: number;
  isPlaying: boolean;
  autoPlay: boolean;
  frameDuration: number;
};


export class AnimationCanvas extends React.Component<Props, State> {
  private canvas: HTMLCanvasElement | null;

  private step: number;

  private prevTimestamp: number;

  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      currentFrame: 0,
      isPlaying: true,
      autoPlay: false,
      frameDuration: 10 / 24,
    };

    this.canvas = null;
    this.step = 1 / props.animation.numFrames;
    this.prevTimestamp = 0;
  }

  public componentDidMount() {
    this.drawFrame();
  }

  private drawFrame = () => {
    if (this.canvas) {
      const frame = this.props.animation.getFrame(this.state.currentFrame);
      frame.draw(this.canvas);
    }
  };

  private animationCallback = (timestamp) => {
    if (this.canvas && this.state.isPlaying) {
      if (timestamp - this.prevTimestamp < this.state.frameDuration) {
        // Not time to draw the frame yet
        requestAnimationFrame(this.animationCallback);
        return;
      }

      this.drawFrame();
      this.prevTimestamp = timestamp;

      if (this.state.currentFrame >= 1) {
        // CurrentFrame exceeded
        if (this.state.autoPlay) {
          // Autoplay is on
          this.setState(
            () => ({
              currentFrame: 0,
            }),
            () => setTimeout(this.animationCallback, this.state.frameDuration)
          );
        } else {
          // Autoplay isn't on
          this.setState({
            isPlaying: false,
          });
        }
      } else {
        this.setState(
          (prev) => ({
            currentFrame: this.step + prev.currentFrame,
          }),
          () => requestAnimationFrame(this.animationCallback)
        );
      }
    }
  };

  private onPlayButtonClick = () => {
    if (this.state.isPlaying) {
      this.setState({
        isPlaying: false,
      });
    } else if (this.state.currentFrame >= 1) {
      this.setState(
        {
          currentFrame: 0,
          isPlaying: true,
        },
        () => requestAnimationFrame(this.animationCallback)
      );
    } else {
      this.setState(
        () => ({
          isPlaying: true,
        }),
        () => requestAnimationFrame(this.animationCallback)
      );
    }
  };

  private onResetButtonClick = () => {
    this.setState(
      () => ({
        currentFrame: 0,
      }),
      () => requestAnimationFrame(this.animationCallback)
    );
  };

  private autoPlaySwitchChanged = () => {
    this.setState((prev) => ({
      autoPlay: !prev.autoPlay,
    }));
  };

  private onFPSChanged = (event) => {
    const frameDuration = 10 / parseFloat(event.target.value);
    this.setState({
      frameDuration,
    });
  };

  public render() {
    return (
      <div>
        <div>
          <canvas
            ref={(r) => {
              this.canvas = r;
            }}
            height={500}
            width={500}
          />
        </div>
        <div
          style={{
            display: 'flex',
            padding: '10px',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button onClick={this.onPlayButtonClick} />
          <input
            type='number'
            min={0}
            max={1000}
            value={10 * this.state.frameDuration}
            onChange={this.onFPSChanged}
          />
          <Button onClick={this.onResetButtonClick}>
            <Icon icon={IconNames.RESET} />
          </Button>
          <Switch
            label='Auto Play'
            onChange={this.autoPlaySwitchChanged}
            checked={this.state.autoPlay}
          />
        </div>
      </div>
    );
  }
} */
