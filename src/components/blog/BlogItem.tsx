import { blogAuthors } from "@config";
import Link from "fumadocs-core/link";
import type { PressContext } from "../../../press.config";
import { cn } from "@/utils/cn";

export type BlogPost = Extract<PressContext["page"], { type: "blog" }>;

export function BlogItem({ page }: { page: BlogPost }) {
  return (
    <Link
      href={page.url}
      className="flex flex-col overflow-hidden rounded-lg bg-card text-card-foreground shadow-lg transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <div className="relative aspect-video h-auto w-full">
        {page.data.image != null ? (
          <img
            alt="image"
            src={page.data.image}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-1 flex-col bg-green-400">
            <img
              alt="logo"
              src="/img/logo-transparent.png"
              className="m-auto h-20 w-20 rounded-full"
              width={128}
              height={128}
            />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 rounded-b-lg border-x border-b p-4">
        <p className="font-semibold">{page.data.title}</p>
        <p className="truncate text-muted-foreground text-sm">
          {page.data.description}
        </p>

        <div className="mt-auto flex flex-row items-end pt-2">
          {page.data.authors
            .flatMap((author) => {
              const info = blogAuthors[author];
              return info?.image_url ? [info] : [];
            })
            .map((info, i) => (
              <img
                key={info.name}
                src={info.image_url}
                alt={info.name}
                width={30}
                height={30}
                className={cn(
                  "rounded-full border-4 border-background",
                  i !== 0 && "-ml-4",
                )}
              />
            ))}
          <p className="ml-auto text-muted-foreground text-xs">
            {page.data.date.toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
