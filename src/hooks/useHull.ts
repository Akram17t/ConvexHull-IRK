import { useMemo, useState } from "react";
import { runGrahamScan } from "../algorithms/graham";
import { runJarvisMarch } from "../algorithms/jarvis";
import { runQuickHull } from "../algorithms/quickHull";
import type { AlgorithmName, HullResult, Point } from "../types";

type HullRunner = (points: Point[]) => HullResult;

const HULL_RUNNERS: Record<AlgorithmName, HullRunner> = {
  graham: runGrahamScan,
  jarvis: runJarvisMarch,
  quickHull: runQuickHull,
};

export function runHullAlgorithm(algorithm: AlgorithmName, points: Point[]): HullResult {
  return HULL_RUNNERS[algorithm](points);
}

export function useHull(points: Point[], initialAlgorithm: AlgorithmName = "graham") {
  const [algorithm, setAlgorithm] = useState<AlgorithmName>(initialAlgorithm);

  const result = useMemo(() => runHullAlgorithm(algorithm, points), [algorithm, points]);

  return {
    algorithm,
    setAlgorithm,
    result,
    hull: result.hull,
    steps: result.steps,
    elapsedMs: result.elapsedMs,
  };
}
