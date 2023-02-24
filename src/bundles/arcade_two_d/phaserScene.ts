import Phaser from 'phaser';
import { GameObject, TextGameObject } from './gameobject';
import {
  userUpdateFunction,
  inputKeysDown,
} from './functions';
import { type TransformProps } from './types';

export let gameTime: number;
export let gameDelta: number;
let startTime: number;

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

  init() {
    // Assign values to constants here
    // this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.sourceGameObjects = GameObject.getGameObjectsArray();
    this.phaserGameObjects = [];
    this.userGameStateArray = [];
    // And get assets
  }

  create() {
    this.sourceGameObjects.forEach((gameObject) => {
      // Create TextGameObject
      if (gameObject instanceof TextGameObject) {
        // gameObject = gameObject as TextGameObject;
        const transformProps = gameObject.getTransform();
        const text = gameObject.getText().text;

        this.phaserGameObjects.push(this.add.text(
          transformProps.position[0],
          transformProps.position[1],
          text,
        ));

        // const color = gameObject.getColor();
        // const intColor = Phaser.Display.Color.GetColor32(color[0], color[1], color[2], color[3]);
        // this.phaserGameObjects[gameObject.id].setTint(intColor);
      }
      // else is another type of GameObject
    });

    // Keyboard events can be detected inside the Source editor, which is not intended. #BUG
    this.input.keyboard.on('keydown', (event) => {
      const textObject = this.phaserGameObjects[0]; // placeholder
      if (textObject === undefined) {
        console.log('textObject undefined');
        return;
      }
      if (event.keyCode === 8 && textObject.text.length > 0) {
        // textObject.text = textObject.text.substr(0, textObject.text.length - 1);
      } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
        inputKeysDown.add(event.key);
        // textObject.text += event.key;
      }
    });
  }

  update(time, delta) {
    // Set the time and delta #BUG: Game time doesn't reset when rerun
    gameTime = Math.trunc(time);
    gameDelta = delta;

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
      }
      if (gameObject.hasRenderUpdates) {
        // update the image of PhaserGameObject
        if (gameObject instanceof TextGameObject) {
          const color = gameObject.getColor();
          const intColor = Phaser.Display.Color.GetColor32(color[0], color[1], color[2], color[3]);
          (phaserGameObject as Phaser.GameObjects.Text).setTint(intColor);
          (phaserGameObject as Phaser.GameObjects.Text).setText(gameObject.getText().text);
        }
      }
    });

    // reset the keysDown array:
    inputKeysDown.clear();
  }
}
