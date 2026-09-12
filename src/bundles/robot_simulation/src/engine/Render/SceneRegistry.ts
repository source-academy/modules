import * as THREE from 'three';
import type { EntityDescriptor, EntitySpawnedMessage } from '../../protocol';

/**
 * Worker-safe replacement for the pre-migration `Renderer`. Physics/control-program code
 * (Cuboid, Chassis, Motor, Mesh, Paper, ...) runs inside Conductor's runner Web Worker, which has
 * no DOM/WebGL - so nothing here ever touches `THREE.WebGLRenderer`, `OrbitControls`, or a
 * canvas. `add()` allocates a bare `THREE.Object3D` transform node (safe in a worker - it's just
 * a plain JS scene-graph node, no rendering happens) that calling code positions exactly as it
 * always positioned its old `THREE.Mesh`/`GLTF.scene`, plus a serializable {@link EntityDescriptor}
 * describing what the entity should actually look like. The RobotSimulation tab (main thread,
 * real DOM/WebGL) builds the real THREE geometry from that descriptor and keeps it positioned at
 * this node's transform via the state channel - see protocol.ts.
 */
export class SceneRegistry {
  private nextId = 1;
  private readonly nodes = new Map<number, THREE.Object3D>();
  private readonly spawned: EntitySpawnedMessage[] = [];
  private onSpawn: ((message: EntitySpawnedMessage) => void) | undefined;

  /** Called for every future `add()`, and (via {@link replaySpawns}) for every past one. */
  setSpawnListener(listener: (message: EntitySpawnedMessage) => void): void {
    this.onSpawn = listener;
  }

  /** Replays every entity spawned so far - for a tab that (re)connects after entities already
    exist, mirrors csg/rune's render backlog replay. */
  replaySpawns(): void {
    if (!this.onSpawn) return;
    for (const message of this.spawned) this.onSpawn(message);
  }

  add(descriptor: EntityDescriptor): THREE.Object3D {
    const id = this.nextId++;
    const node = new THREE.Object3D();
    this.nodes.set(id, node);
    const message: EntitySpawnedMessage = { kind: 'entity-spawned', id, descriptor };
    this.spawned.push(message);
    this.onSpawn?.(message);
    return node;
  }

  /** Serializes every tracked node's current transform into a flat `Float32Array`, laid out as
    `[id, px, py, pz, qx, qy, qz, qw] * N` - sent as a transferable over the state channel. */
  snapshot(): Float32Array {
    const stride = 8;
    const buffer = new Float32Array(this.nodes.size * stride);
    let i = 0;
    for (const [id, node] of this.nodes) {
      const offset = i * stride;
      buffer[offset] = id;
      buffer[offset + 1] = node.position.x;
      buffer[offset + 2] = node.position.y;
      buffer[offset + 3] = node.position.z;
      buffer[offset + 4] = node.quaternion.x;
      buffer[offset + 5] = node.quaternion.y;
      buffer[offset + 6] = node.quaternion.z;
      buffer[offset + 7] = node.quaternion.w;
      i += 1;
    }
    return buffer;
  }
}
