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

function findLeftmostPoint(points: Point[]): Point {
  return [...points].sort(compareByCoordinate)[0];
}

function chooseNextPoint(current: Point, candidate: Point, challenger: Point): Point {
  const turn = crossProduct(current, candidate, challenger);

  if (turn < -EPSILON) {
    return challenger;
  }

  if (Math.abs(turn) <= EPSILON && squaredDistance(current, challenger) > squaredDistance(current, candidate)) {
    return challenger;
  }

  return candidate;
}

export function runJarvisMarch(points: Point[]): HullResult {
  const startedAt = performance.now();
  const steps: HullStep[] = [];
  const unique = uniquePoints(points);

  steps.push(createStep("init", unique, [], [], "Initialize Jarvis March."));

  if (unique.length <= 1) {
    steps.push(createStep("complete", unique, unique, unique.map((point) => point.id), "Hull completed."));

    return {
      algorithm: "jarvis",
      hull: unique,
      steps,
      elapsedMs: performance.now() - startedAt,
    };
  }

  if (unique.length === 2) {
    const hull = [...unique].sort(compareByCoordinate);

    steps.push(createStep("complete", unique, hull, hull.map((point) => point.id), "Hull completed."));

    return {
      algorithm: "jarvis",
      hull,
      steps,
      elapsedMs: performance.now() - startedAt,
    };
  }

  const start = findLeftmostPoint(unique);
  const hull: Point[] = [];
  let current = start;

  steps.push(createStep("select", unique, [start], [start.id], "Select the leftmost point as start."));

  do {
    hull.push(current);

    let candidate = unique.find((point) => point !== current);

    if (!candidate) {
      break;
    }

    steps.push(createStep("select", unique, [...hull], [current.id, candidate.id], "Select initial candidate."));

    for (const challenger of unique) {
      if (challenger === current || challenger === candidate) {
        continue;
      }

      steps.push(
        createStep("compare", unique, [...hull, candidate], [current.id, candidate.id, challenger.id], "Compare candidate with another point."),
      );

      const nextCandidate = chooseNextPoint(current, candidate, challenger);

      if (nextCandidate !== candidate) {
        candidate = nextCandidate;
        steps.push(createStep("select", unique, [...hull, candidate], [candidate.id], "Update next hull point."));
      }
    }

    current = candidate;

    if (current !== start) {
      steps.push(createStep("push", unique, [...hull, current], [current.id], "Add selected point to hull."));
    }
  } while (current !== start);

  steps.push(createStep("complete", unique, [...hull], hull.map((point) => point.id), "Hull completed."));

  return {
    algorithm: "jarvis",
    hull,
    steps,
    elapsedMs: performance.now() - startedAt,
  };
}

export function jarvisMarch(points: Point[]): Point[] {
  return runJarvisMarch(points).hull;
}
