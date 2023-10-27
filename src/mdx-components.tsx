import type { MDXComponents } from "mdx/types";
import defaultComponents from "next-docs-ui/mdx-server";
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
    Adsense: (() => <Adsense />) as typeof Adsense,
    Error,
    Info,
    LinkButton,
    Tip,
    Warning,
    ...components,
  };
}
