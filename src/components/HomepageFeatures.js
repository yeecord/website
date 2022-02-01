import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
	{
		title: '全中文化界面',
		Svg: 'img/translate.png',
		description: (
			<>
				使用中文跟我溝通完全不是問題，我們提供了全中文化的界面，讓不懂英文的各位也有好用的機器人
			</>
		),
	},
	{
		title: "完善音樂系統",
		Svg: 'img/music-notes.png',
		description: (
			<>
				我們提供了音樂播放器，讓你可以和朋友一起收聽 YouTube 和 Spotify 上的音樂，並且可以自訂播放清單，讓你的播放更自由
			</>
		),
	},
	{
		title: "讓Discord不只是聊天平台",
		Svg: 'img/shines.png',
		description: (
			<>
				透過機器人各種有趣的系統，讓你的Discord更加有趣，同時朋友也可以和你一起玩
			</>
		)
	}
];

function Feature({Svg, title, description}) {
	return (
		<div className={clsx('col col--4')}>
			<div className="text--center">
				<img src={Svg} className={styles.featureSvg} alt={title}/>
			</div>
			<div className="text--center padding-horiz--md">
				<h3>{title}</h3>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function HomepageFeatures() {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						<Feature key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
