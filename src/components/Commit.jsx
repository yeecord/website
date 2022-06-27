import styles from "./Commit.module.css";
import React from "react";

export default function Commit({ name, avatar, content }) {
  return (
    <div className={styles.commit}>
      <img class={styles.icon} src={avatar} alt="User Avatar" />
      <h1>{name}</h1>
      <p>{content}</p>
    </div>
  );
}
