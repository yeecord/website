import { BlogPageOpts, DocsPageOpts } from "@utils/mdx";
import { BlogJsonLd, DocsJsonLd } from "@utils/seo";
import { NextraThemeLayoutProps, PageOpts } from "nextra";
import DocsLayout from "nextra-theme-docs";
import { createContext, ReactNode, useContext } from "react";
import BlogLayout from "./blog";

const PageContext = createContext<PageOpts | null>(null);
export default function Layout({
    children,
    ...context
}: NextraThemeLayoutProps) {
    return (
        <PageContext.Provider value={context.pageOpts}>
            <DocsLayout {...context}>
                <Main>{children}</Main>
            </DocsLayout>
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
                {children}
            </>
        );
    }

    return <>{children}</>;
}
