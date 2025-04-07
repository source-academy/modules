import type { Pair, List } from 'js-slang/dist/stdlib/list';

export type TimeSamples = Array<number>;
export type FrequencySample = Pair<number, number>;
export type FrequencySamples = Array<FrequencySample>;
export type FrequencyList = List;
export type Filter = (freq: FrequencyList) => FrequencyList;
