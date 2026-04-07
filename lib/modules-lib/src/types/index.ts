import type { IconName } from '@blueprintjs/icons';
import type { Context } from 'js-slang';
import type React from 'react';

const glAnimationSymbol = Symbol.for('glAnimation');

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

  /**
   * Because of the way bundles and tabs are built, the tab and the bundle might end up with two
   * separate instances of `@sourceacademy/modules-lib` bundled. Then there are two instances of
   * the `glAnimation` class, so using an `instanceof` check no longer works properly.
   *
   * Instead, we hide a special symbol which should be the same no matter which instance of `glAnimation` to
   * perform the `isAnimation` check.
   */
  public get _anim_symbol(): typeof glAnimationSymbol {
    return glAnimationSymbol;
  }

  public abstract getFrame(timestamp: number): AnimFrame;

  /**
   * Because of some quirks in the way tabs and bundles are built, an `instanceof` check might fail at runtime.
   * You should use this function instead of an `instanceof` check to check for `glAnimations`.
   */
  public static isAnimation(obj: unknown): obj is glAnimation {
    if (typeof obj !== 'object' || obj === null) return false;

    return '_anim_symbol' in obj && obj._anim_symbol === glAnimationSymbol;
  }
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

export interface ModuleSideContent {
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
