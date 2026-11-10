import Link from "fumadocs-core/link";
import { FEATURES } from "~/features";
import { contentPath, type Locale } from "~/i18n";
import { translator } from "~/i18n/translate";
import { FEATURE_BITMAPS } from "./icons";
import { Bitmap } from "./stall/pixels";

export function Features({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <section className="home-section home-menu">
      <h2 className="home-heading">{t("機器龍會做的事")}</h2>
      <p className="home-lead">{t("點一項，看怎麼設定")}</p>
      <ul>
        {FEATURES.map((feature) => (
          <li key={feature.id}>
            <Link href={contentPath(locale, `/docs/commands/${feature.docs}`)}>
              <i>
                <Bitmap rows={FEATURE_BITMAPS[feature.id] ?? []} />
              </i>
              <span>
                <strong>{t(feature.title)}</strong>
                <span>{t(feature.pitch)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
