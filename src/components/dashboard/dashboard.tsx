"use client";

import { Menu } from "@base-ui/react/menu";
import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  LayoutGrid,
  LogOut,
  RotateCw,
} from "lucide-react";
import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { type Locale, staticPath } from "~/i18n";
import { type Translate, translator } from "~/i18n/translate";
import {
  type ErrorCode,
  type Guild,
  type GuildFeature,
  exchange,
  get,
  isFeature,
  type List,
  logout as endSession,
} from "./api";
import {
  Command,
  describer,
  type FeaturePage,
  featurePages,
  fill,
  groups,
  type PageState,
  StatusIcon,
  StatusLine,
  stateOf,
} from "./features";
import { loginPage } from "./login";

type Panel =
  | { state: "loading" }
  | { state: "ready"; features: GuildFeature[] }
  | { state: "refused"; code: ErrorCode };

type View =
  | { state: "loading" }
  | { state: "signed-out"; linkExpired?: boolean }
  | { state: "unreachable" }
  | { state: "empty" }
  | {
      state: "signed-in";
      guilds: Guild[];
      guild: Guild | undefined;
      panel: Panel;
      logoutFailed?: boolean;
      linkConflict?: boolean;
    };

function param(name: string) {
  return new URLSearchParams(window.location.search).get(name);
}

/** The address of a page of the current guild, kept as a real link so it opens in a new tab. */
function pageHref(slug: string | null) {
  const url = new URL(window.location.href);

  if (slug) {
    url.searchParams.set("page", slug);
  } else {
    url.searchParams.delete("page");
  }

  return `${url.pathname}${url.search}`;
}

export function Dashboard({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const [view, setView] = useState<View>({ state: "loading" });
  const [slug, setSlug] = useState<string | null>(null);

  // Each load takes a number; a reply that comes back after a newer load or a logout is dropped.
  const latest = useRef(0);
  const loadedGuild = useRef<string | null>(null);
  // The link's token is traded once per page, and every later load reads what that trade said.
  const handoff = useRef<Promise<ErrorCode | null>>(Promise.resolve(null));

  const load = useCallback(async () => {
    const run = ++latest.current;
    const current = () => run === latest.current;

    setSlug(param("page"));

    try {
      const token = new URLSearchParams(window.location.hash.slice(1)).get("token");

      if (token) {
        // The link from Discord works once, so it leaves the address bar and history at once.
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
        handoff.current = exchange(token);
      }

      const refusal = await handoff.current;

      const listed = await get<List<Guild>>("/v1/guilds");

      if (!current()) {
        return;
      }

      if (!listed.ok || !Array.isArray(listed.body.data)) {
        setView(
          !listed.ok && listed.code === "session_missing"
            ? { state: "signed-out", linkExpired: refusal !== null }
            : { state: "unreachable" },
        );
        return;
      }

      const guilds = listed.body.data;
      const id = param("guild");
      const guild = id ? guilds.find((guild) => guild.id === id) : guilds[0];

      if (guilds.length === 0) {
        setView({ state: "empty" });
        return;
      }

      loadedGuild.current = guild?.id ?? id;

      if (!guild) {
        setView({
          state: "signed-in",
          guilds,
          guild,
          panel: { state: "refused", code: "resource_missing" },
        });
        return;
      }

      const linkConflict = refusal === "session_conflict";

      setView({ state: "signed-in", guilds, guild, panel: { state: "loading" }, linkConflict });

      const read = await get<List<GuildFeature>>(`/v1/guilds/${guild.id}/features`);

      if (!current()) {
        return;
      }

      if (!read.ok && read.code === "session_missing") {
        setView({ state: "signed-out" });
        return;
      }

      setView({
        state: "signed-in",
        guilds,
        guild,
        linkConflict,
        panel:
          read.ok && Array.isArray(read.body.data)
            ? { state: "ready", features: read.body.data.filter(isFeature) }
            : { state: "refused", code: read.ok ? "internal_error" : read.code },
      });
    } catch {
      if (current()) {
        setView({ state: "unreachable" });
      }
    }
  }, []);

  useEffect(() => {
    // Moving between pages of one guild reuses its features; another guild loads its own.
    const travel = () => {
      const guild = param("guild");

      if (guild && guild !== loadedGuild.current) {
        load();
      } else {
        setSlug(param("page"));
      }
    };

    load();
    window.addEventListener("popstate", travel);

    return () => window.removeEventListener("popstate", travel);
  }, [load]);

  useEffect(() => {
    if (view.state === "signed-out") {
      window.location.replace(
        loginPage(
          locale,
          `${window.location.pathname}${window.location.search}`,
          view.linkExpired === true,
        ),
      );
    }
  }, [view, locale]);

  const open = (guild: Guild) => {
    const url = new URL(window.location.href);

    url.searchParams.set("guild", guild.id);
    window.history.pushState(null, "", url);
    load();
  };

  const go = (target: string | null) => (event: MouseEvent<HTMLElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) {
      return;
    }

    event.preventDefault();
    window.history.pushState(null, "", pageHref(target));
    setSlug(target);
    window.scrollTo({ top: 0 });
  };

  const logout = async () => {
    const ended = await endSession().catch(() => undefined);

    if (!ended?.ok) {
      setView((view) =>
        view.state === "signed-in" ? { ...view, logoutFailed: true } : view,
      );
      return;
    }

    latest.current++;
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
      return <Skeleton t={t} />;
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
    case "signed-in": {
      const features = view.panel.state === "ready" ? view.panel.features : [];
      const states = featurePages.map((page) => stateOf(page, features));
      const page = featurePages.find((page) => page.slug === slug);

      return (
        <div className="grid gap-8 md:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="flex min-w-0 flex-col gap-4 md:sticky md:top-20 md:self-start">
            <GuildSwitcher t={t} guilds={view.guilds} current={view.guild} onOpen={open} />
            {view.panel.state === "ready" && (
              <Sidebar t={t} states={states} current={page} go={go} />
            )}
            <button type="button" onClick={logout} className={`${quiet} self-start`}>
              <LogOut className="size-4" aria-hidden />
              {t("登出")}
            </button>
            {view.logoutFailed && (
              <p role="alert" className="text-destructive text-sm">
                {t("登出沒有成功，再試一次。")}
              </p>
            )}
          </aside>
          <section aria-live="polite" className="min-w-0">
            {view.linkConflict && (
              <p role="alert" className="mb-6 rounded-lg bg-destructive/10 px-4 py-3">
                {t("這個連結屬於另一個 Discord 帳號，所以沒有打開。要用它的話，先登出再按一次連結。")}
              </p>
            )}
            {view.panel.state === "loading" && <PanelSkeleton />}
            {view.panel.state === "refused" && view.panel.code === "internal_error" && (
              <Notice title={t("暫時連不上機器龍")} body={t("稍後再重新整理一次。")}>
                <button type="button" onClick={load} className={quiet}>
                  <RotateCw className="size-4" aria-hidden />
                  {t("再試一次")}
                </button>
              </Notice>
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
            {view.panel.state === "ready" &&
              (page ? (
                <FeatureView
                  t={t}
                  locale={locale}
                  state={stateOf(page, features)}
                  go={go}
                />
              ) : (
                <Overview t={t} locale={locale} states={states} go={go} />
              ))}
          </section>
        </div>
      );
    }
  }
}

type Go = (target: string | null) => (event: MouseEvent<HTMLElement>) => void;

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring";
const primary = `inline-flex h-10 items-center gap-2 rounded-lg bg-discord-blurple px-4 font-medium text-white transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none ${focus}`;
const quiet = `inline-flex h-10 items-center gap-2 rounded-lg px-3 text-fd-muted-foreground transition-colors duration-150 hover:bg-fd-accent hover:text-fd-accent-foreground ${focus}`;
const navItem = `flex h-9 items-center gap-2.5 rounded-lg px-2.5 transition-colors duration-150 ${focus}`;
const popup =
  "max-h-[min(24rem,var(--available-height))] w-72 max-w-[var(--available-width)] overflow-y-auto rounded-xl border bg-fd-popover p-1 text-fd-popover-foreground shadow-lg motion-safe:transition-[opacity,translate] motion-safe:duration-150 motion-safe:ease-out motion-safe:data-[open]:duration-100 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-safe:data-[ending-style]:-translate-y-1 motion-safe:data-[starting-style]:-translate-y-1";
const menuItem =
  "flex h-10 cursor-default items-center gap-3 rounded-lg px-2 outline-none data-[highlighted]:bg-fd-accent data-[highlighted]:text-fd-accent-foreground";

function GuildSwitcher({
  t,
  guilds,
  current,
  onOpen,
}: {
  t: Translate;
  guilds: Guild[];
  current: Guild | undefined;
  onOpen: (guild: Guild) => void;
}) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={t("切換伺服器")}
        className={`flex min-w-0 items-center gap-3 rounded-xl border bg-fd-card p-2 pr-3 text-left transition-[background-color,transform] duration-150 ease-out hover:bg-fd-accent active:scale-[0.98] data-[popup-open]:bg-fd-accent motion-reduce:transition-none ${focus}`}
      >
        {current && <GuildIcon guild={current} />}
        <span className="min-w-0 flex-1 truncate font-semibold">
          {current?.name ?? t("所有伺服器")}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-fd-muted-foreground" aria-hidden />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="start" className="z-50">
          <Menu.Popup className={popup}>
            <Menu.RadioGroup
              value={current?.id}
              onValueChange={(id) => {
                const guild = guilds.find((guild) => guild.id === id);

                if (guild) {
                  onOpen(guild);
                }
              }}
            >
              {guilds.map((guild) => (
                <Menu.RadioItem key={guild.id} value={guild.id} closeOnClick className={menuItem}>
                  <GuildIcon guild={guild} />
                  <span className="min-w-0 flex-1 truncate">{guild.name}</span>
                  <Menu.RadioItemIndicator>
                    <Check className="size-4 text-fd-primary" aria-hidden />
                  </Menu.RadioItemIndicator>
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function GuildIcon({ guild }: { guild: Guild }) {
  if (!guild.icon) {
    return (
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-fd-secondary font-semibold text-fd-secondary-foreground text-sm"
      >
        {guild.name.slice(0, 1)}
      </span>
    );
  }

  return (
    <img
      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=64`}
      alt=""
      className="size-8 shrink-0 rounded-full"
    />
  );
}

function Sidebar({
  t,
  states,
  current,
  go,
}: {
  t: Translate;
  states: PageState[];
  current: FeaturePage | undefined;
  go: Go;
}) {
  const failing = states.filter((state) => state.status === "failing").length;
  const stateFor = (page: FeaturePage) => states.find((state) => state.page === page);

  return (
    <>
      <nav aria-label={t("所有功能")} className="flex flex-col gap-4 max-md:hidden">
        <a
          href={pageHref(null)}
          onClick={go(null)}
          aria-current={current ? undefined : "page"}
          className={`${navItem} ${current ? idle : selected}`}
        >
          <LayoutGrid className="size-4 shrink-0" aria-hidden />
          <span className="flex-1">{t("總覽")}</span>
          {failing > 0 && <FailingCount t={t} count={failing} />}
        </a>
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <p className="px-2.5 pb-1 text-fd-muted-foreground text-sm">{t(group.label)}</p>
            {group.pages.map((page) => {
              const Icon = page.icon;

              return (
                <a
                  key={page.slug}
                  href={pageHref(page.slug)}
                  onClick={go(page.slug)}
                  aria-current={page === current ? "page" : undefined}
                  className={`${navItem} ${page === current ? selected : idle}`}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span className="flex-1 truncate">{t(page.label)}</span>
                  {stateFor(page)?.status === "failing" && (
                    <CircleAlert className="size-4 shrink-0 text-destructive" aria-label={t("要處理")} />
                  )}
                </a>
              );
            })}
          </div>
        ))}
      </nav>
      <PageMenu t={t} states={states} current={current} go={go} />
    </>
  );
}

const selected = "bg-fd-accent font-medium text-fd-accent-foreground";
const idle = "text-fd-muted-foreground hover:bg-fd-accent/60 hover:text-fd-foreground";

function FailingCount({ t, count }: { t: Translate; count: number }) {
  return (
    <span
      className="min-w-5 rounded-full bg-destructive px-1.5 text-center font-medium text-white text-xs tabular-nums leading-5"
      aria-label={`${t("要處理")} ${count}`}
    >
      {count}
    </span>
  );
}

/** The sidebar's pages as one menu, for screens too narrow for the sidebar. */
function PageMenu({
  t,
  states,
  current,
  go,
}: {
  t: Translate;
  states: PageState[];
  current: FeaturePage | undefined;
  go: Go;
}) {
  const Icon = current?.icon ?? LayoutGrid;

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={t("所有功能")}
        className={`flex h-11 items-center gap-2.5 rounded-xl border px-3 text-left md:hidden ${focus}`}
      >
        <Icon className="size-4 shrink-0 text-fd-muted-foreground" aria-hidden />
        <span className="flex-1 truncate">{t(current?.label ?? "總覽")}</span>
        <ChevronsUpDown className="size-4 shrink-0 text-fd-muted-foreground" aria-hidden />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="start" className="z-50">
          <Menu.Popup className={popup}>
            <Menu.LinkItem href={pageHref(null)} onClick={go(null)} closeOnClick className={menuItem}>
              <LayoutGrid className="size-4" aria-hidden />
              {t("總覽")}
            </Menu.LinkItem>
            {groups.map((group) => (
              <Menu.Group key={group.label}>
                <Menu.GroupLabel className="px-2 pt-2 pb-1 text-fd-muted-foreground text-sm">
                  {t(group.label)}
                </Menu.GroupLabel>
                {group.pages.map((page) => {
                  const PageIcon = page.icon;
                  const failing = states.some(
                    (state) => state.page === page && state.status === "failing",
                  );

                  return (
                    <Menu.LinkItem
                      key={page.slug}
                      href={pageHref(page.slug)}
                      onClick={go(page.slug)}
                      closeOnClick
                      className={menuItem}
                    >
                      <PageIcon className="size-4" aria-hidden />
                      <span className="flex-1">{t(page.label)}</span>
                      {failing && (
                        <CircleAlert className="size-4 text-destructive" aria-label={t("要處理")} />
                      )}
                    </Menu.LinkItem>
                  );
                })}
              </Menu.Group>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function Overview({
  t,
  locale,
  states,
  go,
}: {
  t: Translate;
  locale: Locale;
  states: PageState[];
  go: Go;
}) {
  const describe = describer(t, locale);
  const failing = states.filter((state) => state.status === "failing");

  return (
    <div className="flex flex-col gap-10">
      <h2 className="font-semibold text-2xl">{t("總覽")}</h2>
      {failing.length > 0 && (
        <section aria-labelledby="overview-failing">
          <GroupHeading id="overview-failing" label={t("要處理")} count={failing.length} />
          <ul className="flex flex-col gap-3">
            {failing.map((state) => {
              const told = state.feature?.last_failure
                ? describe.failure(state.feature, state.feature.last_failure)
                : { title: t(state.page.label) };

              return (
                <li key={state.page.slug}>
                  <a
                    href={pageHref(state.page.slug)}
                    onClick={go(state.page.slug)}
                    className={`flex gap-3 rounded-xl border border-destructive/30 bg-destructive/[0.06] p-4 transition-colors duration-150 hover:bg-destructive/[0.1] ${focus}`}
                  >
                    <StatusIcon status="failing" t={t} />
                    <div className="min-w-0 flex-1 leading-relaxed">
                      <p className="font-medium">{told.title}</p>
                      {told.detail && <p className="mt-1 text-fd-muted-foreground">{told.detail}</p>}
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      <section aria-labelledby="overview-all" className="flex flex-col gap-6">
        <GroupHeading id="overview-all" label={t("所有功能")} />
        {groups.map((group) => (
          <div key={group.label}>
            <h4 className="mb-2 text-fd-muted-foreground text-sm">{t(group.label)}</h4>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.pages.map((page) => {
                const state = states.find((state) => state.page === page);
                const status = state?.status ?? "not_configured";
                const Icon = page.icon;

                return (
                  <li key={page.slug}>
                    <a
                      href={pageHref(page.slug)}
                      onClick={go(page.slug)}
                      className={`flex h-full flex-col gap-3 rounded-xl border bg-fd-card p-4 transition-colors duration-150 hover:bg-fd-accent ${
                        status === "not_configured" ? "border-dashed bg-transparent" : ""
                      } ${focus}`}
                    >
                      <span className="flex items-center gap-2.5 font-medium">
                        <Icon className="size-4 shrink-0 text-fd-muted-foreground" aria-hidden />
                        {t(page.label)}
                      </span>
                      <StatusLine t={t} status={status} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
      <p className="text-fd-muted-foreground text-sm">
        {t("這裡只能看。要改設定，在 Discord 裡用對應的斜線指令。")}
      </p>
    </div>
  );
}

function FeatureView({
  t,
  locale,
  state,
  go,
}: {
  t: Translate;
  locale: Locale;
  state: PageState;
  go: Go;
}) {
  const describe = describer(t, locale);
  const { feature, status, command, page } = state;
  const Icon = page.icon;
  const told = feature?.last_failure ? describe.failure(feature, feature.last_failure) : undefined;
  const settings = feature && status !== "not_configured" ? describe.settings(feature) : [];

  return (
    <div className="flex flex-col gap-6">
      <a
        href={pageHref(null)}
        onClick={go(null)}
        className={`-ml-1 inline-flex items-center gap-1.5 self-start rounded-md px-1 text-fd-muted-foreground text-sm hover:text-fd-foreground ${focus}`}
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t("總覽")}
      </a>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="flex items-center gap-3 font-semibold text-2xl">
          <Icon className="size-6 text-fd-muted-foreground" aria-hidden />
          {t(page.label)}
        </h2>
        <StatusLine t={t} status={status} />
      </div>
      {status === "failing" && told && (
        <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/[0.06] p-4">
          <StatusIcon status="failing" t={t} />
          <div className="min-w-0 flex-1 leading-relaxed">
            <p className="font-medium">{told.title}</p>
            {told.detail && <p className="mt-1 text-fd-muted-foreground">{told.detail}</p>}
          </div>
        </div>
      )}
      {status === "not_configured" ? (
        <div className="flex flex-col gap-3 rounded-xl border border-dashed p-6">
          <h3 className="font-semibold text-lg">{t("這個功能還沒設定")}</h3>
          <p className="text-fd-muted-foreground leading-relaxed">
            {fill(t("在 Discord 用 {command} 開始設定"), { command: <Command name={command} /> })}
          </p>
        </div>
      ) : (
        <>
          {feature && (
            <div className="rounded-xl border bg-fd-card p-5">
              {settings.length > 0 ? (
                <dl className="grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
                  {settings.map(([label, value]) => (
                    <div key={label} className="contents">
                      <dt className="text-fd-muted-foreground">{t(label)}</dt>
                      <dd className="leading-relaxed">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="leading-relaxed">{describe.summary(feature)}</p>
              )}
            </div>
          )}
          <p className="text-fd-muted-foreground leading-relaxed">
            {fill(t("在 Discord 用 {command} 修改設定"), { command: <Command name={command} /> })}
          </p>
        </>
      )}
    </div>
  );
}

function GroupHeading({ id, label, count }: { id: string; label: string; count?: number }) {
  return (
    <h3 id={id} className="mb-3 flex items-baseline gap-2 font-semibold text-lg">
      {label}
      {count !== undefined && (
        <span className="font-normal text-fd-muted-foreground tabular-nums">{count}</span>
      )}
    </h3>
  );
}

function Skeleton({ t }: { t: Translate }) {
  return (
    <div className="grid gap-8 md:grid-cols-[15rem_minmax(0,1fr)]" aria-busy>
      <span className="sr-only">{t("載入中…")}</span>
      <div className="flex flex-col gap-2 animate-pulse motion-reduce:animate-none" aria-hidden>
        <div className="h-12 rounded-xl bg-fd-secondary/60" />
        {[0, 1, 2, 3].map((key) => (
          <div key={key} className="h-9 rounded-lg bg-fd-secondary/40 max-md:hidden" />
        ))}
      </div>
      <PanelSkeleton />
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse motion-reduce:animate-none" aria-hidden>
      <div className="mb-4 h-8 w-32 rounded-lg bg-fd-secondary/60" />
      <div className="h-24 rounded-xl border bg-fd-card" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((key) => (
          <div key={key} className="h-24 rounded-xl border bg-fd-card" />
        ))}
      </div>
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
