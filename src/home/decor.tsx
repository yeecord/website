import clsx from "clsx";

export type DecoName =
  | "seedling"
  | "herb"
  | "blossom"
  | "sparkles"
  | "star"
  | "mushroom";

export function Deco({
  name,
  className,
  size = 20,
  delay = 0,
  twinkle,
}: {
  name: DecoName;
  className?: string;
  size?: number;
  delay?: number;
  twinkle?: boolean;
}) {
  return (
    <img
      src={`/home/twemoji/${name}.svg`}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={clsx(
        "absolute select-none",
        twinkle &&
          "animate-[twinkle_3s_ease-in-out_infinite] motion-reduce:animate-none",
        className,
      )}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    />
  );
}

export function PixelDino({
  className,
  size = 96,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      className={clsx(
        "absolute bg-primary/40 [mask-image:url(/home/dino.svg)] [mask-repeat:no-repeat] [mask-size:contain]",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
