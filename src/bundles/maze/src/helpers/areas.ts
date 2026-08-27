import type { Area, Point } from '../types';

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

// A collision between a ray and an area
export interface Collision {
  distance: number
  area: Area
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

/**
 * Get the shortest distance between a ray and an area
 *
 * @param ray being cast
 * @param area to check
 * @returns the collision with the minimum distance, or null (if no collision)
 */
export function raycast(
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
 * Check if the point is within the area
 *
 * @param point potentially within the area
 * @param area to check
 * @returns if the point is within the area
 */
export function is_within_area(
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
 * Compare two areas for equality
 *
 * @param a the first area to compare
 * @param b the second area to compare
 * @returns if a == b
 */
export function areaEquals(a: Area, b: Area) {
  if (
    a.vertices.length !== b.vertices.length // a and b must have an equal number of vertices
    || a.vertices.some((v, i) => v.x !== b.vertices[i].x || v.y !== b.vertices[i].y) // a and b's vertices must be the same
    || a.isObstacle !== b.isObstacle // Either both a and b or neither a nor b are obstacles
    || Object.keys(a.flags).length !== Object.keys(b.flags).length // Check flags length equality
    || Object.keys(a.flags).some(key => a.flags[key] !== b.flags[key]) // Check flag value equality
  ) return false;

  return true;
}
