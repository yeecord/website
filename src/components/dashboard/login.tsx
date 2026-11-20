"use client";

import { ChevronsUpDown, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { type Locale, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";
import { discordIcon } from "~/layout-config";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "~/components/ui/item";
import { type FeatureStatus, type GuildFeature, loginUrl } from "./api";
import { Command, describer, type FeaturePage, featurePages, fill, StatusBadge, StatusIcon } from "./features";

/** The login page's address, carrying the page to come back to and whether a link from Discord was spent. */
export function loginPage(locale: Locale, back: string, expired: boolean) {
  const query = new URLSearchParams({ back });

  if (expired) {
    query.set("expired", "1");
  }

  return `${staticPath(locale, "/login")}?${query}`;
}

/** Only a path on this site comes back after the login. */
function returnable(back: string | null) {
  return back?.startsWith("/") && !back.startsWith("//") ? back : null;
}

export function LoginPanel({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const dashboard = staticPath(locale, "/dashboard");
  // Built in the browser: the static HTML cannot know which API the visitor's host answers to.
  const [login, setLogin] = useState<string>();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    setLogin(loginUrl(returnable(query.get("back")) ?? dashboard));
    setExpired(query.get("expired") === "1");
  }, [dashboard]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-balance font-bold text-2xl tracking-tight [overflow-wrap:break-word] sm:text-3xl">
          {expired ? t("這個連結已經失效") : t("機器龍在你的伺服器做了什麼")}
        </h1>
        <p className="text-pretty text-muted-foreground leading-relaxed">
          {expired
            ? t("連結只能用一次，5 分鐘內有效。在 Discord 打 /settings，再按一次「在網頁開啟」。")
            : t("登入後可以看每個伺服器的功能狀態和問題。")}
        </p>
      </div>
      <a href={login} aria-disabled={!login} className="btn-chunky w-full aria-disabled:pointer-events-none aria-disabled:opacity-60">
        <span className="size-5" aria-hidden>
          {discordIcon}
        </span>
        {t("用 Discord 登入")}
      </a>
      {!expired && (
        <section aria-labelledby="login-from-discord" className="flex flex-col gap-4">
          <h2 id="login-from-discord" className="text-muted-foreground text-sm">
            {t("或是從 Discord 打開")}
          </h2>
          <ol className="flex flex-col gap-3">
            {[
              fill(t("在伺服器打 {command}"), { command: <Command name="settings" /> }),
              t("按「在網頁開啟」，就會打開那個伺服器"),
            ].map((step, index) => (
              <li key={index} className="flex items-baseline gap-3 leading-relaxed">
                <span
                  aria-hidden
                  className="flex size-6 shrink-0 translate-y-0.5 items-center justify-center self-start rounded-full bg-secondary font-medium text-secondary-foreground text-xs tabular-nums"
                >
                  {index + 1}
                </span>
                <span className="text-pretty">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
      <p className="flex gap-2 text-muted-foreground text-sm leading-relaxed">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span className="text-pretty">{t("只會讀你的 Discord 名稱和伺服器清單，不會拿到你的訊息。")}</span>
      </p>
    </div>
  );
}

/** A still of the dashboard's overview beside the login, so a visitor sees what logging in shows. Not live data. */
export function LoginPreview({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const describe = describer(t, locale);
  // Relative to whenever it renders, so the static HTML and the browser both read "3 hours ago".
  const failedAt = Math.floor(Date.now() / 1000) - 3 * 3600;
  const failing: GuildFeature[] = [
    {
      object: "guild_feature",
      type: "member_notification",
      status: "failing",
      command: "member-notification",
      member_notification: { event: "leave", channel: { object: "channel", id: "1", name: t("再見") } },
      last_failure: {
        code: "channel_forbidden",
        failed_at: failedAt,
        channel: { object: "channel", id: "1", name: t("再見") },
      },
    },
    {
      object: "guild_feature",
      type: "auto_channels",
      status: "failing",
      command: "auto-channels",
      auto_channels: { lobbies: [] },
      last_failure: { code: "missing_permissions", failed_at: failedAt, missing_permissions: ["move_members"] },
    },
  ];
  const status = (page: FeaturePage): FeatureStatus =>
    failing.some(page.matches) ? "failing" : page.slug === "afk-channel" ? "not_configured" : "enabled";

  return (
    <div className="flex w-full max-w-md select-none flex-col gap-6">
      <div className="flex items-center gap-2.5 rounded-xl border bg-background p-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary font-semibold text-sm">
          Y
        </span>
        <span className="flex-1 truncate font-semibold">Yeecord</span>
        <ChevronsUpDown className="size-4 text-muted-foreground" aria-hidden />
      </div>
      <div className="flex flex-col gap-3">
        <span className="flex items-baseline gap-2 font-semibold">
          {t("要處理")}
          <span className="font-normal text-muted-foreground tabular-nums">{failing.length}</span>
        </span>
        {failing.map((feature) => {
          const told = feature.last_failure ? describe.failure(feature, feature.last_failure) : null;

          return (
            <Item key={feature.type} variant="outline" size="sm" className="bg-background">
              <ItemMedia>
                <StatusIcon status="failing" t={t} decorative />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <span>{told?.title}</span>
                </ItemTitle>
                <ItemDescription className="line-clamp-none leading-relaxed">{told?.detail}</ItemDescription>
              </ItemContent>
            </Item>
          );
        })}
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-semibold">{t("所有功能")}</span>
        <div className="flex flex-col rounded-xl border bg-background p-1.5">
          {featurePages.map((page) => {
            const Icon = page.icon;

            return (
              <span key={page.slug} className="flex h-9 items-center gap-2.5 px-2.5 text-sm">
                <Icon className="size-4 text-muted-foreground" aria-hidden />
                <span className="flex-1 truncate">{t(page.label)}</span>
                <StatusBadge t={t} status={status(page)} />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
