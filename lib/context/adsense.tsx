import { createContext, ReactNode, useContext } from "react";
import useSWRImmutable from "swr/immutable";

export type AdsenseContext = {
    state: "success" | "checking" | "failed";
};
export const adsenseContext = createContext<AdsenseContext>({
    state: "checking",
});

export function AdsenseContextProvider({ children }: { children: ReactNode }) {
    const { isLoading, error } = useSWRImmutable(
        ["check_adsense"],
        () =>
            fetch(
                "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1801171681307308"
            ),
        {
            shouldRetryOnError: false,
        }
    );

    return (
        <adsenseContext.Provider
            value={{
                state: isLoading
                    ? "checking"
                    : error != null
                    ? "failed"
                    : "success",
            }}
        >
            {children}
        </adsenseContext.Provider>
    );
}

export function useAdsenseState() {
    return useContext(adsenseContext);
}
