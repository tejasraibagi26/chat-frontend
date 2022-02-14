import React from "react";
import "./message.css";

const Message = ({ username, text }) => {
  const splitUser = username.split("")[0].toUpperCase();
  return (
    <div className="msg" key={Math.random()}>
      <div className="text-bubble">
        <div className="circle">{splitUser}</div>
        <div className="text">{text}</div>
      </div>
    </div>
  );
};

export default Message;
