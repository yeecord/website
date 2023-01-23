import clsx from "clsx";
import { ReactNode } from "react";
import { PageOpts } from "nextra";
import { DocsJsonLd } from "@utils/seo";
import { DocsPageOpts } from "@schema/docs";

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
            <div className="absolute inset-0 overflow-hidden -z-[1]">
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
                "absolute w-[50rem] h-[80rem] -top-[25rem] left-[5rem]",
                "[mask-image:radial-gradient(farthest-corner,white_0%,transparent_70%)]",
                "hidden dark:block -rotate-[20deg]"
            )}
        >
            <div
                className={clsx(
                    "bg-gradient-to-b w-full h-full opacity-30",
                    "from-cyan-400/50 via-blue-400 to-purple-800"
                )}
            />
        </div>
    );
}
