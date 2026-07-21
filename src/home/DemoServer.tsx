"use client";

import { motion } from "framer-motion";
import { HashIcon, Volume2Icon } from "lucide-react";
import type { ReactNode } from "react";
import {
  DiscordButton,
  DiscordEmbed,
  DiscordMessage,
  SlashCommand,
} from "@/components/mdx/discord";

export function DemoServer() {
  return (
    <div className="z-[2] mt-32 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
          進來參觀一下
        </h2>
        <p className="text-lg text-muted-foreground">
          下面這些都是真的指令，裝好就能照著玩。
        </p>
      </div>
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 24 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4 }}
        className="grid overflow-hidden rounded-xl border bg-discord-bg md:grid-cols-[15rem_1fr]"
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
          <div className="p-4">
            <div className="flex flex-col gap-4 text-discord-text text-sm">
              <p className="text-discord-muted text-xs">
                — 有新成員加入，機器龍自動接待 —
              </p>
              <DiscordMessage>
                <DiscordEmbed
                  title="👋 歡迎 阿龍的粉絲！"
                  color="var(--color-primary)"
                >
                  <p>歡迎來到伺服器，先去領個身分組，讓大家認識你。</p>
                </DiscordEmbed>
                <p>
                  <DiscordButton variant="primary">🎮 遊戲仔</DiscordButton>{" "}
                  <DiscordButton>🌙 夜貓子</DiscordButton>{" "}
                  <DiscordButton>🎨 創作者</DiscordButton>
                </p>
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
                <p>
                  <DiscordButton variant="primary">參加抽獎</DiscordButton>{" "}
                  <DiscordButton>目前 42 人</DiscordButton>
                </p>
              </DiscordMessage>
              <p className="text-discord-muted text-xs">
                — 掛機的人在餵恐龍 —
              </p>
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
                <p>
                  <DiscordButton variant="primary">帶牠去找吃的</DiscordButton>{" "}
                  <DiscordButton variant="success">開煮</DiscordButton>{" "}
                  <DiscordButton>餵牠</DiscordButton>
                </p>
              </DiscordMessage>
            </div>
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
