import clsx from "clsx";

/* 素材由 Gemini 照機器龍的畫風生成，描成 SVG；深色模式整體壓暗 */
/* 玩遊戲時背景淡下去，讓迎面來的植物看得清楚 */
const dimmed = "transition-opacity duration-300 group-data-game/hero:opacity-40";

export const plantDim = "dark:brightness-[.6] dark:saturate-[.75]";

/* 每個素材的寬高比，取自 SVG 的 viewBox */
const RATIO = {
  bush: 784 / 584,
  flowers: 566 / 448,
  pine: 590 / 838,
  sapling: 301 / 452,
  tree: 574 / 802,
  "cloud-wide": 704 / 342,
  "cloud-small": 659 / 400,
};

export type PlantKind = "bush" | "flowers" | "pine" | "sapling" | "tree";

export function plantWidth(kind: PlantKind, height: number) {
  return Math.round(height * RATIO[kind]);
}

export function Cloud({
  kind,
  className,
  width,
}: {
  kind: "wide" | "small";
  className?: string;
  width: number;
}) {
  return (
    <img
      src={`/home/scene/cloud-${kind}.svg`}
      alt=""
      width={width}
      height={Math.round(width / RATIO[`cloud-${kind}`])}
      draggable={false}
      className={clsx(
        "absolute animate-[cloud-drift_40s_ease-in-out_infinite_alternate] select-none motion-reduce:animate-none dark:opacity-15 dark:group-data-game/hero:opacity-[.06]",
        dimmed,
        className,
      )}
    />
  );
}

export function Plant({
  kind,
  className,
  height,
}: {
  kind: PlantKind;
  className?: string;
  height: number;
}) {
  return (
    <img
      src={`/home/scene/${kind}.svg`}
      alt=""
      width={plantWidth(kind, height)}
      height={height}
      draggable={false}
      className={clsx(
        "absolute origin-bottom animate-[sway_5.5s_ease-in-out_infinite] select-none motion-reduce:animate-none",
        dimmed,
        plantDim,
        className,
      )}
    />
  );
}

/* 天空：恐龍和植物都站在它的底邊上 */
export function Sky({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-linear-to-b from-[#D9E8FF] via-[#E8F1FF] to-[#F2F8FF] dark:from-[#0D1524] dark:via-[#101A26] dark:to-[#13201A]">
      <SkyLights />
      {children}
    </div>
  );
}

/* 淺色模式一顆慢慢呼吸的太陽，深色模式換成月亮和會閃的星星 */
function SkyLights() {
  return (
    <div aria-hidden className={clsx("pointer-events-none absolute inset-0 overflow-hidden", dimmed)}>
      <div className="absolute top-[7%] right-[17%] size-24 animate-[glow_7s_ease-in-out_infinite] rounded-full bg-[#FFE6A1] shadow-[0_0_0_18px_rgb(255_238_186/0.45),0_0_0_42px_rgb(255_244_214/0.3)] motion-reduce:animate-none max-sm:size-16 dark:hidden" />
      <div className="absolute top-[8%] right-[18%] hidden size-16 rounded-full bg-[#E4EAF4] shadow-[0_0_0_14px_rgb(228_234_244/0.06),0_0_0_32px_rgb(228_234_244/0.03)] dark:block" />
      {STARS.map(([left, top, delay]) => (
        <span
          key={`${left}-${top}`}
          style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }}
          className="absolute hidden size-1 animate-[twinkle_4s_ease-in-out_infinite] rounded-full bg-white/80 motion-reduce:animate-none dark:block"
        />
      ))}
    </div>
  );
}

const STARS = [
  [8, 12, 0], [15, 30, -1.2], [24, 8, -2.4], [33, 22, -0.6], [42, 6, -3.1], [58, 10, -1.8],
  [66, 26, -2.9], [74, 6, -0.3], [86, 30, -2.2], [92, 14, -1.1], [50, 40, -3.4], [12, 46, -1.6],
];

export function HillsLayer({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      className={clsx("absolute inset-x-0 bottom-0 w-full overflow-hidden", dimmed, className)}
    >
      {/* 兩層往相反方向慢慢平移，路徑左右多畫一段，移動時不會露出邊緣 */}
      <path
        className="animate-[hill-drift_36s_ease-in-out_infinite_alternate] fill-[#D7F2DE] [--drift:48px] motion-reduce:animate-none dark:fill-[#15251C]"
        d="M-80 160V60C-20 40 40 50 120 58S240 30 360 64 610 22 770 58 1050 20 1210 56 1380 44 1520 60V160Z"
      />
      <path
        className="animate-[hill-drift_28s_ease-in-out_infinite_alternate] fill-[#BDE9C7] [--drift:-36px] motion-reduce:animate-none dark:fill-[#1A2E21]"
        d="M-80 160V104C0 92 80 84 150 92S270 80 410 106 700 70 860 100 1130 74 1290 100 1410 94 1520 104V160Z"
      />
    </svg>
  );
}

export function GroundBand({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("relative bg-[#A8E2B3] dark:bg-[#16291D]", className)}>
      <svg
        aria-hidden
        viewBox="0 0 1440 14"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-3.5 w-full"
      >
        <path
          className="fill-[#7DD08D] dark:fill-[#21402B]"
          d="M0 0H1440V8C1380 14 1320 14 1260 9S1140 3 1080 8 960 14 900 9 780 3 720 8 600 14 540 9 420 3 360 8 240 14 180 9 60 3 0 8Z"
        />
      </svg>
      <div className="relative">{children}</div>
      <svg
        aria-hidden
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-full h-8 w-full"
      >
        <path
          className="fill-[#A8E2B3] dark:fill-[#16291D]"
          d="M0 0H1440V18C1300 34 1160 38 1010 26S720 6 560 18 250 40 0 24Z"
        />
      </svg>
    </div>
  );
}
