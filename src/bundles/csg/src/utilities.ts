/* [Imports] */
import geom3, { transform as _transform } from '@jscad/modeling/src/geometries/geom3';
import mat4, { type Mat4 } from '@jscad/modeling/src/maths/mat4';
import {
  center as _center,
  rotate as _rotate,
  scale as _scale,
  translate as _translate
} from '@jscad/modeling/src/operations/transforms';
import type { ReplResult } from '@sourceacademy/modules-lib/types';
import type { Solid } from './jscad/types';

/* [Exports] */
export interface Operable {
  applyTransforms: (newTransforms: Mat4) => Operable;
  store: (manager: RenderGroupManager, newTransforms?: Mat4) => void;

  translate: (offsets: [number, number, number]) => Operable;
  rotate: (angles: [number, number, number]) => Operable;
  scale: (factors: [number, number, number]) => Operable;
}

export class Group implements Operable, ReplResult {
  children: Operable[];

  constructor(_children: Operable[], public transforms: Mat4 = mat4.create()) {
    // Duplicate the array to avoid modifying the original, maintaining
    // stateless Operables for the user
    this.children = [..._children];
  }

  applyTransforms(newTransforms: Mat4): Operable {
    const appliedTransforms: Mat4 = mat4.multiply(
      mat4.create(),
      newTransforms,
      this.transforms
    );

    // Return a new object for statelessness
    return new Group(this.children, appliedTransforms);
  }

  store(manager: RenderGroupManager, newTransforms: Mat4 = mat4.create()): void {
    const appliedGroup: Group = this.applyTransforms(newTransforms) as Group;

    this.children.forEach((child: Operable) => {
      child.store(manager, appliedGroup.transforms);
    });
  }

  translate(offsets: [number, number, number]): Group {
    return new Group(
      this.children,
      mat4.multiply(
        mat4.create(),
        mat4.fromTranslation(mat4.create(), offsets),
        this.transforms
      )
    );
  }

  rotate(angles: [number, number, number]): Group {
    const yaw = angles[2];
    const pitch = angles[1];
    const roll = angles[0];

    return new Group(
      this.children,
      mat4.multiply(
        mat4.create(),
        mat4.fromTaitBryanRotation(mat4.create(), yaw, pitch, roll),
        this.transforms
      )
    );
  }

  scale(factors: [number, number, number]): Group {
    return new Group(
      this.children,
      mat4.multiply(
        mat4.create(),
        mat4.fromScaling(mat4.create(), factors),
        this.transforms
      )
    );
  }

  toReplString(): string {
    return '<Group>';
  }

  ungroup(): Operable[] {
    // Return all children, but we need to account for this Group's unresolved
    // transforms by applying them to each child
    return this.children.map((child: Operable) => child.applyTransforms(this.transforms));
  }
}

export class Shape implements Operable, ReplResult {
  constructor(public solid: Solid = geom3.create()) {}

  applyTransforms(newTransforms: Mat4): Operable {
    // Return a new object for statelessness
    return new Shape(_transform(newTransforms, this.solid));
  }

  store(manager: RenderGroupManager, newTransforms: Mat4 = mat4.create()): void {
    manager.storeShape(this.applyTransforms(newTransforms) as Shape);
  }

  translate(offsets: [number, number, number]): Shape {
    return new Shape(_translate(offsets, this.solid));
  }

  rotate(angles: [number, number, number]): Shape {
    return new Shape(_rotate(angles, this.solid));
  }

  scale(factors: [number, number, number]): Shape {
    return new Shape(_scale(factors, this.solid));
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

/* NOTE
  This used to be reached through the `Core` static singleton, which the bundle
  and the tab each initialised against the same shared `CsgModuleState` object.
  Under Conductor the two run in different realms with no shared heap, so the
  manager is now plain instance state owned by the module plugin, and shapes
  reach it by being handed it explicitly.
*/
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
    oldHasAxis: boolean = false
  ): RenderGroup {
    const oldRenderGroup: RenderGroup = this.getCurrentRenderGroup();
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
    return this.renderGroups.filter((renderGroup: RenderGroup) => renderGroup.render);
  }
}

export function centerPrimitive(shape: Shape) {
  // Move centre of Shape to 0.5, 0.5, 0.5
  const solid: Solid = _center(
    {
      relativeTo: [0.5, 0.5, 0.5]
    },
    shape.solid
  );
  return new Shape(solid);
}
