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
/* 提早放開時把上升速度砍到這個值：仍足以越過最高的障礙物 (56px) */
const SHORT_JUMP_VELOCITY = 490;
const JUMP_BUFFER = 0.12;
const BEST_KEY = "dino-best";

type Mode = "idle" | "playing" | "over";
type Obstacle = { id: number; sprite: number };

type Sim = {
  raf: number;
  last: number;
  y: number;
  vy: number;
  buffered: number;
  jumps: number;
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
  const [best, setBest] = useState(0);

  const fieldRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const obstacleEls = useRef(new Map<number, HTMLImageElement>());
  const sim = useRef<Sim | null>(null);

  useEffect(() => {
    setBest(Number(localStorage.getItem(BEST_KEY)) || 0);
  }, []);

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
    const score = Math.floor(sim.current?.score ?? 0);

    stopLoop();
    setFinalScore(score);
    if (score > best) {
      setBest(score);
      localStorage.setItem(BEST_KEY, String(score));
    }
    setMode("over");
  }

  function jump() {
    const current = sim.current;

    if (!current) return;
    if (current.y === 0) {
      current.vy = JUMP_VELOCITY;
      current.jumps = 1;
    } else if (current.jumps < 2) {
      current.vy = JUMP_VELOCITY * 0.92;
      current.jumps = 2;
    } else {
      current.buffered = JUMP_BUFFER;
    }
  }

  function endJump() {
    const current = sim.current;

    if (current && current.vy > SHORT_JUMP_VELOCITY)
      current.vy = SHORT_JUMP_VELOCITY;
  }

  function frame(now: number) {
    const current = sim.current;
    const field = fieldRef.current;
    const dino = dinoRef.current;

    if (!current || !field || !dino) return;

    const dt = Math.min((now - current.last) / 1000, 0.04);

    current.last = now;
    current.speed += dt * 7;
    current.score += dt * 10;
    current.buffered -= dt;

    if (current.y > 0 || current.vy > 0) {
      current.vy -= GRAVITY * dt;
      current.y = Math.max(0, current.y + current.vy * dt);
      if (current.y === 0) {
        current.vy = 0;
        current.jumps = 0;
        if (current.buffered > 0) {
          current.vy = JUMP_VELOCITY;
          current.jumps = 1;
          current.buffered = 0;
        }
      }
    }
    dino.style.transform = `translateY(${-current.y}px)`;

    /* 每幀重量:開場縮小動畫進行中也拿得到正確的碰撞框。
       translateY 不影響 left/width,跳躍中量也安全 */
    const fieldLeft = field.getBoundingClientRect().left;
    const dinoRect = dino.getBoundingClientRect();
    const hitboxLeft = dinoRect.left - fieldLeft + dinoRect.width * 0.35;
    const hitboxRight = dinoRect.left - fieldLeft + dinoRect.width * 0.75;

    current.spawnIn -= dt;
    if (current.spawnIn <= 0) {
      const id = current.nextId++;
      const sprite = Math.floor(Math.random() * SPRITES.length);

      current.items.push({ id, sprite, x: 0 });
      current.spawnIn = 1.0 + Math.random() * 1.15;
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
        item.x - width * 0.25 > hitboxLeft &&
        item.x - width * 0.75 < hitboxRight &&
        current.y < height - 10;

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

    sim.current = {
      raf: 0,
      last: performance.now(),
      y: 0,
      vy: 0,
      buffered: 0,
      jumps: 0,
      fieldWidth: field.getBoundingClientRect().width,
      items: [],
      nextId: 1,
      spawnIn: 1.4,
      speed: 300,
      score: 0,
    };
    setObstacles([]);
    setMode("playing");
    sim.current.raf = requestAnimationFrame(frame);
  }

  useEffect(() => {
    if (mode === "idle") return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        if (event.repeat) return;
        if (mode === "playing") jump();
        else start();
      } else if (event.key === "Escape") {
        quit();
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.code === "Space" || event.code === "ArrowUp") endJump();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  });

  /* 玩到一半捲出畫面就結束，不然全頁的跳躍層會一直吃掉點擊 */
  useEffect(() => {
    const field = fieldRef.current;

    if (mode !== "playing" || !field) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) quit();
    });

    observer.observe(field);

    return () => observer.disconnect();
  }, [mode]);

  useEffect(() => stopLoop, []);

  const scorePill =
    "flex items-baseline gap-2 rounded-full border bg-fd-background/80 px-3 py-1 font-bold font-mono text-sm shadow-sm backdrop-blur animate-in fade-in slide-in-from-bottom-1 duration-200 ease-out motion-reduce:animate-none";

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
                "absolute bottom-0 select-none transition-opacity duration-200 will-change-transform",
                plantDim,
                mode === "over" && "opacity-60",
              )}
            />
          );
        })}
        <div className="pointer-events-auto absolute right-[5%] bottom-0 sm:right-[12%]">
          <div
            ref={dinoRef}
            className={cn(
              "will-change-transform",
              mode === "over" && "animate-[dino-hit_.45s_ease]",
            )}
          >
            <DinoMascot alt={alt} playing={mode === "playing"} />
          </div>
          <div className="-translate-x-1/2 absolute bottom-full left-1/2 mb-2 flex flex-col items-center gap-1.5 whitespace-nowrap">
            {mode === "playing" ? (
              <>
                <span className={scorePill}>
                  <span ref={scoreRef}>0</span>
                  {best > 0 && (
                    <span className="font-medium text-muted-foreground text-xs">
                      HI {best}
                    </span>
                  )}
                </span>
                <span className="animate-[hint-fade_3s_ease_forwards] text-muted-foreground text-xs">
                  {t("空白鍵或點擊跳躍")}
                </span>
              </>
            ) : (
              <>
                {mode === "over" && (
                  <span className={scorePill}>
                    <span>
                      {t("得分")} {finalScore}
                    </span>
                    <span className="font-medium text-muted-foreground text-xs">
                      HI {best}
                    </span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={start}
                  className="animate-in fade-in slide-in-from-bottom-1 rounded-full border bg-fd-background/80 px-3 py-1 font-medium text-sm shadow-sm backdrop-blur transition-[background-color,transform] duration-150 ease-out hover:bg-fd-background active:scale-[.97] motion-reduce:animate-none"
                >
                  {mode === "idle" ? t("來玩一場") : t("再來一次")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {mode === "playing" && (
        <button
          type="button"
          aria-label={t("跳")}
          onPointerDown={jump}
          onPointerUp={endJump}
          className="fixed inset-0 z-40 cursor-pointer"
        />
      )}
    </>
  );
}
