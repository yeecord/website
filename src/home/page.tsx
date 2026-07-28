import { HomeLayout } from "fumadocs-ui/layouts/home";
import Footer from "~/components/Footer";
import { footer } from "~/config";
import { Community } from "~/home/Community";
import { DemoServer } from "~/home/DemoServer";
import { Hero } from "~/home/Hero";
import { Trust } from "~/home/Trust";
import type { Locale } from "~/i18n";
import { localizedLayout, LocalizedMeta } from "~/localized-page";
import { homeCopy } from "./copy";

export function HomePage({ locale }: { locale: Locale }) {
  const copy = homeCopy[locale];

  return (
    <HomeLayout {...localizedLayout(locale)}>
      <LocalizedMeta
        locale={locale}
        title={copy.meta.title}
        description={copy.meta.description}
      />
      <main className="overflow-x-clip">
        <Hero copy={copy} locale={locale} />
        <div className="mx-auto flex max-w-[1100px] flex-col px-3 md:px-6">
          <DemoServer copy={copy} />
          <Trust copy={copy} />
        </div>
        <Community copy={copy} locale={locale} />
      </main>
      <Footer categories={footer(locale)} brand={copy.hero.mascotAlt} />
    </HomeLayout>
  );
}
