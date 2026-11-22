import { HomeLayout } from "fumadocs-ui/layouts/home";
import { DownloadIcon } from "lucide-react";
import type { ReactNode } from "react";
import Footer from "~/components/Footer";
import { buttonVariants } from "~/components/ui/button";
import { footer } from "~/config";
import type { Locale } from "~/i18n";
import { type Phrase, translator } from "~/i18n/translate";
import { localizedLayout, LocalizedMeta } from "~/localized-page";
import { cn } from "~/utils/cn";

const base = "/brand/yeecord/";

const formats = ["SVG", "PNG", "ICO"] as const;

type Format = (typeof formats)[number];
type Download = { label: Phrase | Format; file: string };

/** File formats are shown as they are, not translated. */
function isFormat(label: Phrase | Format): label is Format {
  return formats.some((format) => format === label);
}

const logos: {
  title: Phrase;
  body: Phrase;
  art: ReactNode;
  downloads: Download[];
}[] = [
  {
    title: "頭像",
    body: "Discord 頭像和社群帳號用這個。上傳整張方形圖，平台會自己裁成圓形。",
    art: <img src={`${base}avatar.svg`} alt="" width={128} height={128} className="size-32 rounded-full" />,
    downloads: [
      { label: "SVG", file: "avatar.svg" },
      { label: "PNG", file: "avatar-1024.png" },
    ],
  },
  {
    title: "字標組合",
    body: "網站頁首、合作頁和簡報用這個。淺色背景用深色字，深色背景用白字。",
    art: (
      <div className="grid w-full gap-3">
        <div className="rounded-xl bg-white p-3">
          <img src={`${base}lockup.svg`} alt="" width={240} height={52} className="h-12 w-auto" />
        </div>
        <div className="rounded-xl bg-[#17233B] p-3">
          <img src={`${base}lockup-white.svg`} alt="" width={240} height={52} className="h-12 w-auto" />
        </div>
      </div>
    ),
    downloads: [
      { label: "深色字", file: "lockup.svg" },
      { label: "白字", file: "lockup-white.svg" },
    ],
  },
  {
    title: "角色",
    body: "透明背景，放進插畫、貼圖和分享圖。",
    art: (
      <img
        src={`${base}character.svg`}
        alt=""
        width={128}
        height={128}
        className="size-32 rounded-xl bg-[conic-gradient(var(--color-fd-muted)_25%,transparent_0_50%,var(--color-fd-muted)_0_75%,transparent_0)] bg-size-[16px_16px]"
      />
    ),
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
        className="size-32 bg-fd-foreground [mask:url(/brand/yeecord/silhouette.svg)_center/contain_no-repeat]"
      />
    ),
    downloads: [{ label: "SVG", file: "silhouette.svg" }],
  },
  {
    title: "網站圖示",
    body: "只取頭部，把五官放大，縮到 16 px 還認得出來。",
    art: <img src={`${base}favicon.svg`} alt="" width={128} height={128} className="size-32 rounded-2xl" />,
    downloads: [
      { label: "SVG", file: "favicon.svg" },
      { label: "ICO", file: "favicon.ico" },
      { label: "Apple 圖示", file: "apple-touch-icon.png" },
    ],
  },
];

const environments: {
  name: Phrase;
  id: string;
  app: string;
  body: Phrase;
  greeting: Phrase;
  suffix: string;
}[] = [
  {
    name: "正式環境",
    id: "production",
    app: "YEE 式機器龍",
    body: "使用者看到的機器龍。藍色背景，戴皇冠。",
    greeting: "歡迎加入伺服器！先到 #規則 看一下，再來打聲招呼吧。",
    suffix: "",
  },
  {
    name: "測試環境",
    id: "staging",
    app: "YEE 式機器龍 Staging",
    body: "上線前的最後一關。紫色背景，戴一個三角錐。",
    greeting: "這是測試環境的機器龍，跟正式的放在一起也分得出來。",
    suffix: "-staging",
  },
  {
    name: "開發環境",
    id: "development",
    app: "YEE 式機器龍 Dev",
    body: "本機和開發用的應用程式。橘色背景，頭上坐一隻小黃鴨。",
    greeting: "開發中的版本，橘色背景一眼就認得出來。",
    suffix: "-dev",
  },
];

const colors: { name: Phrase; hex: string; use: Phrase }[] = [
  { name: "天空藍", hex: "#326ED0", use: "頭像和分享圖的背景" },
  { name: "恐龍綠", hex: "#32D34C", use: "角色本體" },
  { name: "陰影綠", hex: "#24A63F", use: "角色的陰影" },
  { name: "皇冠金", hex: "#F7C157", use: "皇冠" },
  { name: "墨色", hex: "#362F36", use: "眼睛和嘴巴" },
  { name: "深海藍", hex: "#17233B", use: "字標" },
  { name: "測試紫", hex: "#7C4DDB", use: "測試環境的背景" },
  { name: "開發橘", hex: "#E0603A", use: "開發環境的背景" },
];

const misuses: { label: Phrase; art: ReactNode }[] = [
  { label: "拉長或壓扁", art: <Avatar className="scale-x-125" /> },
  { label: "換顏色", art: <Avatar className="hue-rotate-[160deg]" /> },
  { label: "旋轉", art: <Avatar className="-rotate-12" /> },
  { label: "加外框或陰影", art: <Avatar className="outline-4 outline-offset-2 outline-fd-foreground drop-shadow-lg" /> },
  {
    label: "放在雜亂的背景上",
    art: (
      <span className="flex size-24 items-center justify-center rounded-xl bg-[repeating-linear-gradient(45deg,#f97316_0_8px,#22c55e_8px_16px,#3b82f6_16px_24px)]">
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

function Downloads({ items, t }: { items: Download[]; t: (phrase: Phrase) => string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ label, file }) => (
        <a
          key={file}
          href={`${base}${file}`}
          download
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <DownloadIcon data-icon="inline-start" />
          {isFormat(label) ? label : t(label)}
        </a>
      ))}
    </div>
  );
}

function Section({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <section className="grid gap-6">
      <div className="grid max-w-2xl gap-2">
        <h2 className="font-bold text-2xl tracking-tight">{title}</h2>
        {lead && <p className="text-fd-muted-foreground">{lead}</p>}
      </div>
      {children}
    </section>
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
      <main className="mx-auto grid w-full max-w-5xl gap-20 px-4 pt-14 pb-24">
        <header className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div className="grid gap-4">
            <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
              {t("YEE 式機器龍品牌素材")}
            </h1>
            <p className="max-w-xl text-fd-muted-foreground text-lg">
              {t("頭像、字標和角色圖都能直接下載。使用前看一下配色和規範，機器龍在每個地方才會長得一樣。")}
            </p>
            <div>
              <a href={`${base}yeecord-brand-kit.zip`} download className={buttonVariants({ size: "lg" })}>
                <DownloadIcon data-icon="inline-start" />
                {t("下載全部素材")}
              </a>
            </div>
          </div>
          <img
            src={`${base}avatar.svg`}
            alt={t("YEE 式機器龍的頭像")}
            width={224}
            height={224}
            className="size-56 rounded-full max-md:hidden"
          />
        </header>

        <Section title={t("標誌")} lead={t("依照要放的位置，挑一個版本。")}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {logos.map(({ title, body, art, downloads }) => (
              <article key={title} className="grid grid-rows-[10rem_auto] gap-4 rounded-2xl border bg-fd-card p-5">
                <div className="flex items-center justify-center rounded-xl bg-fd-muted/40 p-4">{art}</div>
                <div className="grid content-start gap-3">
                  <h3 className="font-semibold">{t(title)}</h3>
                  <p className="text-fd-muted-foreground text-sm">{t(body)}</p>
                  <Downloads items={downloads} t={t} />
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section
          title={t("縮小後的樣子")}
          lead={t("頭像在 Discord 裡常常只有 16 到 40 px，深色和淺色主題都要看得出來。")}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["bg-[#313338]", "text-[#dbdee1]"],
              ["bg-white", "text-[#313338]"],
            ].map(([bg, text]) => (
              <div key={bg} className={cn("flex items-end gap-5 rounded-2xl border p-6", bg, text)}>
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

        <Section
          title={t("各環境的版本")}
          lead={t(
            "每個環境的頭飾和背景色都不一樣。正式環境戴皇冠，測試環境戴三角錐，開發環境頭上坐一隻小黃鴨。縮到 16 px 時主要靠背景色辨認，同一個伺服器裡有好幾隻機器龍也不會認錯。",
          )}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {environments.map(({ name, id, app, body, suffix }) => (
              <article key={id} className="grid gap-4 rounded-2xl border bg-fd-card p-5">
                <div className="flex items-center gap-4">
                  <Avatar src={`avatar${suffix}.svg`} />
                  <div>
                    <h3 className="font-semibold">{t(name)}</h3>
                    <p className="font-mono text-fd-muted-foreground text-sm">{id}</p>
                  </div>
                </div>
                <p className="text-fd-muted-foreground text-sm">{t(body)}</p>
                <div className="flex items-center gap-2 rounded-lg bg-[#35363a] px-3 py-2 text-[#e8eaed] text-xs">
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

        <Section title={t("顏色")}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {colors.map(({ name, hex, use }) => (
              <div key={hex} className="grid gap-3 rounded-2xl border bg-fd-card p-4">
                <span className="h-16 rounded-xl" style={{ backgroundColor: hex }} />
                <div className="grid gap-0.5">
                  <span className="font-semibold">{t(name)}</span>
                  <code className="text-sm">{hex}</code>
                  <span className="text-fd-muted-foreground text-sm">{t(use)}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title={t("使用規範")}>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="grid content-start gap-4 rounded-2xl border bg-fd-card p-5">
              <div className="flex min-h-36 items-center justify-center rounded-xl bg-fd-muted/40 p-4">
                <span className="rounded-lg border-2 border-fd-primary border-dashed p-6">
                  <Lockup className="h-12" />
                </span>
              </div>
              <h3 className="font-semibold">{t("留白")}</h3>
              <p className="text-fd-muted-foreground text-sm">
                {t("字標組合四周至少留出頭像一半寬的空白，不要讓文字或其他標誌貼上來。")}
              </p>
            </article>
            <article className="grid content-start gap-4 rounded-2xl border bg-fd-card p-5">
              <div className="flex min-h-36 items-center justify-center gap-6 rounded-xl bg-fd-muted/40 p-4">
                <img src={`${base}favicon.svg`} alt="" width={16} height={16} className="size-4" />
                <Lockup className="h-6" />
              </div>
              <h3 className="font-semibold">{t("最小尺寸")}</h3>
              <p className="text-fd-muted-foreground text-sm">
                {t("頭像最小 16 px，字標組合最矮 24 px。再小就改用網站圖示。")}
              </p>
            </article>
          </div>
          <h3 className="font-semibold text-lg">{t("請不要這樣做")}</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {misuses.map(({ label, art }) => (
              <figure key={label} className="grid justify-items-center gap-3 rounded-2xl border bg-fd-card p-4">
                <div className="flex h-24 items-center justify-center">{art}</div>
                <figcaption className="text-center text-fd-muted-foreground text-sm">{t(label)}</figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section title={t("實際用起來")}>
          <div className="grid items-start gap-4 md:grid-cols-2">
            <div className="grid content-start gap-4 rounded-2xl border bg-discord-bg p-5 font-discord text-discord-text text-sm">
              {environments.map(({ id, app, greeting, suffix }) => (
                <div key={id} className="flex gap-3">
                  <img src={`${base}avatar${suffix}.svg`} alt="" width={40} height={40} className="size-10 rounded-full" />
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
            <figure className="grid gap-2">
              <img
                src={`${base}social-1200x630.png`}
                alt={t("連結分享時顯示的預覽圖")}
                width={1200}
                height={630}
                className="rounded-2xl border"
              />
              <figcaption className="text-fd-muted-foreground text-sm">
                {t("分享連結時的預覽圖，1200 × 630 px。")}
              </figcaption>
            </figure>
          </div>
        </Section>
      </main>
      <Footer categories={footer(locale)} brand={t("YEE 式機器龍")} />
    </HomeLayout>
  );
}
