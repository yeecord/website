"use client";

import { AnimatePresence } from "motion/react";
import { Check, Hash, Puzzle, Settings, X } from "lucide-react";
import { DiscordSurface } from "~/components/mdx/discord";
import type { Locale } from "~/i18n";
import { localized } from "~/i18n/translate";
import { cn } from "~/utils/cn";
import { ClickHint, Scene, StepDots, useLoop } from "~/components/mdx/flow";

const T = {
  "zh-tw": {
    steps: ["打開整合", "選指令", "加覆寫"],
    settings: "伺服器設定",
    menu: ["總覽", "身分組", "表情符號", "整合"],
    botsTitle: "機器人和應用程式",
    manage: "管理",
    commandsTitle: "指令",
    commandsNote: "點一個指令來調整誰能用、在哪裡能用",
    commands: ["/clear", "/poll", "/giveaway"],
    overridesTitle: "/clear 的權限",
    everyone: "@everyone",
    staff: "@管理組",
    channel: "機器人區",
    channelsLabel: "頻道",
    rolesLabel: "身分組",
    caption: "全程都在 Discord 的伺服器設定裡，改完立即生效",
  },
  "zh-cn": {
    steps: ["打开整合", "选命令", "加覆写"],
    settings: "服务器设置",
    menu: ["总览", "身份组", "表情符号", "整合"],
    botsTitle: "机器人和应用",
    manage: "管理",
    commandsTitle: "命令",
    commandsNote: "点一个命令来调整谁能用、在哪里能用",
    commands: ["/clear", "/poll", "/giveaway"],
    overridesTitle: "/clear 的权限",
    everyone: "@everyone",
    staff: "@管理组",
    channel: "机器人区",
    channelsLabel: "频道",
    rolesLabel: "身份组",
    caption: "全程都在 Discord 的服务器设置里，改完立即生效",
  },
} satisfies Partial<Record<Locale, unknown>>;

function OverrideRow({
  icon,
  label,
  allowed,
}: {
  icon?: React.ReactNode;
  label: string;
  allowed: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded bg-discord-input px-2.5 py-1.5">
      <span className="flex items-center gap-1.5 text-discord-text">
        {icon}
        {label}
      </span>
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded",
          allowed ? "bg-discord-success" : "bg-discord-danger",
        )}
      >
        {allowed ? (
          <Check className="size-3.5 text-white" strokeWidth={3} />
        ) : (
          <X className="size-3.5 text-white" strokeWidth={3} />
        )}
      </span>
    </div>
  );
}

export function CommandPermissionsDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale);
  const [step, setStep] = useLoop(t.steps.length);

  return (
    <DiscordSurface className="text-sm">
      <StepDots labels={t.steps} step={step} onPick={setStep} />
      <div className="min-h-52">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <Scene id={0}>
              <p className="mb-2 flex items-center gap-1.5 font-semibold text-white">
                <Settings className="size-4" />
                {t.settings}
              </p>
              <div className="flex max-w-md gap-3">
                <div className="w-28 shrink-0 space-y-0.5">
                  {t.menu.map((item, index) => (
                    <p
                      key={item}
                      className={cn(
                        "rounded px-2 py-1",
                        index === t.menu.length - 1
                          ? "bg-discord-input text-white"
                          : "text-discord-muted",
                      )}
                    >
                      {item}
                    </p>
                  ))}
                </div>
                <div className="flex-1">
                  <p className="mb-1.5 text-xs font-semibold uppercase text-discord-muted">
                    {t.botsTitle}
                  </p>
                  <div className="flex items-center justify-between rounded bg-discord-embed p-2.5">
                    <span className="flex items-center gap-1.5 text-white">
                      <Puzzle className="size-4 text-discord-green" />
                      Yeecord
                    </span>
                    <span className="relative rounded bg-discord-secondary px-2.5 py-1 text-xs font-medium text-white">
                      {t.manage}
                      <ClickHint className="-right-1 -bottom-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Scene>
          )}
          {step === 1 && (
            <Scene id={1}>
              <p className="mb-1 font-semibold text-white">{t.commandsTitle}</p>
              <p className="mb-2 text-xs text-discord-muted">{t.commandsNote}</p>
              <div className="max-w-md space-y-1">
                {t.commands.map((command, index) => (
                  <div
                    key={command}
                    className="flex items-center justify-between rounded bg-discord-embed px-2.5 py-1.5"
                  >
                    <span className="font-mono text-discord-text">{command}</span>
                    {index === 0 && (
                      <span className="relative inline-flex size-4">
                        <ClickHint className="top-0 right-0" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Scene>
          )}
          {step === 2 && (
            <Scene id={2}>
              <p className="mb-2 font-semibold text-white">{t.overridesTitle}</p>
              <div className="max-w-md space-y-3">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase text-discord-muted">
                    {t.rolesLabel}
                  </p>
                  <div className="space-y-1">
                    <OverrideRow label={t.everyone} allowed={false} />
                    <OverrideRow label={t.staff} allowed />
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase text-discord-muted">
                    {t.channelsLabel}
                  </p>
                  <OverrideRow
                    icon={<Hash className="size-4 text-discord-muted" />}
                    label={t.channel}
                    allowed
                  />
                </div>
              </div>
            </Scene>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-3 text-xs text-discord-muted">{t.caption}</p>
    </DiscordSurface>
  );
}
