import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [err, setErr] = useState(null);
  const history = useNavigate();

  const handleChange = (e) => {
    const type = e.target.name;
    switch (type) {
      case "user":
        setUsername(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "repeat-password":
        setConfPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !confPassword)
      return setErr("Please add a required values");

    if (password !== confPassword) return setErr("Password do not match");
    const body = {
      username,
      password,
      confPassword,
    };
    const { data } = await axios.post(
      `${process.env.REACT_APP_SOCKET}/api/v1/users/register`,
      body
    );
    console.log(data);
    if (data.register.status === 200) {
      history("/");
    } else setErr(data.register.msg);
  };
  return (
    <section id="register">
      <div className="container">
        <h1 className="title">Register to Chat</h1>
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
        <label>
          <input
            name="repeat-password"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
          />
        </label>
        <div className="submit-btn" onClick={onRegister}>
          Register
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

export default Register;
