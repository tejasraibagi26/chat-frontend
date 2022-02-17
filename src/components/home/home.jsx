import React, { useEffect, useState, useRef } from "react";
import ChatBox from "./chatbox";
import "./home.css";
import axios from "axios";
import ClientMsg from "../chat/clientmsg";
import Message from "../chat/message";
import io from "socket.io-client";
import AddSVG from "../../media/add.svg";
import CreateForm from "./create/create";
import InviteForm from "./invite/invite";
import Snackbar from "./snackbar/snackbar";

let socket;
const Home = () => {
  const [userChats, setUserChats] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [text, setText] = useState("");
  const [createText, setcreateText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [formToLoad, setFormToLoad] = useState(0);
  const [invite, setInvite] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  let scrollRef = useRef();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setUserId(localStorage.getItem("userId"));

    getChatrooms();
  }, []);

  async function getChatrooms() {
    setUserChats([]);
    const { data } = await axios.get(
      `${
        process.env.REACT_APP_SOCKET
      }/api/v1/users/chatroom?userId=${localStorage.getItem("userId")}`
    );

    const rooms = data.rooms.msg.chatrooms;
    for (let i = 0; i < rooms.length; i++) {
      setUserChats((prev) => [...prev, rooms[i]]);
    }
  }

  const onActiveChat = async (e) => {
    setMessages([]);
    const active = document.getElementsByClassName("active");
    if (active.length !== 0) active[0].classList.remove("active");
    e.target.classList.toggle("active");

    const id = e.target.parentNode.getAttribute("name");
    const inviteCode = e.target.parentNode.dataset.invite;
    setInvite(inviteCode);
    setRoomName(e.target.childNodes[1].innerText);
    setRoomId(inviteCode);
    const { data } = await axios.get(
      `${process.env.REACT_APP_SOCKET}/api/v1/chat/messages/${id}`
    );

    for (let i = 0; i < data.messages.msg.length; i++) {
      setMessages((prev) => [...prev, data.messages.msg[i]]);
    }
  };

  useEffect(() => {
    if (roomId !== "") {
      socket = io(process.env.REACT_APP_SOCKET);
      console.log(userId, username, roomId);
      socket.emit("join", { username, roomId, userId }, (err) => {
        console.log(err);
      });
    }
  }, [roomId, userId, username]);

  useEffect(() => {
    if (roomId !== "") {
      socket.on("chat-message", (msg) => {
        setMessages([...messages, msg]);
      });
    }
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
      userId,
    };

    console.log(data);

    socket.emit("chat-text", data, (err) => {
      console.log(err);
    });
    setMessages([...messages, data]);
    input.value = "";
    input.focus();
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onEnter = (e) => {
    if (e.keyCode === 13) {
      sendMessage(e);
    }
  };

  const openChatAddModal = (e) => {
    setOpenModal((prevState) => !prevState);
    const bgContainer = document.getElementById("blur-container");
    if (!openModal) bgContainer.classList.add("blur");
    else bgContainer.classList.remove("blur");
  };

  const setActiveTag = (e) => {
    const findActiveTag = document.getElementsByClassName("active");

    findActiveTag[0].classList.remove("active");
    e.target.classList.toggle("active");

    const formState = e.target.getAttribute("name");

    switch (formState) {
      case "0":
        setFormToLoad(0);
        break;
      case "1":
        setFormToLoad(1);
        break;
      default:
        break;
    }
  };

  const handleText = (e) => {
    const inputField = document.getElementById("input");
    inputField.classList.remove("err-border");
    setcreateText(e.target.value);
  };

  const sendDate = async (e) => {
    e.preventDefault();
    if (createText === "") {
      const inputField = document.getElementById("input");
      inputField.classList.add("err-border");

      return;
    }
    if (formToLoad === 0) {
      let obj = {
        chatName: createText,
        createdBy: localStorage.getItem("userId"),
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_SOCKET}/api/v1/chat/create`,
        obj
      );
      if (data.create.status === 200) {
        openChatAddModal(e);
        getChatrooms();
      }
    } else {
      let obj = {
        userId: localStorage.getItem("userId"),
        inviteCode: Number(createText),
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_SOCKET}/api/v1/chat/join`,
        obj
      );

      if (data.create.status === 200) {
        openChatAddModal(e);
        getChatrooms();
      }
    }
  };

  const copyInviteLink = (e) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    navigator.clipboard.writeText(
      `${BASE_URL}/join?invite=${invite}&id=${userId}`
    );

    console.log("copied");

    snackbar(e);
  };

  const snackbar = (e) => {
    e.preventDefault();
    console.log("snackbar");
    setShowSnackbar((prev) => !prev);
    setTimeout(() => {
      setShowSnackbar((prev) => !prev);
    }, 2000);
  };
  return (
    <section id="home">
      {showSnackbar ? <Snackbar /> : ""}
      {openModal ? (
        <div className="addChatModal">
          <div className="close" onClick={openChatAddModal}>
            X
          </div>
          <div className="top">
            <h1>Join or Create Chat</h1>
          </div>
          <div className="tags">
            <div className="tag active" onClick={setActiveTag} name="0">
              Create
            </div>
            <div className="tag" onClick={setActiveTag} name="1">
              Join
            </div>
          </div>
          <div className="formHolder">
            {formToLoad === 0 ? (
              <CreateForm handleChange={handleText} />
            ) : (
              <InviteForm handleChange={handleText} />
            )}
            <div className="submit" onClick={sendDate}>
              {formToLoad === 0 ? "Create" : "Join"}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="container" id="blur-container">
        <div className="chat-name-container">
          <div className="header">
            <h1 className="heading">Chats</h1>
            <div className="addChat" onClick={openChatAddModal}>
              <img src={AddSVG} alt="add" />
            </div>
          </div>
          {userChats.map((chats) => {
            return (
              <span
                key={chats.roomId}
                name={chats.roomId}
                data-invite={chats.inviteCode}
                className="activeSpan"
              >
                <ChatBox
                  initials={chats.roomName.split("")[0]}
                  chatName={chats.roomName}
                  onClick={onActiveChat}
                />
              </span>
            );
          })}
        </div>
        <div className="chat-screen">
          {roomId ? (
            <div className="outer">
              <div className="topbar">
                <div className="roomName">{roomName} </div>
                <div className="inviteCode">
                  Invite Code: {invite}
                  <div className="copy" onClick={copyInviteLink}>
                    <img
                      src="https://img.icons8.com/material-rounded/24/000000/copy.png"
                      alt="Copy Invite link"
                    />{" "}
                  </div>
                </div>
              </div>
              <div className="message-container">
                {messages.length > 0
                  ? messages.map((m, i) => {
                      return m.username === username ? (
                        <div key={i} ref={scrollRef}>
                          <ClientMsg username={m.username} text={m.text} />
                        </div>
                      ) : (
                        <div key={i}>
                          <Message username={m.username} text={m.text} />
                        </div>
                      );
                    })
                  : ""}
              </div>
              <div className="textbox">
                <input
                  id="textbox"
                  type="text"
                  name="text"
                  placeholder="Enter Message..."
                  onChange={onHandleTextChange}
                  onKeyDown={onEnter}
                />
                <div className="submit" onClick={sendMessage}>
                  Send
                </div>
              </div>
            </div>
          ) : (
            <div className="center">Click on chat to text!</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
