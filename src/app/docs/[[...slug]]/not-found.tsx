import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="py-8 sm:py-16">
      <h1 className="mb-4 text-2xl font-semibold">找不到頁面</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        好像不在這裡...
        <br />
        發現無效的超鏈接？向我們報告吧
      </p>
      <div className="flex flex-row gap-2">
        <Link href="/" className={cn(buttonVariants({ color: "primary" }))}>
          返回主頁
        </Link>
        <a
          href="https://github.com/yeecord/website/issues/new"
          rel="noreferrer noopener"
          className={cn(buttonVariants({ color: "secondary" }))}
        >
          報告問題
        </a>
      </div>
    </main>
  );
}
