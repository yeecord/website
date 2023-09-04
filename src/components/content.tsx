"use client";

import { useMDXComponent } from "next-contentlayer/hooks";
import defaultComponents from "next-docs-ui/mdx";
import * as C from "@/components/mdx";
import { ImageZoom } from "next-docs-ui/components/image-zoom";

const components = {
  ...defaultComponents,
  ...C,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  img: (props: any) => <ImageZoom {...props} className="rounded-lg" />,
};

export function Content({ code }: { code: string }) {
  const MDX = useMDXComponent(code);

  return <MDX components={components} />;
}
