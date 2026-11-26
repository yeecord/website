"use client";

import { type ReactNode, useRef } from "react";
import { burst } from "./burst";

const SPARKS = [
  { kind: "image", src: "/brand/yeecord/character.svg", size: 30 },
  { kind: "image", src: "/home/scene/star.svg", size: 18 },
] as const;

/** Wraps an action so a few little dinosaurs and stars pop out of it when it is hovered or pressed. */
export function Cheer({ children }: { children: ReactNode }) {
  const last = useRef(0);

  function pop(event: { clientX: number; clientY: number }, count: number) {
    const now = performance.now();

    if (now - last.current < 900) {
      return;
    }

    last.current = now;
    burst(event.clientX, event.clientY, SPARKS, { count, spread: 0.55 });
  }

  return (
    <span
      className="contents"
      onPointerEnter={(event) => pop(event, 6)}
      onPointerDown={(event) => pop(event, 12)}
    >
      {children}
    </span>
  );
}
