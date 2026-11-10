import Link from "fumadocs-core/link";
import { FEATURES } from "~/features";
import { contentPath, type Locale } from "~/i18n";
import { translator } from "~/i18n/translate";

const AWNINGS = ["#ab4329", "#2e5e55", "#cc9a33"];

export function FeatureStalls({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <section className="stalls">
      <h2 className="night-heading">{t("機器龍會做的事")}</h2>
      <p className="night-lead">{t("點一攤，看怎麼設定")}</p>
      <ul>
        {FEATURES.map((feature, index) => (
          <li key={feature.id}>
            <Link
              href={contentPath(locale, `/docs/commands/${feature.docs}`)}
              style={{ color: AWNINGS[index % AWNINGS.length] }}
            >
              <i aria-hidden />
              <strong>{t(feature.title)}</strong>
              <span>{t(feature.pitch)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
