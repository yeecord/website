"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MascotPlayer, type View } from "./mascot/player";
import { rig } from "./mascot/rig";

/* 留出跳起來和伸長脖子的空間，腳踩在畫布底邊 */
const VIEW: View = { x: 48, y: 30, width: 452, height: 434 };

export function DinoMascot({
  alt,
  label,
  className,
  playing,
  dead,
  onPress,
}: {
  alt: string;
  label: string;
  className?: string;
  playing?: boolean;
  dead?: boolean;
  onPress: () => void;
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
    };
  }, []);

  useEffect(() => {
    playerRef.current?.setFace(dead ? "dead" : "normal");
  }, [dead]);

  function yell() {
    const id = Date.now();

    playerRef.current?.fire("stretch");
    onPress();
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
          {/* 角色畫成面向右，翻過來迎向從左邊來的植物 */}
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={alt}
            width={VIEW.width}
            height={VIEW.height}
            className={
              playing
                ? "-scale-x-100 h-24 w-auto drop-shadow-lg transition-[height] duration-300 ease-out motion-reduce:transition-none sm:h-32 lg:h-40"
                : "-scale-x-100 h-36 w-auto drop-shadow-lg transition-[height] duration-300 ease-out motion-reduce:transition-none sm:h-60 lg:h-72"
            }
          />
        </button>
      </div>
    </div>
  );
}
