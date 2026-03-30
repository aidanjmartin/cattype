import { useState, useCallback, useEffect, useRef } from 'react';
import type { View, TestDuration, WordSet, TestResult, CatState, Theme, CatSkin } from './types';
import { useSettings } from './hooks/useSettings';
import { useTimer } from './hooks/useTimer';
import { useTypingEngine } from './hooks/useTypingEngine';
import { useStats } from './hooks/useStats';
import { commonWords, extendedWords, getRandomWords } from './data/words';
import { getRandomQuote } from './data/quotes';
import { saveResult, savePlayer, loadPlayer } from './utils/storage';
import { generateId } from './utils/calculations';
import { processTestResult } from './utils/player';
import type { GoalDef } from './utils/player';

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
import { ThemeBackground } from './components/ThemeBackground';
import { Shop } from './components/Shop';
import { Goals } from './components/Goals';

const WORD_COUNT = 80;

function generateWords(wordSet: WordSet): string[] {
  if (wordSet === 'english') return getRandomWords(commonWords, WORD_COUNT);
  if (wordSet === 'english1k') return getRandomWords(extendedWords, WORD_COUNT);
  if (wordSet === 'quotes') return getRandomQuote().text.split(' ');
  return getRandomWords(commonWords, WORD_COUNT);
}

function DecorationCats() {
  return (
    <div className="pointer-events-none select-none" aria-hidden="true">
      <div className="absolute animate-float" style={{ left: '-88px', top: '40px', opacity: 0.5, animationDelay: '0s' }}>
        <img src="/CatContent.png" alt="" style={{ width: 70, height: 70, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }} />
      </div>
      <div className="absolute animate-float" style={{ right: '-88px', top: '20px', opacity: 0.5, animationDelay: '1.2s', transform: 'scaleX(-1)' }}>
        <img src="/CatExcited.png" alt="" style={{ width: 70, height: 70, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }} />
      </div>
      <div className="absolute animate-breathe" style={{ right: '-72px', bottom: '20px', opacity: 0.35, animationDelay: '0.6s', transform: 'scaleX(-1)' }}>
        <img src="/CatShock.png" alt="" style={{ width: 50, height: 50, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }} />
      </div>
      {/* Paw prints */}
      <svg className="absolute" style={{ top: -18, left: '15%', opacity: 0.15 }} width="20" height="20" viewBox="0 0 24 24">
        <ellipse cx="12" cy="16" rx="5" ry="4" fill="var(--accent)"/>
        <circle cx="7" cy="10" r="2.5" fill="var(--accent)"/>
        <circle cx="17" cy="10" r="2.5" fill="var(--accent)"/>
        <circle cx="10" cy="7" r="2" fill="var(--accent)"/>
        <circle cx="14" cy="7" r="2" fill="var(--accent)"/>
      </svg>
      <svg className="absolute" style={{ bottom: -16, right: '20%', opacity: 0.12 }} width="16" height="16" viewBox="0 0 24 24">
        <ellipse cx="12" cy="16" rx="5" ry="4" fill="var(--correct)"/>
        <circle cx="7" cy="10" r="2.5" fill="var(--correct)"/>
        <circle cx="17" cy="10" r="2.5" fill="var(--correct)"/>
        <circle cx="10" cy="7" r="2" fill="var(--correct)"/>
        <circle cx="14" cy="7" r="2" fill="var(--correct)"/>
      </svg>
      {/* Stars */}
      <svg className="absolute animate-spin-slow" style={{ top: -22, right: '10%', opacity: 0.28 }} width="14" height="14" viewBox="0 0 24 24">
        <path d="M12 2L13.5 9L20 8L14.5 13L17 20L12 16L7 20L9.5 13L4 8L10.5 9Z" fill="var(--accent)"/>
      </svg>
      <svg className="absolute animate-spin-slow" style={{ bottom: -18, left: '8%', opacity: 0.2, animationDelay: '3s' }} width="11" height="11" viewBox="0 0 24 24">
        <path d="M12 2L13.5 9L20 8L14.5 13L17 20L12 16L7 20L9.5 13L4 8L10.5 9Z" fill="var(--correct)"/>
      </svg>
    </div>
  );
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
  const [player, setPlayer] = useState(() => loadPlayer());
  const [lastCoinsEarned, setLastCoinsEarned] = useState(0);
  const [lastNewGoals, setLastNewGoals] = useState<GoalDef[]>([]);

  const { settings, updateSetting } = useSettings();
  const engine = useTypingEngine(words);
  const stats = useStats(duration);

  const elapsedRef = useRef(0);
  const statsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Cat state: driven by current word mistakes, not WPM ──────────────────
  useEffect(() => {
    if (!engine.hasStarted) {
      setCatState('idle');
      return;
    }
    const ws = engine.wordStates;
    const idx = engine.currentWordIndex;
    const currentWord = ws[idx];
    if (!currentWord) return;

    // Any incorrect/extra char in the current word → shocked face
    const hasMistake = currentWord.chars.some(
      c => c.status === 'incorrect' || c.status === 'extra'
    );

    if (hasMistake) {
      setCatState('mindblown'); // shocked
      return;
    }

    // Last N completed words all perfect AND at least 3 complete → excited
    const lookback = Math.min(4, idx);
    const recent = ws.slice(Math.max(0, idx - lookback), idx);
    const allPerfect = recent.length >= 3 && recent.every(
      w => w.isComplete && w.chars.every(c => c.status === 'correct')
    );

    setCatState(allPerfect ? 'excited' : 'typing');
  }, [engine.wordStates, engine.currentWordIndex, engine.hasStarted]);

  const handleTestComplete = useCallback(() => {
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);

    const engineStats = engine.getStats();
    const finalStats = stats.getFinalStats(engineStats.correctChars, engineStats.totalTyped, duration);

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

    const { updatedPlayer, newGoals, coinsEarned } = processTestResult(result, player);
    savePlayer(updatedPlayer);
    setPlayer(updatedPlayer);
    setLastCoinsEarned(coinsEarned);
    setLastNewGoals(newGoals);
    setTestResult(result);
    setView('results');
    setCatState('idle');
  }, [duration, engine, stats, wordSet, player]);

  const { timeLeft, isRunning, start: startTimer, reset: resetTimer } = useTimer(duration, handleTestComplete);

  const handleFirstKey = useCallback(() => {
    startTimer();
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
    setWords(newWords); setCurrentInput('');
    engine.reset(newWords); stats.reset(); resetTimer(d);
    setCatState('idle'); elapsedRef.current = 0;
  }, [wordSet, engine, stats, resetTimer]);

  const handleWordSetChange = useCallback((ws: WordSet) => {
    setWordSet(ws);
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    const newWords = generateWords(ws);
    setWords(newWords); setCurrentInput('');
    engine.reset(newWords); stats.reset(); resetTimer(duration);
    setCatState('idle'); elapsedRef.current = 0;
  }, [duration, engine, stats, resetTimer]);

  const handleInput = useCallback((value: string) => {
    setCurrentInput(value);
    engine.processInput(value, handleFirstKey);
    const engineStats = engine.getStats();
    stats.updateAccuracy(engineStats.correctChars, engineStats.totalTyped + value.length);
  }, [engine, handleFirstKey, stats]);

  const handleCommitWord = useCallback(() => { engine.commitWord(); setCurrentInput(''); }, [engine]);
  const handleRevertWord = useCallback(() => {
    const prev = engine.revertWord();
    if (prev !== null) setCurrentInput(prev);
  }, [engine]);

  // Shop / player actions
  const handleBuyTheme = useCallback((id: Theme) => {
    const prices: Record<string, number> = { matcha: 200, chai: 150, strawberry: 300, galaxy: 500, sakura: 250, seaside: 350, school: 150 };
    setPlayer(prev => {
      if (prev.unlockedThemes.includes(id)) return prev;
      const price = prices[id] ?? 9999;
      if (prev.coins < price) return prev;
      const updated = { ...prev, coins: prev.coins - price, unlockedThemes: [...prev.unlockedThemes, id] };
      savePlayer(updated);
      return updated;
    });
  }, []);

  const handleBuyCatSkin = useCallback((id: CatSkin) => {
    setPlayer(prev => {
      if (prev.unlockedCatSkins.includes(id)) return prev;
      const prices: Record<string, number> = { cosmic: 400, golden: 600, forest: 300, sunset: 350 };
      const price = prices[id] ?? 9999;
      if (prev.coins < price) return prev;
      const updated = { ...prev, coins: prev.coins - price, unlockedCatSkins: [...prev.unlockedCatSkins, id] };
      savePlayer(updated);
      return updated;
    });
  }, []);

  const handleEquipCatSkin = useCallback((id: CatSkin) => {
    setPlayer(prev => {
      const updated = { ...prev, activeCatSkin: id };
      savePlayer(updated);
      return updated;
    });
  }, []);

  // Tab+Enter restart
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Tab') { e.preventDefault(); setIsTabDown(true); }
      if (e.key === 'Enter' && isTabDown) { e.preventDefault(); restart(); setIsTabDown(false); }
    };
    const up = (e: KeyboardEvent) => { if (e.key === 'Tab') setIsTabDown(false); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [isTabDown, restart]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center" style={{ background: 'var(--bg)' }}>
        <div>
          <CatMascot state="idle" animated size={96} />
          <h1 className="text-2xl font-bold mt-4 mb-2" style={{ color: 'var(--accent)' }}>CatType</h1>
          <p style={{ color: 'var(--muted)' }}>Please use a desktop browser with a physical keyboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--cream)' }}>
      {settings.bgAnimations && <ThemeBackground theme={settings.theme} />}

      <Header
        onViewChange={(v) => { if (v === 'test') restart(); else setView(v as View); }}
        onSettingsOpen={() => setSettingsOpen(true)}
        coins={player.coins}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="w-full max-w-3xl">

          {view === 'test' && (
            <div className="animate-fade-in">
              <TestConfig duration={duration} wordSet={wordSet} onDurationChange={handleDurationChange} onWordSetChange={handleWordSetChange} />
              <div className="relative">
                <DecorationCats />
                <TypingArea
                  wordStates={engine.wordStates}
                  currentWordIndex={engine.currentWordIndex}
                  currentInput={currentInput}
                  onInput={handleInput}
                  onCommitWord={handleCommitWord}
                  onRevertWord={handleRevertWord}
                  isActive={isRunning}
                  onStart={handleFirstKey}
                  smoothCaret={settings.smoothCaret}
                  fontSize={settings.fontSize}
                  isFocused={isFocused}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
              <div className="flex items-center justify-center gap-6 mt-6">
                <span style={{ color: 'var(--muted)', fontSize: '12px' }}>🐾</span>
                <Timer timeLeft={timeLeft} isRunning={isRunning} />
                <RestartButton onRestart={restart} />
                <span style={{ color: 'var(--muted)', fontSize: '12px' }}>🐾</span>
              </div>
              <div className="flex justify-center mt-4">
                <LiveStats wpm={stats.liveWpm} accuracy={stats.liveAccuracy} />
              </div>
              {settings.catAnimations && (
                <div className="flex justify-center mt-6">
                  <CatMascot state={catState} animated={settings.catAnimations} size={96} skin={player.activeCatSkin} />
                </div>
              )}
              <div className="flex justify-center mt-4">
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  <kbd className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.08)', fontSize: '11px' }}>Tab</kbd>
                  {' + '}
                  <kbd className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.08)', fontSize: '11px' }}>Enter</kbd>
                  {' — restart  ·  '}
                  <kbd className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.08)', fontSize: '11px' }}>⌫</kbd>
                  {' — backspace to prev word'}
                </p>
              </div>
            </div>
          )}

          {view === 'results' && testResult && (
            <Results
              result={testResult}
              onRestart={restart}
              catAnimations={settings.catAnimations}
              coinsEarned={lastCoinsEarned}
              newGoals={lastNewGoals}
              catSkin={player.activeCatSkin}
            />
          )}

          {view === 'stats' && <StatsPage onBack={() => setView('test')} />}
          {view === 'gallery' && <CatGallery onBack={() => setView('test')} />}
          {view === 'shop' && (
            <Shop
              player={player}
              onBuyTheme={handleBuyTheme}
              onBuyCatSkin={handleBuyCatSkin}
              onEquipCatSkin={handleEquipCatSkin}
              onBack={() => setView('test')}
            />
          )}
          {view === 'goals' && (
            <Goals
              player={player}
              lastResult={testResult}
              onBack={() => setView('test')}
            />
          )}
        </div>
      </main>

      {settingsOpen && (
        <Settings settings={settings} onUpdate={updateSetting} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}
