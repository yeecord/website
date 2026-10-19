"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
import {
  BOT_NAME,
  BotAvatar,
  DiscordMessage,
  DiscordModal,
  DiscordSurface,
} from "~/components/mdx/discord";
import { chatCopy, EASE_OUT, MessageEnter } from "~/components/mdx/flow";
import { PollCard } from "~/components/mdx/poll-card";
import type { Locale } from "~/i18n";
import { localized } from "~/i18n/translate";
import { cn } from "~/utils/cn";

interface Suggestion {
  command: string;
  description: string;
}

const T = {
  "zh-tw": {
    channel: "一般",
    topic: "隨便聊聊的地方",
    asker: "阿明",
    question: "今天晚上吃什麼啊",
    placeholder: "傳送訊息到 #一般",
    matching: "的指令",
    all: [
      { command: "/poll create", description: "發起投票" },
      { command: "/giveaway create", description: "建立一個抽獎活動" },
      { command: "/form create", description: "建立一張新表單" },
      { command: "/find-food", description: "陪 Yee 出門找吃的、煮一桌、餵牠" },
    ] as Suggestion[],
    filtered: [
      { command: "/poll create", description: "發起投票" },
      { command: "/poll edit", description: "編輯投票內容" },
      { command: "/poll end", description: "結束一場投票" },
    ] as Suggestion[],
    picked: {
      command: "/poll create",
      description: "發起投票",
      option: "max_votes",
      optionDescription: "每人最多可投幾個選項，預設 1",
    },
    // the fields `/poll create` actually opens, labels and all
    modal: {
      title: "建立投票",
      fields: [
        { label: "投票標題", value: "晚餐吃什麼" },
        {
          label: "選項",
          description: "一行一個選項（2-18 個）",
          value: "滷肉飯\n牛肉麵",
        },
        {
          label: "多久後結束（選填）",
          description: "例如 30m、2h、3d，留空 = 手動結束",
          value: "2h",
        },
      ],
      cancel: "取消",
      submit: "送出",
    },
    poll: {
      title: "晚餐吃什麼",
      options: ["滷肉飯", "牛肉麵"],
      startedAgo: "幾秒前",
      endsIn: "2 小時後",
    },
    captions: [
      "點一下最下面的輸入框",
      "打一個斜線，指令清單就跳出來了",
      "繼續打字會即時篩選，不用背指令名稱",
      "選好按 Enter",
      "跳出視窗填內容，不用把參數擠在一行",
      "送出，機器龍就回覆了",
    ],
  },
  "zh-cn": {
    channel: "综合",
    topic: "随便聊聊的地方",
    asker: "阿明",
    question: "今天晚上吃什么啊",
    placeholder: "发送消息到 #综合",
    matching: "的命令",
    all: [
      { command: "/poll create", description: "发起投票" },
      { command: "/giveaway create", description: "创建一个抽奖活动" },
      { command: "/form create", description: "创建一张新表单" },
      { command: "/find-food", description: "陪 Yee 出门找吃的、煮一桌、喂它" },
    ] as Suggestion[],
    filtered: [
      { command: "/poll create", description: "发起投票" },
      { command: "/poll edit", description: "编辑投票内容" },
      { command: "/poll end", description: "结束一场投票" },
    ] as Suggestion[],
    picked: {
      command: "/poll create",
      description: "发起投票",
      option: "max_votes",
      optionDescription: "每人最多可投几个选项，默认 1",
    },
    modal: {
      title: "创建投票",
      fields: [
        { label: "投票标题", value: "晚餐吃什么" },
        {
          label: "选项",
          description: "一行一个选项（2-18 个）",
          value: "卤肉饭\n牛肉面",
        },
        {
          label: "多久后结束（选填）",
          description: "例如 30m、2h、3d，留空 = 手动结束",
          value: "2h",
        },
      ],
      cancel: "取消",
      submit: "提交",
    },
    poll: {
      title: "晚餐吃什么",
      options: ["卤肉饭", "牛肉面"],
      startedAgo: "几秒前",
      endsIn: "2 小时后",
    },
    captions: [
      "点一下最下面的输入框",
      "打一个斜杠，命令列表就跳出来了",
      "继续打字会实时筛选，不用背命令名称",
      "选好按 Enter",
      "跳出窗口填内容，不用把参数挤在一行",
      "提交，机器龙就回复了",
    ],
  },
} satisfies Partial<Record<Locale, unknown>>;

type Tour = (typeof T)["zh-tw"];

interface Frame {
  /// What sits in the input: plain text while typing, a command pill once picked.
  typed: string;
  picked?: boolean;
  query?: string;
  suggestions?: Suggestion[];
  modal?: boolean;
  sent?: boolean;
  /// Index into the captions, which several typing frames share.
  caption: number;
  hold: number;
}

/** Discord filters the list on every keystroke, so the query is typed a letter at a time. */
const KEYSTROKE = 120;

function script(t: Tour): Frame[] {
  const typing = ["/p", "/po", "/pol", "/poll"].map(
    (typed, index, all): Frame => ({
      typed,
      query: typed,
      suggestions: t.filtered,
      caption: 2,
      hold: index === all.length - 1 ? 2400 : KEYSTROKE,
    }),
  );

  return [
    { typed: "", caption: 0, hold: 1600 },
    { typed: "/", query: "/", suggestions: t.all, caption: 1, hold: 2400 },
    ...typing,
    { typed: t.picked.command, picked: true, caption: 3, hold: 1800 },
    { typed: "", modal: true, caption: 4, hold: 4000 },
    { typed: "", sent: true, caption: 5, hold: 3600 },
  ];
}

const popupClass =
  "absolute inset-x-4 bottom-full mb-2 overflow-hidden rounded-lg border border-discord-hairline bg-discord-embed shadow-xl";

export function SlashCommandTour({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale);
  const chat = chatCopy(locale);
  const frames = script(t);
  const reduced = useReducedMotion() ?? false;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) {
      setStep(frames.length - 1);

      return;
    }

    const timer = setTimeout(
      () => setStep((current) => (current + 1) % frames.length),
      frames[step]?.hold ?? 2000,
    );

    return () => clearTimeout(timer);
  }, [reduced, step, frames]);

  const frame = frames[step] ?? frames[0];

  if (!frame) return null;

  return (
    <div className="not-prose my-6">
      <DiscordSurface
        channel={t.channel}
        topic={t.topic}
        className="relative p-0 text-sm"
      >
        <div className="flex min-h-[30rem] flex-col justify-end gap-4 px-4 py-4">
          <DiscordMessage author={t.asker} color="#4e5058" time={chat.time}>
            <p>{t.question}</p>
          </DiscordMessage>

          {frame.sent ? (
            <MessageEnter>
              <DiscordMessage
                time={chat.time}
                command={chat.command(t.asker, t.picked.command.slice(1))}
              >
                <PollCard
                  locale={locale}
                  title={t.poll.title}
                  creator={t.asker}
                  startedAgo={t.poll.startedAgo}
                  endsIn={t.poll.endsIn}
                  options={t.poll.options.map((name) => ({ name, votes: 0 }))}
                />
              </DiscordMessage>
            </MessageEnter>
          ) : null}
        </div>

        <div className="relative px-4 pb-4">
          {frame.suggestions ? (
            <div className={popupClass}>
              <div className="px-3 py-2 text-xs font-semibold tracking-wide text-discord-muted">
                符合 {frame.query} {t.matching}
              </div>
              {frame.suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.command}
                  className={cn(
                    "flex items-center gap-3 px-3 py-1.5",
                    index === 0 && "bg-discord-hover",
                  )}
                >
                  <BotAvatar className="size-7" />
                  <div className="min-w-0 flex-1 leading-tight">
                    <div className="truncate font-semibold text-white">
                      {suggestion.command}
                    </div>
                    <div className="truncate text-xs text-discord-muted">
                      {suggestion.description}
                    </div>
                  </div>
                  <span className="hidden shrink-0 text-xs text-discord-muted sm:block">
                    {BOT_NAME}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {frame.picked ? (
            <div className={popupClass}>
              <div className="flex items-center gap-2 px-3 py-2">
                <BotAvatar className="size-5" />
                <span className="font-semibold text-white">
                  {t.picked.command}
                </span>
                <span className="truncate text-xs text-discord-muted">
                  {t.picked.description}
                </span>
                <X className="ml-auto size-4 shrink-0 text-discord-muted" />
              </div>
              <div className="flex items-baseline gap-3 bg-discord-hover px-3 py-2">
                <span className="shrink-0 font-semibold text-white">
                  {t.picked.option}
                </span>
                <span className="truncate text-discord-muted">
                  {t.picked.optionDescription}
                </span>
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-3 rounded-lg bg-discord-input px-4 py-2.5">
            <Plus className="size-6 shrink-0 rounded-full bg-discord-icon p-1 text-discord-input" />
            <div className="relative flex min-w-0 flex-1 flex-wrap items-center gap-1.5 py-0.5">
              {frame.typed ? (
                frame.picked ? (
                  <span className="rounded bg-discord-pill px-1.5 py-0.5 font-medium text-discord-pill-foreground">
                    {frame.typed}
                  </span>
                ) : (
                  <span className="text-discord-text">{frame.typed}</span>
                )
              ) : (
                <span className="pointer-events-none absolute text-discord-placeholder">
                  {t.placeholder}
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
        <AnimatePresence>
          {frame.modal ? (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.12, ease: "easeOut" },
              }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="w-full max-w-md"
              >
                <DiscordModal {...t.modal} />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DiscordSurface>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          {t.captions.map((caption, index) => (
            <span
              key={caption}
              className={cn(
                "size-1.5 rounded-full transition-colors",
                index === frame.caption
                  ? "bg-discord-blurple"
                  : "bg-discord-secondary",
              )}
            />
          ))}
        </div>
        <p
          aria-live="polite"
          className="m-0 flex items-center gap-1 text-sm text-fd-muted-foreground"
        >
          <ChevronRight className="size-4 shrink-0" />
          {t.captions[frame.caption]}
        </p>
      </div>
    </div>
  );
}
