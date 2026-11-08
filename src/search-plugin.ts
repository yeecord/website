import { createTokenizer } from "@orama/tokenizers/mandarin";
import { createFromSource } from "fumadocs-core/search/server";
import type { LoaderConfig } from "fumadocs-core/source";
import type { AppShape, Plugin } from "fumapress";
import SearchDialog from "~/components/search-dialog";
import { localeCodes, locales } from "~/i18n";
import { searchIndexPath } from "~/search-index";

// fumapress 的 oramaSearchPlugin 沒開放 localeMap，zh-tw/cn 會被當成不支援的語言，
// 這裡自己匯出 search index 並掛上 mandarin tokenizer
export function searchPlugin<C extends AppShape>(): Plugin<C> {
  return {
    name: "search",
    providerProps() {
      return { search: { SearchDialog } };
    },
    routes({ createApi }) {
      const mandarin = {
        components: { tokenizer: createTokenizer() },
      };
      const server = createFromSource<LoaderConfig>(() => this.getLoader(), {
        // only the CJK languages need the mandarin tokenizer, Orama handles the
        // rest with its own defaults
        localeMap: Object.fromEntries(
          localeCodes
            .filter((locale) => locales[locale].cjk)
            .map((locale) => [locale, mandarin]),
        ),
        buildIndex: async (page) => {
          const [{ title, description }, structuredData] = await Promise.all([
            this.getPageData(page),
            this.getPageStructuredData(page),
          ]);

          return {
            id: page.url,
            title,
            description,
            url: page.url,
            structuredData: structuredData ?? { headings: [], contents: [] },
          };
        },
      });

      createApi({
        render: "static",
        path: searchIndexPath,
        GET: () => server.staticGET(),
      });
    },
  };
}
