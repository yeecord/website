import { docs } from "./app/source";
import { createOgImage } from "./utils/og";
import type { StructuredData } from "fumadocs-core/mdx-plugins";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

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

const CACHE_LOG_FILE = path.resolve("./.next/FUMADOCS");
const buildId = process.env.NEXT_BUILD_ID;

export function generate() {
  if (!buildId) {
    console.warn("Cannot detect bulid id");
    return;
  }

  if (
    existsSync(CACHE_LOG_FILE) &&
    readFileSync(CACHE_LOG_FILE).toString() === buildId
  )
    return;

  console.log("generate search indexes");

  writeFileSync(CACHE_LOG_FILE, buildId);

  void Promise.all(
    docs.getPages().map(async (page) => {
      const image = await createOgImage(page);
      const path = page.url;

      mkdirSync(`./public/og${path.split("/").slice(0, -1).join("/")}`, {
        recursive: true,
      });

      writeFileSync(`./public/og${path}.png`, Buffer.from(image));
    }),
  );

  const indexes: Index[] = docs.getPages().map((page) => ({
    id: page.url,
    title: page.data.title,
    url: page.url,
    structuredData: page.data.exports.structuredData,
  }));

  writeFileSync("./public/_map_indexes.json", JSON.stringify(indexes));
}
