"use client";

import { RootProvider } from "fumadocs-ui/provider";
import type { ComponentProps } from "react";
import SearchDialog from "@/components/search-dialog";

export function Provider(props: ComponentProps<typeof RootProvider>) {
  return (
    <RootProvider
      {...props}
      search={{
        SearchDialog,
      }}
    >
      {props.children}
    </RootProvider>
  );
}
