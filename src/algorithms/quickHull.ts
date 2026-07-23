import type { HullResult, HullStep, Point } from "../types";
import { getTrivialHull, uniquePoints } from "./edgeCases";
import { compareByCoordinate, crossProduct, EPSILON } from "./geometry";
import { createStep } from "./steps";

function findExtremePoints(points: Point[]): [Point, Point] {
  const sorted = [...points].sort(compareByCoordinate);

  return [sorted[0], sorted[sorted.length - 1]];
}

function pointsOnSide(start: Point, end: Point, points: Point[], side: 1 | -1): Point[] {
  return points.filter((point) => side * crossProduct(start, end, point) > EPSILON);
}

function findFarthestPoint(start: Point, end: Point, points: Point[]): Point {
  return [...points].sort((a, b) => {
    const distanceA = Math.abs(crossProduct(start, end, a));
    const distanceB = Math.abs(crossProduct(start, end, b));

    if (Math.abs(distanceA - distanceB) > EPSILON) {
      return distanceB - distanceA;
    }

    return compareByCoordinate(a, b);
  })[0];
}

function buildSideHull(
  start: Point,
  end: Point,
  candidates: Point[],
  side: 1 | -1,
  allPoints: Point[],
  steps: HullStep[],
): Point[] {
  if (candidates.length === 0) {
    return [];
  }

  steps.push(
    createStep(
      "compare",
      allPoints,
      [start, end],
      [start.id, end.id, ...candidates.map((point) => point.id)],
      "Find farthest point from current segment.",
    ),
  );

  const farthest = findFarthestPoint(start, end, candidates);

  steps.push(createStep("select", allPoints, [start, farthest, end], [farthest.id], "Select farthest point."));

  const leftOfStartToFarthest = pointsOnSide(start, farthest, candidates, side);
  const leftOfFarthestToEnd = pointsOnSide(farthest, end, candidates, side);

  return [
    ...buildSideHull(start, farthest, leftOfStartToFarthest, side, allPoints, steps),
    farthest,
    ...buildSideHull(farthest, end, leftOfFarthestToEnd, side, allPoints, steps),
  ];
}

export function runQuickHull(points: Point[]): HullResult {
  const startedAt = performance.now();
  const steps: HullStep[] = [];
  const unique = uniquePoints(points);
  const trivialHull = getTrivialHull(unique);

  steps.push(createStep("init", unique, [], [], "Initialize QuickHull."));

  if (trivialHull) {
    steps.push(createStep("complete", unique, trivialHull, trivialHull.map((point) => point.id), "Hull completed."));

    return {
      algorithm: "quickHull",
      hull: trivialHull,
      steps,
      elapsedMs: performance.now() - startedAt,
    };
  }

  const [leftmost, rightmost] = findExtremePoints(unique);

  steps.push(
    createStep(
      "select",
      unique,
      [leftmost, rightmost],
      [leftmost.id, rightmost.id],
      "Select extreme points.",
    ),
  );

  const lowerCandidates = pointsOnSide(leftmost, rightmost, unique, -1);
  const upperCandidates = pointsOnSide(leftmost, rightmost, unique, 1);

  const lowerHull = buildSideHull(leftmost, rightmost, lowerCandidates, -1, unique, steps);
  const upperHull = buildSideHull(leftmost, rightmost, upperCandidates, 1, unique, steps);
  const hull = [leftmost, ...lowerHull, rightmost, ...upperHull.reverse()];

  steps.push(createStep("complete", unique, hull, hull.map((point) => point.id), "Hull completed."));

  return {
    algorithm: "quickHull",
    hull,
    steps,
    elapsedMs: performance.now() - startedAt,
  };
}

export function quickHull(points: Point[]): Point[] {
  return runQuickHull(points).hull;
}
