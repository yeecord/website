import { DocsPageOpts } from "@utils/mdx";
import clsx from "clsx";
import { ReactNode } from "react";
import GradientSvg from "@static/docs/gradient.png";
import Image from "next/image";

export default function DocsLayout({
    children,
}: {
    page: DocsPageOpts;
    children: ReactNode;
}) {
    return (
        <>
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
            src={GradientSvg}
            alt=""
            className={clsx(
                "w-[70rem] h-[60rem] opacity-[35%] dark:opacity-50 object-cover",
                "-mt-[15rem] dark:-mt-[10rem] -ml-[5rem] sm:ml-0 max-w-none"
            )}
        />
    );
}
