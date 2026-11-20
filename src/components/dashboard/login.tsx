"use client";

import { LayoutGrid, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { type Locale, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";
import { discordIcon } from "~/layout-config";
import { loginUrl } from "./api";
import { Command, featurePages, fill, groups, StatusBadge, StatusIcon } from "./features";

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
  const [back, setBack] = useState(dashboard);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    setBack(returnable(query.get("back")) ?? dashboard);
    setExpired(query.get("expired") === "1");
  }, [dashboard]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="font-bold text-2xl tracking-tight [overflow-wrap:break-word] sm:text-3xl">
          {expired ? t("這個連結已經失效") : t("機器龍在你的伺服器做了什麼")}
        </h1>
        <p className="text-pretty text-muted-foreground leading-relaxed">
          {expired
            ? t("連結只能用一次，5 分鐘內有效。在 Discord 打 /settings，再按一次「在網頁開啟」。")
            : t("登入後可以看每個伺服器的功能狀態和問題。")}
        </p>
      </div>
      <a href={loginUrl(back)} className="btn-chunky w-full">
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
        {t("只會讀你的 Discord 名稱和伺服器清單，不會拿到你的訊息。")}
      </p>
    </div>
  );
}

/** A still of the dashboard beside the login, so a visitor sees what logging in shows. Not live data. */
export function LoginPreview({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const statuses = ["enabled", "failing", "enabled", "enabled", "not_configured", "failing", "enabled", "enabled"] as const;
  const status = (index: number) => statuses[index] ?? "enabled";

  return (
    <div className="flex w-[52rem] overflow-hidden rounded-tl-3xl border-t border-l bg-fd-background shadow-2xl">
      <div className="flex w-56 shrink-0 flex-col gap-4 border-r bg-fd-card p-4">
        <div className="flex items-center gap-2.5 rounded-xl border p-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-fd-secondary font-semibold text-sm">
            Y
          </span>
          <span className="truncate font-semibold text-sm">Yeecord</span>
        </div>
        <span className="flex h-8 items-center gap-2 rounded-lg bg-fd-accent px-2 font-medium text-sm">
          <LayoutGrid className="size-4" aria-hidden />
          <span className="flex-1">{t("總覽")}</span>
          <span className="min-w-5 text-center text-destructive text-xs leading-5">2</span>
        </span>
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <span className="px-2 pb-0.5 text-fd-muted-foreground text-xs">{t(group.label)}</span>
            {group.pages.map((page) => {
              const Icon = page.icon;
              const failing = status(featurePages.indexOf(page)) === "failing";

              return (
                <span key={page.slug} className="flex h-7 items-center gap-2 px-2 text-fd-muted-foreground text-sm">
                  <Icon className="size-3.5" aria-hidden />
                  <span className="flex-1 truncate">{t(page.label)}</span>
                  {failing && <StatusIcon status="failing" t={t} decorative />}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-5 p-6">
        <span className="font-semibold text-xl">{t("總覽")}</span>
        <div className="flex gap-3 rounded-xl border bg-fd-card p-4">
          <StatusIcon status="failing" t={t} decorative />
          <span className="font-medium">{fill(t("{type}已自動停用"), { type: t("離開通知") })}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {featurePages.map((page, index) => {
            const Icon = page.icon;

            return (
              <div
                key={page.slug}
                className={`flex flex-col gap-2.5 rounded-xl border bg-fd-card p-3.5 ${
                  status(index) === "not_configured" ? "border-dashed bg-transparent" : ""
                }`}
              >
                <span className="flex items-center gap-2 font-medium text-sm">
                  <Icon className="size-4 text-fd-muted-foreground" aria-hidden />
                  {t(page.label)}
                </span>
                <StatusBadge t={t} status={status(index)} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
