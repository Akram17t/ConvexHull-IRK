export type AlgorithmName = "graham" | "jarvis" | "quickHull";

export type Point = {
  id: string;
  x: number;
  y: number;
};

export type HullResult = {
  algorithm: AlgorithmName;
  hull: Point[];
  steps: HullStep[];
  elapsedMs: number;
};

export type HullStepType =
  | "init"
  | "sort"
  | "select"
  | "compare"
  | "push"
  | "pop"
  | "complete";

export type HullStep = {
  type: HullStepType;
  points: Point[];
  hull: Point[];
  activePointIds: string[];
  message: string;
};

export type BenchmarkResult = {
  algorithm: AlgorithmName;
  pointCount: number;
  elapsedMs: number;
};
