import type { Simulation } from 'nbody';

export interface RecordInfo {
  isRecording: boolean;
  recordFor: number;
  recordSpeed: number;
}

export interface NBodyModuleState {
  simulations: Simulation[];
  recordInfo: RecordInfo;
}
