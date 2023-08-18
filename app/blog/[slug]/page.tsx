import { allBlogs } from "@/.contentlayer/generated";
import { Content } from "@components/content";
import { blogAuthors } from "@/config";
import type { Metadata } from "next";
import { MDXContent } from "next-docs-ui/mdx";
import { notFound } from "next/navigation";

export default function BlogPage({ params }: { params: { slug: string } }) {
  const page = allBlogs.find((blog) => blog.slug === params.slug);

  if (!page) notFound();

  return (
    <MDXContent>
      <Content code={page.body.code} />
    </MDXContent>
  );
}

export function generateStaticParams() {
  return allBlogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const blog = allBlogs.find((blog) => blog.slug === params.slug);
  if (!blog) return {};

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      type: "article",
      tags: blog.tags,
      authors: blog.authors?.map((author) => blogAuthors[author].name),
      title: blog.title,
      description: blog.description,
      images: blog.image ?? "/opengraph-image.png",
    },
  };
}
