import { getPage, getPageUrl, tree } from "@/app/source";
import { allDocs } from "contentlayer/generated";
import type { Metadata } from "next";
import { MDXContent } from "next-docs-ui/mdx";
import { DocsPage } from "next-docs-ui/page";
import {
  getTableOfContents,
  findNeighbour,
  getGitLastEditTime,
} from "next-docs-zeta/server";
import { notFound } from "next/navigation";
import { Content } from "@/components/content";
import { domain } from "@config";
import { ExternalLinkIcon } from "lucide-react";

export default async function Page({
  params,
}: {
  params: { slug?: string[] };
}) {
  const page = getPage(params.slug);

  if (page == null) {
    notFound();
  }

  const toc = await getTableOfContents(page.body.raw);
  const neighbours = findNeighbour(tree, getPageUrl(params.slug));
  const headers = new Headers();

  if (process.env.GITHUB_TOKEN)
    headers.append("Authorization", `Bearer ${process.env.GITHUB_TOKEN}`);

  const time = await getGitLastEditTime(
    "yeecord/website",
    "content/" + page._raw.sourceFilePath,
    undefined,
    {
      headers,
    },
  );

  return (
    <DocsPage
      toc={toc}
      footer={neighbours}
      lastUpdate={time}
      tableOfContent={{
        footer: (
          <a
            href={`https://github.com/yeecord/website/tree/master/content/${page._raw.sourceFilePath}`}
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
        <h1>{page.title}</h1>
        <Content code={page.body.code} />
      </MDXContent>
    </DocsPage>
  );
}

export function generateStaticParams(): { slug: string[] }[] {
  return allDocs.map((page) => ({
    slug: page.slug.split("/"),
  }));
}

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = getPage(params.slug);

  if (page == null) return;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `${domain}/docs/` + (params.slug ?? []).join("/"),
    },
    openGraph: {
      images: {
        url: `/api/og/${(params.slug ?? []).join("/")}`,
        width: 1200,
        height: 630,
        alt: "Banner",
      },
      title: page.title,
      description: page.description,
    },
  } satisfies Metadata;
}
