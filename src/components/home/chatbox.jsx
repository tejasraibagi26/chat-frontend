import React from "react";

const ChatBox = ({ initials, chatName, onClick }) => {
  return (
    <div className="chat-name-box" onClick={onClick}>
      <div className="circle">{initials}</div>
      <div className="chatname">{chatName}</div>
    </div>
  );
};

export default ChatBox;
