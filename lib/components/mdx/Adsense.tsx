import Script from "next/script";
import React from "react";

/**
 * Google Ads :)
 */
export function Adsense() {
	return (
		<div aria-label="ads" className="text-center">
			<Script
				async
				defer
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1801171681307308"
				crossOrigin="anonymous"
			/>
			<p className="my-2 text-gray-300">機器龍的精神食糧</p>
			<hr className="border-gray-500"/>
			<div style={ { minHeight: "280px" } }>
				<ins
					className="adsbygoogle"
					aria-label="promote"
					style={ { display: "block" } }
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
