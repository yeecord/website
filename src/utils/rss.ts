import { domain } from "@config";
import RSS from "rss";
import { blog } from "@/app/source";

export function generateRSSFeed(): string {
  const feed = new RSS({
    title: "Yeecord Blog",
    description: "Welcome to Yeecord Blog",
    site_url: domain,
    feed_url: `${domain}/rss.xml`,
    image_url: `${domain}/opengraph-image.png`,
  });
  for (const post of blog.getPages()) {
    feed.item({
      title: post.data.title,
      description: post.data.description ?? "No Description",
      url: `${domain}${post.url}`,
      date: post.data.date,
      author: post.data.authors.join(", "),
      categories: post.data.tags,
    });
  }

  return feed.xml();
}
