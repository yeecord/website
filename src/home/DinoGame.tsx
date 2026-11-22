"use client";

import NumberFlow from "@number-flow/react";
import { type Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { Locale } from "~/i18n";
import { translator } from "~/i18n/translate";
import { cn } from "~/utils/cn";
import { DinoMascot } from "./DinoMascot";
import { type PlantKind, plantDim, plantWidth } from "./scene";

const SPRITES: { kind: PlantKind; height: number }[] = [
  { kind: "bush", height: 40 },
  { kind: "flowers", height: 44 },
  { kind: "sapling", height: 56 },
];

const GRAVITY = 2000;
const JUMP_VELOCITY = 620;
/* 提早放開時把上升速度砍到這個值：仍足以越過最高的障礙物 (56px) */
const SHORT_JUMP_VELOCITY = 490;
const MAX_SPEED = 520;
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
  shown: number;
};

export function DinoGame({ locale, alt }: { locale: Locale; alt: string }) {
  const t = translator(locale);
  const [mode, setMode] = useState<Mode>("idle");
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [best, setBest] = useState(0);

  const fieldRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<ScoreHandle>(null);
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
    current.speed = Math.min(MAX_SPEED, current.speed + dt * 5);
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
    const hitboxLeft = dinoRect.left - fieldLeft + dinoRect.width * 0.4;
    const hitboxRight = dinoRect.left - fieldLeft + dinoRect.width * 0.72;

    current.spawnIn -= dt;
    if (current.spawnIn <= 0) {
      const id = current.nextId++;
      const sprite = Math.floor(Math.random() * SPRITES.length);

      current.items.push({ id, sprite, x: 0 });
      current.spawnIn = 1.3 + Math.random() * 1.1;
      setObstacles((list) => [...list, { id, sprite }]);
    }

    let gone = false;

    for (const item of current.items) {
      const { kind, height } = SPRITES[item.sprite];
      const width = plantWidth(kind, height);

      item.x += current.speed * dt;

      const el = obstacleEls.current.get(item.id);

      if (el) el.style.transform = `translateX(${item.x}px)`;

      const hit =
        item.x - width * 0.25 > hitboxLeft &&
        item.x - width * 0.75 < hitboxRight &&
        current.y < height - 18;

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
            const { kind, height } = SPRITES[item.sprite];

            return item.x <= current.fieldWidth + plantWidth(kind, height);
          })
          .map((item) => item.id),
      );

      current.items = current.items.filter((item) => alive.has(item.id));
      setObstacles((list) => list.filter((o) => alive.has(o.id)));
    }

    const shown = Math.floor(current.score);

    if (shown !== current.shown) {
      current.shown = shown;
      scoreRef.current?.set(shown);
    }

    current.raf = requestAnimationFrame(frame);
  }

  function start() {
    const field = fieldRef.current;

    /* 點恐龍或按鈕開始後焦點會留在按鈕上，空白鍵跳躍時會冒出外框，還會再按一次它 */
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

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
      speed: 250,
      score: 0,
      shown: 0,
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

  const inGame = mode !== "idle";

  /* hero 是伺服器元件，遊戲開始時從這裡把它的文案收起來 */
  useEffect(() => {
    const hero = fieldRef.current?.closest("[data-hero]");

    hero?.toggleAttribute("data-game", inGame);
    for (const copy of hero?.querySelectorAll("[data-hero-copy]") ?? []) {
      copy.toggleAttribute("inert", inGame);
    }
  }, [inGame]);

  const bestScore = (
    <span className="text-muted-foreground tabular-nums">
      {t("最高分")} {best}
    </span>
  );

  return (
    <>
      {inGame && (
        <div className="pointer-events-none absolute inset-x-0 top-16 z-1 flex flex-col items-center gap-2 sm:top-20 md:top-28">
          {mode === "playing" ? (
            <>
              <LiveScore
                ref={scoreRef}
                className={cn(ENTER, "font-bold text-7xl sm:text-8xl")}
              />
              {best > 0 && bestScore}
              <span className="animate-[hint-fade_3s_ease_forwards] text-muted-foreground text-sm">
                {t("空白鍵或點擊跳躍")}
              </span>
            </>
          ) : (
            <>
              <span className="text-muted-foreground">{t("得分")}</span>
              <CountUp
                value={finalScore}
                className="font-bold text-7xl sm:text-8xl"
              />
              <div className={cn(ENTER, "delay-300")}>{bestScore}</div>
              <div className={cn(ENTER, "pointer-events-auto mt-4 flex gap-3 delay-500")}>
                <button type="button" onClick={start} className="btn-chunky">
                  {t("再來一次")}
                </button>
                <button
                  type="button"
                  onClick={quit}
                  className="btn-chunky-secondary"
                >
                  {t("離開")}
                </button>
              </div>
            </>
          )}
        </div>
      )}
      <div
        ref={fieldRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-1"
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
              src={`/home/scene/${sprite.kind}.svg`}
              alt=""
              draggable={false}
              style={{
                height: sprite.height,
                left: -plantWidth(sprite.kind, sprite.height),
              }}
              className={cn(
                "absolute bottom-0 select-none drop-shadow-[0_3px_2px_rgb(0_0_0/0.25)] transition-opacity duration-200 will-change-transform",
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
            <DinoMascot
              alt={alt}
              label={t("來玩一場")}
              playing={inGame}
              dead={mode === "over"}
              running={mode === "playing"}
              onPress={start}
            />
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

type ScoreHandle = { set: (value: number) => void };

const SPIN = { duration: 260, easing: "cubic-bezier(0.23, 1, 0.32, 1)" };

const ENTER =
  "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:animate-none";

/* 分數一秒變十次，自己持有 state，才不會每次都重新渲染整個遊戲 */
function LiveScore({ ref, className }: { ref: Ref<ScoreHandle>; className: string }) {
  const [value, setValue] = useState(0);

  useImperativeHandle(ref, () => ({ set: setValue }), []);

  return (
    <NumberFlow value={value} className={className} transformTiming={SPIN} spinTiming={SPIN} />
  );
}

/* 結束時從 0 滾到最終分數 */
function CountUp({ value, className }: { value: number; className: string }) {
  const [shown, setShown] = useState(0);

  useEffect(() => setShown(value), [value]);

  return (
    <NumberFlow
      value={shown}
      className={className}
      spinTiming={{ ...SPIN, duration: 900 }}
    />
  );
}
