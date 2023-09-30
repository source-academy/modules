export type CarSettings = {
  chassis: {
    length: number;
    height: number;
    width: number;
  };
  wheel: {
    diameter: number;
    maxSuspensionLength: number;
    suspension: { stiffness: number; damping: number };
    buffer: number;
    sideForceMultiplier: number;
  };
  turning: { sensitivity: number };
};

export const carSettings: CarSettings = {
  chassis: {
    length: 1,
    height: 0.5,
    width: 0.7,
  },
  wheel: {
    diameter: 1.5,
    maxSuspensionLength: 2.5,
    suspension: {
      stiffness: 20,
      damping: 2,
    },
    buffer: 0.02,
    sideForceMultiplier: -20,
  },
  turning: {
    sensitivity: 0.5,
  },
} as const;
