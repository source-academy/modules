import { CsgObject } from './types';

// eslint-disable-next-line import/prefer-default-export
export class Shape {
  public getObjects: () => CsgObject[];

  private shapeName: string;

  public constructor(
    objectsCallback: () => CsgObject[],
    shapeName: string = 'Shape'
  ) {
    this.getObjects = objectsCallback;

    this.shapeName = shapeName;
  }

  public toReplString(): string {
    return `<${this.shapeName}>`;
  }
}
