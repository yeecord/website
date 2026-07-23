"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, Volume2, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { ClickHint, FlowFrame, Scene, useLoop } from "@/components/mdx/flow";

function VoiceChannel({
  name,
  locked,
  members = [],
  dimmed,
}: {
  name: string;
  locked?: boolean;
  members?: string[];
  dimmed?: boolean;
}) {
  return (
    <motion.div layout className={cn(dimmed && "opacity-50")}>
      <p className="flex items-center gap-1.5">
        {locked ? (
          <Lock className="size-4 text-discord-muted" />
        ) : (
          <Volume2 className="size-4 text-discord-muted" />
        )}
        {name}
      </p>
      <AnimatePresence initial={false}>
        {members.map((member) => (
          <motion.p
            key={member}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="ml-5 mt-0.5 flex items-center gap-1.5 text-discord-muted"
          >
            <span className="flex size-4 items-center justify-center rounded-full bg-discord-avatar text-[9px] font-semibold text-discord-bg">
              {member.slice(0, 1)}
            </span>
            {member}
          </motion.p>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

const autoChannelSteps = ["加入入口頻道", "生出專屬頻道", "沒人就回收"];

export function AutoChannelsDemo() {
  const [step, setStep] = useLoop(autoChannelSteps.length);

  return (
    <FlowFrame
      labels={autoChannelSteps}
      step={step}
      onPick={setStep}
      caption="入口只有一個，頻道用多少生多少，不用手動清"
    >
      <div className="space-y-2">
        <VoiceChannel name="創建頻道" members={step === 0 ? ["阿貓"] : []} />
        <AnimatePresence>
          {step > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <VoiceChannel
                name="阿貓的頻道"
                members={step === 1 ? ["阿貓"] : []}
                dimmed={step === 2}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {step === 2 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-discord-muted"
          >
            阿貓離開了，頻道即將自動刪除……
          </motion.p>
        )}
      </div>
    </FlowFrame>
  );
}

const lockSteps = ["上鎖", "沒密碼進不去", "輸入密碼加入"];

export function LockChannelDemo() {
  const [step, setStep] = useLoop(lockSteps.length);

  return (
    <FlowFrame
      labels={lockSteps}
      step={step}
      onPick={setStep}
      caption="密碼對了才拿得到進入權限，不用一個個設定成員權限"
    >
      <AnimatePresence mode="wait">
        {step === 0 && (
          <Scene id={0}>
            <div className="mb-2 rounded bg-discord-input px-3 py-2 text-discord-text">
              <span className="font-semibold text-white">/lock-channel setup</span>{" "}
              <span className="rounded border border-discord-option-border/60 bg-discord-option px-1.5">
                #幹部頻道
              </span>{" "}
              <span className="rounded border border-discord-option-border/60 bg-discord-option px-1.5">
                ••••••
              </span>
            </div>
            <VoiceChannel name="幹部頻道" locked members={["團長"]} />
          </Scene>
        )}
        {step === 1 && (
          <Scene id={1}>
            <VoiceChannel name="幹部頻道" locked members={["團長"]} />
            <p className="mt-2 flex items-center gap-1.5 text-discord-danger">
              <X className="size-4" />
              阿貓想加入，但沒有進入權限
            </p>
          </Scene>
        )}
        {step === 2 && (
          <Scene id={2}>
            <div className="mb-2 rounded bg-discord-input px-3 py-2 text-discord-text">
              <span className="font-semibold text-white">/lock-channel join</span>{" "}
              <span className="rounded border border-discord-option-border/60 bg-discord-option px-1.5">
                #幹部頻道
              </span>{" "}
              <span className="rounded border border-discord-option-border/60 bg-discord-option px-1.5">
                ••••••
              </span>
            </div>
            <VoiceChannel name="幹部頻道" locked members={["團長", "阿貓"]} />
            <p className="mt-2 flex items-center gap-1.5 text-discord-green">
              <Check className="size-4" />
              密碼正確，阿貓可以進來了
            </p>
          </Scene>
        )}
      </AnimatePresence>
    </FlowFrame>
  );
}

const roleMenuSteps = ["點按鈕領取", "再點一次取消"];

export function RoleMenuDemo() {
  const [step, setStep] = useLoop(roleMenuSteps.length, 2600);

  return (
    <FlowFrame
      labels={roleMenuSteps}
      step={step}
      onPick={setStep}
      caption="成員自己領、自己退，管理員不用再手動發身分組"
      minHeightClass="min-h-32"
    >
      <div className="max-w-md rounded border-l-4 border-discord-blurple bg-discord-embed p-3">
        <p className="text-discord-text">點下面的按鈕領取你的身分組！</p>
        <span className="relative mt-2 inline-flex">
          <span
            className={cn(
              "rounded px-3 py-1.5 font-medium text-white transition-colors duration-300",
              step === 0 ? "bg-discord-secondary" : "bg-discord-blurple",
            )}
          >
            🔔 活動通知
          </span>
          <ClickHint className="-right-1 -bottom-1" />
        </span>
      </div>
      <p className="mt-2 flex items-center gap-1.5">
        <span className="flex size-5 items-center justify-center rounded-full bg-discord-avatar text-[10px] font-semibold text-discord-bg">
          貓
        </span>
        阿貓
        <AnimatePresence>
          {step === 1 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="rounded bg-discord-pill px-1.5 py-px text-xs text-discord-pill-foreground"
            >
              🔔 活動通知
            </motion.span>
          )}
        </AnimatePresence>
      </p>
    </FlowFrame>
  );
}

const giveawaySteps = ["點按鈕參加", "確認參加成功", "時間到自動開獎"];

export function GiveawayFlowDemo() {
  const [step, setStep] = useLoop(giveawaySteps.length);

  return (
    <FlowFrame
      labels={giveawaySteps}
      step={step}
      onPick={setStep}
      caption="參加只要一顆按鈕，開獎時間到機器龍自己來"
    >
      <div className="max-w-md rounded border-l-4 border-discord-fuchsia bg-discord-embed p-3">
        <p className="font-semibold text-white">🎉 Nitro 抽獎</p>
        <p className="mt-1 text-discord-muted">
          {step === 2 ? "已結束" : "7 天後抽出 3 位得獎者"}
        </p>
      </div>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <Scene id={0}>
            <span className="relative mt-2 inline-flex">
              <span className="rounded bg-discord-blurple px-3 py-1.5 font-medium text-white">
                點我參加
              </span>
              <ClickHint className="-right-1 -bottom-1" />
            </span>
          </Scene>
        )}
        {step === 1 && (
          <Scene id={1}>
            <p className="mt-2 flex items-center gap-1.5 text-discord-green">
              <Check className="size-4" />
              成功參加「Nitro 抽獎」，只有你看得到這則訊息
            </p>
          </Scene>
        )}
        {step === 2 && (
          <Scene id={2}>
            <p className="mt-2 text-discord-text">
              🎉 恭喜{" "}
              <span className="rounded bg-discord-pill px-1 text-discord-pill-foreground">
                @阿貓
              </span>{" "}
              <span className="rounded bg-discord-pill px-1 text-discord-pill-foreground">
                @小龍
              </span>{" "}
              <span className="rounded bg-discord-pill px-1 text-discord-pill-foreground">
                @路過的
              </span>{" "}
              獲得 Nitro！
            </p>
          </Scene>
        )}
      </AnimatePresence>
    </FlowFrame>
  );
}

const pollSteps = ["填表單發起", "成員投票", "圖片即時更新"];

const pollBars = [
  { name: "火鍋", before: 38, after: 52 },
  { name: "燒肉", before: 34, after: 34 },
  { name: "拉麵", before: 28, after: 14 },
];

export function PollFlowDemo() {
  const [step, setStep] = useLoop(pollSteps.length);

  return (
    <FlowFrame
      labels={pollSteps}
      step={step}
      onPick={setStep}
      caption="每一票都會重畫結果圖片，不用等結束才知道戰況"
    >
      <AnimatePresence mode="wait">
        {step === 0 && (
          <Scene id={0}>
            <div className="mx-auto max-w-sm rounded-lg bg-discord-embed p-4 shadow-lg">
              <p className="mb-3 font-semibold text-white">發起投票</p>
              <p className="mb-1 text-xs font-semibold uppercase text-discord-muted">
                標題
              </p>
              <div className="mb-2.5 rounded bg-discord-input px-2.5 py-1.5">
                晚餐吃什麼？
              </div>
              <p className="mb-1 text-xs font-semibold uppercase text-discord-muted">
                選項（一行一個）
              </p>
              <div className="rounded bg-discord-input px-2.5 py-1.5">
                火鍋
                <br />
                燒肉
                <br />
                拉麵
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
        {step !== 0 && (
          <Scene id={1}>
            <div className="max-w-md rounded border-l-4 border-discord-blurple bg-discord-embed p-3">
              <p className="mb-2 font-semibold text-white">🗳️ 晚餐吃什麼？</p>
              <div className="space-y-1.5">
                {pollBars.map((bar) => {
                  const value = step === 1 ? bar.before : bar.after;

                  return (
                    <div key={bar.name} className="flex items-center gap-2">
                      <span className="w-10 shrink-0">{bar.name}</span>
                      <span className="h-4 flex-1 overflow-hidden rounded-sm bg-discord-input">
                        <motion.span
                          className="block h-full rounded-sm bg-discord-blurple"
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </span>
                      <span className="w-10 shrink-0 text-right text-discord-muted">
                        {value}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <span className="relative mt-2 inline-flex">
              <span className="rounded bg-discord-blurple px-3 py-1.5 font-medium text-white">
                投票
              </span>
              {step === 1 ? <ClickHint className="-right-1 -bottom-1" /> : null}
            </span>
          </Scene>
        )}
      </AnimatePresence>
    </FlowFrame>
  );
}
