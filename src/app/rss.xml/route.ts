import { generateRSSFeed } from "@/utils/rss";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  return new NextResponse(generateRSSFeed());
}
