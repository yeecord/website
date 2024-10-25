import { readFile, writeFile } from "node:fs/promises";

const path = ".next/server/app/static.json.body";

async function main() {
  const indexes = JSON.parse((await readFile(path)).toString());

  // Copy fumadocs_search.json to `out` folder
  await writeFile("out/_map_indexes.json", JSON.stringify(indexes));
}

void main();
