"use client";

import type Confetti from "canvas-confetti";
import type { gsap as Gsap } from "gsap";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "~/i18n";
import {
  COPY,
  type Copy,
  INGREDIENTS,
  type IngredientId,
  type Origin,
  ORIGINS,
  RECIPES,
  type Recipe,
} from "./content";
import { Counter, type Spawn } from "./counter";
import { Pixelated } from "./Pixelated";
import {
  BAG,
  Bitmap,
  FLAMES,
  PLATE,
  Sprite,
  SURPRISE_SPRITE,
  WOK,
} from "./pixels";
import {
  cook,
  type Dish,
  EMPTY_SAVE,
  forage,
  type Harvest,
  type Hint,
  ingredient,
  ingredientIndex,
  intelIndex,
  POT_SIZE,
  type Save,
  today,
} from "./game";
import "./stall.css";

const SAVE_KEY = "stall";
const CONFETTI_COLORS = ["#ab4329", "#cc9a33", "#2e5e55", "#f4ead0", "#5e8c4e"];
/** 盤子往櫃台外拖這麼遠再放開就算賣掉 */
const SELL_DISTANCE = 70;
const TYPE_MS = 28;
const STEPS = "steps(6)";

/** 介面文字，台詞和食材名稱在 content.ts */
const WEB = {
  "zh-tw": {
    fresh: "新",
    away: "Yee 去{place}了",
    pot: "下鍋 {count}/{max}",
    empty: "把食材拖進鍋子，或點一下",
    start: "點燈籠，派 Yee 出門找食材",
    hungry: "攤位空空的。Yee 可以出門找食材。",
    ready: "食材到了。挑幾樣下鍋。",
    learned: "新菜，已收進食譜本",
    unknown: "？？？",
    complete: "食譜本收齊了。Yee 沒有別的要說。",
    full: "鍋子滿了。",
    takeOut: "拿出{name}",
    price: "售價",
    sell: "上架賣掉",
    sold: "{dish}賣掉了，收入 {price}。",
    earned: "今晚收入 {coins}",
    separator: "、",
    note: "網頁小遊戲，進度只存在這個瀏覽器。Discord 裡的新遊戲還在準備中",
  },
  "zh-cn": {
    fresh: "新",
    away: "Yee 去{place}了",
    pot: "下锅 {count}/{max}",
    empty: "把食材拖进锅子，或点一下",
    start: "点灯笼，派 Yee 出门找食材",
    hungry: "摊位空空的。Yee 可以出门找食材。",
    ready: "食材到了。挑几样下锅。",
    learned: "新菜，已收进食谱本",
    unknown: "？？？",
    complete: "食谱本收齐了。Yee 没有别的要说。",
    full: "锅子满了。",
    takeOut: "拿出{name}",
    price: "售价",
    sell: "上架卖掉",
    sold: "{dish}卖掉了，收入 {price}。",
    earned: "今晚收入 {coins}",
    separator: "、",
    note: "网页小游戏，进度只存在这个浏览器。Discord 里的新游戏还在准备中",
  },
  en: {
    fresh: "New",
    away: "Yee is off to {place}",
    pot: "In the wok {count}/{max}",
    empty: "Drag ingredients into the wok, or tap them",
    start: "Tap a lantern to send Yee out for ingredients",
    hungry: "The stall is empty. Yee can go find ingredients.",
    ready: "Ingredients are here. Pick a few for the wok.",
    learned: "New dish, added to the recipe book",
    unknown: "???",
    complete: "The recipe book is full. Yee has nothing to add.",
    full: "The wok is full.",
    takeOut: "Take out {name}",
    price: "Price",
    sell: "Sell it",
    sold: "{dish} sold for {price}.",
    earned: "Tonight's take: {coins}",
    separator: ", ",
    note: "A web mini-game. Progress stays in this browser. The new Discord game is still in the works",
  },
} satisfies Record<Locale, Record<string, string>>;

type Web = (typeof WEB)[Locale];

type Stage =
  | { name: "idle" }
  | { name: "away"; harvest: Harvest; next: Save }
  | { name: "cooking"; dish: Dish }
  | { name: "served"; dish: Dish };

type Trinket = { key: string; name: string };

type Libraries = {
  gsap: typeof Gsap;
  confetti: typeof Confetti;
};

function fill(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (raw, key: string) =>
    key in values ? String(values[key]) : raw,
  );
}

function isSave(value: unknown): value is Save {
  return (
    typeof value === "object" &&
    value !== null &&
    ["pantry", "book", "trips"].every(
      (key) =>
        key in value &&
        typeof Object.getOwnPropertyDescriptor(value, key)?.value === "object",
    )
  );
}

function readSave(): Save {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "");

    if (isSave(stored)) {
      return stored;
    }
  } catch {
    // 沒存過或存壞了都當成新玩家
  }

  return EMPTY_SAVE;
}

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function between(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** 開場時食材從上面掉下來，各自散開 */
function rain(): Spawn {
  return { x: between(0.3, 0.68), lift: between(120, 260), vx: between(-2, 2), vy: 0 };
}

export function Stall({
  locale,
  onSold,
}: {
  locale: Locale;
  onSold: (price: number) => void;
}) {
  const copy = COPY[locale];
  const web = WEB[locale];
  const [save, setSave] = useState<Save>(EMPTY_SAVE);
  const [day, setDay] = useState<number | null>(null);
  const [stage, setStage] = useState<Stage>({ name: "idle" });
  const [pot, setPot] = useState<IngredientId[]>([]);
  const [trinkets, setTrinkets] = useState<Trinket[]>([]);
  const [fresh, setFresh] = useState<IngredientId[]>([]);
  const [line, setLine] = useState<string | null>(null);
  const [intel, setIntel] = useState<string | null>(null);
  const [bookOpen, setBookOpen] = useState(false);
  const [counter, setCounter] = useState<Counter | null>(null);

  const playRef = useRef<HTMLDivElement>(null);
  const wokRef = useRef<HTMLDivElement>(null);
  const wokArtRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const floatersRef = useRef<HTMLDivElement>(null);
  const yeeRef = useRef<HTMLDivElement>(null);
  const bagRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const libraries = useRef<Libraries | null>(null);
  const spawns = useRef(new Map<string, Spawn>());
  const intoPot = useRef<(key: string) => boolean>(() => false);

  const owned = INGREDIENTS.filter((item) => save.pantry[item.id] !== undefined);
  const found = RECIPES.filter((recipe) => save.book[recipe.id] !== undefined);
  const busy = stage.name === "away" || stage.name === "cooking";
  const place = (origin: Origin) => copy.location[origin].name;

  intoPot.current = (key) => {
    const item = INGREDIENTS.find((candidate) => candidate.id === key);

    if (!item || busy) {
      return false;
    }

    if (pot.includes(item.id)) {
      return true;
    }

    if (pot.length >= POT_SIZE) {
      setLine(web.full);

      return false;
    }

    setPot([...pot, item.id]);

    return true;
  };

  useEffect(() => {
    setSave(readSave());
    setDay(today());

    let cancelled = false;
    let created: Counter | null = null;

    Promise.all([
      import("matter-js"),
      import("gsap"),
      import("canvas-confetti"),
    ]).then(([matter, { gsap }, confetti]) => {
      if (cancelled || !playRef.current || !wokRef.current) {
        return;
      }

      libraries.current = { gsap, confetti: confetti.default };
      created = new Counter(matter.default, playRef.current, wokRef.current, {
        onPot: (key) => intoPot.current(key),
        onTap: (key) => intoPot.current(key),
      });
      setCounter(created);
    });

    return () => {
      cancelled = true;
      created?.destroy();
    };
  }, []);

  useEffect(() => {
    if (stage.name !== "away") {
      return;
    }

    const { harvest, next } = stage;
    const gsap = libraries.current?.gsap;
    const yee = yeeRef.current;
    const bag = bagRef.current;

    function unpack() {
      const origin = bagOrigin();

      for (const item of harvest.items) {
        spawns.current.set(item.id, {
          ...origin,
          vx: between(-7, 7),
          vy: between(-13, -8),
        });
      }

      if (harvest.surprise !== null) {
        const key = `trinket-${Date.now()}`;

        spawns.current.set(key, { ...origin, vx: between(-6, 6), vy: -11 });
        setTrinkets((list) => [
          ...list.slice(-2),
          { key, name: copy.surprise[harvest.surprise ?? 0] },
        ]);
      }

      const hit = harvest.items.find((item) => item.stars === 2);

      commit(next);
      setFresh(harvest.items.filter((item) => item.fresh).map((item) => item.id));
      setLine(
        [
          copy.diary[harvest.diary],
          hit
            ? fill(copy.text.report_intel_hit, { name: copy.ingredient[hit.id] })
            : null,
        ]
          .filter(Boolean)
          .join("\n"),
      );
      setStage({ name: "idle" });
    }

    if (!gsap || !yee || !bag || reducedMotion()) {
      const timer = setTimeout(unpack, 400);

      return () => clearTimeout(timer);
    }

    const away = -(yee.offsetLeft + yee.offsetWidth + 16);
    const timeline = gsap.timeline({ onComplete: unpack });

    timeline
      .to(yee, { y: -24, duration: 0.14, ease: STEPS })
      .to(yee, { y: 0, duration: 0.14, ease: STEPS })
      .to(yee, { x: away, duration: 0.55, ease: "steps(10)" })
      .to(yee, { y: -12, duration: 0.11, repeat: 4, yoyo: true, ease: "steps(2)" }, "<")
      .to(yee, { x: 0, duration: 0.55, ease: "steps(10)" }, "+=0.7")
      .to(yee, { y: -12, duration: 0.11, repeat: 4, yoyo: true, ease: "steps(2)" }, "<")
      .set(bag, { autoAlpha: 1, x: 0, y: 0 })
      .to(bag, { x: 144, duration: 0.45, ease: "steps(9)" })
      .to(bag, { y: -96, duration: 0.22, ease: "steps(4)" }, "<")
      .to(bag, { y: 24, duration: 0.23, ease: "steps(4)" }, ">")
      .set(bag, { autoAlpha: 0 });

    return () => {
      timeline.kill();
      gsap.set([yee, bag], { clearProps: "all" });
    };
  }, [stage]);

  useEffect(() => {
    if (stage.name !== "cooking") {
      return;
    }

    const { dish } = stage;
    const gsap = libraries.current?.gsap;
    const wok = wokArtRef.current;
    const flame = flameRef.current;
    const floaters = floatersRef.current;

    function serve() {
      const mouth = counter?.potMouth;

      if (mouth) {
        for (const id of dish.pot) {
          spawns.current.set(id, {
            ...mouth,
            vx: between(-9, -3),
            vy: between(-12, -7),
          });
        }
      }

      setPot([]);
      setLine(
        dish.recipe ? copy.recipe[dish.recipe.id].comment : copy.flop[dish.line],
      );
      setStage({ name: "served", dish });

      if (dish.fresh && !reducedMotion()) {
        celebrate();
      }
    }

    if (!gsap || !wok || !flame || !floaters || reducedMotion()) {
      const timer = setTimeout(serve, 400);

      return () => clearTimeout(timer);
    }

    const timeline = gsap.timeline({ onComplete: serve });

    timeline
      .to(flame, { scale: 2, duration: 0.12, ease: "steps(2)" })
      .to(wok, { y: -12, duration: 0.09, repeat: 7, yoyo: true, ease: "steps(2)" }, "<")
      .to(
        floaters.children,
        { y: -96, duration: 0.3, stagger: 0.07, ease: STEPS },
        "<0.1",
      )
      .to(floaters.children, {
        y: 0,
        autoAlpha: 0,
        duration: 0.25,
        stagger: 0.05,
        ease: STEPS,
      })
      .to(flame, { scale: 1, duration: 0.1, ease: "steps(2)" }, "<");

    return () => {
      timeline.kill();
      gsap.set([wok, flame], { clearProps: "all" });
    };
  }, [stage]);

  function commit(next: Save) {
    setSave(next);
    localStorage.setItem(SAVE_KEY, JSON.stringify(next));
  }

  /** 袋子落地的位置，食材從這裡噴出來 */
  function bagOrigin(): Spawn {
    const play = playRef.current?.getBoundingClientRect();
    const bag = bagRef.current?.getBoundingClientRect();

    if (!play || !bag) {
      return { x: 0.45, lift: 60, vx: 0, vy: 0 };
    }

    return {
      x: (bag.left + bag.width / 2 - play.left) / play.width,
      lift: Math.max(play.bottom - bag.bottom, 0) + 30,
      vx: 0,
      vy: 0,
    };
  }

  function celebrate() {
    const wok = wokRef.current?.getBoundingClientRect();

    if (!wok) {
      return;
    }

    libraries.current?.confetti({
      particleCount: 70,
      spread: 75,
      startVelocity: 38,
      angle: 105,
      shapes: ["square"],
      flat: true,
      scalar: 0.9,
      colors: CONFETTI_COLORS,
      origin: {
        x: (wok.left + wok.width / 2) / window.innerWidth,
        y: wok.top / window.innerHeight,
      },
      disableForReducedMotion: true,
    });
  }

  function leave(origin: Origin) {
    if (busy) {
      return;
    }

    const result = forage(save, origin, day ?? today(), Math.random);

    setIntel(null);
    setBookOpen(false);
    setLine(fill(web.away, { place: place(origin) }));
    setStage({ name: "away", harvest: result.harvest, next: result.save });
  }

  function startCooking() {
    if (busy || pot.length === 0) {
      return;
    }

    const result = cook(save, pot, Math.random);

    commit(result.save);
    setBookOpen(false);
    setLine("……");
    setStage({ name: "cooking", dish: result.dish });
  }

  function takeOut(id: IngredientId) {
    if (busy) {
      return;
    }

    const mouth = counter?.potMouth;

    if (mouth) {
      spawns.current.set(id, { ...mouth, vx: between(-7, -3), vy: -8 });
    }

    setPot(pot.filter((other) => other !== id));
  }

  function sell() {
    if (stage.name !== "served" || !stage.dish.recipe) {
      return;
    }

    const { dish } = stage;
    const sold = fill(web.sold, {
      dish: dish.recipe ? copy.recipe[dish.recipe.id].name : "",
      price: dish.total,
    });
    const gsap = libraries.current?.gsap;
    const plate = plateRef.current;
    const yee = yeeRef.current;

    function settle() {
      commit({ ...save, coins: (save.coins ?? 0) + dish.total });
      onSold(dish.total);
      setLine(sold);
      setStage({ name: "idle" });
    }

    if (!gsap || !plate || !yee || reducedMotion()) {
      settle();

      return;
    }

    const from = plate.getBoundingClientRect();

    libraries.current?.confetti({
      particleCount: 16,
      spread: 50,
      startVelocity: 22,
      gravity: 1.6,
      shapes: ["square"],
      flat: true,
      scalar: 0.8,
      colors: ["#cc9a33", "#e3c877"],
      origin: {
        x: (from.left + from.width / 2) / window.innerWidth,
        y: from.top / window.innerHeight,
      },
    });
    gsap
      .timeline()
      .to(plate, { y: 120, duration: 0.3, ease: STEPS })
      .set(plate, { autoAlpha: 0 })
      .call(settle)
      .to(yee, { y: -24, duration: 0.14, ease: "steps(3)" })
      .to(yee, { y: 0, duration: 0.14, ease: "steps(3)" });
  }

  function shownLine(): string {
    if (bookOpen) {
      return fill(copy.text.cookBook_count, {
        found: found.length,
        total: RECIPES.length,
      });
    }

    if (intel && !busy) {
      return intel;
    }

    if (line) {
      return line;
    }

    if (found.length === RECIPES.length) {
      return web.complete;
    }

    return owned.length > 0 ? web.ready : web.hungry;
  }

  const dish = stage.name === "served" ? stage.dish : null;
  const text = shownLine();
  const potLabel =
    pot.length > 0
      ? fill(web.pot, { count: pot.length, max: POT_SIZE })
      : owned.length > 0
        ? web.empty
        : web.start;

  return (
    <section
      className="px"
      data-locale={locale}
      aria-label={copy.text.home_shop}
    >
      <div ref={playRef} className="px-scene">
        <i className="px-star" style={{ left: "8%", top: "14%" }} />
        <i className="px-star" style={{ left: "31%", top: "30%" }} />
        <i className="px-star" style={{ left: "47%", top: "12%" }} />
        <i className="px-star" style={{ left: "64%", top: "34%" }} />
        <i className="px-star" style={{ left: "88%", top: "44%" }} />
        <div className="px-awning" aria-hidden />
        <h2 className="px-sign">{copy.text.home_shop}</h2>
        <div className="px-places">
          {ORIGINS.map((origin) => {
            const showIntel = () =>
              setIntel(
                day === null
                  ? null
                  : copy.location[origin].intel[intelIndex(origin, day)],
              );

            return (
              <button
                key={origin}
                type="button"
                disabled={busy}
                onClick={() => leave(origin)}
                onPointerEnter={showIntel}
                onPointerLeave={() => setIntel(null)}
                onFocus={showIntel}
                onBlur={() => setIntel(null)}
              >
                {place(origin)}
              </button>
            );
          })}
        </div>
        <div ref={yeeRef} className="px-yee">
          <Pixelated src="/img/logo.svg" columns={27} rows={32} label="Yee" />
        </div>
        <div ref={bagRef} className="px-bag">
          <Bitmap rows={BAG} />
        </div>
        {counter
          ? [
              ...owned
                .filter((item) => !pot.includes(item.id))
                .map((item) => (
                  <Token
                    key={item.id}
                    counter={counter}
                    tokenKey={item.id}
                    spawn={() => spawns.current.get(item.id) ?? rain()}
                    sprite={ingredientIndex(item.id)}
                    name={copy.ingredient[item.id]}
                    detail={flavors(item.id, copy)}
                    tag={
                      [
                        fresh.includes(item.id)
                          ? item.rarity === "common"
                            ? web.fresh
                            : copy.rarity[item.rarity]
                          : null,
                        save.pantry[item.id] === 2 ? "★★" : null,
                      ]
                        .filter(Boolean)
                        .join(" ") || null
                    }
                    rare={item.rarity !== "common"}
                  />
                )),
              ...trinkets.map((trinket) => (
                <Token
                  key={trinket.key}
                  counter={counter}
                  tokenKey={trinket.key}
                  spawn={() => spawns.current.get(trinket.key) ?? rain()}
                  sprite={SURPRISE_SPRITE}
                  name={trinket.name}
                  detail={copy.text.report_surprise}
                  tag={null}
                  rare={false}
                />
              )),
            ]
          : null}
        <div ref={wokRef} className="px-wok" data-lit={pot.length > 0}>
          <div ref={flameRef} className="px-flame">
            <Bitmap rows={FLAMES[0] ?? []} />
            <Bitmap rows={FLAMES[1] ?? []} />
          </div>
          <div ref={wokArtRef} className="px-wok-art">
            <Bitmap rows={WOK} />
            <div ref={floatersRef} className="px-floaters">
              {pot.map((id) => (
                <Sprite key={id} index={ingredientIndex(id)} />
              ))}
            </div>
          </div>
          <i className="px-steam" />
          <i className="px-steam" />
        </div>
        {dish ? (
          <div className="px-served">
            <motion.div
              ref={plateRef}
              className="px-plate"
              data-flop={dish.recipe === null}
              drag={dish.recipe !== null}
              dragSnapToOrigin
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                if (info.offset.y > SELL_DISTANCE) {
                  sell();
                }
              }}
            >
              <div className="px-food">
                {dish.pot.map((id) => (
                  <Sprite key={id} index={ingredientIndex(id)} />
                ))}
              </div>
              <Bitmap rows={PLATE} />
            </motion.div>
          </div>
        ) : null}
      </div>
      <div className="px-counter" aria-hidden />
      <div className="px-panel">
        <div className="px-talk">
          <Dialog text={text} />
          {dish && !bookOpen ? (
            <Receipt
              key={`${dish.pot.join()}-${dish.line}`}
              dish={dish}
              copy={copy}
              web={web}
              onSell={sell}
            />
          ) : null}
        </div>
        <div className="px-controls">
          <div className="px-slots" aria-label={potLabel}>
            {Array.from({ length: POT_SIZE }, (_, index) => {
              const id = pot[index];

              return id ? (
                <button
                  key={id}
                  type="button"
                  aria-label={fill(web.takeOut, { name: copy.ingredient[id] })}
                  title={`${copy.ingredient[id]} ${flavors(id, copy)}`}
                  disabled={busy}
                  onClick={() => takeOut(id)}
                >
                  <Sprite index={ingredientIndex(id)} />
                </button>
              ) : (
                <span key={index} />
              );
            })}
          </div>
          <button
            type="button"
            className="px-btn"
            disabled={busy || pot.length === 0}
            onClick={startCooking}
          >
            {copy.text.button_cook}
          </button>
          <button
            type="button"
            className="px-btn px-btn-quiet"
            aria-pressed={bookOpen}
            onClick={() => setBookOpen(!bookOpen)}
          >
            {copy.text.button_cookBook} {found.length}/{RECIPES.length}
          </button>
          {save.coins ? (
            <span className="px-coins">
              {fill(web.earned, { coins: save.coins })}
            </span>
          ) : null}
        </div>
        {bookOpen ? (
          <ul className="px-book">
            {RECIPES.map((recipe) => (
              <BookRow
                key={recipe.id}
                recipe={recipe}
                save={save}
                copy={copy}
                web={web}
              />
            ))}
          </ul>
        ) : null}
        <p className="px-note">{web.note}</p>
      </div>
    </section>
  );
}

/** 對話框的字一個一個打出來，報讀軟體直接讀到整句 */
function Dialog({ text }: { text: string }) {
  const [shown, setShown] = useState(text.length);

  useEffect(() => {
    if (reducedMotion()) {
      setShown(text.length);

      return;
    }

    setShown(0);

    const timer = setInterval(
      () =>
        setShown((count) => {
          if (count >= text.length) {
            clearInterval(timer);
          }

          return count + 1;
        }),
      TYPE_MS,
    );

    return () => clearInterval(timer);
  }, [text]);

  return (
    <p className="px-dialog">
      <span className="sr-only" aria-live="polite">
        {text}
      </span>
      <span aria-hidden>{text.slice(0, shown)}</span>
    </p>
  );
}

function flavors(id: IngredientId, copy: Copy): string {
  const item = ingredient(id);

  return [
    ...item.tastes.map((taste) => copy.taste[taste]),
    ...item.textures.map((texture) => copy.texture[texture]),
    copy.role[item.role],
  ].join(" ");
}

function Token({
  counter,
  tokenKey,
  spawn,
  sprite,
  name,
  detail,
  tag,
  rare,
}: {
  counter: Counter;
  tokenKey: string;
  spawn: () => Spawn;
  sprite: number;
  name: string;
  detail: string;
  tag: string | null;
  rare: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    counter.attach(tokenKey, element, spawn());

    return () => counter.detach(tokenKey);
  }, [counter, tokenKey]);

  return (
    <button
      ref={ref}
      type="button"
      className="px-token"
      aria-label={`${name} ${detail}`}
      data-rare={rare}
    >
      <Sprite index={sprite} />
      {tag ? <span className="px-tag">{tag}</span> : null}
      <span className="px-tip" aria-hidden>
        <strong>{name}</strong>
        <small>{detail}</small>
      </span>
    </button>
  );
}

function hintText(hint: Hint, copy: Copy, web: Web): string {
  if (hint.kind === "key") {
    return fill(copy.text.cook_hint_key, {
      role: copy.role[hint.role],
      origin: copy.location[hint.origin].name,
    });
  }

  return fill(copy.text.cook_hint_missing, {
    flavors: [
      ...hint.tastes.map((taste) => copy.taste[taste]),
      ...hint.textures.map((texture) => copy.texture[texture]),
      ...hint.roles.map((role) => copy.role[role]),
    ].join(web.separator),
  });
}

function Receipt({
  dish,
  copy,
  web,
  onSell,
}: {
  dish: Dish;
  copy: Copy;
  web: Web;
  onSell: () => void;
}) {
  const { recipe } = dish;

  return (
    <div className="px-receipt">
      <h3>
        {recipe ? copy.recipe[recipe.id].name : copy.text.cook_flop_title}
        {recipe ? (
          <span className="px-tag" data-grade={recipe.dark ? "dark" : dish.grade}>
            {recipe.dark ? copy.text.cook_dark_stamp : copy.grade[dish.grade]}
          </span>
        ) : null}
      </h3>
      {dish.hint ? <p>{hintText(dish.hint, copy, web)}</p> : null}
      {dish.fresh ? <p>{web.learned}</p> : null}
      {recipe ? (
        <div>
          <p>
            {web.price} {dish.total}
            {dish.synergy ? ` (${copy.text.cook_synergy} ×1.5)` : null}
          </p>
          <button type="button" className="px-btn" onClick={onSell}>
            {web.sell}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function BookRow({
  recipe,
  save,
  copy,
  web,
}: {
  recipe: Recipe;
  save: Save;
  copy: Copy;
  web: Web;
}) {
  const grade = save.book[recipe.id];
  const known = [
    ...recipe.tastes.map((taste) => copy.taste[taste]),
    ...recipe.textures.map((texture) => copy.texture[texture]),
  ];

  if (grade !== undefined) {
    return (
      <li data-found="true">
        <strong>{copy.recipe[recipe.id].name}</strong>
        <span>
          {recipe.dark ? copy.text.cook_dark_stamp : copy.grade[grade]}
        </span>
      </li>
    );
  }

  return (
    <li data-found="false">
      <span>{web.unknown}</span>
      {recipe.dark || known.length === 0 ? null : (
        <span>
          {fill(copy.text.cookBook_known, {
            flavors: known.join(web.separator),
          })}
        </span>
      )}
    </li>
  );
}
