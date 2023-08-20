"use client";

import { useMDXComponent } from "next-contentlayer/hooks";
import defaultComponents from "next-docs-ui/mdx";
import * as C from "@/components/mdx";
import type { ImgHTMLAttributes } from "react";

const components = {
  ...defaultComponents,
  ...C,
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <defaultComponents.img {...props} className="rounded-lg" />
  ),
};

export function Content({ code }: { code: string }) {
  const MDX = useMDXComponent(code);

  return <MDX components={components} />;
}
