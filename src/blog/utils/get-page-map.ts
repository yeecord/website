import { NEXTRA_INTERNAL } from "@utils/mdx";
import {
  type Folder,
  type MdxFile,
  type PageMapItem,
  type PageOpts,
} from "nextra";

// copied from NextraInternalGlobal
export type NextraInternal = {
  pageMap: PageMapItem[];
  route: string;
  context: Record<
    string,
    {
      Content: React.FC;
      pageOpts: PageOpts;
      themeConfig: unknown | null;
    }
  >;
  refreshListeners: Record<string, (() => void)[]>;
  Layout: React.FC<unknown>;
};

declare global {
  // eslint-disable-next-line no-var
  var blogPagesMap: MdxFile[] | null;
}

export function getBlogPageMap(): MdxFile[] {
  if (globalThis.blogPagesMap != null) return globalThis.blogPagesMap;

  const internal = (globalThis as never)[NEXTRA_INTERNAL] as NextraInternal;

  const blog = internal.pageMap.find(
    (item) => item.kind === "Folder" && item.route === "/blog",
  );

  const files = (blog as Folder)?.children || [];

  const pageMap = files.filter(
    (item) => item.kind === "MdxPage" && !item.route.startsWith("/blog/tags"),
  ) as MdxFile[];

  return (globalThis.blogPagesMap = pageMap);
}
