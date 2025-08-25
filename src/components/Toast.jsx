import React from "react";

export default function Toast({ message, type = "info", visible }) {
  if (!visible) return null;

  return (
    <div className="toast toast-top toast-end z-50">
      <div className={`alert alert-${type}`}>
        <span>{message}</span>
      </div>
    </div>
  );
}
