"use client";
import { DocsLayout } from "next-docs-ui/layout";
import type { TreeNode } from "next-docs-zeta/server";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function DocsLayoutWrapper({
  tree,
  children,
}: {
  tree: TreeNode[];
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <DocsLayout
      tree={tree}
      githubUrl="https://github.com/yeecord"
      sidebar={
        pathname === "/docs" || pathname.startsWith("/docs/")
          ? undefined
          : false
      }
      navTitle="Yeecord"
    >
      {children}
    </DocsLayout>
  );
}
