import { create } from "zustand";

interface AdsenseState {
    enabled: boolean,
    setEnabled: (status: boolean) => void
}

export const useAdsenseStore = create<AdsenseState>()((set) => ({
    enabled: true,
    setEnabled(enabled) {
        set(() => ({
            enabled
        }))
    }
}));
