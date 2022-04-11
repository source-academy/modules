/* [Imports] */
import { Shape } from './utilities.js';

/* [Main] */
let storedShapes: Shape[] = [];

/* [Exports] */
export function getStoredShapes(): Shape[] {
  return [...storedShapes];
}

export function storeShape(shape: Shape): void {
  storedShapes.push(shape);
}

export function clearStoredShapes(): void {
  storedShapes = [];
}
