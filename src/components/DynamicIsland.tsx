import React, { useState, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import "./DynamicIsland.css";

const DynamicIsland: React.FC = () => {
  const { notifications } = useNotification();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notif_history") || "[]");
    setHistory(saved);
  }, [notifications]);

  return (
    <>
      {/* 🔔 Bell */}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            position: "relative",
            width: 45,
            height: 45,
            borderRadius: "50%",
            background: "#fff",
            border: "1px solid #ddd"
          }}
        >
          🔔

          {history.length > 0 && (
            <span style={{
              position: "absolute",
              top: -5,
              right: -5,
              background: "red",
              color: "#fff",
              borderRadius: "50%",
              fontSize: 10,
              padding: "3px 6px"
            }}>
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "fixed",
          top: 70,
          right: 20,
          width: 300,
          background: "#fff",
          padding: 10,
          borderRadius: 10
        }}>
          <h4>Notifications</h4>

          {history.length === 0 ? (
            <p>No notifications</p>
          ) : (
            history.map((n) => (
              <div key={n.id}>{n.message}</div>
            ))
          )}
        </div>
      )}

      {/* Floating */}
      <div className="island-container">
        {notifications.map((n) => (
          <div key={n.id} className="island">
            {n.message}
          </div>
        ))}
      </div>
    </>
  );
};

export default DynamicIsland;