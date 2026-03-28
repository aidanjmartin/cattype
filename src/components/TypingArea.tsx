import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { WordState } from '../types';
import { Caret } from './Caret';
import { FocusOverlay } from './FocusOverlay';

interface Props {
  wordStates: WordState[];
  currentWordIndex: number;
  currentInput: string;
  onInput: (value: string) => void;
  onCommitWord: () => void;
  isActive: boolean;
  onStart: () => void;
  smoothCaret: boolean;
  fontSize: 'small' | 'medium' | 'large';
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

const FONT_SIZES = { small: '16px', medium: '20px', large: '24px' };
const LINE_HEIGHT_MAP = { small: 32, medium: 40, large: 48 };

export const TypingArea: React.FC<Props> = ({
  wordStates,
  currentWordIndex,
  currentInput,
  onInput,
  onCommitWord,
  isActive: _isActive,
  onStart: _onStart,
  smoothCaret,
  fontSize,
  isFocused,
  onFocus,
  onBlur,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const lh = LINE_HEIGHT_MAP[fontSize];

  const [caretPos, setCaretPos] = useState({ top: 8, left: 0, height: lh });
  const [scrollOffset, setScrollOffset] = useState(0);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
    onFocus();
  }, [onFocus]);

  // Auto focus on mount
  useEffect(() => {
    setTimeout(() => focusInput(), 50);
  }, []);

  // Reset scroll on restart (currentWordIndex returns to 0)
  useEffect(() => {
    if (currentWordIndex === 0) {
      setScrollOffset(0);
    }
  }, [currentWordIndex]);

  // Update caret position and scroll
  useEffect(() => {
    if (!wordsRef.current || !containerRef.current) return;

    const wordEl = wordsRef.current.querySelector(`[data-word="${currentWordIndex}"]`);
    if (!wordEl) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const wordChars = wordStates[currentWordIndex]?.chars || [];
    const typedLength = currentInput.length;

    // --- Scroll logic ---
    // Compare current word's position to first word's position (both share the same
    // CSS transform, so their relative offset is independent of scrollOffset).
    const firstWordEl = wordsRef.current.querySelector('[data-word="0"]');
    if (firstWordEl) {
      const wordTop = wordEl.getBoundingClientRect().top;
      const firstWordTop = firstWordEl.getBoundingClientRect().top;
      // contentRow = which row this word sits on in the full unclipped content
      const contentRow = Math.round((wordTop - firstWordTop) / lh);
      // Keep the current word at content row 1 (second line) so there's always
      // a line of upcoming text visible below it.
      if (contentRow >= 2) {
        const targetOffset = -(contentRow - 1) * lh;
        setScrollOffset(prev => (prev !== targetOffset ? targetOffset : prev));
      }
    }

    // --- Caret position ---
    // rect.top already reflects the CSS translateY transform, so we must NOT
    // add scrollOffset again — that would double-apply it.
    let caretLeft = 0;
    let caretTop = 8;

    if (typedLength === 0) {
      const firstChar = wordEl.querySelector('[data-char="0"]');
      if (firstChar) {
        const rect = firstChar.getBoundingClientRect();
        caretLeft = rect.left - containerRect.left;
        caretTop = rect.top - containerRect.top;
      } else {
        const wordRect = wordEl.getBoundingClientRect();
        caretLeft = wordRect.left - containerRect.left;
        caretTop = wordRect.top - containerRect.top;
      }
    } else {
      const lastTypedIndex = Math.min(typedLength - 1, wordChars.length - 1);
      const charEl = wordEl.querySelector(`[data-char="${lastTypedIndex}"]`);
      if (charEl) {
        const rect = charEl.getBoundingClientRect();
        caretLeft = rect.right - containerRect.left;
        caretTop = rect.top - containerRect.top;
      }
    }

    setCaretPos({ top: caretTop, left: caretLeft, height: lh });
  }, [currentWordIndex, currentInput, wordStates, fontSize, lh]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      return;
    }
    if (e.key === ' ') {
      e.preventDefault();
      if (currentInput.trim() !== '') {
        onCommitWord();
      }
      return;
    }
    // Handle backspace explicitly so it always works regardless of the character
    // being deleted (punctuation, apostrophes, etc. can trip up browser defaults
    // on some OS/keyboard combos with controlled inputs).
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        onInput('');
      } else {
        onInput(currentInput.slice(0, -1));
      }
      return;
    }
  }, [currentInput, onCommitWord, onInput]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Don't allow space in input (handled by space key)
    if (val.includes(' ')) return;
    onInput(val);
  }, [onInput]);

  const fontSizeVal = FONT_SIZES[fontSize];

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden cursor-text select-none"
      style={{
        background: 'rgba(43, 22, 34, 0.6)',
        padding: '2rem',
        minHeight: `${lh * 3 + 64}px`,
        maxHeight: `${lh * 3 + 64}px`,
      }}
      onClick={focusInput}
    >
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        aria-label="Type here"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        tabIndex={-1}
      />

      {/* Words container with scroll */}
      <div
        style={{
          overflow: 'hidden',
          height: `${lh * 3}px`,
          position: 'relative',
        }}
      >
        <div
          ref={wordsRef}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: fontSizeVal,
            lineHeight: `${lh}px`,
            transform: `translateY(${scrollOffset}px)`,
            transition: smoothCaret ? 'transform 0.15s ease' : 'none',
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            gap: '0 0.5em',
          }}
        >
          {wordStates.map((ws, wi) => (
            <span
              key={wi}
              data-word={wi}
              style={{
                display: 'inline-block',
                position: 'relative',
                marginBottom: `${lh * 0.1}px`,
              }}
            >
              {ws.chars.map((c, ci) => {
                let color: string;
                if (wi < currentWordIndex) {
                  color = c.status === 'correct' ? '#98d4b8' : (c.status === 'incorrect' || c.status === 'extra') ? '#ff7878' : '#7a4d63';
                } else if (wi === currentWordIndex) {
                  color = c.status === 'correct' ? '#98d4b8' : (c.status === 'incorrect' || c.status === 'extra') ? '#ff7878' : '#7a4d63';
                } else {
                  color = '#4a4e69';
                }
                return (
                  <span
                    key={ci}
                    data-char={ci}
                    style={{
                      color,
                      display: 'inline-block',
                    }}
                  >
                    {c.char}
                  </span>
                );
              })}
            </span>
          ))}
        </div>
      </div>

      {/* Caret */}
      <Caret position={caretPos} smooth={smoothCaret} isActive={isFocused} />

      {/* Focus overlay */}
      {!isFocused && <FocusOverlay onFocus={focusInput} />}
    </div>
  );
};
