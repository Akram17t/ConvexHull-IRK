import type { HullStep, Point } from "../types";

export function createStep(
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
