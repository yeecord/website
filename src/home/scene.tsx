import clsx from "clsx";

/* Kenney 素材是藍色系，hue-rotate 轉成品牌綠；深色模式再壓暗 */
export const sceneTint =
  "[filter:hue-rotate(-85deg)_saturate(.8)] dark:[filter:hue-rotate(-85deg)_saturate(.6)_brightness(.45)]";

export const plantDim = "dark:brightness-[.65] dark:saturate-[.8]";

export function Cloud({
  n,
  className,
  width,
}: {
  n: 1 | 2 | 3;
  className?: string;
  width: number;
}) {
  return (
    <img
      src={`/home/scene/cloud${n}.png`}
      alt=""
      width={width}
      height={width * 0.6}
      draggable={false}
      className={clsx(
        "absolute animate-[drift_18s_ease-in-out_infinite] select-none object-contain motion-reduce:animate-none dark:opacity-25",
        className,
      )}
    />
  );
}

export function Plant({
  src,
  className,
  height,
}: {
  src: string;
  className?: string;
  height: number;
}) {
  return (
    <img
      src={`/home/scene/${src}.png`}
      alt=""
      height={height}
      draggable={false}
      className={clsx(
        "absolute origin-bottom animate-[sway_5.5s_ease-in-out_infinite] select-none motion-reduce:animate-none",
        plantDim,
        className,
      )}
      style={{ height, width: "auto" }}
    />
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
    <div>
      <div className={clsx("relative", className)}>
        <div
          className={clsx(
            "absolute inset-0 bg-[url(/home/scene/groundLayer1.png)] bg-repeat-x",
            "[background-size:auto_200%] [background-position:top_left]",
            sceneTint,
          )}
        />
        <div className="relative">{children}</div>
      </div>
      <div
        aria-hidden
        className={clsx(
          "-scale-y-100 -mt-px h-14 bg-[url(/home/scene/groundLayer1.png)] bg-repeat-x",
          "[background-size:auto_400px] [background-position:top_left]",
          sceneTint,
        )}
      />
    </div>
  );
}

export function HillsLayer({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "absolute inset-x-0 bg-[url(/home/scene/hills.png)] bg-repeat-x opacity-60",
        "[background-size:auto_100%] [background-position:top_left]",
        sceneTint,
        className,
      )}
    />
  );
}
