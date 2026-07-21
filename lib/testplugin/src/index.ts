import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import {
  DataType,
  type ExternCallable,
  type IFunctionSignature,
  type TypedValue
} from '@sourceacademy/conductor/types';

type AnyTypedValue = TypedValue<DataType>;
type PairEntry = [head: AnyTypedValue, tail: AnyTypedValue];
type ClosureEntry = {
  arity: number;
  func: ExternCallable<any, any>;
  returnType: DataType;
  signature: IFunctionSignature<any, any>;
};

/**
 * Drives a Conductor async generator to completion and returns its final value.
 */
export async function runAsyncGenerator<T>(generator: AsyncGenerator<unknown, T, unknown>): Promise<T> {
  let result = await generator.next();
  while (!result.done) {
    result = await generator.next();
  }

  return result.value;
}

/**
 * Constructs a Conductor number value.
 */
export function numberValue(value: number): TypedValue<DataType.NUMBER> {
  return { type: DataType.NUMBER, value };
}

/**
 * Constructs a Conductor boolean value.
 */
export function booleanValue(value: boolean): TypedValue<DataType.BOOLEAN> {
  return { type: DataType.BOOLEAN, value };
}

/**
 * Constructs a Conductor string value.
 */
export function stringValue(value: string): TypedValue<DataType.CONST_STRING> {
  return { type: DataType.CONST_STRING, value };
}

/**
 * Constructs a Conductor void value.
 */
export function voidValue(): TypedValue<DataType.VOID> {
  return { type: DataType.VOID, value: undefined };
}

/**
 * Constructs a Conductor empty-list value.
 */
export function emptyListValue(): TypedValue<DataType.EMPTY_LIST> {
  return { type: DataType.EMPTY_LIST, value: null };
}

function isTypedValue(value: unknown): value is AnyTypedValue {
  return typeof value === 'object'
    && value !== null
    && 'type' in value
    && 'value' in value;
}

function typeName(type: DataType) {
  return DataType[type] ?? String(type);
}

function matchesType(value: AnyTypedValue, expected: DataType | undefined) {
  if (expected === undefined) return true;
  if (expected === DataType.LIST) {
    return value.type === DataType.PAIR || value.type === DataType.EMPTY_LIST;
  }

  return value.type === expected;
}

function assertTypedValue(value: AnyTypedValue, expected: DataType | undefined, context: string) {
  if (!matchesType(value, expected)) {
    throw new Error(`${context} expected ${typeName(expected!)}, got ${typeName(value.type)}.`);
  }
}

function assertIndex(index: number, length: number) {
  if (!Number.isInteger(index) || index < 0 || index >= length) {
    throw new Error(`Array index ${index} is out of bounds for length ${length}.`);
  }
}

function asPromise<T>(operation: () => T): Promise<T> {
  try {
    return Promise.resolve(operation());
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * In-memory IDataHandler implementation for tests of Conductor modules.
 */
export class TestDataHandler implements IInterfacableEvaluator {
  readonly hasDataInterface = true;
  readonly closureMap = new Map<number, ExternCallable<any, any>>();
  readonly pairMap = new Map<number, PairEntry>();
  readonly arrayMap = new Map<number, AnyTypedValue[]>();
  readonly opaqueMap = new Map<number, unknown>();

  private nextIdentifier = 1;
  private readonly arrayTypeMap = new Map<number, DataType>();
  private readonly closureEntryMap = new Map<number, ClosureEntry>();

  startEvaluator(_entryPoint: string) {
    return Promise.resolve(undefined);
  }

  pair_make(head: AnyTypedValue, tail: AnyTypedValue): Promise<TypedValue<DataType.PAIR>> {
    return asPromise(() => {
      const id = this.allocateIdentifier();
      this.pairMap.set(id, [head, tail]);
      return { type: DataType.PAIR, value: id as TypedValue<DataType.PAIR>['value'] };
    });
  }

  pair_head(p: TypedValue<DataType.PAIR>): Promise<AnyTypedValue> {
    return asPromise(() => this.getPair(p)[0]);
  }

  pair_sethead(p: TypedValue<DataType.PAIR>, tv: AnyTypedValue): Promise<void> {
    return asPromise(() => {
      this.getPair(p)[0] = tv;
    });
  }

  pair_tail(p: TypedValue<DataType.PAIR>): Promise<AnyTypedValue> {
    return asPromise(() => this.getPair(p)[1]);
  }

  pair_settail(p: TypedValue<DataType.PAIR>, tv: AnyTypedValue): Promise<void> {
    return asPromise(() => {
      this.getPair(p)[1] = tv;
    });
  }

  pair_assert(p: TypedValue<DataType.PAIR>, headType?: DataType, tailType?: DataType): Promise<void> {
    return asPromise(() => {
      const [head, tail] = this.getPair(p);
      assertTypedValue(head, headType, 'Pair head');
      assertTypedValue(tail, tailType, 'Pair tail');
    });
  }

  array_make<T extends DataType>(
    type: T,
    len: number,
    init?: TypedValue<NoInfer<T>>
  ): Promise<TypedValue<DataType.ARRAY, NoInfer<T>>> {
    return asPromise(() => {
      const id = this.allocateIdentifier();
      const initialValue = init ?? this.defaultValue(type);
      this.arrayMap.set(id, Array.from({ length: len }, () => initialValue));
      this.arrayTypeMap.set(id, type);
      return {
        type: DataType.ARRAY,
        value: id as TypedValue<DataType.ARRAY, NoInfer<T>>['value']
      };
    });
  }

  array_length(a: TypedValue<DataType.ARRAY>): Promise<number> {
    return asPromise(() => this.getArray(a).length);
  }

  array_get(a: TypedValue<DataType.ARRAY, DataType.VOID>, idx: number): Promise<AnyTypedValue>;
  array_get<T extends DataType>(
    a: TypedValue<DataType.ARRAY, T>,
    idx: number
  ): Promise<TypedValue<NoInfer<T>>>;
  array_get<T extends DataType>(
    a: TypedValue<DataType.ARRAY, T>,
    idx: number
  ): Promise<TypedValue<NoInfer<T>>> {
    return asPromise(() => {
      const array = this.getArray(a);
      assertIndex(idx, array.length);
      return array[idx] as TypedValue<NoInfer<T>>;
    });
  }

  array_type<T extends DataType>(a: TypedValue<DataType.ARRAY, T>): Promise<NoInfer<T>> {
    return asPromise(() => this.getArrayType(a) as NoInfer<T>);
  }

  array_set(a: TypedValue<DataType.ARRAY, DataType.VOID>, idx: number, tv: AnyTypedValue): Promise<void>;
  array_set<T extends DataType>(
    a: TypedValue<DataType.ARRAY, T>,
    idx: number,
    tv: TypedValue<NoInfer<T>>
  ): Promise<void>;
  array_set<T extends DataType>(
    a: TypedValue<DataType.ARRAY, T>,
    idx: number,
    tv: AnyTypedValue
  ): Promise<void> {
    return asPromise(() => {
      const array = this.getArray(a);
      const arrayType = this.getArrayType(a);
      assertIndex(idx, array.length);

      if (arrayType !== DataType.VOID) {
        assertTypedValue(tv, arrayType, 'Array element');
      }

      array[idx] = tv;
    });
  }

  array_assert<T extends DataType>(
    a: TypedValue<DataType.ARRAY>,
    type?: T,
    length?: number
  ): Promise<void> {
    return asPromise(() => {
      const array = this.getArray(a);
      const arrayType = this.getArrayType(a);

      if (type !== undefined && arrayType !== type) {
        throw new Error(`Array expected element type ${typeName(type)}, got ${typeName(arrayType)}.`);
      }

      if (length !== undefined && array.length !== length) {
        throw new Error(`Array expected length ${length}, got ${array.length}.`);
      }
    });
  }

  closure_make<const Arg extends readonly DataType[], const Ret extends DataType>(
    sig: IFunctionSignature<Arg, Ret>,
    func: ExternCallable<Arg, Ret>,
    _dependsOn?: (AnyTypedValue | null)[]
  ): Promise<TypedValue<DataType.CLOSURE, Ret>> {
    return asPromise(() => {
      const id = this.allocateIdentifier();
      this.closureMap.set(id, func);
      this.closureEntryMap.set(id, {
        arity: sig.args.length,
        func,
        returnType: sig.returnType,
        signature: sig
      });
      return { type: DataType.CLOSURE, value: id as TypedValue<DataType.CLOSURE, Ret>['value'] };
    });
  }

  closure_is_vararg(_c: TypedValue<DataType.CLOSURE>): Promise<boolean> {
    return Promise.resolve(false);
  }

  closure_arity(c: TypedValue<DataType.CLOSURE>): Promise<number> {
    return asPromise(() => this.getClosureEntry(c).arity);
  }

  async *closure_call<T extends DataType>(
    c: TypedValue<DataType.CLOSURE, T>,
    args: AnyTypedValue[],
    returnType: T
  ): AsyncGenerator<void, TypedValue<NoInfer<T>>, undefined> {
    const result = yield* this.closure_call_unchecked(c, args);
    assertTypedValue(result, returnType, 'Closure return value');
    return result;
  }

  async *closure_call_unchecked<T extends DataType>(
    c: TypedValue<DataType.CLOSURE, T>,
    args: AnyTypedValue[]
  ): AsyncGenerator<void, TypedValue<NoInfer<T>>, undefined> {
    const closure = this.getClosureEntry(c);
    const result = yield* closure.func(...args as Parameters<typeof closure.func>);
    return result as TypedValue<NoInfer<T>>;
  }

  async closure_arity_assert(c: TypedValue<DataType.CLOSURE>, arity: number): Promise<void> {
    const actualArity = await this.closure_arity(c);
    if (actualArity !== arity) {
      throw new Error(`Closure expected arity ${arity}, got ${actualArity}.`);
    }
  }

  opaque_make(value: unknown, _immutable?: boolean): Promise<TypedValue<DataType.OPAQUE>> {
    return asPromise(() => {
      const id = this.allocateIdentifier();
      this.opaqueMap.set(id, value);
      return { type: DataType.OPAQUE, value: id as TypedValue<DataType.OPAQUE>['value'] };
    });
  }

  opaque_get(o: TypedValue<DataType.OPAQUE>): Promise<unknown> {
    return asPromise(() => this.getOpaque(o));
  }

  opaque_update(o: TypedValue<DataType.OPAQUE>, value: unknown): Promise<void> {
    return asPromise(() => {
      this.getOpaque(o);
      this.opaqueMap.set(o.value, value);
    });
  }

  tie(_dependent: AnyTypedValue, _dependee: AnyTypedValue | null): Promise<void> {
    return Promise.resolve();
  }

  untie(_dependent: AnyTypedValue, _dependee: AnyTypedValue | null): Promise<void> {
    return Promise.resolve();
  }

  async list(...elements: AnyTypedValue[]): Promise<TypedValue<DataType.LIST>> {
    let result: AnyTypedValue = emptyListValue();
    for (let i = elements.length - 1; i >= 0; i -= 1) {
      result = await this.pair_make(elements[i], result);
    }

    return result;
  }

  async is_list(xs: TypedValue<DataType.LIST>): Promise<boolean> {
    try {
      await this.list_to_vec(xs);
      return true;
    } catch {
      return false;
    }
  }

  list_to_vec(xs: TypedValue<DataType.LIST>): Promise<AnyTypedValue[]> {
    return asPromise(() => {
      const result: AnyTypedValue[] = [];
      let current = xs as AnyTypedValue;

      while (current.type !== DataType.EMPTY_LIST) {
        if (current.type !== DataType.PAIR) {
          throw new Error(`Expected list, got ${typeName(current.type)}.`);
        }

        const [head, tail] = this.getPair(current);
        result.push(head);
        current = tail;
      }

      return result;
    });
  }

  async *accumulate<T extends Exclude<DataType, DataType.VOID>>(
    op: TypedValue<DataType.CLOSURE, T>,
    initial: TypedValue<T>,
    sequence: TypedValue<DataType.LIST>,
    resultType: T
  ): AsyncGenerator<void, TypedValue<T>, undefined> {
    const elements = await this.list_to_vec(sequence);
    let result = initial;

    for (let i = elements.length - 1; i >= 0; i -= 1) {
      result = yield* this.closure_call(op, [elements[i], result], resultType);
    }

    return result;
  }

  async length(xs: TypedValue<DataType.LIST>): Promise<number> {
    return (await this.list_to_vec(xs)).length;
  }

  /**
   * Converts a typed value into the raw JS value stored by this handler.
   */
  toNative(value: AnyTypedValue): unknown {
    switch (value.type) {
      case DataType.VOID:
      case DataType.BOOLEAN:
      case DataType.NUMBER:
      case DataType.CONST_STRING:
      case DataType.EMPTY_LIST:
        return value.value;
      case DataType.PAIR:
        return this.getPair(value);
      case DataType.ARRAY:
        return this.getArray(value);
      case DataType.CLOSURE:
        return this.getClosureEntry(value).func;
      case DataType.OPAQUE:
        return this.getOpaque(value);
      default:
        return value;
    }
  }

  /**
   * Converts a raw JS value or existing typed value into a Conductor typed value.
   */
  toTyped<T extends DataType>(type: T, value: unknown): TypedValue<T> {
    if (isTypedValue(value)) {
      assertTypedValue(value, type, 'Typed value');
      return value as TypedValue<T>;
    }

    switch (type) {
      case DataType.VOID:
        return voidValue() as TypedValue<T>;
      case DataType.BOOLEAN:
        return booleanValue(Boolean(value)) as TypedValue<T>;
      case DataType.NUMBER:
        return numberValue(Number(value)) as TypedValue<T>;
      case DataType.CONST_STRING:
        return stringValue(String(value)) as TypedValue<T>;
      case DataType.EMPTY_LIST:
        return emptyListValue() as TypedValue<T>;
      default:
        throw new Error(`Cannot automatically convert JS value to ${typeName(type)}.`);
    }
  }

  private allocateIdentifier() {
    const id = this.nextIdentifier;
    this.nextIdentifier += 1;
    return id;
  }

  private defaultValue<T extends DataType>(type: T): TypedValue<T> {
    switch (type) {
      case DataType.VOID:
        return voidValue() as TypedValue<T>;
      case DataType.BOOLEAN:
        return booleanValue(false) as TypedValue<T>;
      case DataType.NUMBER:
        return numberValue(0) as TypedValue<T>;
      case DataType.CONST_STRING:
        return stringValue('') as TypedValue<T>;
      case DataType.EMPTY_LIST:
        return emptyListValue() as TypedValue<T>;
      default:
        throw new Error(`Array initial value is required for ${typeName(type)} arrays.`);
    }
  }

  private getPair(pair: TypedValue<DataType.PAIR>) {
    const entry = this.pairMap.get(pair.value);
    if (!entry) {
      throw new Error(`Unknown pair identifier ${pair.value}.`);
    }

    return entry;
  }

  private getArray(array: TypedValue<DataType.ARRAY>) {
    const entry = this.arrayMap.get(array.value);
    if (!entry) {
      throw new Error(`Unknown array identifier ${array.value}.`);
    }

    return entry;
  }

  private getArrayType(array: TypedValue<DataType.ARRAY>) {
    const type = this.arrayTypeMap.get(array.value);
    if (type === undefined) {
      throw new Error(`Unknown array identifier ${array.value}.`);
    }

    return type;
  }

  private getClosureEntry(closure: TypedValue<DataType.CLOSURE>) {
    const entry = this.closureEntryMap.get(closure.value);
    if (!entry) {
      throw new Error(`Unknown closure identifier ${closure.value}.`);
    }

    return entry;
  }

  private getOpaque(opaque: TypedValue<DataType.OPAQUE>) {
    if (!this.opaqueMap.has(opaque.value)) {
      throw new Error(`Unknown opaque identifier ${opaque.value}.`);
    }

    return this.opaqueMap.get(opaque.value);
  }
}

/**
 * Wraps a normal JS function as a Conductor closure stored in the test handler.
 */
export async function closureFromFunction<const Arg extends readonly DataType[], const Ret extends DataType>(
  handler: TestDataHandler,
  signature: IFunctionSignature<Arg, Ret>,
  func: (...args: unknown[]) => unknown | Promise<unknown>
): Promise<TypedValue<DataType.CLOSURE, Ret>> {
  return handler.closure_make(signature, async function* (...args: AnyTypedValue[]) {
    const result = await func(...args.map(arg => handler.toNative(arg)));
    return handler.toTyped(signature.returnType, result);
  } as ExternCallable<Arg, Ret>);
}

/**
 * Calls a closure and checks that the returned value has the expected type.
 */
export async function callClosure<T extends DataType>(
  handler: TestDataHandler,
  closure: TypedValue<DataType.CLOSURE, T>,
  args: AnyTypedValue[],
  returnType?: T
): Promise<TypedValue<T>> {
  return runAsyncGenerator(
    returnType === undefined
      ? handler.closure_call_unchecked(closure, args)
      : handler.closure_call(closure, args, returnType)
  );
}
