"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Hash, Lock } from "lucide-react";
import { cn } from "@/utils/cn";
import { ClickHint, Scene, StepDots, useLoop } from "@/components/mdx/flow";

function ModalField({
  label,
  value,
  select,
  multiline,
}: {
  label: string;
  value?: string;
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
          {value ?? "在這裡輸入"}
        </span>
        {select ? <ChevronDown className="size-4 text-discord-muted" /> : null}
      </div>
    </div>
  );
}

const memberSteps = ["按下按鈕", "填寫表單", "私人討論串"];

export function FormFlowDemo() {
  const [step, setStep] = useLoop(memberSteps.length);

  return (
    <div className="not-prose my-4 rounded-lg border bg-discord-bg p-4 text-sm text-discord-text">
      <StepDots labels={memberSteps} step={step} onPick={setStep} />
      <div className="min-h-52">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <Scene id={0}>
              <p className="mb-2 flex items-center gap-1 text-discord-muted">
                <Hash className="size-4" />
                檢舉區
              </p>
              <div className="max-w-md rounded border-l-4 border-discord-blurple bg-discord-embed p-3">
                <p className="font-semibold text-white">📋 檢舉玩家</p>
                <p className="mt-1 text-discord-muted">濫用、外掛檢舉專用</p>
              </div>
              <span className="relative mt-2 inline-flex">
                <span className="rounded bg-discord-blurple px-3 py-1.5 font-medium text-white">
                  我要檢舉
                </span>
                <ClickHint className="-right-1 -bottom-1" />
              </span>
            </Scene>
          )}
          {step === 1 && (
            <Scene id={1}>
              <div className="mx-auto max-w-sm rounded-lg bg-discord-embed p-4 shadow-lg">
                <p className="mb-3 font-semibold text-white">檢舉玩家</p>
                <div className="space-y-2.5">
                  <ModalField label="被檢舉人是誰？" value="BadGuy#1234" />
                  <ModalField
                    label="發生什麼事？"
                    value="在語音頻道開外掛還嗆人……"
                    multiline
                  />
                  <ModalField label="事發頻道" value="語音" select />
                </div>
                <span className="relative mt-3 inline-flex">
                  <span className="rounded bg-discord-blurple px-4 py-1.5 font-medium text-white">
                    送出
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
                #0042 阿貓
                <span className="ml-1 rounded bg-discord-input px-1.5 py-px text-[10px]">
                  私人討論串
                </span>
              </p>
              <p className="mb-2">
                <span className="rounded bg-discord-pill px-1 text-discord-pill-foreground">
                  @阿貓
                </span>{" "}
                <span className="rounded bg-discord-pill px-1 text-discord-pill-foreground">
                  @管理組
                </span>
              </p>
              <div className="max-w-md rounded border-l-4 border-discord-blurple bg-discord-embed p-3">
                <p className="font-semibold text-white">📋 檢舉玩家 #0042</p>
                <p className="mt-1.5 font-semibold text-white">被檢舉人是誰？</p>
                <p className="text-discord-muted">BadGuy#1234</p>
                <p className="mt-1.5 font-semibold text-white">發生什麼事？</p>
                <p className="text-discord-muted">在語音頻道開外掛還嗆人……</p>
              </div>
              <span className="mt-2 inline-flex rounded bg-discord-danger px-3 py-1.5 font-medium text-white">
                結案
              </span>
            </Scene>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-3 text-xs text-discord-muted">
        成員只要按按鈕、填完送出，剩下的機器龍包辦
      </p>
    </div>
  );
}

const builderSteps = ["建立表單", "加題目", "發佈面板"];

const builderQuestions = [
  ["（還沒有題目）"],
  ["1. 被檢舉人是誰？（短答、必填）", "2. 發生什麼事？（段落、必填）"],
  ["1. 被檢舉人是誰？（短答、必填）", "2. 發生什麼事？（段落、必填）"],
];

export function FormBuilderDemo() {
  const [step, setStep] = useLoop(builderSteps.length);

  return (
    <div className="not-prose my-4 rounded-lg border bg-discord-bg p-4 text-sm text-discord-text">
      <StepDots labels={builderSteps} step={step} onPick={setStep} />
      <div className="rounded border-l-4 border-discord-blurple bg-discord-embed p-3">
        <p className="font-semibold text-white">📋 檢舉玩家 (#3)</p>
        <motion.p
          layout
          className={cn(
            "mt-0.5 transition-colors duration-300",
            step === 2 ? "text-discord-green" : "text-discord-muted",
          )}
        >
          {step === 2 ? "🟢 已發佈到 #檢舉區" : "⚪ 未發佈"}
        </motion.p>
        <p className="text-discord-muted">通知：@管理組</p>
        <div className="mt-2 space-y-1">
          <AnimatePresence initial={false}>
            {builderQuestions[step]?.map((line) => (
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
          {["新增問題", "刪除問題", "發佈面板", "停用"].map((btn, index) => (
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
      <p className="mt-3 text-xs text-discord-muted">
        整個過程都在同一張管理卡上，卡片原地更新
      </p>
    </div>
  );
}
