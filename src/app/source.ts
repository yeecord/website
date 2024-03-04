import { createMDXSource, defaultSchemas } from "fumadocs-mdx";
import { map } from "@/_map";
import { z } from "zod";
import { loader } from "fumadocs-core/source";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { generate } from "@/generate-search-indexes";

const blogFrontmatterSchema = defaultSchemas.frontmatter.extend({
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  authors: z.array(z.string()).default([]),
  date: z.date().or(
    z
      .string()
      .transform((s) => new Date(s))
      .default(new Date().toISOString()),
  ),
});

export const blog = loader({
  baseUrl: "/blog",
  rootDir: "blog",
  source: createMDXSource(map, {
    schema: {
      frontmatter: blogFrontmatterSchema,
    },
  }),
});

export const docs = loader({
  rootDir: "docs",
  source: createMDXSource(map),
  baseUrl: "/docs",
});

if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
  void generate();
}
