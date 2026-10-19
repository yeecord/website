"use client";

import { type ReactNode, useState } from "react";
import { cn } from "~/utils/cn";

/// A `||text||` spoiler: a block of the hidden colour until clicked.
export function Spoiler({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState(false);

  return (
    <span
      role={shown ? undefined : "button"}
      tabIndex={shown ? undefined : 0}
      onClick={() => setShown(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          setShown(true);
        }
      }}
      className={cn(
        "rounded",
        shown
          ? "bg-discord-hairline"
          : "cursor-pointer bg-discord-spoiler select-none hover:bg-discord-spoiler-hover",
      )}
    >
      <span className={shown ? undefined : "opacity-0"}>{children}</span>
    </span>
  );
}

/// A spoilered attachment: blurred behind a SPOILER pill until clicked.
export function SpoilerCover({
  label = "Spoiler",
  hide = "blur",
  className,
  children,
}: {
  label?: string;
  /** A File card hides outright; media and containers blur. */
  hide?: "blur" | "conceal";
  className?: string;
  children: ReactNode;
}) {
  const [shown, setShown] = useState(false);

  if (shown) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-discord-spoiler shadow-[0.5px_0.5px_1px_1px_rgb(0_0_0/0.08)]",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none select-none",
          hide === "blur" ? "blur-[44px]" : "opacity-0",
        )}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => setShown(true)}
        className="group absolute inset-0 flex cursor-pointer items-center justify-center"
      >
        <span className="rounded-[20px] bg-black/60 px-3 py-2 text-[15px] font-semibold tracking-[0.5px] text-[#e3e5e8] uppercase group-hover:bg-black/88 group-hover:text-white">
          {label}
        </span>
      </button>
    </div>
  );
}
