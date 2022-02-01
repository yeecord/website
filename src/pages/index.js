import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
	const {siteConfig} = useDocusaurusContext();
	return (
		<header className={clsx('hero hero--primary', styles.heroBanner)}>
			<div className={styles.hero__container}>
				<h2 className={styles.hero__title}>{siteConfig.title}</h2>
				<h1 className={styles.hero__subtitle}>
					沒有了 Rythm，你還是可以快速的建立優質的中文 <strong className={styles.discord}>Discord</strong> 伺服器。
				</h1>
				<p className={styles.hero__text}>透過簡單的 一鍵式指令 以及 中文介面 的音樂功能快速建立好和朋友玩耍的優質空間</p>
				<div className={styles.buttons}>
					<Link
						className={styles.button}
						to="/docs/intro">
						開始使用
					</Link>
				</div>
			</div>
		</header>
	);
}

export default function Home() {
	const {siteConfig} = useDocusaurusContext();
	return (
		<Layout
			title={`${siteConfig.title}`}
			description="YEE式機器龍的指令及使用教學，透過簡單的一鍵式指令以及中文介面的音樂功能快速建立好和朋友玩耍的優質空間">
			<HomepageHeader/>
			<main>
				<HomepageFeatures/>
			</main>
		</Layout>
	);
}
