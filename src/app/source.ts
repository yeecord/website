import { defaultValidators, fromMap } from "next-docs-mdx/map";
import { map } from "@/_map";
import { z } from "zod";
import type { FileInfo } from "next-docs-mdx/types";

const frontmatterSchema = defaultValidators.frontmatter.extend({
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  authors: z.array(z.string()).default([]),
  date: z
    .string()
    .transform((s) => new Date(s))
    .default(new Date().toISOString()),
});

const slugs = (file: FileInfo) =>
  file.flattenedPath
    .split("/")
    .filter((p) => !["index", ""].includes(p))
    .slice(1);

export const blog = fromMap(map, {
  baseUrl: "/blog",
  rootDir: "blog",
  slugs,
  validate: {
    frontmatter: frontmatterSchema,
  },
});

export const docs = fromMap(map, {
  rootDir: "docs",
  slugs,
  baseUrl: "/docs",
});

declare module "next-docs-mdx/types" {
  interface Frontmatter extends z.infer<typeof frontmatterSchema> {}
}
