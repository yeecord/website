import React, { useEffect } from "react";
import Admonition from "@components/mdx/Admonition";
import { useAdsContext } from "@ads/adsense";
import clsx from "clsx";

/**
 * Google Ads :)
 */
export function Adsense() {
    const { failed } = useAdsContext();

    useEffect(() => {
        if (failed) return;

        try {
            ((window as any).adsbygoogle =
                (window as any).adsbygoogle || []).push({});
        } catch (e) {}
    }, [failed]);

    if (failed)
        return (
            <Admonition title="太無情了擋廣告" type="warning">
                關閉 AdBlocker 讓機器龍多活一天
            </Admonition>
        );

    return (
        <div aria-label="ads">
            <p className="my-2 text-sm text-gray-400 text-center">
                機器龍的精神食糧
            </p>
            <div
                className={clsx(
                    "min-h-[280px] relative after:z-[-1] after:content-['太無情了阿怎麼沒有顯示廣告'] after:text-gray-500",
                    "after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:text-sm"
                )}
            >
                <ins
                    className="adsbygoogle"
                    aria-label="promote"
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-1801171681307308"
                    data-ad-slot="7480799616"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>
        </div>
    );
}

export default Adsense;
