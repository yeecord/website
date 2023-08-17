import { allBlogs } from "@/.contentlayer/generated";
import { Content } from "@/app/docs/[[...slug]]/content";
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
