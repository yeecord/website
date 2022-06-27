import React from "react";
import styles from "./Contributor.module.css";

const contributors = [
  {
    name: "凱恩Kane#5384",
    img: "img/avatars/Kane.png",
    description: "項目創始人",
  },
  {
    name: "Wolf yuan#6173",
    img: "img/avatars/Wolf_Yuan.png",
    description: "貢獻了一堆文檔的大佬",
  },
  /*
  We removed it for safely, please never add it back :P
  {
    name: "月月𝕋𝕤𝕦𝕜𝕚🍭#0820",
    img: "img/avatars/Tsuki.png",
    description: "她絕對不是機器人, 而且唱歌超好聽",
  },
  */
  {
    name: "xiao xigua#5978",
    img: "img/avatars/idk.png",
    description: "QQ我是個會寫程式整天坐在電腦前的死宅QQ",
  },
  {
    name: "MONEY#3897",
    img: "img/avatars/MONEY.png",
    description: "沒有朋友的全棧工程師",
  },
];

function Item({ name, img, description }) {
  return (
    <div className={styles.item}>
      <img src={img} className={styles.avatar} alt={name} />
      <div className="flex-1">
        <h1>{name}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Contributors() {
  return (
    <div className="container items-center">
      <h1 className="gradient title">貢獻者</h1>
      <div className={styles.wrapper}>
        {contributors.map((item) => Item(item))}
        <h2>以及其餘數百位支持此項目的小幫手及亁爹</h2>
      </div>
    </div>
  );
}
