import React from 'react';

interface Props {
  onBack: () => void;
}

// Placeholder slots — drop image files into public/cats/ and update this list
const CAT_SLOTS = 6;

export const CatGallery: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="animate-slide-up w-full max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: '#7a4d63' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold" style={{ color: '#fceef5' }}>cat gallery</h1>
        <span className="text-sm px-2 py-0.5 rounded-full" style={{ background: 'rgba(247,168,192,0.15)', color: '#f7a8c0' }}>
          coming soon
        </span>
      </div>

      <p className="text-sm mb-8" style={{ color: '#7a4d63' }}>
        A cozy corner for cat pictures. Drop images into{' '}
        <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#2b1622' }}>
          public/cats/
        </code>{' '}
        to populate the gallery.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: CAT_SLOTS }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-3 border-2 border-dashed transition-all duration-200 hover:border-opacity-60"
            style={{
              background: '#2b1622',
              borderColor: 'rgba(247,168,192,0.25)',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none" opacity="0.3">
              <ellipse cx="30" cy="38" rx="10" ry="8" fill="#f7a8c0" />
              <circle cx="18" cy="26" r="6" fill="#f7a8c0" />
              <circle cx="42" cy="26" r="6" fill="#f7a8c0" />
              <circle cx="22" cy="18" r="4.5" fill="#f7a8c0" />
              <circle cx="38" cy="18" r="4.5" fill="#f7a8c0" />
            </svg>
            <span className="text-xs" style={{ color: '#7a4d63' }}>
              slot {i + 1}
            </span>
          </div>
        ))}
      </div>

      <p className="text-center text-xs mt-8" style={{ color: '#7a4d63' }}>
        🐾 More cats coming soon 🐾
      </p>
    </div>
  );
};
