/**
 * This file contains the bundle's representation of GameObjects.
 */
import type { ReplResult } from '../../typings/type_helpers';
import { DEFAULT_INTERACTABLE_PROPS, DEFAULT_RENDER_PROPS, DEFAULT_TRANSFORM_PROPS } from './constants';
import type * as types from './types';

// =============================================================================
// Classes
// =============================================================================

/**
 * Encapsulates the basic data-representation of a GameObject.
 */
export abstract class GameObject implements Transformable, ReplResult {
  private static gameObjectCount: number = 0;
  protected static gameObjectsArray: InteractableGameObject[] = []; // Stores all the created GameObjects
  protected isTransformUpdated: boolean = false;
  public readonly id: number;

  constructor(
    private transformProps: types.TransformProps = DEFAULT_TRANSFORM_PROPS,
  ) {
    this.id = GameObject.gameObjectCount++;
  }
  setTransform(transformProps: types.TransformProps) {
    this.transformProps = transformProps;
    this.isTransformUpdated = false;
  }
  getTransform(): types.TransformProps {
    return this.transformProps;
  }
  hasTransformUpdates(): boolean {
    return !this.isTransformUpdated;
  }
  setTransformUpdated() {
    this.isTransformUpdated = true;
  }

  /**
   * This method is called when init() Phaser Scene.
   * @returns The GameObjects as an array.
   */
  public static getGameObjectsArray() {
    return GameObject.gameObjectsArray;
  }

  public toReplString = () => '<GameObject>';
}

/**
 * Encapsulates the basic data-representation of a RenderableGameObject.
 */
export abstract class RenderableGameObject extends GameObject implements Renderable {
  protected isRenderUpdated: boolean = false;
  private shouldBringToTop: boolean = false;

  constructor(
    transformProps: types.TransformProps,
    private renderProps: types.RenderProps = DEFAULT_RENDER_PROPS,
  ) {
    super(transformProps);
  }

  setRenderState(renderProps: types.RenderProps) {
    // if (renderProps.renderedImage === undefined || this.phaserType === undefined) {
    //   throw new Error('GameObject\'s render image type is undefined');
    // }
    // if (this.phaserType in renderProps.renderedImage) {
    //   throw new Error('Unable to update GameObject with image type that does not match');
    // }
    this.renderProps = renderProps;
    this.isRenderUpdated = false;
  }
  getRenderState(): types.RenderProps {
    return this.renderProps;
  }
  /**
   * Sets a flag to render the GameObject infront of other GameObjects.
   */
  setBringToTopFlag() {
    this.shouldBringToTop = true;
    this.isRenderUpdated = false;
  }
  hasRenderUpdates(): boolean {
    return !this.isRenderUpdated;
  }
  setRenderUpdated() {
    this.isRenderUpdated = true;
    this.shouldBringToTop = false;
  }
  getColor(): types.ColorRGBA {
    return this.renderProps.color;
  }
  getFlipState(): types.FlipXY {
    return this.renderProps.flip;
  }
  getShouldBringToTop(): boolean {
    return this.shouldBringToTop;
  }
}

/**
 * Encapsulates the basic data-representation of a InteractableGameObject.
 */
export abstract class InteractableGameObject extends RenderableGameObject implements Interactable {
  protected isHitboxUpdated: boolean = false;
  protected phaserGameObject: types.PhaserGameObject | undefined;

  constructor(
    transformProps: types.TransformProps,
    renderProps: types.RenderProps,
    private interactableProps: types.InteractableProps = DEFAULT_INTERACTABLE_PROPS,
  ) {
    super(transformProps, renderProps);
    GameObject.gameObjectsArray.push(this);
  }
  setHitboxState(hitboxProps: types.InteractableProps) {
    this.interactableProps = hitboxProps;
    this.isHitboxUpdated = false;
  }
  getHitboxState(): types.InteractableProps {
    return this.interactableProps;
  }
  hasHitboxUpdates(): boolean {
    return !this.isHitboxUpdated;
  }
  setHitboxUpdated() {
    this.isHitboxUpdated = true;
  }
  /**
   * This stores the GameObject within the phaser game, which can only be set after the game has started.
   * @param phaserGameObject The phaser GameObject reference.
   */
  setPhaserGameObject(phaserGameObject: Phaser.GameObjects.Shape | Phaser.GameObjects.Sprite | Phaser.GameObjects.Text) {
    this.phaserGameObject = phaserGameObject;
  }
  /**
   * Checks if two Source GameObjects are overlapping, using their Phaser GameObjects to check.
   * This method needs to be overriden if the hit area of the Phaser GameObject is not a rectangle.
   * @param other The other GameObject
   * @returns True, if both GameObjects overlap in the phaser game.
   */
  isOverlapping(other: InteractableGameObject): boolean {
    if (this.phaserGameObject === undefined || other.phaserGameObject === undefined) {
      return false;
    }
    // Use getBounds to check if two objects overlap, checking the shape of the area before checking overlap.
    // Since getBounds() returns a Rectangle, it will be unable to check the actual intersection of non-rectangular shapes.
    // eslint-disable-next-line new-cap
    return Phaser.Geom.Intersects.RectangleToRectangle(this.phaserGameObject.getBounds(), other.phaserGameObject.getBounds());
  }
}

/**
 * Encapsulates the data-representation of a ShapeGameObject.
 */
export abstract class ShapeGameObject extends InteractableGameObject {
  /**
   * Gets the shape properties of the ShapeGameObject.
   * @returns The shape properties.
   */
  public abstract getShape();

  /** @override */
  public toReplString = () => '<ShapeGameObject>';

  /** @override */
  public toString = () => this.toReplString();
}

/**
 * Encapsulates the data-representation of a RectangleGameObject.
 */
export class RectangleGameObject extends ShapeGameObject {
  constructor(
    transformProps: types.TransformProps,
    renderProps: types.RenderProps,
    interactableProps: types.InteractableProps,
    private rectangle: types.RectangleProps,
  ) {
    super(transformProps, renderProps, interactableProps);
  }
  /** @override */
  getShape(): types.RectangleProps {
    return this.rectangle;
  }
}

/**
 * Encapsulates the data-representation of a CircleGameObject.
 */
export class CircleGameObject extends ShapeGameObject {
  constructor(
    transformProps: types.TransformProps,
    renderProps: types.RenderProps,
    interactableProps: types.InteractableProps,
    private circle: types.CircleProps,
  ) {
    super(transformProps, renderProps, interactableProps);
  }
  /** @override */
  getShape(): types.CircleProps {
    return this.circle;
  }
}

/**
 * Encapsulates the data-representation of a TriangleGameObject.
 */
export class TriangleGameObject extends ShapeGameObject {
  constructor(
    transformProps: types.TransformProps,
    renderProps: types.RenderProps,
    interactableProps: types.InteractableProps,
    private triangle: types.TriangleProps,
  ) {
    super(transformProps, renderProps, interactableProps);
  }
  /** @override */
  getShape(): types.TriangleProps {
    return this.triangle;
  }
}

/**
 * Encapsulates the data-representation of a SpriteGameObject.
 */
export class SpriteGameObject extends InteractableGameObject {
  constructor(
    transformProps: types.TransformProps,
    renderProps: types.RenderProps,
    interactableProps: types.InteractableProps,
    private sprite: types.Sprite,
  ) {
    super(transformProps, renderProps, interactableProps);
  }
  /**
   * Gets the sprite displayed by the SpriteGameObject.
   * @returns The sprite as a Sprite.
   */
  getSprite(): types.Sprite {
    return this.sprite;
  }

  /** @override */
  public toReplString = () => '<SpriteGameObject>';

  /** @override */
  public toString = () => this.toReplString();
}

/**
 * Encapsulates the data-representation of a TextGameObject.
 */
export class TextGameObject extends InteractableGameObject {
  constructor(
    transformProps: types.TransformProps,
    renderProps: types.RenderProps,
    interactableProps: types.InteractableProps,
    private displayText: types.DisplayText,
  ) {
    super(transformProps, renderProps, interactableProps);
  }
  /**
   * Sets the text displayed by the GameObject in the canvas.
   * @param text The text displayed.
   */
  setText(text: types.DisplayText) {
    this.setRenderState(this.getRenderState());
    this.displayText = text;
  }
  /**
   * Gets the text displayed by the GameObject in the canvas.
   * @returns The text displayed.
   */
  getText(): types.DisplayText {
    return this.displayText;
  }

  /** @override */
  public toReplString = () => '<TextGameObject>';

  /** @override */
  public toString = () => this.toReplString();
}

// =============================================================================
// Interfaces
// =============================================================================

/**
 * Interface to represent GameObjects that can undergo transformations.
 */
interface Transformable {
  /**
   * @param renderProps The transform properties of the GameObject.
   */
  setTransform(transformProps: types.TransformProps);

  /**
   * @returns The render properties of the GameObject.
   */
  getTransform(): types.TransformProps;

  /**
   * Checks if the transform properties needs to update
   * @returns Determines if transform of the GameObject in the canvas needs to be updated.
   */
  hasTransformUpdates(): boolean;

  /**
   * Should be called when the GameObject's transform has been updated in the canvas.
   */
  setTransformUpdated();
}

/**
 * Interface to represent GameObjects that can be rendered in the canvas.
 */
interface Renderable {
  /**
   * @param renderProps The render properties of the GameObject.
   */
  setRenderState(renderProps: types.RenderProps);

  /**
   * @returns The render properties of the GameObject.
   */
  getRenderState(): types.RenderProps;

  /**
   * Checks if the render properties needs to update.
   * @returns Determines if rendered image of the GameObject in the canvas needs to be updated.
   */
  hasRenderUpdates(): boolean;

  /**
   * Should be called when the GameObject's rendered image has been updated in the canvas.
   */
  setRenderUpdated();
}

/**
 * Interface to represent GameObjects that can be interacted with.
 */
interface Interactable {
  /**
   * @param active The hitbox state of the GameObject in detecting overlaps.
   */
  setHitboxState(interactableProps: types.InteractableProps);

  /**
   * @returns The hitbox state of the GameObject in detecting overlaps.
   */
  getHitboxState(): types.InteractableProps;

  /**
   * Checks if the interactivity properties needs to update
   * @returns Determines if hitbox of the GameObject in the canvas needs to be updated.
   */
  hasHitboxUpdates(): boolean;

  /**
   * Should be called when the GameObject's hitbox has been updated in the canvas.
   */
  setHitboxUpdated();
}
