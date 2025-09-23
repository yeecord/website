import { createTokenizer } from "@orama/tokenizers/mandarin";
import { createFromSource } from "fumadocs-core/search/server";
import { docs } from "@/app/source";

export const revalidate = false;
export const { staticGET: GET } = createFromSource(docs, {
  tokenizer: createTokenizer(),
});
