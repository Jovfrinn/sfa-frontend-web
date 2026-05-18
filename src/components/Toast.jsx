"use client";
import { useEffect } from "react";

export default function Toast({ message = "Berhasil!", type = "success" }) {
  const bg = {
    success: "bg-success text-white",
    danger: "bg-danger text-white",
    warning: "bg-warning text-dark",
    info: "bg-info text-dark",
  }[type];

  return (
    <div
      className="toast show"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-header">
        <img src="..." className="rounded me-2" alt="..." />
        <strong className="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">Hello, world! This is a toast message.</div>
    </div>
  );
}
