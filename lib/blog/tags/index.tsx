import { GetStaticPaths, GetStaticProps } from "next";
import { useSSG } from "nextra/ssg";
import getTags, { getBlogPageMap, getStaticTags } from "../utils/tags";
import { MdxFile, Page, PageMapItem } from "nextra";
import { BlogPage } from "@utils/mdx";
import { BlogItem } from "../components/BlogItem";
import { LinkButton } from "@components/mdx";

//Important: upper case urls are invalid
//We will convert the tag name into lower case to avoid the issue

export default function TagPage() {
    const { tag } = useSSG();
    const pages: (Page & MdxFile)[] = [];

    const map = (page: PageMapItem) => {
        if (page.kind === "Folder") {
            return page.children.forEach(map);
        }

        if (page.kind === "Meta") return;

        if (page.frontMatter == null || !Array.isArray(page.frontMatter.tags))
            return;

        if (getTags(page).includes(tag)) return pages.push(page);
    };

    getBlogPageMap().forEach(map);
    return (
        <div className="flex flex-col gap-5 mx-auto mt-16">
            <div className="flex flex-col gap-5 mb-5">
                <h1 className="font-bold text-3xl md:text-4xl text-center">{`帶有"${tag}"標籤的文章`}</h1>

                <LinkButton href="/blog/tags" link={{ className: "mx-auto" }}>
                    所有標籤
                </LinkButton>
            </div>
            {pages.map((page) => (
                <BlogItem key={page.route} page={page as BlogPage} />
            ))}
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

export const getStaticProps: GetStaticProps = ({ params }) => {
    return {
        props: {
            ssg: {
                tag: params?.tag,
            },
        },
    };
};
