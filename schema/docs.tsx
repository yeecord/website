import { PageOpts, FrontMatter } from "nextra";

export type DocsPageOpts = Omit<PageOpts, "frontMatter"> & {
    frontMatter: DocsFrontMatter;
};

export type DocsFrontMatter = FrontMatter & {
    title: string;
    description?: string;
};
