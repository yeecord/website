import type { HeadTag } from "fumapress";
import { blogAuthors, canonicalUrl, domain } from "~/config";

type PostData = {
  title: string;
  description?: string;
  date: Date;
  authors: string[];
  tags?: string[];
};

/** Article metadata of a blog post: Open Graph article tags and a schema.org `BlogPosting`. */
export function blogPostHead(url: string, data: PostData): HeadTag[] {
  const canonical = canonicalUrl(url);
  const published = data.date.toISOString();
  const authors = data.authors.flatMap((author) => blogAuthors[author] ?? []);
  // https://developers.google.com/search/docs/appearance/structured-data/article
  const posting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    datePublished: published,
    image: `${canonical}.webp`,
    mainEntityOfPage: canonical,
    author: authors.map((author) => ({
      "@type": "Person",
      name: author.name,
      url: author.url,
    })),
    publisher: {
      "@type": "Organization",
      name: "Yeecord",
      logo: { "@type": "ImageObject", url: `${domain}/icon.png` },
    },
    keywords: data.tags,
  };

  return [
    { tag: "meta", attrs: { property: "og:type", content: "article" } },
    { tag: "meta", attrs: { property: "article:published_time", content: published } },
    ...(data.tags ?? []).map(
      (tag): HeadTag => ({ tag: "meta", attrs: { property: "article:tag", content: tag } }),
    ),
    {
      tag: "script",
      attrs: { type: "application/ld+json" },
      // `<` escaped so no field can close the script element.
      children: JSON.stringify(posting).replaceAll("<", "\\u003c"),
    },
  ];
}
