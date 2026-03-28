import { useState, useCallback, useRef } from 'react';
import type { WordState, CharState } from '../types';

function buildWordState(word: string): WordState {
  return {
    chars: word.split('').map(char => ({ char, status: 'pending' as const })),
    typed: '',
    isComplete: false,
  };
}

export function useTypingEngine(words: string[]) {
  const [wordStates, setWordStates] = useState<WordState[]>(() =>
    words.map(buildWordState)
  );
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Stats refs (don't need to trigger renders)
  const correctCharsRef = useRef(0);
  const incorrectCharsRef = useRef(0);
  const extraCharsRef = useRef(0);
  const totalTypedRef = useRef(0);

  const reset = useCallback((newWords: string[]) => {
    setWordStates(newWords.map(buildWordState));
    setCurrentWordIndex(0);
    setHasStarted(false);
    correctCharsRef.current = 0;
    incorrectCharsRef.current = 0;
    extraCharsRef.current = 0;
    totalTypedRef.current = 0;
  }, []);

  const processInput = useCallback((input: string, onFirstKey: () => void) => {
    if (!hasStarted && input.length > 0) {
      setHasStarted(true);
      onFirstKey();
    }

    setWordStates(prev => {
      const next = [...prev];
      const current = { ...next[currentWordIndex] };
      const word = words[currentWordIndex];

      // Build new chars array
      const newChars: CharState[] = word.split('').map((char, i) => {
        if (i < input.length) {
          return { char, status: input[i] === char ? 'correct' : 'incorrect' };
        }
        return { char, status: 'pending' };
      });

      // Handle extra characters (overflow)
      const extraChars: CharState[] = [];
      if (input.length > word.length) {
        for (let i = word.length; i < input.length; i++) {
          extraChars.push({ char: input[i], status: 'extra' });
        }
      }

      current.chars = [...newChars, ...extraChars];
      current.typed = input;
      next[currentWordIndex] = current;
      return next;
    });
  }, [currentWordIndex, hasStarted, words]);

  const commitWord = useCallback(() => {
    // Count stats OUTSIDE the setState updater — React StrictMode calls updaters
    // twice in development, which would double-count any ref mutations inside them.
    const currentWord = wordStates[currentWordIndex];
    if (!currentWord) return;

    let correct = 0, incorrect = 0, extra = 0;
    for (const c of currentWord.chars) {
      if (c.status === 'correct') correct++;
      else if (c.status === 'incorrect') incorrect++;
      else if (c.status === 'extra') extra++;
      else if (c.status === 'pending') incorrect++; // missed = incorrect
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
    setCurrentWordIndex(prev => prev + 1);
  }, [currentWordIndex, wordStates]);

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
    reset,
    getStats,
  };
}
