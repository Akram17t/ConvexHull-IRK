import { useCallback, useState } from "react";
import type { Point } from "../types";

type PointInput = Omit<Point, "id"> & Partial<Pick<Point, "id">>;

function createPointId(): string {
  return `point-${crypto.randomUUID()}`;
}

function normalizePoint(point: PointInput): Point {
  return {
    id: point.id ?? createPointId(),
    x: point.x,
    y: point.y,
  };
}

export function usePoints(initialPoints: Point[] = []) {
  const [points, setPointsState] = useState<Point[]>(initialPoints);

  const addPoint = useCallback((point: PointInput) => {
    const nextPoint = normalizePoint(point);

    setPointsState((currentPoints) => [...currentPoints, nextPoint]);

    return nextPoint;
  }, []);

  const removePoint = useCallback((pointId: string) => {
    setPointsState((currentPoints) => currentPoints.filter((point) => point.id !== pointId));
  }, []);

  const updatePoint = useCallback((pointId: string, nextValue: Partial<Omit<Point, "id">>) => {
    setPointsState((currentPoints) =>
      currentPoints.map((point) => (point.id === pointId ? { ...point, ...nextValue } : point)),
    );
  }, []);

  const setPoints = useCallback((nextPoints: PointInput[]) => {
    setPointsState(nextPoints.map(normalizePoint));
  }, []);

  const clearPoints = useCallback(() => {
    setPointsState([]);
  }, []);

  return {
    points,
    pointCount: points.length,
    addPoint,
    removePoint,
    updatePoint,
    setPoints,
    clearPoints,
  };
}
