"use client";

import clsx from "clsx";
import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { type ReactNode, useRef } from "react";
import { STARS } from "./scene";

/** One stretch of sky, top to bottom, faded in over the one below it. */
function SkyLayer({ className, opacity }: { className: string; opacity?: MotionValue<number> }) {
  return <motion.div style={{ opacity }} className={clsx("absolute inset-0 bg-linear-to-b", className)} />;
}

/**
 * The homepage below the hero: one sky pinned behind the page turns from morning to night as it
 * scrolls, the sun crossing it and the dinosaur trotting along the hills, while the hours scroll over it.
 */
export function DayJourney({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: day } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const noon = useTransform(day, [0.12, 0.3], [0, 1]);
  const dusk = useTransform(day, [0.38, 0.55], [0, 1]);
  const night = useTransform(day, [0.58, 0.72], [0, 1]);
  const shade = useTransform(day, [0.4, 0.72], [0, 0.6]);
  const sunX = useTransform(day, [0, 0.62], reduce ? ["70vw", "70vw"] : ["-6vw", "92vw"]);
  const sunY = useTransform(day, (v) => {
    const t = Math.min(v / 0.62, 1) * 2 - 1;

    return reduce ? "0vh" : `${(t * t - 1) * 5}vh`;
  });
  const sunOpacity = useTransform(day, [0.5, 0.62], [1, 0]);
  const hillsX = useTransform(day, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-33%"]);
  const dinoX = useTransform(day, [0, 1], reduce ? ["12vw", "12vw"] : ["-14vw", "96vw"]);

  return (
    <section ref={ref} aria-label={label} className="relative isolate">
      <div aria-hidden className="-mb-[100svh] pointer-events-none sticky top-0 z-0 h-svh overflow-hidden">
        <SkyLayer className="from-day-morning-top to-day-morning-bottom dark:from-day-dim-morning-top dark:to-day-dim-morning-bottom" />
        <SkyLayer opacity={noon} className="from-day-noon-top to-day-noon-bottom dark:from-day-dim-noon-top dark:to-day-dim-noon-bottom" />
        <SkyLayer opacity={dusk} className="from-day-dusk-top to-day-dusk-bottom dark:from-day-dim-dusk-top dark:to-day-dim-dusk-bottom" />
        <SkyLayer opacity={night} className="from-day-night-top to-day-night-bottom" />

        <motion.div style={{ opacity: night }} className="absolute inset-0">
          {STARS.map(([left, top, delay]) => (
            <span
              key={`${left}-${top}`}
              style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }}
              className="absolute size-1 animate-[twinkle_4s_ease-in-out_infinite] rounded-full bg-white/80 motion-reduce:animate-none"
            />
          ))}
          <img src="/home/scene/moon.svg" alt="" width={84} height={88} className="absolute top-[9%] right-[12%] max-sm:w-14" />
        </motion.div>

        <motion.img
          src="/home/scene/sun.svg"
          alt=""
          width={120}
          height={120}
          style={{ x: sunX, y: sunY, opacity: sunOpacity }}
          className="absolute top-[11%] left-0 w-24 max-sm:w-16"
        />

        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40">
          <motion.div style={{ x: hillsX }} className="absolute bottom-8 left-0 flex h-24 sm:h-32">
            {[0, 1, 2].map((copy) => (
              <img
                key={copy}
                src="/home/scene/hills-tile.svg"
                alt=""
                width={1998}
                height={273}
                className="h-full w-auto max-w-none dark:brightness-[.34] dark:saturate-[1.6]"
              />
            ))}
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 h-9 bg-yee-grass dark:bg-day-grass-dim" />
          <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-day-night-top" />
          <motion.div style={{ x: dinoX }} className="absolute bottom-6 left-0 w-28 sm:w-36">
            <img
              src="/brand/yeecord/poses/run.png"
              alt=""
              width={1024}
              height={920}
              className="h-auto w-full animate-[trot_.5s_ease-in-out_infinite] motion-reduce:animate-none"
            />
          </motion.div>
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}

type Tone = "light" | "dark";

const tones: Record<Tone, { heading: string; body: string; time: string }> = {
  light: {
    heading: "text-day-ink dark:text-white",
    body: "text-day-ink/75 dark:text-white/75",
    time: "text-day-time-light dark:text-day-time-dark",
  },
  dark: { heading: "text-white", body: "text-white/75", time: "text-day-time-dark" },
};

/** One hour of the day: its time, what the dinosaur does then, and the channel where it happens. */
export function Station({
  time,
  title,
  sentence,
  tone,
  side,
  children,
}: {
  time: string;
  title: ReactNode;
  sentence: ReactNode;
  tone: Tone;
  side: "left" | "right";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const tilt = side === "right" ? 5 : -5;
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 140, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : tilt, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.9, 1]);
  const look = tones[tone];

  return (
    <div className="mx-auto grid min-h-svh w-full max-w-[1100px] items-center gap-10 px-4 pt-24 pb-56 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14 md:px-6">
      <div className={clsx("flex min-w-0 flex-col gap-4", side === "left" && "md:order-2")}>
        <p className={clsx("font-bold text-6xl tabular-nums tracking-tight sm:text-8xl", look.time)}>{time}</p>
        <h2 className={clsx("text-balance font-bold text-3xl tracking-tight [overflow-wrap:break-word] sm:text-5xl", look.heading)}>
          {title}
        </h2>
        <p className={clsx("max-w-md text-pretty text-lg sm:text-xl", look.body)}>{sentence}</p>
      </div>
      <motion.div ref={ref} style={{ y, rotate, scale }} className="min-w-0">
        {children}
      </motion.div>
    </div>
  );
}
