import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "Yeecord Blog - %s",
    default: "Yeecord Blog",
    absolute: "Yeecord Blog",
  },
  description: "YEE式機器龍各種用肝和 ❤️ 製作的部落格",
  openGraph: {
    images: "/opengraph-image.png",
    title: {
      template: "Yeecord Blog - %s",
      absolute: "Yeecord Blog",
      default: "Yeecord Blog",
    },
    description: "YEE式機器龍各種用肝和 ❤️ 製作的部落格",
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
