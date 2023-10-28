import { allBlog, getPage } from "@/app/source";
import { blogAuthors, domain } from "@config";
import type { Metadata } from "next";
import { MDXContent } from "next-docs-ui/mdx";
import { notFound } from "next/navigation";

export default function BlogPage({ params }: { params: { slug: string } }) {
  const page = getPage(["blog", params.slug]);

  if (!page) notFound();
  const Content = page.data.default;

  return (
    <MDXContent>
      <Content />
    </MDXContent>
  );
}

export function generateStaticParams() {
  return allBlog.map((blog) => ({
    slug: blog.slugs[1],
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const blog = allBlog.find((blog) => blog.slugs[1] === params.slug);
  if (!blog) notFound();

  return {
    title: blog.matter.title,
    description: blog.matter.description,
    alternates: {
      canonical: `${domain}/blog/${params.slug}`,
    },
    openGraph: {
      type: "article",
      tags: blog.matter.tags,
      authors: blog.matter.authors.map((author) => blogAuthors[author].name),
      title: blog.matter.title,
      description: blog.matter.description,
      images: blog.matter.image ?? "/opengraph-image.png",
    },
  };
}
