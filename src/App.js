import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import Chat from "./components/chat/chat";
import Login from "./components/login/login";

let socket;

const App = () => {
  const ENDPOINT = "http://localhost:8080";

  const [username, setUsername] = useState("");

  //   useEffect(() => {
  //     if (!username) {
  //       let user = prompt("Enter Username", "");
  //       setUsername(user);
  //     }
  //     socket = io(ENDPOINT);

  //     socket.emit("join", { username, roomName: "Test" });

  //     return () => socket.close();
  //   }, [ENDPOINT, username]);

  //   useEffect(() => {
  //     socket.on("chat-message", (msg) => {
  //       setMessages([...messages, msg]);
  //     });
  //   });

  //   const onChatMessageChange = (e) => {
  //     setText(e.target.value);
  //   };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
    // <section>
    //   {messages.map((m) => {
    //     return (
    //       <div className="msg" key={Math.random()}>
    //         <strong>{m.username}</strong>: {m.text}
    //       </div>
    //     );
    //   })}
    //   <input
    //     type="text"
    //     id="textMsg"
    //     placeholder="Enter text"
    //     onChange={onChatMessageChange}
    //   />
    //   <button type="submit" onClick={onSubmit}>
    //     Send
    //   </button>
    // </section>
  );
};

export default App;
