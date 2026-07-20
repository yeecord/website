"use client";

import { useEffect, useState } from "react";

const SCRIPT_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1801171681307308";

let scriptFailed = false;
const listeners = new Set<(failed: boolean) => void>();

function loadScript() {
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.onerror = () => {
    scriptFailed = true;
    for (const listener of listeners) listener(true);
  };
  document.head.appendChild(script);
}

export function useAdsScript() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(scriptFailed);
    listeners.add(setFailed);
    loadScript();

    return () => {
      listeners.delete(setFailed);
    };
  }, []);

  return { failed };
}
