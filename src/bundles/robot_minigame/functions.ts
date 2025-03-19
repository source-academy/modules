import context from 'js-slang/context';
import {
  head,
  tail,
  type List
} from 'js-slang/dist/stdlib/list';

type Point = {x: number, y: number};
type PointWithRotation = {x: number, y: number, angle: number};

type CommandData = {
  type: string,
  location: PointWithRotation
};

type Polygon = Point[];

type StateData = {
  isInit: boolean,
  width: number,
  height: number,
  walls: Polygon[],
  movePoints: Point[],
  message: string,
  success: boolean,
  messages: string[]
};

type Robot = {
  x: number; // the top left corner
  y: number;
  dx: number;
  dy: number;
  radius: number
};

const stateData: StateData = {
  isInit: false,
  width: 500,
  height: 500,
  walls: [],
  movePoints: [],
  message: 'moved successfully',
  success: true,
  messages: []
};

const robot: Robot = {
  x: 25, // default start pos, puts it at the top left corner of canvas without colliding with the walls
  y: 25,
  dx: 1,
  dy: 0,
  radius: 20 // give the robot a circular hitbox
};

let bounds: Point[] = [];

// sets the context to the statedata obj, mostly for convenience so i dont have to type context.... everytime
context.moduleContexts.robot_minigame.state = stateData;

export function set_pos(x: number, y: number): void {
  robot.x = x;
  robot.y = y;
}

export function set_width(width: number) {
  stateData.width = width;
}

export function set_height(height: number) {
  stateData.height = height;
}

// condenses setting the width and height of map, and the initial position of robot in one call
export function init(width: number, height: number, posX: number, posY: number) {
  if (stateData.isInit) return; // dont allow init more than once

  set_width(width);
  set_height(height);
  set_pos(posX, posY);

  stateData.movePoints.push({x: posX, y: posY}); // push starting point to movepoints data
  stateData.isInit = true;

  bounds = [
    {x: 0, y: 0},
    {x: width, y: 0},
    {x: width, y: height},
    {x: 0, y: height}
  ];
}

export function turn_left() {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle += Math.PI / 2;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  // prevent floating point issues
  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  // debug log
  logCoordinates();
}

export function turn_right() {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle -= Math.PI / 2;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  // debug log
  logCoordinates();
}

export function rotate_right(angle: number) {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle -= angle;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  // debug log
  logCoordinates();
}

export function rotate_left(angle: number) {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle += angle;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  logCoordinates();
}

// easily set up a rectangular wall using the x and y of the top left corner, and width/height
export function set_rect_wall(x: number, y: number, width: number, height: number) {
  const polygon: Polygon = [
    {x: x, y: y},
    {x: x + width, y: y},
    {x: x+width, y: y+height},
    {x: x, y:y+height}
  ];

  stateData.walls.push(polygon);
}

// creates irregularly shaped wall
// takes in a list of vertices as its argument
export function set_polygon_wall(vertices: List) {
  const polygon: Polygon = [];

  while (vertices != null) {
    const p = head(vertices);
    polygon.push({x: head(p), y: tail(p)});
    vertices = tail(vertices);
  }

  stateData.walls.push(polygon);
}

export function getX():number {
  return robot.x;
}

export function getY():number {
  return robot.y;
}

// moves robot to the nearest wall
export function move_forward_to_wall(): void {
  if (alrCollided()) return;

  let distance = findMoveDistance(); // do the raycast, figure out how far the robot is from the nearest wall

  // a lil extra offset from wall
  distance = Math.max(distance - robot.radius - 5, 0);

  const nextPoint: Point = {
    x: robot.x + distance * robot.dx,
    y: robot.y + distance * robot.dy
  };

  robot.x = nextPoint.x;
  robot.y = nextPoint.y;
  stateData.movePoints.push(nextPoint);

  // for debug
  stateData.messages.push(`Distance is ${distance} Collision point at x: ${nextPoint.x}, y: ${nextPoint.y}`);
}

// Moves forward by a small amount
export function move_forward(moveDist: number): void {
  const nextPoint: Point = {
    x: robot.x + moveDist * robot.dx,
    y: robot.y + moveDist + robot.dy
  };

  // need to check for collision with wall

  robot.x = nextPoint.x;
  robot.y = nextPoint.y;
  stateData.movePoints.push(nextPoint);

  logCoordinates();
}

export function sensor(): boolean {
  return false;
}

// returns the distance from the nearest wall
function findMoveDistance(): number {
  let minDist: number = Infinity;

  // loop through all the walls
  for (const wall of stateData.walls) {
    const intersectionDist = raycast(wall); // do the raycast

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

// does the raycast logic for one particular wall
// three rays are cast: one from the center, one from the top and one from the bottom. the minimum dist is returned
// return null if no collision
function raycast(polygon: Polygon): number | null {
  let minDist = Infinity;

  for (let i = 0; i < polygon.length; i++) {
    // wall line segment
    const x1 = polygon[i].x, y1 = polygon[i].y;
    const x2 = polygon[(i + 1) % polygon.length].x, y2 = polygon[(i + 1) % polygon.length].y;

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

// debug
function logCoordinates() {
  stateData.messages.push(`x: ${robot.x}, y: ${robot.y}, dx: ${robot.dx}, dy: ${robot.dy}`);
}
