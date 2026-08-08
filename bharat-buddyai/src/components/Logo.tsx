export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <BuddyMark className="h-9 w-9" />
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight">
          Bharat Buddy <span className="gradient-text">AI</span>
        </span>
      </div>
    </div>
  );
}

/**
 * Custom mark: Ashoka-chakra-inspired ring (24 spokes) wrapped around
 * a neural-network spark — saffron→indigo gradient.
 */
export function BuddyMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="bbg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="oklch(0.68 0.19 45)" />
          <stop offset="100%" stopColor="oklch(0.55 0.18 280)" />
        </linearGradient>
      </defs>
      {/* Outer chakra ring */}
      <circle cx="24" cy="24" r="21" stroke="url(#bbg)" strokeWidth="2.2" />
      {/* 24 spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 360) / 24;
        return (
          <line
            key={i}
            x1="24"
            y1="6"
            x2="24"
            y2="10"
            stroke="url(#bbg)"
            strokeWidth="1.6"
            strokeLinecap="round"
            transform={`rotate(${a} 24 24)`}
            opacity="0.85"
          />
        );
      })}
      {/* Inner neural node + connectors */}
      <circle cx="24" cy="24" r="6.5" fill="url(#bbg)" />
      <circle cx="24" cy="24" r="2.4" fill="white" />
      <circle cx="14" cy="14" r="1.6" fill="url(#bbg)" />
      <circle cx="34" cy="14" r="1.6" fill="url(#bbg)" />
      <circle cx="14" cy="34" r="1.6" fill="url(#bbg)" />
      <circle cx="34" cy="34" r="1.6" fill="url(#bbg)" />
      <line x1="14" y1="14" x2="20" y2="20" stroke="url(#bbg)" strokeWidth="1.2" />
      <line x1="34" y1="14" x2="28" y2="20" stroke="url(#bbg)" strokeWidth="1.2" />
      <line x1="14" y1="34" x2="20" y2="28" stroke="url(#bbg)" strokeWidth="1.2" />
      <line x1="34" y1="34" x2="28" y2="28" stroke="url(#bbg)" strokeWidth="1.2" />
    </svg>
  );
}
