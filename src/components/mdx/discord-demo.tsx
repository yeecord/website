"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, GripVertical, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

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

const roles = [
  { name: "管理員", color: "#e67e22" },
  { name: "幹部", color: "#3498db" },
  { name: "活動通知", color: "#2ecc71" },
  { name: "遊戲玩家", color: "#9b59b6" },
];

const botRole = { name: "YEE式機器龍", color: "var(--color-discord-blurple)" };

export function RoleOrderDemo() {
  const step = useLoop(2, 2200);
  const list = step === 0 ? [...roles.slice(0, 2), botRole, ...roles.slice(2)] : [botRole, ...roles];

  return (
    <div className="not-prose my-4 rounded-lg border bg-discord-bg p-4 text-sm text-discord-text">
      <p className="mb-3 font-semibold text-white">伺服器設定 → 身分組</p>
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
                {step === 0 ? "把我拖到最上面" : "這樣就對了！"}
              </span>
            )}
          </motion.div>
        ))}
      </div>
      <p className="mt-3 text-xs text-discord-muted">
        機器龍只能給予排在自己「下面」的身分組
      </p>
    </div>
  );
}

const permissions = [
  { name: "檢視頻道", enabled: true },
  { name: "發送訊息", enabled: false },
];

export function ChannelPermissionDemo() {
  const step = useLoop(3, 1800);

  return (
    <div className="not-prose my-4 rounded-lg border bg-discord-bg p-4 text-sm text-discord-text">
      <p className="mb-3 font-semibold text-white">頻道設定 → 權限 → @everyone</p>
      <div className="flex flex-col gap-2">
        {permissions.map((permission, index) => {
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
        「檢視頻道」開、「發送訊息」關，就是一個大家看得到但只有管理員能發言的頻道
      </p>
    </div>
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
