import type { MDXComponents } from "mdx/types";
import defaultComponents from "fumadocs-ui/mdx";
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
    Tip,
    Warning,
    ...components,
  };
}
