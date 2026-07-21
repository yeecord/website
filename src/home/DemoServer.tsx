"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { HashIcon, Volume2Icon } from "lucide-react";
import { type ReactNode, useState } from "react";
import {
  DiscordEmbed,
  DiscordMessage,
  SlashCommand,
} from "@/components/mdx/discord";

export function DemoServer() {
  return (
    <div className="z-[2] mt-24 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
          進來參觀一下
        </h2>
        <p className="text-lg text-muted-foreground">
          下面這些都是真的指令，按鈕也真的能按，玩玩看。
        </p>
      </div>
      <motion.div
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        initial={{ opacity: 0, y: 32, rotate: -0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="grid overflow-hidden rounded-xl border bg-discord-bg shadow-xl md:grid-cols-[15rem_1fr]"
      >
        <Sidebar />
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2 border-white/8 border-b px-4 py-3 text-discord-text">
            <HashIcon className="size-5 text-discord-muted" />
            <span className="font-semibold text-white">展示間</span>
            <span className="text-discord-muted text-sm max-sm:hidden">
              機器龍的日常
            </span>
          </div>
          <div className="flex flex-col gap-4 p-4 text-discord-text text-sm">
            <p className="text-discord-muted text-xs">
              — 有新成員加入，機器龍自動接待 —
            </p>
            <DiscordMessage>
              <DiscordEmbed
                title="👋 歡迎 阿龍的粉絲！"
                color="var(--color-primary)"
              >
                <p>歡迎來到伺服器，先挑個身分組，讓大家認識你。</p>
              </DiscordEmbed>
              <RolePicker />
            </DiscordMessage>
            <p className="text-discord-muted text-xs">
              — 管理員辦抽獎，一條指令的事 —
            </p>
            <SlashCommand
              name="lottery"
              description="舉辦抽獎"
              options={[
                { name: "獎品", value: "Nitro 一個月" },
                { name: "得獎人數", value: "3" },
              ]}
            />
            <DiscordMessage>
              <DiscordEmbed
                title="🎉 抽獎開始"
                color="var(--color-discord-fuchsia)"
              >
                <p>獎品：Nitro 一個月，按下面的按鈕參加！</p>
              </DiscordEmbed>
              <Lottery />
            </DiscordMessage>
            <p className="text-discord-muted text-xs">— 掛機的人在餵恐龍 —</p>
            <DiscordMessage author="阿龍的粉絲" bot={false} color="#e8a33d">
              <p>/find-food</p>
            </DiscordMessage>
            <DiscordMessage>
              <DiscordEmbed
                title="🍳 Yee 的小店"
                color="var(--color-discord-gold)"
              >
                <p>Yee 剛從河邊回來，袋子裝了七成滿，看起來心情不錯。</p>
              </DiscordEmbed>
              <FindFoodButtons />
            </DiscordMessage>
          </div>
        </div>
      </motion.div>
      <p className="text-muted-foreground">
        歡迎訊息、等級系統這些設定，在
        <a
          href="https://dash.yeecord.com"
          target="_blank"
          rel="noreferrer"
          className="mx-1 text-primary hover:underline"
        >
          控制面板
        </a>
        點一點就改好，不用背任何設定指令。
      </p>
    </div>
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

function RolePicker() {
  const [picked, setPicked] = useState<string>();
  const roles = ["🎮 遊戲仔", "🌙 夜貓子", "🎨 創作者"];

  return (
    <div className="flex flex-wrap gap-1.5">
      {roles.map((role) => (
        <ChatButton
          key={role}
          variant={picked === role ? "primary" : "secondary"}
          selected={picked === role}
          onClick={() => setPicked(role)}
        >
          {role}
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
            已領取 {picked}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function Lottery() {
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
        {joined ? "已參加 ✅" : "參加抽獎"}
      </ChatButton>
      <ChatButton>
        目前{" "}
        <motion.span
          key={count}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          className="inline-block font-semibold"
        >
          {count}
        </motion.span>{" "}
        人
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
  const [status, setStatus] = useState<string>();

  return (
    <div className="flex flex-wrap gap-1.5">
      <ChatButton
        variant="primary"
        onClick={() => setStatus("Yee 揹起袋子出門了，明天回來收成！")}
      >
        帶牠去找吃的
      </ChatButton>
      <ChatButton
        variant="success"
        onClick={() => setStatus("下鍋！煮出了「河鮮味噌鍋」，Yee 眼睛都亮了。")}
      >
        開煮
      </ChatButton>
      <ChatButton onClick={() => setStatus("Yee 吃得很開心，感情 +1 ❤️")}>
        餵牠
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
            {status}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="flex flex-col gap-1 border-white/8 border-r bg-discord-embed p-3 text-discord-text max-md:hidden">
      <p className="border-white/8 border-b px-2 pb-3 font-semibold text-white">
        Yeecord 示範伺服器
      </p>
      <p className="mt-2 px-2 font-semibold text-discord-muted text-xs uppercase">
        文字頻道
      </p>
      <Channel active>展示間</Channel>
      <Channel>新人報到</Channel>
      <Channel>抽獎區</Channel>
      <Channel>yee-的小店</Channel>
      <p className="mt-3 px-2 font-semibold text-discord-muted text-xs uppercase">
        語音頻道
      </p>
      <Channel voice>點我開房間</Channel>
      <div className="flex items-center gap-2 px-2 py-1 pl-7 text-discord-muted text-sm">
        <span className="size-2 rounded-full bg-discord-green" />
        阿龍的房間 · 3 人在聊
      </div>
    </div>
  );
}

function Channel({
  active,
  voice,
  children,
}: {
  active?: boolean;
  voice?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        active
          ? "flex items-center gap-1.5 rounded bg-white/10 px-2 py-1 font-medium text-white"
          : "flex items-center gap-1.5 rounded px-2 py-1 text-discord-muted"
      }
    >
      {voice ? (
        <Volume2Icon className="size-4 shrink-0" />
      ) : (
        <HashIcon className="size-4 shrink-0" />
      )}
      <span className="truncate">{children}</span>
    </div>
  );
}
