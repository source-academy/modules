/* eslint-disable max-classes-per-file */
/* eslint-disable react/destructuring-assignment */

/**
 * Represents an animation drawn using WebGL
 * @field duration Duration of the animation in secondss
 * @field fps Framerate in frames per second
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export abstract class glAnimation {
  constructor(public readonly duration: number, public readonly fps: number) {}

  public abstract getFrame(timestamp: number): AnimFrame;

  public static isAnimation = (obj: any) => obj.fps !== undefined;
}

export interface AnimFrame {
  draw: (canvas: HTMLCanvasElement) => void;
}

// type AnimCanvasProps = {
//   animation: glAnimation;
// };

// type AnimCanvasState = {
//   /** Timestamp of the animation */
//   animTimestamp: number;

//   /** Boolean value indicating if the animation is playing */
//   isPlaying: boolean;

//   /** Previous value of `isPlaying` */
//   wasPlaying: boolean;

//   /** Boolean value indicating if auto play is selected */
//   autoPlay: boolean;
// };

/**
 * Canvas to display glAnimations
 */
// For some reason, I can't get this component to build
// with the blueprint/js components if it's located here
// export class AnimationCanvas extends React.Component<
//   AnimCanvasProps,
//   AnimCanvasState
// > {
//   private canvas: HTMLCanvasElement | null;

//   /**
//    * The duration of one frame in milliseconds
//    */
//   private readonly frameDuration: number;

//   /**
//    * The duration of the entire animation
//    */
//   private readonly animationDuration: number;

//   /**
//    * Last timestamp since the previous `requestAnimationFrame` call
//    */
//   private callbackTimestamp: number;

//   constructor(props: AnimCanvasProps | Readonly<AnimCanvasProps>) {
//     super(props);

//     this.state = {
//       animTimestamp: 0,
//       isPlaying: false,
//       wasPlaying: false,
//       autoPlay: true,
//     };

//     this.canvas = null;
//     this.frameDuration = 1000 / props.animation.fps;
//     this.animationDuration = Math.round(props.animation.duration * 1000);
//     this.callbackTimestamp = 0;
//   }

//   public componentDidMount() {
//     this.drawFrame();
//   }

//   /**
//    * Call this to actually draw a frame onto the canvas
//    */
//   private drawFrame = () => {
//     if (this.canvas) {
//       const frame = this.props.animation.getFrame(
//         this.state.animTimestamp / 1000
//       );
//       frame.draw(this.canvas);
//     }
//   };

//   private reqFrame = () => requestAnimationFrame(this.animationCallback);

//   /**
//    * Callback to use with `requestAnimationFrame`
//    */
//   private animationCallback = (timeInMs: number) => {
//     if (!this.canvas || !this.state.isPlaying) return;

//     const currentFrame = timeInMs - this.callbackTimestamp;

//     if (currentFrame < this.frameDuration) {
//       // Not time to draw a new frame yet
//       this.reqFrame();
//       return;
//     }

//     this.callbackTimestamp = timeInMs;
//     if (this.state.animTimestamp >= this.animationDuration) {
//       // Animation has ended
//       if (this.state.autoPlay) {
//         // If autoplay is active, reset the animation
//         this.setState(
//           {
//             animTimestamp: 0,
//           },
//           this.reqFrame
//         );
//       } else {
//         // Otherwise, stop the animation
//         this.setState({
//           isPlaying: false,
//         });
//       }
//     } else {
//       // Animation hasn't ended, so just draw the next frame
//       this.setState(
//         (prev) => ({
//           animTimestamp: prev.animTimestamp + currentFrame,
//         }),
//         () => {
//           this.drawFrame();
//           this.reqFrame();
//         }
//       );
//     }
//   };

//   /**
//    * Play button click handler
//    */
//   private onPlayButtonClick = () => {
//     if (this.state.isPlaying) {
//       this.setState({
//         isPlaying: false,
//       });
//     } else {
//       this.setState(
//         {
//           isPlaying: true,
//         },
//         this.reqFrame
//       );
//     }
//   };

//   /**
//    * Reset button click handler
//    */
//   private onResetButtonClick = () => {
//     this.setState(
//       {
//         animTimestamp: 0,
//       },
//       () => {
//         if (this.state.isPlaying) this.reqFrame();
//         else this.drawFrame();
//       }
//     );
//   };

//   /**
//    * Slider value change handler
//    * @param newValue New value of the slider
//    */
//   private onSliderChange = (newValue: number) => {
//     this.setState(
//       (prev) => ({
//         wasPlaying: prev.isPlaying,
//         isPlaying: false,
//         animTimestamp: newValue,
//       }),
//       this.drawFrame
//     );
//   };

//   /**
//    * Handler triggered when the slider is clicked off
//    */
//   private onSliderRelease = () => {
//     this.setState(
//       (prev) => ({
//         isPlaying: prev.wasPlaying,
//       }),
//       this.reqFrame
//     );
//   };

//   /**
//    * Auto play switch handler
//    */
//   private autoPlaySwitchChanged = () => {
//     this.setState((prev) => ({
//       autoPlay: !prev.autoPlay,
//     }));
//   };

//   public render() {
//     return (
//       <>
//         <div
//           style={{
//             alignItems: 'center',
//           }}
//         >
//           <canvas
//             style={{
//               width: '100%',
//             }}
//             ref={(r) => {
//               this.canvas = r;
//             }}
//             height={512}
//             width={512}
//           />
//         </div>
//         <div
//           style={{
//             display: 'flex',
//             padding: '10px',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'right',
//           }}
//         >
//           <div
//             style={{
//               float: 'right',
//               marginRight: '20px',
//             }}
//           >
//             <Tooltip2 content={this.state.isPlaying ? 'Pause' : 'Play'}>
//               <Button onClick={this.onPlayButtonClick}>
//                 <Icon
//                   icon={this.state.isPlaying ? IconNames.PAUSE : IconNames.PLAY}
//                 />
//               </Button>
//             </Tooltip2>
//           </div>
//           <div
//             style={{
//               marginRight: '20px',
//             }}
//           >
//             <Tooltip2 content='Reset'>
//               <Button onClick={this.onResetButtonClick}>
//                 <Icon icon={IconNames.RESET} />
//               </Button>
//             </Tooltip2>
//           </div>
//           <div
//             style={{
//               marginLeft: '20px',
//             }}
//           >
//             <Slider
//               value={this.state.animTimestamp}
//               onChange={this.onSliderChange}
//               onRelease={this.onSliderRelease}
//               stepSize={1}
//               labelRenderer={false}
//               min={0}
//               max={this.animationDuration}
//             />
//           </div>
//           <Switch
//             label='Auto Play'
//             onChange={this.autoPlaySwitchChanged}
//             checked={this.state.autoPlay}
//           />
//         </div>
//       </>
//     );
//   }
// }
