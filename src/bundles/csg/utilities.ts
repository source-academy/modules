import { Geom3 } from '@jscad/modeling/src/geometries/types';

export class Shape {
  public getObject: () => Geom3;

  public constructor(
    objectsCallback: () => Geom3,
    // Whether a Source program that results in this Shape should spawn the CSG tab
    public spawnsTab: boolean = false,
    private shapeName: string = 'Shape'
  ) {
    this.getObject = objectsCallback;
  }

  public toReplString(): string {
    return `<${this.shapeName}>`;
  }
}

export function looseInstanceOf(object: Object, c: any): boolean {
  const objectName: string | undefined = object?.constructor?.name;
  const className: string | undefined = c?.name;
  return (
    objectName !== undefined &&
    className !== undefined &&
    objectName === className
  );
}
