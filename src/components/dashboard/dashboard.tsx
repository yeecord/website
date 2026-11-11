"use client";

import { CircleAlert, CircleCheck, CircleDashed, LogOut, RotateCw } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { type Locale, staticPath } from "~/i18n";
import { type Phrase, type Translate, translator } from "~/i18n/translate";
import {
  type ErrorCode,
  type Failure,
  type FeatureStatus,
  type Guild,
  type GuildFeature,
  get,
  type List,
  loginUrl,
  logout as endSession,
  type Named,
} from "./api";

type Panel =
  | { state: "loading" }
  | { state: "ready"; features: GuildFeature[] }
  | { state: "refused"; code: ErrorCode };

type View =
  | { state: "loading" }
  | { state: "signed-out" }
  | { state: "unreachable" }
  | { state: "empty" }
  | { state: "signed-in"; guilds: Guild[]; guild: Guild; panel: Panel };

const featureLabels: Record<GuildFeature["type"], Phrase> = {
  member_notification: "加入通知",
  auto_role: "新成員身分組",
  auto_channels: "動態語音頻道",
  trap_channel: "陷阱頻道",
  scam_filter: "詐騙過濾",
  afk_channel: "掛機頻道",
  giveaway: "抽獎",
};

// https://docs.discord.com/developers/topics/permissions#permissions-bitwise-permission-flags
const permissionLabels: Record<string, Phrase> = {
  view_channel: "檢視頻道",
  send_messages: "傳送訊息",
  manage_channels: "管理頻道",
  manage_roles: "管理身分組",
  connect: "連接",
  move_members: "移動成員",
  ban_members: "封鎖成員",
  moderate_members: "禁言成員",
};

const intlLocales: Record<Locale, string> = {
  "zh-tw": "zh-TW",
  "zh-cn": "zh-CN",
  en: "en",
};

function selectedGuild() {
  return new URLSearchParams(window.location.search).get("guild");
}

/** Substitutes each `{name}` in a phrase with a node, so names and chips sit inside the sentence. */
function fill(template: string, values: Record<string, ReactNode>) {
  return template
    .split(/(\{\w+\})/)
    .map((part, index) =>
      part.startsWith("{") && part.endsWith("}") ? (
        <span key={index}>{values[part.slice(1, -1)]}</span>
      ) : (
        part
      ),
    );
}

export function Dashboard({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const [view, setView] = useState<View>({ state: "loading" });

  const load = useCallback(async () => {
    try {
      const listed = await get<List<Guild>>("/v1/guilds");

      if (!listed.ok) {
        setView({
          state: listed.code === "session_missing" ? "signed-out" : "unreachable",
        });
        return;
      }

      const guilds = listed.body.data;
      const id = selectedGuild();
      const guild = guilds.find((guild) => guild.id === id) ?? guilds[0];

      if (!guild) {
        setView({ state: "empty" });
        return;
      }

      setView({ state: "signed-in", guilds, guild, panel: { state: "loading" } });

      const read = await get<List<GuildFeature>>(`/v1/guilds/${guild.id}/features`);

      if (!read.ok && read.code === "session_missing") {
        setView({ state: "signed-out" });
        return;
      }

      setView({
        state: "signed-in",
        guilds,
        guild,
        panel: read.ok
          ? { state: "ready", features: read.body.data }
          : { state: "refused", code: read.code },
      });
    } catch {
      setView({ state: "unreachable" });
    }
  }, []);

  useEffect(() => {
    load();
    window.addEventListener("popstate", load);

    return () => window.removeEventListener("popstate", load);
  }, [load]);

  const open = (guild: Guild) => {
    const url = new URL(window.location.href);

    url.searchParams.set("guild", guild.id);
    window.history.pushState(null, "", url);
    load();
  };

  const logout = async () => {
    await endSession();
    setView({ state: "signed-out" });
  };

  switch (view.state) {
    case "loading":
      return <Skeleton t={t} />;
    case "unreachable":
      return (
        <Notice title={t("暫時連不上機器龍")} body={t("稍後再重新整理一次。")}>
          <button type="button" onClick={load} className={quiet}>
            <RotateCw className="size-4" aria-hidden />
            {t("再試一次")}
          </button>
        </Notice>
      );
    case "signed-out":
      return <SignIn t={t} />;
    case "empty":
      return (
        <Notice
          title={t("沒有可以管理的伺服器")}
          body={t("這裡只列出你能管理、而且機器龍也在的伺服器。")}
        >
          <a href={staticPath(locale, "/install")} className={primary}>
            {t("安裝機器人")}
          </a>
        </Notice>
      );
    case "signed-in":
      return (
        <div className="grid gap-8 md:grid-cols-[15rem_minmax(0,1fr)]">
          <GuildRail
            t={t}
            guilds={view.guilds}
            current={view.guild}
            onOpen={open}
            onLogout={logout}
          />
          <section aria-live="polite" className="min-w-0">
            <GuildHeading guild={view.guild} />
            {view.panel.state === "loading" && <LedgerSkeleton />}
            {view.panel.state === "refused" && view.panel.code === "internal_error" && (
              <Notice title={t("暫時連不上機器龍")} body={t("稍後再重新整理一次。")} />
            )}
            {view.panel.state === "refused" && view.panel.code !== "internal_error" && (
              <Notice
                title={
                  view.panel.code === "missing_manage_guild"
                    ? t("你已經不能管理這個伺服器")
                    : t("清單裡沒有這個伺服器")
                }
                body={t(
                  "清單只列出你能管理、而且機器龍也在的伺服器。重新登入會更新清單。",
                )}
              />
            )}
            {view.panel.state === "ready" && (
              <Ledger t={t} locale={locale} features={view.panel.features} />
            )}
          </section>
        </div>
      );
  }
}

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring";
const primary = `inline-flex h-10 items-center gap-2 rounded-lg bg-discord-blurple px-4 font-medium text-white transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none ${focus}`;
const quiet = `inline-flex h-10 items-center gap-2 rounded-lg px-3 text-fd-muted-foreground transition-colors duration-150 hover:bg-fd-accent hover:text-fd-accent-foreground ${focus}`;

function SignIn({ t }: { t: Translate }) {
  const login = loginUrl(`${window.location.pathname}${window.location.search}`);

  return (
    <Notice
      title={t("看看機器龍在你的伺服器做了什麼")}
      body={t("登入後可以看每個伺服器開了哪些功能、哪些出了問題。")}
      note={t("只會讀你的 Discord 名稱和伺服器清單，不會拿到你的訊息。")}
    >
      <a href={login} className={primary}>
        {t("用 Discord 登入")}
      </a>
    </Notice>
  );
}

function GuildRail({
  t,
  guilds,
  current,
  onOpen,
  onLogout,
}: {
  t: Translate;
  guilds: Guild[];
  current: Guild;
  onOpen: (guild: Guild) => void;
  onLogout: () => void;
}) {
  return (
    <nav aria-label={t("所有伺服器")} className="flex min-w-0 flex-col gap-3">
      <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:flex-col md:overflow-visible">
        {guilds.map((guild) => {
          const selected = guild.id === current.id;

          return (
            <li key={guild.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onOpen(guild)}
                aria-current={selected ? "page" : undefined}
                className={`flex h-12 w-full items-center gap-3 rounded-lg px-2 text-left transition-[background-color,color,transform] duration-150 active:scale-[0.98] motion-reduce:transition-none max-md:max-w-56 ${
                  selected
                    ? "bg-fd-accent text-fd-accent-foreground"
                    : "text-fd-muted-foreground hover:bg-fd-accent/60 hover:text-fd-foreground"
                } ${focus}`}
              >
                <GuildIcon guild={guild} size="small" />
                <span className="min-w-0 truncate">{guild.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={onLogout} className={`${quiet} self-start`}>
        <LogOut className="size-4" aria-hidden />
        {t("登出")}
      </button>
    </nav>
  );
}

function GuildIcon({ guild, size }: { guild: Guild; size: "small" | "large" }) {
  const box = size === "small" ? "size-8 text-sm" : "size-14 text-xl";

  if (!guild.icon) {
    return (
      <span
        aria-hidden
        className={`flex shrink-0 items-center justify-center rounded-full bg-fd-secondary font-semibold text-fd-secondary-foreground ${box}`}
      >
        {guild.name.slice(0, 1)}
      </span>
    );
  }

  return (
    <img
      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`}
      alt=""
      className={`shrink-0 rounded-full ${box}`}
    />
  );
}

function GuildHeading({ guild }: { guild: Guild }) {
  return (
    <div className="mb-6 flex min-w-0 items-center gap-4">
      <GuildIcon guild={guild} size="large" />
      <h2 className="min-w-0 font-semibold text-2xl [overflow-wrap:break-word]">
        {guild.name}
      </h2>
    </div>
  );
}

type Row = {
  status: FeatureStatus;
  title: ReactNode;
  detail?: ReactNode;
  command?: string;
};

function Ledger({
  t,
  locale,
  features,
}: {
  t: Translate;
  locale: Locale;
  features: GuildFeature[];
}) {
  const relative = new Intl.RelativeTimeFormat(intlLocales[locale], {
    numeric: "auto",
  });
  const since = (seconds: number | null) => {
    if (seconds === null) {
      return "";
    }

    const hours = Math.round((seconds * 1000 - Date.now()) / 3_600_000);

    return Math.abs(hours) < 24
      ? relative.format(hours, "hour")
      : relative.format(Math.round(hours / 24), "day");
  };
  const name = (named: Named | null | undefined, prefix: string, gone: Phrase) => (
    <Chip key={named?.id}>{named?.name ? `${prefix}${named.name}` : t(gone)}</Chip>
  );
  const channel = (named: Named | null | undefined) => name(named, "#", "已刪除的頻道");
  const roles = (list: Named[] = []) =>
    list.map((role) => name(role, "@", "已刪除的身分組"));
  const permissions = (names: string[] = []) =>
    names.map((flag) => {
      const label = permissionLabels[flag];

      return <Chip key={flag}>{label ? t(label) : flag}</Chip>;
    });
  const label = (feature: GuildFeature) =>
    feature.type === "member_notification" &&
    feature.member_notification.event === "leave"
      ? t("離開通知")
      : featureLabels[feature.type]
        ? t(featureLabels[feature.type])
        : feature.type;

  const enabled = (feature: GuildFeature): ReactNode => {
    switch (feature.type) {
      case "member_notification":
        return fill(t("{type}，發到 {channel}"), {
          type: label(feature),
          channel: channel(feature.member_notification.channel),
        });
      case "auto_role":
        return fill(t("新成員身分組，給 {roles}"), {
          roles: roles(feature.auto_role.roles),
        });
      case "auto_channels":
        return fill(t("動態語音頻道，大廳是 {channels}"), {
          channels: feature.auto_channels.lobbies.map((lobby) => channel(lobby)),
        });
      case "trap_channel":
        return fill(t("機器人防禦，陷阱頻道是 {channel}"), {
          channel: channel(feature.trap_channel.channel),
        });
      case "scam_filter":
        return t("詐騙過濾已啟用");
      case "afk_channel":
        return fill(t("掛機頻道，機器龍待在 {channel}"), {
          channel: channel(feature.afk_channel.channel),
        });
      default:
        return label(feature);
    }
  };

  const failing = (feature: GuildFeature, failure: Failure): Row => {
    const values = {
      since: since(failure.failed_at),
      channel: channel(failure.channel),
      roles: roles(failure.roles),
      user: <Chip>{failure.member?.name ? `@${failure.member.name}` : failure.member?.id}</Chip>,
      permissions: permissions(failure.missing_permissions),
      command: <Command name={feature.command} />,
    };
    const row = (title: ReactNode, detail: Phrase): Row => ({
      status: "failing",
      title,
      detail: fill(t(detail), values),
    });
    const giveaway = feature.type === "giveaway";

    switch (failure.code) {
      case "channel_forbidden":
        return giveaway
          ? row(
              t("抽獎結果沒有公布"),
              "{since}開獎時無法在 {channel} 發訊息，開啟機器龍的 {permissions} 權限後，下次開獎就會恢復",
            )
          : row(
              fill(t("{type}已自動停用"), { type: label(feature) }),
              "{since}起無法在 {channel} 發訊息，用 {command} 重新啟用",
            );
      case "channel_missing":
        return giveaway
          ? row(
              t("抽獎結果沒有公布"),
              "{since}開獎時找不到 {channel}，之後的抽獎請辦在其他頻道",
            )
          : row(
              fill(t("{type}已自動停用"), { type: label(feature) }),
              "{since}起找不到 {channel}，用 {command} 改選頻道",
            );
      case "roles_unassignable":
        return row(
          t("新成員身分組發不出去"),
          "{since}起無法發出 {roles}，用 {command} 重新設定",
        );
      case "missing_permissions":
        return row(t("大廳缺少權限"), "機器龍需要 {permissions}，用 {command} 查看大廳");
      case "ban_failed":
        return row(
          t("陷阱頻道沒能封鎖成員"),
          "{since}沒能封鎖 {user}，請確認機器龍有 {permissions} 權限，而且身分組比對方高",
        );
      case "timeout_failed":
        return row(
          t("詐騙過濾沒能禁言成員"),
          "{since}沒能禁言 {user}，請確認機器龍有 {permissions} 權限，而且身分組比對方高",
        );
      default:
        return {
          status: "failing",
          title: label(feature),
          command: feature.command,
        };
    }
  };

  const rows: Row[] = features.map((feature) => {
    if (feature.status === "failing" && feature.last_failure) {
      return failing(feature, feature.last_failure);
    }

    return feature.status === "enabled"
      ? { status: "enabled", title: enabled(feature) }
      : { status: "not_configured", title: label(feature), command: feature.command };
  });
  const counts: [FeatureStatus, Phrase][] = [
    ["failing", "要處理"],
    ["enabled", "運作中"],
    ["not_configured", "還沒設定"],
  ];
  const failingCount = rows.filter((row) => row.status === "failing").length;

  return (
    <>
      <dl className="mb-6 grid grid-cols-3 gap-3">
        {counts.map(([status, title]) => (
          <div key={status} className="rounded-lg bg-fd-secondary/60 px-4 py-3">
            <dt className="text-fd-muted-foreground text-sm">{t(title)}</dt>
            <dd
              className={`font-semibold text-2xl tabular-nums ${
                status === "failing" && failingCount > 0 ? "text-destructive" : ""
              }`}
            >
              {rows.filter((row) => row.status === status).length}
            </dd>
          </div>
        ))}
      </dl>
      {rows.length > 0 && (
        <ul className="overflow-hidden rounded-xl border bg-fd-card">
          {rows.map((row, index) => (
            <li
              key={index}
              className={`flex gap-3 px-4 py-3.5 ${
                row.status === "failing" ? "bg-destructive/[0.06]" : ""
              } ${index > 0 ? "border-t border-fd-border/60" : ""}`}
            >
              <StatusIcon status={row.status} t={t} />
              <div className="min-w-0 flex-1 leading-relaxed">
                <p className={row.status === "not_configured" ? "text-fd-muted-foreground" : ""}>
                  {row.title}
                </p>
                {row.detail && <p className="mt-1 text-fd-muted-foreground">{row.detail}</p>}
              </div>
              {row.command && <Command name={row.command} />}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-fd-muted-foreground text-sm">
        {t("這裡只能看。要改設定，在 Discord 裡用對應的斜線指令。")}
      </p>
    </>
  );
}

function StatusIcon({ status, t }: { status: Row["status"]; t: Translate }) {
  const className = "mt-0.5 size-5 shrink-0";

  switch (status) {
    case "failing":
      return <CircleAlert className={`${className} text-destructive`} aria-label={t("要處理")} />;
    case "enabled":
      return <CircleCheck className={`${className} text-fd-primary`} aria-label={t("運作中")} />;
    default:
      return (
        <CircleDashed
          className={`${className} text-fd-muted-foreground`}
          aria-label={t("還沒設定")}
        />
      );
  }
}

function Skeleton({ t }: { t: Translate }) {
  return (
    <div className="grid gap-8 md:grid-cols-[15rem_minmax(0,1fr)]" aria-busy>
      <span className="sr-only">{t("載入中…")}</span>
      <div className="flex gap-1 md:flex-col">
        {[0, 1, 2].map((key) => (
          <div key={key} className="h-12 w-40 rounded-lg bg-fd-secondary/60 md:w-full" />
        ))}
      </div>
      <LedgerSkeleton />
    </div>
  );
}

function LedgerSkeleton() {
  return (
    <div className="animate-pulse motion-reduce:animate-none" aria-hidden>
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((key) => (
          <div key={key} className="h-[4.5rem] rounded-lg bg-fd-secondary/60" />
        ))}
      </div>
      <div className="h-64 rounded-xl border bg-fd-card" />
    </div>
  );
}

function Notice({
  title,
  body,
  note,
  children,
}: {
  title: ReactNode;
  body: ReactNode;
  note?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-xl rounded-xl border bg-fd-card p-6 sm:p-8">
      <h2 className="font-semibold text-xl">{title}</h2>
      <p className="mt-2 text-fd-muted-foreground">{body}</p>
      {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      {note && <p className="mt-4 text-fd-muted-foreground text-sm">{note}</p>}
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="mx-0.5 inline-block rounded bg-fd-secondary px-1.5 text-fd-secondary-foreground">
      {children}
    </span>
  );
}

function Command({ name }: { name: string }) {
  return (
    <code className="mx-0.5 self-start whitespace-nowrap rounded bg-fd-secondary px-1.5 py-0.5 font-mono text-fd-secondary-foreground text-sm">
      /{name}
    </code>
  );
}
