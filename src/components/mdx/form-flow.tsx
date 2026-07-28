"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Hash, Lock } from "lucide-react";
import { DiscordSurface } from "~/components/mdx/discord";
import type { Locale } from "~/i18n";
import { cn } from "~/utils/cn";
import { ClickHint, Scene, StepDots, useLoop } from "~/components/mdx/flow";

const T = {
  "zh-tw": {
    placeholder: "在這裡輸入",
    flow: {
      steps: ["按下按鈕", "填寫表單", "私人討論串"],
      channel: "檢舉區",
      panelTitle: "📋 檢舉玩家",
      panelNote: "濫用、外掛檢舉專用",
      cta: "我要檢舉",
      modalTitle: "檢舉玩家",
      who: "被檢舉人是誰？",
      what: "發生什麼事？",
      story: "在語音頻道開外掛還嗆人……",
      where: "事發頻道",
      whereValue: "語音",
      submit: "送出",
      thread: "#0042 阿貓",
      threadTag: "私人討論串",
      member: "@阿貓",
      staff: "@管理組",
      ticketTitle: "📋 檢舉玩家 #0042",
      close: "結案",
      caption: "成員只要按按鈕、填完送出，剩下的機器龍包辦",
    },
    builder: {
      steps: ["建立表單", "加題目", "發佈面板"],
      title: "📋 檢舉玩家 (#3)",
      empty: "（還沒有題目）",
      questions: [
        "1. 被檢舉人是誰？（短答、必填）",
        "2. 發生什麼事？（段落、必填）",
      ],
      published: "🟢 已發佈到 #檢舉區",
      unpublished: "⚪ 未發佈",
      notify: "通知：@管理組",
      buttons: ["新增問題", "刪除問題", "發佈面板", "停用"],
      caption: "整個過程都在同一張管理卡上，卡片原地更新",
    },
  },
  "zh-cn": {
    placeholder: "在这里输入",
    flow: {
      steps: ["按下按钮", "填写表单", "私密子区"],
      channel: "举报区",
      panelTitle: "📋 举报玩家",
      panelNote: "滥用、外挂举报专用",
      cta: "我要举报",
      modalTitle: "举报玩家",
      who: "被举报人是谁？",
      what: "发生什么事？",
      story: "在语音频道开外挂还骂人……",
      where: "事发频道",
      whereValue: "语音",
      submit: "提交",
      thread: "#0042 阿猫",
      threadTag: "私密子区",
      member: "@阿猫",
      staff: "@管理组",
      ticketTitle: "📋 举报玩家 #0042",
      close: "结案",
      caption: "成员只要按按钮、填完提交，剩下的机器龙包办",
    },
    builder: {
      steps: ["创建表单", "加题目", "发布面板"],
      title: "📋 举报玩家 (#3)",
      empty: "（还没有题目）",
      questions: [
        "1. 被举报人是谁？（短答、必填）",
        "2. 发生什么事？（段落、必填）",
      ],
      published: "🟢 已发布到 #举报区",
      unpublished: "⚪ 未发布",
      notify: "通知：@管理组",
      buttons: ["新增问题", "删除问题", "发布面板", "停用"],
      caption: "整个过程都在同一张管理卡上，卡片原地更新",
    },
  },
} satisfies Record<Locale, unknown>;

function ModalField({
  label,
  value,
  placeholder,
  select,
  multiline,
}: {
  label: string;
  value?: string;
  placeholder: string;
  select?: boolean;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase text-discord-muted">
        {label}
      </p>
      <div
        className={cn(
          "flex items-center justify-between rounded bg-discord-input px-2.5 py-1.5",
          multiline && "h-14 items-start",
        )}
      >
        <span className={value ? "text-discord-text" : "text-discord-placeholder"}>
          {value ?? placeholder}
        </span>
        {select ? <ChevronDown className="size-4 text-discord-muted" /> : null}
      </div>
    </div>
  );
}

export function FormFlowDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = T[locale].flow;
  const [step, setStep] = useLoop(t.steps.length);

  return (
    <DiscordSurface className="text-sm">
      <StepDots labels={t.steps} step={step} onPick={setStep} />
      <div className="min-h-52">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <Scene id={0}>
              <p className="mb-2 flex items-center gap-1 text-discord-muted">
                <Hash className="size-4" />
                {t.channel}
              </p>
              <div className="max-w-md rounded border-l-4 border-discord-blurple bg-discord-embed p-3">
                <p className="font-semibold text-white">{t.panelTitle}</p>
                <p className="mt-1 text-discord-muted">{t.panelNote}</p>
              </div>
              <span className="relative mt-2 inline-flex">
                <span className="rounded bg-discord-blurple px-3 py-1.5 font-medium text-white">
                  {t.cta}
                </span>
                <ClickHint className="-right-1 -bottom-1" />
              </span>
            </Scene>
          )}
          {step === 1 && (
            <Scene id={1}>
              <div className="mx-auto max-w-sm rounded-lg bg-discord-embed p-4 shadow-lg">
                <p className="mb-3 font-semibold text-white">{t.modalTitle}</p>
                <div className="space-y-2.5">
                  <ModalField
                    label={t.who}
                    value="BadGuy#1234"
                    placeholder={T[locale].placeholder}
                  />
                  <ModalField
                    label={t.what}
                    value={t.story}
                    placeholder={T[locale].placeholder}
                    multiline
                  />
                  <ModalField
                    label={t.where}
                    value={t.whereValue}
                    placeholder={T[locale].placeholder}
                    select
                  />
                </div>
                <span className="relative mt-3 inline-flex">
                  <span className="rounded bg-discord-blurple px-4 py-1.5 font-medium text-white">
                    {t.submit}
                  </span>
                  <ClickHint className="-right-1 -bottom-1" />
                </span>
              </div>
            </Scene>
          )}
          {step === 2 && (
            <Scene id={2}>
              <p className="mb-2 flex items-center gap-1 text-discord-muted">
                <Lock className="size-4" />
                {t.thread}
                <span className="ml-1 rounded bg-discord-input px-1.5 py-px text-[10px]">
                  {t.threadTag}
                </span>
              </p>
              <p className="mb-2">
                <span className="rounded bg-discord-pill px-1 text-discord-pill-foreground">
                  {t.member}
                </span>{" "}
                <span className="rounded bg-discord-pill px-1 text-discord-pill-foreground">
                  {t.staff}
                </span>
              </p>
              <div className="max-w-md rounded border-l-4 border-discord-blurple bg-discord-embed p-3">
                <p className="font-semibold text-white">{t.ticketTitle}</p>
                <p className="mt-1.5 font-semibold text-white">{t.who}</p>
                <p className="text-discord-muted">BadGuy#1234</p>
                <p className="mt-1.5 font-semibold text-white">{t.what}</p>
                <p className="text-discord-muted">{t.story}</p>
              </div>
              <span className="mt-2 inline-flex rounded bg-discord-danger px-3 py-1.5 font-medium text-white">
                {t.close}
              </span>
            </Scene>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-3 text-xs text-discord-muted">{t.caption}</p>
    </DiscordSurface>
  );
}

export function FormBuilderDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = T[locale].builder;
  const [step, setStep] = useLoop(t.steps.length);
  const questions = step === 0 ? [t.empty] : t.questions;

  return (
    <DiscordSurface className="text-sm">
      <StepDots labels={t.steps} step={step} onPick={setStep} />
      <div className="rounded border-l-4 border-discord-blurple bg-discord-embed p-3">
        <p className="font-semibold text-white">{t.title}</p>
        <motion.p
          layout
          className={cn(
            "mt-0.5 transition-colors duration-300",
            step === 2 ? "text-discord-green" : "text-discord-muted",
          )}
        >
          {step === 2 ? t.published : t.unpublished}
        </motion.p>
        <p className="text-discord-muted">{t.notify}</p>
        <div className="mt-2 space-y-1">
          <AnimatePresence initial={false}>
            {questions.map((line) => (
              <motion.p
                key={line}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={cn(
                  line.startsWith("（")
                    ? "text-discord-placeholder"
                    : "text-discord-text",
                )}
              >
                {line}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {t.buttons.map((btn, index) => (
            <span
              key={btn}
              className={cn(
                "relative rounded px-2.5 py-1 text-xs font-medium text-white transition-opacity duration-300",
                index === 2 ? "bg-discord-success" : "bg-discord-secondary",
                step === 0 && index !== 0 && "opacity-40",
              )}
            >
              {btn}
              {step === 0 && index === 0 ? (
                <ClickHint className="-right-1 -bottom-1" />
              ) : null}
              {step === 1 && index === 2 ? (
                <ClickHint className="-right-1 -bottom-1" />
              ) : null}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-discord-muted">{t.caption}</p>
    </DiscordSurface>
  );
}
