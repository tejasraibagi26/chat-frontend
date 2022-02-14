import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState();
  const history = useNavigate();

  const handleChange = (e) => {
    const type = e.target.name;
    switch (type) {
      case "user":
        setUsername(e.target.value);
        break;
      case "room":
        setRoomName(e.target.value);
        break;
      default:
        break;
    }
  };

  const onJoinRoom = () => {
    history(`/chat?name=${username}&roomName=${roomName}`);
  };

  return (
    <section id="login">
      <div className="container">
        <h1 className="title">Login to Chat</h1>
        <label>
          <input
            name="user"
            type="text"
            placeholder="Username"
            onChange={handleChange}
            className="br-top"
          />
        </label>
        <label>
          <input
            name="room"
            type="text"
            placeholder="Room Name"
            onChange={handleChange}
            className="br-down"
          />
        </label>
        <div className="submit-btn" onClick={onJoinRoom}>
          Join Room
        </div>
      </div>
    </section>
  );
};

export default Login;
