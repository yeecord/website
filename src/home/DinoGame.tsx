"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "~/i18n";
import { translator } from "~/i18n/translate";
import { cn } from "~/utils/cn";
import { DinoMascot, VIEW } from "./DinoMascot";
import type { MascotPlayer } from "./mascot/player";
import { plantDim } from "./scene";

/* 參考 Chrome 小恐龍（components/neterror/resources/dino_game）：速度、加速度、間距公式、群組與重複上限都照它，
   長度單位換成恐龍高度：Chrome 的暴龍高 47 px，對應恐龍的身體和腿（畫布高度的一半），長脖子是多出來的，
   所以仙人掌對恐龍身體的比例跟 Chrome 一樣；恐龍維持待機的大小，桌機上障礙物橫越全寬約 1.7 秒，也和 Chrome 相同 */
const CHROME = {
  speed: 6,
  maxSpeed: 13,
  acceleration: 0.001,
  gapCoefficient: 0.6,
  maxGapCoefficient: 1.5,
  maxObstacleLength: 3,
  maxObstacleDuplication: 2,
  /* Chrome 是 3 秒，但它的畫面只有 600 px 寬；這裡的場地是整個視窗，障礙物光是跑到恐龍面前就要兩秒多 */
  clearTime: 1,
  scoreCoefficient: 0.025,
  /* Chrome 的障礙物從 600 寬的畫面右緣出現，跑 506 才碰到暴龍；手機上的前方比這短，就把橫向速度放慢，最多慢到 minPace */
  approach: 506,
  minPace: 0.8,
};
const UNIT = 1 / 94;

type ObstacleKind =
  | "rock"
  | "mushroom"
  | "cone"
  | "crate"
  | "cactus"
  | "log"
  | "hedgehog"
  | "bird"
  | "plane"
  | "bee";

/* 尺寸照 Chrome（offline_sprite_definitions.ts）：height 是 Chrome 像素，小仙人掌高 35、大仙人掌高 50、翼龍高 40；
   ratio 是素材的寬高比。group 是一排的總寬上限，Chrome 是 3 × 17 和 3 × 25，這裡的素材比較胖，放寬 30%，放不下就少放幾個。
   walk 的障礙物會原地踏步；所有障礙物都和地面同速，不像 Chrome 的翼龍有快慢差 */
const SMALL_GROUP = 17 * 3 * 1.3;
const LARGE_GROUP = 25 * 3 * 1.3;
const OBSTACLES: Record<
  ObstacleKind,
  {
    height: number;
    ratio: number;
    group: number;
    multipleSpeed: number;
    minGap: number;
    minSpeed: number;
    flying?: boolean;
    walk?: boolean;
  }
> = {
  rock: { height: 26, ratio: 856 / 546, group: SMALL_GROUP, multipleSpeed: 4, minGap: 120, minSpeed: 0 },
  mushroom: { height: 34, ratio: 751 / 820, group: SMALL_GROUP, multipleSpeed: 4, minGap: 120, minSpeed: 0 },
  cone: { height: 34, ratio: 607 / 708, group: SMALL_GROUP, multipleSpeed: 4, minGap: 120, minSpeed: 0 },
  cactus: { height: 48, ratio: 609 / 751, group: LARGE_GROUP, multipleSpeed: 7, minGap: 120, minSpeed: 0 },
  crate: { height: 40, ratio: 857 / 855, group: LARGE_GROUP, multipleSpeed: 7, minGap: 120, minSpeed: 0 },
  log: { height: 22, ratio: 713 / 436, group: 0, multipleSpeed: 999, minGap: 120, minSpeed: 0 },
  hedgehog: { height: 24, ratio: 631 / 501, group: 0, multipleSpeed: 999, minGap: 140, minSpeed: 6.5, walk: true },
  bird: { height: 32, ratio: 571 / 506, group: 0, multipleSpeed: 999, minGap: 150, minSpeed: 8.5, flying: true },
  plane: { height: 24, ratio: 579 / 367, group: 0, multipleSpeed: 999, minGap: 150, minSpeed: 8.5, flying: true },
  bee: { height: 28, ratio: 824 / 808, group: 0, multipleSpeed: 999, minGap: 150, minSpeed: 7.5, flying: true },
};

/* 星星：偶爾三顆排成弧形懸在地面障礙物正上方，跳過障礙物時順手吃到。
   恐龍脖子長，所以放在頭頂以上（恐龍畫布高度的比例），站著吃不到 */
const STAR = { chance: 0.35, size: 0.13, spread: 1.4, altitudes: [1.0, 1.14, 1.0], bonus: 10 };
/* Chrome 每 100 分閃一次分數，每 700 分日夜交替 */
const MILESTONE = 100;
const NIGHT_EVERY = 700;
const KINDS = Object.keys(OBSTACLES) as ObstacleKind[];

/* 飛行障礙物的離地高度（恐龍畫布高度的比例）：低的貼地要跳過，中間的對準頭要蹲下。
   Chrome 還有一種飛在頭頂上的翼龍，這裡的蜜蜂比例大，飛在那裡分不出要不要跳，所以不用 */
const FLIGHT_ALTITUDES = [0.06, 0.58];

/* Chrome 暴龍的跳躍（trex.ts 的 normalJumpConfig），單位是 Chrome 像素和每格：
   按住越久跳越高，升過 minJumpHeight 後放開就把上升速度壓到 dropVelocity，到 maxJumpHeight 一定會壓 */
const TREX = {
  gravity: 0.6,
  initialJumpVelocity: 10,
  minJumpHeight: 30,
  maxJumpHeight: 63,
  dropVelocity: 5,
  speedDropCoefficient: 3,
  gameoverClearTime: 1200,
};

/* 恐龍的碰撞框，用 artboard 座標寫：[左, 右, 下, 上]，左右是 x，下和上是離地高度 */
const STANDING_BOXES = [
  [150, 385, 6, 165],
  [300, 385, 150, 300],
  [300, 445, 290, 415],
] as const;
const DUCKING_BOXES = [
  [150, 300, 6, 200],
  [300, 420, 105, 250],
  [420, 525, 75, 245],
] as const;
const BEST_KEY = "dino-best";

type Mode = "idle" | "playing" | "over";
type Obstacle = { id: number; kind: ObstacleKind; size: number; height: number; altitude: number };
type Item = Obstacle & { x: number; width: number; gap: number };
type Star = { id: number; x: number; size: number; altitude: number };
type Pop = { id: number; x: number; bottom: number };

type Sim = {
  raf: number;
  last: number;
  elapsed: number;
  y: number;
  vy: number;
  jumping: boolean;
  reachedMinHeight: boolean;
  speedDrop: boolean;
  ducking: boolean;
  items: Item[];
  stars: Star[];
  history: ObstacleKind[];
  nextId: number;
  speed: number;
  score: number;
  shown: number;
  distance: number;
  layers: { el: HTMLElement; factor: number; period: number }[];
};

/* 水平是畫面座標，垂直是離地高度 */
type Box = { left: number; right: number; bottom: number; top: number };

const overlaps = (a: Box, b: Box) => a.left < b.right && a.right > b.left && a.bottom < b.top && a.top > b.bottom;
const random = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
/* Chrome 把分數補到五位數 */
const pad = (score: number) => String(score).padStart(5, "0");

/* Chrome 過里程碑時讓分數閃三下 */
function blink(el: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  el.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 250, iterations: 3 });
}

export function DinoGame({ locale, alt }: { locale: Locale; alt: string }) {
  const t = translator(locale);
  const [mode, setMode] = useState<Mode>("idle");
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [best, setBest] = useState(0);

  const fieldRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const obstacleEls = useRef(new Map<number, HTMLDivElement>());
  const starEls = useRef(new Map<number, HTMLDivElement>());
  const playerRef = useRef<MascotPlayer | null>(null);
  const sim = useRef<Sim | null>(null);
  const diedAt = useRef(0);

  useEffect(() => {
    setBest(Number(localStorage.getItem(BEST_KEY)) || 0);
  }, []);

  function setNight(night: boolean) {
    /* 深色模式本來就是夜晚，不用交替 */
    const dark = document.documentElement.classList.contains("dark");

    fieldRef.current?.closest("[data-hero]")?.toggleAttribute("data-night", night && !dark);
  }

  function resetLayers() {
    for (const layer of sim.current?.layers ?? []) layer.el.style.transform = "";
  }

  function stopLoop() {
    if (sim.current) cancelAnimationFrame(sim.current.raf);
    if (dinoRef.current) dinoRef.current.style.transform = "";
  }

  function quit() {
    stopLoop();
    resetLayers();
    setObstacles([]);
    setStars([]);
    setNight(false);
    setMode("idle");
  }

  function die() {
    const score = Math.floor(sim.current?.score ?? 0);

    stopLoop();
    diedAt.current = performance.now();
    setFinalScore(score);
    if (score > best) {
      setBest(score);
      localStorage.setItem(BEST_KEY, String(score));
    }
    setMode("over");
  }

  /* 以下照 Chrome 的 Trex：startJump、endJump、setSpeedDrop、setDuck */
  function jump() {
    const current = sim.current;

    if (!current || current.jumping || current.ducking) return;

    current.vy = TREX.initialJumpVelocity + current.speed / 10;
    current.jumping = true;
    current.reachedMinHeight = false;
    current.speedDrop = false;
  }

  function endJump() {
    const current = sim.current;

    if (current?.reachedMinHeight && current.vy > TREX.dropVelocity) current.vy = TREX.dropVelocity;
  }

  function duck(down: boolean) {
    const current = sim.current;

    if (!current) return;

    if (!down) {
      current.speedDrop = false;
      current.ducking = false;
    } else if (current.jumping) {
      current.speedDrop = true;
      current.vy = -1;
    } else {
      current.ducking = true;
    }
  }

  /* Chrome 的 addNewObstacle：隨機挑一種，連續太多次或速度不夠就重挑 */
  function spawn(current: Sim, unit: number, height: number) {
    const speed = current.speed;
    const repeated = (kind: ObstacleKind) =>
      current.history.length >= CHROME.maxObstacleDuplication && current.history.every((seen) => seen === kind);
    const allowed = KINDS.filter((kind) => speed >= OBSTACLES[kind].minSpeed && !repeated(kind));
    const kind = allowed[random(0, allowed.length - 1)] ?? "rock";
    const type = OBSTACLES[kind];
    const fits = Math.floor(type.group / (type.height * type.ratio));
    const size = speed > type.multipleSpeed ? random(1, Math.max(1, Math.min(CHROME.maxObstacleLength, fits))) : 1;
    const h = type.height * unit;
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
    };

    current.items.push(item);

    if (!type.flying && Math.random() < STAR.chance) {
      const size = STAR.size * height;
      const arc = STAR.altitudes.map((altitude, i) => ({
        id: current.nextId++,
        x: -width / 2 + size / 2 + (i - 1) * size * STAR.spread,
        size,
        altitude: altitude * height,
      }));

      current.stars.push(...arc);
      setStars((list) => [...list, ...arc]);
    }

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
    /* 場地整個水平鏡像，所以在場地座標裡從右緣量；translateY 不影響寬度，跳躍中量也安全 */
    const dinoLeft = fieldRect.right - dinoRect.right;
    const pace = Math.min(1, Math.max(CHROME.minPace, dinoLeft / unit / CHROME.approach));

    current.last = now;
    current.elapsed += dt;
    current.speed = Math.min(CHROME.maxSpeed, current.speed + CHROME.acceleration * frames);
    current.score += current.speed * frames * CHROME.scoreCoefficient;
    current.distance += current.speed * frames * unit * pace;

    /* 背景跟著跑步往後（往左）捲，越遠越慢 */
    for (const layer of current.layers) {
      layer.el.style.transform = `translate3d(${-((current.distance * layer.factor) % layer.period)}px, 0, 0)`;
    }
    /* Chrome 的 updateJump：y 是離地高度、vy 往上為正，都用 Chrome 像素 */
    if (current.jumping) {
      current.y += current.vy * (current.speedDrop ? TREX.speedDropCoefficient : 1) * frames;
      current.vy -= TREX.gravity * frames;

      if (current.y > TREX.minJumpHeight || current.speedDrop) current.reachedMinHeight = true;
      if (current.y > TREX.maxJumpHeight || current.speedDrop) endJump();

      if (current.y <= 0) {
        current.y = 0;
        current.vy = 0;
        current.jumping = false;

        /* 空中按住下鍵落地後直接蹲著 */
        if (current.speedDrop) {
          current.speedDrop = false;
          current.ducking = true;
        }
      }
    }

    const lift = current.y * unit;

    /* 手機上恐龍外層縮小了，位移寫在縮放裡面，要換回縮放前的像素 */
    dino.style.transform = `translateY(${(-lift * dino.offsetHeight) / height}px)`;
    playerRef.current?.setAirborne(current.jumping);
    playerRef.current?.setDucking(current.ducking);

    if (current.elapsed > CHROME.clearTime) {
      const last = current.items.at(-1);

      if (!last || last.x - last.width > last.gap) {
        spawn(current, unit, height);
      }
    }

    /* 恐龍在場地座標裡是鏡像的：artboard 右邊在場地左邊 */
    const scale = height / VIEW.height;
    const viewRight = VIEW.x + VIEW.width;
    const hitboxes = (current.ducking ? DUCKING_BOXES : STANDING_BOXES).map(([left, right, bottom, top]): Box => ({
      left: dinoLeft + (viewRight - right) * scale,
      right: dinoLeft + (viewRight - left) * scale,
      bottom: lift + bottom * scale,
      top: lift + top * scale,
    }));
    let gone = false;

    for (const item of current.items) {
      item.x += current.speed * frames * unit * pace;

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

    for (const star of current.stars) {
      star.x += current.speed * frames * unit * pace;

      const el = starEls.current.get(star.id);

      if (el) el.style.transform = `translateX(${star.x}px)`;

      const box = { left: star.x - star.size, right: star.x, bottom: star.altitude, top: star.altitude + star.size };

      if (hitboxes.some((dinoBox) => overlaps(dinoBox, box))) {
        current.score += STAR.bonus;
        star.x = Number.POSITIVE_INFINITY;
        setPops((list) => [...list, { id: star.id, x: box.left, bottom: box.top }]);
        setTimeout(() => setPops((list) => list.filter((pop) => pop.id !== star.id)), 700);
      }
    }

    if (current.stars.some((star) => star.x - star.size > fieldRect.width)) {
      current.stars = current.stars.filter((star) => star.x - star.size <= fieldRect.width);

      const alive = new Set(current.stars.map((star) => star.id));

      setStars((list) => list.filter((star) => alive.has(star.id)));
    }

    const shown = Math.floor(current.score);

    if (shown !== current.shown && scoreRef.current) {
      if (Math.floor(shown / MILESTONE) > Math.floor(current.shown / MILESTONE)) {
        blink(scoreRef.current);
      }

      setNight(Math.floor(shown / NIGHT_EVERY) % 2 === 1);
      current.shown = shown;
      scoreRef.current.textContent = pad(shown);
    }

    current.raf = requestAnimationFrame(frame);
  }

  function start() {
    const field = fieldRef.current;

    /* 點恐龍或按鈕開始後焦點會留在按鈕上，空白鍵跳躍時會冒出外框，還會再按一次它 */
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

    const dino = dinoRef.current;

    if (!field || !dino) return;

    resetLayers();
    sim.current = {
      raf: 0,
      last: performance.now(),
      elapsed: 0,
      y: 0,
      vy: 0,
      jumping: false,
      reachedMinHeight: false,
      speedDrop: false,
      ducking: false,
      items: [],
      stars: [],
      history: [],
      nextId: 1,
      speed: CHROME.speed,
      score: 0,
      shown: 0,
      distance: 0,
      layers: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? []
        : [...(field.closest("[data-hero]")?.querySelectorAll<HTMLElement>("[data-parallax]") ?? [])].map((el) => ({
            el,
            factor: Number(el.dataset.parallax),
            period: el.clientWidth,
          })),
    };
    setObstacles([]);
    setStars([]);
    setNight(false);
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
        /* Chrome 的 gameoverClearTime：剛撞到時連按不會馬上重開 */
        else if (performance.now() - diedAt.current > TREX.gameoverClearTime) start();
      } else if (event.code === "ArrowDown") {
        event.preventDefault();
        if (mode === "playing") duck(true);
      } else if (event.key === "Escape") {
        quit();
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.code === "Space" || event.code === "ArrowUp") endJump();
      else if (event.code === "ArrowDown") duck(false);
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
    <span className="text-muted-foreground group-data-night/hero:text-white/70 tabular-nums">
      {t("最高分")} {pad(best)}
    </span>
  );

  return (
    <>
      {inGame && (
        <div className="pointer-events-none absolute inset-x-0 top-16 z-1 flex flex-col items-center gap-2 transition-colors duration-1000 group-data-night/hero:text-white sm:top-20 md:top-28">
          {mode === "playing" ? (
            <>
              <span
                ref={scoreRef}
                className={cn(ENTER, "font-bold font-mono text-4xl tabular-nums tracking-wider sm:text-5xl")}
              >
                00000
              </span>
              {best > 0 && bestScore}
              <span className="animate-[hint-fade_3s_ease_forwards] text-muted-foreground group-data-night/hero:text-white/70 text-sm">
                {t("空白鍵或點擊跳躍")}
              </span>
            </>
          ) : (
            <>
              <span className="text-muted-foreground group-data-night/hero:text-white/70">{t("得分")}</span>
              <span className="font-bold font-mono text-5xl tabular-nums tracking-wider sm:text-6xl">
                {pad(finalScore)}
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
        /* 遊戲邏輯裡障礙物從左往右跑；整個場地水平鏡像後，恐龍在左邊面向右，障礙物從右邊來，跟 Chrome 一樣。
           障礙物在左右邊緣淡入淡出 */
        className="-scale-x-100 pointer-events-none absolute inset-0 z-1 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
      >
        {stars.map((star) => (
          <div
            key={star.id}
            ref={(el) => {
              if (el) starEls.current.set(star.id, el);
              else starEls.current.delete(star.id);
            }}
            style={{ width: star.size, height: star.size, left: -star.size, bottom: star.altitude }}
            className="absolute will-change-transform"
          >
            <img
              src="/home/scene/star.svg"
              alt=""
              draggable={false}
              className="size-full animate-[shine_.9s_ease-in-out_infinite_alternate] select-none drop-shadow-[0_0_10px_rgb(255_196_61/0.95)] motion-reduce:animate-none"
            />
          </div>
        ))}
        {pops.map((pop) => (
          <span
            key={pop.id}
            style={{ left: pop.x, bottom: pop.bottom }}
            /* scale 跟動畫用的 transform 是分開的屬性，把鏡像的字翻回來 */
            className="-scale-x-100 absolute animate-[pop_.7s_cubic-bezier(0.23,1,0.32,1)_forwards] font-bold text-amber-500 text-lg tabular-nums motion-reduce:animate-none"
          >
            +{STAR.bonus}
          </span>
        ))}
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
            className={cn("absolute flex select-none drop-shadow-[0_3px_2px_rgb(0_0_0/0.25)] will-change-transform", plantDim)}
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
                  OBSTACLES[obstacle.kind].walk &&
                    "origin-bottom animate-[waddle_.25s_ease-in-out_infinite_alternate] motion-reduce:animate-none",
                )}
              />
            ))}
          </div>
        ))}
        {/* 手機畫面窄，遊戲中把恐龍縮小，前方看得到更遠 */}
        <div
          className={cn(
            "pointer-events-auto absolute right-[5%] bottom-0 origin-bottom-right transition-[scale] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none sm:right-[12%]",
            inGame && "max-sm:scale-60",
          )}
        >
          <div
            ref={dinoRef}
            /* 角色畫成面向右，在鏡像的場地裡再翻一次才會面向右 */
            className={cn(
              "-scale-x-100 will-change-transform",
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
          onPointerCancel={endJump}
          onContextMenu={(event) => event.preventDefault()}
          className="fixed inset-0 z-40 cursor-none touch-none select-none [-webkit-touch-callout:none]"
        />
      )}
    </>
  );
}

const ENTER =
  "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:animate-none";
