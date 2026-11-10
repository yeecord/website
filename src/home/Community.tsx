import Link from "fumadocs-core/link";
import { type Locale, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";

export function Community({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <div className="closing">
      <img alt="" src="/img/logo.svg" draggable={false} />
      <h2 className="night-heading">{t("把機器龍帶回家")}</h2>
      <p className="night-lead">
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
