import React from "react";
import Layout from "@theme/Layout";
import "./index.css";
import HomepageFeatures from "../components/HomepageFeatures";
import Commit from "../components/Commit";
import LinkButton from "../components/LinkButton";
import Contributors from "../components/Contributors";

function HomepageHeader() {
  return (
    <div className="row-wrap-container w-3/4 py-10">
      <div className="container w-min flex-1 items-start">
        <h1 className="title">
          <strong className="from-pink-400 to-blue-500 shadow">YEE</strong>
          式機器龍
        </h1>
        <p className="description">
          透過簡單的 一鍵式指令 以及 中文介面
          <br />
          的音樂功能快速建立好和朋友玩耍的優質空間
        </p>
        <LinkButton to="/docs/">開始使用</LinkButton>

        <Commit
          name="凱恩Kane"
          avatar="img/old_logo.png"
          content="沒有了Rythm，你還是可以快速的建立優質的中文 Discord 伺服器。"
        />
      </div>

      <img
        className="animated-logo flex-1"
        src="img/logo-transparent.png"
        alt="logo"
      />
    </div>
  );
}

function Intro() {
  const count = 60000;
  return (
    <div className="container server-wrapper-bg items-center">
      <h1 className="title">
        打造未來：以更快的速度建立更優質的
        <strong className="discord">Discord</strong>伺服器。
      </h1>
      <h1 className="text-center leading-relaxed">
        <strong className="title">超過</strong>
        <br />
        <strong className="title gradient">{count}多個服務器</strong>
        <br />
        使用我們的機器人
      </h1>
      <Servers />
    </div>
  );
}

function Server(props) {
  return (
    <div className="server">
      {props.partner && <Partner />}
      <img src={props.src} alt={props.name} className="icon" />
      <p>{props.name}</p>
    </div>
  );
}

function Partner() {
  return (
    <div className="partner__wrapper">
      <svg
        aria-label="Discord 合作夥伴"
        aria-hidden="false"
        width="40"
        height="40"
        className="partner__bg"
        viewBox="0 0 16 15.2"
      >
        <path
          fill="currentColor"
          d="m16 7.6c0 .79-1.28 1.38-1.52 2.09s.44 2 0 2.59-1.84.35-2.46.8-.79 1.84-1.54 2.09-1.67-.8-2.47-.8-1.75 1-2.47.8-.92-1.64-1.54-2.09-2-.18-2.46-.8.23-1.84 0-2.59-1.54-1.3-1.54-2.09 1.28-1.38 1.52-2.09-.44-2 0-2.59 1.85-.35 2.48-.8.78-1.84 1.53-2.12 1.67.83 2.47.83 1.75-1 2.47-.8.91 1.64 1.53 2.09 2 .18 2.46.8-.23 1.84 0 2.59 1.54 1.3 1.54 2.09z"
        />
      </svg>
      <svg
        aria-hidden="false"
        width="40"
        height="40"
        viewBox="0 0 16 16"
        className="partner__icon"
      >
        <path
          d="M10.5906 6.39993L9.19223 7.29993C8.99246 7.39993 8.89258 7.39993 8.69281 7.29993C8.59293 7.19993 8.39317 7.09993 8.29328 6.99993C7.89375 6.89993 7.5941 6.99993 7.29445 7.19993L6.79504 7.49993L4.29797 9.19993C3.69867 9.49993 2.99949 9.39993 2.69984 8.79993C2.30031 8.29993 2.50008 7.59993 2.99949 7.19993L5.99598 5.19993C6.79504 4.69993 7.79387 4.49993 8.69281 4.69993C9.49188 4.89993 10.0912 5.29993 10.5906 5.89993C10.7904 6.09993 10.6905 6.29993 10.5906 6.39993Z"
          fill="currentColor"
        />
        <path
          d="M13.4871 7.79985C13.4871 8.19985 13.2874 8.59985 12.9877 8.79985L9.89135 10.7999C9.29206 11.1999 8.69276 11.3999 7.99358 11.3999C7.69393 11.3999 7.49417 11.3999 7.19452 11.2999C6.39545 11.0999 5.79616 10.6999 5.29674 10.0999C5.19686 9.89985 5.29674 9.69985 5.39663 9.59985L6.79499 8.69985C6.89487 8.59985 7.09463 8.59985 7.19452 8.69985C7.39428 8.79985 7.59405 8.89985 7.69393 8.99985C8.09346 8.99985 8.39311 8.99985 8.69276 8.79985L9.39194 8.39985L11.3896 6.99985L11.6892 6.79985C12.1887 6.49985 12.9877 6.59985 13.2874 7.09985C13.4871 7.39985 13.4871 7.59985 13.4871 7.79985Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function Servers() {
  return (
    <section className="servers_wrapper mt-10">
      <h1>各大中文伺服器一致好評</h1>
      <div className="servers">
        <Server
          partner
          name="APEX Legends Taiwan"
          src="/img/servers/apex-tw.png"
        />
        <Server name="VALORANT Taiwan" src="/img/servers/valorant-tw.png" />
        <Server name="老查呆呆の迷因調查局總部" src="/img/servers/daidai.png" />
        <Server
          partner
          name="Yeecord Community"
          src="/img/servers/yeecord.png"
        />
        <Server
          name="Empressival Community"
          src="/img/servers/empressival.png"
        />
        <Server
          partner
          name="🌀❰Chengfeng leap❱承風飛躍🌀"
          src="/img/servers/chengfeng.png"
        />
        <Server partner name="{My-IT}程式討論區" src="/img/servers/myit.png" />
        <Server name="Avery Community" src="/img/servers/avery.png" />
      </div>
    </section>
  );
}

function Community() {
  return (
    <>
      <div className="container w-full">
        <h1 className="title">
          我們的
          <strong className="discord">不和諧</strong>
          服務器
        </h1>
      </div>
      <section className="ctaContainer">
        <h1 className="title gradient">友善 包容 月月</h1>
        <h2>
          心動了嗎？
          <br />
          馬上加入我們兩萬人大家庭
        </h2>
        <LinkButton to="https://discord.gg/RKmxpBcTMs">加入服務器</LinkButton>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <Layout
      rawTitle="YEE式機器龍 - 中文 Discord 音樂機器人的最佳選擇"
      description="YEE式機器龍的指令及使用教學，透過簡單的一鍵式指令以及中文介面的音樂功能快速建立好和朋友玩耍的優質空間"
    >
      <header className="header">
        <HomepageHeader />
        <Intro />
      </header>
      <main className="mt-10">
        <HomepageFeatures />
        <Contributors />
        <Community />
      </main>
    </Layout>
  );
}
