"use client";

import { useMDXComponent } from "next-contentlayer/hooks";
import defaultComponents from "next-docs-ui/mdx";
import * as C from "@components/mdx";
const components = {
  ...defaultComponents,
  ...C,
};

export function Content({ code }: { code: string }) {
  const MDX = useMDXComponent(code);

  return <MDX components={components} />;
}
