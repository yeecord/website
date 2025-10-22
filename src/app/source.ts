import { loader } from "fumadocs-core/source";
import * as source from "../../.source";
import { createMDXSource } from "fumadocs-mdx/runtime/next";

export const blog = loader({
  source: createMDXSource(source.blog, []),
  baseUrl: "/blog",
});

export const docs = loader({
  source: source.docs.toFumadocsSource(),
  baseUrl: "/docs",
});
