/**
 * File for providing the missing type information for @jscad/stl-serializer
 * Actual function signature can be found [here](https://github.com/jscad/OpenJSCAD.org/blob/master/packages/io/stl-serializer/index.js)
 */
declare module '@jscad/stl-serializer' {
  type SerializeOptions = {
    binary?: boolean
    statusCallback?: (progress: number) => void
  }

  export function serialize(
    options: SerializeOptions,
    ...objects: any[]
  ): string[];
}
