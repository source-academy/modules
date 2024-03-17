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

/**
 * Returns first object in the middle of the screen, if any.
 *
 * Rules for an object to be checked:
 * 1. The object should be a child of the coreObject or a child of the child of the coreObject, etc...
 * 2. The object must be a mesh.
 * 3. The object cannot have a mesh parent or parent with a mesh parent, etc... The parent can be a group.
 *
 * @param camera Current instance of Three.js camera
 * @param coreObject Parent node containing all objects
 */
export function getIntersection(camera: Camera, coreObject: Object3D) {
  const pointer = new Vector2(0, 0);
  raycaster.setFromCamera(pointer, camera);
  // Get all meshes, including indirect child meshes
  const cascadeChildren = getCascadeMeshs(coreObject.children);
  // Identify meshes that intersect with line of sight
  const items = raycaster.intersectObjects(cascadeChildren, true);
  const nearestItem = items
    .filter((item) => item.distance !== 0)
    .sort((item) => item.distance);
  if (nearestItem.length > 0) {
    // Obtain the first object in line of sight
    return getTopParent(nearestItem[0].object, coreObject);
  }
  return undefined;
}

/**
 * A function to get all child meshes.
 * Inclusive of those that are nested in other child meshes.
 *
 * @param children Array of nodes to check
 */
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

/**
 * Returns the uppermost parent mesh that is not the coreObject.
 *
 * @param child The child in question, whose uppermost parent we want to identify
 * @param coreObject The coreObject used
 */
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
