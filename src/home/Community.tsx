import Link from "fumadocs-core/link";
import { type Locale, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";
import { Pixelated } from "./stall/Pixelated";

export function Community({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <div className="home-closing">
      <div className="home-yee">
        <Pixelated src="/img/logo.svg" columns={27} rows={32} />
      </div>
      <h2 className="home-heading">{t("把機器龍帶回家")}</h2>
      <p className="home-lead">
        {t("安裝免費，設定時遇到問題，到 Discord 社群問")}
      </p>
      <div className="home-actions pt-3">
        <Link
          href={`${staticPath(locale, "/install")}/`}
          className="home-btn"
          data-kind="primary"
        >
          {t("安裝機器人")}
        </Link>
        <Link
          href="https://discord.gg/yeecord"
          target="_blank"
          className="home-btn"
        >
          {t("加入 Discord 社群")}
        </Link>
      </div>
    </div>
  );
}
