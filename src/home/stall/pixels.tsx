import { INGREDIENTS, SPRITE_PALETTE, SPRITES } from "./content";

export const SURPRISE_SPRITE = INGREDIENTS.length;

const ART_PALETTE: Record<string, string> = {
  k: "#12101f",
  i: "#3d3a36",
  g: "#6f6a62",
  b: "#8d8470",
  r: "#ab4329",
  y: "#cc9a33",
  c: "#f4ead0",
  p: "#d8c9a2",
  t: "#2e5e55",
  n: "#33291b",
  e: "#5e8c4e",
};

/** 一格一個方塊的點陣圖，寬高照格數乘上 --u 排版 */
export function Bitmap({
  rows,
  palette = ART_PALETTE,
}: {
  rows: string[];
  palette?: Record<string, string>;
}) {
  const columns = Math.max(...rows.map((row) => row.length));

  return (
    <svg
      className="px-bitmap"
      viewBox={`0 0 ${columns} ${rows.length}`}
      style={{ width: `calc(${columns} * var(--u))` }}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        [...row].map((pixel, x) =>
          palette[pixel] ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={palette[pixel]}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

export function Sprite({ index }: { index: number }) {
  return <Bitmap rows={SPRITES[index] ?? []} palette={SPRITE_PALETTE} />;
}

export const WOK = [
  "kk...........................kk",
  "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
  ".kiiiiiiiiiiiiiiiiiiiiiiiiiiik.",
  ".kiigiiiiiiiiiiiiiiiiiiiiiiiik.",
  "..kiigiiiiiiiiiiiiiiiiiiiiiik..",
  "...kiiggiiiiiiiiiiiiiiiiiiik...",
  "....kkiiiiiiiiiiiiiiiiiiikk....",
  "......kkkiiiiiiiiiiiiikkk......",
  ".........kkkkkkkkkkkkk.........",
  "..........nbbbbbbbbbn..........",
  "..........nnnnnnnnnnn..........",
];

export const FLAMES = [
  ["...r...", "..rrr..", ".rryrr.", ".ryyyr.", "rryyyrr", ".ryyyr."],
  ["....r..", "..rr...", ".rryr..", ".ryyrr.", "rryyyrr", ".ryyyr."],
];

export const BAG = [
  "..nnnnn..",
  ".n.....n.",
  "nnnnnnnnn",
  "npppppppn",
  "npprrrppn",
  "npprrrppn",
  "npppppppn",
  "nnnnnnnnn",
];

export const PLATE = [
  "..nnnnnnnnnnnnnnnnnnn..",
  ".nccccccccccccccccccccn.",
  "nccttttttttttttttttttccn",
  ".nccccccccccccccccccccn.",
  "..nnnnnnnnnnnnnnnnnnnn..",
];
