import React from 'react';

interface ThulirLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const ThulirLogo: React.FC<ThulirLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconSizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Original Vector Emblem: Sprouting Leaf + Heart Contour + Medical Cross */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizeMap[size]}`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Subtle glowing background circle */}
          <rect width="48" height="48" rx="14" fill="#0D9488" fillOpacity="0.1" />

          {/* Growing Leaf Body wrapping into Heart curve */}
          <path
            d="M24 6C24 6 12 12 12 24C12 32.8 19 39 24 42C29 39 36 32.8 36 24C36 14 26 7 24 6Z"
            fill="url(#thulirGradient)"
          />

          {/* Heart Inner Arch / Sprout vein */}
          <path
            d="M24 13C21 16 17 20 17 24.5C17 28.5 20.2 31.5 24 34.5C27.8 31.5 31 28.5 31 24.5C31 20 27 16 24 13Z"
            fill="white"
            fillOpacity="0.25"
          />

          {/* Central Medical Cross Symbol in pure crisp white */}
          <path
            d="M22 20H26V23H29V27H26V30H22V27H19V23H22V20Z"
            fill="white"
            stroke="#042F2E"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />

          {/* Sprouting Young Leaf Tendril (Thulir symbol) */}
          <path
            d="M24 6C26 10 31 11 34 10C34 13 30 16 26 16"
            stroke="#6EE7B7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="thulirGradient" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" />
              <stop offset="0.5" stopColor="#0D9488" />
              <stop offset="1" stopColor="#0F766E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-slate-900 ${titleSizeMap[size]}`}>
            THULIR
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mb-2"></span>
        </div>
        {showTagline && (
          <span className="text-xs font-medium text-emerald-800 tracking-wide">
            Connected Care. Made Simple.
          </span>
        )}
      </div>
    </div>
  );
};
