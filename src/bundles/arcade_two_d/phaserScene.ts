import Phaser from 'phaser';
import { GameObject, SpriteGameObject, TextGameObject } from './gameobject';
import {
  userUpdateFunction,
} from './functions';
import { type TransformProps } from './types';

// Store keys that are down in the Phaser Scene
// By default, this is empty, unless a key is down
export let inputKeysDown = new Set<string>();

// the current in-game time
export let gameTime: number;

// the time between frames
export let gameDelta: number;

// the current (mouse) pointer position in the canvas
export let pointerPosition: [number, number];

// true if (left mouse button) pointer down, false otherwise
export let pointerPrimaryDown: boolean;

/**
 * The Phaser scene that parses the GameObjects and update loop created by the user,
 * into Phaser GameObjects, and Phaser updates.
 */
export class PhaserScene extends Phaser.Scene {
  constructor() {
    super('PhaserScene');
  }
  // private spacebar;
  private sourceGameObjects;
  private phaserGameObjects;
  private userGameStateArray;
  private corsAssets;

  init() {
    // Assign values to constants here
    this.sourceGameObjects = GameObject.getGameObjectsArray();
    this.phaserGameObjects = [];
    this.userGameStateArray = [];
    // And get assets
    this.corsAssets = new Set();
  }

  preload() {
    this.sourceGameObjects.forEach((gameObject) => {
      if (gameObject instanceof SpriteGameObject) {
        this.corsAssets.add(gameObject.getSprite().image_url);
      }
    });

    this.load.setPath('https://source-academy-assets.s3-ap-southeast-1.amazonaws.com/');
    this.corsAssets.forEach((url) => {
      // preload assets for sprites (through Cross-Origin resource sharing (CORS))
      this.load.image(url, url);
    });
  }

  create() {
    this.sourceGameObjects.forEach((gameObject) => {
      const transformProps = gameObject.getTransform();
      // Create TextGameObject
      if (gameObject instanceof TextGameObject) {
        // gameObject = gameObject as TextGameObject;
        const text = gameObject.getText().text;

        this.phaserGameObjects.push(this.add.text(
          transformProps.position[0],
          transformProps.position[1],
          text,
        ));
        if (gameObject.getHitboxState().hitboxActive) {
          this.phaserGameObjects[gameObject.id].setInteractive();
        }
      }
      // else is another type of GameObject
      if (gameObject instanceof SpriteGameObject) {
        const url = gameObject.getSprite().image_url;
        this.phaserGameObjects.push(this.add.sprite(
          transformProps.position[0],
          transformProps.position[1],
          url,
        ));
      }
    });

    // Keyboard events can be detected inside the Source editor, which is not intended. #BUG
    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      inputKeysDown.add(event.key);
    });
  }

  update(time, delta) {
    // Set the time and delta #BUG: Game time doesn't reset when rerun
    gameTime = Math.trunc(time);
    gameDelta = delta;

    // Set the pointer
    pointerPosition = [Math.trunc(this.input.activePointer.x), Math.trunc(this.input.activePointer.y)];
    pointerPrimaryDown = this.input.activePointer.primaryDown;

    // Run the user-defined update function
    userUpdateFunction(this.userGameStateArray);
    // Loop through each GameObject in the array and determine which needs to update.
    this.sourceGameObjects.forEach((gameObject) => {
      const phaserGameObject = this.phaserGameObjects[gameObject.id] as Phaser.GameObjects.GameObject;
      if (gameObject.hasTransformUpdates) {
        // update the transform of Phaser GameObject
        const transformProps = gameObject.getTransform() as TransformProps;
        Phaser.Actions.SetXY([phaserGameObject], transformProps.position[0], transformProps.position[1]);
        Phaser.Actions.SetScale([phaserGameObject], transformProps.scale[0], transformProps.scale[1]);
        Phaser.Actions.SetRotation([phaserGameObject], transformProps.rotation);
        gameObject.updatedTransform();
      }
      if (gameObject.hasRenderUpdates) {
        // update the image of PhaserGameObject
        if (gameObject instanceof TextGameObject) {
          const color = gameObject.getColor();
          const intColor = Phaser.Display.Color.GetColor32(color[0], color[1], color[2], color[3]);
          (phaserGameObject as Phaser.GameObjects.Text).setTintFill(intColor);
          (phaserGameObject as Phaser.GameObjects.Text).setText(gameObject.getText().text);
          gameObject.updatedRender();
        }
      }
      if (gameObject.hasHitboxUpdates) {
        // update the hitbox of PhaserGameObject
        if (gameObject.getHitboxState().hitboxActive) {
          this.phaserGameObjects[gameObject.id].setInteractive();
        } else {
          this.phaserGameObjects[gameObject.id].disableInteractive();
        }
        gameObject.updatedHitbox();
      }
    });

    // reset the keysDown array:
    inputKeysDown.clear();
  }
}
