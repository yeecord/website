import { type NextraThemeLayoutProps, type PageOpts } from "nextra";
import BaseLayout from "nextra-theme-docs";
import { type ReactNode } from "react";
import dynamic from "next/dynamic";

const BlogLayout = dynamic(() => import("./blog").then((mod) => mod.default), {
  ssr: true,
});
const DocsLayout = dynamic(() => import("./docs").then((mod) => mod.default), {
  ssr: true,
});

export default function Layout({
  children,
  ...context
}: NextraThemeLayoutProps) {
  return (
    <BaseLayout {...context}>
      <Main page={context.pageOpts}>{children}</Main>
    </BaseLayout>
  );
}

function Main({ page, children }: { page: PageOpts; children: ReactNode }) {
  if (page.route.startsWith("/blog/tags")) return <>{children}</>;

  if (page.route.startsWith("/blog/")) {
    return <BlogLayout page={page}>{children}</BlogLayout>;
  }

  if (page.route.startsWith("/docs")) {
    return <DocsLayout page={page}>{children}</DocsLayout>;
  }

  return <>{children}</>;
}
