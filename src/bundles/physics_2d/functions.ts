/* eslint-disable new-cap */
// We have to disable linting rules since Box2D functions do not
// follow the same guidelines as the rest of the codebase.

/**
 * @module physics_2d
 * @author Muhammad Fikri Bin Abdul Kalam
 * @author Yu Jiali
 */

import context from 'js-slang/context';

import { b2CircleShape, b2PolygonShape } from '@box2d/core';

import { type Force, Vector2 } from './types';
import { PhysicsObject } from './PhysicsObject';
import { PhysicsWorld } from './PhysicsWorld';

// Global Variables

let world: PhysicsWorld | null = null;
const NO_WORLD = new Error('Please call set_gravity first!');
const MULTIPLE_WORLDS = new Error('You may only call set_gravity once!');

// Module's Exposed Functions

/**
 * Makes a 2d vector with the given x and y components.
 *
 * @param x x-component of new vector
 * @param y y-component of new vector
 * @returns with x, y as components
 *
 * @category Main
 */
export function make_vector(x: number, y: number): Vector2 {
  return new Vector2(x, y);
}

/**
 * Makes a force with direction vector, magnitude, force duration and start time.
 *
 * @param dir direction of force
 * @param mag magnitude of force
 * @param dur duration of force
 * @param start start time of force
 * @returns new force
 *
 * @category Dynamics
 */
export function make_force(
  dir: Vector2,
  mag: number,
  dur: number,
  start: number,
): Force {
  let force: Force = {
    direction: dir,
    magnitude: mag,
    duration: dur,
    start_time: start,
  };
  return force;
}

/**
 * Creates a new physics world and sets the gravity of the world.
 *
 * @param v gravity vector
 * @example
 * ```
 * set_gravity(0, -9.8); // gravity vector for real world
 * ```
 *
 * @category Main
 */
export function set_gravity(v: Vector2) {
  if (world) {
    throw MULTIPLE_WORLDS;
  }

  world = new PhysicsWorld();
  context.moduleContexts.physics_2d.state = {
    world,
  };
  world.setGravity(v);
}

/**
 * Makes the ground body of the world.
 *
 * @param height height of ground
 * @param friction friction of ground
 *
 * @category Main
 */
export function make_ground(height: number, friction: number) {
  if (!world) {
    throw NO_WORLD;
  }

  world.makeGround(height, friction);
}

/**
 * Makes a wall (static box object with no velocity).
 *
 * @param pos position of the wall
 * @param rot rotation of the wall
 * @param size size of the wall
 * @returns new box (wall) object
 *
 * @category Main
 */
export function add_wall(pos: Vector2, rot: number, size: Vector2) {
  if (!world) {
    throw NO_WORLD;
  }

  return world.addObject(
    new PhysicsObject(
      pos,
      rot,
      new b2PolygonShape()
        .SetAsBox(size.x / 2, size.y / 2),
      true,
      world,
    ),
  );
}

/**
 * Makes a box object with given initial position, rotation, velocity, size and add it to the world.
 *
 * @param pos initial position vector of center
 * @param rot initial rotation
 * @param velc initial velocity vector
 * @param size size
 * @returns new box object
 *
 * @category Body
 */
export function add_box_object(
  pos: Vector2,
  rot: number,
  velc: Vector2,
  size: Vector2,
  isStatic: boolean,
): PhysicsObject {
  if (!world) {
    throw NO_WORLD;
  }
  const newObj: PhysicsObject = new PhysicsObject(
    pos,
    rot,
    new b2PolygonShape()
      .SetAsBox(size.x / 2, size.y / 2),
    isStatic,
    world,
  );
  newObj.setVelocity(velc);
  return world.addObject(newObj);
}

/**
 * Makes a circle object with given initial position, rotation, velocity, radius and add it to the world.
 *
 * @param pos initial position vector of center
 * @param rot initial rotation
 * @param velc initial velocity vector
 * @param radius radius
 * @returns new circle object
 *
 * @category Body
 */
export function add_circle_object(
  pos: Vector2,
  rot: number,
  velc: Vector2,
  radius: number,
  isStatic: boolean,
): PhysicsObject {
  if (!world) {
    throw NO_WORLD;
  }
  const newObj: PhysicsObject = new PhysicsObject(
    pos,
    rot,
    new b2CircleShape()
      .Set(new Vector2(), radius),
    isStatic,
    world,
  );
  newObj.setVelocity(velc);
  return world.addObject(newObj);
}

/**
 * Makes a triangle object with given initial position, rotation, velocity, base, height and add it to the world.
 *
 * @param pos initial position vector of center
 * @param rot initial rotation
 * @param velc initial velocity vector
 * @param base base
 * @param height height
 * @returns new triangle object
 *
 * @category Body
 */
export function add_triangle_object(
  pos: Vector2,
  rot: number,
  velc: Vector2,
  base: number,
  height: number,
  isStatic: boolean,
): PhysicsObject {
  if (!world) {
    throw NO_WORLD;
  }
  const newObj: PhysicsObject = new PhysicsObject(
    pos,
    rot,
    new b2PolygonShape()
      .Set([
        new Vector2(-base / 2, -height / 2),
        new Vector2(base / 2, -height / 2),
        new Vector2(0, height / 2),
      ]),
    isStatic,
    world,
  );
  newObj.setVelocity(velc);
  return world.addObject(newObj);
}

/**
 * Updates the world once with the given time step.
 *
 * @param dt value of fixed time step
 *
 * @category Main
 */
export function update_world(dt: number) {
  if (!world) {
    throw NO_WORLD;
  }

  world.update(dt);
}

/**
 * Simulates the world for given duration.
 *
 * @param total_time total time to simulate
 *
 * @category Main
 */
export function simulate_world(total_time: number) {
  if (!world) {
    throw NO_WORLD;
  }

  world.simulate(total_time);
}

/**
 * Gets position of the object at current world time.
 *
 * @param obj existing object
 * @returns position of center
 *
 * @category Body
 */
export function get_position(obj: PhysicsObject): Vector2 {
  return new Vector2(obj.getPosition().x, obj.getPosition().y);
}

/**
 * Gets rotation of the object at current world time.
 *
 * @param obj existing object
 * @returns rotation of object
 *
 * @category Body
 */
export function get_rotation(obj: PhysicsObject): number {
  return obj.getRotation();
}

/**
 * Gets velocity of the object at current world time.
 *
 * @param obj exisiting object
 * @returns velocity vector
 *
 * @category Body
 */
export function get_velocity(obj: PhysicsObject): Vector2 {
  return new Vector2(obj.getVelocity().x, obj.getVelocity().y);
}

/**
 * Gets angular velocity of the object at current world time.
 *
 * @param obj exisiting object
 * @returns angular velocity vector
 *
 * @category Body
 */
export function get_angular_velocity(obj: PhysicsObject): Vector2 {
  return new Vector2(obj.getAngularVelocity());
}

/**
 * Sets the position of the object.
 *
 * @param obj existing object
 * @param pos new position
 *
 * @category Body
 */
export function set_position(obj: PhysicsObject, pos: Vector2): void {
  obj.setPosition(pos);
}

/**
 * Sets the rotation of the object.
 *
 * @param obj existing object
 * @param rot new rotation
 *
 * @category Body
 */
export function set_rotation(obj: PhysicsObject, rot: number): void {
  obj.setRotation(rot);
}

/**
 * Sets current velocity of the object.
 *
 * @param obj exisiting object
 * @param velc new velocity
 *
 * @category Body
 */
export function set_velocity(obj: PhysicsObject, velc: Vector2): void {
  obj.setVelocity(velc);
}

/**
 * Sets current angular velocity of the object.
 *
 * @param obj exisiting object
 * @param velc angular velocity number
 *
 * @category Body
 */
export function set_angular_velocity(obj: PhysicsObject, velc: number): void {
  return obj.setAngularVelocity(velc);
}

/**
 * Set density of the object.
 *
 * @param obj existing object
 * @param density density
 *
 * @category Body
 */
export function set_density(obj: PhysicsObject, density: number) {
  obj.setDensity(density);
}

/**
 * Resizes the object with given scale factor.
 *
 * @param obj existinig object
 * @param scale scaling size
 *
 * @category Body
 */
export function scale_size(obj: PhysicsObject, scale: number) {
  if (!world) {
    throw NO_WORLD;
  }
  obj.scale_size(scale);
}

/**
 * Sets the friction value of the object.
 *
 * @param obj
 * @param friction
 *
 * @category Body
 */
export function set_friction(obj: PhysicsObject, friction: number) {
  obj.setFriction(friction);
}

/**
 * Checks if two objects are touching at current world time.
 *
 * @param obj1
 * @param obj2
 * @returns touching state
 *
 * @category Dynamics
 */
export function is_touching(obj1: PhysicsObject, obj2: PhysicsObject) {
  return obj1.isTouching(obj2);
}

/**
 * Gets the impact start time of two currently touching objects.
 * Returns -1 if they are not touching.
 *
 * @param obj1
 * @param obj2
 * @returns impact start time
 *
 * @category Dynamics
 */
export function impact_start_time(obj1: PhysicsObject, obj2: PhysicsObject) {
  if (!world) {
    throw NO_WORLD;
  }

  return world.findImpact(obj1, obj2);
}

/**
 * Applies a force to given object at its center.
 *
 * @param force existing force
 * @param obj existing object the force applies on
 *
 * @category Dynamics
 */
export function apply_force_to_center(force: Force, obj: PhysicsObject) {
  obj.addForceCentered(force);
}

/**
 * Apllies force to given object at given world point.
 *
 * @param force existing force
 * @param pos world point the force is applied on
 * @param obj existing object the force applies on
 *
 * @category Dynamics
 */
export function apply_force(force: Force, pos: Vector2, obj: PhysicsObject) {
  obj.addForceAtAPoint(force, pos);
}

/**
 * Converts a 2d vector into an array.
 *
 * @param vec 2D vector to convert
 * @returns array with [x, y]
 *
 * @category Main
 */
export function vector_to_array(vec: Vector2) {
  return [vec.x, vec.y];
}

/**
 * Converts an array of 2 numbers into a 2d vector.
 *
 * @param arr array with [x, y]
 * @returns vector 2d
 *
 * @category Main
 */
export function array_to_vector([x, y]: [number, number]) {
  return new Vector2(x, y);
}

/**
 * Adds two vectors together and returns the resultant vector.
 *
 * @param arr array with [x, y]
 * @returns vector 2d
 *
 * @category Main
 */
export function add_vector(vec1: Vector2, vec2: Vector2) {
  return new Vector2(vec1.x + vec2.x, vec1.y + vec2.y);
}

/**
 * Subtract the second vector from the first and returns the resultant vector.
 *
 * @param arr array with [x, y]
 * @returns vector 2d
 *
 * @category Main
 */
export function subtract_vector(vec1: Vector2, vec2: Vector2) {
  return new Vector2(vec1.x - vec2.x, vec1.y - vec2.y);
}
