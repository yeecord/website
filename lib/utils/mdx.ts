import { MdxFile, Page } from "nextra";

export const NEXTRA_INTERNAL = Symbol.for("__nextra_internal__");

export function getTitle(page: Page & MdxFile): string {
    const frontMatter = page.frontMatter;

    return page.meta?.title || frontMatter?.title || page.name;
}
