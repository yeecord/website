import { blog } from "@/app/source";
import { mdxComponents } from "@/components/mdx";
import { domain, blogAuthors } from "@config";
import { DocsBody } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function BlogPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const page = blog.getPage([(await params).slug]);

  if (!page) notFound();
  const Content = page.data.body;

  return (
    <DocsBody>
      <Content components={mdxComponents} />
    </DocsBody>
  );
}

export function generateStaticParams() {
  return blog.generateParams().map((blog) => ({
    slug: blog.slug[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: `${domain}/blog/${params.slug}`,
    },
    openGraph: {
      type: "article",
      tags: page.data.tags,
      authors: page.data.authors.map((author) => blogAuthors[author].name),
      title: page.data.title,
      description: page.data.description,
      images: page.data.image ?? "/opengraph-image.png",
    },
  } satisfies Metadata;
}
