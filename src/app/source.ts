import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx/runtime/next";
import * as source from "../../.source";

export const blog = loader({
  source: createMDXSource(source.blog, []),
  baseUrl: "/blog",
});

export const docs = loader({
  source: source.docs.toFumadocsSource(),
  baseUrl: "/docs",
});
