import { Community } from "./Community";
import { Customers } from "./Customers";
import { Hero } from "./Hero";
import { RpgSystem } from "./RpgSystem";
import { Noto_Sans_TC } from "@next/font/google";
import clsx from "clsx";
import { Features } from "./features";

export type HomeProps = {
    serverMembers: number;
    usedBy: number;
};

export const noto = Noto_Sans_TC({
    weight: ["500", "700"],
    variable: "--font-noto",
    display: "swap",
    subsets: ["latin"],
});

export function HomePage(props: HomeProps) {
    return (
        <div
            id="home-page"
            className={clsx(
                "bg-white dark:bg-black font-sans overflow-x-clip",
                noto.variable
            )}
        >
            <style jsx global>
                {`
                    .nx-overflow-x-hidden {
                        overflow: clip !important;
                    }
                `}
            </style>
            <div className="flex flex-col px-3 md:px-6 max-w-[1400px] mx-auto">
                <Hero />
                <Features />
                <RpgSystem />
                <Customers usedBy={props.usedBy} />
            </div>
            <Community joined={props.serverMembers} />
        </div>
    );
}
