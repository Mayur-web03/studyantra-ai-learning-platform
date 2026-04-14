import React, { useState, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

interface Event {
  date: string;
  topic: string;
}

const CalendarPanel: React.FC = () => {
  const [date, setDate] = useState("");
  const [topic, setTopic] = useState("");
  const [events, setEvents] = useState<Event[]>(
    JSON.parse(localStorage.getItem("calendar_events") || "[]")
  );

  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // 📅 Format date → dd-mm-yyyy
  const formatDate = (date: string) => {
    const [y, m, d] = date.split("-");
    return `${d}-${m}-${y}`;
  };

  // ➕ Add event
  const addEvent = () => {
    if (!date || !topic) {
      showNotification("⚠️ Please fill all fields", "error");
      return;
    }

    const newEvents = [...events, { date, topic }];
    setEvents(newEvents);
    localStorage.setItem("calendar_events", JSON.stringify(newEvents));

    setDate("");
    setTopic("");

    showNotification("✅ Event added successfully", "success");
  };

  // ❌ Delete event
  const deleteEvent = (index: number) => {
    const updated = events.filter((_, i) => i !== index);
    setEvents(updated);
    localStorage.setItem("calendar_events", JSON.stringify(updated));

    showNotification("🗑️ Event deleted", "info");
  };

  // 📅 Today's date
  const today = new Date().toISOString().split("T")[0];

  // 📊 Sort events
  const sortedEvents = [...events].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const todayEvent = sortedEvents.find((e) => e.date === today);

  // 🚀 Activate schedule
  const activateSchedule = () => {
    localStorage.setItem("schedule_active", "true");
    showNotification("🚀 Weekly schedule activated!", "success");
  };

  // 🔔 Student auto notify
  useEffect(() => {
    const role = localStorage.getItem("role");
    const active = localStorage.getItem("schedule_active");

    if (role !== "student" || active !== "true") return;

    const todayKey = "calendar_notified_" + today;

    if (todayEvent && !localStorage.getItem(todayKey)) {
      showNotification(`📅 Today: ${todayEvent.topic}`, "info");
      localStorage.setItem(todayKey, "true");
    }
  }, []);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "24px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "24px" }}>📅 Weekly Planner</h2>

        {/* 🔥 LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Logout
        </button>
      </div>

      {/* 🔥 TODAY */}
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          padding: "16px",
          borderRadius: "12px",
          background: todayEvent ? "#DCFCE7" : "#F4F6F8",
          border: "1px solid #E1E8ED",
        }}
      >
        <h3 style={{ marginBottom: "8px" }}>🔥 Today</h3>

        {todayEvent ? (
          <div
            style={{
              fontWeight: "600",
              fontSize: "16px",
              color: "#166534",
            }}
          >
            📚 {todayEvent.topic}
          </div>
        ) : (
          <div style={{ color: "#6B7C93" }}>
            No topic scheduled today
          </div>
        )}
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        />

        <input
          type="text"
          placeholder="Enter topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={addEvent}
          style={{
            background: "#3A7CA5",
            color: "#fff",
            padding: "10px 16px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Add
        </button>
      </div>

      {/* EVENTS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {sortedEvents.map((e, i) => (
          <div
            key={i}
            style={{
              padding: "12px",
              borderRadius: "10px",
              background: e.date === today ? "#DBEAFE" : "#F4F6F8",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: "600" }}>{e.topic}</div>
              <div style={{ fontSize: "13px", color: "#666" }}>
                {formatDate(e.date)}
              </div>
            </div>

            <button
              onClick={() => deleteEvent(i)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "none",
                background: "#fee2e2",
                color: "#b91c1c",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ACTIVATE */}
      <button
        onClick={activateSchedule}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "12px",
          background: "#22c55e",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >
        🚀 Activate Weekly Schedule
      </button>
    </div>
  );
};

export default CalendarPanel;