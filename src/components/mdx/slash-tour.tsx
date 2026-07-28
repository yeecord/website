"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Gift,
  LayoutGrid,
  Plus,
  Smile,
  Sticker,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DiscordSurface } from "@/components/mdx/discord";
import { cn } from "@/utils/cn";

interface Suggestion {
  command: string;
  description: string;
  app?: string;
}

const ALL: Suggestion[] = [
  { command: "/poll create", description: "建立投票" },
  { command: "/giveaway create", description: "建立抽獎活動" },
  { command: "/form create", description: "建立表單" },
  { command: "/find-food", description: "帶 Yee 去找吃的" },
];

const FILTERED: Suggestion[] = [
  { command: "/poll create", description: "建立投票" },
  { command: "/poll edit", description: "改投票的設定" },
  { command: "/poll end", description: "結束投票並公布結果" },
];

const APP = "YEE 式機器龍";

/// The fields `/poll create` actually opens, labels and all.
const MODAL_FIELDS = [
  { label: "投票標題", value: "晚餐吃什麼" },
  { label: "選項", hint: "一行一個選項(2-18 個)", value: "滷肉飯\n牛肉麵" },
  { label: "多久後結束(選填)", hint: "例如 30m、2h、3d", value: "2h" },
];

interface Frame {
  /// What sits in the input: plain text while typing, a command pill once picked.
  typed: string;
  picked?: boolean;
  query?: string;
  suggestions?: Suggestion[];
  modal?: boolean;
  sent?: boolean;
  caption: string;
  hold: number;
}

const SCRIPT: Frame[] = [
  { typed: "", caption: "點一下最下面的輸入框", hold: 1600 },
  {
    typed: "/",
    query: "/",
    suggestions: ALL,
    caption: "打一個斜線，指令清單就跳出來了",
    hold: 2600,
  },
  {
    typed: "/poll",
    query: "/poll",
    suggestions: FILTERED,
    caption: "繼續打字會即時篩選，不用背指令名稱",
    hold: 2600,
  },
  {
    typed: "/poll create",
    picked: true,
    caption: "選好按 Enter",
    hold: 1800,
  },
  {
    typed: "",
    modal: true,
    caption: "跳出視窗填內容，不用把參數擠在一行",
    hold: 4000,
  },
  {
    typed: "",
    sent: true,
    caption: "送出，機器龍就回覆了",
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

function Avatar({ className }: { className?: string }) {
  return (
    <img
      src="/img/logo.svg"
      alt=""
      className={cn(
        "shrink-0 rounded-full bg-discord-avatar p-0.5",
        className ?? "size-8",
      )}
    />
  );
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
      <DiscordSurface
        channel="一般"
        topic="隨便聊聊的地方"
        className="relative p-0 text-sm"
      >
        <div className="flex min-h-64 flex-col justify-end gap-3 px-4 py-4">
          <div className="flex gap-3 opacity-60">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-discord-secondary font-semibold text-white">
              阿
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-white">阿明</div>
              <div className="mt-0.5">今天晚上吃什麼啊</div>
            </div>
          </div>

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
                <Avatar className="size-9" />
                <div className="min-w-0 flex-1 text-sm text-discord-text">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-white">{APP}</span>
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
          {frame.suggestions ? (
              <motion.div
                key="matching"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                className="absolute inset-x-4 bottom-full mb-2 overflow-hidden rounded-lg bg-discord-embed shadow-xl"
              >
                <div className="px-3 py-2 text-xs font-semibold tracking-wide text-discord-muted">
                  符合 {frame.query} 的指令
                </div>
                {frame.suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.command}
                    className={cn(
                      "flex items-center gap-3 px-3 py-1.5",
                      index === 0 && "bg-white/5",
                    )}
                  >
                    <Avatar className="size-7" />
                    <div className="min-w-0 flex-1 leading-tight">
                      <div className="truncate font-semibold text-white">
                        {suggestion.command}
                      </div>
                      <div className="truncate text-xs text-discord-muted">
                        {suggestion.description}
                      </div>
                    </div>
                    <span className="hidden shrink-0 text-xs text-discord-muted sm:block">
                      {APP}
                    </span>
                  </div>
                ))}
              </motion.div>
            ) : null}

            {frame.picked ? (
              <motion.div
                key="picked"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                className="absolute inset-x-4 bottom-full mb-2 overflow-hidden rounded-lg bg-discord-embed shadow-xl"
              >
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="font-semibold text-white">/poll create</span>
                  <span className="truncate text-xs text-discord-muted">
                    建立投票
                  </span>
                  <X className="ml-auto size-4 shrink-0 text-discord-muted" />
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-3 py-2">
                  <Avatar className="size-7" />
                  <span className="shrink-0 font-semibold text-white">
                    /poll create
                  </span>
                  <span className="text-sm text-discord-muted">問題</span>
                  <span className="truncate rounded bg-discord-option px-1.5 py-0.5 text-sm text-discord-text">
                    晚餐吃什麼
                  </span>
                </div>
              </motion.div>
            ) : null}

          <div className="flex items-center gap-3 rounded-lg bg-discord-input px-4 py-2.5">
            <Plus className="size-6 shrink-0 rounded-full bg-discord-icon p-1 text-discord-input" />
            <div className="relative flex min-w-0 flex-1 flex-wrap items-center gap-1.5 py-0.5">
              {frame.typed ? (
                frame.picked ? (
                  <>
                    <span className="rounded bg-discord-pill px-1.5 py-0.5 font-medium text-discord-pill-foreground">
                      {frame.typed}
                    </span>
                    <span className="text-sm text-discord-muted">問題:</span>
                    <span className="text-sm text-discord-text">晚餐吃什麼</span>
                    <span className="hidden text-sm text-discord-muted sm:inline">
                      選項:
                    </span>
                    <span className="hidden text-sm text-discord-text sm:inline">
                      滷肉飯, 牛肉麵
                    </span>
                  </>
                ) : (
                  <span className="text-discord-text">{frame.typed}</span>
                )
              ) : (
                <span className="pointer-events-none absolute text-discord-placeholder">
                  傳送訊息到 #一般
                </span>
              )}
              {!frame.sent && !reduced ? (
                <motion.span
                  aria-hidden
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    times: [0, 0.5, 0.5, 1],
                  }}
                  className="inline-block h-4 w-px bg-white"
                />
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-3 text-discord-icon">
              <Gift className="size-5" />
              <span className="hidden rounded border-2 border-current px-0.5 text-[9px] font-bold leading-tight sm:block">
                GIF
              </span>
              <Sticker className="size-5" />
              <Smile className="size-5" />
              <LayoutGrid className="hidden size-5 sm:block" />
            </div>
          </div>
        </div>
        {frame.modal ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 px-4">
              <div className="w-full max-w-sm overflow-hidden rounded-md bg-discord-bg shadow-2xl">
                <div className="flex items-center justify-between px-4 pt-4 pb-3">
                  <span className="font-semibold text-white">建立投票</span>
                  <X className="size-4 text-discord-muted" />
                </div>
                <div className="flex flex-col gap-3 px-4 pb-4">
                  {MODAL_FIELDS.map((field) => (
                    <div key={field.label}>
                      <div className="text-xs font-bold text-discord-icon">
                        {field.label}
                        {field.hint ? (
                          <span className="ml-1 font-normal text-discord-muted">
                            {field.hint}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 whitespace-pre-line rounded-sm bg-discord-option px-2.5 py-1.5 text-discord-text">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-4 bg-discord-embed px-4 py-3">
                  <span className="text-discord-text">取消</span>
                  <span className="rounded-sm bg-discord-blurple px-4 py-1.5 font-medium text-white">
                    送出
                  </span>
                </div>
              </div>
            </div>
          ) : null}
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
