import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import "./login.css";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const history = useNavigate();

  useEffect(() => {
    setErr(null);
    const { code } = queryString.parse(window.location.search);
    switch (code) {
      case "301":
        setErr("Username in this chat already exists");
        break;
      default:
        break;
    }
  }, []);

  const handleChange = (e) => {
    const type = e.target.name;
    switch (type) {
      case "user":
        setUsername(e.target.value);
        break;
      case "room":
        setRoomName(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const onJoinRoom = async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_SOCKET}/api/v1/users/login`,
      {
        username,
        password,
      }
    );
    if (data.userData.status === 200) {
      localStorage.setItem("userId", data.userData.msg._id);
      localStorage.setItem("username", data.userData.msg.username);
      history(`/home`);
    } else {
      setErr(data.user.msg);
    }
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
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </label>
        {/* <label>
          <input
            name="room"
            type="text"
            placeholder="Room Name"
            onChange={handleChange}
            className="br-down"
          />
        </label> */}
        <div className="submit-btn" onClick={onJoinRoom}>
          Login
        </div>
        {err ? (
          <div className="err">
            <p className="err-msg">{err}</p>
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export default Login;
