import type { ReactNode } from "react";
import { Layout } from "fumadocs-ui/layout";
import { layoutProps } from "@/app/layout.shared";
import Footer from "@/components/Footer";
import { footer } from "@config";

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <Layout {...layoutProps}>
      {children}
      <Footer categories={footer} />
    </Layout>
  );
}
