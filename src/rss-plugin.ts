import { domain, blogAuthors } from "@config";
import type { ServerPlugin } from "fumapress";
import RSS from "rss";
import type { BlogPost } from "@/components/blog/BlogItem";
import type { PressContext } from "../press.config";

export function rssPlugin(): ServerPlugin<PressContext> {
  return {
    name: "rss",
    async createPages({ createApiIsomorphic }) {
      const source = await this.getLoader();

      const feed = new RSS({
        title: "Yeecord Blog",
        description: "Welcome to Yeecord Blog",
        site_url: domain,
        feed_url: `${domain}/rss.xml`,
        image_url: `${domain}/opengraph-image.png`,
      });

      const posts = source
        .getPages()
        .filter((page): page is BlogPost => page.type === "blog")
        .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

      for (const post of posts) {
        feed.item({
          title: post.data.title,
          description: post.data.description ?? "No Description",
          url: `${domain}${post.url}`,
          date: post.data.date,
          author: post.data.authors
            .map((author) => blogAuthors[author]?.name ?? author)
            .join(", "),
          categories: post.data.tags,
        });
      }

      const xml = feed.xml();

      createApiIsomorphic({
        render: "static",
        path: "/rss.xml",
        handler: async () =>
          new Response(xml, {
            headers: { "Content-Type": "application/xml" },
          }),
      });
    },
  };
}
