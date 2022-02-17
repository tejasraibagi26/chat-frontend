import React from "react";
import "./create.css";

const CreateForm = ({ handleChange }) => {
  return (
    <div className="form">
      <label>
        <input
          id="input"
          type="text"
          placeholder="Chat name"
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

export default CreateForm;
