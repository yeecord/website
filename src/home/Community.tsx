import Link from "fumadocs-core/link";
import { type Locale, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";
import { Sky } from "./stall/Sky";

export function Community({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <div className="night closing">
      <Sky />
      <div className="closing-body">
        <div className="closing-yee">
          <i>z</i>
          <i>z</i>
          <img alt="" src="/img/logo.svg" draggable={false} />
        </div>
        <h2 className="night-title">{t("把機器龍帶回家")}</h2>
        <p>{t("安裝免費，設定時遇到問題，到 Discord 社群問")}</p>
        <nav className="street-signs">
          <Link
            href={`${staticPath(locale, "/install")}/`}
            className="street-sign"
            data-kind="primary"
          >
            {t("安裝機器人")}
          </Link>
          <Link
            href="https://discord.gg/yeecord"
            target="_blank"
            className="street-sign"
          >
            {t("加入 Discord 社群")}
          </Link>
        </nav>
      </div>
    </div>
  );
}
