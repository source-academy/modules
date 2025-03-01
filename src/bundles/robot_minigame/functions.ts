/*
* Currently uses a grid based system, will upgrade to more fancy stuff later
* The movement is simulated, then a series of movement points is passed to the module context, which the frontend then uses to render
*/

import context from 'js-slang/context';

type Point = {x: number, y: number};

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

// default grid width and height is 25
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
  if (alrCollided()) return;

  let currentAngle = Math.tan(robot.dy / robot.dx);
  currentAngle -= Math.PI / 2;

  robot.dx = Math.cos(currentAngle);
  robot.dy = Math.sin(currentAngle);
}

export function turn_right() {
  if (alrCollided()) return;

  let currentAngle = Math.tan(robot.dy / robot.dx);
  currentAngle += Math.PI / 2;

  robot.dx = Math.cos(currentAngle);
  robot.dy = Math.sin(currentAngle);
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

export function move_forward(): void {
  if (alrCollided()) return;

  const collisionPoint: Point | null = raycast(stateData.walls);
  if (collisionPoint !== null) {
    const nextPoint: Point = {
      x: collisionPoint.x - robot.dx * (robot.radius + 5),
      y: collisionPoint.y - robot.dy * (robot.radius + 5)
    };

    robot.x = nextPoint.x;
    robot.y = nextPoint.y;
    stateData.movePoints.push(nextPoint);
  }
}

export function getX():number {
  return robot.x;
}

export function getY():number {
  return robot.y;
}

function raycast(polygons: Polygon[]): Point | null {
  let nearest: Point | null = null;
  let minDist = Infinity;

  for (const polygon of polygons) {
    stateData.messages.push('checking polygon');
    const numVertices = polygon.length;

    for (let i = 0; i < numVertices; i++) {
      const x1 = polygon[i].x, y1 = polygon[i].y;
      const x2 = polygon[(i + 1) % numVertices].x, y2 = polygon[(i + 1) % numVertices].y;

      const intersection = getIntersection(robot.x, robot.y, robot.dx + robot.x, robot.dy + robot.y, x1, y1, x2, y2);

      if (intersection.collided && intersection.dist < minDist) {
        minDist = intersection.dist;
        nearest = {x: intersection.x, y: intersection.y};
      }
    }
  }

  // if no collisions with obstacles, check the outer bounds of map
  if (nearest === null) {
    for (let i = 0; i < bounds.length; i++) {
      const x1 = bounds[i].x, y1 = bounds[i].y;
      const x2 = bounds[(i + 1) % bounds.length].x, y2 = bounds[(i + 1) % bounds.length].y;

      const intersection = getIntersection(robot.x, robot.y, robot.dx + robot.x, robot.dy + robot.y, x1, y1, x2, y2);

      if (intersection.collided && intersection.dist < minDist) {
        minDist = intersection.dist;
        nearest = {x: intersection.x, y: intersection.y};
      }
    }
  }

  return nearest; // Closest intersection point
}

// Determine if a ray and a line segment intersect, and if so, determine the collision point
function getIntersection(x1, y1, x2, y2, x3, y3, x4, y4){
  const denom = ((x2 - x1)*(y4 - y3)-(y2 - y1)*(x4 - x3));
  let r;
  let s;
  let x;
  let y;
  let b = false;

  // If lines not collinear or parallel
  if(denom != 0){
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
  }
  const p = {collided: b, x: x, y: y, dist: r};
  return p;
}

function alrCollided() {
  return !stateData.success;
}
