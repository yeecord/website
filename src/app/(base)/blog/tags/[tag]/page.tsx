import { blog } from "@/app/source";
import { BlogItem } from "@/components/blog/BlogItem";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { getTags } from "@/utils/tags";
import { domain } from "@config";
import type { Metadata } from "next";
import Link from "next/link";

export default function TagPage({ params }: { params: { tag: string } }) {
  const decodedTag = decodeURIComponent(params.tag);
  const pages = blog
    .getPages()
    .filter((blog) =>
      blog.data.tags.some((tag) => tag.toLowerCase() === decodedTag),
    );

  return (
    <main className="my-16 flex w-full flex-1 flex-col gap-5">
      <div className="mb-5 flex flex-col items-center gap-5 text-center">
        <h1 className="mb-4 text-3xl font-bold">{`帶有「${decodedTag}」標籤的文章`}</h1>

        <Link
          href="/blog/tags"
          className={cn(buttonVariants({ color: "primary" }))}
        >
          所有標籤
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <BlogItem key={page.url} page={page} />
        ))}
      </div>
    </main>
  );
}

export function generateStaticParams() {
  const tags = [...getTags().keys()];

  return tags.map((key) => ({
    // Next.js in dev mode will encode the component automatically
    tag:
      process.env.NODE_ENV === "production"
        ? key.toLowerCase()
        : encodeURIComponent(key.toLowerCase()),
  }));
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
