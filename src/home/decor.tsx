import clsx from "clsx";
import { SparkleIcon } from "lucide-react";

export function Star({
  className,
  size = 16,
  delay = 0,
}: {
  className?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <SparkleIcon
      aria-hidden
      size={size}
      strokeWidth={0}
      className={clsx(
        "absolute animate-[twinkle_3s_ease-in-out_infinite] fill-current text-primary/70 motion-reduce:animate-none",
        className,
      )}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

export function GrassTuft({
  className,
  width = 22,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
      viewBox="0 0 16 8"
      width={width}
      height={width / 2}
      aria-hidden
      className={clsx("absolute text-primary/60", className)}
    >
      <path
        fill="currentColor"
        d="M1 8V4h2v4ZM5 8V1h2v7ZM9 8V5h2v3ZM13 8V3h2v5Z"
      />
    </svg>
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
