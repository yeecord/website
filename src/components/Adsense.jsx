import React, {useEffect} from 'react';
import Head from "@docusaurus/Head";
import styles from './Adsense.module.css';

const units = {
	default: ["7480799616", "auto"],
	multiple: ["7480799616", "autorelaxed"]
}

export default function Adsense(props) {
	useEffect(() => {
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (e) {}
	}, []);
	
	return (
		<div aria-label="ads" className={styles.container}>
			<Head>
				<script async defer
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1801171681307308"
					crossOrigin="anonymous"/>
			</Head>
				<span className={styles.text}>如果你對下面贊助商的內容有興趣可以點一下</span>
				<div style={{ minHeight: '280px' }}>
					<ins className="adsbygoogle"
						 aria-label="promote"
						 style={{ display: 'block' }}
						 data-ad-client="ca-pub-1801171681307308"
						 data-ad-slot={units[props.unit || "default"][0]}
						 data-ad-format={units[props.unit || "default"][1]}
						 data-full-width-responsive="true"/>
				</div>
		</div>
	)
}
