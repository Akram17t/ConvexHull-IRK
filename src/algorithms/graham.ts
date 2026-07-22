import type { HullResult, HullStep, Point } from "../types";
import { compareByCoordinate, crossProduct, EPSILON, squaredDistance } from "./geometry";

function createStep(
  type: HullStep["type"],
  points: Point[],
  hull: Point[],
  activePointIds: string[],
  message: string,
): HullStep {
  return {
    type,
    points: [...points],
    hull: [...hull],
    activePointIds,
    message,
  };
}

function uniquePoints(points: Point[]): Point[] {
  const unique = new Map<string, Point>();

  for (const point of points) {
    unique.set(`${point.x}:${point.y}`, point);
  }

  return [...unique.values()];
}

function findPivot(points: Point[]): Point {
  return [...points].sort((a, b) => {
    if (Math.abs(a.y - b.y) > EPSILON) {
      return a.y - b.y;
    }

    return a.x - b.x;
  })[0];
}

function sortByPolarAngle(points: Point[], pivot: Point): Point[] {
  return [...points]
    .filter((point) => point !== pivot)
    .sort((a, b) => {
      const cross = crossProduct(pivot, a, b);

      if (Math.abs(cross) <= EPSILON) {
        return squaredDistance(pivot, a) - squaredDistance(pivot, b);
      }

      return cross > 0 ? -1 : 1;
    });
}

export function runGrahamScan(points: Point[]): HullResult {
  const startedAt = performance.now();
  const steps: HullStep[] = [];
  const unique = uniquePoints(points);

  steps.push(createStep("init", unique, [], [], "Initialize Graham Scan."));

  if (unique.length <= 1) {
    steps.push(createStep("complete", unique, unique, unique.map((point) => point.id), "Hull completed."));

    return {
      algorithm: "graham",
      hull: unique,
      steps,
      elapsedMs: performance.now() - startedAt,
    };
  }

  if (unique.length === 2) {
    const hull = [...unique].sort(compareByCoordinate);

    steps.push(createStep("complete", unique, hull, hull.map((point) => point.id), "Hull completed."));

    return {
      algorithm: "graham",
      hull,
      steps,
      elapsedMs: performance.now() - startedAt,
    };
  }

  const pivot = findPivot(unique);
  const sorted = [pivot, ...sortByPolarAngle(unique, pivot)];
  const stack: Point[] = [sorted[0], sorted[1]];

  steps.push(createStep("select", sorted, [pivot], [pivot.id], "Select the lowest point as pivot."));
  steps.push(createStep("sort", sorted, [], sorted.map((point) => point.id), "Sort points by polar angle."));
  steps.push(createStep("push", sorted, [...stack], stack.map((point) => point.id), "Push first two points."));

  for (let index = 2; index < sorted.length; index += 1) {
    const current = sorted[index];

    steps.push(
      createStep("compare", sorted, [...stack], [stack[stack.length - 1].id, current.id], "Check turn direction."),
    );

    while (
      stack.length >= 2 &&
      crossProduct(stack[stack.length - 2], stack[stack.length - 1], current) <= EPSILON
    ) {
      const removed = stack.pop();

      steps.push(
        createStep(
          "pop",
          sorted,
          [...stack],
          removed ? [removed.id, current.id] : [current.id],
          "Pop point that creates a clockwise or collinear turn.",
        ),
      );
    }

    stack.push(current);
    steps.push(createStep("push", sorted, [...stack], [current.id], "Push current point to hull."));
  }

  steps.push(createStep("complete", sorted, [...stack], stack.map((point) => point.id), "Hull completed."));

  return {
    algorithm: "graham",
    hull: stack,
    steps,
    elapsedMs: performance.now() - startedAt,
  };
}

export function grahamScan(points: Point[]): Point[] {
  return runGrahamScan(points).hull;
}
