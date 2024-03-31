import { createOgImage } from "./og";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
import { join, dirname } from "node:path";
import type { SearchIndex } from "fumadocs-mdx";

const path = ".next/server/chunks/fumadocs_search.json";

async function main() {
  const indexes = JSON.parse(
    (await readFile(path)).toString(),
  ) as SearchIndex[];

  // Copy fumadocs_search.json to `out` folder
  await writeFile("out/_map_indexes.json", JSON.stringify(indexes));

  // Open Graph Images
  await Promise.all(
    indexes.map(async (index) => {
      const svg = await createOgImage(index);

      const image = new Resvg(svg);
      const out = join("./out/og", `${index.url}.png`);

      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, image.render().asPng());
    }),
  );
}

void main();
