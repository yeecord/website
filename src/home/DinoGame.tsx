"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "~/i18n";
import { translator } from "~/i18n/translate";
import { cn } from "~/utils/cn";
import { DinoMascot } from "./DinoMascot";
import type { MascotPlayer } from "./mascot/player";
import { plantDim } from "./scene";

/* 參考 Chrome 小恐龍（components/neterror/resources/dino_game）：速度、加速度、間距公式、群組與重複上限都照它，
   長度單位換成恐龍高度，Chrome 的暴龍高 47 px，這裡的一單位是恐龍畫布高度的 1/94 */
const CHROME = {
  speed: 6,
  maxSpeed: 13,
  acceleration: 0.001,
  gapCoefficient: 0.6,
  maxGapCoefficient: 1.5,
  maxObstacleLength: 3,
  maxObstacleDuplication: 2,
  clearTime: 3,
  scoreCoefficient: 0.025,
};
const UNIT = 1 / 94;

type ObstacleKind = "rock" | "mushroom" | "cone" | "crate" | "bird" | "plane";

/* height 是恐龍畫布高度的比例；ratio 是素材的寬高比 */
const OBSTACLES: Record<
  ObstacleKind,
  { height: number; ratio: number; multipleSpeed: number; minGap: number; minSpeed: number; flying?: boolean }
> = {
  rock: { height: 0.3, ratio: 856 / 546, multipleSpeed: 4, minGap: 120, minSpeed: 0 },
  mushroom: { height: 0.34, ratio: 751 / 820, multipleSpeed: 4, minGap: 120, minSpeed: 0 },
  cone: { height: 0.42, ratio: 607 / 708, multipleSpeed: 7, minGap: 120, minSpeed: 0 },
  crate: { height: 0.44, ratio: 857 / 855, multipleSpeed: 7, minGap: 120, minSpeed: 0 },
  bird: { height: 0.26, ratio: 571 / 506, multipleSpeed: 999, minGap: 150, minSpeed: 8.5, flying: true },
  plane: { height: 0.2, ratio: 579 / 367, multipleSpeed: 999, minGap: 150, minSpeed: 8.5, flying: true },
};
const KINDS = Object.keys(OBSTACLES) as ObstacleKind[];

/* 飛行障礙物的離地高度：低的要跳過，高的飛在頭頂上方，跳起來反而會撞到 */
const FLIGHT_ALTITUDES = [0.06, 1.04];

/* 恐龍面向左，框以恐龍畫布的寬高比例表示：[左, 右, 下, 上]，下和上是離地高度 */
const DINO_BOXES = [
  [0.32, 0.88, 0.04, 0.48],
  [0.24, 0.44, 0.4, 0.62],
  [0.03, 0.38, 0.6, 0.96],
] as const;

/* 跳躍在恐龍高 128 px 時調好，其他尺寸等比縮放，滯空時間不變 */
const GRAVITY = 2000 / 128;
const JUMP_VELOCITY = 620 / 128;
/* 提早放開時把上升速度砍到這個值，仍足以越過最高的地面障礙物 */
const SHORT_JUMP_VELOCITY = 480 / 128;
const JUMP_BUFFER = 0.12;
const BEST_KEY = "dino-best";

type Mode = "idle" | "playing" | "over";
type Obstacle = { id: number; kind: ObstacleKind; size: number; height: number; altitude: number };
type Item = Obstacle & { x: number; width: number; gap: number; speedOffset: number };

type Sim = {
  raf: number;
  last: number;
  elapsed: number;
  y: number;
  vy: number;
  buffered: number;
  items: Item[];
  history: ObstacleKind[];
  nextId: number;
  speed: number;
  score: number;
  shown: number;
};

/* 水平是畫面座標，垂直是離地高度 */
type Box = { left: number; right: number; bottom: number; top: number };

const overlaps = (a: Box, b: Box) => a.left < b.right && a.right > b.left && a.bottom < b.top && a.top > b.bottom;
const random = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

export function DinoGame({ locale, alt }: { locale: Locale; alt: string }) {
  const t = translator(locale);
  const [mode, setMode] = useState<Mode>("idle");
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [best, setBest] = useState(0);

  const fieldRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const obstacleEls = useRef(new Map<number, HTMLDivElement>());
  const playerRef = useRef<MascotPlayer | null>(null);
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
      current.vy = JUMP_VELOCITY * dinoHeight();
    } else {
      current.buffered = JUMP_BUFFER;
    }
  }

  function endJump() {
    const current = sim.current;
    const short = SHORT_JUMP_VELOCITY * dinoHeight();

    if (current && current.vy > short) current.vy = short;
  }

  function dinoHeight() {
    return dinoRef.current?.getBoundingClientRect().height || 128;
  }

  /* Chrome 的 addNewObstacle：隨機挑一種，連續太多次或速度不夠就重挑 */
  function spawn(current: Sim, unit: number, height: number) {
    const speed = current.speed;
    const repeated = (kind: ObstacleKind) =>
      current.history.length >= CHROME.maxObstacleDuplication && current.history.every((seen) => seen === kind);
    const allowed = KINDS.filter((kind) => speed >= OBSTACLES[kind].minSpeed && !repeated(kind));
    const kind = allowed[random(0, allowed.length - 1)] ?? "rock";
    const type = OBSTACLES[kind];
    const size = speed > type.multipleSpeed ? random(1, CHROME.maxObstacleLength) : 1;
    const h = type.height * height;
    const width = h * type.ratio * size;
    const minGap = Math.round(width * speed + type.minGap * CHROME.gapCoefficient * unit);
    const altitude = type.flying ? (FLIGHT_ALTITUDES[random(0, FLIGHT_ALTITUDES.length - 1)] ?? 0) * height : 0;
    const item: Item = {
      id: current.nextId++,
      kind,
      size,
      height: h,
      altitude,
      x: 0,
      width,
      gap: random(minGap, Math.round(minGap * CHROME.maxGapCoefficient)),
      speedOffset: type.flying ? (Math.random() > 0.5 ? 0.8 : -0.8) : 0,
    };

    current.items.push(item);
    current.history = [kind, ...current.history].slice(0, CHROME.maxObstacleDuplication);
    setObstacles((list) => [...list, item]);
  }

  function frame(now: number) {
    const current = sim.current;
    const field = fieldRef.current;
    const dino = dinoRef.current;

    if (!current || !field || !dino) return;

    const dt = Math.min((now - current.last) / 1000, 0.04);
    const frames = dt * 60;
    const fieldRect = field.getBoundingClientRect();
    const dinoRect = dino.getBoundingClientRect();
    const height = dinoRect.height || 128;
    const unit = height * UNIT;

    current.last = now;
    current.elapsed += dt;
    current.speed = Math.min(CHROME.maxSpeed, current.speed + CHROME.acceleration * frames);
    current.score += current.speed * frames * CHROME.scoreCoefficient;
    current.buffered -= dt;

    if (current.y > 0 || current.vy > 0) {
      current.vy -= GRAVITY * height * dt;
      current.y = Math.max(0, current.y + current.vy * dt);

      if (current.y === 0) {
        current.vy = 0;

        if (current.buffered > 0) {
          current.vy = JUMP_VELOCITY * height;
          current.buffered = 0;
        }
      }
    }

    dino.style.transform = `translateY(${-current.y}px)`;
    playerRef.current?.setAirborne(current.y > 0);

    if (current.elapsed > CHROME.clearTime) {
      const last = current.items.at(-1);

      if (!last || last.x - last.width > last.gap) {
        spawn(current, unit, height);
      }
    }

    /* 畫布有 CSS 鏡像，用量到的外框換算；translateY 不影響 left 和 width，跳躍中量也安全 */
    const dinoLeft = dinoRect.left - fieldRect.left;
    const hitboxes = DINO_BOXES.map(([left, right, bottom, top]): Box => ({
      left: dinoLeft + left * dinoRect.width,
      right: dinoLeft + right * dinoRect.width,
      bottom: current.y + bottom * height,
      top: current.y + top * height,
    }));
    let gone = false;

    for (const item of current.items) {
      item.x += (current.speed + item.speedOffset) * frames * unit;

      const el = obstacleEls.current.get(item.id);

      if (el) el.style.transform = `translateX(${item.x}px)`;

      const inset = item.width * 0.12;
      const box = {
        left: item.x - item.width + inset,
        right: item.x - inset,
        bottom: item.altitude + item.height * 0.12,
        top: item.altitude + item.height * 0.85,
      };

      if (hitboxes.some((dinoBox) => overlaps(dinoBox, box))) {
        die();
        return;
      }

      if (item.x - item.width > fieldRect.width) gone = true;
    }

    if (gone) {
      const alive = new Set(current.items.filter((item) => item.x - item.width <= fieldRect.width).map((item) => item.id));

      current.items = current.items.filter((item) => alive.has(item.id));
      setObstacles((list) => list.filter((o) => alive.has(o.id)));
    }

    const shown = Math.floor(current.score);

    if (shown !== current.shown && scoreRef.current) {
      current.shown = shown;
      scoreRef.current.textContent = String(shown);
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
      elapsed: 0,
      y: 0,
      vy: 0,
      buffered: 0,
      items: [],
      history: [],
      nextId: 1,
      speed: CHROME.speed,
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
              <span
                ref={scoreRef}
                className={cn(ENTER, "font-bold text-7xl tabular-nums sm:text-8xl")}
              >
                0
              </span>
              {best > 0 && bestScore}
              <span className="animate-[hint-fade_3s_ease_forwards] text-muted-foreground text-sm">
                {t("空白鍵或點擊跳躍")}
              </span>
            </>
          ) : (
            <>
              <span className="text-muted-foreground">{t("得分")}</span>
              <span className="font-bold text-7xl tabular-nums sm:text-8xl">
                {finalScore}
              </span>
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
        {obstacles.map((obstacle) => (
          <div
            key={obstacle.id}
            ref={(el) => {
              if (el) obstacleEls.current.set(obstacle.id, el);
              else obstacleEls.current.delete(obstacle.id);
            }}
            style={{
              height: obstacle.height,
              bottom: obstacle.altitude,
              left: -obstacle.height * OBSTACLES[obstacle.kind].ratio * obstacle.size,
            }}
            className={cn(
              "absolute flex select-none drop-shadow-[0_3px_2px_rgb(0_0_0/0.25)] transition-opacity duration-200 will-change-transform",
              plantDim,
              mode === "over" && "opacity-60",
            )}
          >
            {Array.from({ length: obstacle.size }, (_, i) => (
              <img
                key={i}
                src={`/home/scene/${obstacle.kind}.svg`}
                alt=""
                draggable={false}
                className={cn(
                  "h-full w-auto",
                  OBSTACLES[obstacle.kind].flying &&
                    "animate-[flap_.35s_ease-in-out_infinite_alternate] motion-reduce:animate-none",
                )}
              />
            ))}
          </div>
        ))}
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
              onPlayer={(player) => {
                playerRef.current = player;
              }}
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

const ENTER =
  "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:animate-none";
