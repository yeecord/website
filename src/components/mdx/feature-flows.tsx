"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Lock, Volume2, X } from "lucide-react";
import { cn } from "~/utils/cn";
import { ClickHint, FlowFrame, Scene, useLoop } from "~/components/mdx/flow";
import type { Locale } from "~/i18n";
import { localized } from "~/i18n/translate";

const T = {
  "zh-tw": {
    autoChannels: {
      steps: ["加入入口頻道", "生出專屬頻道", "沒人就回收"],
      caption: "入口只有一個，頻道用多少生多少，不用手動清",
      entry: "創建頻道",
      member: "阿貓",
      channel: "阿貓的頻道",
      recycling: "阿貓離開了，頻道即將自動刪除……",
    },
    lockChannel: {
      steps: ["上鎖", "沒密碼進不去", "輸入密碼加入"],
      caption: "密碼對了才拿得到進入權限，不用一個個設定成員權限",
      channel: "幹部頻道",
      leader: "團長",
      member: "阿貓",
      denied: "阿貓想加入，但沒有進入權限",
      allowed: "密碼正確，阿貓可以進來了",
    },
    roleMenu: {
      steps: ["點按鈕領取", "再點一次取消"],
      caption: "成員自己領、自己退，管理員不用再手動發身分組",
      prompt: "點下面的按鈕領取你的身分組！",
      role: "🔔 活動通知",
      member: "阿貓",
    },
    giveaway: {
      steps: ["點按鈕參加", "確認參加成功", "時間到自動開獎"],
      caption: "參加只要一顆按鈕，開獎時間到機器龍自己來",
      title: "🎉 Nitro 抽獎",
      ended: "已結束",
      pending: "7 天後抽出 3 位得獎者",
      join: "點我參加",
      joined: "成功參加「Nitro 抽獎」，只有你看得到這則訊息",
      congrats: "🎉 恭喜",
      winners: ["@阿貓", "@小龍", "@路過的"],
      prize: "獲得 Nitro！",
    },
    poll: {
      steps: ["填表單發起", "成員投票", "圖片即時更新"],
      caption: "每一票都會重畫結果圖片，不用等結束才知道戰況",
      formTitle: "發起投票",
      titleLabel: "標題",
      question: "晚餐吃什麼？",
      optionsLabel: "選項（一行一個）",
      options: ["火鍋", "燒肉", "拉麵"],
      submit: "送出",
      vote: "投票",
    },
  },
  "zh-cn": {
    autoChannels: {
      steps: ["加入入口频道", "生出专属频道", "没人就回收"],
      caption: "入口只有一个，频道用多少生多少，不用手动清",
      entry: "创建频道",
      member: "阿猫",
      channel: "阿猫的频道",
      recycling: "阿猫离开了，频道即将自动删除……",
    },
    lockChannel: {
      steps: ["上锁", "没密码进不去", "输入密码加入"],
      caption: "密码对了才拿得到进入权限，不用一个个设置成员权限",
      channel: "干部频道",
      leader: "团长",
      member: "阿猫",
      denied: "阿猫想加入，但没有进入权限",
      allowed: "密码正确，阿猫可以进来了",
    },
    roleMenu: {
      steps: ["点按钮领取", "再点一次取消"],
      caption: "成员自己领、自己退，管理员不用再手动发身份组",
      prompt: "点下面的按钮领取你的身份组！",
      role: "🔔 活动通知",
      member: "阿猫",
    },
    giveaway: {
      steps: ["点按钮参加", "确认参加成功", "时间到自动开奖"],
      caption: "参加只要一颗按钮，开奖时间到机器龙自己来",
      title: "🎉 Nitro 抽奖",
      ended: "已结束",
      pending: "7 天后抽出 3 位中奖者",
      join: "点我参加",
      joined: "成功参加「Nitro 抽奖」，只有你看得到这条消息",
      congrats: "🎉 恭喜",
      winners: ["@阿猫", "@小龙", "@路过的"],
      prize: "获得 Nitro！",
    },
    poll: {
      steps: ["填表单发起", "成员投票", "图片实时更新"],
      caption: "每一票都会重画结果图片，不用等结束才知道战况",
      formTitle: "发起投票",
      titleLabel: "标题",
      question: "晚餐吃什么？",
      optionsLabel: "选项（一行一个）",
      options: ["火锅", "烧肉", "拉面"],
      submit: "提交",
      vote: "投票",
    },
  },
} satisfies Partial<Record<Locale, unknown>>;

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

export function AutoChannelsDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale).autoChannels;
  const [step, setStep] = useLoop(t.steps.length);

  return (
    <FlowFrame
      labels={t.steps}
      step={step}
      onPick={setStep}
      caption={t.caption}
    >
      <div className="space-y-2">
        <VoiceChannel
          name={t.entry}
          members={step === 0 ? [t.member] : []}
        />
        <AnimatePresence>
          {step > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <VoiceChannel
                name={t.channel}
                members={step === 1 ? [t.member] : []}
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
            {t.recycling}
          </motion.p>
        )}
      </div>
    </FlowFrame>
  );
}

export function LockChannelDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale).lockChannel;
  const [step, setStep] = useLoop(t.steps.length);

  return (
    <FlowFrame
      labels={t.steps}
      step={step}
      onPick={setStep}
      caption={t.caption}
    >
      <AnimatePresence mode="wait">
        {step === 0 && (
          <Scene id={0}>
            <div className="mb-2 rounded bg-discord-input px-3 py-2 text-discord-text">
              <span className="font-semibold text-white">/lock-channel setup</span>{" "}
              <span className="rounded border border-discord-option-border/60 bg-discord-option px-1.5">
                #{t.channel}
              </span>{" "}
              <span className="rounded border border-discord-option-border/60 bg-discord-option px-1.5">
                ••••••
              </span>
            </div>
            <VoiceChannel name={t.channel} locked members={[t.leader]} />
          </Scene>
        )}
        {step === 1 && (
          <Scene id={1}>
            <VoiceChannel name={t.channel} locked members={[t.leader]} />
            <p className="mt-2 flex items-center gap-1.5 text-discord-danger">
              <X className="size-4" />
              {t.denied}
            </p>
          </Scene>
        )}
        {step === 2 && (
          <Scene id={2}>
            <div className="mb-2 rounded bg-discord-input px-3 py-2 text-discord-text">
              <span className="font-semibold text-white">/lock-channel join</span>{" "}
              <span className="rounded border border-discord-option-border/60 bg-discord-option px-1.5">
                #{t.channel}
              </span>{" "}
              <span className="rounded border border-discord-option-border/60 bg-discord-option px-1.5">
                ••••••
              </span>
            </div>
            <VoiceChannel
              name={t.channel}
              locked
              members={[t.leader, t.member]}
            />
            <p className="mt-2 flex items-center gap-1.5 text-discord-green">
              <Check className="size-4" />
              {t.allowed}
            </p>
          </Scene>
        )}
      </AnimatePresence>
    </FlowFrame>
  );
}

export function RoleMenuDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale).roleMenu;
  const [step, setStep] = useLoop(t.steps.length, 2600);

  return (
    <FlowFrame
      labels={t.steps}
      step={step}
      onPick={setStep}
      caption={t.caption}
      minHeightClass="min-h-32"
    >
      <div className="max-w-md rounded border-l-4 border-discord-blurple bg-discord-embed p-3">
        <p className="text-discord-text">{t.prompt}</p>
        <span className="relative mt-2 inline-flex">
          <span
            className={cn(
              "rounded px-3 py-1.5 font-medium text-white transition-colors duration-300",
              step === 0 ? "bg-discord-secondary" : "bg-discord-blurple",
            )}
          >
            {t.role}
          </span>
          <ClickHint className="-right-1 -bottom-1" />
        </span>
      </div>
      <p className="mt-2 flex items-center gap-1.5">
        <span className="flex size-5 items-center justify-center rounded-full bg-discord-avatar text-[10px] font-semibold text-discord-bg">
          {t.member.slice(-1)}
        </span>
        {t.member}
        <AnimatePresence>
          {step === 1 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="rounded bg-discord-pill px-1.5 py-px text-xs text-discord-pill-foreground"
            >
              {t.role}
            </motion.span>
          )}
        </AnimatePresence>
      </p>
    </FlowFrame>
  );
}

export function GiveawayFlowDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale).giveaway;
  const [step, setStep] = useLoop(t.steps.length);

  return (
    <FlowFrame
      labels={t.steps}
      step={step}
      onPick={setStep}
      caption={t.caption}
    >
      <div className="max-w-md rounded border-l-4 border-discord-fuchsia bg-discord-embed p-3">
        <p className="font-semibold text-white">{t.title}</p>
        <p className="mt-1 text-discord-muted">
          {step === 2 ? t.ended : t.pending}
        </p>
      </div>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <Scene id={0}>
            <span className="relative mt-2 inline-flex">
              <span className="rounded bg-discord-blurple px-3 py-1.5 font-medium text-white">
                {t.join}
              </span>
              <ClickHint className="-right-1 -bottom-1" />
            </span>
          </Scene>
        )}
        {step === 1 && (
          <Scene id={1}>
            <p className="mt-2 flex items-center gap-1.5 text-discord-green">
              <Check className="size-4" />
              {t.joined}
            </p>
          </Scene>
        )}
        {step === 2 && (
          <Scene id={2}>
            <p className="mt-2 text-discord-text">
              {t.congrats}{" "}
              {t.winners.map((winner) => (
                <span key={winner}>
                  <span className="rounded bg-discord-pill px-1 text-discord-pill-foreground">
                    {winner}
                  </span>{" "}
                </span>
              ))}
              {t.prize}
            </p>
          </Scene>
        )}
      </AnimatePresence>
    </FlowFrame>
  );
}

const pollValues = [
  { before: 38, after: 52 },
  { before: 34, after: 34 },
  { before: 28, after: 14 },
];

export function PollFlowDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale).poll;
  const [step, setStep] = useLoop(t.steps.length);

  return (
    <FlowFrame
      labels={t.steps}
      step={step}
      onPick={setStep}
      caption={t.caption}
    >
      <AnimatePresence mode="wait">
        {step === 0 && (
          <Scene id={0}>
            <div className="mx-auto max-w-sm rounded-lg bg-discord-embed p-4 shadow-lg">
              <p className="mb-3 font-semibold text-white">{t.formTitle}</p>
              <p className="mb-1 text-xs font-semibold uppercase text-discord-muted">
                {t.titleLabel}
              </p>
              <div className="mb-2.5 rounded bg-discord-input px-2.5 py-1.5">
                {t.question}
              </div>
              <p className="mb-1 text-xs font-semibold uppercase text-discord-muted">
                {t.optionsLabel}
              </p>
              <div className="rounded bg-discord-input px-2.5 py-1.5">
                {t.options.map((option) => (
                  <span key={option}>
                    {option}
                    <br />
                  </span>
                ))}
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
        {step !== 0 && (
          <Scene id={1}>
            <div className="max-w-md rounded border-l-4 border-discord-blurple bg-discord-embed p-3">
              <p className="mb-2 font-semibold text-white">🗳️ {t.question}</p>
              <div className="space-y-1.5">
                {t.options.map((option, i) => {
                  const bar = pollValues[i];
                  const value = step === 1 ? bar.before : bar.after;

                  return (
                    <div key={option} className="flex items-center gap-2">
                      <span className="w-10 shrink-0">{option}</span>
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
                {t.vote}
              </span>
              {step === 1 ? <ClickHint className="-right-1 -bottom-1" /> : null}
            </span>
          </Scene>
        )}
      </AnimatePresence>
    </FlowFrame>
  );
}
