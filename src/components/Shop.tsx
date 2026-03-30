import React, { useState } from 'react';
import type { PlayerData, Theme, CatSkin } from '../types';
import { SHOP_THEMES, SHOP_CAT_SKINS } from '../utils/player';
import { CatMascot } from './CatMascot';

interface Props {
  player: PlayerData;
  onBuyTheme: (id: Theme) => void;
  onBuyCatSkin: (id: CatSkin) => void;
  onEquipCatSkin: (id: CatSkin) => void;
  onBack: () => void;
}

type Tab = 'themes' | 'cats';

export const Shop: React.FC<Props> = ({ player, onBuyTheme, onBuyCatSkin, onEquipCatSkin, onBack }) => {
  const [tab, setTab] = useState<Tab>('themes');

  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>shop</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>spend your coins on themes & cats</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'var(--surface)' }}>
            <span style={{ fontSize: '18px' }}>🪙</span>
            <span className="font-bold font-mono" style={{ color: 'var(--accent)' }}>{player.coins}</span>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-70"
            style={{ background: 'var(--surface)', color: 'var(--muted)' }}
          >
            ← back
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-full w-fit" style={{ background: 'var(--surface)' }}>
        {(['themes', 'cats'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-1.5 rounded-full text-sm font-medium transition-all"
            style={tab === t
              ? { background: 'var(--accent)', color: 'var(--bg)' }
              : { color: 'var(--muted)' }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Themes grid */}
      {tab === 'themes' && (
        <div className="grid grid-cols-2 gap-4">
          {SHOP_THEMES.map(item => {
            const owned = player.unlockedThemes.includes(item.id);
            const canAfford = player.coins >= item.price;
            return (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden"
                style={{ background: item.bg, border: `1px solid ${item.accent}22` }}
              >
                {/* Preview strip */}
                <div className="p-4" style={{ background: item.surface }}>
                  <div className="flex gap-2 mb-2">
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.accent }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.correct }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                  </div>
                  <div className="font-mono text-xs" style={{ color: item.accent, opacity: 0.7 }}>
                    the quick brown fox
                  </div>
                  {item.isLight && (
                    <div className="text-xs mt-1" style={{ color: item.accent, opacity: 0.6 }}>☀️ light</div>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm" style={{ color: item.accent }}>{item.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: `${item.accent}99` }}>{item.description}</div>
                  </div>
                  {owned ? (
                    <div className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: `${item.accent}22`, color: item.accent }}>
                      owned ✓
                    </div>
                  ) : (
                    <button
                      onClick={() => onBuyTheme(item.id)}
                      disabled={!canAfford}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: item.accent, color: item.bg }}
                    >
                      🪙 {item.price}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cat skins grid */}
      {tab === 'cats' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Default skin — always owned */}
          <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--accent)22' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold" style={{ color: 'var(--cream)' }}>Default Cat</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>The original kitty</div>
              </div>
              <CatMascot state="typing" animated={false} size={56} skin="default" />
            </div>
            {player.activeCatSkin === 'default' ? (
              <div className="text-xs mt-3 text-center px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted)' }}>equipped</div>
            ) : (
              <button
                onClick={() => onEquipCatSkin('default')}
                className="w-full text-xs mt-3 px-3 py-1.5 rounded-full font-medium transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--cream)' }}
              >
                equip
              </button>
            )}
          </div>

          {SHOP_CAT_SKINS.map(item => {
            const owned = player.unlockedCatSkins.includes(item.id);
            const equipped = player.activeCatSkin === item.id;
            const canAfford = player.coins >= item.price;
            return (
              <div key={item.id} className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: `1px solid ${equipped ? 'var(--accent)' : 'transparent'}` }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--cream)' }}>{item.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{item.description}</div>
                  </div>
                  <CatMascot state="typing" animated={false} size={56} skin={item.id} />
                </div>
                {owned ? (
                  equipped ? (
                    <div className="text-xs text-center px-3 py-1.5 rounded-full" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
                      equipped ✓
                    </div>
                  ) : (
                    <button
                      onClick={() => onEquipCatSkin(item.id)}
                      className="w-full text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:opacity-80"
                      style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--cream)' }}
                    >
                      equip
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => onBuyCatSkin(item.id)}
                    disabled={!canAfford}
                    className="w-full text-xs px-3 py-1.5 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: 'var(--accent)', color: 'var(--bg)' }}
                  >
                    🪙 {item.price}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
