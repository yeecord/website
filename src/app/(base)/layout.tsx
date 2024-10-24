import { layoutProps } from "@/app/layout.shared";
import Footer from "@/components/Footer";
import { footer } from "@config";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...layoutProps}>
      {children}
      <Footer categories={footer} />
    </HomeLayout>
  );
}
