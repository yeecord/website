"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { HashIcon, PlusCircleIcon, Volume2Icon } from "lucide-react";
import { createContext, type ReactNode, useContext, useState } from "react";
import {
  DiscordEmbed,
  DiscordMessage,
  SlashCommand,
} from "~/components/mdx/discord";
import { defaultLocale, type Locale } from "~/i18n";
import { type Phrase, type Translate, translator } from "~/i18n/translate";

type ChannelId = "welcome" | "lottery" | "shop";

const channels: Record<ChannelId, { name: Phrase; topic: Phrase }> = {
  welcome: { name: "新人報到", topic: "機器龍自動接待新成員" },
  lottery: { name: "抽獎區", topic: "辦抽獎，一條指令的事" },
  shop: { name: "yee-的小店", topic: "掛機的人都在這裡餵恐龍" },
};

const CHANNEL_IDS: ChannelId[] = ["welcome", "lottery", "shop"];

const BOT_NAME: Phrase = "YEE式機器龍";

const TranslateContext = createContext<Translate>(translator(defaultLocale));

function useT() {
  return useContext(TranslateContext);
}

export function DemoServer({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const [active, setActive] = useState<ChannelId>("welcome");
  const [seen, setSeen] = useState<ChannelId[]>(["welcome"]);
  const channel = channels[active];

  function open(id: ChannelId) {
    setActive(id);
    setSeen((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  return (
    <TranslateContext.Provider value={t}>
      <div className="z-[2] mt-24 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            {t("進來參觀一下")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("點左邊的頻道逛逛，按鈕都是真的能按。")}
          </p>
        </div>
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="grid overflow-hidden rounded-xl border bg-discord-bg shadow-xl md:grid-cols-[15rem_1fr]"
        >
          <Sidebar active={active} seen={seen} onOpen={open} />
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2 border-white/8 border-b px-4 py-3 text-discord-text">
              <HashIcon className="size-5 text-discord-muted" />
              <span className="font-semibold text-white">{t(channel.name)}</span>
              <span className="text-discord-muted text-sm max-sm:hidden">
                {t(channel.topic)}
              </span>
            </div>
            <ChannelTabs active={active} onOpen={open} />
            <div className="flex min-h-[21rem] flex-col p-4 text-discord-text text-sm">
              <div key={active} className="flex flex-col gap-4">
                {active === "welcome" && <WelcomeScene />}
                {active === "lottery" && <LotteryScene />}
                {active === "shop" && <ShopScene />}
              </div>
              <div className="mt-auto flex items-center gap-3 rounded-lg bg-discord-input px-4 py-2.5 pt-2.5 text-discord-placeholder">
                <PlusCircleIcon className="size-5 shrink-0" />
                {t("跟大家說點什麼…")}
              </div>
            </div>
          </div>
        </motion.div>
        <p className="text-muted-foreground">
          {t(
            "歡迎訊息、身分組、抽獎這些設定，一句指令叫出來，剩下用選的、用填的，不用記落落長的參數。",
          )}
        </p>
      </div>
    </TranslateContext.Provider>
  );
}

const msgIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

function Msg({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <motion.div
      {...msgIn}
      transition={{ duration: 0.3, delay }}
      className="flex flex-col gap-4"
    >
      {children}
    </motion.div>
  );
}

function WelcomeScene() {
  const t = useT();

  return (
    <>
      <Msg delay={0}>
        <p className="text-discord-muted text-xs">
          {t("阿龍的粉絲 剛剛加入伺服器 👋")}
        </p>
      </Msg>
      <Msg delay={0.25}>
        <DiscordMessage author={t(BOT_NAME)} bot>
          <DiscordEmbed title={t("👋 歡迎 阿龍的粉絲！")} color="var(--color-primary)">
            <p>{t("歡迎來到伺服器，先挑個身分組，讓大家認識你。")}</p>
          </DiscordEmbed>
          <RolePicker />
        </DiscordMessage>
      </Msg>
    </>
  );
}

function LotteryScene() {
  const t = useT();

  return (
    <>
      <Msg delay={0}>
        <SlashCommand
          name="lottery"
          description={t("舉辦抽獎")}
          options={[
            { name: t("獎品"), value: t("Nitro 一個月") },
            { name: t("得獎人數"), value: "3" },
          ]}
        />
      </Msg>
      <Msg delay={0.25}>
        <DiscordMessage author={t(BOT_NAME)} bot>
          <DiscordEmbed
            title={t("🎉 抽獎開始")}
            color="var(--color-discord-fuchsia)"
          >
            <p>{t("獎品：Nitro 一個月，按下面的按鈕參加！")}</p>
          </DiscordEmbed>
          <Lottery />
        </DiscordMessage>
      </Msg>
    </>
  );
}

function ShopScene() {
  const t = useT();

  return (
    <>
      <Msg delay={0}>
        <DiscordMessage author={t("阿龍的粉絲")} bot={false} color="#e8a33d">
          <p>/find-food</p>
        </DiscordMessage>
      </Msg>
      <Msg delay={0.25}>
        <DiscordMessage author={t(BOT_NAME)} bot>
          <DiscordEmbed title={t("🍳 Yee 的小店")} color="var(--color-discord-gold)">
            <p>{t("Yee 剛從河邊回來，袋子裝了七成滿，看起來心情不錯。")}</p>
          </DiscordEmbed>
          <FindFoodButtons />
        </DiscordMessage>
      </Msg>
    </>
  );
}

function ChatButton({
  variant = "secondary",
  selected,
  onClick,
  children,
}: {
  variant?: "primary" | "secondary" | "success";
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex cursor-pointer items-center gap-1 rounded px-3 py-1.5 font-medium text-sm text-white transition-all active:translate-y-px",
        variant === "primary" && "bg-discord-blurple hover:brightness-110",
        variant === "secondary" && "bg-discord-secondary hover:brightness-110",
        variant === "success" && "bg-discord-success hover:brightness-110",
        selected && "ring-2 ring-white/70",
      )}
    >
      {children}
    </button>
  );
}

const roles: Phrase[] = ["🎮 遊戲仔", "🌙 夜貓子", "🎨 創作者"];

function RolePicker() {
  const t = useT();
  const [picked, setPicked] = useState<Phrase>();

  return (
    <div className="flex flex-wrap gap-1.5">
      {roles.map((role) => (
        <ChatButton
          key={role}
          variant={picked === role ? "primary" : "secondary"}
          selected={picked === role}
          onClick={() => setPicked(role)}
        >
          {t(role)}
        </ChatButton>
      ))}
      <AnimatePresence>
        {picked && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="self-center text-discord-muted text-xs"
          >
            {t("已領取")} {picked && t(picked)}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function Lottery() {
  const t = useT();
  const [joined, setJoined] = useState(false);
  const [count, setCount] = useState(42);
  const [burst, setBurst] = useState(0);

  function join() {
    if (joined) return;

    setJoined(true);
    setCount((c) => c + 1);
    setBurst(Date.now());
  }

  return (
    <div className="relative flex flex-wrap gap-1.5">
      <ChatButton variant="primary" onClick={join}>
        {joined ? t("已參加 ✅") : t("參加抽獎")}
      </ChatButton>
      <ChatButton>
        {t("目前")}{" "}
        <motion.span
          key={count}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          className="inline-block font-semibold"
        >
          {count}
        </motion.span>{" "}
        {t("人")}
      </ChatButton>
      <AnimatePresence>
        {burst > 0 && (
          <motion.span
            key={burst}
            initial={{ opacity: 1, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -34, scale: 1.4 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute left-6 select-none"
          >
            🎉
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function FindFoodButtons() {
  const t = useT();
  const [status, setStatus] = useState<Phrase>();

  return (
    <div className="flex flex-wrap gap-1.5">
      <ChatButton variant="primary" onClick={() => setStatus("Yee 揹起袋子出門了，明天回來收成！")}>
        {t("帶牠去找吃的")}
      </ChatButton>
      <ChatButton variant="success" onClick={() => setStatus("下鍋！煮出了「河鮮味噌鍋」，Yee 眼睛都亮了。")}>
        {t("開煮")}
      </ChatButton>
      <ChatButton onClick={() => setStatus("Yee 吃得很開心，感情 +1 ❤️")}>
        {t("餵牠")}
      </ChatButton>
      <AnimatePresence mode="wait">
        {status && (
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full text-discord-muted text-xs"
          >
            {t(status)}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChannelTabs({
  active,
  onOpen,
}: {
  active: ChannelId;
  onOpen: (id: ChannelId) => void;
}) {
  const t = useT();

  return (
    <div className="flex gap-1.5 border-white/8 border-b px-4 py-2 md:hidden">
      {CHANNEL_IDS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onOpen(id)}
          className={clsx(
            "rounded-full px-3 py-1 text-sm transition-colors",
            id === active
              ? "bg-white/15 font-medium text-white"
              : "text-discord-muted",
          )}
        >
          #{t(channels[id].name)}
        </button>
      ))}
    </div>
  );
}

function Sidebar({
  active,
  seen,
  onOpen,
}: {
  active: ChannelId;
  seen: ChannelId[];
  onOpen: (id: ChannelId) => void;
}) {
  const t = useT();

  return (
    <div className="flex flex-col border-white/8 border-r bg-discord-embed p-3 text-discord-text max-md:hidden">
      <p className="border-white/8 border-b px-2 pb-3 font-semibold text-white">
        {t("Yeecord 示範伺服器")}
      </p>
      <p className="mt-2 mb-1 px-2 font-semibold text-discord-muted text-xs uppercase">
        {t("文字頻道")}
      </p>
      <div className="flex flex-col gap-0.5">
        {CHANNEL_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onOpen(id)}
            className={clsx(
              "group relative flex cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 text-start transition-colors",
              id === active
                ? "bg-white/10 font-medium text-white"
                : "text-discord-muted hover:bg-white/5 hover:text-discord-text",
            )}
          >
            {!seen.includes(id) && (
              <span className="-left-2 absolute h-2 w-1 rounded-r-full bg-white" />
            )}
            <HashIcon className="size-4 shrink-0" />
            <span className="truncate">{t(channels[id].name)}</span>
            {!seen.includes(id) && (
              <span className="ms-auto size-2 rounded-full bg-discord-danger" />
            )}
          </button>
        ))}
      </div>
      <p className="mt-4 mb-1 px-2 font-semibold text-discord-muted text-xs uppercase">
        {t("語音頻道")}
      </p>
      <div className="flex items-center gap-1.5 px-2 py-1 text-discord-muted">
        <Volume2Icon className="size-4 shrink-0" />
        {t("建立語音頻道")}
      </div>
      <div className="flex items-center gap-2 px-2 py-1 pl-7 text-discord-muted text-sm">
        <span className="size-2 rounded-full bg-discord-green" />
        {t("阿龍的頻道 · 3 人在聊")}
      </div>
      <div className="mt-auto flex items-center gap-2.5 rounded-lg bg-black/25 p-2">
        <img
          src="/img/logo.svg"
          alt=""
          className="size-8 rounded-full bg-discord-avatar p-0.5"
        />
        <div className="min-w-0 leading-tight">
          <p className="truncate font-medium text-sm text-white">{t(BOT_NAME)}</p>
          <p className="text-discord-muted text-xs">
            {t("陪 350,000 個伺服器玩耍中")}
          </p>
        </div>
      </div>
    </div>
  );
}
