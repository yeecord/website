import Link from "fumadocs-core/link";
import { FEATURES } from "~/features";
import { contentPath, type Locale } from "~/i18n";
import { translator } from "~/i18n/translate";

export function Features({ locale }: { locale: Locale }) {
  const t = translator(locale);

  return (
    <section className="menu">
      <h2 className="night-heading">{t("機器龍會做的事")}</h2>
      <p className="night-lead">{t("點一項，看怎麼設定")}</p>
      <ul>
        {FEATURES.map((feature) => (
          <li key={feature.id}>
            <Link href={contentPath(locale, `/docs/commands/${feature.docs}`)}>
              <strong>{t(feature.title)}</strong>
              <span>{t(feature.pitch)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
