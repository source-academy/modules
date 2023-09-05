/* [Imports] */
import {
  transform as _transform,
} from '@jscad/modeling/src/geometries/geom3';
import mat4, { type Mat4 } from '@jscad/modeling/src/maths/mat4';
import {
  center as _center,
  rotate as _rotate,
  scale as _scale,
  translate as _translate,
  align,
} from '@jscad/modeling/src/operations/transforms';
import _ from 'lodash';
import type { ReplResult } from '../../typings/type_helpers.js';
import { Core } from './core.js';
import type { AlphaColor, Color, Solid } from './jscad/types.js';



/* [Exports] */
//TODO rename params etc
export interface Operable {
  store: (newTransforms?: Mat4) => void;

  translate: (offset: [number, number, number]) => Operable;
  rotate: (offset: [number, number, number]) => Operable;
  scale: (offset: [number, number, number]) => Operable;
}

export class Group implements Operable, ReplResult {
  children: Operable[];

  constructor(
    _children: Operable[],
    public transforms: Mat4 = mat4.create(),
  ) {
    // Duplicate the array to avoid modifying the original, maintaining
    // stateless Operables for the user
    this.children = _.cloneDeep(_children);
  }

  store(newTransforms?: Mat4): void {
    this.transforms = mat4.multiply(
      mat4.create(),
      newTransforms || mat4.create(),
      this.transforms,
    );

    this.children.forEach((child) => {
      child.store(this.transforms);
    });
  }

  translate(offset: [number, number, number]): Group {
    return new Group(
      this.children,
      mat4.multiply(
        mat4.create(),
        mat4.fromTranslation(mat4.create(), offset),
        this.transforms,
      ),
    );
  }

  rotate(offset: [number, number, number]): Group {
    const yaw = offset[2];
    const pitch = offset[1];
    const roll = offset[0];

    return new Group(
      this.children,
      mat4.multiply(
        mat4.create(),
        mat4.fromTaitBryanRotation(mat4.create(), yaw, pitch, roll),
        this.transforms,
      ),
    );
  }

  scale(offset: [number, number, number]): Group {
    return new Group(
      this.children,
      mat4.multiply(
        mat4.create(),
        mat4.fromScaling(mat4.create(), offset),
        this.transforms,
      ),
    );
  }

  toReplString(): string {
    return '<Group>';
  }
}

export class Shape implements Operable, ReplResult {
  constructor(public solid: Solid) {}

  store(newTransforms?: Mat4): void {
    Core.getRenderGroupManager()
      .storeShape(
        new Shape(_transform(newTransforms || mat4.create(), this.solid)),
      );
  }

  translate(offset: [number, number, number]): Shape {
    return new Shape(_translate(offset, this.solid));
  }

  rotate(offset: [number, number, number]): Shape {
    return new Shape(_rotate(offset, this.solid));
  }

  scale(offset: [number, number, number]): Shape {
    return new Shape(_scale(offset, this.solid));
  }

  toReplString(): string {
    return '<Shape>';
  }
}

export class RenderGroup implements ReplResult {
  render: boolean = false;
  hasGrid: boolean = true;
  hasAxis: boolean = true;

  shapes: Shape[] = [];

  constructor(public canvasNumber: number) {}

  toReplString(): string {
    return `<Render #${this.canvasNumber}>`;
  }
}

export class RenderGroupManager {
  private canvasTracker: number = 1;
  private renderGroups: RenderGroup[] = [];

  constructor() {
    this.addRenderGroup();
  }

  private addRenderGroup() {
    // Passes in canvasTracker as is, then increments it
    this.renderGroups.push(new RenderGroup(this.canvasTracker++));
  }

  private getCurrentRenderGroup(): RenderGroup {
    return this.renderGroups.at(-1) as RenderGroup;
  }

  // Returns the old render group
  nextRenderGroup(
    oldHasGrid: boolean = false,
    oldHasAxis: boolean = false,
  ): RenderGroup {
    let oldRenderGroup: RenderGroup = this.getCurrentRenderGroup();
    oldRenderGroup.render = true;
    oldRenderGroup.hasGrid = oldHasGrid;
    oldRenderGroup.hasAxis = oldHasAxis;

    this.addRenderGroup();

    return oldRenderGroup;
  }

  storeShape(shape: Shape) {
    this.getCurrentRenderGroup().shapes.push(shape);
  }

  shouldRender(): boolean {
    return this.getGroupsToRender().length > 0;
  }

  getGroupsToRender(): RenderGroup[] {
    return this.renderGroups.filter(
      (renderGroup: RenderGroup) => renderGroup.render,
    );
  }
}

export class CsgModuleState {
  private componentCounter: number = 0;

  public readonly renderGroupManager: RenderGroupManager;

  public constructor() {
    this.renderGroupManager = new RenderGroupManager();
  }

  // Returns the new component number
  public nextComponent(): number {
    return ++this.componentCounter;
  }
}

export function centerPrimitive(shape: Shape) {
  // Move centre of Shape to 0.5, 0.5, 0.5
  let solid: Solid = _center(
    {
      relativeTo: [0.5, 0.5, 0.5],
    },
    shape.solid,
  );
  return new Shape(solid);
}

export function alignOrigin(shape: Shape) {
  // Align minimum bounds of Shape to 0 0 0
  let solid: Solid = align({ modes: ['min', 'min', 'min'] }, shape.solid);
  return new Shape(solid);
}

export function hexToColor(hex: string): Color {
  let regex: RegExp
    = /^#?(?<red>[\da-f]{2})(?<green>[\da-f]{2})(?<blue>[\da-f]{2})$/iu;
  let potentialGroups: { [key: string]: string } | undefined
    = hex.match(regex)?.groups;
  if (potentialGroups === undefined) return [0, 0, 0];
  let groups: { [key: string]: string } = potentialGroups;

  return [
    parseInt(groups.red, 16) / 0xff,
    parseInt(groups.green, 16) / 0xff,
    parseInt(groups.blue, 16) / 0xff,
  ];
}

export function colorToAlphaColor(
  color: Color,
  opacity: number = 1,
): AlphaColor {
  return [...color, opacity];
}

export function hexToAlphaColor(hex: string): AlphaColor {
  return colorToAlphaColor(hexToColor(hex));
}

export function clamp(value: number, lowest: number, highest: number): number {
  value = Math.max(value, lowest);
  value = Math.min(value, highest);
  return value;
}
