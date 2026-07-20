"use client";

import {
  AudioLines,
  Check,
  Server,
  ShieldCheck,
  Sparkles,
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
    description: "有人進語音就開一間專屬房間，人走了自動收。",
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
    description: "新成員進來自動發，或讓成員自己按按鈕領。",
    permissions: [{ name: "管理身分組", bit: 1n << 28n }],
  },
  {
    id: "messages",
    icon: <Trash2 />,
    title: "訊息管理",
    description: "洗版訊息一次清掉，最多一千則。",
    permissions: [{ name: "管理訊息", bit: 1n << 13n }],
  },
  {
    id: "ticket",
    icon: <Ticket />,
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
    icon: <ShieldCheck />,
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

function Chip({ muted, children }: { muted?: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-0.5 text-xs transition-colors",
        muted
          ? "border-fd-border/50 text-fd-muted-foreground/50"
          : "text-fd-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

function IconTile({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-400/15 to-cyan-500/15 text-green-500 [&_svg]:size-5 dark:text-green-400">
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
    <div className="flex flex-col gap-8">
      <div className="mx-auto flex rounded-full border bg-fd-muted/50 p-1 text-sm font-medium">
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
              "flex items-center gap-2 rounded-full px-5 py-2 transition-all",
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
          <div className="rounded-2xl border bg-fd-card/60 p-6 backdrop-blur">
            <div className="flex items-start gap-4">
              <IconTile>
                <Sparkles />
              </IconTile>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-semibold text-lg">必要權限</h2>
                  <span className="rounded-full bg-green-400/10 px-2.5 py-0.5 text-xs font-medium text-green-500 dark:text-green-400">
                    一定要帶
                  </span>
                </div>
                <p className="mt-1 text-sm text-fd-muted-foreground">
                  看得到頻道、說得了話。少了這些，機器龍進來也只能當雕像。
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {requiredPermissions.map((permission) => (
                    <Chip key={permission}>{permission}</Chip>
                  ))}
                </div>
              </div>
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
                    "group relative rounded-2xl border p-6 text-left transition-all duration-200",
                    checked
                      ? "border-green-400/40 bg-gradient-to-br from-green-400/[0.07] to-cyan-500/[0.07] shadow-[0_0_30px_-12px] shadow-green-400/40"
                      : "bg-fd-card/40 hover:border-fd-muted-foreground/30",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-5 right-5 flex size-6 items-center justify-center rounded-full border transition-all",
                      checked
                        ? "border-transparent bg-gradient-to-br from-green-400 to-cyan-500 text-white"
                        : "border-fd-border text-transparent group-hover:border-fd-muted-foreground/50",
                    )}
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <div className="flex items-start gap-4 pe-10">
                    <IconTile>{feature.icon}</IconTile>
                    <div className="min-w-0">
                      <h2
                        className={cn(
                          "font-semibold text-lg transition-colors",
                          !checked && "text-fd-muted-foreground",
                        )}
                      >
                        {feature.title}
                      </h2>
                      <p className="mt-1 text-sm text-fd-muted-foreground">
                        {feature.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {feature.permissions.map((permission) => (
                          <Chip key={permission.name} muted={!checked}>
                            {permission.name}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border bg-fd-card/60 p-8 backdrop-blur">
          <div className="flex items-start gap-4">
            <IconTile>
              <User />
            </IconTile>
            <div>
              <h2 className="font-semibold text-lg">跟著你走，不用進伺服器</h2>
              <p className="mt-2 text-fd-muted-foreground">
                裝在自己的 Discord
                帳號上，私訊、群組、任何伺服器都能叫出機器龍。
                發起投票、查個人卡片、玩找吃的，走到哪用到哪。
              </p>
              <p className="mt-2 text-fd-muted-foreground">
                這個模式碰不到伺服器設定，所以一個權限都不用給。
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["/poll", "/profile", "/find-food", "/pick", "/bullshit"].map(
                  (command) => (
                    <Chip key={command}>{command}</Chip>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <a
        href={inviteUrl(mode, selected)}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "mx-auto rounded-xl bg-gradient-to-r from-green-400 to-cyan-500 px-10 py-3.5 font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]",
          "shadow-[0_8px_40px_-8px] shadow-green-400/50",
        )}
      >
        {mode === "guild" ? "帶我回家 →" : "安裝到我的帳號 →"}
      </a>
    </div>
  );
}
