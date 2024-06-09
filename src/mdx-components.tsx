import type { MDXComponents } from "mdx/types";
import defaultComponents from "fumadocs-ui/mdx";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";

import {
  Adsense,
  Error,
  Info,
  LinkButton,
  Tip,
  Warning,
} from "@/components/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    Adsense,
    Error,
    Info,
    LinkButton,
    img: ImageZoom as (
      props: React.ImgHTMLAttributes<HTMLImageElement>,
    ) => React.ReactElement,
    Tip,
    Warning,
    ...components,
  };
}
