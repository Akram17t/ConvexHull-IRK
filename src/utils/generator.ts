import type { Point } from "../types";

export type RandomPointOptions = {
  count?: number;
  min?: number;
  max?: number;
};

export type GeneratedPoint = Omit<Point, "id">;

export function generateRandomPoints(options: RandomPointOptions = {}): GeneratedPoint[] {
  const count = options.count ?? 24;
  const min = options.min ?? 8;
  const max = options.max ?? 92;

  return Array.from({ length: count }, () => ({
    x: min + Math.random() * (max - min),
    y: min + Math.random() * (max - min),
  }));
}
