import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/login/login";
import Home from "./components/home/home";
import Register from "./components/register/register";
import Invite from "./components/invite/invite";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join" element={<Invite />} />
      </Routes>
    </Router>
  );
};

export default App;
