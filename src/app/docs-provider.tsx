"use client";
import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider";
import dynamic from "next/dynamic";

const SearchDialog = dynamic(() => import("@/components/search-dialog"));

export function DocsProvider({ children }: { children: ReactNode }) {
  return <RootProvider search={{ SearchDialog }}>{children}</RootProvider>;
}
