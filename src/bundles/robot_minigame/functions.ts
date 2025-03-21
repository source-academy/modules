import context from 'js-slang/context';
import {
  head,
  tail,
  type List
} from 'js-slang/dist/stdlib/list';

// A point (x, y)
interface Point {
  x: number
  y: number
}

// A point (x, y) with rotation
export interface PointWithRotation extends Point {
  rotation: number
}

// A prior movement
export interface Action {
  type: string
  position: PointWithRotation
}

interface AreaFlags {
  [name: string]: boolean
}

export interface Area {
  vertices: Point[]
  isCollidable: boolean
  flags: AreaFlags
}

export interface StateData {
  isInit: boolean
  width: number
  height: number
  areas: Area[]
  areaLog: number[]
  actionLog: Action[]
  message: string
  success: boolean
  messages: string[]
  robotSize: number
}

interface Robot {
  x: number // the top left corner
  y: number
  dx: number
  dy: number
  radius: number
}

const stateData: StateData = {
  isInit: false,
  width: 500,
  height: 500,
  areas: [],
  areaLog: [],
  actionLog: [],
  message: 'moved successfully',
  success: true,
  messages: [],
  robotSize: 15
};

const robot: Robot = {
  x: 25, // default start pos, puts it at the top left corner of canvas without colliding with the walls
  y: 25,
  dx: 1,
  dy: 0,
  radius: 15 // give the robot a circular hitbox
};

let bounds: Point[] = [];

// sets the context to the statedata obj, mostly for convenience so i dont have to type context.... everytime
context.moduleContexts.robot_minigame.state = stateData;

function set_pos(x: number, y: number): void {
  robot.x = x;
  robot.y = y;
}

function set_rotation(rotation: number) {
  robot.dx = Math.cos(rotation);
  robot.dy = -Math.sin(rotation);
}

function set_width(width: number) {
  stateData.width = width;
}

function set_height(height: number) {
  stateData.height = height;
}

// ===== //
// SETUP //
// ===== //

/**
 * Initializes a new simulation with a map of size width * height
 * Also sets the initial position an rotation of the robot
 *
 * @param width of the map
 * @param height of the map
 * @param posX initial X coordinate of the robot
 * @param posY initial Y coordinate of the robot
 * @param rotation initial rotation of the robot
 */
export function init(
  width: number,
  height: number,
  posX: number,
  posY: number,
  rotation: number
) {
  if (stateData.isInit) return; // dont allow init more than once

  set_width(width);
  set_height(height);
  set_pos(posX, posY);
  set_rotation(rotation);

  stateData.actionLog.push({type: 'begin', position: getPositionWithRotation()}); // push starting point to movepoints data
  stateData.isInit = true;

  bounds = [
    {x: 0, y: 0},
    {x: width, y: 0},
    {x: width, y: height},
    {x: 0, y: height}
  ];
}

/**
 * Creates a new area with the given vertices and flags
 *
 * @param vertices of the area
 * @param isCollidable a boolean indicating if the area is a collidable obstacle or not
 * @param flags any additional flags the area may have
 */
export function create_area(
  vertices: Point[],
  isCollidable: boolean,
  flags: AreaFlags = {}
) {
  // // Parse vertices list into a points array
  // const points : Point[] = [];

  // while (vertices != null) {
  //   const p = head(vertices);
  //   points.push({x: head(p), y: tail(p)});
  //   vertices = tail(vertices);
  // }

  // Store the new area
  stateData.areas.push({
    vertices,
    isCollidable,
    flags
  });
}

/**
 * Creates a new obstacle
 *
 * @param vertices of the obstacle
 */
export function create_obstacle(
  vertices: Point[]
) {
  create_area(vertices, true);
}

/**
 * Creates a new rectangular, axis-aligned obstacle
 *
 * @param x top left corner of the rectangle
 * @param y top right corner of the rectangle
 * @param width of the rectangle
 * @param height of the rectangle
 */
export function create_rect_obstacle(
  x: number,
  y: number,
  width: number,
  height: number
) {
  create_obstacle([
    {x, y},
    {x: x + width, y},
    {x: x + width, y: y + height},
    {x, y:y + height}
  ]);
}

// ======= //
// SENSORS //
// ======= //

/**
 * Get the distance to the closest collidable area
 *
 * @returns the distance to the closest obstacle
 */
export function get_distance() : number {
  // TO BE IMPLEMENTED
  return 0;
}

/**
 * Gets the flags of the area containing the point (x, y)
 *
 * @param x coordinate
 * @param y coordinate
 * @returns the flags of the area containing (x, y)
 */
export function get_flags(
  x: number,
  y: number
) : AreaFlags {
  // TO BE IMPLEMENTED
  return {};
}

/**
 * Gets the color of the area under the robot
 *
 * @returns the color of the area under the robot
 */
export function get_color() : string {
  // TO BE IMPLEMENTED
  return '';
}

// ======= //
// ACTIONS //
// ======= //

/**
 * Move the robot forward by the specified distance
 *
 * @param distance to move forward
 */
export function move_forward(distance: number) {
  // need to check for collision with wall
  const dist = findDistanceToWall();
  stateData.messages.push(`${dist}`);

  if (dist < distance + robot.radius) {
    stateData.message = 'collided';
    stateData.success = false;
    distance = dist - robot.radius + 1; // move only until the wall
  }

  const nextPoint: Point = {
    x: robot.x + distance * robot.dx,
    y: robot.y + distance * robot.dy
  };

  robot.x = nextPoint.x;
  robot.y = nextPoint.y;
  stateData.actionLog.push({type: 'move', position: getPositionWithRotation()});

  logCoordinates();
}

// The distance from a wall a move_forward_to_wall() command will stop
const SAFE_DISTANCE_FROM_WALL : number = 5;

/**
 * Move the robot forward to within a predefined distance of the wall
 */
export function move_forward_to_wall() {
  if (alrCollided()) return;

  let distance = findDistanceToWall(); // do the raycast, figure out how far the robot is from the nearest wall

  // a lil extra offset from wall
  distance = Math.max(distance - robot.radius - SAFE_DISTANCE_FROM_WALL, 0);

  const nextPoint: Point = {
    x: robot.x + distance * robot.dx,
    y: robot.y + distance * robot.dy
  };

  robot.x = nextPoint.x;
  robot.y = nextPoint.y;
  stateData.actionLog.push({type: 'move', position: getPositionWithRotation()});

  // for debug
  stateData.messages.push(`Distance is ${distance} Collision point at x: ${nextPoint.x}, y: ${nextPoint.y}`);
}

/**
 *
 * @param angle the angle (in radians) to rotate right
 */
export function rotate(angle: number) {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle -= angle;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  stateData.actionLog.push({type: 'rotate', position: getPositionWithRotation()});

  // debug log
  logCoordinates();
}

/**
 * Turns the robot 90 degrees to the left
 */
export function turn_left() {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle += Math.PI / 2;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  // prevent floating point issues
  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  stateData.actionLog.push({type: 'rotateLeft', position: getPositionWithRotation()});

  // debug log
  logCoordinates();
}

/**
 * Turns the robot 90 degrees to the right
 */
export function turn_right() {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle -= Math.PI / 2;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  stateData.actionLog.push({type: 'rotateRight', position: getPositionWithRotation()});

  // debug log
  logCoordinates();
}

// ======= //
// TESTING //
// ======= //

/**
 *
 */
export function enteredAreas(
  check : (area : Area[]) => void
) : boolean {
  // TO BE IMPLEMENTED
  return false;
}

// ==================== //
// Unassigned / Helpers //
// ==================== //

export function rotate_left(angle: number) {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle += angle;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  stateData.actionLog.push({type: 'rotateLeft', position: getPositionWithRotation()});

  logCoordinates();
}

export function getX():number {
  return robot.x;
}

export function getY():number {
  return robot.y;
}

// detects if there are walls 10 units ahead of the robot
// add as a command later
export function sensor(): boolean {
  const dist = findDistanceToWall();
  stateData.actionLog.push({type: 'sensor', position: getPositionWithRotation()});
  if (dist <= 10 + robot.radius) {
    return true;
  }
  return false;
}

// returns the distance from the nearest wall
function findDistanceToWall(): number {
  let minDist: number = Infinity;

  // loop through all the walls
  for (const wall of stateData.areas) {
    const intersectionDist = raycast(wall.vertices); // do the raycast

    // if intersection is closer, update minDist
    if (intersectionDist !== null && intersectionDist < minDist) {
      minDist = intersectionDist;
    }
  }

  // check outer bounds as well
  const intersectionDist = raycast(bounds);
  if (intersectionDist !== null && intersectionDist < minDist) {
    minDist = intersectionDist;
  }

  // Closest intersection point
  // By all rights, there should always be an intersection point since the robot is always within the bounds
  // and the bounds should be a collision
  // but something goes wrong, will just return 0
  return minDist === Infinity ? 0 : minDist;
}

// does the raycast logic for one particular area
// three rays are cast: one from the center, one from the top and one from the bottom. the minimum dist is returned
// return null if no collision
function raycast(
  vertices: Point[]
): number | null {
  let minDist = Infinity;

  for (let i = 0; i < vertices.length; i++) {
    // wall line segment
    const x1 = vertices[i].x, y1 = vertices[i].y;
    const x2 = vertices[(i + 1) % vertices.length].x, y2 = vertices[(i + 1) % vertices.length].y;

    // calculate the top and bottom coordinates of the robot
    const topX = robot.x - robot.radius * robot.dy;
    const topY = robot.y - robot.radius * robot.dx;

    const bottomX = robot.x + robot.radius * robot.dy;
    const bottomY = robot.y + robot.radius * robot.dx;

    // raycast from 3 sources: top, middle, bottom
    const raycast_sources: Point[] = [
      {x: robot.x, y: robot.y},
      {x: topX, y: topY},
      {x: bottomX, y: bottomY}
    ];

    for (const source of raycast_sources) {
      const intersectionDist = getIntersection(source.x, source.y, robot.dx + source.x, robot.dy + source.y, x1, y1, x2, y2);
      if (intersectionDist !== null && intersectionDist < minDist) {
        minDist = intersectionDist;
      }
    }
  }

  return minDist === Infinity ? null : minDist;
}

// Determine if a ray and a line segment intersect, and if so, determine the collision point
// returns null if there's no collision, or the distance to the line segment if collides
function getIntersection(x1, y1, x2, y2, x3, y3, x4, y4): number | null {
  const denom = ((x2 - x1)*(y4 - y3)-(y2 - y1)*(x4 - x3));
  let r;
  let s;
  let x;
  let y;
  let b = false;

  // If lines are collinear or parallel
  if (denom === 0) return null;

  // Intersection in ray "local" coordinates
  r = (((y1 - y3) * (x4 - x3)) - (x1 - x3) * (y4 - y3)) / denom;

  // Intersection in segment "local" coordinates
  s = (((y1 - y3) * (x2 - x1)) - (x1 - x3) * (y2 - y1)) / denom;

  // The algorithm gives the intersection of two infinite lines, determine if it lies on the side that the ray is defined on
  if (r >= 0) {
    // If point along the line segment
    if (s >= 0 && s <= 1) {
      b = true;
      // Get point coordinates (offset by r local units from start of ray)
      x = x1 + r * (x2 - x1);
      y = y1 + r * (y2 - y1);
    }
  }

  if (!b) return null;

  return r;
}

function alrCollided() {
  return !stateData.success;
}

function getPositionWithRotation(): PointWithRotation {
  const angle = Math.atan2(-robot.dy, robot.dx);
  return {x: robot.x, y: robot.y, rotation: angle};
}

// debug
function logCoordinates() {
  stateData.messages.push(`x: ${robot.x}, y: ${robot.y}, dx: ${robot.dx}, dy: ${robot.dy}`);
}
