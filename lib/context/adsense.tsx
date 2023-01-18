import { createContext, useContext, useEffect, useState } from "react";

export const adsenseContext = createContext({
	state: "checking",
	setState(_value: string) {}
})

export function AdsenseContextProvider({ children }: { children: any }) {
	const [state, setState] = useState("checking")

	useEffect(() => {
		(async () => {
			try {
				await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1801171681307308")
			} catch(e) {
				return setState("failed")
			}

			setState("ok")
		})()
	})

	return (
		<adsenseContext.Provider value={{
			state, setState
		}}>
			{children}
		</adsenseContext.Provider>
	)
}

export function useAdsenseState() {
	return useContext(adsenseContext)
}