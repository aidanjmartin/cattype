import { useState, useCallback, useEffect, useRef } from 'react';
import type { View, TestDuration, WordSet, TestResult, CatState } from './types';
import { useSettings } from './hooks/useSettings';
import { useTimer } from './hooks/useTimer';
import { useTypingEngine } from './hooks/useTypingEngine';
import { useStats } from './hooks/useStats';
import { commonWords, extendedWords, getRandomWords } from './data/words';
import { getRandomQuote } from './data/quotes';
import { saveResult } from './utils/storage';
import { generateId } from './utils/calculations';

import { Header } from './components/Header';
import { TestConfig } from './components/TestConfig';
import { TypingArea } from './components/TypingArea';
import { Timer } from './components/Timer';
import { LiveStats } from './components/LiveStats';
import { Results } from './components/Results';
import { StatsPage } from './components/StatsPage';
import { CatGallery } from './components/CatGallery';
import { Settings } from './components/Settings';
import { CatMascot } from './components/CatMascot';
import { RestartButton } from './components/RestartButton';
import { SakuraCanvas } from './components/SakuraCanvas';

const WORD_COUNT = 80;

function generateWords(wordSet: WordSet): string[] {
  if (wordSet === 'english') return getRandomWords(commonWords, WORD_COUNT);
  if (wordSet === 'english1k') return getRandomWords(extendedWords, WORD_COUNT);
  if (wordSet === 'quotes') {
    const q = getRandomQuote();
    return q.text.split(' ');
  }
  return getRandomWords(commonWords, WORD_COUNT);
}

export default function App() {
  const [view, setView] = useState<View>('test');
  const [duration, setDuration] = useState<TestDuration>(30);
  const [wordSet, setWordSet] = useState<WordSet>('english');
  const [words, setWords] = useState<string[]>(() => generateWords('english'));
  const [currentInput, setCurrentInput] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [catState, setCatState] = useState<CatState>('idle');
  const [isTabDown, setIsTabDown] = useState(false);

  const { settings, updateSetting } = useSettings();

  const engine = useTypingEngine(words);
  const stats = useStats(duration);

  const elapsedRef = useRef(0);
  const statsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleTestComplete = useCallback(() => {
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    setCatState('idle');

    const engineStats = engine.getStats();
    const elapsed = duration;
    const finalStats = stats.getFinalStats(
      engineStats.correctChars,
      engineStats.totalTyped,
      elapsed
    );

    const result: TestResult = {
      id: generateId(),
      timestamp: Date.now(),
      wpm: finalStats.wpm,
      rawWpm: finalStats.rawWpm,
      accuracy: finalStats.accuracy,
      duration,
      wordSet,
      correctChars: engineStats.correctChars,
      incorrectChars: engineStats.incorrectChars,
      extraChars: engineStats.extraChars,
      missedChars: 0,
      wpmHistory: finalStats.wpmHistory,
      consistency: finalStats.consistency,
    };

    saveResult(result);
    setTestResult(result);
    setView('results');
  }, [duration, engine, stats, wordSet]);

  const { timeLeft, isRunning, start: startTimer, reset: resetTimer } = useTimer(duration, handleTestComplete);

  const handleFirstKey = useCallback(() => {
    startTimer();
    setCatState('typing');
    elapsedRef.current = 0;

    statsIntervalRef.current = setInterval(() => {
      elapsedRef.current++;
      const engineStats = engine.getStats();
      stats.recordSecond(engineStats.correctChars, elapsedRef.current);
      stats.updateAccuracy(engineStats.correctChars, engineStats.totalTyped);
    }, 1000);
  }, [startTimer, engine, stats]);

  const restart = useCallback(() => {
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    const newWords = generateWords(wordSet);
    setWords(newWords);
    setCurrentInput('');
    engine.reset(newWords);
    stats.reset();
    resetTimer(duration);
    setCatState('idle');
    elapsedRef.current = 0;
    setView('test');
  }, [wordSet, engine, stats, resetTimer, duration]);

  const handleDurationChange = useCallback((d: TestDuration) => {
    setDuration(d);
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    const newWords = generateWords(wordSet);
    setWords(newWords);
    setCurrentInput('');
    engine.reset(newWords);
    stats.reset();
    resetTimer(d);
    setCatState('idle');
    elapsedRef.current = 0;
  }, [wordSet, engine, stats, resetTimer]);

  const handleWordSetChange = useCallback((ws: WordSet) => {
    setWordSet(ws);
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    const newWords = generateWords(ws);
    setWords(newWords);
    setCurrentInput('');
    engine.reset(newWords);
    stats.reset();
    resetTimer(duration);
    setCatState('idle');
    elapsedRef.current = 0;
  }, [duration, engine, stats, resetTimer]);

  const handleInput = useCallback((value: string) => {
    setCurrentInput(value);
    engine.processInput(value, handleFirstKey);
    if (engine.hasStarted || value.length > 0) {
      setCatState('typing');
    }
    const engineStats = engine.getStats();
    stats.updateAccuracy(engineStats.correctChars, engineStats.totalTyped + value.length);
  }, [engine, handleFirstKey, stats]);

  const handleCommitWord = useCallback(() => {
    engine.commitWord();
    setCurrentInput('');
  }, [engine]);

  // Global keyboard handler for Tab+Enter restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setIsTabDown(true);
      }
      if (e.key === 'Enter' && isTabDown) {
        e.preventDefault();
        restart();
        setIsTabDown(false);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Tab') setIsTabDown(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isTabDown, restart]);

  // Apply theme CSS variables
  useEffect(() => {
    if (settings.theme === 'light') {
      document.documentElement.style.setProperty('--bg', '#fdf6e3');
      document.documentElement.style.setProperty('--surface', '#fff8ef');
      document.documentElement.style.setProperty('--cream', '#2d2d2d');
      document.documentElement.style.setProperty('--muted', '#9a9a9a');
    } else {
      document.documentElement.style.setProperty('--bg', '#1a1a2e');
      document.documentElement.style.setProperty('--surface', '#16213e');
      document.documentElement.style.setProperty('--cream', '#f5f0e8');
      document.documentElement.style.setProperty('--muted', '#4a4e69');
    }
  }, [settings.theme]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center" style={{ background: '#1a1a2e' }}>
        <div>
          <CatMascot state="sleepy" animated={true} />
          <h1 className="text-2xl font-bold mt-4 mb-2" style={{ color: '#f7a8b8' }}>NekoType</h1>
          <p style={{ color: '#4a4e69' }}>For the best typing experience, please use a desktop browser with a physical keyboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg)', color: 'var(--cream)' }}
    >
      {settings.sakuraEnabled && <SakuraCanvas />}

      <Header
        onViewChange={(v) => {
          if (v === 'test') restart();
          else setView(v as View);
        }}
        onSettingsOpen={() => setSettingsOpen(true)}
        isDark={settings.theme === 'dark'}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="w-full max-w-3xl">
          {view === 'test' && (
            <div className="animate-fade-in">
              <TestConfig
                duration={duration}
                wordSet={wordSet}
                onDurationChange={handleDurationChange}
                onWordSetChange={handleWordSetChange}
              />

              <TypingArea
                wordStates={engine.wordStates}
                currentWordIndex={engine.currentWordIndex}
                currentInput={currentInput}
                onInput={handleInput}
                onCommitWord={handleCommitWord}
                isActive={isRunning}
                onStart={handleFirstKey}
                smoothCaret={settings.smoothCaret}
                fontSize={settings.fontSize}
                isFocused={isFocused}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />

              <div className="flex items-center justify-center gap-6 mt-6">
                <span style={{ color: '#4a4e69', fontSize: '12px' }}>🐾</span>
                <Timer timeLeft={timeLeft} isRunning={isRunning} />
                <RestartButton onRestart={restart} />
                <span style={{ color: '#4a4e69', fontSize: '12px' }}>🐾</span>
              </div>

              <div className="flex justify-center mt-4">
                <LiveStats wpm={stats.liveWpm} accuracy={stats.liveAccuracy} />
              </div>

              {settings.catAnimations && (
                <div className="flex justify-center mt-6">
                  <CatMascot state={catState} animated={settings.catAnimations} />
                </div>
              )}

              <div className="flex justify-center mt-4">
                <p className="text-xs" style={{ color: '#4a4e69' }}>
                  <kbd className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(74,78,105,0.3)', fontSize: '11px' }}>Tab</kbd>
                  {' + '}
                  <kbd className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(74,78,105,0.3)', fontSize: '11px' }}>Enter</kbd>
                  {' — restart test'}
                </p>
              </div>
            </div>
          )}

          {view === 'results' && testResult && (
            <Results
              result={testResult}
              onRestart={restart}
              catAnimations={settings.catAnimations}
            />
          )}

          {view === 'stats' && (
            <StatsPage onBack={() => setView('test')} />
          )}

          {view === 'gallery' && (
            <CatGallery onBack={() => setView('test')} />
          )}
        </div>
      </main>

      {settingsOpen && (
        <Settings
          settings={settings}
          onUpdate={updateSetting}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
