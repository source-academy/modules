import context from 'js-slang/context';
// import {
//   head,
//   tail,
//   type List
// } from 'js-slang/dist/stdlib/list';

// A point (x, y)
interface Point {
  x: number
  y: number
}

// A point (x, y) with rotation
export interface PointWithRotation extends Point {
  rotation: number
}

// A line segment between p1 and p2
interface LineSegment {
  p1: Point
  p2: Point
}

// A ray from origin towards target
interface Ray {
  origin: Point
  target: Point
}

// A stored action
export interface Action {
  type: 'begin' | 'move' | 'rotate' | 'sensor'
  position: PointWithRotation
}

interface AreaFlags {
  [name: string]: any
}

export interface Area {
  vertices: Point[]
  isObstacle: boolean
  flags: AreaFlags
}

export interface RobotMap {
  isInit: boolean
  isComplete: boolean
  width: number
  height: number
  robotSize: number
  areas: Area[]
  areaLog: Area[]
  actionLog: Action[]
  message: string
}

const state: RobotMap = {
  isInit: false,
  isComplete: false,
  width: 500,
  height: 500,
  robotSize: 15,
  areas: [],
  areaLog: [],
  actionLog: [],
  message: 'moved successfully'
};

interface Robot extends Point {
  dx: number
  dy: number
  radius: number
}

const robot: Robot = {
  x: 25, // default start pos, puts it at the top left corner of canvas without colliding with the walls
  y: 25,
  dx: 1,
  dy: 0,
  radius: 15 // give the robot a circular hitbox
};

let bounds: Point[];

// sets the context to the state obj, mostly for convenience so i dont have to type context.... everytime
context.moduleContexts.robot_minigame.state = state;

// ===== //
// SETUP //
// ===== //

/**
 * Shorthand function that initializes a new simulation with a map of size width * height
 * Also sets the initial position and rotation of the robot
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
  // Init functions should not run after initialization
  if (state.isInit) return;

  set_dimensions(width, height);
  set_pos(posX, posY);
  set_rotation(rotation);

  // Store the starting position in the actionLog
  logAction('begin', getPositionWithRotation());

  bounds = [
    {x: 0, y: 0},
    {x: width, y: 0},
    {x: width, y: height},
    {x: 0, y: height}
  ];
}

/**
 * Create a new area with the given vertices and flags
 *
 * @param vertices of the area in alternating x-y pairs
 * @param isObstacle a boolean indicating if the area is an obstacle or not
 * @param flags any additional flags the area may have
 */
export function create_area(
  vertices: number[],
  isObstacle: boolean,
  flags: any[]
) {
  // Init functions should not run after initialization
  if (state.isInit) return;

  if (vertices.length % 2 !== 0) throw new Error('Odd number of vertice x-y coordinates given (expected even)');

  if (flags.length % 2 !== 0) throw new Error('Odd number of flag arguments given (expected even)');

  // Store vertices as Point array
  const parsedVertices: Point[] = [];

  // Parse x-y pairs into Points
  for (let i = 0; i < vertices.length / 2; i++) {
    parsedVertices[i] = {
      x: vertices[i * 2],
      y: vertices[i * 2 + 1]
    };
  }

  // Store flags as an object
  const parsedFlags = {};

  // Parse flag-value pairs into flags
  for (let i = 0; i < flags.length / 2; i++) {
    // Retrieve flag
    const flag = flags[i * 2];

    // Check flag is string
    if (typeof flag !== 'string') throw new Error(`Flag arguments must be strings (${flag} is a ${typeof flag})`);

    // Add flag to object
    parsedFlags[flag] = flags[i * 2 + 1];
  }

  // Store the new area
  state.areas.push({
    vertices: parsedVertices,
    isObstacle,
    flags: parsedFlags
  });
}

/**
 * Create a new rectangular, axis-aligned area
 *
 * @param x coordinate of the top left corner of the rectangle
 * @param y coordinate of the top left corner of the rectangle
 * @param width of the rectangle
 * @param height of the rectangle
 * @param isObstacle a boolean indicating if the area is an obstacle or not
 * @param flags any additional flags the area may have
 */
export function create_rect_area(
  x: number,
  y: number,
  width: number,
  height: number,
  isObstacle: boolean,
  flags: any[]
) {
  // Init functions should not run after initialization
  if (state.isInit) return;

  create_area([
    x, y,
    x + width, y,
    x + width, y + height,
    x, y + height
  ], isObstacle, flags);
}

/**
 * Create a new obstacle
 *
 * @param vertices of the obstacle
 */
export function create_obstacle(
  vertices: number[]
) {
  // Init functions should not run after initialization
  if (state.isInit) return;

  create_area(vertices, true, []);
}

/**
 * Create a new rectangular, axis-aligned obstacle
 *
 * @param x coordinate of the top left corner of the rectangle
 * @param y coordinate of the top left corner of the rectangle
 * @param width of the rectangle
 * @param height of the rectangle
 */
export function create_rect_obstacle(
  x: number,
  y: number,
  width: number,
  height: number
) {
  // Init functions should not run after initialization
  if (state.isInit) return;

  create_rect_area(x, y, width, height, true, []);
}

/**
 * Inform the simulator that the initialisation phase is complete
 */
export function complete_init() {
  state.isInit = true;
}

// ======= //
// SENSORS //
// ======= //

/**
 * Get the distance to the closest obstacle
 *
 * @returns the distance to the closest obstacle, or infinity (if robot is out of bounds)
 */
export function get_distance() : number {
  // Check for all obstacles in the robot's path
  const obstacleCollisions: Collision[] = robot_raycast((area: Area) => area.isObstacle);

  // If an obstacle is found, return its distance
  if (obstacleCollisions.length > 0) return obstacleCollisions[0].distance;

  // Find the distance to the bounds
  const boundsCollision: Collision | null = robot_raycast_area({
    vertices: bounds,
    isObstacle: true,
    flags: {}
  });

  return boundsCollision === null ? Infinity : boundsCollision.distance;
}

/**
 * Get the color of the area under the robot
 *
 * @returns the color of the area under the robot
 */
export function get_color() : string {
  return get_flags(robot.x, robot.y).color;
}

// ======= //
// ACTIONS //
// ======= //

/**
 * Move the robot forward by the specified distance
 *
 * @param distance to move forward
 */
export function move_forward(
  distance: number
) {
  // Check for all areas in the robot's path
  const collisions: Collision[] = robot_raycast()
    .filter(col => col.distance < distance + robot.radius);

  for (const col of collisions) {
    // Log the area
    logArea(col.area);

    // Handle a collision with an obstacle
    if (col.area.isObstacle) {
      // Calculate find distance
      const finalDistance = (col.distance - robot.radius + 1);

      // Move the robot to its final position
      robot.x = robot.x + finalDistance * robot.dx;
      robot.y = robot.y + finalDistance * robot.dy;

      // Update the final message
      state.message = `Collided with wall at (${robot.x + col.distance * robot.dx},${robot.y + col.distance * robot.dy})`;

      // Throw an error to interrupt the simulation
      throw new Error('Collided with wall');
    }
  }

  // Move the robot to its end position
  robot.x = robot.x + distance * robot.dx;
  robot.y = robot.y + distance * robot.dy;

  // Store the action in the actionLog
  logAction('move', getPositionWithRotation());
}

// The distance from a wall a move_forward_to_wall() command will stop
const SAFE_DISTANCE_FROM_WALL : number = 10;

/**
 * Move the robot forward to within a predefined distance of the wall
 */
export function move_forward_to_wall() {
  // Move forward the furthest possible safe distance + a lil extra offset
  move_forward(Math.max(get_distance() - robot.radius - SAFE_DISTANCE_FROM_WALL, 0));
}

/**
 * Rotate the robot clockwise by the given angle
 *
 * @param angle (in radians) to rotate clockwise
 */
export function rotate(
  angle: number
) {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle -= angle;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  logAction('rotate', getPositionWithRotation());
}

/**
 * Turn the robot 90 degrees to the left
 */
export function turn_left() {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle += Math.PI / 2;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  // prevent floating point issues
  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  logAction('rotate', getPositionWithRotation());
}

/**
 * Turn the robot 90 degrees to the right
 */
export function turn_right() {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle -= Math.PI / 2;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  logAction('rotate', getPositionWithRotation());
}

// ======= //
// TESTING //
// ======= //

/**
 * Inform the simulator that the testing phase is starting
 */
export function start_testing() {
  if (state.isComplete) throw new Error('May not start testing twice!');

  state.isComplete = true;
}

/**
 * Checks if the robot's entered areas satisfy the callback
 *
 * @returns if the entered areas satisfy the callback
 */
export function entered_areas(
  callback : (areas : Area[]) => boolean
) : boolean {
  // Testing functions should only run after the simulation is complete
  if (!state.isComplete) return false;

  return callback(state.areaLog);
}

/**
 * Check if the robot has entered different areas with the given colors in order
 *
 * @param colors in the order visited
 * @returns if the robot entered the given colors in order
 */
export function entered_colors(
  colors: string[]
) : boolean {
  // Testing functions should only run after the simulation is complete
  if (!state.isComplete) return false;

  const coloredAreas = state.areaLog
    .filter(area => colors.includes(area.flags.color)) // Filter relevant colors
    .filter(filterAdjacentDuplicateAreas); // Filter adjacent duplicates

  return coloredAreas.length === colors.length && coloredAreas.every(({ flags: { color } }, i) => color === colors[i]); // Check if each area has the expected color
}

// ==================
// ==================
// PRIVATE FUNCTIONS:
// ==================
// ==================

// ================== //
// DATA WRITE HELPERS //
// ================== //

/**
 * Teleport the robot
 *
 * @param x coordinate of the robot
 * @param y coordinate of the robot
 */
function set_pos(
  x: number,
  y: number
) {
  robot.x = x;
  robot.y = y;
}

/**
 * Set the rotation of the robot
 *
 * @param rotation in radians
 */
function set_rotation(
  rotation: number
) {
  robot.dx = Math.cos(rotation);
  robot.dy = -Math.sin(rotation);
}

/**
 * Set the width and height of the map
 *
 * @param width of the map
 * @param height of the map
 */
function set_dimensions(
  width: number,
  height: number
) {
  state.width = width;
  state.height = height;
}

// ================= //
// DATA READ HELPERS //
// ================= //

/**
 * Gets the position of the robot
 *
 * @returns the position of the robot
 */
function getPosition(): Point {
  return {
    x: robot.x,
    y: robot.y
  };
}

/**
 * Gets the position of the robot (with rotation)
 *
 * @returns the position of the robot (with rotation)
 */
function getPositionWithRotation(): PointWithRotation {
  const angle = Math.atan2(-robot.dy, robot.dx);
  return {x: robot.x, y: robot.y, rotation: angle};
}

// ======================== //
// RAYCAST AND AREA HELPERS //
// ======================== //

// A collision between a ray and an area
interface Collision {
  distance: number
  area: Area
}

/**
 * Get the distance between the robot and area, if the robot is facing the area
 * Casts 3 rays from the robot's left, middle and right
 *
 * @param filter the given areas (optional)
 * @returns the minimum distance, or null (if no collision)
 */
function robot_raycast(
  filter: (area: Area) => boolean = () => true
) : Collision[] {
  return state.areas
    .filter(filter) // Apply filter
    .map(area => robot_raycast_area(area)) // Raycast each area on the map
    .concat([
      robot_raycast_area({vertices: bounds, isObstacle: true, flags: {}}) // Raycast map bounds as well
    ])
    .filter(col => col !== null) // Remove null collisions
    .sort((a, b) => a.distance - b.distance); // Sort by distance
}

/**
 * Get the distance between the robot and area, if the robot is facing the area
 * Casts 3 rays from the robot's left, middle and right
 *
 * @param area to check
 * @returns the minimum distance, or null (if no collision)
 */
function robot_raycast_area(
  area: Area
) : Collision | null {
  // raycast from 3 sources: left, middle, right
  const raycast_sources: Point[] = [-1, 0, 1]
    .map(mult => ({
      x: robot.x + mult * robot.radius * robot.dy,
      y: robot.y + mult * robot.radius * robot.dx
    }));

  // Raycast 3 times, one for each source
  const collisions: Collision[] = raycast_sources
    .map(source => raycast(
      {origin: source, target: {x: robot.dx + source.x, y: robot.dy + source.y}}, area))
    .filter(col => col !== null);

  // Return null if no intersection
  return collisions.length > 0
    ? collisions.reduce((acc, col) => acc.distance > col.distance ? col : acc)
    : null;
}

/**
 * Check which areas fall along a ray
 *
 * @param ray to cast
 * @param areas to check
 * @returns collisions between the ray and areas
 */
function raycast_multi(
  ray: Ray,
  areas: Area[]
) : Collision[] {
  return areas
    .map(area => raycast(ray, area)) // Raycast each area
    .filter(col => col !== null) // Remove null collisions
    .sort((a, b) => a.distance - b.distance); // Sort by distance
}

/**
 * Get the shortest distance between a ray and an area
 *
 * @param ray being cast
 * @param area to check
 * @returns the collision with the minimum distance, or null (if no collision)
 */
function raycast(
  ray: Ray,
  area: Area
) : Collision | null {
  const { vertices } = area;

  // Store the minimum distance
  let distance = Infinity;

  for (let i = 0; i < vertices.length; i++) {
    // Border line segment
    const border: LineSegment = {
      p1: {x: vertices[i].x, y: vertices[i].y},
      p2: {x: vertices[(i + 1) % vertices.length].x, y: vertices[(i + 1) % vertices.length].y}
    };

    // Compute the minimum distance
    const distanceToIntersection: number = getIntersection(ray, border);

    // Save the new minimum, if necessary
    if (distanceToIntersection < distance) distance = distanceToIntersection;
  }

  // Return null if no collision
  return distance < Infinity
    ? {distance, area}
    : null;
}

/**
 * Find the area the robot is in
 *
 * @returns if the robot is within the area
 */
function area_of_point(
  point: Point
) : Area | null {
  // Return the first area the point is within
  for (const area of state.areas) {
    if (is_within_area(point, area)) return area;
  }

  // Otherwise return null
  return null;
}

/**
 * Check if the point is within the area
 *
 * @param point potentially within the area
 * @param area to check
 * @returns if the point is within the area
 */
function is_within_area(
  point: Point,
  area: Area
) : boolean {
  const { vertices } = area;

  // Cast a ray to the right of the point
  const ray = {
    origin: point,
    target: {x: point.x + 1, y: point.y + 0}
  };

  // Count the intersections
  let intersections = 0;

  for (let i = 0; i < vertices.length; i++) {
    // Border line segment
    const border: LineSegment = {
      p1: {x: vertices[i].x, y: vertices[i].y},
      p2: {x: vertices[(i + 1) % vertices.length].x, y: vertices[(i + 1) % vertices.length].y}
    };

    // Increment intersections if the ray intersects the border
    if (getIntersection(ray, border) < Infinity) intersections++;
  }

  // Even => Outside; Odd => Inside
  return intersections % 2 === 1;
}

/**
 * Determine if a ray and a line segment intersect
 * If they intersect, determine the distance from the ray's origin to the collision point
 *
 * @param ray being checked
 * @param line to check intersection
 * @returns the distance to the line segment, or infinity (if no collision)
 */
function getIntersection(
  { origin, target }: Ray,
  { p1, p2 }: LineSegment
) : number {
  const denom: number = ((target.x - origin.x)*(p2.y - p1.y)-(target.y - origin.y)*(p2.x - p1.x));

  // If lines are collinear or parallel
  if (denom === 0) return Infinity;

  // Intersection in ray "local" coordinates
  const r: number = (((origin.y - p1.y) * (p2.x - p1.x)) - (origin.x - p1.x) * (p2.y - p1.y)) / denom;

  // Intersection in segment "local" coordinates
  const s: number = (((origin.y - p1.y) * (target.x - origin.x)) - (origin.x - p1.x) * (target.y - origin.y)) / denom;

  // Check if line segment is behind ray, or not on the line segment
  if (r < 0 || s < 0 || s > 1) return Infinity;

  return r;
}

// =============== //
// LOGGING HELPERS //
// =============== //

/**
 * Add a movement to the action log
 *
 * @param type of action
 * @param position to move to
 */
function logAction(
  type: 'begin' | 'move' | 'rotate' | 'sensor',
  position: PointWithRotation
) {
  state.actionLog.push({type, position});
}

/**
 * Add an area to the area log
 *
 * @param area to log
 */
function logArea(
  area: Area
) {
  if (
    state.areaLog.length > 0 // Check for empty area log
    && areaEquals(area, state.areaLog[state.areaLog.length - 1]) // Check if same area repeated
  ) return;

  state.areaLog.push(area);
}

// ============ //
// AREA HELPERS //
// ============ //

/**
 * Compare two areas for equality
 *
 * @param a the first area to compare
 * @param b the second area to compare
 * @returns if a == b
 */
function areaEquals(a: Area, b: Area) {
  if (
    a.vertices.length !== b.vertices.length // a and b must have an equal number of vertices
    || a.vertices.some((v, i) => v.x !== b.vertices[i].x || v.y !== b.vertices[i].y) // a and b's vertices must be the same
    || a.isObstacle !== b.isObstacle // Either both a and b or neither a nor b are obstacles
    || Object.keys(a.flags).length === Object.length
  ) return false;

  return true;
}

/**
 * Filter callback to remove adjacent duplicate areas
 *
 * @param area currently being checked
 * @param i index of area
 * @param areas the full array being filtered
 * @returns if the current area is not a duplicate of the previous area
 */
const filterAdjacentDuplicateAreas = (area : Area, i : number, areas: Area[]) : boolean =>
  i === 0 // First one is always correct
  || !areaEquals(area, areas[i - 1]); // Otherwise check for equality against previous area

/**
 * Gets the flags of the area containing the point (x, y)
 *
 * @param x coordinate
 * @param y coordinate
 * @returns the flags of the area containing (x, y)
 */
function get_flags(
  x: number,
  y: number
) : AreaFlags {
  // Find the area containing the point
  const area: Area | null = area_of_point({x, y});

  return area === null ? {} : area.flags;
}
