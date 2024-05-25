import { docs } from "@/app/source";
import type { Metadata } from "next";
import { DocsBody, DocsPage } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { domain } from "@config";
import { ExternalLinkIcon } from "lucide-react";

export default function Page({ params }: { params: { slug?: string[] } }) {
  const page = docs.getPage(params.slug);

  if (!page) notFound();

  const Content = page.data.exports.default;

  return (
    <DocsPage
      toc={page.data.exports.toc}
      tableOfContent={{
        footer: (
          <a
            href={`https://github.com/yeecord/website/tree/master/${page.file.path}`}
            rel="noreferrer noopener"
            target="_blank"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-accent-foreground"
          >
            在 Github 上編輯此頁面 <ExternalLinkIcon className="ml-2 h-3 w-3" />
          </a>
        ),
      }}
    >
      <DocsBody>
        <h1>{page.data.title}</h1>
        <Content />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams(): { slug: string[] }[] {
  return docs.getPages().map((page) => ({
    slug: page.slugs,
  }));
}

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = docs.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: `${domain}/docs/` + (params.slug ?? []).join("/"),
    },
    openGraph: {
      images: {
        url: `/og${page.url}.png`,
        width: 1200,
        height: 630,
        alt: "Banner",
      },
      title: page.data.title,
      description: page.data.description,
    },
  } satisfies Metadata;
}
