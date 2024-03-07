import type { ReactNode } from "react";
import { Layout } from "fumadocs-ui/layout";
import { layoutProps } from "@/app/layout.shared";

export default function BaseLayout({ children }: { children: ReactNode }) {
  return <Layout {...layoutProps}>{children}</Layout>;
}
