import type { ReactNode } from "react";
import { DocsLayout } from "next-docs-ui/layout";
import Link from "next/link";
import { BookIcon, LayoutListIcon, Undo2Icon } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { docs } from "../source";

const itemVariants = cva(
  "inline-flex flex-row items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-primary",
  {
    variants: {
      active: {
        true: "font-medium text-primary",
        false: "",
      },
    },
  },
);

export default function RootDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={docs.tree}
      nav={{ enabled: false }}
      sidebar={{
        banner: (
          <>
            <Link
              href="/"
              className="mb-4 inline-flex flex-row gap-2 px-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Undo2Icon className="h-5 w-5" /> 返回主頁
            </Link>
            <div className="mb-4 flex flex-col lg:hidden">
              <Link
                href="/docs"
                className={cn(
                  itemVariants({
                    active: true,
                  }),
                )}
              >
                <BookIcon className="h-5 w-5" />
                使用教學
              </Link>
              <Link href="/blog" className={cn(itemVariants())}>
                <LayoutListIcon className="h-5 w-5" />
                部落格
              </Link>
            </div>
          </>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
