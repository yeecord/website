import Link from "fumadocs-core/link";
import { Check, Minus } from "lucide-react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "~/components/Footer";
import { footer } from "~/config";
import { FeatureIcon } from "~/feature-icons";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  type Feature,
  FEATURES,
  guildInstallUrl,
  permissionsFor,
  type Preset,
  PRESETS,
  USER_INSTALL_URL,
} from "~/features";
import { type Locale, locales, staticPath } from "~/i18n";
import { translator } from "~/i18n/translate";
import { localizedLayout, LocalizedMeta } from "~/localized-page";

const USER_COMMANDS = ["/poll", "/pick", "/bullshit"];

/** 內建的功能每一組都有 */
function has(preset: Preset, feature: Feature) {
  return (
    feature.permissions.length === 0 || preset.features.includes(feature.id)
  );
}

export function InstallPage({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const separator = locales[locale].cjk ? "、" : ", ";
  const count = (permissions: number) =>
    t("共 {count} 項權限").replace("{count}", String(permissions));
  const actions = (preset: Preset) => (
    <div className="install-actions">
      <a
        href={guildInstallUrl(preset.features)}
        target="_blank"
        rel="noreferrer"
        className="btn-chunky"
      >
        {t("安裝")}
      </a>
      <Link
        href={`${staticPath(locale, "/install/custom")}/?preset=${preset.id}`}
      >
        {t("自己調整")}
      </Link>
    </div>
  );

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
        <table className="install-matrix">
          <thead>
            <tr>
              <td />
              {PRESETS.map((preset) => (
                <th key={preset.id} scope="col">
                  <FeatureIcon id={preset.id} />
                  <strong>{t(preset.title)}</strong>
                  <span>{t(preset.story)}</span>
                  {actions(preset)}
                </th>
              ))}
            </tr>
          </thead>
          {CATEGORY_ORDER.map((category) => (
            <tbody key={category}>
              <tr>
                <th colSpan={PRESETS.length + 1} scope="rowgroup">
                  {t(CATEGORIES[category])}
                </th>
              </tr>
              {FEATURES.filter((feature) => feature.category === category).map(
                (feature) => (
                  <tr key={feature.id}>
                    <th scope="row">
                      <FeatureIcon id={feature.id} />
                      {t(feature.title)}
                    </th>
                    {PRESETS.map((preset) => (
                      <td key={preset.id}>
                        {has(preset, feature) ? (
                          <Check aria-label={t("有")} />
                        ) : (
                          <Minus aria-label={t("沒有")} />
                        )}
                      </td>
                    ))}
                  </tr>
                ),
              )}
            </tbody>
          ))}
          <tfoot>
            <tr>
              <th scope="row">{t("要給的權限")}</th>
              {PRESETS.map((preset) => (
                <td key={preset.id}>
                  {count(permissionsFor(preset.features).length)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
        <ul className="install-stack">
          {PRESETS.map((preset) => (
            <li key={preset.id}>
              <h2>
                <FeatureIcon id={preset.id} />
                {t(preset.title)}
              </h2>
              <p>{t(preset.story)}</p>
              <p>
                {FEATURES.filter((feature) => has(preset, feature))
                  .map((feature) => t(feature.title))
                  .join(separator)}
              </p>
              <p>{count(permissionsFor(preset.features).length)}</p>
              {actions(preset)}
            </li>
          ))}
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
