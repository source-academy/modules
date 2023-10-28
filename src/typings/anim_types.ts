/**
 * Represents an animation drawn using WebGL
 * @field duration Duration of the animation in secondss
 * @field fps Framerate in frames per second
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export abstract class glAnimation {
  constructor(public readonly duration: number, public readonly fps: number) {}

  public abstract getFrame(timestamp: number): AnimFrame;

  public static isAnimation = (obj: any): obj is glAnimation => obj.fps !== undefined;
}

export interface AnimFrame {
  draw: (canvas: HTMLCanvasElement) => void;
}
