import { BlogPageOpts, DocsPageOpts } from "@utils/mdx";
import { BlogJsonLd, DocsJsonLd } from "@utils/seo";
import { NextraThemeLayoutProps, PageOpts } from "nextra";
import BaseLayout from "nextra-theme-docs";
import { ReactNode } from "react";
import BlogLayout from "./blog";
import DocsLayout from "./docs";

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
    if (page.route.startsWith("/blog/")) {
        const blog = page as BlogPageOpts;

        return (
            <>
                <BlogJsonLd page={blog} />
                <BlogLayout page={blog}>{children}</BlogLayout>
            </>
        );
    }

    if (page.route.startsWith("/docs")) {
        const docs = page as DocsPageOpts;

        return (
            <>
                <DocsJsonLd page={docs} />
                <DocsLayout page={docs}>{children}</DocsLayout>
            </>
        );
    }

    return <>{children}</>;
}
