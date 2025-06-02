"use client";
import { RootProvider } from "fumadocs-ui/provider";
import type { ComponentProps } from "react";
import dynamic from "next/dynamic";
import DefaultSearchDialog from "@/components/search-dialog";

export function Provider(props: ComponentProps<typeof RootProvider>) {
  return (
    <RootProvider
      {...props}
      search={{
        SearchDialog: DefaultSearchDialog,
      }}
    >
      {props.children}
    </RootProvider>
  );
}
