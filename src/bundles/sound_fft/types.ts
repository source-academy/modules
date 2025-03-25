import type { Pair } from 'js-slang/dist/stdlib/list';

export type TimeSamples = Array<number>;
export type FrequencySample = Pair<number, number>;
export type FrequencySamples = Array<FrequencySample>;
export type Filter = (freq: FrequencySamples) => FrequencySamples;
