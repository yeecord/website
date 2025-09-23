import { NextResponse } from "next/server";
import { generateRSSFeed } from "@/utils/rss";

export const dynamic = "force-static";

export function GET() {
  return new NextResponse(generateRSSFeed(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
