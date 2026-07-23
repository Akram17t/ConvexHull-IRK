import type { AlgorithmName } from "../types";

type ControlsProps = {
  algorithm: AlgorithmName;
  setAlgorithm: (algorithm: AlgorithmName) => void;
  pointCount: number;
  onGenerateRandom: () => void;
  onClearPoints: () => void;
};

const ALGORITHM_LABELS: Record<AlgorithmName, string> = {
  graham: "Graham Scan",
  jarvis: "Jarvis March",
  quickHull: "QuickHull",
};

export function Controls({ algorithm, setAlgorithm, pointCount, onGenerateRandom, onClearPoints }: ControlsProps) {
  return (
    <section className="workspace-panel controls-panel" aria-label="Dataset and algorithm controls">
      <div>
        <label className="field-label" htmlFor="algorithm-select">
          Algorithm
        </label>
        <select
          id="algorithm-select"
          className="select-control"
          value={algorithm}
          onChange={(event) => setAlgorithm(event.target.value as AlgorithmName)}
        >
          {Object.entries(ALGORITHM_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="button-row">
        <button className="button button-primary" type="button" onClick={onGenerateRandom}>
          Random Points
        </button>
        <button className="button" type="button" onClick={onClearPoints} disabled={pointCount === 0}>
          Clear
        </button>
      </div>

      <div className="metric-strip">
        <span>Points</span>
        <strong>{pointCount}</strong>
      </div>
    </section>
  );
}
