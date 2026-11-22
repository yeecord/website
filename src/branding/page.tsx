import { HomeLayout } from "fumadocs-ui/layouts/home";
import { DownloadIcon, XIcon } from "lucide-react";
import type { ReactNode } from "react";
import Footer from "~/components/Footer";
import { footer } from "~/config";
import { DinoMascot } from "~/home/DinoMascot";
import type { Locale } from "~/i18n";
import { type Phrase, type Translate, translator } from "~/i18n/translate";
import { localizedLayout, LocalizedMeta } from "~/localized-page";
import { cn } from "~/utils/cn";

const base = "/brand/yeecord/";
const scene = "/home/scene/";

const formats = ["SVG", "PNG", "ICO"] as const;

type Format = (typeof formats)[number];
type Download = { label: Phrase | Format; file: string };

/** File formats are shown as they are, not translated. */
function isFormat(label: Phrase | Format): label is Format {
  return formats.some((format) => format === label);
}

const focusRing =
  "outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-fd-foreground";

const lockups = [
  { surface: "bg-white", file: "lockup.svg", label: "深色字" },
  { surface: "bg-yee-navy", file: "lockup-white.svg", label: "白字" },
  { surface: "bg-yee-sky", file: "lockup-white.svg", label: "白字" },
] satisfies { surface: string; file: string; label: Phrase }[];

const marks: {
  title: Phrase;
  body: Phrase;
  art: ReactNode;
  downloads: Download[];
  className?: string;
}[] = [
  {
    title: "頭像",
    body: "Discord 頭像和社群帳號用這個。上傳整張方形圖，平台會自己裁成圓形。",
    art: <img src={`${base}avatar.svg`} alt="" width={224} height={224} className="size-40 rounded-full" />,
    downloads: [
      { label: "SVG", file: "avatar.svg" },
      { label: "PNG", file: "avatar-1024.png" },
    ],
    className: "sm:col-span-2",
  },
  {
    title: "角色",
    body: "透明背景，放進插畫、貼圖和分享圖。",
    art: <img src={`${base}character.svg`} alt="" width={112} height={112} className="size-28" />,
    downloads: [
      { label: "SVG", file: "character.svg" },
      { label: "PNG", file: "character-1024.png" },
      { label: "貼圖", file: "sticker-320.png" },
    ],
  },
  {
    title: "單色",
    body: "只能用一種顏色時用，例如印刷或系統圖示。顏色會跟著周圍的文字顏色。",
    art: (
      <span
        aria-hidden
        className="size-28 bg-fd-foreground [mask:url(/brand/yeecord/silhouette.svg)_center/contain_no-repeat]"
      />
    ),
    downloads: [{ label: "SVG", file: "silhouette.svg" }],
  },
  {
    title: "網站圖示",
    body: "只取頭部，把五官放大，縮到 16 px 還認得出來。",
    art: <img src={`${base}favicon.svg`} alt="" width={112} height={112} className="size-28 rounded-3xl" />,
    downloads: [
      { label: "SVG", file: "favicon.svg" },
      { label: "ICO", file: "favicon.ico" },
      { label: "Apple 圖示", file: "apple-touch-icon.png" },
    ],
    className: "sm:col-span-2 lg:col-span-1",
  },
];

const poses: { name: Phrase; file: string }[] = [
  { name: "待機", file: "idle" },
  { name: "開心", file: "happy" },
  { name: "跑步", file: "run" },
  { name: "跳躍", file: "jump" },
  { name: "蹲下", file: "duck" },
  { name: "昏倒", file: "dead" },
];

const illustrations = [
  "sun",
  "moon",
  "cloud-wide",
  "balloon",
  "cottage",
  "tree",
  "pine",
  "bush",
  "flowers",
  "rabbit",
  "star",
  "rock",
  "mushroom",
  "cactus",
  "crate",
  "log",
  "hedgehog",
  "cone",
  "bird",
  "bee",
  "plane",
  "sapling",
];

const environments: {
  name: Phrase;
  id: string;
  app: string;
  body: Phrase;
  greeting: Phrase;
  suffix: string;
  surface: string;
}[] = [
  {
    name: "正式環境",
    id: "production",
    app: "YEE 式機器龍",
    body: "使用者看到的機器龍。藍色背景，戴皇冠。",
    greeting: "歡迎加入伺服器！先到 #規則 看一下，再來打聲招呼吧。",
    suffix: "",
    surface: "bg-yee-sky",
  },
  {
    name: "測試環境",
    id: "staging",
    app: "YEE 式機器龍 Staging",
    body: "上線前的最後一關。紫色背景，戴一個三角錐。",
    greeting: "這是測試環境的機器龍，跟正式的放在一起也分得出來。",
    suffix: "-staging",
    surface: "bg-yee-staging",
  },
  {
    name: "開發環境",
    id: "development",
    app: "YEE 式機器龍 Dev",
    body: "本機和開發用的應用程式。橘色背景，頭上坐一隻小黃鴨。",
    greeting: "開發中的版本，橘色背景一眼就認得出來。",
    suffix: "-dev",
    surface: "bg-yee-dev",
  },
];

const colors: { name: Phrase; hex: string; use: Phrase; swatch: string }[] = [
  { name: "天空藍", hex: "#326ED0", use: "頭像和分享圖的背景", swatch: "bg-yee-sky text-white md:col-span-2 md:h-64" },
  { name: "恐龍綠", hex: "#32D34C", use: "角色本體", swatch: "bg-yee-green text-yee-ink md:col-span-2 md:h-64" },
  { name: "陰影綠", hex: "#24A63F", use: "角色的陰影", swatch: "bg-yee-shade text-yee-ink" },
  { name: "皇冠金", hex: "#F7C157", use: "皇冠", swatch: "bg-yee-crown text-yee-ink" },
  { name: "墨色", hex: "#362F36", use: "眼睛和嘴巴", swatch: "bg-yee-ink text-white" },
  { name: "深海藍", hex: "#17233B", use: "字標", swatch: "bg-yee-navy text-white" },
  { name: "測試紫", hex: "#7C4DDB", use: "測試環境的背景", swatch: "bg-yee-staging text-white md:col-span-2" },
  { name: "開發橘", hex: "#E0603A", use: "開發環境的背景", swatch: "bg-yee-dev text-white md:col-span-2" },
];

const misuses: { label: Phrase; art: ReactNode }[] = [
  { label: "拉長或壓扁", art: <Avatar className="scale-x-125" /> },
  { label: "換顏色", art: <Avatar className="hue-rotate-160" /> },
  { label: "旋轉", art: <Avatar className="-rotate-12" /> },
  { label: "加外框或陰影", art: <Avatar className="outline-4 outline-offset-2 outline-fd-foreground drop-shadow-lg" /> },
  {
    label: "放在雜亂的背景上",
    art: (
      <span className="flex size-24 items-center justify-center rounded-xl bg-[repeating-linear-gradient(45deg,var(--color-yee-dev)_0_8px,var(--color-yee-green)_8px_16px,var(--color-yee-sky)_16px_24px)]">
        <img src={`${base}character.svg`} alt="" width={72} height={72} className="size-18" />
      </span>
    ),
  },
  { label: "正式環境換掉皇冠", art: <Avatar src="wrong-topper-production.svg" /> },
];

function Avatar({ className, src = "avatar.svg" }: { className?: string; src?: string }) {
  return <img src={`${base}${src}`} alt="" width={72} height={72} className={cn("size-18 rounded-full", className)} />;
}

/** The lockup in dark text, swapped for the white one in dark mode. */
function Lockup({ className }: { className: string }) {
  return (
    <>
      <img src={`${base}lockup.svg`} alt="" width={240} height={52} className={cn("w-auto dark:hidden", className)} />
      <img
        src={`${base}lockup-white.svg`}
        alt=""
        width={240}
        height={52}
        className={cn("hidden w-auto dark:block", className)}
      />
    </>
  );
}

/** A square download button pinned to a tile's corner, as on Discord's brand page. */
function CornerDownload({ href, label, className }: { href: string; label: string; className?: string }) {
  return (
    <a
      href={href}
      download
      aria-label={label}
      title={label}
      className={cn(
        "absolute right-4 bottom-4 flex size-11 items-center justify-center rounded-xl transition-[background-color,scale] duration-150 ease-out active:scale-95 motion-reduce:transition-none",
        focusRing,
        className ?? "bg-fd-foreground/8 hover:bg-fd-foreground/14",
      )}
    >
      <DownloadIcon className="size-5" />
    </a>
  );
}

/** Download chips. `onColor` is for chips sitting on a brand-coloured tile. */
function Downloads({ items, t, onColor = false }: { items: Download[]; t: Translate; onColor?: boolean }) {
  return (
    <div className="flex flex-wrap content-start gap-2">
      {items.map(({ label, file }) => (
        <a
          key={file}
          href={`${base}${file}`}
          download
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium text-sm transition-[background-color,scale] duration-150 ease-out active:scale-97 motion-reduce:transition-none",
            onColor
              ? "bg-white/20 outline-none hover:bg-white/30 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
              : cn("bg-fd-foreground/8 hover:bg-fd-foreground/14", focusRing),
          )}
        >
          <DownloadIcon className="size-4" />
          {isFormat(label) ? label : t(label)}
        </a>
      ))}
    </div>
  );
}

function Section({ id, title, lead, children }: { id: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-8">
      <div className="grid max-w-2xl gap-3">
        <h2 id={id} className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
          {title}
        </h2>
        {lead && <p className="text-fd-muted-foreground text-lg">{lead}</p>}
      </div>
      {children}
    </section>
  );
}

function Hero({ t }: { t: Translate }) {
  return (
    <header className="relative isolate overflow-hidden rounded-[2.5rem] bg-yee-sky text-white">
      <img
        src={`${scene}cloud-wide.svg`}
        alt=""
        width={220}
        height={90}
        className="-z-1 absolute top-10 right-10 w-44 opacity-90 max-lg:hidden"
      />
      <img
        src={`${scene}cloud-small.svg`}
        alt=""
        width={120}
        height={60}
        className="-z-1 absolute top-5 right-5 w-16 opacity-80 lg:top-[42%] lg:right-[34%] lg:w-24"
      />
      <img
        src={`${scene}hills.svg`}
        alt=""
        width={1015}
        height={273}
        className="-z-1 absolute inset-x-0 bottom-12 h-36 w-full"
      />
      <div aria-hidden className="-z-1 absolute inset-x-0 bottom-0 h-14 bg-yee-grass" />
      <div className="grid items-end gap-6 px-6 pt-14 sm:px-12 lg:grid-cols-[minmax(0,1fr)_auto] md:pt-20">
        <div className="grid gap-5 pb-2 lg:pb-48">
          <h1 className="min-w-0 text-balance font-bold text-5xl leading-[1.1] tracking-tight [overflow-wrap:break-word] lg:text-6xl">
            {t("YEE 式機器龍品牌素材")}
          </h1>
          <p className="max-w-lg text-lg text-white/90">
            {t("頭像、字標和角色圖都能直接下載。使用前看一下配色和規範，機器龍在每個地方才會長得一樣。")}
          </p>
          <div>
            <a
              href={`${base}yeecord-brand-kit.zip`}
              download
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-yee-navy shadow-[0_4px_0_var(--color-yee-navy)] outline-none transition-[translate,box-shadow] duration-150 ease-out focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white active:translate-y-1 active:shadow-none motion-reduce:transition-none"
            >
              <DownloadIcon className="size-5" />
              {t("下載全部素材")}
            </a>
          </div>
        </div>
        <DinoMascot alt={t("YEE 式機器龍")} label={t("YEE 式機器龍")} className="justify-self-center pb-6" />
      </div>
    </header>
  );
}

/** Discord's profile popout for the app, built from the same tokens as the chat mock. */
function ProfileCard({ t }: { t: Translate }) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-discord-card font-discord text-discord-text text-sm">
      <div className="h-24 bg-yee-sky" />
      <div className="grid gap-3 px-5 pb-6">
        <img
          src={`${base}avatar.svg`}
          alt=""
          width={88}
          height={88}
          className="-mt-11 size-22 rounded-full ring-6 ring-discord-card"
        />
        <p className="flex items-center gap-1.5">
          <strong className="text-discord-strong text-xl">YEE 式機器龍</strong>
          <span className="rounded bg-discord-blurple px-1 font-semibold text-[0.625rem] text-white">APP</span>
        </p>
        <p className="rounded-xl bg-discord-chip p-3">{t("抽獎、身分組、動態語音，介面全中文，免費使用")}</p>
      </div>
    </div>
  );
}

export function BrandingPage({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <HomeLayout {...localizedLayout(locale)}>
      <LocalizedMeta
        title={t("YEE 式機器龍品牌素材")}
        description={t("下載 YEE 式機器龍的頭像、字標和角色圖，也看看配色、各環境的版本和使用規範。")}
      />
      <main className="mx-auto grid w-full max-w-6xl gap-28 px-4 pt-6 pb-24">
        <Hero t={t} />

        <Section id="logos" title={t("標誌")} lead={t("依照要放的位置，挑一個版本。")}>
          <div className="grid gap-4 md:grid-cols-3">
            {lockups.map(({ surface, file, label }) => (
              <div
                key={surface}
                className={cn(
                  "relative flex h-52 items-center justify-center rounded-[2rem] border",
                  surface,
                  surface === "bg-white" ? "text-yee-navy" : "text-white",
                )}
              >
                <img src={`${base}${file}`} alt="" width={240} height={52} className="h-12 w-auto" />
                <CornerDownload
                  href={`${base}${file}`}
                  label={`${t("字標組合")} ${t(label)}`}
                  className={surface === "bg-white" ? undefined : "bg-white/15 hover:bg-white/25"}
                />
              </div>
            ))}
          </div>
          <p className="max-w-2xl text-fd-muted-foreground">
            {t("網站頁首、合作頁和簡報用這個。淺色背景用深色字，深色背景用白字。")}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {marks.map(({ title, body, art, downloads, className }) => (
              <article
                key={title}
                className={cn(
                  "row-span-4 grid grid-rows-subgrid gap-y-3 rounded-[2rem] border bg-fd-card p-6",
                  className,
                )}
              >
                <div className="mb-3 flex min-h-36 items-center justify-center">{art}</div>
                <h3 className="font-bold text-xl">{t(title)}</h3>
                <p className="text-fd-muted-foreground text-sm">{t(body)}</p>
                <Downloads items={downloads} t={t} />
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="poses"
          title={t("姿勢")}
          lead={t("機器龍的幾個招牌動作，透明背景的 PNG，做貼圖或插畫時直接拿去用。")}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {poses.map(({ name, file }) => (
              <figure key={file} className="relative row-span-2 grid grid-rows-subgrid gap-y-2 rounded-[2rem] border bg-fd-card p-4 pb-5">
                <img
                  src={`${base}poses/${file}.png`}
                  alt=""
                  width={1000}
                  height={868}
                  loading="lazy"
                  className="-scale-x-100 aspect-[1000/868] w-full"
                />
                <figcaption className="font-bold">{t(name)}</figcaption>
                <CornerDownload href={`${base}poses/${file}.png`} label={`${t(name)} PNG`} className="size-9 bottom-3 right-3 bg-fd-foreground/8 hover:bg-fd-foreground/14" />
              </figure>
            ))}
          </div>
        </Section>

        <Section
          id="illustrations"
          title={t("場景插圖")}
          lead={t("首頁的村莊和小遊戲用到的插圖，都是 SVG，點一下就能下載。")}
        >
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {illustrations.map((name) => (
              <li key={name}>
                <a
                  href={`${scene}${name}.svg`}
                  download
                  className={cn(
                    "grid h-full justify-items-center gap-3 rounded-3xl border bg-fd-card p-4 transition-[background-color,scale] duration-150 ease-out hover:bg-fd-muted active:scale-97 motion-reduce:transition-none",
                    focusRing,
                  )}
                >
                  <img
                    src={`${scene}${name}.svg`}
                    alt=""
                    width={80}
                    height={80}
                    loading="lazy"
                    className="size-20 object-contain"
                  />
                  <span className="text-fd-muted-foreground text-xs">{name}.svg</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="environments"
          title={t("各環境的版本")}
          lead={t(
            "每個環境的頭飾和背景色都不一樣。正式環境戴皇冠，測試環境戴三角錐，開發環境頭上坐一隻小黃鴨。縮到 16 px 時主要靠背景色辨認，同一個伺服器裡有好幾隻機器龍也不會認錯。",
          )}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {environments.map(({ name, id, app, body, suffix, surface }) => (
              <article key={id} className={cn("row-span-5 grid grid-rows-subgrid gap-y-5 rounded-[2rem] p-6 text-white", surface)}>
                <img
                  src={`${base}avatar${suffix}.svg`}
                  alt=""
                  width={112}
                  height={112}
                  className="size-28 rounded-full ring-4 ring-white/30"
                />
                <div className="grid gap-1">
                  <h3 className="font-bold text-2xl">{t(name)}</h3>
                  <p className="font-mono text-sm text-white/80">{id}</p>
                </div>
                <p className="text-white/90">{t(body)}</p>
                <div className="flex items-center gap-2 self-start rounded-xl bg-discord-bg px-3 py-2 text-discord-text text-xs">
                  <img src={`${base}favicon${suffix}.svg`} alt="" width={16} height={16} className="size-4 rounded-sm" />
                  <span className="truncate">{app}</span>
                </div>
                <Downloads
                  items={[
                    { label: "SVG", file: `avatar${suffix}.svg` },
                    { label: "PNG", file: `avatar${suffix}-1024.png` },
                    { label: "ICO", file: `favicon${suffix}.ico` },
                  ]}
                  t={t}
                  onColor
                />
              </article>
            ))}
          </div>
          <div className="grid max-w-2xl gap-2">
            <p>{t("換成環境版本時，這些地方也要一起改：")}</p>
            <ul className="grid list-disc gap-1 pl-5 text-fd-muted-foreground">
              <li>{t("Discord 應用程式的名稱後面加上環境，例如「YEE 式機器龍 Staging」。")}</li>
              <li>{t("網站的 favicon 和頁面標題跟著換，在分頁列上一眼就分得出來。")}</li>
              <li>{t("皇冠只給正式環境戴。")}</li>
            </ul>
          </div>
        </Section>

        <Section id="colors" title={t("顏色")}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {colors.map(({ name, hex, use, swatch }) => (
              <div key={hex} className={cn("grid h-44 content-start gap-1 rounded-[2rem] p-6", swatch)}>
                <span className="font-bold text-xl">{t(name)}</span>
                <code className="font-mono">{hex}</code>
                <span className="text-sm opacity-80">{t(use)}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="small"
          title={t("縮小後的樣子")}
          lead={t("頭像在 Discord 裡常常只有 16 到 40 px，深色和淺色主題都要看得出來。")}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {["bg-discord-bg text-discord-text", "border bg-white text-discord-bg"].map((surface) => (
              <div key={surface} className={cn("flex items-end justify-center gap-6 rounded-[2rem] p-8", surface)}>
                {[64, 40, 32, 24, 16].map((size) => (
                  <figure key={size} className="grid justify-items-center gap-2">
                    <img src={`${base}avatar.svg`} alt="" width={size} height={size} className="rounded-full" />
                    <figcaption className="text-xs opacity-70">{size} px</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </Section>

        <Section id="usage" title={t("使用規範")}>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="row-span-3 grid grid-rows-subgrid gap-y-4 rounded-[2rem] border bg-fd-card p-6">
              <div className="flex min-h-40 items-center justify-center rounded-3xl bg-fd-muted p-4">
                <span className="rounded-xl border-2 border-fd-primary border-dashed p-6">
                  <Lockup className="h-12" />
                </span>
              </div>
              <h3 className="font-bold text-xl">{t("留白")}</h3>
              <p className="text-fd-muted-foreground text-sm">
                {t("字標組合四周至少留出頭像一半寬的空白，不要讓文字或其他標誌貼上來。")}
              </p>
            </article>
            <article className="row-span-3 grid grid-rows-subgrid gap-y-4 rounded-[2rem] border bg-fd-card p-6">
              <div className="flex min-h-40 items-center justify-center gap-6 rounded-3xl bg-fd-muted p-4">
                <img src={`${base}favicon.svg`} alt="" width={16} height={16} className="size-4" />
                <Lockup className="h-6" />
              </div>
              <h3 className="font-bold text-xl">{t("最小尺寸")}</h3>
              <p className="text-fd-muted-foreground text-sm">
                {t("頭像最小 16 px，字標組合最矮 24 px。再小就改用網站圖示。")}
              </p>
            </article>
          </div>
          <h3 className="font-bold text-2xl">{t("請不要這樣做")}</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {misuses.map(({ label, art }) => (
              <figure
                key={label}
                className="relative row-span-2 grid grid-rows-subgrid justify-items-center gap-y-3 rounded-[2rem] border bg-fd-card p-5"
              >
                <span className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-yee-dev text-white">
                  <XIcon className="size-4" strokeWidth={3} />
                </span>
                <div className="flex h-24 items-center justify-center">{art}</div>
                <figcaption className="text-center text-fd-muted-foreground text-sm">{t(label)}</figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section id="in-use" title={t("實際用起來")}>
          <div className="grid items-start gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="grid content-start gap-5 rounded-[2rem] bg-discord-bg p-6 font-discord text-discord-text text-sm">
              {environments.map(({ id, app, greeting, suffix }) => (
                <div key={id} className="flex gap-3">
                  <img
                    src={`${base}avatar${suffix}.svg`}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 rounded-full"
                  />
                  <div className="grid gap-1">
                    <p className="flex items-center gap-1.5">
                      <strong className="text-discord-strong">{app}</strong>
                      <span className="rounded bg-discord-blurple px-1 font-semibold text-[0.625rem] text-white">
                        APP
                      </span>
                    </p>
                    <p>{t(greeting)}</p>
                  </div>
                </div>
              ))}
            </div>
            <ProfileCard t={t} />
            <figure className="grid gap-3 md:col-span-2">
              <img
                src={`${base}social-1200x630.png`}
                alt={t("連結分享時顯示的預覽圖")}
                width={1200}
                height={630}
                loading="lazy"
                className="rounded-[2rem] border"
              />
              <figcaption className="text-fd-muted-foreground text-sm">
                {t("分享連結時的預覽圖，1200 × 630 px。")}
              </figcaption>
            </figure>
          </div>
        </Section>

        <section
          aria-labelledby="download-all"
          className="grid items-center gap-6 overflow-hidden rounded-[2.5rem] bg-yee-sky p-8 text-white sm:p-12 md:grid-cols-[minmax(0,1fr)_auto]"
        >
          <div className="grid gap-4">
            <h2 id="download-all" className="font-bold text-4xl tracking-tight sm:text-5xl">
              {t("下載全部素材")}
            </h2>
            <p className="max-w-md text-lg text-white/90">{t("頭像、字標、角色、姿勢和場景插圖，全部打包成一個 zip。")}</p>
            <div>
              <a
                href={`${base}yeecord-brand-kit.zip`}
                download
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-yee-navy shadow-[0_4px_0_var(--color-yee-navy)] outline-none transition-[translate,box-shadow] duration-150 ease-out focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white active:translate-y-1 active:shadow-none motion-reduce:transition-none"
              >
                <DownloadIcon className="size-5" />
                yeecord-brand-kit.zip
              </a>
            </div>
          </div>
          <img
            src={`${base}poses/happy.png`}
            alt=""
            width={1000}
            height={868}
            loading="lazy"
            className="-scale-x-100 w-56 justify-self-center sm:w-72"
          />
        </section>
      </main>
      <Footer categories={footer(locale)} brand={t("YEE 式機器龍")} />
    </HomeLayout>
  );
}
