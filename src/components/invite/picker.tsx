"use client";

import { Check, Server, User } from "lucide-react";
import { useState, type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const CLIENT_ID = "584213384409382953";

const requiredPermissions = [
  "檢視頻道",
  "傳送訊息",
  "閱讀歷史訊息",
  "嵌入連結",
  "附加檔案",
  "使用外部表情符號",
  "新增反應",
];

// https://discord.com/developers/docs/topics/permissions
const requiredBits =
  (1n << 6n) | // ADD_REACTIONS
  (1n << 10n) | // VIEW_CHANNEL
  (1n << 11n) | // SEND_MESSAGES
  (1n << 14n) | // EMBED_LINKS
  (1n << 15n) | // ATTACH_FILES
  (1n << 16n) | // READ_MESSAGE_HISTORY
  (1n << 18n); // USE_EXTERNAL_EMOJIS

interface Feature {
  id: string;
  title: string;
  description: string;
  permissions: { name: string; bit: bigint }[];
}

const features: Feature[] = [
  {
    id: "voice",
    title: "動態語音頻道",
    description: "有人進語音就開一間專屬房間，人走了自動收。",
    permissions: [
      { name: "管理頻道", bit: 1n << 4n },
      { name: "連接", bit: 1n << 20n },
      { name: "移動成員", bit: 1n << 24n },
    ],
  },
  {
    id: "roles",
    title: "身分組",
    description: "新成員進來自動發，或讓成員自己按按鈕領。",
    permissions: [{ name: "管理身分組", bit: 1n << 28n }],
  },
  {
    id: "messages",
    title: "訊息管理",
    description: "洗版訊息一次清掉，最多一千則。",
    permissions: [{ name: "管理訊息", bit: 1n << 13n }],
  },
  {
    id: "ticket",
    title: "私人頻道",
    description: "成員按一顆按鈕，就能私下找管理員。",
    permissions: [
      { name: "管理討論串", bit: 1n << 34n },
      { name: "建立私人討論串", bit: 1n << 36n },
      { name: "在討論串中傳送訊息", bit: 1n << 38n },
    ],
  },
  {
    id: "defense",
    title: "機器人防禦",
    description: "廣告機器人一發言就封鎖，詐騙圖片自動攔下。",
    permissions: [
      { name: "封鎖成員", bit: 1n << 2n },
      { name: "禁言成員", bit: 1n << 40n },
    ],
  },
];

function inviteUrl(mode: "guild" | "user", selected: Set<string>) {
  if (mode === "user")
    return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&integration_type=1&scope=applications.commands`;

  let bits = requiredBits;

  for (const feature of features) {
    if (!selected.has(feature.id)) continue;

    for (const permission of feature.permissions) bits |= permission.bit;
  }

  return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot+applications.commands&permissions=${bits}`;
}

function Chip({
  muted,
  className,
  children,
}: {
  muted?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-md bg-fd-muted px-2 py-0.5 text-fd-muted-foreground text-xs transition-colors",
        muted && "opacity-50",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
        checked
          ? "border-green-600 bg-green-600 text-white dark:border-green-500 dark:bg-green-500"
          : "border-fd-border bg-fd-background",
      )}
    >
      {checked && <Check className="size-3.5" strokeWidth={3} />}
    </span>
  );
}

export function InvitePicker() {
  const [mode, setMode] = useState<"guild" | "user">("guild");
  const [selected, setSelected] = useState(
    () => new Set(features.map((feature) => feature.id)),
  );

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto flex rounded-lg border bg-fd-muted/50 p-1 font-medium text-sm">
        {(
          [
            ["guild", <Server key="i" className="size-4" />, "裝進伺服器"],
            ["user", <User key="i" className="size-4" />, "裝到我的帳號"],
          ] as const
        ).map(([value, icon, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={cn(
              "flex items-center gap-2 rounded-md px-5 py-2 transition-colors",
              mode === value
                ? "bg-fd-background text-fd-foreground shadow-sm"
                : "text-fd-muted-foreground hover:text-fd-foreground",
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {mode === "guild" ? (
        <>
          <div className="rounded-xl border bg-fd-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">必要權限</h2>
              <span className="text-fd-muted-foreground text-xs">
                一定要帶
              </span>
            </div>
            <p className="mt-1 text-fd-muted-foreground text-sm">
              看得到頻道、說得了話。少了這些，機器龍進來也只能當雕像。
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {requiredPermissions.map((permission) => (
                <Chip key={permission}>{permission}</Chip>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => {
              const checked = selected.has(feature.id);

              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => toggle(feature.id)}
                  aria-pressed={checked}
                  className={cn(
                    "rounded-xl border p-5 text-left transition-colors",
                    checked
                      ? "border-green-600/50 bg-fd-card dark:border-green-500/50"
                      : "bg-fd-card/50 hover:bg-fd-card",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2
                      className={cn(
                        "font-semibold transition-colors",
                        !checked && "text-fd-muted-foreground",
                      )}
                    >
                      {feature.title}
                    </h2>
                    <Checkbox checked={checked} />
                  </div>
                  <p className="mt-1 text-fd-muted-foreground text-sm">
                    {feature.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {feature.permissions.map((permission) => (
                      <Chip key={permission.name} muted={!checked}>
                        {permission.name}
                      </Chip>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-xl border bg-fd-card p-6">
          <h2 className="font-semibold">跟著你走，不用進伺服器</h2>
          <p className="mt-2 text-fd-muted-foreground text-sm">
            裝在自己的 Discord
            帳號上，私訊、群組、任何伺服器都能叫出機器龍。發起投票、查個人卡片、玩找吃的，走到哪用到哪。
          </p>
          <p className="mt-2 text-fd-muted-foreground text-sm">
            這個模式碰不到伺服器設定，所以一個權限都不用給。
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["/poll", "/profile", "/find-food", "/pick", "/bullshit"].map(
              (command) => (
                <Chip key={command} className="font-mono">
                  {command}
                </Chip>
              ),
            )}
          </div>
        </div>
      )}

      <a
        href={inviteUrl(mode, selected)}
        target="_blank"
        rel="noreferrer"
        className={cn(
          buttonVariants({ color: "primary", size: "lg" }),
          "mx-auto px-10",
        )}
      >
        {mode === "guild" ? "帶我回家" : "安裝到我的帳號"}
      </a>
    </div>
  );
}
