import { canonicalUrl, domain, footer } from "@config";
import { DocsBody } from "fumadocs-ui/page";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { getPressContext } from "fumapress";
import type { FC, ReactNode } from "react";
import Footer from "@/components/Footer";
import { baseOptions } from "@/layout-config";
import type { PressContext } from "../press.config";

export const LegalPage: FC<{
  lang?: string;
  slugs: string[];
  page: PressContext["page"];
}> = async ({ page }) => {
  const ctx = getPressContext<PressContext>();

  let body: ReactNode;
  for (const adapter of ctx.adapters) {
    body = await adapter["core:render-body"]?.call(ctx, page);
    if (body !== undefined) break;
  }

  return (
    <HomeLayout {...baseOptions}>
      <title>{`Yeecord - ${page.data.title}`}</title>
      <link rel="canonical" href={canonicalUrl(page.url)} />
      <meta property="og:title" content={`Yeecord - ${page.data.title}`} />
      {page.data.description && (
        <meta name="description" content={page.data.description} />
      )}
      {page.data.description && (
        <meta property="og:description" content={page.data.description} />
      )}
      <meta property="og:image" content={`${domain}/opengraph-image.png`} />
      <main className="container mx-auto px-4 py-10 sm:py-16">
        <DocsBody className="mx-auto max-w-[800px]">{body}</DocsBody>
      </main>
      <Footer categories={footer} />
    </HomeLayout>
  );
};
