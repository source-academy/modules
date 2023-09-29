export const simulationStates = ['idle', 'loading', 'ready', 'error'] as const;

export type SimulationStates = typeof simulationStates[number];
