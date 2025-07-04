import context from 'js-slang/context';
// import {
//   head,
//   tail,
//   type List
// } from 'js-slang/dist/stdlib/list';

import { areaEquals, is_within_area, raycast, type Collision } from './helpers/areas';
import { run_tests } from './helpers/tests';
import type {
  Point, PointWithRotation, Robot,
  Action,
  AreaFlags, Area,
  AreaTest,
  RobotMinigame
} from './types';

// Default state before initialisation
const state: RobotMinigame = {
  isInit: false,
  hasCollided: false,
  width: 500,
  height: 500,
  border: {},
  robot: { x: 250, y: 250, rotation: 0, radius: 15 },
  areas: [],
  areaLog: [],
  actionLog: [],
  tests: [],
  message: ''
};

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
  if (state.isInit) throw new Error('May not use initialization functions after initialization is complete!');

  const robot: Robot = {
    x: posX,
    y: posY,
    rotation,
    radius: 15
  };

  // Update the map's dimensions
  state.width = width;
  state.height = height;

  // Update the robot
  state.robot = robot;

  // Update the action log with the robot's starting position
  state.actionLog = [{type: 'begin', position: Object.assign({}, robot)}];

  // Update the success message
  state.message = 'Please run this in the assessments tab!';
}

/**
 * Set the color of the map border
 *
 * @param {string} color of the border (in any CSS-accepted format)
 */
export function set_border_color(
  color: string
) {
  // Init functions should not run after initialization
  if (state.isInit) throw new Error('May not use initialization functions after initialization is complete!');

  state.border.color = color;
}

/**
 * Set the width of the map border
 *
 * @param {number} width of the border
 */
export function set_border_width(
  width: number
) {
  // Init functions should not run after initialization
  if (state.isInit) throw new Error('May not use initialization functions after initialization is complete!');

  state.border.width = width;
}

/**
 * Create a new area with the given vertices and flags
 *
 * @param vertices of the area (in x-y pairs)
 * @param isObstacle a boolean indicating if the area is an obstacle or not
 * @param flags any additional flags the area may have (in key-value pairs)
 */
export function create_area(
  vertices: [x: number, y: number][],
  isObstacle: boolean,
  flags: [key: string, value: any][]
) {
  // Init functions should not run after initialization
  if (state.isInit) throw new Error('May not use initialization functions after initialization is complete!');

  // Store vertices as Point array
  const parsedVertices: Point[] = vertices.map(v => ({ x: v[0], y: v[1] }));

  // Store flags as an object
  const parsedFlags = flags.reduce((acc, f) => ({ ...acc, [f[0]]: f[1] }), {});

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
 * @param flags any additional flags the area may have (in key-value pairs)
 */
export function create_rect_area(
  x: number,
  y: number,
  width: number,
  height: number,
  isObstacle: boolean,
  flags: [key: string, value: any][]
) {
  // Init functions should not run after initialization
  if (state.isInit) throw new Error('May not use initialization functions after initialization is complete!');

  create_area([
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height]
  ], isObstacle, flags);
}

/**
 * Create a new obstacle
 *
 * @param vertices of the obstacle
 */
export function create_obstacle(
  vertices: [x: number, y: number][]
) {
  // Init functions should not run after initialization
  if (state.isInit) throw new Error('May not use initialization functions after initialization is complete!');

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
  if (state.isInit) throw new Error('May not use initialization functions after initialization is complete!');

  create_rect_area(x, y, width, height, true, []);
}

/**
 * Check if the robot has entered different areas with the given colors in order
 *
 * @param colors in the order visited
 * @returns if the robot entered the given colors in order
 */
export function should_enter_colors(
  colors: string[]
) {
  state.tests.push({
    type: 'area',
    test: (areas: Area[]) => {
      const coloredAreas = areas
        .filter((area: Area) => colors.includes(area.flags.color)) // Filter relevant colors
        .filter(filterAdjacentDuplicateAreas); // Filter adjacent duplicates

      return coloredAreas.length === colors.length && coloredAreas.every(({ flags: { color } }, i) => color === colors[i]); // Check if each area has the expected color
    }
  } as AreaTest);
}

/**
 * Inform the simulator that the initialisation phase is complete
 */
export function complete_init() {
  if (state.actionLog.length === 0) throw new Error('May not complete initialization without first running init()');

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
  // Check for all obstacles in the robot's path (including bounds)
  const obstacleCollisions: Collision[] = robot_raycast((area: Area) => area.isObstacle);

  // If an obstacle is found, return its distance
  return obstacleCollisions.length > 0 ? obstacleCollisions[0].distance - getRobot().radius : Infinity;
}

// The maximum distance the robot can detect obstacles at
const SENSOR_RANGE: number = 15;

/**
 * Check if there is an obstacle within a predefined distance from the robot
 */
export function sense_obstacle() : boolean {
  return get_distance() < SENSOR_RANGE;
}

/**
 * Get the color of the area under the robot
 *
 * @returns the color of the area under the robot
 */
export function get_color() : string {
  return getRobotFlags().color;
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
  // Ignore if robot has collided with an obstacle
  if (state.hasCollided) return;

  // Get the robot
  const robot = getRobot();

  // Check for all areas in the robot's path
  const collisions: Collision[] = robot_raycast()
    .filter(col => col.distance < distance + robot.radius);

  for (const col of collisions) {
    // Log the area
    logArea(col.area);

    // Handle a collision with an obstacle
    if (col.area.isObstacle) {
      // Calculate find distance
      distance = col.distance - robot.radius + 1;

      // Update the final message
      state.message = `Collided with wall at (${robot.x + distance * Math.cos(robot.rotation)},${robot.y + distance * Math.sin(robot.rotation)})`;

      // Update state to reflect that the robot has collided with an obstacle
      state.hasCollided = true;
    }
  }

  // Move the robot to its end position
  robot.x = robot.x + distance * Math.cos(robot.rotation);
  robot.y = robot.y + distance * Math.sin(robot.rotation);

  // Store the action in the actionLog
  logAction('move', getPositionWithRotation());
}

// The distance from a wall a move_forward_to_wall() command will stop
const SAFE_DISTANCE_FROM_WALL : number = 10;

/**
 * Move the robot forward to within a predefined distance of the wall
 */
export function move_forward_to_wall() {
  // Ignore if robot has collided with an obstacle
  if (state.hasCollided) return;

  // Move forward the furthest possible safe distance + a lil extra offset
  move_forward(Math.max(get_distance() - SAFE_DISTANCE_FROM_WALL, 0));
}

/**
 * Rotate the robot clockwise by the given angle
 *
 * @param angle (in radians) to rotate clockwise
 */
export function rotate(
  angle: number
) {
  // Ignore if robot has collided with an obstacle
  if (state.hasCollided) return;

  // Get the robot
  const robot = getRobot();

  // Update robot rotation
  robot.rotation -= angle;

  // Normalise robot rotation within -pi and pi
  robot.rotation = robot.rotation + (robot.rotation > Math.PI ? -2 * Math.PI : robot.rotation < -Math.PI ? 2 * Math.PI : 0);

  logAction('rotate', getPositionWithRotation());
}

/**
 * Turn the robot 90 degrees to the left
 */
export function turn_left() {
  rotate(Math.PI / 2);
}

/**
 * Turn the robot 90 degrees to the right
 */
export function turn_right() {
  rotate(-Math.PI / 2);
}

// ======= //
// TESTING //
// ======= //

/**
 * Run the stored tests in state
 *
 * @returns if all tests pass
 */
export function run_all_tests() : boolean {
  return !state.hasCollided && run_tests(state);
}

// ==================
// ==================
// PRIVATE FUNCTIONS:
// ==================
// ==================

// =========== //
// MAP HELPERS //
// =========== //

/**
 * Get the active robot
 *
 * @returns the active robot
 */
function getRobot() : Robot {
  return state.robot;
}

/**
 * Get the bound of the active map
 *
 * @returns the bounds of the active map
 */
function getBounds() : Point[] {
  // Get active map
  const { width, height } = state;

  return [
    {x: 0, y: 0},
    {x: width, y: 0},
    {x: width, y: height},
    {x: 0, y: height}
  ];
}

/**
 * Gets the position of the robot (with rotation)
 *
 * @returns the position of the robot (with rotation)
 */
function getPositionWithRotation(): PointWithRotation {
  // Get the robot
  const {x, y, rotation} = getRobot();

  // Parse the robot
  return {x, y, rotation};
}

// ======================== //
// RAYCAST AND AREA HELPERS //
// ======================== //

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
      robot_raycast_area({vertices: getBounds(), isObstacle: true, flags: {}}) // Raycast map bounds as well
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
  // Get the robot
  const robot = getRobot();

  const dx = Math.cos(robot.rotation), dy = Math.sin(robot.rotation);

  // raycast from 3 sources: left, middle, right
  const raycast_sources: Point[] = [-1, 0, 1]
    .map(mult => ({
      x: robot.x + mult * robot.radius * dy,
      y: robot.y + mult * robot.radius * dx
    }));

  // Raycast 3 times, one for each source
  const collisions: Collision[] = raycast_sources
    .map(source => raycast(
      {origin: source, target: {x: dx + source.x, y: dy + source.y}}, area))
    .filter(col => col !== null);

  // Return null if no intersection
  return collisions.length > 0
    ? collisions.reduce((acc, col) => acc.distance > col.distance ? col : acc)
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
  state.actionLog.push({type, position} as Action);
}

/**
 * Add an area to the area log
 *
 * @param area to log
 */
function logArea(
  area: Area
) {
  // Get the area log
  const areaLog = state.areaLog;

  if (
    areaLog.length > 0 // Check for empty area log
    && areaEquals(area, areaLog[areaLog.length - 1]) // Check if same area repeated
  ) return;

  areaLog.push(area);
}

// ============ //
// AREA HELPERS //
// ============ //

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
function getFlags(
  x: number,
  y: number
) : AreaFlags {
  // Find the area containing the point
  const area: Area | null = area_of_point({x, y});

  return area === null ? {} : area.flags;
}

/**
 * Gets the flags of the area containing the robot
 *
 * @returns the flags of the robot's area
 */
function getRobotFlags() : AreaFlags {
  // Get the robot
  const robot = getRobot();

  return getFlags(robot.x, robot.y);
}
