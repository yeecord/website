"use client";
import Script from "next/script";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

const AdsContext = createContext({
  failed: false,
});

export function useAdsContext() {
  return useContext(AdsContext);
}

export function AdsProvider({ children }: { children: ReactNode }) {
  const [failed, setFailed] = useState(false);
  const value = useMemo(() => ({ failed }), [failed]);

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1801171681307308"
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onError={() => setFailed(true)}
      />
      <AdsContext.Provider value={value}>{children}</AdsContext.Provider>
    </>
  );
}
