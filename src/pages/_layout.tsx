import type { ReactNode } from "react";
import { RootLayout } from "@/root-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}

export function getConfig() {
  return {
    render: "static",
    autoI18n: false,
  } as const;
}
