"use client";
import type { SharedProps } from "fumadocs-ui/components/dialog/search";
import DefaultSearchDialog from "fumadocs-ui/components/dialog/search-default";

export default function SearchDialog(props: SharedProps) {
  return (
    <DefaultSearchDialog api="https://search.yeecord.com/search" {...props} />
  );
}
