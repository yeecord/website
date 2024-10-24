"use client";
import { useAdsContext } from "@/components/adsense";
import { Warning } from "@/components/mdx/Admonition";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";

/**
 * Google Ads :)
 */
export function Adsense() {
  const { failed } = useAdsContext();
  const addedRef = useRef(false);

  useEffect(() => {
    if (addedRef.current) return;

    try {
      const win = window as unknown as { adsbygoogle: unknown[] };
      win.adsbygoogle ??= [];
      win.adsbygoogle.push({});

      addedRef.current = true;
    } catch (e) {
      console.error(`[Adsense] ${(e as Error).message}`);
    }
  }, []);

  if (failed)
    return (
      <Warning title="太無情了擋廣告" type="warn">
        <p>關閉 AdBlocker 讓機器龍多活一天</p>
      </Warning>
    );

  return (
    <div aria-label="ads">
      <p className="my-2 text-center text-gray-400 text-sm">機器龍的精神食糧</p>
      <div
        className={clsx(
          "relative min-h-[280px] after:z-[-1] after:text-gray-500 after:content-['太無情了阿怎麼沒有顯示廣告']",
          "after:-translate-x-1/2 after:-translate-y-1/2 after:absolute after:top-1/2 after:left-1/2 after:transform after:text-sm",
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
