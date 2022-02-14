import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./chat.css";
import ClientMsg from "./clientmsg";
import Message from "./message";
import { useNavigate } from "react-router-dom";

let socket;
const Chat = () => {
  const splitSearch = window.location.search.split("?")[1].split("&");
  const username = splitSearch[0].split(`name=`)[1];
  const roomName = splitSearch[1].split(`roomName=`)[1];
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const history = useNavigate();

  let scrollRef = useRef();

  const ENDPOINT = "localhost:8080";
  useEffect(() => {
    if (username == null || roomName == null) {
      alert("Username or RoomName cannot be empty");
      return;
    }

    socket = io(ENDPOINT);
    socket.emit("join", { username, roomName });
    return () => {
      socket.close();
    };
  }, [ENDPOINT, username, roomName]);

  useEffect(() => {
    socket.on("chat-message", (msg) => {
      setMessages([...messages, msg]);
    });
  });

  const onHandleTextChange = (e) => {
    setText(e.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const input = document.getElementById("textbox");
    const data = { username, roomName, text };
    socket.emit("chat-text", data);
    setMessages([...messages, data]);
    input.value = "";
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onLeaveRoom = (e) => {
    e.preventDefault();
    socket.emit("leave", { username, roomName });

    history("/");
  };

  return (
    <section id="chat">
      <div className="chat-outer">
        <div className="chat-name">
          <div className="name">{roomName}</div>
          <div className="leave" onClick={onLeaveRoom}>
            Leave Room
          </div>
        </div>
        <div className="msg-holder">
          {messages.length === 0 ? (
            <span>No messages yet.</span>
          ) : (
            messages.map((m, i) => {
              return m.username === username ? (
                <div ref={scrollRef}>
                  <ClientMsg key={i} username={m.username} text={m.text} />
                </div>
              ) : (
                <div ref={scrollRef}>
                  <Message key={i} username={m.username} text={m.text} />
                </div>
              );
            })
          )}
        </div>
        <div className="text-box">
          <input
            type="text"
            placeholder="Enter Message..."
            onChange={onHandleTextChange}
            id="textbox"
          ></input>
          <div className="send" onClick={sendMessage}>
            Send
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat;
