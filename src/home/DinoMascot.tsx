"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MascotPlayer, type View } from "./mascot/player";
import { rig } from "./mascot/rig";

/* 留出跳起來、伸長脖子和蹲下往前伸頭的空間，腳踩在畫布底邊 */
export const VIEW: View = { x: 48, y: 30, width: 500, height: 434 };

export function DinoMascot({
  alt,
  label,
  className,
  playing,
  dead = false,
  running = false,
  onPress,
  onPlayer,
}: {
  alt: string;
  label: string;
  className?: string;
  playing?: boolean;
  dead?: boolean;
  running?: boolean;
  onPress?: () => void;
  onPlayer?: (player: MascotPlayer | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<MascotPlayer>(null);
  const [yells, setYells] = useState<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const player = new MascotPlayer(canvas, rig, VIEW);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    playerRef.current = player;
    onPlayer?.(player);

    const update = () => {
      if (visible && !reduced.matches) {
        player.start();
      } else {
        player.stop();
        player.still();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      update();
    });

    observer.observe(canvas);
    reduced.addEventListener("change", update);
    player.still();

    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", update);
      player.destroy();
      playerRef.current = null;
      onPlayer?.(null);
    };
  }, []);

  useEffect(() => {
    playerRef.current?.setFace(dead ? "dead" : "normal");
  }, [dead]);

  useEffect(() => {
    playerRef.current?.setRunning(running);
  }, [running]);

  function yell() {
    const id = Date.now();

    onPress?.();
    setYells((prev) => [...prev.slice(-3), id]);
    setTimeout(() => {
      setYells((prev) => prev.filter((y) => y !== id));
    }, 900);
  }

  return (
    <div className={className}>
      <div className="relative">
        <AnimatePresence>
          {yells.map((id, i) => (
            <motion.span
              key={id}
              initial={{ opacity: 0, y: 8, scale: 0.6 }}
              animate={{ opacity: 1, y: -28, scale: 1, rotate: i % 2 ? 8 : -8 }}
              exit={{ opacity: 0, y: -48 }}
              transition={{ duration: 0.5 }}
              className="-top-4 absolute left-1/4 select-none rounded-full bg-primary px-3 py-1 font-bold text-primary-foreground text-sm shadow-md"
            >
              Yee!
            </motion.span>
          ))}
        </AnimatePresence>
        <button
          type="button"
          aria-label={label}
          onClick={yell}
          disabled={playing}
          className={playing ? "pointer-events-none block" : "block cursor-pointer"}
        >
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={alt}
            width={VIEW.width}
            height={VIEW.height}
            className="h-36 w-auto drop-shadow-lg sm:h-60 lg:h-72"
          />
        </button>
      </div>
    </div>
  );
}
