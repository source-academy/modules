import * as THREE from "three";
import { addCuboid } from "../../Render/helpers/MeshFactory";

// Mock the necessary Three.js methods and classes
jest.mock("three", () => {
  const originalModule = jest.requireActual("three");

  class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    copy(vector) {
      this.x = vector.x;
      this.y = vector.y;
      this.z = vector.z;
      return this; // Return this for chaining
    }
  }

  class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x = 0, y = 0, z = 0, w = 1) {
      // Default w to 1 for a neutral quaternion
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }

    copy(quaternion) {
      this.x = quaternion.x;
      this.y = quaternion.y;
      this.z = quaternion.z;
      this.w = quaternion.w;
      return this; // Return this for chaining
    }
  }

  return {
    ...originalModule,
    BoxGeometry: jest.fn(),
    MeshPhysicalMaterial: jest.fn(),
    Mesh: jest.fn().mockImplementation(function (geometry, material) {
      this.geometry = geometry;
      this.material = material;
      this.position = new Vector3();
      this.quaternion = new Quaternion();
    }),
    Vector3: Vector3,
    Quaternion: Quaternion,
    Color: jest.fn().mockImplementation(function (color) {
      return { color };
    }),
  };
});

describe("addCuboid", () => {
  it("creates a cuboid with the correct dimensions and color", () => {
    const orientation = {
      position: new THREE.Vector3(1, 2, 3),
      rotation: new THREE.Quaternion(0, 0, 0, 1),
    };
    const width = 4;
    const height = 5;
    const length = 6;
    const color = new THREE.Color("red");
    const debug = false;

    const mesh = addCuboid({
      orientation,
      dimension: { width, height, length },
      color,
      debug,
    });

    expect(THREE.BoxGeometry).toHaveBeenCalledWith(width, height, length);
    expect(THREE.MeshPhysicalMaterial).toHaveBeenCalledWith({
      color,
      side: THREE.DoubleSide,
    });
    expect(mesh).toHaveProperty("geometry");
    expect(mesh).toHaveProperty("material");
    expect(mesh.position).toEqual({ x: 1, y: 2, z: 3 });
    expect(mesh.quaternion).toEqual({ x: 0, y: 0, z: 0, w: 1 });
  });

  it("creates a cuboid with wireframe material when debug is true", () => {
    const orientation = {
      position: new THREE.Vector3(1, 2, 3),
      rotation: new THREE.Quaternion(0, 0, 0, 1),
    };
    const width = 4;
    const height = 5;
    const length = 6;
    const color = new THREE.Color("red");
    const debug = true; // Enable debug mode

    const mesh = addCuboid({
      orientation,
      dimension: { width, height, length },
      color,
      debug,
    });

    // Check that the BoxGeometry was called with the correct dimensions
    expect(THREE.BoxGeometry).toHaveBeenCalledWith(width, height, length);

    // Verify that the material is created with wireframe enabled
    expect(THREE.MeshPhysicalMaterial).toHaveBeenCalledWith({
      color,
      wireframe: true, // Expect wireframe to be true when debug is true
    });

    // Verify the mesh properties
    expect(mesh).toHaveProperty("geometry");
    expect(mesh).toHaveProperty("material");
    expect(mesh.position).toEqual({ x: 1, y: 2, z: 3 });
    expect(mesh.quaternion).toEqual({ x: 0, y: 0, z: 0, w: 1 });
  });
});
