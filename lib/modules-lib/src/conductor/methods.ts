
import type { IModulePlugin } from '@sourceacademy/conductor/module';
import type { DataType, ExternCallable, IFunctionSignature, TypedValue } from '@sourceacademy/conductor/types';

/**
 * `ModuleMethodName` is a utility type that extracts the names of methods from a module plugin (T) that are of type `ModuleFunction`.
 */
type ModuleMethodName<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [K in keyof T]: T[K] extends ExternCallable<infer _A, infer _R> ? K : never;
}[keyof T];

/**
 * `MethodArgs` is a utility type that extracts the argument types of a module method (K) from a module plugin (T).
 * It maps the argument types from `TypedValue<DataType>` to their underlying `DataType`.
 */
type MethodArgs<T, K extends ModuleMethodName<T>> =
  T[K] extends ExternCallable<infer A, any>
  ? A
  : never;

/**
 * `MethodReturn` is a utility type that extracts the return type of a module method (K) from a module plugin (T).
 */
type MethodReturn<T, K extends ModuleMethodName<T>> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T[K] extends ExternCallable<infer _A, infer R>
  ? R
  : never;

/**
 * `SignaturedModuleMethod` is the type for a module method's signature.
 * A module method would be `ExternCallable<Args, Return> & SignaturedModuleMethod<Args, Return>`, where `Args` and `Return` are the argument types and return type of the method, respectively.
 */
type SignaturedModuleMethod<Args extends readonly DataType[], Ret extends DataType> = {
  signature?: IFunctionSignature<Args, Ret>;
};

/**
 * Attaches the signature to a module method. This is used to provide type information for module methods that are exposed to the conductor.
 * @param clss The class of the module plugin.
 * @param methodName The name of the method to attach the signature to.
 * @param args The argument types of the method.
 * @param returnType The return type of the method.
 */
export function attachModuleMethod<T extends IModulePlugin, K extends ModuleMethodName<T>>(
  clss: new (...args: any[]) => T,
  methodName: K,
  args: MethodArgs<T, K>,
  returnType: MethodReturn<T, K>
) {
  const method = clss.prototype[methodName] as SignaturedModuleMethod<typeof args, typeof returnType> | undefined;
  if (method === undefined) {
    throw new Error(`Rune module method "${String(methodName)}" does not exist.`);
  }
  method.signature = { args, returnType };
}
