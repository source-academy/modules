/* eslint-disable */

export declare namespace Phaser {
    class Scene {
        /**
         * 
         * @param config Scene specific configuration settings.
         */
        constructor(config: string);
    }

    namespace Input {
        namespace Keyboard {
            class Key {}
        }
        class InputPlugin{
            /**
             * 
             * @param scene A reference to the Scene that this Input Plugin is responsible for.
             */
            constructor(scene: Phaser.Scene);
        }
    }

    namespace GameObjects {
        class GameObject {
            /**
             * 
             * @param scene The Scene to which this Game Object belongs.
             * @param type A textual representation of the type of Game Object, i.e. `sprite`.
             */
            constructor(scene: Phaser.Scene, type: string);
        }

        class Sprite extends Phaser.GameObjects.GameObject {
            /**
             * 
             * @param scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
             * @param x The horizontal position of this Game Object in the world.
             * @param y The vertical position of this Game Object in the world.
             * @param texture The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
             * @param frame An optional frame from the Texture this Game Object is rendering with.
             */
            constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number);
        }

        class Text extends Phaser.GameObjects.GameObject {
            /**
             * 
             * @param scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
             * @param x The horizontal position of this Game Object in the world.
             * @param y The vertical position of this Game Object in the world.
             * @param text The text this Text object will display.
             * @param style The text style configuration object.
             */
            constructor(scene: Phaser.Scene, x: number, y: number, text: string | string[], style: Config);

        }
        class Container extends Phaser.GameObjects.GameObject {
            /**
             * 
             * @param scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
             * @param x The horizontal position of this Game Object in the world. Default 0.
             * @param y The vertical position of this Game Object in the world. Default 0.
             * @param children An optional array of Game Objects to add to this Container.
             */
            constructor(scene: Phaser.Scene, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[]);
        }

        class Shape extends Phaser.GameObjects.GameObject {
            /**
             * 
             * @param scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
             * @param type The internal type of the Shape.
             * @param data The data of the source shape geometry, if any.
             */
            constructor(scene: Phaser.Scene, type?: string, data?: any);
        }

        class Rectangle extends Phaser.GameObjects.Shape {
            /**
             * 
             * @param scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
             * @param x The horizontal position of this Game Object in the world.
             * @param y The vertical position of this Game Object in the world.
             * @param width The width of the rectangle. Default 128.
             * @param height The height of the rectangle. Default 128.
             * @param fillColor The color the rectangle will be filled with, i.e. 0xff0000 for red.
             * @param fillAlpha The alpha the rectangle will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
             */
            constructor(scene: Phaser.Scene, x: number, y: number, width?: number, height?: number, fillColor?: number, fillAlpha?: number);
        }

        class Ellipse extends Phaser.GameObjects.Shape {
            /**
             * 
             * @param scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
             * @param x The horizontal position of this Game Object in the world. Default 0.
             * @param y The vertical position of this Game Object in the world. Default 0.
             * @param width The width of the ellipse. An ellipse with equal width and height renders as a circle. Default 128.
             * @param height The height of the ellipse. An ellipse with equal width and height renders as a circle. Default 128.
             * @param fillColor The color the ellipse will be filled with, i.e. 0xff0000 for red.
             * @param fillAlpha The alpha the ellipse will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
             */
            constructor(scene: Phaser.Scene, x?: number, y?: number, width?: number, height?: number, fillColor?: number, fillAlpha?: number);
        }
    }
}

export type Config = { [attr: string] : any };