import { useMemo, useRef } from "react";
import type { HullStep, Point } from "../types";

type CanvasProps = {
  points: Point[];
  hull: Point[];
  currentStep: HullStep | null;
  onAddPoint: (point: { x: number; y: number }) => void;
};

const VIEWBOX_SIZE = 100;

function toSvgPoints(points: Point[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

export function Canvas({ points, hull, currentStep, onAddPoint }: CanvasProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activePointIds = useMemo(() => new Set(currentStep?.activePointIds ?? []), [currentStep]);
  const stepHull = currentStep?.hull ?? [];

  function handleCanvasClick(event: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;

    if (!svg) {
      return;
    }

    const bounds = svg.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * VIEWBOX_SIZE;
    const y = ((event.clientY - bounds.top) / bounds.height) * VIEWBOX_SIZE;

    onAddPoint({
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
    });
  }

  return (
    <section className="workspace-panel canvas-panel" aria-label="Convex hull canvas">
      <svg
        ref={svgRef}
        className="hull-canvas"
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        role="img"
        aria-label="2D point field"
        onClick={handleCanvasClick}
      >
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" className="grid-line" />
          </pattern>
        </defs>

        <rect width={VIEWBOX_SIZE} height={VIEWBOX_SIZE} className="canvas-background" />
        <rect width={VIEWBOX_SIZE} height={VIEWBOX_SIZE} fill="url(#grid)" />

        {hull.length >= 3 && <polygon points={toSvgPoints(hull)} className="final-hull-fill" />}
        {hull.length >= 2 && <polyline points={`${toSvgPoints(hull)} ${hull[0].x},${hull[0].y}`} className="final-hull-line" />}

        {stepHull.length >= 2 && <polyline points={toSvgPoints(stepHull)} className="step-hull-line" />}

        {points.map((point) => {
          const isHullPoint = hull.some((hullPoint) => hullPoint.id === point.id);
          const isActive = activePointIds.has(point.id);

          return (
            <circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r={isActive ? 1.9 : 1.35}
              className={["point", isHullPoint ? "point-hull" : "point-regular", isActive ? "point-active" : ""]
                .filter(Boolean)
                .join(" ")}
            />
          );
        })}
      </svg>

      {points.length === 0 && <p className="canvas-empty">Click the canvas to add points.</p>}
    </section>
  );
}
