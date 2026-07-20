import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import {
  blogMetaSchema,
  blogPageSchema,
  metaSchema,
  pageSchema,
} from "fumapress/adapters/mdx/schema";
import { z } from "zod";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const blog = defineDocs({
  dir: "content/blog",
  docs: {
    schema: blogPageSchema.extend({
      tags: z.array(z.string()).default([]),
      image: z.string().optional(),
      authors: z.array(z.string()).default([]),
      date: z.date().or(z.string().transform((s) => new Date(s))),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: blogMetaSchema,
  },
});

export const legal = defineDocs({
  dir: "content/legal",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkImageOptions: {
      useImport: false,
    },
  },
});
