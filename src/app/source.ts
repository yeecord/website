import { defaultValidators, fromMap } from "next-docs-mdx/map";
import { map } from "@/_map";
import { z } from "zod";
import type { FileInfo } from "next-docs-mdx/types";
import type { StructuredData } from "next-docs-zeta/mdx-plugins";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { writeFile, mkdir } from "node:fs/promises";
import { createOgImage } from "@/utils/og";

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

// Access and export MDX pages data to json file
// So that we can update search indexes after the build
declare global {
  // eslint-disable-next-line no-var
  var __NEXT_DOCS_INDEX_UPDATED: boolean;
}

global.__NEXT_DOCS_INDEX_UPDATED = false;

export type Index = {
  id: string;
  title: string;
  description?: string;
  url: string;
  structuredData: StructuredData;
};

if (
  process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD &&
  !global.__NEXT_DOCS_INDEX_UPDATED
) {
  for (const page of docs.pages) {
    const image = await createOgImage(page);

    const path = docs.getPageUrl(page.slugs);

    await mkdir(`./public/og${path.split("/").slice(0, -1).join("/")}`, {
      recursive: true,
    }).catch(() => {});

    await writeFile(`./public/og${path}.png`, Buffer.from(image));
  }

  const indexes: Index[] = docs.pages.map((page) => ({
    id: page.file.id,
    title: page.matter.title,
    url: docs.getPageUrl(page.slugs),
    structuredData: page.data.structuredData,
  }));

  await writeFile("./public/_map_indexes.json", JSON.stringify(indexes));

  global.__NEXT_DOCS_INDEX_UPDATED = true;
}

declare module "next-docs-mdx/types" {
  interface Frontmatter extends z.infer<typeof frontmatterSchema> {}
}
