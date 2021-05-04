import * as Phaser from 'phaser';

export type ObjectConfig = { [attr: string]: any };

export type GameElement = Phaser.GameObjects.Sprite | Phaser.GameObjects.Text;

export type GameShape =
  | Phaser.GameObjects.Rectangle
  | Phaser.GameObjects.Ellipse;

export type GameObject = GameElement | GameShape;

export type Container = Phaser.GameObjects.Container;

export type InputObject = Phaser.Input.InputPlugin | Phaser.Input.Keyboard.Key;

export type TypedGameObject = [
  type: string,
  object: GameObject | InputObject | Container
];

export type GameParams = {
  scene: Phaser.Scene;
  phaser: any;
  preloadImageMap: Map<string, string>;
  preloadSoundMap: Map<string, string>;
  preloadSpritesheetMap: Map<string, [string, object]>;
  remotePath: string;
  screenSize: { x: number; y: number };
  createAward: (x: number, y: number, key: string) => Phaser.GameObjects.Sprite;
};
