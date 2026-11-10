import Link from "fumadocs-core/link";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "~/components/Footer";
import { footer } from "~/config";
import {
  BUILT_IN_FEATURES,
  FEATURES,
  guildInstallUrl,
  PERMISSIONS,
  permissionsFor,
  PRESETS,
  USER_INSTALL_URL,
} from "~/features";
import { type Locale, locales, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";
import { localizedLayout, LocalizedMeta } from "~/localized-page";

const USER_COMMANDS = ["/poll", "/pick", "/bullshit"];

export function InstallPage({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const separator = locales[locale].cjk ? "、" : ", ";

  return (
    <HomeLayout {...localizedLayout(locale)}>
      <LocalizedMeta
        title={t("安裝 YEE 式機器龍")}
        description={t(
          "權限自己勾，勾多少拿多少。也可以裝到自己的帳號上，私訊和任何伺服器都能用。",
        )}
      />
      <main className="install">
        <h1>{t("挑一組最像你伺服器的")}</h1>
        <p className="install-lead">
          {t(
            "每一組只跟 Discord 要它用得到的權限。裝好之後想加功能，隨時能補。",
          )}
        </p>
        <ul className="install-presets">
          {PRESETS.map((preset) => {
            const included = FEATURES.filter((feature) =>
              preset.features.includes(feature.id),
            );
            const permissions = permissionsFor(preset.features);

            return (
              <li key={preset.id}>
                <h2>{t(preset.title)}</h2>
                <p>{t(preset.story)}</p>
                <dl>
                  <dt>{t("會開的功能")}</dt>
                  <dd>
                    <ul>
                      {[...included, ...BUILT_IN_FEATURES].map((feature) => (
                        <li key={feature.id}>
                          <strong>{t(feature.title)}</strong>
                          <span>{t(feature.pitch)}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                  <dt>
                    {t("共 {count} 項權限").replace(
                      "{count}",
                      String(permissions.length),
                    )}
                  </dt>
                  <dd>
                    {permissions
                      .map((row) => t(PERMISSIONS[row.permission].label))
                      .join(separator)}
                  </dd>
                </dl>
                <div className="install-actions">
                  <a
                    href={guildInstallUrl(preset.features)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-chunky"
                  >
                    {t("用這一組安裝")}
                  </a>
                  <Link
                    href={`${staticPath(locale, "/install/custom")}/?preset=${preset.id}`}
                    className="btn-chunky-secondary"
                  >
                    {t("自己調整")}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
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
