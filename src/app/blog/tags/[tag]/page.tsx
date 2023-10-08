import { BlogItem } from "@/components/blog/BlogItem";
import { LinkButton } from "@/components/LinkButton";
import { getTags } from "@/utils/tags";
import { domain } from "@config";
import { allBlogs } from "contentlayer/generated";
import type { Metadata } from "next";

export default function TagPage({ params }: { params: { tag: string } }) {
  const decodedTag = decodeURIComponent(params.tag);
  const pages = allBlogs.filter(
    (blog) =>
      blog.tags != null &&
      blog.tags.some((tag) => tag.toLowerCase() === decodedTag.toLowerCase()),
  );

  return (
    <main className="my-16 flex w-full flex-1 flex-col gap-5">
      <div className="mb-5 flex flex-col gap-5">
        <h1 className="mb-4 text-center text-3xl font-bold">{`帶有「${decodedTag}」標籤的文章`}</h1>

        <LinkButton href="/blog/tags" className="mx-auto">
          所有標籤
        </LinkButton>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <BlogItem key={page._id} page={page} />
        ))}
      </div>
    </main>
  );
}

export function generateStaticParams() {
  const tags = [...getTags().entries()];

  return tags.map(([key]) => ({ params: { tag: key.toLowerCase() } }));
}

export function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Metadata {

  const decodedTag = decodeURIComponent(params.tag);

  return {
    title: `帶有「${decodedTag}」標籤的文章`,
    alternates: {
      canonical: `${domain}/blog/tags/${params.tag}`,
    },
    openGraph: {
      images: "/opengraph-image.png",
      title: `帶有「${decodedTag}」標籤的文章`,
    },
  };
}
