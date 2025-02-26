/* [Exports] */
export function degreesToRadians(degrees: number): number {
  return (degrees / 360) * (2 * Math.PI);
}

export function hexToColor(hex: string): [number, number, number] {
  const regex = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/igu;
  const groups = regex.exec(hex);

  if (groups == undefined) return [0, 0, 0];
  return [
    parseInt(groups[1], 16) / 0xff,
    parseInt(groups[2], 16) / 0xff,
    parseInt(groups[3], 16) / 0xff
  ];
}
