import Phaser from 'phaser';

/**
 * Example phaser game scene to test display functionality.
 * Displays the text "Hello World!" that continuously moves up and down on the canvas.
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
