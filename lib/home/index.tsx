import { Community } from "./Community";
import { Customers } from "./Customers";
import { Hero } from "./Hero";
import { RpgSystem } from "./RpgSystem";
import clsx from "clsx";
import { Features } from "./features";
import Sponsor from "./Sponsor";
import { fetchGuild } from "@utils/api";
import { GetStaticProps } from "next";
import { useSSG } from "nextra/data";

export type HomeProps = {
    serverMembers: number;
    guildCount: number;
};

export const getStaticProps: GetStaticProps<{ ssg: HomeProps }> = async () => {
    const { guildCount, serverMembers } = await fetchGuild().catch(() => ({
        guildCount: 0,
        serverMembers: 0,
    }));

    return {
        props: {
            ssg: {
                serverMembers,
                guildCount,
            },
        },
        revalidate: 10,
    };
};

export default function HomePage() {
    const { guildCount, serverMembers } = useSSG() as HomeProps;

    return (
        <div
            id="home-page"
            className={clsx("bg-white dark:bg-black overflow-x-clip")}
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
                <Customers usedBy={guildCount} />
            </div>
            <Sponsor />
            <Community joined={serverMembers} />
        </div>
    );
}
