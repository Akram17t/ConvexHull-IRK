import type { Point } from "../types";
import { compareByCoordinate, crossProduct, EPSILON } from "./geometry";

export function uniquePoints(points: Point[]): Point[] {
  const unique = new Map<string, Point>();

  for (const point of points) {
    unique.set(`${point.x}:${point.y}`, point);
  }

  return [...unique.values()];
}

export function isAllCollinear(points: Point[]): boolean {
  if (points.length < 3) {
    return true;
  }

  const [first, second, ...rest] = points;

  return rest.every((point) => Math.abs(crossProduct(first, second, point)) <= EPSILON);
}

export function getTrivialHull(points: Point[]): Point[] | null {
  if (points.length <= 1) {
    return [...points];
  }

  if (points.length === 2) {
    return [...points].sort(compareByCoordinate);
  }

  if (isAllCollinear(points)) {
    const sorted = [...points].sort(compareByCoordinate);

    return [sorted[0], sorted[sorted.length - 1]];
  }

  return null;
}
