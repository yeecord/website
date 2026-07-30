"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "~/i18n";
import { translator } from "~/i18n/translate";
import { cn } from "~/utils/cn";
import { DinoMascot } from "./DinoMascot";
import { plantDim } from "./scene";

const SPRITES = [
  { src: "bush1", height: 40, ratio: 1.4 },
  { src: "bush2", height: 44, ratio: 1.2 },
  { src: "treeSmall_green1", height: 56, ratio: 0.9 },
];

const GRAVITY = 2000;
const JUMP_VELOCITY = 620;

type Mode = "idle" | "playing" | "over";
type Obstacle = { id: number; sprite: number };

type Sim = {
  raf: number;
  last: number;
  y: number;
  vy: number;
  hitboxLeft: number;
  hitboxRight: number;
  fieldWidth: number;
  items: { id: number; sprite: number; x: number }[];
  nextId: number;
  spawnIn: number;
  speed: number;
  score: number;
};

export function DinoGame({ locale, alt }: { locale: Locale; alt: string }) {
  const t = translator(locale);
  const [mode, setMode] = useState<Mode>("idle");
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [finalScore, setFinalScore] = useState(0);

  const fieldRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const obstacleEls = useRef(new Map<number, HTMLImageElement>());
  const sim = useRef<Sim | null>(null);

  function stopLoop() {
    if (sim.current) cancelAnimationFrame(sim.current.raf);
    if (dinoRef.current) dinoRef.current.style.transform = "";
  }

  function quit() {
    stopLoop();
    setObstacles([]);
    setMode("idle");
  }

  function die() {
    const current = sim.current;

    stopLoop();
    setFinalScore(Math.floor(current?.score ?? 0));
    setMode("over");
  }

  function jump() {
    const current = sim.current;

    if (current && current.y === 0) current.vy = JUMP_VELOCITY;
  }

  function frame(now: number) {
    const current = sim.current;
    const field = fieldRef.current;
    const dino = dinoRef.current;

    if (!current || !field || !dino) return;

    const dt = Math.min((now - current.last) / 1000, 0.04);

    current.last = now;
    current.speed += dt * 8;
    current.score += dt * 10;

    if (current.y > 0 || current.vy > 0) {
      current.vy -= GRAVITY * dt;
      current.y = Math.max(0, current.y + current.vy * dt);
      if (current.y === 0) current.vy = 0;
    }
    dino.style.transform = `translateY(${-current.y}px)`;

    current.spawnIn -= dt;
    if (current.spawnIn <= 0) {
      const id = current.nextId++;
      const sprite = Math.floor(Math.random() * SPRITES.length);

      current.items.push({ id, sprite, x: 0 });
      current.spawnIn = 0.9 + Math.random() * 1.1;
      setObstacles((list) => [...list, { id, sprite }]);
    }

    let gone = false;

    for (const item of current.items) {
      const { height, ratio } = SPRITES[item.sprite];
      const width = height * ratio;

      item.x += current.speed * dt;

      const el = obstacleEls.current.get(item.id);

      if (el) el.style.transform = `translateX(${item.x}px)`;

      const hit =
        item.x - width * 0.2 > current.hitboxLeft &&
        item.x - width * 0.8 < current.hitboxRight &&
        current.y < height - 6;

      if (hit) {
        die();
        return;
      }
      if (item.x > current.fieldWidth + width) gone = true;
    }

    if (gone) {
      const alive = new Set(
        current.items
          .filter((item) => {
            const { height, ratio } = SPRITES[item.sprite];

            return item.x <= current.fieldWidth + height * ratio;
          })
          .map((item) => item.id),
      );

      current.items = current.items.filter((item) => alive.has(item.id));
      setObstacles((list) => list.filter((o) => alive.has(o.id)));
    }

    if (scoreRef.current)
      scoreRef.current.textContent = String(Math.floor(current.score));
    current.raf = requestAnimationFrame(frame);
  }

  function start() {
    const field = fieldRef.current;
    const dino = dinoRef.current;

    if (!field || !dino) return;

    const fieldRect = field.getBoundingClientRect();
    const dinoRect = dino.getBoundingClientRect();

    sim.current = {
      raf: 0,
      last: performance.now(),
      y: 0,
      vy: 0,
      hitboxLeft: dinoRect.left - fieldRect.left + dinoRect.width * 0.3,
      hitboxRight: dinoRect.left - fieldRect.left + dinoRect.width * 0.8,
      fieldWidth: fieldRect.width,
      items: [],
      nextId: 1,
      spawnIn: 1.2,
      speed: 320,
      score: 0,
    };
    setObstacles([]);
    setMode("playing");
    sim.current.raf = requestAnimationFrame(frame);
  }

  useEffect(() => {
    if (mode === "idle") return;

    function onKey(event: KeyboardEvent) {
      if (event.code === "Space") {
        event.preventDefault();
        if (mode === "playing") jump();
        else start();
      } else if (event.key === "Escape") {
        quit();
      }
    }

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => stopLoop, []);

  return (
    <>
      <div
        ref={fieldRef}
        className="pointer-events-none absolute inset-x-0 bottom-10 z-1 sm:bottom-12"
      >
        {obstacles.map((obstacle) => {
          const sprite = SPRITES[obstacle.sprite];

          return (
            <img
              key={obstacle.id}
              ref={(el) => {
                if (el) obstacleEls.current.set(obstacle.id, el);
                else obstacleEls.current.delete(obstacle.id);
              }}
              src={`/home/scene/${sprite.src}.png`}
              alt=""
              draggable={false}
              style={{ height: sprite.height, left: -sprite.height * sprite.ratio }}
              className={cn(
                "absolute bottom-0 select-none will-change-transform",
                plantDim,
              )}
            />
          );
        })}
        <div className="pointer-events-auto absolute bottom-0 right-[5%] sm:right-[12%]">
          <div ref={dinoRef} className="will-change-transform">
            <DinoMascot alt={alt} playing={mode === "playing"} />
          </div>
          {mode === "playing" ? (
            <span
              ref={scoreRef}
              className="-top-10 -translate-x-1/2 absolute left-1/2 font-bold font-mono text-muted-foreground text-sm"
            >
              0
            </span>
          ) : (
            <button
              type="button"
              onClick={start}
              className="-top-10 -translate-x-1/2 absolute left-1/2 whitespace-nowrap rounded-full border bg-fd-background/80 px-3 py-1 font-medium text-sm shadow-sm backdrop-blur transition-colors hover:bg-fd-background motion-reduce:hidden"
            >
              {mode === "idle"
                ? t("來玩一場")
                : `${t("得分")} ${finalScore} · ${t("再來一次")}`}
            </button>
          )}
        </div>
      </div>
      {mode === "playing" && (
        <button
          type="button"
          aria-label={t("跳")}
          onPointerDown={jump}
          className="fixed inset-0 z-40 cursor-pointer"
        />
      )}
    </>
  );
}
