import type { MdxFile } from "nextra";

export const NEXTRA_INTERNAL = Symbol.for("__nextra_internal__");

type TypedPage = MdxFile<{ title: string }> & {
  meta?: {
    title?: string;
  };
};

export function getTitle(page: TypedPage): string {
  return (page.meta?.title as string) || page.frontMatter?.title || page.name;
}
