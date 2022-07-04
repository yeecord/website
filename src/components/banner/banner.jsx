import React from "react";
import Commit from "../commit/commit";
import LinkButton from "../LinkButton";
import "./banner.scss";

export default function Banner() {
  const component = "banner";

  return (
    <div className={component}>
      <div className={`${component}__before`} />
      <div className="container min-w-[20rem] flex-1 items-start">
        <h1 className="title">
          <strong className={`${component}__yee`}>YEE</strong>
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
