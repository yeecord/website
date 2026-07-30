"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, GripVertical, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DiscordSurface } from "~/components/mdx/discord";
import type { Locale } from "~/i18n";
import { localized } from "~/i18n/translate";
import { cn } from "~/utils/cn";

const T = {
  "zh-tw": {
    roles: ["管理員", "幹部", "活動通知", "遊戲玩家"],
    bot: "YEE式機器龍",
    rolesTitle: "伺服器設定 → 身分組",
    dragHint: "把我拖到要給的身分組上面",
    dragDone: "這樣就對了！",
    rolesCaption: "機器龍只能給予排在自己「下面」的身分組",
    permissionTitle: "頻道設定 → 權限 → @everyone",
    permissions: [
      { name: "檢視頻道", enabled: true },
      { name: "發送訊息", enabled: false },
    ],
    permissionCaption:
      "「檢視頻道」開、「發送訊息」關，就是一個大家看得到但只有管理員能發言的頻道",
  },
  "zh-cn": {
    roles: ["管理员", "干部", "活动通知", "游戏玩家"],
    bot: "YEE式機器龍",
    rolesTitle: "服务器设置 → 身份组",
    dragHint: "把我拖到要给的身份组上面",
    dragDone: "这样就对了！",
    rolesCaption: "机器龙只能给予排在自己「下面」的身份组",
    permissionTitle: "频道设置 → 权限 → @everyone",
    permissions: [
      { name: "查看频道", enabled: true },
      { name: "发送消息", enabled: false },
    ],
    permissionCaption:
      "「查看频道」开、「发送消息」关，就是一个大家看得到但只有管理员能发言的频道",
  },
} satisfies Partial<Record<Locale, unknown>>;

const roleColors = ["#e67e22", "#3498db", "#2ecc71", "#9b59b6"];

function useLoop(steps: number, interval = 1600) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((current) => (current + 1) % steps);
    }, interval);

    return () => clearInterval(timer);
  }, [steps, interval]);

  return step;
}

export function RoleOrderDemo({ locale = "zh-tw" }: { locale?: Locale }) {
  const t = localized(T, locale);
  const step = useLoop(2, 2200);
  const roles = t.roles.map((name, i) => ({ name, color: roleColors[i] }));
  const botRole = { name: t.bot, color: "var(--color-discord-blurple)" };
  const list =
    step === 0
      ? [...roles, botRole]
      : [...roles.slice(0, 2), botRole, ...roles.slice(2)];

  return (
    <DiscordSurface className="text-sm">
      <p className="mb-3 font-semibold text-white">{t.rolesTitle}</p>
      <div className="flex flex-col gap-1.5">
        {list.map((role) => (
          <motion.div
            key={role.name}
            layout
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={cn(
              "flex items-center gap-2 rounded-md bg-discord-embed px-3 py-2",
              role === botRole &&
                cn(
                  "ring-2 transition-shadow duration-500",
                  step === 0 ? "ring-discord-blurple" : "ring-discord-green",
                ),
            )}
          >
            <GripVertical className="size-4 text-discord-muted" />
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: role.color }}
            />
            {role.name}
            {role === botRole && (
              <span
                className={cn(
                  "ml-auto text-xs transition-colors duration-500",
                  step === 0 ? "text-discord-muted" : "text-discord-green",
                )}
              >
                {step === 0 ? t.dragHint : t.dragDone}
              </span>
            )}
          </motion.div>
        ))}
      </div>
      <p className="mt-3 text-xs text-discord-muted">{t.rolesCaption}</p>
    </DiscordSurface>
  );
}

export function ChannelPermissionDemo({
  locale = "zh-tw",
  title,
  permissions,
  caption,
}: {
  locale?: Locale;
  title?: string;
  permissions?: { name: string; enabled: boolean }[];
  caption?: string;
}) {
  const t = localized(T, locale);
  const rows = permissions ?? t.permissions;
  const step = useLoop(rows.length + 1, 1800);

  return (
    <DiscordSurface className="text-sm">
      <p className="mb-3 font-semibold text-white">{title ?? t.permissionTitle}</p>
      <div className="flex flex-col gap-2">
        {rows.map((permission, index) => {
          const done = step > index;

          return (
            <div
              key={permission.name}
              className="flex items-center justify-between rounded-md bg-discord-embed px-3 py-2"
            >
              {permission.name}
              <div className="flex overflow-hidden rounded-md border border-discord-secondary">
                <AnimatePresence initial={false}>
                  <Cell
                    active={done && !permission.enabled}
                    className="bg-discord-danger"
                  >
                    <X className="size-4" />
                  </Cell>
                  <Cell active={!done} className="bg-discord-secondary">
                    <span className="px-1 text-xs">／</span>
                  </Cell>
                  <Cell
                    active={done && permission.enabled}
                    className="bg-discord-success"
                  >
                    <Check className="size-4" />
                  </Cell>
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-discord-muted">
        {caption ?? t.permissionCaption}
      </p>
    </DiscordSurface>
  );
}

function Cell({
  active,
  className,
  children,
}: {
  active: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <motion.span
      animate={{ opacity: active ? 1 : 0.35 }}
      className={cn(
        "flex w-8 items-center justify-center py-1 text-white",
        active ? className : "bg-transparent",
      )}
    >
      {children}
    </motion.span>
  );
}
