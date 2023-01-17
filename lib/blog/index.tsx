import { getPagesUnderRoute } from "nextra/context";
import React from "react";
import { BlogPage } from "@utils/mdx";
import { BlogItem } from "./components/BlogItem";
//
export default function BlogIndex() {
    return (
        <div className="flex flex-col gap-5">
            <h1 className="font-bold text-center mt-16 mb-5 text-4xl md:text-5xl">
                我們的部落格
            </h1>
            {getPagesUnderRoute("/blog").map((page) => {
                if (page.kind !== "MdxPage") {
                    return <React.Fragment key={page.route} />;
                }

                return <BlogItem key={page.route} page={page as BlogPage} />;
            })}
        </div>
    );
}
