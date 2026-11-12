// The dashboard API's objects, as yeecord/yeecord's docs/dashboard-api.md defines them.
// Enums only grow within v1, so every switch over them needs a fallback for values added later.
import { dashboardApi } from "~/config";

export type List<T> = {
  object: "list";
  url: string;
  has_more: boolean;
  data: T[];
};

export type Guild = {
  object: "guild";
  id: string;
  name: string;
  icon: string | null;
};

export type Named = {
  object: "channel" | "role" | "user";
  id: string;
  name: string | null;
};

export type FeatureStatus = "failing" | "enabled" | "not_configured";

export type FailureCode =
  | "channel_forbidden"
  | "channel_missing"
  | "roles_unassignable"
  | "missing_permissions"
  | "ban_failed"
  | "timeout_failed";

export type Failure = {
  code: FailureCode;
  failed_at: number | null;
  channel?: Named;
  roles?: Named[];
  member?: Named;
  missing_permissions?: string[];
};

type FeatureBase = {
  object: "guild_feature";
  status: FeatureStatus;
  command: string;
  last_failure: Failure | null;
};

export type GuildFeature = FeatureBase &
  (
    | {
        type: "member_notification";
        member_notification: { event: "join" | "leave"; channel: Named | null };
      }
    | { type: "auto_role"; auto_role: { roles: Named[] } }
    | { type: "auto_channels"; auto_channels: { lobbies: Named[] } }
    | { type: "trap_channel"; trap_channel: { channel: Named | null } }
    | { type: "scam_filter"; scam_filter: Record<string, never> }
    | { type: "afk_channel"; afk_channel: { channel: Named | null } }
    | { type: "giveaway"; giveaway: Record<string, never> }
  );

export type ErrorCode =
  | "session_missing"
  | "token_invalid"
  | "session_conflict"
  | "origin_forbidden"
  | "resource_missing"
  | "missing_manage_guild"
  | "internal_error";

export type ApiError = {
  error: {
    type: string;
    code: ErrorCode;
    message: string;
    param: string | null;
  };
};

export type Outcome<T> = { ok: true; body: T } | { ok: false; code: ErrorCode };

/** A GET against the API with the session cookie, or the error code it answered. */
export async function get<T>(path: string): Promise<Outcome<T>> {
  const response = await fetch(`${dashboardApi}${path}`, {
    credentials: "include",
  });

  if (response.ok) {
    const body: T = await response.json();

    return { ok: true, body };
  }

  const body: ApiError | null = await response.json().catch(() => null);

  return { ok: false, code: body?.error.code ?? "internal_error" };
}

/** Trades the one-time token of a link from Discord for a session cookie, or names why not. */
export async function exchange(token: string): Promise<ErrorCode | null> {
  const response = await fetch(`${dashboardApi}/auth/exchange`, {
    method: "POST",
    credentials: "include",
    body: new URLSearchParams({ token }),
  });

  if (response.ok) {
    return null;
  }

  const body: ApiError | null = await response.json().catch(() => null);

  return body?.error.code ?? "internal_error";
}

/** Whether an item has the fields the page reads, since types do not check a response. */
export function isFeature(value: unknown): value is GuildFeature {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const feature: Record<string, unknown> = { ...value };
  const type = feature.type;

  return (
    typeof type === "string" &&
    typeof feature.status === "string" &&
    typeof feature.command === "string" &&
    typeof feature[type] === "object" &&
    feature[type] !== null
  );
}

export function logout() {
  return fetch(`${dashboardApi}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export function loginUrl(back: string) {
  return `${dashboardApi}/auth/login?${new URLSearchParams({ back })}`;
}
