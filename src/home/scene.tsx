import clsx from "clsx";

/* 素材由 Gemini 照機器龍的畫風生成，描成 SVG；深色模式整體壓暗 */
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
        "absolute animate-[drift_18s_ease-in-out_infinite] select-none motion-reduce:animate-none dark:opacity-15",
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
      {children}
    </div>
  );
}

export function HillsLayer({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      className={clsx("absolute inset-x-0 bottom-0 w-full", className)}
    >
      <path
        className="fill-[#D7F2DE] dark:fill-[#15251C]"
        d="M0 160V72C110 34 230 30 360 64S610 22 770 58 1050 20 1210 56 1380 44 1440 58V160Z"
      />
      <path
        className="fill-[#BDE9C7] dark:fill-[#1A2E21]"
        d="M0 160V112C150 82 270 80 410 106S700 70 860 100 1130 74 1290 100 1410 94 1440 102V160Z"
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
