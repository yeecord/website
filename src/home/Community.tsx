import Link from "fumadocs-core/link";
import { type Locale, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";

export function Community({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <div className="flex flex-col items-center gap-3 px-4 pt-36 pb-28 text-center">
      <img alt="" src="/img/logo.svg" className="mb-2 h-22" draggable={false} />
      <h2 className="home-heading">{t("把機器龍帶回家")}</h2>
      <p className="home-lead">
        {t("安裝免費，設定時遇到問題，到 Discord 社群問")}
      </p>
      <div className="flex w-full max-w-xs flex-col gap-3 pt-4 sm:w-auto sm:max-w-none sm:flex-row">
        <Link href={`${staticPath(locale, "/install")}/`} className="btn-chunky">
          {t("安裝機器人")}
        </Link>
        <Link
          href="https://discord.gg/yeecord"
          target="_blank"
          className="btn-chunky-secondary"
        >
          {t("加入 Discord 社群")}
        </Link>
      </div>
    </div>
  );
}
