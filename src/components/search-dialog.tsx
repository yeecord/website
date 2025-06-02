"use client";
import {
  SearchDialog,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useDocsSearch } from "fumadocs-core/search/client";
import { create } from "@orama/orama";
import { createTokenizer } from "@orama/tokenizers/mandarin";
import { useCallback, useMemo } from "react";

export default function DefaultSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({
    type: "static",
    initOrama: useCallback(
      () =>
        create({
          schema: { _: "string" },
          components: {
            tokenizer: createTokenizer(),
          },
        }),
      [],
    ),
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      results={query.data ?? []}
      {...props}
    />
  );
}
