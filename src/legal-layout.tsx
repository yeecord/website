import { footer } from "~/config";
import { DocsBody } from "fumadocs-ui/page";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import Footer from "~/components/Footer";
import type { Locale } from "~/i18n";
import { baseOptions } from "~/layout-config";

export function LegalPage({
  locale,
  body,
}: {
  locale: Locale;
  body: ReactNode;
}) {
  return (
    <HomeLayout {...baseOptions(locale)}>
      <main className="container mx-auto px-4 py-10 sm:py-16">
        <DocsBody className="mx-auto max-w-[800px]">{body}</DocsBody>
      </main>
      <Footer categories={footer(locale)} />
    </HomeLayout>
  );
}
