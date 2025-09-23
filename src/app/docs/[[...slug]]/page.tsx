import { domain } from "@config";
import { getGithubLastEdit, getPageTreePeers } from "fumadocs-core/server";
import { Card, Cards } from "fumadocs-ui/components/card";
import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { useCallback } from "react";
import { docs } from "@/app/source";
import { mdxComponents } from "@/components/mdx";
import { metadataImage } from "@/utils/metadata";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const page = docs.getPage((await params).slug);
  if (!page) notFound();

  const Content = page.data.body;
  const lastEdit = await getGithubLastEdit({
    path: `content/docs/${page.path}`,
    owner: "yeecord",
    repo: "website",
    token: process.env.GITHUB_TOKEN,
  });

  const Category = useCallback(
    () => (
      <Cards>
        {getPageTreePeers(docs.pageTree, page.url).map((peer) => (
          <Card key={peer.url} title={peer.name} href={peer.url}>
            {peer.description}
          </Card>
        ))}
      </Cards>
    ),
    [page.url],
  );

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{
        style: "clerk",
      }}
      lastUpdate={lastEdit ?? undefined}
      editOnGithub={{
        sha: "master",
        owner: "yeecord",
        repo: "website",
        path: `content/docs/${page.path}`,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsBody>
        <Content
          components={{
            ...mdxComponents,
            Category,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams(): { slug: string[] }[] {
  return docs.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = docs.getPage(params.slug);

  if (!page) notFound();

  return metadataImage.withImage(params.slug ?? [], {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: `${domain}/docs/${(params.slug ?? []).join("/")}`,
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
  });
}
