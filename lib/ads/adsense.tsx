import { createContext, useContext } from "react";

export type AdsenseContextType = {
    status: "ok" | "error";
};
export const AdsenseContext = createContext<AdsenseContextType>({
    status: "ok",
});

export function useAdsenseState() {
    return useContext(AdsenseContext);
}
