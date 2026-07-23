import "./style.css";
import { Canvas } from "./components/Canvas";
import { Controls } from "./components/Controls";
import { InfoPanel } from "./components/InfoPanel";
import { PlaybackControls } from "./components/PlaybackControls";
import { useHull } from "./hooks/useHull";
import { usePlayback } from "./hooks/usePlayback";
import { usePoints } from "./hooks/usePoints";
import { generateRandomPoints } from "./utils/generator";

function App() {
  const { points, pointCount, addPoint, setPoints, clearPoints } = usePoints();
  const { algorithm, setAlgorithm, hull, steps, elapsedMs } = useHull(points);
  const playback = usePlayback(steps);

  function handleGenerateRandom() {
    setPoints(generateRandomPoints({ count: 24 }));
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Convex Hull Visualizer</p>
          <h1>The Great Wrap</h1>
        </div>
        <p className="header-copy">Click the field, switch algorithms, and inspect every hull-building step.</p>
      </header>

      <div className="app-layout">
        <Canvas points={points} hull={hull} currentStep={playback.currentStep} onAddPoint={addPoint} />

        <aside className="side-panel" aria-label="Visualizer controls">
          <Controls
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            pointCount={pointCount}
            onGenerateRandom={handleGenerateRandom}
            onClearPoints={clearPoints}
          />
          <PlaybackControls {...playback} />
          <InfoPanel
            currentStep={playback.currentStep}
            currentStepIndex={playback.currentStepIndex}
            stepCount={playback.stepCount}
            hullPointCount={hull.length}
            elapsedMs={elapsedMs}
          />
        </aside>
      </div>
    </main>
  );
}

export default App;
