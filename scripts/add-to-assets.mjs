// Copy fumadocs_search.json to `out` folder

import { copyFile } from "node:fs/promises";

void copyFile(
  ".next/server/chunks/fumadocs_search.json",
  "out/_map_indexes.json",
);
