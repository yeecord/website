import { createTokenizer } from "@orama/tokenizers/mandarin";
import type { ServerPlugin } from "fumapress";
import type { PressContext } from "../press.config";

// fumapress 的 oramaSearchPlugin 沒開放 localeMap，zh-tw/cn 會被 Orama 當成不支援的語言，
// 這裡自己註冊 search API 並掛上 mandarin tokenizer
export function searchPlugin(): ServerPlugin<PressContext> {
  return {
    name: "core:orama-search",
    init() {
      (this.data["core:provider"] ??= []).push((props) => {
        props.search ??= { enabled: true };

        return props;
      });
    },
    async createPages({ createApiIsomorphic }) {
      const { createFromSource } = await import("fumadocs-core/search/server");

      const mandarin = {
        components: { tokenizer: createTokenizer() },
      };
      const server = createFromSource(() => this.getLoader(), {
        localeMap: {
          "zh-tw": mandarin,
          "zh-cn": mandarin,
        },
        buildIndex: async (page) => {
          for (const adapter of this.adapters) {
            const structuredData = await adapter[
              "core:get-structured-data"
            ]?.call(this, page);

            if (structuredData !== undefined)
              return {
                id: page.url,
                title: page.data.title ?? page.path,
                description: page.data.description,
                url: page.url,
                structuredData,
              };
          }

          throw new Error(`No structured data for ${page.url}`);
        },
      });

      createApiIsomorphic({
        render: "static",
        path: "/api/search",
        handler: server.staticGET,
      });
    },
  };
}
