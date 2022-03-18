import React, {useEffect} from 'react';
import Head from "@docusaurus/Head";
import styles from './Adsense.module.css';

export default function Adsense() {
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
				<ins className="adsbygoogle"
					 aria-label="promote"
					 style={{ display: 'block' }}
					 data-ad-client="ca-pub-1801171681307308"
					 data-ad-slot="7480799616"
					 data-ad-format="auto"
					 data-full-width-responsive="true"/>
		</div>
	)
}
