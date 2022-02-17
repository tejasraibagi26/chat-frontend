import React from "react";
import "../create/create.css";

const InviteForm = ({ handleChange }) => {
  return (
    <div className="form">
      <label>
        <input
          type="text"
          placeholder="Enter Invite Code"
          onChange={handleChange}
          id="input"
        />
      </label>
    </div>
  );
};

export default InviteForm;
