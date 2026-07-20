"use client";

import {
  AudioLines,
  Server,
  Shield,
  Target,
  Ticket,
  Trash2,
  User,
  UsersRound,
} from "lucide-react";
import { useState, type ReactNode } from "react";
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
  icon: ReactNode;
  title: string;
  description: string;
  permissions: { name: string; bit: bigint }[];
}

const features: Feature[] = [
  {
    id: "voice",
    icon: <AudioLines />,
    title: "動態語音頻道",
    description: "一個頻道滿足所有人，自動生出專屬語音頻道",
    permissions: [
      { name: "管理頻道", bit: 1n << 4n },
      { name: "連接", bit: 1n << 20n },
      { name: "移動成員", bit: 1n << 24n },
    ],
  },
  {
    id: "roles",
    icon: <UsersRound />,
    title: "身分組",
    description: "新成員自動身分組、自助領取選單、頻道密碼鎖",
    permissions: [{ name: "管理身分組", bit: 1n << 28n }],
  },
  {
    id: "messages",
    icon: <Trash2 />,
    title: "訊息管理",
    description: "大量刪除訊息、清理投票",
    permissions: [{ name: "管理訊息", bit: 1n << 13n }],
  },
  {
    id: "ticket",
    icon: <Ticket />,
    title: "私人頻道",
    description: "成員一鍵開啟私人討論串聯絡管理員",
    permissions: [
      { name: "管理討論串", bit: 1n << 34n },
      { name: "建立私人討論串", bit: 1n << 36n },
      { name: "在討論串中傳送訊息", bit: 1n << 38n },
    ],
  },
  {
    id: "defense",
    icon: <Shield />,
    title: "機器人防禦",
    description: "陷阱頻道、詐騙圖片過濾，自動趕走廣告機器人",
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

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-fd-muted px-2.5 py-1 text-xs text-fd-muted-foreground">
      {children}
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
      <div className="mx-auto flex rounded-lg border bg-fd-card p-1">
        {(
          [
            ["guild", <Server key="i" className="size-4" />, "安裝到伺服器"],
            ["user", <User key="i" className="size-4" />, "安裝到帳號"],
          ] as const
        ).map(([value, icon, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              mode === value
                ? "bg-fd-primary text-fd-primary-foreground"
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
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-semibold">
                <Target className="size-5 text-fd-primary" />
                必要權限
              </div>
              <span className="rounded-full bg-fd-primary/10 px-2.5 py-1 text-xs font-medium text-fd-primary">
                必要
              </span>
            </div>
            <p className="mt-2 text-sm text-fd-muted-foreground">
              讓機器龍能正常運作的基本條件
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {requiredPermissions.map((permission) => (
                <Chip key={permission}>{permission}</Chip>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
                      ? "border-fd-primary/50 bg-fd-card"
                      : "bg-fd-card/50 opacity-60 hover:opacity-90",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 font-semibold [&_svg]:size-5 [&_svg]:text-fd-primary">
                      {feature.icon}
                      {feature.title}
                    </div>
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded border text-xs",
                        checked
                          ? "border-fd-primary bg-fd-primary text-fd-primary-foreground"
                          : "border-fd-border",
                      )}
                    >
                      {checked ? "✓" : ""}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-fd-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {feature.permissions.map((permission) => (
                      <Chip key={permission.name}>{permission.name}</Chip>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-xl border bg-fd-card p-6 text-center text-sm text-fd-muted-foreground">
          裝在你自己的 Discord 帳號上，不用進伺服器也能用。
          <br />
          投票、個人資訊這些指令在私訊、群組私訊、任何伺服器都能使用，不需要任何權限。
        </div>
      )}

      <a
        href={inviteUrl(mode, selected)}
        target="_blank"
        rel="noreferrer"
        className="mx-auto rounded-lg bg-fd-primary px-8 py-3 font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
      >
        邀請機器龍 →
      </a>
    </div>
  );
}
