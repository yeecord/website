import React from "react";
import "./features.scss";
import LinkButton from "../LinkButton";

const component = "features";
const FeatureList = [
  {
    title: "全中文化界面",
    Svg: "img/translate.png",
    description: (
      <>
        使用中文跟我溝通完全不是問題，我們提供了全中文化的界面，讓不懂英文的各位也有好用的機器人
      </>
    ),
  },
  {
    title: "完善音樂系統",
    Svg: "img/music-notes.png",
    description: (
      <>
        我們提供了音樂播放器，讓你可以和朋友一起收聽 YouTube 和 Spotify
        上的音樂，並且可以自訂播放清單，讓你的播放更自由
      </>
    ),
  },
  {
    title: "讓Discord不只是聊天平台",
    Svg: "img/shines.png",
    description: (
      <>
        透過機器人各種有趣的系統，讓你的Discord更加有趣，同時朋友也可以和你一起玩
      </>
    ),
  },
  {
    title: "Yeecord RPG",
    Svg: "img/bg/game.svg",
    description: (
      <>
        通過簡單的指令，與全球數萭位玩家同時遊玩和互動，開啟全新的大門
        <div className="mt-5">
          <LinkButton to="/docs/rpg/">學到更多</LinkButton>
        </div>
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className="row-container flex-wrap items-start">
      <img src={Svg} className={`${component}__featureSvg logo`} alt={title} />

      <div className="flex flex-col gap-3 items-start">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={component}>
      <div className="container items-stretch w-3/4">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
