import { useRef, useCallback, useState } from 'react';
import { calcWpm, calcAccuracy, calcConsistency } from '../utils/calculations';

export function useStats(_duration: number) {
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);
  const wpmHistoryRef = useRef<number[]>([]);
  const totalCorrectAtLastSecondRef = useRef(0);
  const elapsedRef = useRef(0);

  const recordSecond = useCallback((totalCorrectChars: number, elapsed: number) => {
    elapsedRef.current = elapsed;
    totalCorrectAtLastSecondRef.current = totalCorrectChars;

    setLiveWpm(calcWpm(totalCorrectChars, elapsed));

    // Per-second WPM for consistency tracking
    const deltaCorrect = totalCorrectChars - (wpmHistoryRef.current.length > 0
      ? wpmHistoryRef.current.reduce((acc, _, i, arr) => i === arr.length - 1 ? acc : acc, totalCorrectAtLastSecondRef.current)
      : 0);
    const secondWpm = calcWpm(Math.max(0, deltaCorrect), 1);
    wpmHistoryRef.current.push(secondWpm);
  }, []);

  const updateAccuracy = useCallback((correct: number, total: number) => {
    setLiveAccuracy(calcAccuracy(correct, total));
  }, []);

  const reset = useCallback(() => {
    wpmHistoryRef.current = [];
    totalCorrectAtLastSecondRef.current = 0;
    elapsedRef.current = 0;
    setLiveWpm(0);
    setLiveAccuracy(100);
  }, []);

  const getFinalStats = useCallback((
    correctChars: number,
    totalTyped: number,
    elapsed: number
  ) => {
    const wpm = calcWpm(correctChars, elapsed);
    const rawWpm = calcWpm(totalTyped, elapsed);
    const accuracy = calcAccuracy(correctChars, totalTyped);
    const consistency = calcConsistency(wpmHistoryRef.current);
    return { wpm, rawWpm, accuracy, consistency, wpmHistory: [...wpmHistoryRef.current] };
  }, []);

  return { liveWpm, liveAccuracy, recordSecond, updateAccuracy, reset, getFinalStats };
}
