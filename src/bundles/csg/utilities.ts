import { CsgObject } from './types';

// eslint-disable-next-line import/prefer-default-export
export class Shape {
  public getObjects: () => CsgObject[];

  public constructor(
    objectsCallback: () => CsgObject[],
    // Whether a Source program that results in this Shape should spawn the CSG tab
    public spawnsTab: boolean = false,
    private shapeName: string = 'Shape'
  ) {
    this.getObjects = objectsCallback;
  }

  public toReplString(): string {
    return `<${this.shapeName}>`;
  }
}
