import { DocsPageOpts } from "@utils/mdx";
import clsx from "clsx";
import { ReactNode } from "react";

export default function DocsLayout({
    children,
}: {
    page: DocsPageOpts;
    children: ReactNode;
}) {
    return (
        <>
            <div
                className={clsx(
                    "absolute -top-[10rem] left-0 opacity-50 -z-[1]",
                    "overflow-hidden",
                    "max-w-full max-h-full"
                )}
            >
                <Gradient />
            </div>
            {children}
        </>
    );
}

function Gradient() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 800 800"
            opacity={0.8}
            className="w-[70rem] h-[60rem] opacity-50 dark:opacity-100"
        >
            <defs>
                <filter
                    id="bbblurry-filter"
                    x="-100%"
                    y="-100%"
                    width="400%"
                    height="400%"
                    filterUnits="objectBoundingBox"
                    primitiveUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feGaussianBlur
                        stdDeviation="106"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        in="SourceGraphic"
                        edgeMode="none"
                        result="blur"
                    ></feGaussianBlur>
                </filter>
            </defs>
            <g filter="url(#bbblurry-filter)">
                <ellipse
                    rx="128"
                    ry="120.5"
                    cx="340.5305430925646"
                    cy="256.3614853107893"
                    fill="hsla(202, 72%, 59%, 1)"
                ></ellipse>
                <ellipse
                    rx="108.5"
                    ry="110.5"
                    cx="439.0812072753906"
                    cy="505.02923583984375"
                    fill="hsla(230, 73%, 56%, 1.00)"
                ></ellipse>
            </g>
        </svg>
    );
}
