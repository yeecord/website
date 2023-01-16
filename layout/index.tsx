import { BlogPageOpts, DocsPageOpts } from "@utils/mdx";
import { BlogJsonLd, DocsJsonLd } from "@utils/seo";
import { NextraThemeLayoutProps, PageOpts } from "nextra";
import BaseLayout from "nextra-theme-docs";
import { createContext, ReactNode, useContext } from "react";
import BlogLayout from "./blog";
import DocsLayout from "./docs";

const PageContext = createContext<PageOpts | null>(null);
export default function Layout({
    children,
    ...context
}: NextraThemeLayoutProps) {
    return (
        <PageContext.Provider value={context.pageOpts}>
            <BaseLayout {...context}>
                <Main>{children}</Main>
            </BaseLayout>
        </PageContext.Provider>
    );
}

export function usePageContext() {
    const context = useContext(PageContext);

    if (context == null)
        throw new Error("Can't get page context outside of the provider");
    return context;
}

function Main({ children }: { children: ReactNode }) {
    const page = usePageContext();

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
