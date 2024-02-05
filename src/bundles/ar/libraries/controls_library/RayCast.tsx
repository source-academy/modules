import {
  Camera,
  Group,
  Mesh,
  Object3D,
  type Object3DEventMap,
  Raycaster,
  Vector2,
} from "three";

const raycaster = new Raycaster();

export function getIntersection(camera: Camera, coreObject: Object3D) {
  let pointer = new Vector2(0, 0);
  raycaster.setFromCamera(pointer, camera);
  let cascadeChildren = getCascadeMeshs(coreObject.children);
  let items = raycaster.intersectObjects(cascadeChildren, true);
  let nearestItem = items
    .filter((item) => {
      return item.distance != 0;
    })
    .sort((item) => {
      return item.distance;
    });
  if (nearestItem.length > 0) {
    return getTopParent(nearestItem[0].object, coreObject);
  } else {
    return undefined;
  }
}

function getCascadeMeshs(children: Object3D<Object3DEventMap>[]) {
  let cascadeChildren: Object3D<Object3DEventMap>[] = [];
  let queue = Array.from(children);
  while (queue.length > 0) {
    let item = queue.pop();
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
  coreObject: Object3D
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

