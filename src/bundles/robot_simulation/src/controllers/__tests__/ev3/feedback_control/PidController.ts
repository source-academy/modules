import * as THREE from 'three';
import { beforeEach, describe, expect, it } from 'vitest';
import { NumberPidController, VectorPidController } from '../../../ev3/feedback_control/PidController';

const resetPid = (pidController:NumberPidController) => {
  pidController.errorsSum = 0;
  pidController.previousError = 0;
};

const resetVectorPid = (pidController:VectorPidController) => {
  pidController.errorsSum = new THREE.Vector3();
  pidController.previousError = new THREE.Vector3();
};

describe('NumberPidController', () => {
  let pidController;

  beforeEach(() => {
    pidController = new NumberPidController({
      proportionalGain: 0.1,
      integralGain: 0.01,
      derivativeGain: 0.05,
    });
  });

  it('should initialize correctly', () => {
    expect(pidController.proportionalGain).toEqual(0.1);
    expect(pidController.integralGain).toEqual(0.01);
    expect(pidController.derivativeGain).toEqual(0.05);
  });

  it('should calculate correct PID output', () => {
    const setpoint = 10;
    let output;

    output = pidController.calculate(2, setpoint);
    expect(output).toBeGreaterThan(0);
    resetPid(pidController);

    output = pidController.calculate(9, setpoint);
    expect(output).toBeGreaterThan(0);
    resetPid(pidController);

    output = pidController.calculate(11, setpoint);
    expect(output).toBeLessThan(0);
    resetPid(pidController);

    output = pidController.calculate(10, setpoint);
    expect(output).toBeCloseTo(0);
  });
});

describe('VectorPidController', () => {
  let pidController;

  beforeEach(() => {
    pidController = new VectorPidController({
      proportionalGain: 0.1,
      integralGain: 0.01,
      derivativeGain: 0.05,
    });
  });

  it('should initialize correctly', () => {
    expect(pidController.proportionalGain).toEqual(0.1);
  });

  it('should calculate correct PID output for vector inputs', () => {
    const setpoint = new THREE.Vector3(10, 10, 10);
    let output;

    output = pidController.calculate(new THREE.Vector3(0, 0, 0), setpoint);
    expect(output.length()).toBeGreaterThan(0); // Output should push towards setpoint
    resetVectorPid(pidController);

    output = pidController.calculate(new THREE.Vector3(9, 9, 9), setpoint);
    expect(output.length()).toBeGreaterThan(0);
    resetVectorPid(pidController);

    output = pidController.calculate(new THREE.Vector3(11, 11, 11), setpoint);
    expect(output.length()).toBeGreaterThan(0);
    resetVectorPid(pidController);

    output = pidController.calculate(new THREE.Vector3(10, 10, 10), setpoint);
    expect(output.x).toBeCloseTo(0);
    expect(output.y).toBeCloseTo(0);
    expect(output.z).toBeCloseTo(0);
  });
});
