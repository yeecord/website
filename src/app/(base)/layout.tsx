import type { ReactNode } from "react";
import { Layout } from "fumadocs-ui/layout";
import { layoutProps } from "../docs-provider";

export default function BaseLayout({ children }: { children: ReactNode }) {
  return <Layout {...layoutProps}>{children}</Layout>;
}
