import React, { useEffect } from "react";
import Head from "@docusaurus/Head";
import "./Adsense.scss";

const component = "adsense";

export default function Adsense() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <div aria-label="ads" className={`${component}__container`}>
      <Head>
        <script
          async
          defer
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1801171681307308"
          crossOrigin="anonymous"
        />
      </Head>
      <span className={`${component}__text`}>
        窩只是一個普通的廣告 點進去了解一下讓我們的機器龍活得更久
      </span>
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
