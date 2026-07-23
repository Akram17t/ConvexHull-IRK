import type { HullStep } from "../types";

type InfoPanelProps = {
  currentStep: HullStep | null;
  currentStepIndex: number;
  stepCount: number;
  hullPointCount: number;
  elapsedMs: number;
};

export function InfoPanel({ currentStep, currentStepIndex, stepCount, hullPointCount, elapsedMs }: InfoPanelProps) {
  return (
    <section className="workspace-panel info-panel" aria-label="Algorithm information">
      <div className="info-grid">
        <div>
          <span>Current Step</span>
          <strong>
            {stepCount > 0 ? currentStepIndex + 1 : 0}/{stepCount}
          </strong>
        </div>
        <div>
          <span>Hull Points</span>
          <strong>{hullPointCount}</strong>
        </div>
        <div>
          <span>Elapsed</span>
          <strong>{elapsedMs.toFixed(2)} ms</strong>
        </div>
      </div>

      <div className="step-message">
        <span>Message</span>
        <p>{currentStep?.message ?? "No step selected."}</p>
      </div>
    </section>
  );
}
