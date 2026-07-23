import { describe, expect, it } from "vitest";
import { getTrivialHull, isAllCollinear, uniquePoints } from "../../src/algorithms/edgeCases";
import type { Point } from "../../src/types";

function point(id: string, x: number, y: number): Point {
  return { id, x, y };
}

function ids(points: Point[]): string[] {
  return points.map((item) => item.id);
}

describe("edgeCases", () => {
  it("keeps one point for each coordinate pair", () => {
    const points = [
      point("a", 0, 0),
      point("latest-a", 0, 0),
      point("b", 1, 0),
    ];

    expect(ids(uniquePoints(points))).toEqual(["latest-a", "b"]);
  });

  it("detects collinear points", () => {
    expect(isAllCollinear([point("a", 0, 0), point("b", 1, 1), point("c", 2, 2)])).toBe(true);
    expect(isAllCollinear([point("a", 0, 0), point("b", 1, 1), point("c", 2, 0)])).toBe(false);
  });

  it("returns null when the input needs a full hull algorithm", () => {
    const points = [point("a", 0, 0), point("b", 1, 0), point("c", 0, 1)];

    expect(getTrivialHull(points)).toBeNull();
  });

  it("returns endpoints for collinear hulls", () => {
    const points = [point("a", 0, 0), point("b", 1, 1), point("c", 2, 2)];

    expect(ids(getTrivialHull(points) ?? [])).toEqual(["a", "c"]);
  });
});
