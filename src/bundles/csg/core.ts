/* [Imports] */
import { RenderGroup } from './types.js';
import { Shape } from './utilities.js';

/* [Main] */
let renderGroups: RenderGroup[] = [];

/* [Exports] */
//TODO make render groups unique to each run instead (track in module context),
// to prevent shapes from spilling over to subsequent runs, eg from error midway
export function nextRenderGroup(): void {
  renderGroups.push([]);
}

export function storeShape(shape: Shape): void {
  if (renderGroups.length <= 0) nextRenderGroup();

  let currentRenderGroup: RenderGroup = renderGroups.at(-1) as RenderGroup;
  currentRenderGroup.push(shape);
}

export function getRenderGroups(): RenderGroup[] {
  return [...renderGroups];
}

export function useFirstRenderGroup(): RenderGroup | null {
  if (renderGroups.length <= 0) return null;

  return renderGroups.shift() as RenderGroup;
}
