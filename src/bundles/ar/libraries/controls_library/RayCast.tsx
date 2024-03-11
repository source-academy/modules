import {
  type Camera,
  Group,
  Mesh,
  Object3D,
  type Object3DEventMap,
  Raycaster,
  Vector2,
} from 'three';

const raycaster = new Raycaster();

export function getIntersection(camera: Camera, coreObject: Object3D) {
  const pointer = new Vector2(0, 0);
  raycaster.setFromCamera(pointer, camera);
  const cascadeChildren = getCascadeMeshs(coreObject.children);
  const items = raycaster.intersectObjects(cascadeChildren, true);
  const nearestItem = items
    .filter((item) => item.distance !== 0)
    .sort((item) => item.distance);
  if (nearestItem.length > 0) {
    return getTopParent(nearestItem[0].object, coreObject);
  }
  return undefined;
}

function getCascadeMeshs(children: Object3D<Object3DEventMap>[]) {
  const cascadeChildren: Object3D<Object3DEventMap>[] = [];
  let queue = Array.from(children);
  while (queue.length > 0) {
    const item = queue.pop();
    if (item) {
      if (item instanceof Mesh) {
        cascadeChildren.push(item);
      } else if (item instanceof Group) {
        queue = queue.concat(item.children);
      }
    }
  }
  return cascadeChildren;
}

function getTopParent(
  child: Object3D<Object3DEventMap>,
  coreObject: Object3D,
): Mesh | undefined {
  let parent = child;
  let lastMesh = child;
  while (
    parent.parent instanceof Object3D &&
    parent.parent.uuid !== coreObject.uuid
  ) {
    parent = parent.parent;
    if (parent instanceof Mesh) {
      lastMesh = parent;
    }
  }
  if (lastMesh instanceof Mesh) {
    return lastMesh;
  }
  return undefined;
}
