import { CallbackHandler } from "../../Core/CallbackHandler";
import { PhysicsTimingInfo } from "../../Physics";

// Helper function to create a PhysicsTimingInfo object
// CallbackHandler only uses the stepCount and timestep properties
// so we only need to create those
const createTimingInfo = ({
  stepCount,
  timestep,
}: {
  stepCount: number;
  timestep: number;
}) => {
  return { stepCount, timestep } as PhysicsTimingInfo;
};

describe("CallbackHandler", () => {
  test("adds callbacks correctly", () => {
    const handler = new CallbackHandler();
    const mockCallback = jest.fn();

    handler.addCallback(mockCallback, 100);

    expect(handler.callbackStore.length).toBe(1);
    expect(handler.callbackStore[0].delay).toBe(100);
    expect(handler.callbackStore[0].callback).toBe(mockCallback);
  });

  test("executes callback after correct delay", () => {
    jest.useFakeTimers();
    const handler = new CallbackHandler();
    const mockCallback = jest.fn();

    handler.addCallback(mockCallback, 100);
    handler.checkCallbacks(createTimingInfo({ stepCount: 1, timestep: 100 }));

    expect(mockCallback).toHaveBeenCalled();
  });

  test("removes callback after execution", () => {
    const handler = new CallbackHandler();
    const mockCallback = jest.fn();

    handler.addCallback(mockCallback, 100);
    handler.checkCallbacks(createTimingInfo({ stepCount: 1, timestep: 100 }));

    expect(handler.callbackStore.length).toBe(0);
  });

  test("handles multiple callbacks correctly", () => {
    const handler = new CallbackHandler();
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    handler.addCallback(mockCallback1, 50);
    handler.addCallback(mockCallback2, 100);
    handler.checkCallbacks(createTimingInfo({ stepCount: 1, timestep: 50 }));

    expect(mockCallback1).toHaveBeenCalled();
    expect(mockCallback2).not.toHaveBeenCalled();

    handler.checkCallbacks(createTimingInfo({ stepCount: 2, timestep: 50 }));
    expect(mockCallback2).toHaveBeenCalled();
  });

  test("does not execute callback before its time", () => {
    const handler = new CallbackHandler();
    const mockCallback = jest.fn();

    handler.addCallback(mockCallback, 100);
    handler.checkCallbacks(createTimingInfo({ stepCount: 1, timestep: 50 }));

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test("correctly handles step count changes", () => {
    const handler = new CallbackHandler();
    const mockCallback = jest.fn();

    handler.addCallback(mockCallback, 100);
    // Simulate no step count change
    handler.checkCallbacks(createTimingInfo({ stepCount: 1, timestep: 50 }));
    handler.checkCallbacks(createTimingInfo({ stepCount: 1, timestep: 50 })); // No change in step count

    expect(mockCallback).not.toHaveBeenCalled();
    expect(handler.currentStepCount).toBe(1);

    // Now change the step count
    handler.checkCallbacks(createTimingInfo({ stepCount: 2, timestep: 50 }));
    expect(handler.currentStepCount).toBe(2);
  });
});
