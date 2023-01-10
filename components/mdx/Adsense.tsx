import Script from "next/script";
import React from "react";

/**
 * Google Ads :)
 */
export function Adsense() {
  return (
    <div aria-label="ads">
      <Script
        async
        defer
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1801171681307308"
        crossOrigin="anonymous"
      />
      <div style={{ minHeight: "280px" }}>
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
