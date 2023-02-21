import Phaser from 'phaser';

/**
 * "Hello World" example phaser game scene to test display functionality.
 * 
 * @author Xenos Fiorenzo Anong
 * @author Titus Chew Xuan Jun
 */

export default class HelloWorld extends Phaser.Scene {
  constructor() {
    super('HelloWorld');
  }

  create() {
    const text = this.add.text(250, 100, 'Hello World!');

    this.tweens.add({
      targets: text,
      y: 400,
      duration: 2000,
      ease: 'Cubic.easeInOut',
      yoyo: true,
      loop: -1,
    });
  }
}
