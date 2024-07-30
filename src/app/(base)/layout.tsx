import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/home-layout";
import { layoutProps } from "@/app/layout.shared";
import Footer from "@/components/Footer";
import { footer } from "@config";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...layoutProps}>
      {children}
      <Footer categories={footer} />
    </HomeLayout>
  );
}
