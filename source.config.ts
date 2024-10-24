import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

export const { meta, docs } = defineDocs();

export const blog = defineCollections({
  type: "doc",
  schema: frontmatterSchema.extend({
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    authors: z.array(z.string()).default([]),
    date: z.date().or(
      z
        .string()
        .transform((s) => new Date(s))
        .default(new Date().toISOString()),
    ),
  }),
  dir: "content/blog",
});

export default defineConfig({
  mdxOptions: {
    remarkImageOptions: {
      useImport: false,
    },
  },
});
