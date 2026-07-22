import type { Point } from "../types";

export type Orientation = "clockwise" | "counterclockwise" | "collinear";

export const EPSILON = 1e-9;

export function crossProduct(origin: Point, a: Point, b: Point): number {
  return (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);
}

export function orientation(origin: Point, a: Point, b: Point): Orientation {
  const cross = crossProduct(origin, a, b);

  if (Math.abs(cross) <= EPSILON) {
    return "collinear";
  }

  return cross > 0 ? "counterclockwise" : "clockwise";
}

export function squaredDistance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return dx * dx + dy * dy;
}

export function samePoint(a: Point, b: Point): boolean {
  return Math.abs(a.x - b.x) <= EPSILON && Math.abs(a.y - b.y) <= EPSILON;
}

export function compareByCoordinate(a: Point, b: Point): number {
  if (Math.abs(a.x - b.x) > EPSILON) {
    return a.x - b.x;
  }

  return a.y - b.y;
}
