import { DocsPageOpts } from "@utils/mdx";
import { ReactNode } from "react";

export default function DocsLayout({
    children,
}: {
    page: DocsPageOpts;
    children: ReactNode;
}) {
    return <>{children}</>;
}
