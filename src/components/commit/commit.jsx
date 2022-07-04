import React from "react";
import "./commit.scss";

export default function Commit({ name, avatar, content }) {
  const component = "commit";

  return (
    <div className={component}>
      <img class={`${component}__icon`} src={avatar} alt="User Avatar" />
      <h1>{name}</h1>
      <p>{content}</p>
    </div>
  );
}
