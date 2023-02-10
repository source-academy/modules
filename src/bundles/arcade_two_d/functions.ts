/**
 * The module `arcade_two_d` is a wrapper for the Phaser.io game engine.
 * It provides functions for manipulating GameObjects in a canvas.
 *
 * A *GameObject* is defined by its transform and rendered object.
 * @module arcade_two_d
 * @author Titus Chew Xuan Jun
 * @author Xenos Fiorenzo Anong
 */

import {
  GameObject, ShapeGameObject, TextGameObject,
} from './gameobject';
import {
  BaseShape,
  DisplayText,
  InteractableProps,
  RenderProps,
  Shape,
  TransformProps,
} from './types';

// =============================================================================
// Shape references
// =============================================================================


// =============================================================================
// Creation of GameObjects
// =============================================================================

/**
 * Creates a GameObject that renders a shape of unit size in the canvas.
 *
 * @param shape Shape reference
 * @category Primitive
 */
export const createShapeGameObject: (baseShape: BaseShape) => ShapeGameObject = (baseShape: BaseShape) => {
  const transform: TransformProps = {
    position: [0, 0],
    scale: [0, 0],
    rotation: 0,
  };
  const renderProps: RenderProps = {
    color: {
      red: 255,
      green: 255,
      blue: 255,
      alpha: 255,
    },
    flip: [false, false],
    visible: true,
    renderedImage: {
      phaserType: 'Shape',
      baseShape,
    } as Shape,
  };
  const interactableProps: InteractableProps = {
    hitboxActive: true,
  };

  const gameObject = new ShapeGameObject(transform, renderProps, interactableProps);

  return gameObject;
};

/**
 * Creates a GameObject that renders text of unit size in the canvas.
 *
 * @param text Text string displayed
 * @category Primitive
 */
export const createTextGameObject: (text: string) => TextGameObject = (text: string) => {
  const transform: TransformProps = {
    position: [0, 0],
    scale: [0, 0],
    rotation: 0,
  };
  const renderProps: RenderProps = {
    color: {
      red: 255,
      green: 255,
      blue: 255,
      alpha: 255,
    },
    flip: [false, false],
    visible: true,
    renderedImage: {
      text,
    } as DisplayText,
  };
  const interactableProps: InteractableProps = {
    hitboxActive: true,
  };

  const gameObject = new TextGameObject(transform, renderProps, interactableProps);

  return gameObject;
};

// =============================================================================
// Manipulation of GameObjects
// =============================================================================

/**
 * Updates the position transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @param coordinates [x, y] coordinates of new position
 * @example
 * ```
 * updateGameObjectPosition(createTextGameObject(""), [1, 1]);
 * ```
 * @category Update
 */
export const updateGameObjectPosition: (gameObject: GameObject, [x, y]: [number, number]) => void
= (gameObject: GameObject, [x, y]: [number, number]) => {
  gameObject.setTransform({
    ...gameObject.getTransform(),
    position: [x, y],
  });
};

/**
 * Updates the text of the TextGameObject.
 *
 * @param textGameObject TextGameObject reference
 * @param text The updated text of the TextGameObject
 */
export const updateGameObjectText: (textGameObject: TextGameObject, text: string) => void
= (textGameObject: TextGameObject, text: string) => {
  console.log(textGameObject);
  console.log(textGameObject instanceof GameObject);
  console.log(textGameObject instanceof TextGameObject);
  if (textGameObject instanceof TextGameObject) {
    textGameObject.setText({
      text,
    } as DisplayText);
    return;
  }
  throw new Error('Cannot update text onto a non TextGameObject');
};

// =============================================================================
// Querying of GameObjects
// =============================================================================

/**
 * Queries the id of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns the id of the GameObject reference
 * @example
 * ```
 * queryGameObjectId(createTextGameObject(""));
 * ```
 * @category Query
 */
export const queryGameObjectId: (gameObject: GameObject) => number = (gameObject: GameObject) => gameObject.id;

/**
 * Queries the [x, y] position transform of the GameObject.
 *
 * @param gameObject GameObject reference
 *
 * @category Query
 */
export const queryGameObjectPosition: (gameObject: GameObject) => [number, number]
= (gameObject: GameObject) => gameObject.getTransform().position;

/**
 * Queries the text of a Text GameObject.
 *
 * @param textGameObject TextGameObject reference
 *
 * @category Query
 */
export const queryGameObjectText: (textGameObject: TextGameObject) => string
= (textGameObject: TextGameObject) => {
  if (textGameObject instanceof TextGameObject) {
    return textGameObject.getText().text;
  }
  throw new Error('Cannot query text from non TextGameObject');
};
