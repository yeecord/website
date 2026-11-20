import { ArrowLeft, Languages } from "lucide-react";
import { LanguageSelect } from "fumadocs-ui/layouts/shared/slots/language-select";
import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch";
import { LoginPanel, LoginPreview } from "~/components/dashboard/login";
import { contentPath, type Locale, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";
import { LocalizedMeta } from "~/localized-page";

export function LoginPage({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const link =
    "rounded-md text-fd-muted-foreground transition-colors duration-150 hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring";

  return (
    <main className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <LocalizedMeta
        title={t("伺服器設定")}
        description={t("登入後可以看每個伺服器開了哪些功能、哪些出了問題。")}
      />
      <meta name="robots" content="noindex" />
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between gap-4">
          <a href={staticPath(locale)} className={`flex items-center gap-2.5 ${link}`}>
            <img src="/img/logo.svg" alt="" width={21} height={28} />
            <span className="font-semibold text-fd-foreground text-lg">Yeecord</span>
          </a>
          <div className="flex items-center gap-2">
            <LanguageSelect variant="ghost" aria-label={t("語言")}>
              <Languages className="size-4.5" />
            </LanguageSelect>
            <ThemeSwitch />
          </div>
        </div>
        <div className="flex flex-1 items-center py-16">
          <div className="mx-auto w-full max-w-md">
            <LoginPanel locale={locale} />
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <a href={staticPath(locale)} className={`inline-flex items-center gap-1.5 ${link}`}>
            <ArrowLeft className="size-4" aria-hidden />
            {t("回到官網")}
          </a>
          <a href={contentPath(locale, "/privacy/")} className={link}>
            {t("隱私權聲明")}
          </a>
          <a href={contentPath(locale, "/terms/")} className={link}>
            {t("使用條款")}
          </a>
        </nav>
      </div>
      <div
        aria-hidden
        inert
        className="relative overflow-hidden bg-sidebar max-lg:hidden"
      >
        <div className="absolute top-[12%] bottom-0 left-[10%] flex select-none">
          <LoginPreview locale={locale} />
        </div>
      </div>
    </main>
  );
}
