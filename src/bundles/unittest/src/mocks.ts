import { pair, vector_to_list, type List } from 'js-slang/dist/stdlib/list';

/**
 * Symbol for identifying the mock properties. Should not be exposed to cadets.
 */
const mockSymbol = Symbol();

interface MockedFunction {
  (...args: any[]): any;
  [mockSymbol]: {
    arglist: any[];
    retVals: any[];
  };
}

function throwIfNotMockedFunction(obj: (...args: any[]) => any, func_name: string): asserts obj is MockedFunction {
  if (!(mockSymbol in obj)) {
    throw new Error(`${func_name} expects a mocked function as argument`);
  }
}

/**
 * Mocks a given function, allowing you to track the number of times it's been called and what
 * values it returned with. You should call the return value from this function rather than the
 * original value you passed in if you want the mocked function to be properly tracked.
 * @param fn Function to mock
 * @returns A mocked version of the given function.
 */
export function mock_function(fn: (...args: any[]) => any): MockedFunction {
  const arglist: any[] = [];
  const retVals: any[] = [];

  function func(...args: any[]) {
    arglist.push(args);
    const retVal = fn.apply(fn, args);
    if (retVal !== undefined) {
      retVals.push(retVal);
    }

    return retVal;
  }

  func[mockSymbol] = { arglist, retVals };
  func.toString = () => fn.toString();

  return func;
}

/**
 * Given a mocked function, returns the number of times the function has been called.
 * @param fn Mocked function
 * @returns Number of times the function has been called.
 */
export function get_num_calls(fn: MockedFunction) {
  throwIfNotMockedFunction(fn, get_num_calls.name);
  return fn[mockSymbol].arglist.length;
}

/**
 * Given a mocked function, returns all the arguments the function has been called with as a list of lists.
 * @param fn Mocked function
 * @returns List where each element represents a different time the function was called.
 */
export function get_arg_list(fn: MockedFunction) {
  throwIfNotMockedFunction(fn, get_arg_list.name);
  const { arglist } = fn[mockSymbol];

  return arglist.reduceRight<List>((res, args) => {
    const argsAsList = vector_to_list(args);
    return pair(argsAsList, res);
  }, null);
}

/**
 * Given a mocked function, returns all the values the function has returned with.
 * @param fn Mocked function
 * @returns List where each element represents a different time the function returned a value. If the function returns
 * void or `undefined`, then no value is appended to the list.
 */
export function get_ret_vals(fn: MockedFunction) {
  throwIfNotMockedFunction(fn, get_ret_vals.name);
  const { retVals } = fn[mockSymbol];
  return vector_to_list(retVals);
}
