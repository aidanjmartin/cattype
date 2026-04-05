import { useState, useCallback, useRef } from 'react';
import type { WordState, CharState } from '../types';

function buildWordState(word: string): WordState {
  return {
    chars: word.split('').map(char => ({ char, status: 'pending' as const })),
    typed: '',
    isComplete: false,
  };
}

function rebuildWordChars(word: string, typed: string): CharState[] {
  const base: CharState[] = word.split('').map((char, i) => {
    if (i < typed.length) {
      return { char, status: typed[i] === char ? 'correct' : 'incorrect' };
    }
    return { char, status: 'pending' };
  });
  const extra: CharState[] = [];
  if (typed.length > word.length) {
    for (let i = word.length; i < typed.length; i++) {
      extra.push({ char: typed[i], status: 'extra' });
    }
  }
  return [...base, ...extra];
}

export function useTypingEngine(words: string[]) {
  const [wordStates, setWordStates] = useState<WordState[]>(() =>
    words.map(buildWordState)
  );
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  // Ref mirrors hasStarted so processInput never double-fires onFirstKey
  // between renders when two events land before the state update flushes.
  const hasStartedRef = useRef(false);

  const correctCharsRef = useRef(0);
  const incorrectCharsRef = useRef(0);
  const extraCharsRef = useRef(0);
  const totalTypedRef = useRef(0);

  const reset = useCallback((newWords: string[]) => {
    setWordStates(newWords.map(buildWordState));
    setCurrentWordIndex(0);
    setHasStarted(false);
    hasStartedRef.current = false;
    correctCharsRef.current = 0;
    incorrectCharsRef.current = 0;
    extraCharsRef.current = 0;
    totalTypedRef.current = 0;
  }, []);

  const processInput = useCallback((input: string, onFirstKey: () => void) => {
    // Guard: nothing to do past the last word
    if (currentWordIndex >= words.length) return;

    if (!hasStartedRef.current && input.length > 0) {
      hasStartedRef.current = true;
      setHasStarted(true);
      onFirstKey();
    }

    setWordStates(prev => {
      const next = [...prev];
      const current = { ...next[currentWordIndex] };
      current.chars = rebuildWordChars(words[currentWordIndex], input);
      current.typed = input;
      next[currentWordIndex] = current;
      return next;
    });
  }, [currentWordIndex, words]);

  const commitWord = useCallback(() => {
    const currentWord = wordStates[currentWordIndex];
    if (!currentWord) return;

    let correct = 0, incorrect = 0, extra = 0;
    for (const c of currentWord.chars) {
      if (c.status === 'correct') correct++;
      else if (c.status === 'incorrect') incorrect++;
      else if (c.status === 'extra') extra++;
      else if (c.status === 'pending') incorrect++;
    }
    correctCharsRef.current += correct;
    incorrectCharsRef.current += incorrect;
    extraCharsRef.current += extra;
    totalTypedRef.current += currentWord.typed.length;

    setWordStates(prev => {
      const next = [...prev];
      const current = { ...next[currentWordIndex] };
      current.chars = current.chars.map(c =>
        c.status === 'pending' ? { ...c, status: 'incorrect' as const } : c
      );
      current.isComplete = true;
      next[currentWordIndex] = current;
      return next;
    });
    setCurrentWordIndex(prev => Math.min(prev + 1, words.length));
  }, [currentWordIndex, wordStates, words.length]);

  // Revert the last committed word, returning what was typed so the caller
  // can restore currentInput.
  const revertWord = useCallback((): string | null => {
    if (currentWordIndex === 0) return null;

    const prevIndex = currentWordIndex - 1;
    const prevWordState = wordStates[prevIndex];
    if (!prevWordState?.isComplete) return null;

    const prevTyped = prevWordState.typed;
    const word = words[prevIndex];

    // Subtract stats that were counted when this word was committed
    let correct = 0, incorrect = 0, extra = 0;
    for (const c of prevWordState.chars) {
      if (c.status === 'correct') correct++;
      else if (c.status === 'incorrect') incorrect++;
      else if (c.status === 'extra') extra++;
    }
    correctCharsRef.current = Math.max(0, correctCharsRef.current - correct);
    incorrectCharsRef.current = Math.max(0, incorrectCharsRef.current - incorrect);
    extraCharsRef.current = Math.max(0, extraCharsRef.current - extra);
    totalTypedRef.current = Math.max(0, totalTypedRef.current - prevTyped.length);

    setWordStates(prev => {
      const next = [...prev];
      next[prevIndex] = {
        ...next[prevIndex],
        chars: rebuildWordChars(word, prevTyped),
        isComplete: false,
      };
      return next;
    });
    setCurrentWordIndex(prevIndex);

    return prevTyped;
  }, [currentWordIndex, wordStates, words]);

  const getStats = useCallback(() => ({
    correctChars: correctCharsRef.current,
    incorrectChars: incorrectCharsRef.current,
    extraChars: extraCharsRef.current,
    totalTyped: totalTypedRef.current,
  }), []);

  return {
    wordStates,
    currentWordIndex,
    hasStarted,
    processInput,
    commitWord,
    revertWord,
    reset,
    getStats,
  };
}
