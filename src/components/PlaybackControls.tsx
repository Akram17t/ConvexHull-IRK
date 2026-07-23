type PlaybackControlsProps = {
  currentStepIndex: number;
  stepCount: number;
  progress: number;
  isPlaying: boolean;
  delayMs: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  setDelayMs: (delayMs: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetPlayback: () => void;
  togglePlayback: () => void;
};

export function PlaybackControls({
  currentStepIndex,
  stepCount,
  progress,
  isPlaying,
  delayMs,
  canGoPrevious,
  canGoNext,
  setDelayMs,
  nextStep,
  previousStep,
  resetPlayback,
  togglePlayback,
}: PlaybackControlsProps) {
  const hasSteps = stepCount > 0;

  return (
    <section className="workspace-panel playback-panel" aria-label="Step playback controls">
      <div className="playback-header">
        <span>Step Playback</span>
        <strong>
          {hasSteps ? currentStepIndex + 1 : 0}/{stepCount}
        </strong>
      </div>

      <progress className="progress-bar" value={progress} max={1} />

      <div className="button-row">
        <button className="button" type="button" onClick={previousStep} disabled={!canGoPrevious}>
          Previous
        </button>
        <button className="button button-primary" type="button" onClick={togglePlayback} disabled={!hasSteps || (!canGoNext && !isPlaying)}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button className="button" type="button" onClick={nextStep} disabled={!canGoNext}>
          Next
        </button>
        <button className="button" type="button" onClick={resetPlayback} disabled={!hasSteps || currentStepIndex === 0}>
          Reset
        </button>
      </div>

      <label className="range-label" htmlFor="speed-control">
        Speed
        <span>{delayMs} ms</span>
      </label>
      <input
        id="speed-control"
        className="range-control"
        type="range"
        min={150}
        max={1500}
        step={50}
        value={delayMs}
        onChange={(event) => setDelayMs(Number(event.target.value))}
      />
    </section>
  );
}
