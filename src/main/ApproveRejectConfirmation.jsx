import React from "react";
import "./ApproveRejectConfirmation.css";

const ApproveRejectConfirmation = ({
  title,
  message,
  placeholder,
  reason,
  setReason,
  onSubmit,
  onCancel,
  error,
}) => {
  return (
    <div className="approvereject-overlay">
      <div className="approvereject-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <input
          type="text"
          placeholder={placeholder}
          className="approvereject-input"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        {error && <div className="error-text leave-error">{error}</div>}
        <div className="approvereject-modal-buttons">
          <button onClick={onSubmit}>{title.split(" ")[0]}</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ApproveRejectConfirmation;
