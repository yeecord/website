import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layout";
import { docs } from "../source";
import { layoutProps } from "../docs-provider";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout {...layoutProps} tree={docs.pageTree}>
      {children}
    </DocsLayout>
  );
}
