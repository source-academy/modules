import { RuntimeSourceError } from 'js-slang/dist/errors/runtimeSourceError';
import { stringify } from 'js-slang/dist/utils/stringify';

export class InvalidParameterTypeError extends RuntimeSourceError {
  constructor(
    public readonly expectedType: string,
    public readonly actualValue: unknown,
    public readonly func_name: string,
    public readonly param_name?: string
  ) {
    super()
  }

  public override explain(): string {
    const paramString = this.param_name ? ` for ${this.param_name}` : '';
    return `${this.func_name}: Expected ${this.expectedType}${paramString}, got ${stringify(this.actualValue)}.`
  }

  public get message() {
    return this.explain();
  }

  public override toString() {
    return this.explain();
  }
}

export class InvalidCallbackError extends InvalidParameterTypeError {
  constructor(
    expected: number | string,
    actualValue: unknown,
    func_name: string,
    param_name?: string
  ) {
    const expectedStr = typeof expected === 'number' ? `function with ${expected} parameter${expected === 1 ? 's' : ''}` : expected;
    super(
      expectedStr,
      actualValue,
      func_name,
      param_name
    )
  }
}
