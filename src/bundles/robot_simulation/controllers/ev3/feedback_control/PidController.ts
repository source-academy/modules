import * as THREE from 'three';

export type PIDConfig = {
  proportionalGain: number;
  integralGain: number;
  derivativeGain: number;
};

type NullaryFunction<T> = () => T;
type BinaryFunction<T> = (a: T, b: T) => T;
type ScaleFunction<T> = (value: T, scale: number) => T;

type PIDControllerOptions<T> = {
  zero: NullaryFunction<T>;
  add: BinaryFunction<T>;
  subtract: BinaryFunction<T>;
  scale: ScaleFunction<T>;

  proportionalGain: number;
  integralGain: number;
  derivativeGain: number;
};

class PIDController<T> {
  zero: NullaryFunction<T>;
  add: BinaryFunction<T>;
  subtract: BinaryFunction<T>;
  scale: ScaleFunction<T>;

  proportionalGain: number;
  integralGain: number;
  derivativeGain: number;

  errorsSum: T;
  previousError: T;

  constructor({
    zero,
    add,
    subtract,
    scale,
    proportionalGain,
    integralGain,
    derivativeGain,
  }: PIDControllerOptions<T>) {
    this.zero = zero;
    this.add = add;
    this.subtract = subtract;
    this.scale = scale;

    this.proportionalGain = proportionalGain;
    this.integralGain = integralGain;
    this.derivativeGain = derivativeGain;

    this.errorsSum = this.zero();
    this.previousError = this.zero();
  }

  calculate(currentValue: T, setpoint: T): T {
    const error = this.subtract(setpoint, currentValue);
    this.errorsSum = this.add(this.errorsSum, error);

    const proportional = this.scale(error, this.proportionalGain);
    const integral = this.scale(this.errorsSum, this.integralGain);
    const derivative = this.scale(this.subtract(error, this.previousError), this.derivativeGain);
    this.previousError = error;

    return this.add(this.add(proportional, integral), derivative);
  }
}

export class NumberPidController extends PIDController<number> {
  constructor({
    proportionalGain,
    integralGain,
    derivativeGain,
  }: PIDConfig) {
    super({
      zero: () => 0,
      add: (a, b) => a + b,
      subtract: (a, b) => a - b,
      scale: (value, scale) => value * scale,
      proportionalGain,
      integralGain,
      derivativeGain,
    });
  }
}

export class VectorPidController extends PIDController<THREE.Vector3> {
  constructor({
    proportionalGain,
    integralGain,
    derivativeGain,
  }: PIDConfig) {
    super({
      zero: () => new THREE.Vector3(0, 0, 0),
      add: (a, b) => a.clone()
        .add(b),
      subtract: (a, b) => a.clone()
        .sub(b),
      scale: (value, scale) => value.clone()
        .multiplyScalar(scale),
      proportionalGain,
      integralGain,
      derivativeGain,
    });
  }
}
