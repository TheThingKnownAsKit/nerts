import React from "react";
import "./Popup.css";

function Popup({ title, message, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>Dismiss</button>
      </div>
    </div>
  );
}

export default Popup;
