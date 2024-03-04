import { blog } from "@/app/source";
import { blogAuthors, domain } from "@config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsBody } from "fumadocs-ui/page";

export default function BlogPage({ params }: { params: { slug: string } }) {
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const Content = page.data.exports.default;

  return (
    <DocsBody>
      <Content />
    </DocsBody>
  );
}

export function generateStaticParams() {
  return blog.getPages().map((blog) => ({
    slug: blog.slugs[0],
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
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
  };
}
