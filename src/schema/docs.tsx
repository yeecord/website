import { type PageOpts, type FrontMatter } from "nextra";

export type DocsPageOpts = PageOpts<DocsFrontMatter>;

export type DocsFrontMatter = FrontMatter & {
  title: string;
  description?: string;
};
