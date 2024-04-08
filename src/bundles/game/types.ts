import * as Phaser from 'phaser';

export type ObjectConfig = { [attr: string]: any };

export type RawGameElement =
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.Text;

export type RawGameShape =
  Phaser.GameObjects.Ellipse | Phaser.GameObjects.Rectangle;

export type RawGameObject = RawGameElement | RawGameShape;

export type RawContainer = Phaser.GameObjects.Container;

export type RawInputObject =
  | Phaser.Input.InputPlugin
  | Phaser.Input.Keyboard.Key;

export type GameObject = {
  type: string;
  object: RawContainer | RawGameObject | RawInputObject | undefined;
};

export type GameParams = {
  scene: Phaser.Scene | undefined;
  preloadImageMap: Map<string, string>;
  preloadSoundMap: Map<string, string>;
  preloadSpritesheetMap: Map<string, [string, object]>;
  lifecycleFuncs: {
    preload: () => void;
    create: () => void;
    update: () => void;
  };
  renderPreview: boolean;
  remotePath: (path: string) => string;
  screenSize: { x: number; y: number };
  createAward: (x: number, y: number, key: string) => Phaser.GameObjects.Sprite;
};

export const sourceAcademyAssets = 'https://source-academy-assets.s3-ap-southeast-1.amazonaws.com';

// Scene needs to be set when available!
export const defaultGameParams: GameParams = {
  scene: undefined,
  preloadImageMap: new Map<string, string>(),
  preloadSoundMap: new Map<string, string>(),
  preloadSpritesheetMap: new Map<string, [string, object]>(),
  lifecycleFuncs: {
    preload() {},
    create() {},
    update() {}
  },
  renderPreview: false,
  remotePath: (path: string) => sourceAcademyAssets + (path[0] === '/' ? '' : '/') + path,
  screenSize: {
    x: 1920,
    y: 1080
  },
  createAward: (x: number, y: number, key: string) => new Phaser.GameObjects.Sprite(defaultGameParams.scene!, x, y, key)
};
