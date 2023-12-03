import { docs } from "@/app/source";
import type { Metadata } from "next";
import { MDXContent } from "next-docs-ui/mdx-server";
import { DocsPage } from "next-docs-ui/page";
import { findNeighbour } from "next-docs-zeta/server";
import { notFound } from "next/navigation";
import { domain } from "@config";
import { ExternalLinkIcon } from "lucide-react";

export default function Page({ params }: { params: { slug?: string[] } }) {
  const page = docs.getPage(params.slug);

  if (!page) notFound();

  const neighbours = findNeighbour(docs.tree, docs.getPageUrl(page.slugs));
  // const headers = new Headers();

  // const time = await getGitLastEditTime(
  //   "yeecord/website",
  //   resolve("", page.file.path),
  //   undefined,
  //   {
  //     headers,
  //   },
  // );

  const Content = page.data.default;

  return (
    <DocsPage
      toc={page.data.toc}
      footer={neighbours}
      lastUpdate={null}
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
      <MDXContent>
        <h1>{page.matter.title}</h1>
        <Content />
      </MDXContent>
    </DocsPage>
  );
}

export function generateStaticParams(): { slug: string[] }[] {
  return docs.pages.map((page) => ({
    slug: page.slugs,
  }));
}

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = docs.getPage(params.slug);

  if (page == null) notFound();

  return {
    title: page.matter.title,
    description: page.matter.description,
    alternates: {
      canonical: `${domain}/docs/` + (params.slug ?? []).join("/"),
    },
    openGraph: {
      images: {
        url: `/og${docs.getPageUrl(page.slugs)}.png`,
        width: 1200,
        height: 630,
        alt: "Banner",
      },
      title: page.matter.title,
      description: page.matter.description,
    },
  } satisfies Metadata;
}
