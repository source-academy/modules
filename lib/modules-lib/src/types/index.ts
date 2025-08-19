import type { IconName } from '@blueprintjs/icons';
import type { Context } from 'js-slang';
import type React from 'react';

/**
 * Represents an animation drawn using WebGL
 */
export abstract class glAnimation {
  constructor(
    /**
     * Duration of the animation in seconds
     */
    public readonly duration: number,
    /**
     * Framerate in frames per second
     */
    public readonly fps: number
  ) { }

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

export type ModuleTab = (props: { context: DebuggerContext }) => React.ReactNode;

export type ModuleSideContent = {
  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: IconName;
  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: string;
  /**
   * This function will be called to determine if the component will be
   * rendered
   */
  toSpawn?: (context: DebuggerContext) => boolean;
  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   */
  body: (context: DebuggerContext) => JSX.Element;
};
