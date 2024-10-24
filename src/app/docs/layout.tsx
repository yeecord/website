import { layoutProps } from "@/app/layout.shared";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { docs } from "../source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...layoutProps}
      sidebar={{ defaultOpenLevel: 1 }}
      tree={docs.pageTree}
    >
      {children}
    </DocsLayout>
  );
}
