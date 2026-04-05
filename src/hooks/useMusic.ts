import { useRef, useCallback, useState, useEffect } from 'react';
import type { Soundtrack } from '../types';
import { SOUNDTRACK_PATHS } from '../utils/player';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useMusic(ownedTracks: Soundtrack[], volume: number) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Soundtrack>('cafe-lofi');
  const [hasEverPlayed, setHasEverPlayed] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Always-current refs so event listeners never have stale values
  const ownedRef = useRef(ownedTracks);
  ownedRef.current = ownedTracks;
  const volumeRef = useRef(volume);
  volumeRef.current = volume;
  // Shuffle queue — refilled whenever empty
  const queueRef = useRef<Soundtrack[]>([]);

  const buildQueue = useCallback((excluding: Soundtrack): Soundtrack[] => {
    const pool = ownedRef.current.filter(t => t !== excluding);
    return pool.length > 0 ? shuffle(pool) : [excluding];
  }, []);

  // Core play function — always uses latest volume via ref
  const playTrack = useCallback((track: Soundtrack) => {
    // Tear down previous audio cleanly
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    const audio = new Audio(SOUNDTRACK_PATHS[track]);
    audio.volume = volumeRef.current;
    audioRef.current = audio;
    setCurrentTrack(track);
    setHasEverPlayed(true);

    audio.onended = () => {
      if (queueRef.current.length === 0) {
        queueRef.current = buildQueue(track);
      }
      const next = queueRef.current.shift()!;
      playTrack(next);
    };

    audio.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
  }, [buildQueue]);

  // Keep live volume in sync without reloading the track
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.pause();
      }
    };
  }, []);

  // Called by App on the first keypress (satisfies browser autoplay policy)
  const startIfNotStarted = useCallback(() => {
    if (hasEverPlayed) return;
    // Seed the queue then start on cafe-lofi (always owned)
    const startTrack: Soundtrack = ownedRef.current.includes('cafe-lofi')
      ? 'cafe-lofi'
      : ownedRef.current[0];
    queueRef.current = buildQueue(startTrack);
    playTrack(startTrack);
  }, [hasEverPlayed, buildQueue, playTrack]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !hasEverPlayed) {
      // First interaction — treat as play
      startIfNotStarted();
      return;
    }
    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [hasEverPlayed, startIfNotStarted]);

  const skipTrack = useCallback(() => {
    if (queueRef.current.length === 0) {
      queueRef.current = buildQueue(currentTrack);
    }
    const next = queueRef.current.shift()!;
    playTrack(next);
  }, [currentTrack, buildQueue, playTrack]);

  return {
    isPlaying,
    currentTrack,
    hasEverPlayed,
    togglePlay,
    skipTrack,
    startIfNotStarted,
  };
}
