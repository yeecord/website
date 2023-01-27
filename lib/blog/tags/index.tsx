import { GetStaticPaths, GetStaticProps } from "next";
import { getStaticTags, getTags } from "../utils/tags";
import { getBlogPageMap } from "../utils/get-page-map";
import { PageMapItem } from "nextra";
import { BlogItem } from "../components/BlogItem";
import { LinkButton } from "@components/mdx";
import { BlogPage, BlogPageSchema } from "@schema/blog";

//Important: upper case urls are invalid
//We will convert the tag name into lower case to avoid the issue
type Props = {
  pages: BlogPage[];
  tag: string;
};
export default function TagPage({ pages, tag }: Props) {
  return (
    <div className="flex flex-col gap-5 mx-auto my-16 max-w-[1300px]">
      <div className="flex flex-col gap-5 mb-5">
        <h1 className="font-bold text-3xl md:text-4xl text-center">{`帶有「${tag}」標籤的文章`}</h1>

        <LinkButton href="/blog/tags" link={{ className: "mx-auto" }}>
          所有標籤
        </LinkButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
        {pages.map((page) => (
          <BlogItem key={page.route} page={page} />
        ))}
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  const tags = getStaticTags(getBlogPageMap());

  return {
    paths: tags.map((v) => ({ params: { tag: v } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
  const tag = params?.tag as string;
  if (tag == null) return { notFound: true };

  const flattenPages = (page: PageMapItem): BlogPage[] => {
    if (page.kind === "Meta") return [];

    if (page.kind === "Folder") {
      return page.children.flatMap(flattenPages);
    }
    const result = BlogPageSchema.safeParse(page);

    if (!result.success) {
      console.error(page.route, result.error.issues);
      return [];
    }

    if (getTags(page).includes(tag)) return [result.data];

    return [];
  };

  return {
    props: {
      tag,
      pages: getBlogPageMap().flatMap(flattenPages),
    },
  };
};
