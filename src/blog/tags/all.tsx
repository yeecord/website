import { LinkButton } from "@components/mdx";
import clsx from "clsx";
import { type GetStaticProps } from "next";
import Link from "next/link";
import { BsEyeFill } from "react-icons/bs";
import { getStaticTagsMap, getTagHref, type TagInfo } from "../utils/tags";
import { getBlogPageMap } from "../utils/get-page-map";

type Props = {
  //sorted tags
  tags: [string, TagInfo][];
};

export const getStaticProps: GetStaticProps<Props> = () => {
  const data = getStaticTagsMap(getBlogPageMap());
  const tags = [...data.entries()].sort((a, b) => b[1].count - a[1].count);

  return {
    props: {
      tags,
    },
  };
};

export default function AllTags({ tags }: Props) {
  return (
    <div className="my-16 mx-auto flex max-w-[1500px] flex-col gap-3 p-6">
      <div className="mb-3 flex flex-col gap-3">
        <h1 className="text-center text-5xl font-bold md:text-6xl">所有標籤</h1>
        <LinkButton
          href="/blog"
          link={{ className: "mx-auto" }}
          variant="primary"
          icon={<BsEyeFill />}
        >
          查看文章
        </LinkButton>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {tags.map(([tag, info]) => (
          <Link
            key={tag}
            href={getTagHref(tag)}
            className={clsx(
              "h-stack justify-between rounded-lg p-3",
              "bg-zinc-100 dark:bg-zinc-800",
            )}
          >
            <span className="text-lg font-bold">{tag}</span>
            <span className="text-secondary-light dark:text-secondary-dark">
              {info.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
