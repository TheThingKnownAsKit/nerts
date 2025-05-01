import React from "react";
import "./Popup.css";

/**
 * popup component that displays an overlay with a box containing a title, message, and dismiss button.
 * properties:
 * title: string displayed as the popup header
 * message: string displayed as the main content of the popup with cause of error
 * onClose: function invoked when the user clicks the "Dismiss" button.
 */
function Popup({ title, message, onClose }) {
  return (
    //semi dimmed background
    <div className="popup-overlay">
      {/* centered popup box */}
      <div className="popup">
        {/* error type */}
        <h2>{title}</h2>
        {/* main message/cause of error */}
        <p>{message}</p>
        {/* dismiss button to close the popup */}
        <button onClick={onClose}>Dismiss</button>
      </div>
    </div>
  );
}

export default Popup;
