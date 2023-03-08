/**
 * This file contains the bundle's representation of GameObjects.
 */
import type { ReplResult } from '../../typings/type_helpers';
import { type InteractableProps, type RenderedImage, type RenderProps, type TransformProps, type DisplayText, type PhaserType, Sprite } from './types';

// =============================================================================
// Classes
// =============================================================================

/**
 * Encapsulates the basic data-representation of a GameObject.
 */
export abstract class GameObject implements Transformable, ReplResult {
  private static gameObjectCount: number = 0;
  private static gameObjectsArray: GameObject[] = []; // Stores all the created GameObjects
  protected transformNotUpdated: boolean = true;
  public readonly id: number;

  constructor(
    private transformProps: TransformProps = {
      position: [0, 0],
      scale: [0, 0],
      rotation: 0,
    },
  ) {
    this.id = GameObject.gameObjectCount++;
    GameObject.gameObjectsArray.push(this);
  }
  setTransform(transformProps: TransformProps) {
    this.transformProps = transformProps;
    this.transformNotUpdated = true;
  }
  getTransform(): TransformProps {
    return this.transformProps;
  }
  hasTransformUpdates(): boolean {
    return this.transformNotUpdated;
  }
  updatedTransform() {
    this.transformNotUpdated = false;
  }

  public static getGameObjectsArray() {
    return GameObject.gameObjectsArray;
  }

  public toReplString = () => '<GameObject>';
}

/**
 * Encapsulates the basic data-representation of a RenderableGameObject.
 */
export abstract class RenderableGameObject extends GameObject implements Renderable {
  protected renderNotUpdated: boolean = true;

  /**
   * @param {PhaserType} phaserType - The phaser type defines the representation of the GameObject in Phaser.
   */
  constructor(
    transformProps: TransformProps,
    private renderProps: RenderProps = {
      color: {
        red: 255,
        blue: 255,
        green: 255,
        alpha: 255,
      },
      flip: [false, false],
      visible: true,
      renderedImage: {} as RenderedImage,
    },
    public readonly phaserType?: PhaserType,
  ) {
    super(transformProps);
    if (renderProps.renderedImage === undefined || phaserType === undefined) {
      throw new Error('GameObject\'s render image is undefined');
    }

    if (phaserType in renderProps.renderedImage) {
      throw new Error('Error setting GameObject\'s phaser type');
    }
  }

  setRenderState(renderProps: RenderProps) {
    if (renderProps.renderedImage === undefined || this.phaserType === undefined) {
      throw new Error('GameObject\'s render image type is undefined');
    }
    if (this.phaserType in renderProps.renderedImage) {
      throw new Error('Unable to update GameObject with image type that does not match');
    }
    this.renderProps = renderProps;
    this.renderNotUpdated = true;
  }
  getRenderState(): RenderProps {
    return this.renderProps;
  }
  hasRenderUpdates(): boolean {
    return this.renderNotUpdated;
  }
  updatedRender() {
    this.renderNotUpdated = false;
  }
  getColor(): [number, number, number, number] {
    return [
      this.renderProps.color.red,
      this.renderProps.color.blue,
      this.renderProps.color.green,
      this.renderProps.color.alpha,
    ];
  }
}

/**
 * Encapsulates the basic data-representation of a InteractableGameObject.
 */
export abstract class InteractableGameObject extends RenderableGameObject implements Interactable {
  protected hitboxNotUpdated: boolean = true;

  constructor(
    transformProps: TransformProps,
    renderProps: RenderProps,
    private interactableProps: InteractableProps = {
      hitboxActive: true,
    },
    phaserType?: PhaserType,
  ) {
    super(transformProps, renderProps, phaserType);
  }
  setHitboxState(hitboxProps: InteractableProps) {
    this.interactableProps = hitboxProps;
    this.hitboxNotUpdated = true;
  }
  getHitboxState(): InteractableProps {
    return this.interactableProps;
  }
  hasHitboxUpdates(): boolean {
    return this.hitboxNotUpdated;
  }
  updatedHitbox() {
    this.hitboxNotUpdated = false;
  }
}

/**
 * Encapsulates the data-representation of a ShapeGameObject.
 */
export class ShapeGameObject extends InteractableGameObject {
  constructor(
    transformProps: TransformProps,
    renderProps: RenderProps,
    interactableProps: InteractableProps,
  ) {
    super(transformProps, renderProps, interactableProps, 'Shape' as PhaserType);
  }

  /** @override */
  public toReplString = () => '<ShapeGameObject>';
}

/**
 * Encapsulates the data-representation of a SpriteGameObject.
 */
export class SpriteGameObject extends InteractableGameObject {
  constructor(
    transformProps: TransformProps,
    renderProps: RenderProps,
    interactableProps: InteractableProps,
  ) {
    super(transformProps, renderProps, interactableProps, 'Sprite' as PhaserType);
  }
  /**
   * Gets the sprite displayed by the SpriteGameObject.
   * @returns The sprite as a Sprite.
   */
  getSprite(): Sprite {
    return this.getRenderState().renderedImage as Sprite;
  }

  /** @override */
  public toReplString = () => '<SpriteGameObject>';
}

/**
 * Encapsulates the data-representation of a TextGameObject.
 */
export class TextGameObject extends InteractableGameObject {
  constructor(
    transformProps: TransformProps,
    renderProps: RenderProps,
    interactableProps: InteractableProps,
  ) {
    super(transformProps, renderProps, interactableProps, 'Text' as PhaserType);
  }
  /**
   * Sets the text displayed by the GameObject in the canvas.
   * @param text The text displayed.
   */
  setText(text: DisplayText) {
    this.setRenderState({
      ...this.getRenderState(),
      renderedImage: text,
    });
  }
  /**
   * Gets the text displayed by the GameObject in the canvas.
   * @returns The text displayed.
   */
  getText(): DisplayText {
    return this.getRenderState().renderedImage as DisplayText;
  }

  /** @override */
  public toReplString = () => '<TextGameObject>';
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
  setTransform(transformProps: TransformProps);

  /**
   * @returns The render properties of the GameObject.
   */
  getTransform(): TransformProps;

  /**
   * @returns Determines if transform of the GameObject in the canvas needs to be updated.
   */
  hasTransformUpdates(): boolean;

  /**
   * Should be called when the GameObject's transform has been updated in the canvas.
   */
  updatedTransform();
}

/**
 * Interface to represent GameObjects that can be rendered in the canvas.
 */
interface Renderable {
  /**
   * @param renderProps The render properties of the GameObject.
   */
  setRenderState(renderProps: RenderProps);

  /**
   * @returns The render properties of the GameObject.
   */
  getRenderState(): RenderProps;

  /**
   * @returns Determines if rendered image of the GameObject in the canvas needs to be updated.
   */
  hasRenderUpdates(): boolean;

  /**
   * Should be called when the GameObject's rendered image has been updated in the canvas.
   */
  updatedRender();
}

/**
 * Interface to represent GameObjects that can be interacted with.
 */
interface Interactable {
  /**
   * @param active The hitbox state of the GameObject in detecting overlaps.
   */
  setHitboxState(interactableProps: InteractableProps);

  /**
   * @returns The hitbox state of the GameObject in detecting overlaps.
   */
  getHitboxState(): InteractableProps;

  /**
   * @returns Determines if hitbox of the GameObject in the canvas needs to be updated.
   */
  hasHitboxUpdates(): boolean;

  /**
   * Should be called when the GameObject's hitbox has been updated in the canvas.
   */
  updatedHitbox();
}
