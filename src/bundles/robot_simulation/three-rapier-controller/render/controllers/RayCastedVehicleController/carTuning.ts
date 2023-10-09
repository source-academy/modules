export type CarSettings = {
  chassis: {
    length: number;
    height: number;
    width: number;
    weight: number;
  };
  wheel: {
    restHeight:number;
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
    length: 0.18, // in meters
    height: 0.095, // in meters
    width: 0.145, // in meters
    weight: 0.6, // in kg
  },
  wheel: {
    restHeight: 0.03,
    diameter: 0.055,
    maxSuspensionLength: 0.1,
    suspension: {
      stiffness: 70,
      damping: 10,
    },
    buffer: 0.02,
    sideForceMultiplier: -20,
  },
  turning: {
    sensitivity: 0.5,
  },
} as const;
