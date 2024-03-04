import {
  Controller,
  ControllerGroup,
  ControllerMap,
} from "../../Core/Controller";
import { PhysicsTimingInfo } from "../../Physics";

// Helper function to create a PhysicsTimingInfo object
// CallbackHandler only uses the stepCount and timestep properties
// so we only need to create those
const createTimingInfo = () => {
  return { stepCount: 1, timestep: 2 } as PhysicsTimingInfo;
};

describe("ControllerMap methods", () => {
  // Define test cases in an array of arrays. Each inner array represents parameters for a single test case.
  const methodsTestData: Array<
    [string, jest.Mock, { async: boolean; args?: any[] }]
  > = [
    ["start", jest.fn(), { async: true }],
    ["update", jest.fn(), { async: false, args: [createTimingInfo()] }],
    ["fixedUpdate", jest.fn(), { async: false, args: [createTimingInfo()] }],
    ["onDestroy", jest.fn(), { async: false }],
  ];

  test.each(methodsTestData)(
    "%s calls %s on all contained controllers",
    async (methodName, mockMethod, { async, args = [] }) => {
      const notCalledMethod = jest.fn();
      const controllerMap = new ControllerMap(
        {
          first: { [methodName]: mockMethod },
          second: { [methodName]: mockMethod },
          // @ts-expect-error
          third: { notMethodName: notCalledMethod },
        },
        { [methodName]: mockMethod, notMethodName: notCalledMethod }
      );

      // If the method is async, await it. Otherwise, call it directly.
      if (async) {
        await controllerMap[methodName](...args);
      } else {
        controllerMap[methodName](...args);
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
    "no calls if missing callbacks object",
    async (methodName, mockMethod, { async, args = [] }) => {
      mockMethod.mockClear();
      const controllerMap = new ControllerMap({});
      if (async) {
        await controllerMap[methodName](...args);
      } else {
        controllerMap[methodName](...args);
      }
      expect(mockMethod).toHaveBeenCalledTimes(0);
    }
  );

  test("get returns the correct controller for a given key", () => {
    // Setup: Create a couple of mock controllers
    const mockController1 = {
      name: "Controller1",
      start: jest.fn(),
      update: jest.fn(),
    };
    const mockController2 = {
      name: "Controller2",
      start: jest.fn(),
      update: jest.fn(),
    };

    const controllerMap = new ControllerMap({
      controller1: mockController1,
      controller2: mockController2,
    });

    expect(controllerMap.get("controller1")).toBe(mockController1);
    expect(controllerMap.get("controller2")).toBe(mockController2);

    // @ts-expect-error
    expect(controllerMap.get("controller3")).toBeUndefined();
  });
});

describe("ControllerGroup", () => {
  // Define test data for each method
  const methodsTestData: Array<[string, { async: boolean; args: any[] }]> = [
    ["start", { async: true, args: [] }],
    ["update", { async: false, args: [{ stepCount: 1, timestep: 20 }] }], // Assuming createTimingInfo() returns something similar
    ["fixedUpdate", { async: false, args: [{ stepCount: 2, timestep: 15 }] }],
    ["onDestroy", { async: false, args: [] }],
  ];

  test.each(methodsTestData)(
    "%s method behavior",
    async (methodName, { async, args }) => {
      const mockMethod = jest.fn();
      const notCalledMethod = jest.fn();
      const controller: Controller = {
        [methodName]: mockMethod,
        // @ts-expect-error
        "notMethodName": notCalledMethod,
      };
      const controllerGroup = new ControllerGroup();
      controllerGroup.addController(controller);

      // Execute the method
      if (async) {
        await controllerGroup[methodName](...args);
      } else {
        controllerGroup[methodName](...args);
      }

      // Assertions
      if (methodName === "onDestroy") {
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
    "%s no method calls if controller does not have method name",
    async (methodName, { async, args }) => {
      const notCalledMethod = jest.fn();
      const controller: Controller = {
        // @ts-expect-error
        "notMethodName": notCalledMethod,
      };
      const controllerGroup = new ControllerGroup();
      controllerGroup.addController(controller);

      if (async) {
        await controllerGroup[methodName](...args);
      } else {
        controllerGroup[methodName](...args);
      }

      expect(notCalledMethod).not.toHaveBeenCalled();
    }
  );
});
