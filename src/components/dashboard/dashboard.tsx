"use client";

import {
  ArrowLeft,
  ChevronsUpDown,
  CircleAlert,
  LayoutGrid,
  LogOut,
  RotateCw,
  ServerOff,
  ShieldOff,
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
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { Separator } from "~/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
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
  StatusBadge,
  StatusIcon,
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

  const home = staticPath(locale, "/");

  switch (view.state) {
    case "loading":
    case "signed-out":
      return <Shell t={t} home={home} title={null} loading />;
    case "unreachable":
      return (
        <Shell t={t} home={home} title={null}>
          <Notice
            icon={<ServerOff />}
            title={t("暫時連不上機器龍")}
            body={t("稍後再重新整理一次。")}
          >
            <Button variant="outline" onClick={load}>
              <RotateCw />
              {t("再試一次")}
            </Button>
          </Notice>
        </Shell>
      );
    case "empty":
      return (
        <Shell t={t} home={home} title={null}>
          <Notice
            icon={<ServerOff />}
            title={t("沒有可以管理的伺服器")}
            body={t("這裡只列出你能管理、而且機器龍也在的伺服器。")}
          >
            <a href={staticPath(locale, "/install")} className={buttonVariants()}>
              {t("安裝機器人")}
            </a>
          </Notice>
        </Shell>
      );
    case "signed-in": {
      const features = view.panel.state === "ready" ? view.panel.features : [];
      const states = featurePages.map((page) => stateOf(page, features));
      const page = featurePages.find((page) => page.slug === slug);
      const pageState = page && stateOf(page, features);

      return (
        <Shell
          t={t}
          home={home}
          onLogout={logout}
          logoutFailed={view.logoutFailed}
          switcher={
            <GuildSwitcher t={t} guilds={view.guilds} current={view.guild} onOpen={open} />
          }
          nav={
            view.panel.state === "ready" ? (
              <PageNav t={t} states={states} current={page} go={go} />
            ) : undefined
          }
          loading={view.panel.state === "loading"}
          title={
            view.panel.state === "ready" ? (
              <PageTitle t={t} page={page} go={go} status={pageState?.status} />
            ) : null
          }
        >
          {view.linkConflict && (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertDescription>
                {t("這個連結屬於另一個 Discord 帳號，所以沒有打開。要用它的話，先登出再按一次連結。")}
              </AlertDescription>
            </Alert>
          )}
          {view.panel.state === "refused" && view.panel.code === "internal_error" && (
            <Notice
              icon={<ServerOff />}
              title={t("暫時連不上機器龍")}
              body={t("稍後再重新整理一次。")}
            >
              <Button variant="outline" onClick={load}>
                <RotateCw />
                {t("再試一次")}
              </Button>
            </Notice>
          )}
          {view.panel.state === "refused" && view.panel.code !== "internal_error" && (
            <Notice
              icon={<ShieldOff />}
              title={
                view.panel.code === "missing_manage_guild"
                  ? t("你已經不能管理這個伺服器")
                  : t("清單裡沒有這個伺服器")
              }
              body={t("清單只列出你能管理、而且機器龍也在的伺服器。重新登入會更新清單。")}
            />
          )}
          {view.panel.state === "ready" &&
            (pageState ? (
              <FeatureView t={t} locale={locale} state={pageState} />
            ) : (
              <Overview t={t} locale={locale} states={states} go={go} />
            ))}
        </Shell>
      );
    }
  }
}

type Go = (target: string | null) => (event: MouseEvent<HTMLElement>) => void;

/** The dashboard's frame: shadcn's sidebar beside the page, a drawer on narrow screens. */
function Shell({
  t,
  home,
  title,
  switcher,
  nav,
  loading,
  onLogout,
  logoutFailed,
  children,
}: {
  t: Translate;
  home: string;
  title: ReactNode;
  switcher?: ReactNode;
  nav?: ReactNode;
  loading?: boolean;
  onLogout?: () => void;
  logoutFailed?: boolean;
  children?: ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <a href={home} className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
            <img src="/img/logo.svg" alt="" width={18} height={24} />
            <span className="font-semibold text-lg">Yeecord</span>
          </a>
          {switcher ?? <SidebarMenuSkeleton showIcon />}
        </SidebarHeader>
        <SidebarContent>
          {nav ??
            (loading && (
              <SidebarGroup>
                <SidebarMenu>
                  {[0, 1, 2, 3, 4, 5].map((key) => (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href={home} />}>
                <ArrowLeft />
                <span>{t("回到官網")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {onLogout && (
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onLogout}>
                  <LogOut />
                  <span>{t("登出")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
          {logoutFailed && (
            <p role="alert" className="px-2 text-destructive text-sm">
              {t("登出沒有成功，再試一次。")}
            </p>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 px-4 lg:px-8">
          <SidebarTrigger className="-ml-1 md:hidden" aria-label={t("所有功能")} />
          <Separator orientation="vertical" className="mr-1 h-4 md:hidden" />
          {title}
        </header>
        <section aria-live="polite" className="flex flex-1 flex-col gap-8 px-4 pt-4 pb-16 lg:px-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
            {loading ? <PanelSkeleton /> : children}
          </div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

function PageTitle({
  t,
  page,
  go,
  status,
}: {
  t: Translate;
  page: FeaturePage | undefined;
  go: Go;
  status: PageState["status"] | undefined;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <h2 className="sr-only">{t(page?.label ?? "總覽")}</h2>
      <Breadcrumb>
        <BreadcrumbList>
          {page ? (
            <>
              <BreadcrumbItem className="max-sm:hidden">
                <BreadcrumbLink render={<a href={pageHref(null)} onClick={go(null)} />}>
                  {t("總覽")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="max-sm:hidden" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  {t(page.label)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                {t("總覽")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      {status && <StatusBadge t={t} status={status} />}
    </div>
  );
}

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
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                aria-label={t("切換伺服器")}
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            {current && <GuildIcon guild={current} />}
            <span className="min-w-0 flex-1 truncate font-semibold">
              {current?.name ?? t("所有伺服器")}
            </span>
            <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("所有伺服器")}</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={current?.id}
                onValueChange={(id) => {
                  const guild = guilds.find((guild) => guild.id === id);

                  if (guild) {
                    onOpen(guild);
                  }
                }}
              >
                {guilds.map((guild) => (
                  <DropdownMenuRadioItem key={guild.id} value={guild.id} closeOnClick>
                    <GuildIcon guild={guild} />
                    <span className="truncate">{guild.name}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function GuildIcon({ guild }: { guild: Guild }) {
  if (!guild.icon) {
    return (
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary font-semibold text-sidebar-primary-foreground text-sm"
      >
        {guild.name.slice(0, 1)}
      </span>
    );
  }

  return (
    <img
      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=64`}
      alt=""
      className="size-8 shrink-0 rounded-lg"
    />
  );
}

function PageNav({
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
  const { setOpenMobile } = useSidebar();
  const visit = (target: string | null) => (event: MouseEvent<HTMLElement>) => {
    go(target)(event);
    setOpenMobile(false);
  };

  return (
    <nav aria-label={t("所有功能")}>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={!current}
              render={<a href={pageHref(null)} onClick={visit(null)} />}
            >
              <LayoutGrid />
              <span>{t("總覽")}</span>
            </SidebarMenuButton>
            {failing > 0 && (
              <SidebarMenuBadge className="bg-destructive text-white">{failing}</SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{t(group.label)}</SidebarGroupLabel>
          <SidebarMenu>
            {group.pages.map((page) => {
              const Icon = page.icon;
              const state = states.find((state) => state.page === page);

              return (
                <SidebarMenuItem key={page.slug}>
                  <SidebarMenuButton
                    isActive={page === current}
                    render={<a href={pageHref(page.slug)} onClick={visit(page.slug)} />}
                  >
                    <Icon />
                    <span>{t(page.label)}</span>
                  </SidebarMenuButton>
                  {state?.status === "failing" && (
                    <SidebarMenuBadge>
                      <CircleAlert className="size-4 text-destructive" aria-label={t("要處理")} />
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </nav>
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
    <>
      {failing.length > 0 && (
        <section aria-labelledby="overview-failing" className="flex flex-col gap-3">
          <GroupHeading id="overview-failing" label={t("要處理")} count={failing.length} />
          <ItemGroup className="gap-3">
            {failing.map((state) => {
              const told = state.feature?.last_failure
                ? describe.failure(state.feature, state.feature.last_failure)
                : { title: t(state.page.label) };

              return (
                <Item
                  key={state.page.slug}
                  variant="outline"
                  className="border-destructive/30 bg-destructive/5 hover:bg-destructive/10"
                  render={<a href={pageHref(state.page.slug)} onClick={go(state.page.slug)} />}
                >
                  <ItemMedia>
                    <StatusIcon status="failing" t={t} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      <span>{told.title}</span>
                    </ItemTitle>
                    {told.detail && (
                      <ItemDescription className="line-clamp-none leading-relaxed">
                        {told.detail}
                      </ItemDescription>
                    )}
                  </ItemContent>
                </Item>
              );
            })}
          </ItemGroup>
        </section>
      )}
      <section aria-labelledby="overview-all" className="flex flex-col gap-6">
        <GroupHeading id="overview-all" label={t("所有功能")} />
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-3">
            <h4 className="text-muted-foreground text-sm">{t(group.label)}</h4>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {group.pages.map((page) => {
                const status = states.find((state) => state.page === page)?.status ?? "not_configured";
                const Icon = page.icon;

                return (
                  <Item
                    key={page.slug}
                    variant={status === "not_configured" ? "muted" : "outline"}
                    className="hover:bg-accent"
                    render={<a href={pageHref(page.slug)} onClick={go(page.slug)} />}
                  >
                    <ItemMedia variant="icon">
                      <Icon />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{t(page.label)}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <StatusBadge t={t} status={status} />
                    </ItemActions>
                  </Item>
                );
              })}
            </div>
          </div>
        ))}
      </section>
      <p className="text-muted-foreground text-sm">
        {t("這裡只能看。要改設定，在 Discord 裡用對應的斜線指令。")}
      </p>
    </>
  );
}

function FeatureView({
  t,
  locale,
  state,
}: {
  t: Translate;
  locale: Locale;
  state: PageState;
}) {
  const describe = describer(t, locale);
  const { feature, status, command, page } = state;
  const Icon = page.icon;
  const told = feature?.last_failure ? describe.failure(feature, feature.last_failure) : undefined;
  const settings = feature && status !== "not_configured" ? describe.settings(feature) : [];

  if (status === "not_configured") {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
          <EmptyTitle>{t("這個功能還沒設定")}</EmptyTitle>
          <EmptyDescription>
            {fill(t("在 Discord 用 {command} 開始設定"), { command: <Command name={command} /> })}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      {status === "failing" && told && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>{told.title}</AlertTitle>
          {told.detail && (
            <AlertDescription className="leading-relaxed">{told.detail}</AlertDescription>
          )}
        </Alert>
      )}
      {feature && (
        <Card>
          <CardContent>
            {settings.length > 0 ? (
              <dl className="grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
                {settings.map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-muted-foreground">{t(label)}</dt>
                    <dd className="leading-relaxed">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="leading-relaxed">{describe.summary(feature)}</p>
            )}
          </CardContent>
        </Card>
      )}
      <p className="text-muted-foreground leading-relaxed">
        {fill(t("在 Discord 用 {command} 修改設定"), { command: <Command name={command} /> })}
      </p>
    </>
  );
}

function GroupHeading({ id, label, count }: { id: string; label: string; count?: number }) {
  return (
    <h3 id={id} className="flex items-baseline gap-2 font-semibold text-lg">
      {label}
      {count !== undefined && (
        <span className="font-normal text-muted-foreground tabular-nums">{count}</span>
      )}
    </h3>
  );
}

function PanelSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy>
      <Skeleton className="mb-2 h-6 w-28" />
      <Skeleton className="h-20 rounded-xl" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function Notice({
  icon,
  title,
  body,
  children,
}: {
  icon: ReactNode;
  title: ReactNode;
  body: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{body}</EmptyDescription>
      </EmptyHeader>
      {children && <EmptyContent>{children}</EmptyContent>}
    </Empty>
  );
}
