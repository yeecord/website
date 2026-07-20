"use client";

import { useEffect, useState } from "react";

const SCRIPT_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1801171681307308";

export function useAdsScript() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onerror = () => setFailed(true);
    document.head.appendChild(script);
  }, []);

  return { failed };
}
