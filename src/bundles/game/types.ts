import type * as Phaser from 'phaser';

export type List = [any, List] | null;

export type ObjectConfig = { [attr: string]: any };

export type RawGameElement =
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.Text;

export type RawGameShape =
  | Phaser.GameObjects.Rectangle
  | Phaser.GameObjects.Ellipse;

export type RawGameObject = RawGameElement | RawGameShape;

export type RawContainer = Phaser.GameObjects.Container;

export type RawInputObject =
  | Phaser.Input.InputPlugin
  | Phaser.Input.Keyboard.Key;

export type GameObject = {
  type: string;
  object: RawGameObject | RawInputObject | RawContainer | undefined;
};


export type GameParams = {
  scene: Phaser.Scene;
  preloadImageMap: Map<string, string>;
  preloadSoundMap: Map<string, string>;
  preloadSpritesheetMap: Map<string, [string, object]>;
  remotePath: (path: string) => string;
  screenSize: { x: number; y: number };
  createAward: (x: number, y: number, key: string) => Phaser.GameObjects.Sprite;
};
