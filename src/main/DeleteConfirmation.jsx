import React from "react";
import "./DeleteConfirmation.css";

const DeleteConfirmation = ({ name, onConfirm, onCancel }) => {
  console.log("name",name)
  return (
    <div className="overlay">
      <div className="modal">
        <p>
          Are you sure you want to delete <b>{name}</b>?
        </p>
        <div className="modal-buttons">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
