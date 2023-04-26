import clsx from "clsx";
import { type ReactNode } from "react";
import { type PageOpts } from "nextra";
import { type DocsPageOpts } from "../../schema/docs";
import { ArticleJsonLd } from "next-seo";

export default function DocsLayout({
  page,
  children,
}: {
  page: PageOpts;
  children: ReactNode;
}) {
  const docs = page as DocsPageOpts;

  return (
    <>
      <DocsJsonLd page={docs} />
      <div className="absolute inset-0 -z-[1] overflow-hidden">
        <Gradient />
      </div>

      {children}
    </>
  );
}

function Gradient() {
  return (
    <div
      className={clsx(
        "absolute -top-[25rem] left-[5rem] h-[80rem] w-[50rem]",
        "[mask-image:radial-gradient(farthest-corner,white_0%,transparent_70%)]",
        "hidden -rotate-[20deg] dark:block"
      )}
    >
      <div
        className={clsx(
          "h-full w-full bg-gradient-to-b opacity-30",
          "from-cyan-400/50 via-blue-400 to-purple-800"
        )}
      />
    </div>
  );
}

function DocsJsonLd({ page }: { page: DocsPageOpts }) {
  return (
    <ArticleJsonLd
      type="Article"
      title={page.title}
      authorName={[]}
      url={page.route}
      images={[]}
      datePublished={""}
      description={page.frontMatter.description ?? ""}
      isAccessibleForFree
    />
  );
}
