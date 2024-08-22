import { docs } from "@/app/source";
import type { Metadata } from "next";
import { DocsBody, DocsCategory, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { domain } from "@config";
import { getGithubLastEdit } from "fumadocs-core/server";

export default async function Page({
  params,
}: {
  params: { slug?: string[] };
}) {
  const page = docs.getPage(params.slug);

  if (!page) notFound();

  const Content = page.data.exports.default;
  const lastEdit = await getGithubLastEdit({
    path: `content/docs/${page.file.path}`,
    owner: "yeecord",
    repo: "website",
    token: process.env.GITHUB_TOKEN,
  });

  return (
    <DocsPage
      toc={page.data.exports.toc}
      tableOfContent={{
        style: "clerk",
      }}
      lastUpdate={lastEdit ?? undefined}
      editOnGithub={{
        sha: "master",
        owner: "yeecord",
        repo: "website",
        path: `content/docs/${page.file.path}`,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsBody>
        <Content
          components={{
            Category: () => (
              <DocsCategory page={page} pages={docs.getPages()} />
            ),
          }}
        />
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
