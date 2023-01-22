import clsx from "clsx";
import { ReactNode } from "react";
import GradientPng from "@static/docs/gradient.png";
import Image from "next/image";
import { PageOpts } from "nextra";
import { DocsJsonLd } from "@utils/seo";
import { DocsPageOpts } from "@utils/mdx";

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
            <div className="absolute w-full top-0 left-0 -z-[1] overflow-hidden">
                <Gradient />
            </div>
            {children}
        </>
    );
}

function Gradient() {
    return (
        <Image
            src={GradientPng}
            alt=""
            className={clsx(
                "hidden dark:block",
                "w-[70rem] h-[60rem] opacity-50 object-cover",
                "-mt-[15rem] dark:-mt-[10rem] -ml-[5rem] sm:ml-0 max-w-none"
            )}
            priority
        />
    );
}
