import { useCallback, useEffect, useMemo, useState } from "react";
import type { HullStep } from "../types";

function clampStepIndex(index: number, stepsLength: number): number {
  if (stepsLength <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), stepsLength - 1);
}

export function usePlayback(steps: HullStep[], initialDelayMs = 700) {
  const [currentStepIndex, setCurrentStepIndexState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [delayMs, setDelayMs] = useState(initialDelayMs);

  const lastStepIndex = Math.max(steps.length - 1, 0);
  const currentStep = steps[currentStepIndex] ?? null;
  const canGoPrevious = currentStepIndex > 0;
  const canGoNext = currentStepIndex < lastStepIndex;

  const progress = useMemo(() => {
    if (steps.length <= 1) {
      return steps.length === 1 ? 1 : 0;
    }

    return currentStepIndex / lastStepIndex;
  }, [currentStepIndex, lastStepIndex, steps.length]);

  const setCurrentStepIndex = useCallback(
    (nextIndex: number) => {
      setCurrentStepIndexState(clampStepIndex(nextIndex, steps.length));
    },
    [steps.length],
  );

  const nextStep = useCallback(() => {
    setCurrentStepIndexState((index) => clampStepIndex(index + 1, steps.length));
  }, [steps.length]);

  const previousStep = useCallback(() => {
    setCurrentStepIndexState((index) => clampStepIndex(index - 1, steps.length));
  }, [steps.length]);

  const resetPlayback = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndexState(0);
  }, []);

  const play = useCallback(() => {
    if (steps.length <= 1) {
      return;
    }

    setIsPlaying(true);
  }, [steps.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying((currentValue) => {
      if (steps.length <= 1) {
        return false;
      }

      return !currentValue;
    });
  }, [steps.length]);

  useEffect(() => {
    resetPlayback();
  }, [resetPlayback, steps]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (!canGoNext) {
      setIsPlaying(false);
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentStepIndexState((index) => {
        const nextIndex = clampStepIndex(index + 1, steps.length);

        if (nextIndex >= steps.length - 1) {
          setIsPlaying(false);
        }

        return nextIndex;
      });
    }, delayMs);

    return () => window.clearInterval(intervalId);
  }, [canGoNext, delayMs, isPlaying, steps.length]);

  return {
    currentStep,
    currentStepIndex,
    stepCount: steps.length,
    lastStepIndex,
    progress,
    isPlaying,
    delayMs,
    canGoPrevious,
    canGoNext,
    setCurrentStepIndex,
    setDelayMs,
    nextStep,
    previousStep,
    resetPlayback,
    play,
    pause,
    togglePlayback,
  };
}
