import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s - Yeecord Blog",
    default: "Yeecord Blog",
    absolute: "Yeecord Blog",
  },
  description: "YEE式機器龍各種用肝和 ❤️ 製作的部落格",
  openGraph: {
    images: "/opengraph-image.png",
    title: {
      template: "%s - Yeecord Blog",
      absolute: "Yeecord Blog",
      default: "Yeecord Blog",
    },
    description: "YEE式機器龍各種用肝和 ❤️ 製作的部落格",
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <div className="container">{children}</div>;
}
