import { docs } from "@/app/source";
import type { AdvancedIndex } from "fumadocs-core/search/server";
import { NextResponse } from "next/server";

export const revalidate = false;

export function GET() {
  const results: AdvancedIndex[] = [];

  for (const page of docs.getPages()) {
    results.push({
      id: page.url,
      structuredData: page.data.structuredData,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
    });
  }

  return NextResponse.json(results);
}
