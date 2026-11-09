"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

const BULBS = ["#e3c877", "#f4ead0", "#d8623f", "#e3c877", "#7fb8a8"];
const BULB_COUNT = 23;

/** 兩段電線各自下垂，燈泡沿著線排 */
function sag(t: number): number {
  const local = (t * 2) % 1;

  return 14 + Math.sin(local * Math.PI) * 44;
}

export function Sky() {
  const pointer = useMotionValue(0);
  const drift = useSpring(pointer, { stiffness: 40, damping: 16 });
  const far = useTransform(drift, [-1, 1], [10, -10]);
  const near = useTransform(drift, [-1, 1], [22, -22]);

  useEffect(() => {
    function follow(event: PointerEvent) {
      pointer.set((event.clientX / window.innerWidth) * 2 - 1);
    }

    window.addEventListener("pointermove", follow, { passive: true });

    return () => window.removeEventListener("pointermove", follow);
  }, [pointer]);

  return (
    <div aria-hidden>
      <motion.div className="night-stars" style={{ x: far }} />
      <motion.div className="night-moon" style={{ x: near }} />
      <div className="night-glow" />
      <svg
        className="night-lights"
        viewBox="0 0 1000 90"
        preserveAspectRatio="none"
      >
        <path
          d="M0 14 Q250 102 500 14 Q750 102 1000 14"
          fill="none"
          stroke="#0d0c1c"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {Array.from({ length: BULB_COUNT }, (_, index) => {
          const t = (index + 0.5) / BULB_COUNT;
          const color = BULBS[index % BULBS.length];

          return (
            <circle
              key={t}
              cx={t * 1000}
              cy={sag(t) + 5}
              r="5"
              fill={color}
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
          );
        })}
      </svg>
      <div className="night-street" />
    </div>
  );
}
