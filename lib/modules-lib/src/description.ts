/**
 * A language-neutral description of the types of a module's exports (see #996 and #997).
 *
 * A typed language that lets a program import a module (Python §4 Typed, for one) checks the program
 * against the module's description, and maps it to its own types: `number` and `function` become the
 * language's number and function types. The description is a superset of what the conductor knows:
 * the conductor's `DataType` says `CLOSURE`, the description says what the function takes and returns,
 * and it names the opaque types (`Rune`, not `OPAQUE`).
 *
 * A description is written next to the plugin (`description.ts` in the bundle) and checked against it
 * in the bundle's tests with {@link checkDescription}. It is JSON-serializable, so that a bundle can
 * publish it next to its code.
 * @module description
 */

/** The version of the format. A consumer rejects a version that it does not know. */
export const DESCRIPTION_VERSION = 1;

/** The type of a value that a module's function takes or returns. */
export type TypeDescription =
  | 'number'
  | 'integer'
  | 'string'
  | 'boolean'
  | 'void'
  /** A value of any type, which the function only inspects (`is_tree`): a program can only pass it on. */
  | 'any'
  /**
   * A value that the module defines and that a program can only pass back to it, by the name of its type;
   * with the types that it is applied to, if the type has type parameters (`BinaryTree[A]`).
   */
  | { opaque: string, arguments?: TypeDescription[] }
  /** A type parameter of the function that this type is a part of (`A` in `entry[A]`). */
  | { parameter: string }
  | { list: TypeDescription }
  | { pair: [TypeDescription, TypeDescription] }
  | { array: TypeDescription }
  | { function: { params: TypeDescription[], returns: TypeDescription } };

export interface ParameterDescription {
  name: string;
  type: TypeDescription;
}

/** An opaque type that has type parameters: a `BinaryTree[A]`. */
export interface GenericOpaqueType {
  name: string;
  typeParameters: string[];
}

export interface FunctionDescription {
  name: string;
  /** The type parameters of a function that works for several types (`make_tree[A]`). */
  typeParameters?: string[];
  params: ParameterDescription[];
  returns: TypeDescription;
}

export interface ModuleDescription {
  version: typeof DESCRIPTION_VERSION;
  /** The name that a program imports: `rune`. */
  module: string;
  /** The opaque types that the module defines: a name (`Rune`), or a name with type parameters. */
  opaqueTypes: (string | GenericOpaqueType)[];
  functions: FunctionDescription[];
  constants: { name: string, type: TypeDescription }[];
}

/** Short forms for writing a description by hand. */
export const opaque = (name: string, ...args: TypeDescription[]): TypeDescription => args.length ? { opaque: name, arguments: args } : { opaque: name };
export const parameter = (name: string): TypeDescription => ({ parameter: name });
export const fun = (params: TypeDescription[], returns: TypeDescription): TypeDescription => ({
  function: { params, returns }
});
/** `fn('scale', [['ratio', 'number'], ['rune', Rune]], Rune)`; `typeParameters` for a function that works for several types. */
export function fn(
  name: string,
  params: [string, TypeDescription][],
  returns: TypeDescription,
  typeParameters?: string[]
): FunctionDescription {
  return {
    name,
    ...typeParameters ? { typeParameters } : {},
    params: params.map(([paramName, type]) => ({ name: paramName, type })),
    returns
  };
}

/** Which way a value goes: `in` is what a program passes to the module, `out` what it receives. */
type Direction = 'in' | 'out';

function typeProblems(
  type: TypeDescription,
  opaqueTypes: ReadonlyMap<string, number>,
  parameters: ReadonlySet<string>,
  direction: Direction,
  where: string
): string[] {
  if (typeof type === 'string') {
    // A number that a module returns is a float: the runtime has no integers in the module interface.
    if (type === 'integer' && direction === 'out') {
      return [`${where}: integer is for a parameter that must be whole: a result is a number`];
    }
    return [];
  }
  if ('opaque' in type) {
    const arity = opaqueTypes.get(type.opaque);
    if (arity === undefined) return [`${where}: the opaque type ${type.opaque} is not declared`];
    const given = type.arguments ?? [];
    if (given.length !== arity) {
      return [`${where}: the opaque type ${type.opaque} has ${arity} type parameters, not ${given.length}`];
    }
    return given.flatMap(each => typeProblems(each, opaqueTypes, parameters, direction, where));
  }
  if ('parameter' in type) {
    return parameters.has(type.parameter) ? [] : [`${where}: the type parameter ${type.parameter} is not declared`];
  }
  if ('list' in type) return typeProblems(type.list, opaqueTypes, parameters, direction, where);
  if ('array' in type) return typeProblems(type.array, opaqueTypes, parameters, direction, where);
  if ('pair' in type) {
    return type.pair.flatMap(each => typeProblems(each, opaqueTypes, parameters, direction, where));
  }
  // A function type turns its parameters around: a callback that a program passes in is given a value
  // that the program receives.
  const turned: Direction = direction === 'in' ? 'out' : 'in';
  return [
    ...type.function.params.flatMap(each => typeProblems(each, opaqueTypes, parameters, turned, where)),
    ...typeProblems(type.function.returns, opaqueTypes, parameters, direction, where)
  ];
}

/**
 * What is wrong with a description in itself, as messages (none if it is fine): a name that is used
 * twice, an opaque type or type parameter that is not declared, an `integer` result.
 */
export function validateDescription(description: ModuleDescription): string[] {
  const problems: string[] = [];
  if (description.version !== DESCRIPTION_VERSION) {
    problems.push(`version ${String(description.version)} is not ${DESCRIPTION_VERSION}`);
  }
  const opaqueTypes = new Map<string, number>();
  for (const type of description.opaqueTypes) {
    const { name, typeParameters } = typeof type === 'string' ? { name: type, typeParameters: [] } : type;
    if (opaqueTypes.has(name)) problems.push(`the opaque type ${name} is declared twice`);
    opaqueTypes.set(name, typeParameters.length);
  }
  const seen = new Set<string>();
  for (const name of [...description.functions.map(each => each.name), ...description.constants.map(each => each.name)]) {
    if (seen.has(name)) problems.push(`${name} is described twice`);
    seen.add(name);
  }
  for (const { name, params, returns, typeParameters = [] } of description.functions) {
    const parameters = new Set(typeParameters);
    for (const param of params) {
      problems.push(...typeProblems(param.type, opaqueTypes, parameters, 'in', `${name}(${param.name})`));
    }
    problems.push(...typeProblems(returns, opaqueTypes, parameters, 'out', `${name} (result)`));
  }
  for (const { name, type } of description.constants) {
    problems.push(...typeProblems(type, opaqueTypes, new Set(), 'out', name));
  }
  return problems;
}

/**
 * What is wrong with a description of a plugin: {@link validateDescription}, and every name that the
 * plugin exports must be described, and no other. Give it the symbols of the plugin's `exports` after
 * `initialise()`, not `exportedNames`: a plugin can export names when it is loaded (`rune`'s shapes).
 */
export function checkDescription(description: ModuleDescription, exportedSymbols: readonly string[]): string[] {
  const described = new Set([...description.functions.map(each => each.name), ...description.constants.map(each => each.name)]);
  const exported = new Set(exportedSymbols);
  return [
    ...validateDescription(description),
    ...[...exported].filter(name => !described.has(name)).map(name => `${name} is exported but not described`),
    ...[...described].filter(name => !exported.has(name)).map(name => `${name} is described but not exported`)
  ];
}
