/*
* Currently uses a grid based system, will upgrade to more fancy stuff later
* The movement is simulated, then a series of movement points is passed to the module context, which the frontend then uses to render
*/

import context from 'js-slang/context';
import {
  accumulate,
  head,
  tail,
  type List
} from 'js-slang/dist/stdlib/list';

type Point = {x: number, y: number};
type Intersection = {x: number, y: number, dist: number}

type Polygon = Point[];

type StateData = {
  isInit: boolean,
  width: number,
  height: number,
  walls: Polygon[],
  movePoints: Point[],
  message: string,
  success: boolean,
  messages: string[],
  rotations: Point[]
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
  messages: [],
  rotations: []
};

const robot: Robot = {
  x: 25, // default start pos, puts it at the top left corner of canvas without colliding with the walls
  y: 25,
  dx: 1,
  dy: 0,
  radius: 20 // give the robot a circular hitbox
};

let bounds: Point[] = [];

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

export function init(width: number, height: number, posX: number, posY: number) {
  set_width(width);
  set_height(height);
  set_pos(posX, posY);
  stateData.movePoints.push({x: posX, y: posY});
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

  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  logCoordinates();
}

export function turn_right() {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle -= Math.PI / 2;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

  logCoordinates();
}

export function rotate_right(angle: number) {
  let currentAngle = Math.atan2(-robot.dy, robot.dx);

  currentAngle -= angle;

  robot.dx = Math.cos(currentAngle);
  robot.dy = -Math.sin(currentAngle);

  if (robot.dx < 0.00001 && robot.dx > -0.00001) robot.dx = 0;
  if (robot.dy < 0.00001 && robot.dy > -0.00001) robot.dy = 0;

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

export function set_rect_wall(x: number, y: number, width: number, height: number) {
  const polygon: Polygon = [
    {x: x, y: y},
    {x: x + width, y: y},
    {x: x+width, y: y+height},
    {x: x, y:y+height}
  ];

  stateData.walls.push(polygon);
}

export function set_polygon_wall(vertices: List) {
  const polygon: Polygon = []
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

export function move_forward(): void {
  if (alrCollided()) return;

  let distance = findCollision();
  distance = Math.max(distance - robot.radius - 5, 0)
  
  const nextPoint: Point = {
    x: robot.x + distance * robot.dx,
    y: robot.y + distance * robot.dy
  }
  

  robot.x = nextPoint.x;
  robot.y = nextPoint.y;
  stateData.movePoints.push(nextPoint);
  stateData.messages.push(`Distance is ${distance} Collision point at x: ${nextPoint.x}, y: ${nextPoint.y}`);
}

function findCollision(): number {
  let nearest: Point | null = null;
  let minDist: number = Infinity;

  for (const wall of stateData.walls) {
    const intersection: Intersection | null = raycast(wall);
    if (intersection !== null && intersection.dist < minDist) {
      minDist = intersection.dist;
      nearest = {x: intersection.x, y: intersection.y};
    } 
  }

  // check outer bounds as well
  const intersection: Intersection | null = raycast(bounds);
  if (intersection !== null && intersection.dist < minDist) {
    minDist = intersection.dist;
    nearest = {x: intersection.x, y: intersection.y};
  } 
  
  return minDist === Infinity ? 0 : minDist; // Closest intersection point
}

function raycast(polygon: Polygon): Intersection | null {
  let minDist = Infinity;
  let nearest: Intersection | null = null;

  for (let i = 0; i < polygon.length; i++) {
    const x1 = polygon[i].x, y1 = polygon[i].y;
    const x2 = polygon[(i + 1) % polygon.length].x, y2 = polygon[(i + 1) % polygon.length].y;

    const topX = robot.x - robot.radius * robot.dy;
    const topY = robot.y - robot.radius * robot.dx;

    const bottomX = robot.x + robot.radius * robot.dy;
    const bottomY = robot.y + robot.radius * robot.dx;

    const raycast_sources: Point[] = [
      {x: robot.x, y: robot.y},
      {x: topX, y: topY},
      {x: bottomX, y: bottomY}
    ]

    for (const source of raycast_sources) {
      const intersection = getIntersection(source.x, source.y, robot.dx + source.x, robot.dy + source.y, x1, y1, x2, y2);
      if (intersection !== null && intersection.dist < minDist) {
        minDist = intersection.dist;
        nearest = intersection;
      }
    }
  }
      
  return nearest;
}

// Determine if a ray and a line segment intersect, and if so, determine the collision point
function getIntersection(x1, y1, x2, y2, x3, y3, x4, y4): Intersection | null {
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

  if (!b) return null
  
  return {x: x, y: y, dist: r}
}

function alrCollided() {
  return !stateData.success;
}

// debug
function logCoordinates() {
  stateData.messages.push(`x: ${robot.x}, y: ${robot.y}, dx: ${robot.dx}, dy: ${robot.dy}`)
}
