import { mkdir, writeFile } from "node:fs/promises";
import { docs } from "./app/source";
import { createOgImage } from "./utils/og";
import type { StructuredData } from "fumadocs-core/mdx-plugins";

// Access and export MDX pages data to json file
// So that we can update search indexes after the build
declare global {
  // eslint-disable-next-line no-var
  var __NEXT_DOCS_INDEX_UPDATED: boolean;
}

global.__NEXT_DOCS_INDEX_UPDATED = false;

export type Index = {
  id: string;
  title: string;
  description?: string;
  url: string;
  structuredData: StructuredData;
};

export async function generate() {
  if (global.__NEXT_DOCS_INDEX_UPDATED) return;
  console.log("generate search indexes");

  for (const page of docs.getPages()) {
    const image = await createOgImage(page);
    const path = page.url;

    await mkdir(`./public/og${path.split("/").slice(0, -1).join("/")}`, {
      recursive: true,
    }).catch(() => {});

    await writeFile(`./public/og${path}.png`, Buffer.from(image));
  }

  const indexes: Index[] = docs.getPages().map((page) => ({
    id: page.url,
    title: page.data.title,
    url: page.url,
    structuredData: page.data.exports.structuredData,
  }));

  await writeFile("./public/_map_indexes.json", JSON.stringify(indexes));

  global.__NEXT_DOCS_INDEX_UPDATED = true;
}
