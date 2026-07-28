"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Gift,
  Image as ImageIcon,
  Plus,
  Send,
  Smile,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DiscordSurface } from "@/components/mdx/discord";
import { cn } from "@/utils/cn";

interface Suggestion {
  command: string;
  description: string;
  /// The option names Discord previews after the command, greyed out until filled.
  params?: string[];
}

const ALL: Suggestion[] = [
  { command: "/poll create", description: "建立投票", params: ["問題", "選項"] },
  { command: "/giveaway create", description: "建立抽獎活動", params: ["標題"] },
  { command: "/form create", description: "建立表單" },
  { command: "/auto-channels setup", description: "設定動態語音頻道" },
  { command: "/find-food", description: "帶 Yee 去找吃的" },
];

const FILTERED: Suggestion[] = [
  { command: "/poll create", description: "建立投票", params: ["問題", "選項"] },
  { command: "/poll edit", description: "改投票的設定", params: ["投票"] },
  { command: "/poll end", description: "結束投票並公布結果", params: ["投票"] },
];

interface Frame {
  typed: string;
  suggestions?: Suggestion[];
  options?: boolean;
  sent?: boolean;
  caption: string;
  hold: number;
}

const SCRIPT: Frame[] = [
  { typed: "", caption: "點一下最下面的輸入框", hold: 1600 },
  {
    typed: "/",
    suggestions: ALL,
    caption: "打一個斜線，指令清單就跳出來了",
    hold: 2400,
  },
  {
    typed: "/poll",
    suggestions: FILTERED,
    caption: "繼續打字會即時篩選，不用背指令名稱",
    hold: 2400,
  },
  { typed: "/poll create", options: true, caption: "選好指令，接著填選項", hold: 2400 },
  {
    typed: "/poll create",
    options: true,
    sent: true,
    caption: "按 Enter 送出，機器龍就回覆了",
    hold: 3600,
  },
];

const LAST = SCRIPT.length - 1;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export function SlashCommandTour() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) {
      setStep(LAST);

      return;
    }

    const timer = setTimeout(
      () => setStep((current) => (current + 1) % SCRIPT.length),
      SCRIPT[step]?.hold ?? 2000,
    );

    return () => clearTimeout(timer);
  }, [reduced, step]);

  const frame = SCRIPT[step] ?? SCRIPT[0];

  if (!frame) return null;

  return (
    <div className="not-prose my-6">
      <DiscordSurface channel="一般" topic="隨便聊聊的地方" className="p-0">
        <div className="flex min-h-56 flex-col justify-end gap-3 px-4 py-4">
          <AnimatePresence>
            {frame.sent ? (
              <motion.div
                key="reply"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="flex gap-3"
              >
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-discord-blurple font-semibold text-white">
                  Y
                </div>
                <div className="min-w-0 flex-1 text-sm text-discord-text">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-white">YEE 式機器龍</span>
                    <span className="rounded bg-discord-blurple px-1 py-px text-[10px] font-semibold uppercase text-white">
                      App
                    </span>
                  </div>
                  <div className="mt-1 max-w-sm rounded border-l-4 border-discord-blurple bg-discord-embed p-3">
                    <p className="m-0 font-semibold text-white">晚餐吃什麼</p>
                    <p className="m-0 mt-1 text-discord-muted">
                      滷肉飯 · 牛肉麵 · 隨便都好
                    </p>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span className="rounded bg-discord-secondary px-3 py-1.5 text-xs font-medium text-white">
                      滷肉飯
                    </span>
                    <span className="rounded bg-discord-secondary px-3 py-1.5 text-xs font-medium text-white">
                      牛肉麵
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="relative px-4 pb-4">
          <AnimatePresence>
            {frame.suggestions ? (
              <motion.div
                key="picker"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute inset-x-4 bottom-full mb-2 overflow-hidden rounded-lg bg-discord-embed shadow-xl"
              >
                <div className="border-b border-black/30 px-3 py-2.5">
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="font-medium text-white">
                      {frame.suggestions[0]?.command}
                    </span>
                    {frame.suggestions[0]?.params?.map((param) => (
                      <span key={param} className="text-sm text-discord-muted">
                        {param}
                      </span>
                    ))}
                  </div>
                  <p className="m-0 mt-0.5 text-sm text-discord-muted">
                    {frame.suggestions[0]?.description}
                  </p>
                </div>
                {frame.suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.command}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2",
                      index === 0 && "bg-white/5",
                    )}
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded bg-discord-blurple text-[10px] font-bold text-white">
                      Y
                    </span>
                    <span className="shrink-0 font-medium text-white">
                      {suggestion.command}
                    </span>
                    <span className="truncate text-sm text-discord-muted">
                      {suggestion.description}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-2 border-t border-black/30 px-3 py-2 text-xs text-discord-muted">
                  <span>YEE 式機器龍</span>
                  <span className="hidden sm:inline">
                    <kbd className="rounded bg-discord-option px-1 py-0.5">Tab</kbd>
                    <span className="mx-1">或</span>
                    <kbd className="rounded bg-discord-option px-1 py-0.5">Enter</kbd>
                    <span className="ml-1">選擇</span>
                  </span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="flex items-center gap-3 rounded-lg bg-discord-input px-4 py-2.5">
            <Plus className="size-5 shrink-0 rounded-full bg-discord-icon p-0.5 text-discord-input" />
            <div className="flex min-w-0 flex-1 items-center gap-2 py-0.5">
              {frame.typed ? (
                <>
                  <span className="rounded bg-discord-pill px-1.5 py-0.5 font-medium text-discord-pill-foreground">
                    {frame.typed}
                  </span>
                  {frame.options
                    ? [
                        { name: "問題", value: "晚餐吃什麼" },
                        { name: "選項", value: "滷肉飯, 牛肉麵" },
                      ].map((option, index) => (
                        <span
                          key={option.name}
                          className={cn(
                            "flex items-baseline gap-1",
                            index > 0 && "hidden sm:flex",
                          )}
                        >
                          <span className="rounded bg-discord-pill/60 px-1 py-0.5 text-sm text-discord-pill-foreground">
                            {option.name}:
                          </span>
                          <span className="text-sm text-discord-text">
                            {option.value}
                          </span>
                        </span>
                      ))
                    : null}
                </>
              ) : (
                <span className="text-discord-placeholder">傳送訊息到 #一般</span>
              )}
              {!frame.sent && !reduced ? (
                <motion.span
                  aria-hidden
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                  className="inline-block h-4 w-px bg-white"
                />
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-3 text-discord-icon">
              <Gift className="size-5" />
              <ImageIcon className="hidden size-5 sm:block" />
              <Smile className="size-5" />
              <Send className="size-5 text-discord-blurple" />
            </div>
          </div>
        </div>
      </DiscordSurface>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          {SCRIPT.map((entry, index) => (
            <span
              key={entry.caption}
              className={cn(
                "size-1.5 rounded-full transition-colors",
                index === step ? "bg-discord-blurple" : "bg-discord-secondary",
              )}
            />
          ))}
        </div>
        <p
          aria-live="polite"
          className="m-0 flex items-center gap-1 text-sm text-fd-muted-foreground"
        >
          <ChevronRight className="size-4 shrink-0" />
          {frame.caption}
        </p>
      </div>
    </div>
  );
}
