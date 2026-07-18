/**
 * This function has multiple signatures
 */
export function multiSignatures(param?: boolean): void;
export function multiSignatures(param: number): void;
export function multiSignatures() { }

/**
 * This function has a broken code example
 * @example
 * ```
 * / 10
 * ```
 */
export function invalidCodeExample() { }

/**
 * This is a type guard
 */
export function typeGuard(obj: unknown): obj is boolean {
  return typeof obj === 'boolean';
}

/**
 * This is an indirect type guard
 * @function
 */
export const indirectTypeGuard = new Proxy((obj: unknown): obj is boolean => !!obj, {});

/**
 * Test constant
 */
export const const0 = 'complicated expression';

/**
 * Test constant with defaultValue
 * @defaultValue
 */
export const const1 = 525600;

/**
 * This function isn't directly a function type and is missing
 * the function tag.
 */
export const funcTagMissing = new Proxy(() => { }, {});

const hiddenFunction = () => { };

/**
 * This function is also missing the function tag, but its type
 * is not directly annotated.
 */
export const indirectFuncTagMissing = hiddenFunction;

/**
 * An interface type, which isn't supported.
 */
export interface CustomType {
  prop: string;
}

export const type_map = {};

class SampleBase {
  /**
   * An inherited method - a subclass documenting its own methods shouldn't surface this as one
   * of its own entries.
   */
  inheritedMethod(): void { }
}

/**
 * A class-based export (mirrors sound_matrix's BaseModulePlugin subclass, whose entire public
 * surface is a class rather than standalone functions). The class itself, its constructor,
 * private members, and inherited methods should never produce "is a ..., which is not
 * supported" warnings or leak into the generated docs - only its own public methods should.
 */
export class SampleClass extends SampleBase {
  private readonly hiddenField = 1;

  constructor() {
    super();
  }

  /**
   * A public method on a class export.
   */
  publicMethod(flag: boolean): number {
    return flag ? this.hiddenField : 0;
  }

  private hiddenMethod(): void { }
}
