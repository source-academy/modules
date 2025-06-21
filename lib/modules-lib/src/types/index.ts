import type { Context } from 'js-slang';
import type { FC } from 'react';

/**
 * Represents an animation drawn using WebGL
 * @field duration Duration of the animation in secondss
 * @field fps Framerate in frames per second
 */
export abstract class glAnimation {
  constructor(public readonly duration: number, public readonly fps: number) { }

  public abstract getFrame(timestamp: number): AnimFrame;

  public static isAnimation = (obj: any): obj is glAnimation => obj.fps !== undefined;
}
export interface AnimFrame {
  draw: (canvas: HTMLCanvasElement) => void;
}
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

/**
 * DebuggerContext type used by frontend to assist typing information
 */
export type DebuggerContext = {
  result: any;
  lastDebuggerResult: any;
  code: string;
  context: Context;
  workspaceLocation?: any;
};

export type ModuleContexts = Context['moduleContexts'];

/**
 * Interface to represent objects that require a string representation in the
 * REPL
 */
export interface ReplResult {
  toReplString: () => string;
}

export type ModuleTab = FC<{ context: DebuggerContext }>;
