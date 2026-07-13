
import type { IModulePlugin } from '@sourceacademy/conductor/module';
import type { DataType, TypedValue } from '@sourceacademy/conductor/types';

type ModuleFunction<
    Args extends readonly TypedValue<DataType>[] = readonly TypedValue<DataType>[],
    Return extends DataType = DataType,
> = (...args: Args) => AsyncGenerator<void, TypedValue<Return>, undefined>;

type ModuleMethodName<T> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [K in keyof T]: T[K] extends ModuleFunction<infer _A, infer _R> ? K : never;
}[keyof T];

type MethodArgs<T, K extends ModuleMethodName<T>> =
    T[K] extends ModuleFunction<infer A, any>
    ? { [I in keyof A]: A[I] extends TypedValue<infer D> ? D : never }
    : never;

type MethodReturn<T, K extends ModuleMethodName<T>> =
    T[K] extends ModuleFunction<any, infer R>
    ? R
    : never;

type SignaturedModuleMethod = {
    signature?: {
        args: readonly DataType[];
        returnType: DataType;
    };
};

export function attachModuleMethod<T extends IModulePlugin, K extends ModuleMethodName<T>>(
    clss: new (...args: any[]) => T,
    methodName: K,
    args: MethodArgs<T, K>,
    returnType: MethodReturn<T, K>
) {
    const method = clss.prototype[methodName] as SignaturedModuleMethod | undefined;
    if (method === undefined) {
        throw new Error(`Rune module method "${String(methodName)}" does not exist.`);
    }
    method.signature = { args, returnType };
}
