import {
  AudioLines,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  Crosshair,
  Gift,
  type LucideIcon,
  Moon,
  ShieldCheck,
  Tag,
  UserMinus,
  UserPlus,
} from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "~/components/ui/badge";
import type { Locale } from "~/i18n";
import type { Phrase, Translate } from "~/i18n/translate";
import type { Failure, FeatureStatus, GuildFeature, Named } from "./api";

export type FeaturePage = {
  slug: string;
  label: Phrase;
  icon: LucideIcon;
  /** The slash command that sets the feature up, for a guild the API lists nothing for. */
  command: string;
  matches: (feature: GuildFeature) => boolean;
};

export const groups: { label: Phrase; pages: FeaturePage[] }[] = [
  {
    label: "成員",
    pages: [
      {
        slug: "join",
        label: "加入通知",
        icon: UserPlus,
        command: "member-notification",
        matches: (feature) =>
          feature.type === "member_notification" &&
          feature.member_notification.event === "join",
      },
      {
        slug: "leave",
        label: "離開通知",
        icon: UserMinus,
        command: "member-notification",
        matches: (feature) =>
          feature.type === "member_notification" &&
          feature.member_notification.event === "leave",
      },
      {
        slug: "auto-role",
        label: "新成員身分組",
        icon: Tag,
        command: "auto-role",
        matches: (feature) => feature.type === "auto_role",
      },
    ],
  },
  {
    label: "語音",
    pages: [
      {
        slug: "auto-channels",
        label: "動態語音頻道",
        icon: AudioLines,
        command: "auto-channels",
        matches: (feature) => feature.type === "auto_channels",
      },
      {
        slug: "afk-channel",
        label: "掛機頻道",
        icon: Moon,
        command: "afk-channel set",
        matches: (feature) => feature.type === "afk_channel",
      },
    ],
  },
  {
    label: "防護",
    pages: [
      {
        slug: "trap-channel",
        label: "陷阱頻道",
        icon: Crosshair,
        command: "bot-fight",
        matches: (feature) => feature.type === "trap_channel",
      },
      {
        slug: "scam-filter",
        label: "詐騙過濾",
        icon: ShieldCheck,
        command: "bot-fight",
        matches: (feature) => feature.type === "scam_filter",
      },
    ],
  },
  {
    label: "活動",
    pages: [
      {
        slug: "giveaway",
        label: "抽獎",
        icon: Gift,
        command: "giveaway",
        matches: (feature) => feature.type === "giveaway",
      },
    ],
  },
];

export const featurePages: FeaturePage[] = groups.flatMap((group) => group.pages);

/** A page and what the API says about it; a failing entry wins over another of the same kind. */
export type PageState = {
  page: FeaturePage;
  feature: GuildFeature | undefined;
  status: FeatureStatus;
  command: string;
};

export function stateOf(page: FeaturePage, features: GuildFeature[]): PageState {
  const matching = features.filter(page.matches);
  const feature = matching.find((item) => item.status === "failing") ?? matching[0];

  return {
    page,
    feature,
    status: feature?.status ?? "not_configured",
    command: feature?.command ?? page.command,
  };
}

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

/** Substitutes each `{name}` in a phrase with a node, so names and chips sit inside the sentence. */
export function fill(template: string, values: Record<string, ReactNode>) {
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

/** The sentences and settings a feature shows, in one locale. */
export function describer(t: Translate, locale: Locale) {
  const relative = new Intl.RelativeTimeFormat(intlLocales[locale], { numeric: "auto" });
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
  const roles = (list: Named[] = []) => list.map((role) => name(role, "@", "已刪除的身分組"));
  const permissions = (names: string[] = []) =>
    names.map((flag) => {
      const label = permissionLabels[flag];

      return <Chip key={flag}>{label ? t(label) : flag}</Chip>;
    });
  const label = (feature: GuildFeature) => {
    const page = featurePages.find((page) => page.matches(feature));

    return page ? t(page.label) : feature.type;
  };

  /** What a running feature does, as one sentence. */
  const summary = (feature: GuildFeature): ReactNode => {
    switch (feature.type) {
      case "member_notification":
        return fill(t("{type}，發到 {channel}"), {
          type: label(feature),
          channel: channel(feature.member_notification.channel),
        });
      case "auto_role":
        return fill(t("新成員身分組，給 {roles}"), { roles: roles(feature.auto_role.roles) });
      case "auto_channels":
        return fill(t("動態語音頻道，大廳是 {channels}"), {
          channels: (feature.auto_channels.lobbies ?? []).map((lobby) => channel(lobby)),
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

  /** The settings a feature holds, as label and value pairs. */
  const settings = (feature: GuildFeature): [Phrase, ReactNode][] => {
    switch (feature.type) {
      case "member_notification":
        return [["頻道", channel(feature.member_notification.channel)]];
      case "auto_role":
        return [["身分組", roles(feature.auto_role.roles)]];
      case "auto_channels":
        return [["大廳", (feature.auto_channels.lobbies ?? []).map((lobby) => channel(lobby))]];
      case "trap_channel":
        return [["頻道", channel(feature.trap_channel.channel)]];
      case "afk_channel":
        return [["頻道", channel(feature.afk_channel.channel)]];
      default:
        return [];
    }
  };

  /** Why a feature stopped and how to fix it. */
  const failure = (feature: GuildFeature, failure: Failure): { title: ReactNode; detail?: ReactNode } => {
    const values = {
      since: since(failure.failed_at),
      channel: channel(failure.channel),
      roles: roles(failure.roles),
      user: <Chip>{failure.member?.name ? `@${failure.member.name}` : failure.member?.id}</Chip>,
      permissions: permissions(failure.missing_permissions),
      command: <Command name={feature.command} />,
    };
    const giveaway = feature.type === "giveaway";
    const stated = (title: ReactNode, detail: Phrase) => ({
      title,
      detail: fill(t(detail), values),
    });

    switch (failure.code) {
      case "channel_forbidden":
        return giveaway
          ? stated(
              t("抽獎結果沒有公布"),
              "{since}開獎時無法在 {channel} 發訊息，開啟機器龍的 {permissions} 權限後，下次開獎就會恢復",
            )
          : stated(
              fill(t("{type}已自動停用"), { type: label(feature) }),
              "{since}起無法在 {channel} 發訊息，用 {command} 重新啟用",
            );
      case "channel_missing":
        return giveaway
          ? stated(t("抽獎結果沒有公布"), "{since}開獎時找不到 {channel}，之後的抽獎請辦在其他頻道")
          : stated(
              fill(t("{type}已自動停用"), { type: label(feature) }),
              "{since}起找不到 {channel}，用 {command} 改選頻道",
            );
      case "roles_unassignable":
        return stated(t("新成員身分組發不出去"), "{since}起無法發出 {roles}，用 {command} 重新設定");
      case "missing_permissions":
        return stated(t("大廳缺少權限"), "機器龍需要 {permissions}，用 {command} 查看大廳");
      case "ban_failed":
        return stated(
          t("陷阱頻道沒能封鎖成員"),
          "{since}沒能封鎖 {user}，請確認機器龍有 {permissions} 權限，而且身分組比對方高",
        );
      case "timeout_failed":
        return stated(
          t("詐騙過濾沒能禁言成員"),
          "{since}沒能禁言 {user}，請確認機器龍有 {permissions} 權限，而且身分組比對方高",
        );
      default:
        return { title: label(feature) };
    }
  };

  return { summary, settings, failure };
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="mx-0.5 inline-block rounded bg-fd-secondary px-1.5 text-fd-secondary-foreground">
      {children}
    </span>
  );
}

export function Command({ name }: { name: string }) {
  return (
    <code className="mx-0.5 whitespace-nowrap rounded bg-fd-secondary px-1.5 py-0.5 font-mono text-fd-secondary-foreground text-sm">
      /{name}
    </code>
  );
}

export const statusLabels: Record<FeatureStatus, Phrase> = {
  failing: "要處理",
  enabled: "運作中",
  not_configured: "還沒設定",
};

export function StatusBadge({ t, status }: { t: Translate; status: FeatureStatus }) {
  return (
    <Badge variant="outline" className="text-muted-foreground">
      <StatusIcon status={status} t={t} decorative />
      {t(statusLabels[status])}
    </Badge>
  );
}

export function StatusIcon({
  status,
  t,
  decorative,
}: {
  status: FeatureStatus;
  t: Translate;
  decorative?: boolean;
}) {
  const className = decorative ? "size-4 shrink-0" : "mt-0.5 size-5 shrink-0";
  const label = decorative ? undefined : t(statusLabels[status]);

  switch (status) {
    case "failing":
      return (
        <CircleAlert className={`${className} text-destructive`} aria-label={label} aria-hidden={decorative} />
      );
    case "enabled":
      return (
        <CircleCheck className={`${className} text-fd-primary`} aria-label={label} aria-hidden={decorative} />
      );
    default:
      return (
        <CircleDashed
          className={`${className} text-fd-muted-foreground`}
          aria-label={label}
          aria-hidden={decorative}
        />
      );
  }
}
