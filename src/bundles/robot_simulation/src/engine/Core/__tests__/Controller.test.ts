import { describe, expect, test, vi, type Mock } from 'vitest';
import type { PhysicsTimingInfo } from '../../Physics';
import {
  ControllerGroup,
  ControllerMap,
  type Controller,
} from '../Controller';

// Helper function to create a PhysicsTimingInfo object
// CallbackHandler only uses the stepCount and timestep properties
// so we only need to create those
const createTimingInfo = () => {
  return { stepCount: 1, timestep: 2 } as PhysicsTimingInfo;
};

// Helper type to extract properties that are assignable to functions
type FunctionKeys<T extends object> = keyof {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K]
};

describe(ControllerMap, () => {
  // Define test cases in an array of arrays. Each inner array represents parameters for a single test case.
  const methodsTestData: Array<
    [FunctionKeys<ControllerMap<Record<string, Controller>>>, Mock, { async: boolean, args?: any[] }]
  > = [
    ['start', vi.fn(), { async: true }],
    ['update', vi.fn(), { async: false, args: [createTimingInfo()] }],
    ['fixedUpdate', vi.fn(), { async: false, args: [createTimingInfo()] }],
    ['onDestroy', vi.fn(), { async: false }],
  ];

  test.each(methodsTestData)(
    '%s calls %s on all contained controllers',
    async (methodName, mockMethod, { async, args = [] }) => {
      const notCalledMethod = vi.fn();
      const controllerMap = new ControllerMap(
        {
          first: { [methodName]: mockMethod },
          second: { [methodName]: mockMethod },
          // @ts-expect-error this test checks for a method that does not exist
          third: { notMethodName: notCalledMethod },
        },
        { [methodName]: mockMethod, notMethodName: notCalledMethod }
      );

      const method: any = controllerMap[methodName].bind(controllerMap);

      // If the method is async, await it. Otherwise, call it directly.
      if (async) {
        await method(...args);
      } else {
        method(...args);
      }

      // Assert that each controller's method was called once
      expect(mockMethod).toHaveBeenCalledTimes(3);
      expect(notCalledMethod).not.toHaveBeenCalled();
      if (args.length) {
        expect(mockMethod).toHaveBeenCalledWith(...args);
      }
    }
  );

  test.each(methodsTestData)(
    '%s: no calls if missing callbacks object',
    async (methodName, mockMethod, { async, args = [] }) => {
      mockMethod.mockClear();
      const controllerMap = new ControllerMap({});
      const method: any = controllerMap[methodName].bind(controllerMap);

      if (async) {
        await method(...args);
      } else {
        method(...args);
      }
      expect(mockMethod).toHaveBeenCalledTimes(0);
    }
  );

  test('get returns the correct controller for a given key', () => {
    // Setup: Create a couple of mock controllers
    const mockController1 = {
      name: 'Controller1',
      start: vi.fn(),
      update: vi.fn(),
    };
    const mockController2 = {
      name: 'Controller2',
      start: vi.fn(),
      update: vi.fn(),
    };

    const controllerMap = new ControllerMap({
      controller1: mockController1,
      controller2: mockController2,
    });

    expect(controllerMap.get('controller1')).toBe(mockController1);
    expect(controllerMap.get('controller2')).toBe(mockController2);

    // @ts-expect-error This test checks for a key that does not exist
    expect(controllerMap.get('controller3')).toBeUndefined();
  });
});

describe(ControllerGroup, () => {
  // Define test data for each method
  const methodsTestData: Array<[FunctionKeys<ControllerGroup>, { async: boolean, args: any[] }]> = [
    ['start', { async: true, args: [] }],
    ['update', { async: false, args: [{ stepCount: 1, timestep: 20 }] }], // Assuming createTimingInfo() returns something similar
    ['fixedUpdate', { async: false, args: [{ stepCount: 2, timestep: 15 }] }],
    ['onDestroy', { async: false, args: [] }],
  ];

  test.each(methodsTestData)(
    '%s method behavior',
    async (methodName, { async, args }) => {
      const mockMethod = vi.fn();
      const notCalledMethod = vi.fn();
      const controller: Controller = {
        [methodName]: mockMethod,
        // @ts-expect-error This test checks for a method that does not exist
        'notMethodName': notCalledMethod,
      };
      const controllerGroup = new ControllerGroup();
      controllerGroup.addController(controller);

      const method: any = controllerGroup[methodName].bind(controllerGroup);

      // Execute the method
      if (async) {
        await method(...args);
      } else {
        method(...args);
      }

      // Assertions
      if (methodName === 'onDestroy') {
        // Special case for onDestroy to check if controllers are cleared
        expect(controllerGroup.controllers).toHaveLength(0);
      } else {
        // For start, update, fixedUpdate check if the method was called correctly
        expect(mockMethod).toHaveBeenCalledTimes(1);
        expect(notCalledMethod).not.toHaveBeenCalled();
        if (args.length) {
          expect(mockMethod).toHaveBeenCalledWith(...args);
        }
      }
    }
  );

  test.each(methodsTestData)(
    '%s no method calls if controller does not have method name',
    async (methodName, { async, args }) => {
      const notCalledMethod = vi.fn();
      const controller: Controller = {
        // @ts-expect-error This test checks for a method that does not exist
        'notMethodName': notCalledMethod,
      };
      const controllerGroup = new ControllerGroup();
      controllerGroup.addController(controller);

      const method: any = controllerGroup[methodName].bind(controllerGroup);

      if (async) {
        await method(...args);
      } else {
        method(...args);
      }

      expect(notCalledMethod).not.toHaveBeenCalled();
    }
  );
});
