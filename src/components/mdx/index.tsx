import { ErrorCallout, Info, Tip, Warning } from "@/components/mdx/Admonition";
import Adsense from "@/components/mdx/Adsense";
import { LinkButton } from "@/components/mdx/LinkButton";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { FC, ImgHTMLAttributes } from "react";

export * from "./Admonition";
export * from "./Adsense";
export * from "./LinkButton";

export const mdxComponents = {
  ...defaultMdxComponents,
  Adsense,
  Error: ErrorCallout,
  Info,
  LinkButton,
  img: ImageZoom as FC<ImgHTMLAttributes<HTMLImageElement>>,
  Tip,
  Warning,
};
