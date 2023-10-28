import {
  resolveFiles,
  createPageUtils,
  getPageTreeBuilder,
  defaultValidators,
} from "next-docs-mdx/map";
import { map } from "@/_map";
import { z } from "zod";

const frontmatterSchema = defaultValidators.frontmatter.extend({
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  authors: z.array(z.string()).default([]),
  date: z.string().default(new Date().toISOString()),
});

const resolved = resolveFiles({
  map,
  root: "./content",
  validate: {
    frontmatter: frontmatterSchema,
  },
});

const pageUtils = createPageUtils(resolved, "", []);
const getUrl = pageUtils.getPageUrl;
pageUtils.getPageUrl = (s, locale) => "/" + getUrl(s, locale);

const builder = getPageTreeBuilder(resolved, {
  getUrl: pageUtils.getPageUrl,
});

export const docsTree = builder.build({ root: "docs" });
export const { getPage, getPageUrl } = pageUtils;
export const allDocs = resolved.pages.filter(
  (page) => page.slugs[0] === "docs",
);
export const allBlog = resolved.pages.filter(
  (page) => page.slugs[0] === "blog",
);

declare module "next-docs-mdx/types" {
  interface Frontmatter extends z.infer<typeof frontmatterSchema> {}
}
