import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./chat.css";
import ClientMsg from "./clientmsg";
import Message from "./message";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";

let socket;
const Chat = () => {
  const { username, roomId } = queryString.parse(window.location.search);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const history = useNavigate();

  let scrollRef = useRef();

  const ENDPOINT = process.env.REACT_APP_SOCKET;

  useEffect(() => {
    async function fetch() {
      const { data } = await axios.get(
        `${ENDPOINT}/api/v1/chat/messages/${roomId}`
      );

      for (let i = 0; i < data.messages.msg.length; i++) {
        setMessages((prev) => [...prev, data.messages.msg[i]]);
      }
    }

    fetch();
  }, [ENDPOINT, roomId]);

  useEffect(() => {
    if (username == null || roomId == null) {
      alert("Username or RoomName cannot be empty");
      return;
    }

    socket = io(ENDPOINT);
    socket.emit(
      "join",
      {
        username,
        roomId: roomId,
        userId: "620b0439ae26c65fde3adaba",
      },
      (err) => {
        history(`/?err=${err.err}&code=${err.code}`);
      }
    );
    return () => {
      socket.close();
    };
  }, [ENDPOINT, username, roomId, history]);

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
    const data = {
      username,
      roomId: roomId,
      text,
      userId: "620b0439ae26c65fde3adaba",
    };
    socket.emit("chat-text", data);
    setMessages([...messages, data]);
    input.value = "";
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onLeaveRoom = (e) => {
    e.preventDefault();
    socket.emit("leave", { username, roomId });

    history("/");
  };

  return (
    <section id="chat">
      <div className="chat-outer">
        <div className="chat-name">
          <div className="name">{roomId}</div>
          <div className="leave" onClick={onLeaveRoom}>
            Leave Room
          </div>
        </div>
        <div className="msg-holder">
          {messages.length === 0 ? (
            <span className="waiting">Waiting for messages...</span>
          ) : (
            messages.map((m) => {
              return m.username === username ? (
                <div ref={scrollRef} key={m._id}>
                  <ClientMsg username={m.username} text={m.text} />
                </div>
              ) : (
                <div ref={scrollRef} key={m._id}>
                  <Message username={m.username} text={m.text} />
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
