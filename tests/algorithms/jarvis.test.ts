import { describe, expect, it } from "vitest";
import { jarvisMarch, runJarvisMarch } from "../../src/algorithms/jarvis";
import type { Point } from "../../src/types";

function point(id: string, x: number, y: number): Point {
  return { id, x, y };
}

function ids(points: Point[]): string[] {
  return points.map((item) => item.id);
}

describe("jarvisMarch", () => {
  it("returns the outer hull for a square with an inner point", () => {
    const points = [
      point("a", 0, 0),
      point("b", 1, 0),
      point("c", 1, 1),
      point("d", 0, 1),
      point("e", 0.5, 0.5),
    ];

    expect(ids(jarvisMarch(points))).toEqual(["a", "b", "c", "d"]);
  });

  it("removes duplicate coordinates", () => {
    const points = [
      point("a", 0, 0),
      point("duplicate-a", 0, 0),
      point("b", 1, 0),
      point("c", 0, 1),
    ];

    expect(ids(jarvisMarch(points))).toEqual(["duplicate-a", "b", "c"]);
  });

  it("keeps only endpoints when every point is collinear", () => {
    const points = [
      point("a", 0, 0),
      point("b", 1, 1),
      point("c", 2, 2),
      point("d", 3, 3),
    ];

    expect(ids(jarvisMarch(points))).toEqual(["a", "d"]);
  });

  it("handles fewer than three unique points", () => {
    expect(ids(jarvisMarch([point("a", 2, 1)]))).toEqual(["a"]);
    expect(ids(jarvisMarch([point("b", 2, 1), point("a", 0, 1)]))).toEqual(["a", "b"]);
  });

  it("returns steps for visualization playback", () => {
    const result = runJarvisMarch([
      point("a", 0, 0),
      point("b", 1, 0),
      point("c", 0, 1),
    ]);

    expect(result.algorithm).toBe("jarvis");
    expect(result.steps[0].type).toBe("init");
    expect(result.steps.at(-1)?.type).toBe("complete");
  });
});
