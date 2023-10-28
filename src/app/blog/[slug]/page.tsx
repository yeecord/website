import { blog } from "@/app/source";
import { blogAuthors, domain } from "@config";
import type { Metadata } from "next";
import { MDXContent } from "next-docs-ui/mdx";
import { notFound } from "next/navigation";

export default function BlogPage({ params }: { params: { slug: string } }) {
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const Content = page.data.default;

  return (
    <MDXContent>
      <Content />
    </MDXContent>
  );
}

export function generateStaticParams() {
  return blog.pages.map((blog) => ({
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
    title: page.matter.title,
    description: page.matter.description,
    alternates: {
      canonical: `${domain}/blog/${params.slug}`,
    },
    openGraph: {
      type: "article",
      tags: page.matter.tags,
      authors: page.matter.authors.map((author) => blogAuthors[author].name),
      title: page.matter.title,
      description: page.matter.description,
      images: page.matter.image ?? "/opengraph-image.png",
    },
  };
}
