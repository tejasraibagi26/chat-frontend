import React, { useEffect, useState } from "react";
import "./invite.css";
import axios from "axios";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";

const Invite = () => {
  const [inviterName, setInviterName] = useState(null);
  const [chatName, setChatName] = useState(null);
  const [err, setErr] = useState(null);
  const history = useNavigate();
  useEffect(() => {
    const { id, invite } = queryString.parse(window.location.search);

    axios
      .get(
        `${process.env.REACT_APP_SOCKET}/api/v1/chat/invite?id=${id}&invite=${invite}`
      )
      .then((res) => {
        setInviterName(res.data.msg.data.username);
        setChatName(res.data.msg.chatData.msg.roomName);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const joinInvite = async (e) => {
    e.preventDefault();
    if (
      localStorage.getItem("userId") ===
      queryString.parse(window.location.search).id
    ) {
      return setErr("You are already in the chat room");
    }
    const postData = {
      userId: localStorage.getItem("userId"),
      inviteCode: queryString.parse(window.location.search).invite,
    };

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_SOCKET}/api/v1/chat/join`,
        postData
      );

      if (data.create.status === 200) {
        history("/chat");
      }
    } catch (error) {
      setErr(error.response.data.error.msg);
    }
  };
  return (
    <section id="invite">
      <div className="container">
        <div className="invite-details">
          <h2 className="chatname">{chatName}</h2>
          <p className="invite-text">
            {inviterName} invited you to join the chat!
          </p>
          <div className="join-btn" onClick={joinInvite}>
            Join Invite
          </div>
          {err ? <div className="err">{err}</div> : ""}
        </div>
      </div>
    </section>
  );
};

export default Invite;
