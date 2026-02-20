import { useState, useCallback } from 'react';
import type { Set_ } from '../backend';

export interface SetProgress {
  setIndex: number;
  currentReps: number;
  targetReps: number;
  targetWeight: number;
  completed: boolean;
}

export function useWorkoutSession(sets: Set_[]) {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [setProgress, setSetProgress] = useState<SetProgress[]>(
    sets.map((set, index) => ({
      setIndex: index,
      currentReps: 0,
      targetReps: Number(set.reps),
      targetWeight: set.weight,
      completed: false,
    }))
  );
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);

  const incrementReps = useCallback(() => {
    setSetProgress((prev) => {
      const updated = [...prev];
      if (updated[currentSetIndex] && updated[currentSetIndex].currentReps < updated[currentSetIndex].targetReps) {
        updated[currentSetIndex] = {
          ...updated[currentSetIndex],
          currentReps: updated[currentSetIndex].currentReps + 1,
        };
      }
      return updated;
    });
  }, [currentSetIndex]);

  const decrementReps = useCallback(() => {
    setSetProgress((prev) => {
      const updated = [...prev];
      if (updated[currentSetIndex] && updated[currentSetIndex].currentReps > 0) {
        updated[currentSetIndex] = {
          ...updated[currentSetIndex],
          currentReps: updated[currentSetIndex].currentReps - 1,
        };
      }
      return updated;
    });
  }, [currentSetIndex]);

  const completeSet = useCallback(() => {
    setSetProgress((prev) => {
      const updated = [...prev];
      if (updated[currentSetIndex]) {
        updated[currentSetIndex] = {
          ...updated[currentSetIndex],
          completed: true,
        };
      }
      return updated;
    });

    // Start rest timer
    setIsRestTimerActive(true);

    // Move to next set if available
    if (currentSetIndex < sets.length - 1) {
      setTimeout(() => {
        setCurrentSetIndex((prev) => prev + 1);
      }, 100);
    }
  }, [currentSetIndex, sets.length]);

  const goToNextSet = useCallback(() => {
    if (currentSetIndex < sets.length - 1) {
      setCurrentSetIndex((prev) => prev + 1);
    }
  }, [currentSetIndex, sets.length]);

  const goToPreviousSet = useCallback(() => {
    if (currentSetIndex > 0) {
      setCurrentSetIndex((prev) => prev - 1);
    }
  }, [currentSetIndex]);

  const resetSession = useCallback(() => {
    setCurrentSetIndex(0);
    setSetProgress(
      sets.map((set, index) => ({
        setIndex: index,
        currentReps: 0,
        targetReps: Number(set.reps),
        targetWeight: set.weight,
        completed: false,
      }))
    );
    setIsRestTimerActive(false);
  }, [sets]);

  const currentSet = setProgress[currentSetIndex];
  const completedSetsCount = setProgress.filter((s) => s.completed).length;
  const remainingSetsCount = sets.length - completedSetsCount;

  return {
    currentSetIndex,
    currentSet,
    setProgress,
    completedSetsCount,
    remainingSetsCount,
    incrementReps,
    decrementReps,
    completeSet,
    goToNextSet,
    goToPreviousSet,
    resetSession,
    isRestTimerActive,
    setIsRestTimerActive,
  };
}
