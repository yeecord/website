import { INGREDIENTS, type Origin, SPRITE_PALETTE, SPRITES } from "./content";

export const SURPRISE_SPRITE = INGREDIENTS.length;

export function Sprite({ index, size = 32 }: { index: number; size?: number }) {
  const rows = SPRITES[index] ?? [];

  return (
    <svg
      viewBox={`0 0 7 ${rows.length}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        [...row].map((pixel, x) =>
          SPRITE_PALETTE[pixel] ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={SPRITE_PALETTE[pixel]}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

export function Wok() {
  return (
    <svg viewBox="0 0 150 64" width="100%" height="100%" aria-hidden>
      <rect x="38" y="46" width="74" height="18" rx="4" fill="#33291b" />
      <rect x="48" y="52" width="54" height="5" rx="2.5" fill="#6b5d44" />
      <path
        d="M8 6 H142 C138 34 112 48 75 48 C38 48 12 34 8 6 Z"
        fill="#3d3a36"
        stroke="#1c1712"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M22 14 C30 30 50 39 75 39"
        fill="none"
        stroke="#6f6a62"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="-2" y="2" width="18" height="8" rx="4" fill="#1c1712" />
      <rect x="134" y="2" width="18" height="8" rx="4" fill="#1c1712" />
    </svg>
  );
}

export function Flame() {
  return (
    <svg viewBox="0 0 60 40" width="60" height="40" aria-hidden>
      <path
        d="M30 2 C40 14 54 18 50 32 C48 38 40 40 30 40 C20 40 12 38 10 32 C6 18 20 14 30 2 Z"
        fill="#ab4329"
      />
      <path
        d="M30 14 C36 22 44 24 42 32 C41 37 36 39 30 39 C24 39 19 37 18 32 C16 24 24 22 30 14 Z"
        fill="#cc9a33"
      />
      <path
        d="M30 25 C33 29 36 30 35 34 C34 37 32 38 30 38 C28 38 26 37 25 34 C24 30 27 29 30 25 Z"
        fill="#f4ead0"
      />
    </svg>
  );
}

export function Bag() {
  return (
    <svg viewBox="0 0 44 48" width="44" height="48" aria-hidden>
      <path
        d="M8 14 H36 L40 44 H4 Z"
        fill="#d8c9a2"
        stroke="#33291b"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M14 14 C14 4 30 4 30 14"
        fill="none"
        stroke="#33291b"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="15" y="24" width="14" height="10" rx="2" fill="#ab4329" />
    </svg>
  );
}

export function Plate() {
  return (
    <svg viewBox="0 0 150 44" width="150" height="44" aria-hidden>
      <ellipse cx="75" cy="30" rx="60" ry="9" fill="#00000033" />
      <ellipse
        cx="75"
        cy="22"
        rx="70"
        ry="18"
        fill="#f4ead0"
        stroke="#33291b"
        strokeWidth="3"
      />
      <ellipse
        cx="75"
        cy="20"
        rx="48"
        ry="10"
        fill="#efe6cd"
        stroke="#2e5e55"
        strokeWidth="2"
      />
    </svg>
  );
}

const POSTCARDS: Record<Origin, React.ReactNode> = {
  market: (
    <>
      <rect width="260" height="110" fill="#3b2a55" />
      <circle cx="214" cy="26" r="12" fill="#f4ead0" />
      {[10, 96, 182].map((x, i) => (
        <g key={x} transform={`translate(${x} ${i === 1 ? 34 : 42})`}>
          <rect y="16" width="72" height="60" fill="#553a20" />
          <path
            d="M-6 16 L6 0 H66 L78 16 Z"
            fill={i === 1 ? "#cc9a33" : "#ab4329"}
          />
          <rect x="10" y="30" width="52" height="22" rx="3" fill="#e3c877" />
          <circle cx="8" cy="22" r="4" fill="#f4ead0" />
          <circle cx="64" cy="22" r="4" fill="#f4ead0" />
        </g>
      ))}
    </>
  ),
  coast: (
    <>
      <rect width="260" height="110" fill="#2a3a5e" />
      <circle cx="200" cy="34" r="18" fill="#e3c877" />
      <path d="M40 62 L62 40 V62 Z" fill="#f4ead0" />
      <path d="M30 64 H84 L74 76 H38 Z" fill="#ab4329" />
      <path
        d="M0 76 Q16 66 32 76 T64 76 T96 76 T128 76 T160 76 T192 76 T224 76 T260 76 V110 H0 Z"
        fill="#2e5e55"
      />
      <path
        d="M0 90 Q16 80 32 90 T64 90 T96 90 T128 90 T160 90 T192 90 T224 90 T260 90 V110 H0 Z"
        fill="#3f7f73"
      />
    </>
  ),
  mountain: (
    <>
      <rect width="260" height="110" fill="#30405a" />
      <circle cx="52" cy="26" r="11" fill="#f4ead0" />
      <path d="M0 96 L70 28 L120 80 L176 18 L260 96 Z" fill="#2e5e55" />
      <path d="M176 18 L160 36 L176 32 L190 38 Z" fill="#f4ead0" />
      <path d="M70 28 L58 42 L70 39 L80 45 Z" fill="#f4ead0" />
      {[24, 108, 214].map((x) => (
        <path
          key={x}
          d={`M${x} 98 l12 -34 l12 34 Z M${x + 3} 82 l9 -26 l9 26 Z`}
          fill="#436a37"
        />
      ))}
    </>
  ),
};

export function Postcard({ origin }: { origin: Origin }) {
  return (
    <svg
      viewBox="0 0 260 110"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {POSTCARDS[origin]}
      <rect y="96" width="260" height="14" fill="#241d2b" />
    </svg>
  );
}
