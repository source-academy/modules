import Phaser from 'phaser';
import { GameObject, TextGameObject } from './gameobject';
import {
  userUpdateFunction,
} from './functions';

/**
 * The Phaser scene that parses the GameObjects and update loop created by the user,
 * into Phaser GameObjects, and Phaser updates.
 */
export default class PhaserScene extends Phaser.Scene {
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
        textObject.text = textObject.text.substr(0, textObject.text.length - 1);
      } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
        textObject.text += event.key;
      }
    });
  }

  update() {
    // Run the user-defined update function
    userUpdateFunction(this.userGameStateArray);
    // Loop through each GameObject in the array and determine which needs to update.
    this.sourceGameObjects.forEach((gameObject) => {
      if (gameObject.hasTransformUpdates) {
        // update the transform of Phaser GameObject
        const transformProps = gameObject.getTransform();
        Phaser.Actions.SetXY([this.phaserGameObjects[gameObject.id]], transformProps.position[0], transformProps.position[1]);
        // #TODO
      }
    });
  }
}
