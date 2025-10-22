import { domain } from "@config";
import { getGithubLastEdit } from "fumadocs-core/content/github";
import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { docs } from "@/app/source";
import { mdxComponents } from "@/components/mdx";

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
        <Content components={mdxComponents} />
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

  const ogImageSlugs = ["/og", "docs", ...page.slugs, "image.png"];

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: `${domain}/docs/${(params.slug ?? []).join("/")}`,
    },
    openGraph: {
      images: {
        url: ogImageSlugs.join("/"),
        width: 1200,
        height: 630,
        alt: "Banner",
      },
      title: page.data.title,
      description: page.data.description,
    },
  };
}
