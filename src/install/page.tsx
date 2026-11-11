import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "~/components/Footer";
import { InstallPicker } from "~/components/install/picker";
import { footer } from "~/config";
import { USER_INSTALL_URL } from "~/features";
import type { Locale } from "~/i18n";
import { translator } from "~/i18n/translate";
import { localizedLayout, LocalizedMeta } from "~/localized-page";

const USER_COMMANDS = ["/poll", "/pick", "/bullshit"];

export function InstallPage({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <HomeLayout {...localizedLayout(locale)}>
      <LocalizedMeta
        title={t("安裝 YEE 式機器龍")}
        description={t(
          "權限自己勾，勾多少拿多少。也可以裝到自己的帳號上，私訊和任何伺服器都能用。",
        )}
      />
      <main className="install">
        <h1>{t("要恐龍做什麼，勾起來")}</h1>
        <p className="install-lead">
          {t("權限自己勾，勾多少拿多少。不放心的先不給，之後隨時能補。")}
        </p>
        <InstallPicker locale={locale} />
        <section className="install-user">
          <h2>{t("跟著你走，不用進伺服器")}</h2>
          <p>
            {t(
              "裝在自己的 Discord 帳號上，私訊、群組、任何伺服器都能叫出機器龍。發起投票、查個人卡片，走到哪用到哪。",
            )}
          </p>
          <p>{t("這個模式碰不到伺服器設定，所以一個權限都不用給。")}</p>
          <p className="font-mono text-sm">{USER_COMMANDS.join("　")}</p>
          <a
            href={USER_INSTALL_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-chunky-secondary"
          >
            {t("安裝到我的帳號")}
          </a>
        </section>
      </main>
      <Footer categories={footer(locale)} brand={t("YEE 式機器龍")} />
    </HomeLayout>
  );
}
